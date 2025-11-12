import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPengawasUser, getAdminUser } from "@/lib/auth-utils";

// GET /api/forum/threads - List all threads
export async function GET(request: Request) {
  try {
    const pengawasUser = await getPengawasUser();
    
    if (!pengawasUser) {
      return NextResponse.json(
        { error: "Unauthorized: Pengawas access required" },
        { status: 401 }
      );
    }

    const adminClient = createSupabaseAdminClient();
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sort") || "reply_count"; // reply_count, last_reply_at, created_at
    const order = searchParams.get("order") || "desc"; // asc, desc
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const { count } = await adminClient
      .from("forum_threads")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false);

    // Build query - simplified to avoid foreign key issues
    let query = adminClient
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
      .eq("is_deleted", false);

    // Apply sorting
    if (sortBy === "reply_count") {
      query = query.order("reply_count", { ascending: order === "asc" });
    } else if (sortBy === "created_at") {
      query = query.order("created_at", { ascending: order === "asc" });
    } else {
      // last_reply_at
      query = query.order("last_reply_at", {
        ascending: order === "asc",
        nullsFirst: false,
      });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: threadsData, error: threadsError } = await query;

    if (threadsError) {
      console.error("Error fetching threads:", threadsError);
      
      // Check if table doesn't exist
      if (threadsError.code === "42P01" || threadsError.message?.includes("does not exist")) {
        return NextResponse.json(
          { 
            error: "Tabel forum belum dibuat. Silakan jalankan migration database terlebih dahulu.",
            code: "TABLE_NOT_FOUND"
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          error: threadsError.message || "Gagal memuat topik",
          code: threadsError.code,
          details: threadsError
        },
        { status: 400 }
      );
    }

    // Fetch author and last_reply_author data separately
    const threadsWithAuthors = await Promise.all(
      (threadsData || []).map(async (thread: any) => {
        // Get author
        const { data: authorData } = await adminClient
          .from("users")
          .select("id, nama, email")
          .eq("id", thread.author_id)
          .single();

        // Get last reply author if exists
        let lastReplyAuthorData = null;
        if (thread.last_reply_by) {
          const { data: lastReplyAuthor } = await adminClient
            .from("users")
            .select("id, nama, email")
            .eq("id", thread.last_reply_by)
            .single();
          lastReplyAuthorData = lastReplyAuthor;
        }

        return {
          ...thread,
          author: authorData || { id: thread.author_id, nama: null, email: "Unknown" },
          last_reply_author: lastReplyAuthorData,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: threadsWithAuthors || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET /api/forum/threads:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/forum/threads - Create new thread
export async function POST(request: Request) {
  try {
    const pengawasUser = await getPengawasUser();
    
    if (!pengawasUser) {
      return NextResponse.json(
        { error: "Unauthorized: Pengawas access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, attachments } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title dan content wajib diisi" },
        { status: 400 }
      );
    }

    if (title.trim().length < 3) {
      return NextResponse.json(
        { error: "Title minimal 3 karakter" },
        { status: 400 }
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

    const adminClient = createSupabaseAdminClient();

    // Create thread (don't trim HTML content, only title)
    const { data: thread, error: threadError } = await adminClient
      .from("forum_threads")
      .insert({
        title: title.trim(),
        content: content, // Keep HTML as-is
        author_id: pengawasUser.id,
      })
      .select(`
        id,
        title,
        content,
        author_id,
        created_at,
        updated_at,
        reply_count
      `)
      .single();

    if (threadError) {
      console.error("Error creating thread:", threadError);
      return NextResponse.json(
        { error: threadError.message || "Gagal membuat topik" },
        { status: 400 }
      );
    }

    // Fetch author data separately
    const { data: authorData } = await adminClient
      .from("users")
      .select("id, nama, email")
      .eq("id", thread.author_id)
      .single();

    const threadWithAuthor = {
      ...thread,
      author: authorData || { id: thread.author_id, nama: null, email: "Unknown" },
    };

    // Insert attachments if provided
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      const attachmentData = attachments.map((att: any) => ({
        thread_id: thread.id,
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
        data: threadWithAuthor,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in POST /api/forum/threads:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

