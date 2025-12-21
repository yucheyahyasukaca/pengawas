import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const bucket = formData.get("bucket") as string || "documentation";
        const path = formData.get("path") as string || "uploads";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Create unique filename
        const timestamp = new Date().getTime();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const filePath = `${path}/${user.id}/${timestamp}_${cleanFileName}`;

        // Use Admin Client to bypass RLS for storage operations
        const adminClient = createSupabaseAdminClient();

        console.log(`Checking bucket '${bucket}'...`);

        // 1. Ensure bucket exists
        const { data: bucketData, error: bucketError } = await adminClient.storage.getBucket(bucket);

        if (bucketError) {
            console.log(`Bucket '${bucket}' check failed (likely missing), attempting to create...`);
            const { error: createError } = await adminClient.storage.createBucket(bucket, {
                public: true,
                fileSizeLimit: 5242880, // 5MB
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
            });

            if (createError) {
                // If create failed, it might be because it already exists (race condition) or permission
                // If it says "already exists", we can proceed.
                if (!createError.message.includes("already exists")) {
                    console.error("Failed to create bucket:", createError);
                    return NextResponse.json(
                        { error: "Failed to create storage bucket.", details: createError.message },
                        { status: 500 }
                    );
                }
            } else {
                console.log(`Bucket '${bucket}' created successfully.`);
            }
        }

        console.log(`Uploading to bucket ${bucket}: ${filePath}`);

        // 2. Perform Upload
        const { data, error } = await adminClient.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type,
            });

        if (error) {
            console.error("Storage upload error:", error);
            // Check if bucket exists error
            if (error.message.includes("Bucket not found")) {
                return NextResponse.json(
                    { error: "Bucket not found. Please create the bucket in Supabase.", details: error.message },
                    { status: 500 }
                );
            }
            return NextResponse.json(
                { error: "Upload failed", details: error.message },
                { status: 500 }
            );
        }

        const { data: { publicUrl } } = adminClient.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return NextResponse.json({
            success: true,
            url: publicUrl,
            path: filePath,
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
