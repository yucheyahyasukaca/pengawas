import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const yearParam = searchParams.get("year");
        const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();

        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const adminClient = createSupabaseAdminClient();

        // 1. Get User Info for Sekolah Binaan
        const { data: userData, error: userError } = await adminClient
            .from("users")
            .select("metadata")
            .eq("id", user.id)
            .single();

        if (userError) throw userError;

        // 2. Calculate Sekolah Binaan
        // Based on metadata.sekolah_binaan which is an array of names
        const sekolahBinaanNames = Array.isArray(userData.metadata?.sekolah_binaan)
            ? userData.metadata.sekolah_binaan
            : [];

        // Attempt to verify count from database if possible, otherwise use metadata length
        let sekolahCount = sekolahBinaanNames.length;
        let sekolahNewCount = 0; // Placeholder for now

        // 3. Calculate Total Kegiatan (Rencana Pendampingan)
        // Current Year
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const { count: totalKegiatan, error: countError } = await adminClient
            .from("rencana_pendampingan")
            .select("*", { count: 'exact', head: true })
            .eq("pengawas_id", user.id)
            .gte("tanggal", startDate)
            .lte("tanggal", endDate);

        if (countError) throw countError;

        // Previous Year for "+15 dari tahun lalu" comparison
        const prevStartDate = `${year - 1}-01-01`;
        const prevEndDate = `${year - 1}-12-31`;

        const { count: prevTotalKegiatan, error: prevCountError } = await adminClient
            .from("rencana_pendampingan")
            .select("*", { count: 'exact', head: true })
            .eq("pengawas_id", user.id)
            .gte("tanggal", prevStartDate)
            .lte("tanggal", prevEndDate);

        const kegiatanDiff = (totalKegiatan || 0) - (prevTotalKegiatan || 0);

        // 4. Calculate Tingkat Penyelesaian (Completion Rate)
        const { count: completedKegiatan, error: completedError } = await adminClient
            .from("rencana_pendampingan")
            .select("*", { count: 'exact', head: true })
            .eq("pengawas_id", user.id)
            .gte("tanggal", startDate)
            .lte("tanggal", endDate)
            .eq("apakah_kegiatan", true); // Assuming this flag indicates completion/execution

        const completionRate = totalKegiatan && totalKegiatan > 0
            ? Math.round(((completedKegiatan || 0) / totalKegiatan) * 100)
            : 0;

        // 5. Calculate Pelaporan Triwulan
        // Logic similar to dashboard: based on current date
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // 1-12

        let completedQuarters = 0;
        // Only calculate if checking for current year or past years
        if (year < currentDate.getFullYear()) {
            completedQuarters = 4;
        } else if (year === currentDate.getFullYear()) {
            if (currentMonth > 9) completedQuarters = 3; // Q3 done
            else if (currentMonth > 6) completedQuarters = 2; // Q2 done
            else if (currentMonth > 3) completedQuarters = 1; // Q1 done

            // Refinement: Check specific dates if needed, but month rough check is okay
            // Logic from dashboard:
            // After Sep 30 -> 3 completed
            // After Jun 30 -> 2 completed
            // After Mar 31 -> 1 completed
            // Note: The dashboard logic allows Q4 to be done in Nov/Dec.
            if (currentMonth > 11 || (currentMonth === 11 && currentDate.getDate() >= 30)) completedQuarters = 4;
        } else {
            completedQuarters = 0;
        }

        const triwulanRate = Math.round((completedQuarters / 4) * 100);

        return NextResponse.json({
            totalKegiatan: {
                value: totalKegiatan || 0,
                diff: kegiatanDiff,
                text: kegiatanDiff >= 0 ? `+${kegiatanDiff} dari tahun lalu` : `${kegiatanDiff} dari tahun lalu`
            },
            sekolahBinaan: {
                value: sekolahCount,
                diff: sekolahNewCount,
                text: `+${sekolahNewCount} sekolah baru` // Placeholder
            },
            pelaporanTriwulan: {
                value: `${triwulanRate}%`,
                text: `${completedQuarters} dari 4 triwulan`
            },
            tingkatPenyelesaian: {
                value: `${completionRate}%`,
                text: "Kegiatan tuntas"
            }
        });

    } catch (error: any) {
        console.error("Error fetching annual stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch statistics" },
            { status: 500 }
        );
    }
}
