import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPengawasUser } from "@/lib/auth-utils";

// POST /api/forum/threads/[id]/replies - Create reply
export async function POST(
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

    const body = await request.json();
    const { content, attachments } = body;

    // Validate content (strip HTML tags for length check)
    const contentPlainText = content?.replace(/<[^>]*>/g, "").trim() || "";
    if (!content || contentPlainText.length < 3) {
      return NextResponse.json(
        { error: "Content minimal 3 karakter" },
        { status: 400 }
      );
    }

    const adminClient = createSupabaseAdminClient();

    // Check if thread exists
    const { data: thread, error: threadCheckError } = await adminClient
      .from("forum_threads")
      .select("id, is_deleted")
      .eq("id", threadId)
      .single();

    if (threadCheckError || !thread) {
      return NextResponse.json(
        { error: "Topik tidak ditemukan" },
        { status: 404 }
      );
    }

    if (thread.is_deleted) {
      return NextResponse.json(
        { error: "Topik sudah dihapus" },
        { status: 400 }
      );
    }

    // Create reply (don't trim HTML content)
    const { data: reply, error: replyError } = await adminClient
      .from("forum_replies")
      .insert({
        thread_id: threadId,
        content: content, // Keep HTML as-is
        author_id: pengawasUser.id,
      })
      .select(`
        id,
        content,
        author_id,
        created_at,
        updated_at
      `)
      .single();

    if (replyError) {
      console.error("Error creating reply:", replyError);
      return NextResponse.json(
        { error: replyError.message || "Gagal membuat reply" },
        { status: 400 }
      );
    }

    // Fetch author data separately
    const { data: authorData } = await adminClient
      .from("users")
      .select("id, nama, email")
      .eq("id", reply.author_id)
      .single();

    const replyWithAuthor = {
      ...reply,
      author: authorData || { id: reply.author_id, nama: null, email: "Unknown" },
    };

    // Insert attachments if provided
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      const attachmentData = attachments.map((att: any) => ({
        reply_id: reply.id,
        file_url: att.url,
        file_name: att.name,
        file_size: att.size,
        file_type: att.type,
        uploaded_by: pengawasUser.id,
      }));

      const { error: attachmentError } = await adminClient
        .from("forum_attachments")
        .insert(attachmentData);

      if (attachmentError) {
        console.error("Error inserting attachments:", attachmentError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: replyWithAuthor,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in POST /api/forum/threads/[id]/replies:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

