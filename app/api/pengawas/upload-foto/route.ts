import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getPengawasUser } from "@/lib/auth-utils";

// POST - Upload foto profil pengawas
export async function POST(request: Request) {
  try {
    // Check pengawas authentication
    const pengawasUser = await getPengawasUser();
    if (!pengawasUser) {
      return NextResponse.json(
        { error: "Unauthorized: Pengawas access required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Gunakan JPG, PNG, atau WEBP" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar. Maksimal 5MB" },
        { status: 400 }
      );
    }

    // Create Supabase clients
    // Use admin client for storage operations to bypass RLS
    const adminClient = createSupabaseAdminClient();

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${pengawasUser.id}-${Date.now()}.${fileExt}`;
    const filePath = `pengawas/${fileName}`;

    // Upload file to Supabase Storage using admin client to bypass RLS
    // Admin client can use File object directly
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('pengawas-foto')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Gagal mengupload foto" },
        { status: 400 }
      );
    }

    // Get public URL using admin client
    const { data: urlData } = adminClient.storage
      .from('pengawas-foto')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update user metadata with foto_profil URL
    const currentMetadata = pengawasUser.metadata || {};
    const updatedMetadata = {
      ...currentMetadata,
      foto_profil: publicUrl
    };

    // Delete old photo if exists
    if (currentMetadata.foto_profil) {
      const oldPath = currentMetadata.foto_profil.split('/').slice(-2).join('/');
      if (oldPath.startsWith('pengawas/')) {
        await adminClient.storage
          .from('pengawas-foto')
          .remove([oldPath])
          .catch(err => console.error("Error deleting old photo:", err));
      }
    }

    // Update user metadata
    const { error: updateError } = await adminClient
      .from('users')
      .update({ metadata: updatedMetadata })
      .eq('id', pengawasUser.id);

    if (updateError) {
      console.error("Error updating metadata:", updateError);
      // Try to delete uploaded file if metadata update fails
      await adminClient.storage
        .from('pengawas-foto')
        .remove([filePath])
        .catch(err => console.error("Error deleting uploaded file:", err));
      
      return NextResponse.json(
        { error: "Gagal menyimpan foto ke profil" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Foto berhasil diupload",
        url: publicUrl
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in upload foto route:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Terjadi kesalahan saat mengupload foto",
      },
      { status: 500 }
    );
  }
}

