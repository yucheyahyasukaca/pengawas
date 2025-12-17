import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Use admin client to bypass RLS for consistent access
        const adminClient = createSupabaseAdminClient();

        // Fetch latest Draft for this user
        const { data: draft, error } = await adminClient
            .from("rencana_program")
            .select("*")
            .eq("pengawas_id", user.id)
            .eq("status", "Draft")
            .order("updated_at", { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== "PGRST116") { // PGRST116 is "Row not found" (single)
            console.error("Error fetching draft:", error);
            return NextResponse.json(
                { error: "Gagal memuat draft" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            draft: draft || null,
        });
    } catch (error) {
        console.error("Error in GET /api/pengawas/rencana-program/draft:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat memuat draft" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            formData, // Contains form fields, selectedAnswers, currentStep
            sekolah_ids,
            id, // Optional draft ID if we already know it
        } = body;

        const adminClient = createSupabaseAdminClient();

        let draftId = id;

        // If no ID provided, check if a draft exists anyway (to prevent duplicates)
        if (!draftId) {
            const { data: existingDraft } = await adminClient
                .from("rencana_program")
                .select("id")
                .eq("pengawas_id", user.id)
                .eq("status", "Draft")
                .order("updated_at", { ascending: false })
                .limit(1)
                .single();

            if (existingDraft) {
                draftId = existingDraft.id;
            }
        }

        let result;
        if (draftId) {
            // Update existing draft
            const { data, error } = await adminClient
                .from("rencana_program")
                .update({
                    form_data: formData,
                    sekolah_ids: sekolah_ids || [],
                    updated_at: new Date().toISOString(),
                })
                .eq("id", draftId)
                .select()
                .single();

            if (error) throw error;
            result = data;
        } else {
            // Insert new draft
            const { data, error } = await adminClient
                .from("rencana_program")
                .insert({
                    pengawas_id: user.id,
                    status: "Draft",
                    form_data: formData,
                    sekolah_ids: sekolah_ids || [],
                    periode: `Tahun ${new Date().getFullYear()}`, // Default period
                })
                .select()
                .single();

            if (error) throw error;
            result = data;
        }

        return NextResponse.json({
            success: true,
            draft: result,
        });

    } catch (error) {
        console.error("Error in PUT /api/pengawas/rencana-program/draft:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menyimpan draft" },
            { status: 500 }
        );
    }
}
