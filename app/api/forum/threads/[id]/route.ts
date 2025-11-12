import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPengawasUser, getAdminUser } from "@/lib/auth-utils";

// GET /api/forum/threads/[id] - Get thread detail with replies
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const pengawasUser = await getPengawasUser();
    
    if (!pengawasUser) {
      return NextResponse.json(
        { error: "Unauthorized: Pengawas access required" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const threadId = resolvedParams.id;

    if (!threadId) {
      return NextResponse.json(
        { error: "Topik ID wajib diisi" },
        { status: 400 }
      );
    }

    const adminClient = createSupabaseAdminClient();

    // Get thread
    const { data: thread, error: threadError } = await adminClient
      .from("forum_threads")
      .select(`
        id,
        title,
        content,
        author_id,
        created_at,
        updated_at,
        edited_at,
        edited_by,
        reply_count,
        last_reply_at,
        last_reply_by
      `)
      .eq("id", threadId)
      .eq("is_deleted", false)
      .single();

    if (threadError) {
      if (threadError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Topik tidak ditemukan" },
          { status: 404 }
        );
      }
      console.error("Error fetching thread:", threadError);
      return NextResponse.json(
        { error: threadError.message || "Gagal memuat topik" },
        { status: 400 }
      );
    }

    // Fetch author and edited_by_user data separately
    const { data: authorData } = await adminClient
      .from("users")
      .select("id, nama, email")
      .eq("id", thread.author_id)
      .single();

    let editedByUserData = null;
    if (thread.edited_by) {
      const { data: editedByData } = await adminClient
        .from("users")
        .select("id, nama, email")
        .eq("id", thread.edited_by)
        .single();
      editedByUserData = editedByData;
    }

    // Get replies
    const { data: replies, error: repliesError } = await adminClient
      .from("forum_replies")
      .select(`
        id,
        content,
        author_id,
        created_at,
        updated_at,
        edited_at,
        edited_by
      `)
      .eq("thread_id", threadId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });

    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
      // Don't fail, just return empty replies
    }

    // Fetch author and edited_by_user data for each reply separately
    const repliesWithAuthors = await Promise.all(
      (replies || []).map(async (reply: any) => {
        const { data: replyAuthorData } = await adminClient
          .from("users")
          .select("id, nama, email")
          .eq("id", reply.author_id)
          .single();

        let replyEditedByUserData = null;
        if (reply.edited_by) {
          const { data: replyEditedByData } = await adminClient
            .from("users")
            .select("id, nama, email")
            .eq("id", reply.edited_by)
            .single();
          replyEditedByUserData = replyEditedByData;
        }

        return {
          ...reply,
          author: replyAuthorData || { id: reply.author_id, nama: null, email: "Unknown" },
          edited_by_user: replyEditedByUserData,
        };
      })
    );

    // Get attachments for thread
    const { data: threadAttachments } = await adminClient
      .from("forum_attachments")
      .select("*")
      .eq("thread_id", threadId)
      .is("reply_id", null);

    // Get attachments for replies
    const replyIds = repliesWithAuthors?.map((r: any) => r.id) || [];
    const { data: replyAttachments } = replyIds.length > 0
      ? await adminClient
          .from("forum_attachments")
          .select("*")
          .in("reply_id", replyIds)
      : { data: [] };

    // Attach attachments to replies
    const repliesWithAttachments = repliesWithAuthors?.map((reply: any) => ({
      ...reply,
      attachments: replyAttachments?.filter((att: any) => att.reply_id === reply.id) || [],
    })) || [];

    return NextResponse.json(
      {
        success: true,
        data: {
          ...thread,
          author: authorData || { id: thread.author_id, nama: null, email: "Unknown" },
          edited_by_user: editedByUserData,
          attachments: threadAttachments || [],
          replies: repliesWithAttachments,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET /api/forum/threads/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/forum/threads/[id] - Update thread
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const pengawasUser = await getPengawasUser();
    const adminUser = await getAdminUser();
    
    if (!pengawasUser && !adminUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const threadId = resolvedParams.id;

    if (!threadId) {
      return NextResponse.json(
        { error: "Topik ID wajib diisi" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title dan content wajib diisi" },
        { status: 400 }
      );
    }

    const adminClient = createSupabaseAdminClient();

    // Check if thread exists and user has permission
    const { data: existingThread, error: checkError } = await adminClient
      .from("forum_threads")
      .select("author_id, is_deleted")
      .eq("id", threadId)
      .single();

    if (checkError || !existingThread) {
      return NextResponse.json(
        { error: "Thread tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingThread.is_deleted) {
      return NextResponse.json(
        { error: "Topik sudah dihapus" },
        { status: 400 }
      );
    }

    // Check permission: author or admin
    const isAuthor = existingThread.author_id === pengawasUser?.id;
    const isAdmin = !!adminUser;

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Anda tidak memiliki izin untuk mengedit topik ini" },
        { status: 403 }
      );
    }

    // Validate content (strip HTML tags for length check)
    const contentPlainText = content.replace(/<[^>]*>/g, "").trim();
    if (contentPlainText.length < 10) {
      return NextResponse.json(
        { error: "Content minimal 10 karakter" },
        { status: 400 }
      );
    }

    // Update thread (don't trim HTML content, only title)
    const updateData: any = {
      title: title.trim(),
      content: content, // Keep HTML as-is
      updated_at: new Date().toISOString(),
    };

    if (isAdmin && !isAuthor) {
      // Admin editing someone else's thread
      updateData.edited_at = new Date().toISOString();
      updateData.edited_by = adminUser.id;
    } else {
      // Author editing their own thread
      updateData.edited_at = new Date().toISOString();
      updateData.edited_by = pengawasUser.id;
    }

    const { data: updatedThread, error: updateError } = await adminClient
      .from("forum_threads")
      .update(updateData)
      .eq("id", threadId)
      .select(`
        id,
        title,
        content,
        author_id,
        created_at,
        updated_at,
        edited_at,
        edited_by
      `)
      .single();

    if (updateError) {
      console.error("Error updating thread:", updateError);
      return NextResponse.json(
        { error: updateError.message || "Gagal mengupdate topik" },
        { status: 400 }
      );
    }

    // Fetch author data separately
    const { data: authorData } = await adminClient
      .from("users")
      .select("id, nama, email")
      .eq("id", updatedThread.author_id)
      .single();

    const updatedThreadWithAuthor = {
      ...updatedThread,
      author: authorData || { id: updatedThread.author_id, nama: null, email: "Unknown" },
    };

    return NextResponse.json(
      {
        success: true,
        data: updatedThreadWithAuthor,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in PUT /api/forum/threads/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/threads/[id] - Delete thread (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const pengawasUser = await getPengawasUser();
    const adminUser = await getAdminUser();
    
    if (!pengawasUser && !adminUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const threadId = resolvedParams.id;

    if (!threadId) {
      return NextResponse.json(
        { error: "Topik ID wajib diisi" },
        { status: 400 }
      );
    }

    const adminClient = createSupabaseAdminClient();

    // Check if thread exists and user has permission
    const { data: existingThread, error: checkError } = await adminClient
      .from("forum_threads")
      .select("author_id, is_deleted")
      .eq("id", threadId)
      .single();

    if (checkError || !existingThread) {
      return NextResponse.json(
        { error: "Thread tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingThread.is_deleted) {
      return NextResponse.json(
        { error: "Topik sudah dihapus" },
        { status: 400 }
      );
    }

    // Check permission: author or admin
    const isAuthor = existingThread.author_id === pengawasUser?.id;
    const isAdmin = !!adminUser;

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Anda tidak memiliki izin untuk menghapus topik ini" },
        { status: 403 }
      );
    }

    // Soft delete thread
    const deleteData: any = {
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    };

    if (isAdmin) {
      deleteData.deleted_by = adminUser.id;
    } else {
      deleteData.deleted_by = pengawasUser.id;
    }

    const { error: deleteError } = await adminClient
      .from("forum_threads")
      .update(deleteData)
      .eq("id", threadId);

    if (deleteError) {
      console.error("Error deleting thread:", deleteError);
      return NextResponse.json(
        { error: deleteError.message || "Gagal menghapus topik" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Topik berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in DELETE /api/forum/threads/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

