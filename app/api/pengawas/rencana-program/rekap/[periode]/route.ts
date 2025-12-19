import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ periode: string }> }
) {
    try {
        const { periode } = await params;
        const decodedPeriode = decodeURIComponent(periode);

        const supabase = await createSupabaseServerClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Use admin client to check role
        const adminClient = createSupabaseAdminClient();
        const { data: userData, error: userError } = await adminClient
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

        if (userError || !userData || userData.role !== "pengawas") {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        // Fetch plans matching the period
        // Note: The 'periode' column in DB is string like "Tahun 2025"
        const { data: rencanaPrograms, error } = await adminClient
            .from("rencana_program")
            .select("*")
            .eq("pengawas_id", user.id)
            .eq("periode", decodedPeriode)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching rencana programs:", error);
            return NextResponse.json(
                { error: "Gagal memuat data rekap" },
                { status: 500 }
            );
        }

        // Collect all school IDs
        const allSekolahIds: string[] = [];
        rencanaPrograms.forEach((item: any) => {
            let sIds = item.sekolah_ids;
            if (typeof sIds === "string") {
                try { sIds = JSON.parse(sIds); } catch (e) { sIds = []; }
            }
            if (Array.isArray(sIds)) {
                allSekolahIds.push(...sIds.map(String));
            }
        });

        // Fetch school details
        let sekolahMap: Record<string, any> = {};
        if (allSekolahIds.length > 0) {
            const uniqueIds = [...new Set(allSekolahIds)];
            const { data: sekolahData } = await adminClient
                .from("sekolah")
                .select("id, npsn, nama_sekolah")
                .in("id", uniqueIds);

            if (sekolahData) {
                sekolahData.forEach((s: any) => {
                    sekolahMap[String(s.id)] = s;
                });
            }
        }

        // Transform data
        const transformed = rencanaPrograms.map((item: any) => {
            // Parse Form Data
            let formData = item.form_data;
            if (typeof formData === "string") {
                try { formData = JSON.parse(formData); } catch (e) { formData = {}; }
            }

            // Parse Sekolah IDs
            let sIds = item.sekolah_ids;
            if (typeof sIds === "string") {
                try { sIds = JSON.parse(sIds); } catch (e) { sIds = []; }
            }
            if (!Array.isArray(sIds)) sIds = [];

            const schools = sIds
                .map(String)
                .map((id: string) => sekolahMap[id])
                .filter(Boolean)
                .map((s: any) => ({
                    id: s.id,
                    nama: s.nama_sekolah,
                    npsn: s.npsn
                }));

            return {
                id: item.id,
                periode: item.periode,
                status: item.status,
                created_at: item.created_at,
                form_data: formData,
                sekolah: schools
            };
        });

        return NextResponse.json({
            periode: decodedPeriode,
            documents: transformed
        });

    } catch (error) {
        console.error("Error in rekap route:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
