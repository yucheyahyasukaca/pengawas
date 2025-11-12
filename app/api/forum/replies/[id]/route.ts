import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPengawasUser, getAdminUser } from "@/lib/auth-utils";

// PUT /api/forum/replies/[id] - Update reply
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
    const replyId = resolvedParams.id;

    if (!replyId) {
      return NextResponse.json(
        { error: "Reply ID wajib diisi" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content } = body;

    // Validate content (strip HTML tags for length check)
    const contentPlainText = content?.replace(/<[^>]*>/g, "").trim() || "";
    if (!content || contentPlainText.length < 3) {
      return NextResponse.json(
        { error: "Content minimal 3 karakter" },
        { status: 400 }
      );
    }

    const adminClient = createSupabaseAdminClient();

    // Check if reply exists and user has permission
    const { data: existingReply, error: checkError } = await adminClient
      .from("forum_replies")
      .select("author_id, is_deleted")
      .eq("id", replyId)
      .single();

    if (checkError || !existingReply) {
      return NextResponse.json(
        { error: "Reply tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingReply.is_deleted) {
      return NextResponse.json(
        { error: "Reply sudah dihapus" },
        { status: 400 }
      );
    }

    // Check permission: author or admin
    const isAuthor = existingReply.author_id === pengawasUser?.id;
    const isAdmin = !!adminUser;

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Anda tidak memiliki izin untuk mengedit reply ini" },
        { status: 403 }
      );
    }

    // Update reply (don't trim HTML content)
    const updateData: any = {
      content: content, // Keep HTML as-is
      updated_at: new Date().toISOString(),
      edited_at: new Date().toISOString(),
    };

    if (isAdmin && !isAuthor) {
      updateData.edited_by = adminUser!.id;
    } else {
      // If not admin, must be author, so pengawasUser must exist
      if (!pengawasUser) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      updateData.edited_by = pengawasUser.id;
    }

    const { data: updatedReply, error: updateError } = await adminClient
      .from("forum_replies")
      .update(updateData)
      .eq("id", replyId)
      .select(`
        id,
        content,
        author_id,
        created_at,
        updated_at,
        edited_at,
        edited_by
      `)
      .single();

    if (updateError) {
      console.error("Error updating reply:", updateError);
      return NextResponse.json(
        { error: updateError.message || "Gagal mengupdate reply" },
        { status: 400 }
      );
    }

    // Fetch author data separately
    const { data: authorData } = await adminClient
      .from("users")
      .select("id, nama, email")
      .eq("id", updatedReply.author_id)
      .single();

    const updatedReplyWithAuthor = {
      ...updatedReply,
      author: authorData || { id: updatedReply.author_id, nama: null, email: "Unknown" },
    };

    return NextResponse.json(
      {
        success: true,
        data: updatedReplyWithAuthor,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in PUT /api/forum/replies/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/forum/replies/[id] - Delete reply (soft delete)
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
    const replyId = resolvedParams.id;

    if (!replyId) {
      return NextResponse.json(
        { error: "Reply ID wajib diisi" },
        { status: 400 }
      );
    }

    const adminClient = createSupabaseAdminClient();

    // Check if reply exists and user has permission
    const { data: existingReply, error: checkError } = await adminClient
      .from("forum_replies")
      .select("author_id, is_deleted")
      .eq("id", replyId)
      .single();

    if (checkError || !existingReply) {
      return NextResponse.json(
        { error: "Reply tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingReply.is_deleted) {
      return NextResponse.json(
        { error: "Reply sudah dihapus" },
        { status: 400 }
      );
    }

    // Check permission: author or admin
    const isAuthor = existingReply.author_id === pengawasUser?.id;
    const isAdmin = !!adminUser;

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Anda tidak memiliki izin untuk menghapus reply ini" },
        { status: 403 }
      );
    }

    // Soft delete reply
    const deleteData: any = {
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    };

    if (isAdmin) {
      deleteData.deleted_by = adminUser!.id;
    } else {
      // If not admin, must be author, so pengawasUser must exist
      if (!pengawasUser) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      deleteData.deleted_by = pengawasUser.id;
    }

    const { error: deleteError } = await adminClient
      .from("forum_replies")
      .update(deleteData)
      .eq("id", replyId);

    if (deleteError) {
      console.error("Error deleting reply:", deleteError);
      return NextResponse.json(
        { error: deleteError.message || "Gagal menghapus reply" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Reply berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in DELETE /api/forum/replies/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

