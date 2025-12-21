import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { calculateLevels, getStrategy, METHOD_OPTIONS } from "@/lib/rencana-utils";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sekolahId = searchParams.get("sekolah_id");

    if (!sekolahId) {
        return NextResponse.json({ error: "Sekolah ID required" }, { status: 400 });
    }

    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const adminClient = createSupabaseAdminClient();

        // Fetch all rencana programs for this pengawas (optimized: normally would filter by school but jsonb filter is tricky with mixed types, fetching all is safer for small datasets)
        const { data: programs, error } = await adminClient
            .from("rencana_program")
            .select("*")
            .eq("pengawas_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching programs:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        // Find the first program that contains this sekolah_id
        if (!programs) return NextResponse.json({ found: false });

        const match = programs.find((p: any) => {
            let ids = p.sekolah_ids;
            if (typeof ids === 'string') {
                try { ids = JSON.parse(ids); } catch (e) { ids = []; }
            }
            if (Array.isArray(ids)) {
                return ids.map(String).includes(String(sekolahId));
            }
            return false;
        });

        if (!match) {
            return NextResponse.json({ found: false });
        }

        // Calculate Data
        const formData = match.form_data || {};
        const answers = formData.selectedAnswers || {};

        // 1. Priority & Strategy
        const { reflectionLevel, capacityLevel } = calculateLevels(answers);
        const strategy = getStrategy(reflectionLevel, capacityLevel);

        // 2. Methods
        const selectedMethodIds = Array.isArray(formData.selectedMethods)
            ? formData.selectedMethods
            : (formData.selectedMethod ? [formData.selectedMethod] : []);

        const methods = selectedMethodIds.map((id: string) => {
            const m = METHOD_OPTIONS.find(opt => opt.id === id);
            return m ? m.label || m.title : id;
        });

        return NextResponse.json({
            found: true,
            programId: match.id,
            priority: strategy.priority, // e.g., "Prioritas Utama"
            strategyName: strategy.title, // e.g., "Penyemai Perubahan"
            methods: methods,
            sekolahName: "" // Optional, caller knows it
        });

    } catch (error) {
        console.error("Error checking school program:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
