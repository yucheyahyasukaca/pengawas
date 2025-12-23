import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized: Authentication required" },
                { status: 401 }
            );
        }

        // Check role
        const adminClient = createSupabaseAdminClient();
        const { data: userData, error: userError } = await adminClient
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

        if (userError || !userData || userData.role !== 'pengawas') {
            return NextResponse.json(
                { error: "Forbidden: Only pengawas can upload documents" },
                { status: 403 }
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

        // Validate file type (PDF usually for certs/reports, maybe images too)
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Format file tidak didukung. Gunakan PDF, JPG, PNG, atau WEBP" },
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

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `dokumen-pengembangan-diri/${fileName}`;

        const BUCKET_NAME = 'dokumen-pengembangan-diri';

        const { data: uploadData, error: uploadError } = await adminClient.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type
            });

        if (uploadError) {
            console.error("Error uploading file:", uploadError);
            return NextResponse.json(
                { error: `Gagal mengupload file: ${uploadError.message}. Pastikan bucket '${BUCKET_NAME}' sudah dibuat.` },
                { status: 500 }
            );
        }

        const { data: urlData } = adminClient.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return NextResponse.json(
            {
                success: true,
                url: urlData.publicUrl
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error in upload route:", err);
        return NextResponse.json(
            {
                error: err instanceof Error ? err.message : "Terjadi kesalahan saat mengupload file",
            },
            { status: 500 }
        );
    }
}
