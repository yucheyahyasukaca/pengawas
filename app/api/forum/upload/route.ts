import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPengawasUser } from "@/lib/auth-utils";

// POST /api/forum/upload - Upload image for forum
export async function POST(request: Request) {
  try {
    const pengawasUser = await getPengawasUser();
    
    if (!pengawasUser) {
      return NextResponse.json(
        { error: "Unauthorized: Pengawas access required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validate file type (only images)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File harus berupa gambar (JPEG, PNG, GIF, atau WebP)" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    const adminClient = createSupabaseAdminClient();

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `forum/${pengawasUser.id}/${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from("forum-attachments")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      
      // Check if bucket doesn't exist
      if (uploadError.message?.includes("Bucket not found") || uploadError.message?.includes("The resource was not found")) {
        return NextResponse.json(
          { 
            error: "Storage bucket belum dibuat. Silakan buat bucket 'forum-attachments' di Supabase Dashboard → Storage.",
            code: "BUCKET_NOT_FOUND",
            instructions: "Buka Supabase Dashboard → Storage → New bucket → Name: 'forum-attachments' → Public: YES → Create bucket"
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: uploadError.message || "Gagal mengupload file" },
        { status: 400 }
      );
    }

    // Get public URL
    const { data: urlData } = adminClient.storage
      .from("forum-attachments")
      .getPublicUrl(filePath);

    return NextResponse.json(
      {
        success: true,
        data: {
          url: urlData.publicUrl,
          name: file.name,
          size: file.size,
          type: file.type,
          path: filePath,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in POST /api/forum/upload:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

