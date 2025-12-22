import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { calculateLevels, getStrategy, METHOD_OPTIONS } from "@/lib/rencana-utils";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        // Default to current year if not provided
        const year = searchParams.get("year") || new Date().getFullYear().toString();

        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const adminClient = createSupabaseAdminClient();

        // 1. Get Pengawas Info
        const { data: userData, error: userError } = await adminClient
            .from("users")
            .select("nama, nip, metadata, role")
            .eq("id", user.id)
            .single();

        if (userError) throw userError;

        // 2. Fetch Rencana Programs for the Year (Published)
        // We look for programs where the "periode" string contains the year
        const { data: programs, error: progError } = await adminClient
            .from("rencana_program")
            .select("*")
            .eq("pengawas_id", user.id)
            .eq("status", "Terbit")
            .ilike("periode", `%${year}%`);

        if (progError) throw progError;

        // 3. Fetch Rencana Pendampingan (Activities) for the Year
        // Used to show timeline or summary if needed, but primarily needed for "Tempat dan Tanggal" if we follow the triwulan pattern.
        // For Annual, we might summarize or list them.
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31T23:59:59`);

        const { data: activitiesData, error: actError } = await adminClient
            .from("rencana_pendampingan")
            .select("tanggal, sekolah_id")
            .eq("pengawas_id", user.id)
            .gte("tanggal", startDate.toISOString())
            .lte("tanggal", endDate.toISOString())
            .order("tanggal", { ascending: true });

        if (actError) throw actError;

        // 4. Collect School IDs
        const allSekolahIds = new Set<string>();

        // From programs
        programs?.forEach((p: any) => {
            let ids = p.sekolah_ids;
            if (typeof ids === "string") try { ids = JSON.parse(ids); } catch (e) { ids = []; }
            if (Array.isArray(ids)) ids.forEach((id: string) => allSekolahIds.add(String(id)));
        });

        // From activities
        activitiesData?.forEach((act: any) => {
            if (act.sekolah_id) allSekolahIds.add(act.sekolah_id);
        });

        // 5. Fetch Schools
        const sekolahMap: Record<string, any> = {};
        if (allSekolahIds.size > 0) {
            const { data: schools, error: schoolError } = await adminClient
                .from("sekolah")
                .select("id, npsn, nama_sekolah, kabupaten_kota, rapor_pendidikan")
                .in("id", Array.from(allSekolahIds));

            if (schoolError) throw schoolError;
            schools?.forEach((s: any) => sekolahMap[String(s.id)] = s);
        }

        // 6. Process Data
        const mainReportRows: any[] = [];
        const lampiran1Rows: any[] = []; // KP indicators
        const lampiran2Rows: any[] = []; // Awareness Level
        const lampiran3Rows: any[] = []; // MP indicators (Capacity)
        const lampiran4Rows: any[] = []; // Capacity Level
        const raporPendidikanRows: any[] = []; // Rapor

        // Group programs by School to find the relevant plan (e.g. latest one)
        // If a school has multiple plans (e.g. Q1, Q2), we typically use the latest for "Annual Status" 
        // OR we list them all. For the tables requesting "Komitmen Perubahan Tahun X", a single row per school is expected.
        // We will use the latest program for each school.

        const schoolLatestProgram: Record<string, any> = {};

        programs?.forEach((p: any) => {
            let ids = p.sekolah_ids;
            if (typeof ids === "string") try { ids = JSON.parse(ids); } catch (e) { ids = []; }

            if (Array.isArray(ids)) {
                ids.forEach((sid: string) => {
                    // Primitive "latest" check based on created_at or updated_at
                    const existing = schoolLatestProgram[sid];
                    if (!existing || new Date(p.created_at) > new Date(existing.created_at)) {
                        schoolLatestProgram[sid] = p;
                    }
                });
            }
        });

        // Now iterate over all schools found
        // Sort schools by name for consistent display
        const sortedSchoolIds = Object.keys(sekolahMap).sort((a, b) => {
            return sekolahMap[a].nama_sekolah.localeCompare(sekolahMap[b].nama_sekolah);
        });

        sortedSchoolIds.forEach((sid, index) => {
            const school = sekolahMap[sid];
            const program = schoolLatestProgram[sid];

            // Defaults if no program found (e.g. only had activities but no plan?)
            // If no plan, we can't show strategy etc.
            if (!program) return;
            // Or render empty? Better skip or show empty. 
            // The prompt implies we show the "Report", which is based on Plans.

            const formData = program.form_data || {};
            const answers = formData.selectedAnswers || {};
            const { reflectionLevel, capacityLevel } = calculateLevels(answers);
            const strategyObj = getStrategy(reflectionLevel, capacityLevel);

            // Methods
            const methods: string[] = [];
            if (Array.isArray(formData.selectedMethods)) {
                formData.selectedMethods.forEach((mid: string) => {
                    const m = METHOD_OPTIONS.find(opt => opt.id === mid);
                    if (m) methods.push(m.title);
                });
            } else if (formData.selectedMethod) {
                const m = METHOD_OPTIONS.find(opt => opt.id === formData.selectedMethod);
                if (m) methods.push(m.title);
            }

            // Main Report Row
            mainReportRows.push({
                no: index + 1,
                npsn: school.npsn,
                namaSekolah: school.nama_sekolah,
                komitmen: `${reflectionLevel}-${capacityLevel}`, // e.g. "Berdaya-Tinggi"
                strategi: strategyObj.title,
                metode: methods.join(", "),
                prioritas: strategyObj.priority,
                dokumen: "Bukti dukung dan dokumentasi" // Static as per image
            });

            // Lampiran 1: KP Indicators (k1..k4)
            // Questions: q1_1, q1_2
            const kFlags = { k1: false, k2: false, k3: false, k4: false };
            if (answers.q1_1) (kFlags as any)[answers.q1_1] = true;
            if (answers.q1_2) (kFlags as any)[answers.q1_2] = true;

            lampiran1Rows.push({
                no: index + 1,
                namaSekolah: school.nama_sekolah,
                k1: kFlags.k1,
                k2: kFlags.k2,
                k3: kFlags.k3,
                k4: kFlags.k4,
                predikat: reflectionLevel // "Berdaya" or "Berkembang"
            });

            // Lampiran 2: Just Level
            lampiran2Rows.push({
                no: index + 1,
                namaSekolah: school.nama_sekolah,
                capaian: reflectionLevel
            });

            // Lampiran 3: MP Indicators (c1..c6)
            // Questions: q2_1, q2_2
            const cFlags = { c1: false, c2: false, c3: false, c4: false, c5: false, c6: false };
            if (answers.q2_1) (cFlags as any)[answers.q2_1] = true;
            if (answers.q2_2) (cFlags as any)[answers.q2_2] = true;

            lampiran3Rows.push({
                no: index + 1,
                namaSekolah: school.nama_sekolah,
                c1: cFlags.c1,
                c2: cFlags.c2,
                c3: cFlags.c3,
                c4: cFlags.c4,
                c5: cFlags.c5,
                c6: cFlags.c6,
                predikat: capacityLevel // "Tinggi", "Sedang", "Rendah"
            });

            // Lampiran 4: Capacity Level & Gradasi
            // Calculate precise score for "Gradasi" (1-3)
            // Helper logic replicated from utils
            let cScoreTotal = 0;
            let cCount = 0;
            const getCScore = (ans: string) => {
                if (["c1", "c2"].includes(ans)) return 1;
                if (["c3", "c4"].includes(ans)) return 2;
                if (["c5", "c6"].includes(ans)) return 3;
                return 1;
            };
            if (answers.q2_1) { cScoreTotal += getCScore(answers.q2_1); cCount++; }
            if (answers.q2_2) { cScoreTotal += getCScore(answers.q2_2); cCount++; }
            const gradasi = cCount > 0 ? (cScoreTotal / cCount).toFixed(2) : "1.00";

            lampiran4Rows.push({
                no: index + 1,
                namaSekolah: school.nama_sekolah,
                gradasi: gradasi,
                capacity: capacityLevel,
                description: `Capaian Tingkat Memimpin Perubahan pada level ${capacityLevel}`
            });

            // Rapor Pendidikan
            // Extract from school.rapor_pendidikan JSONB
            // Assumes structure is array of objects or similar.
            // Adjust based on observation if possible, else return raw.
            // Usually: [{ indikator: "A.1", nilai: 3, ... }]
            const rapor = school.rapor_pendidikan || [];
            raporPendidikanRows.push({
                no: index + 1,
                namaSekolah: school.nama_sekolah,
                rapor: rapor
            });
        });

        // Activity Summary (Group by Month for the header section of Main Report)
        // We only show FIRST 3 MONTHS in the image example ("Januari - Maret"). 
        // If "Yearly", maybe we show Q1, Q2, Q3, Q4?
        // But for now, let's just return the raw activities for the UI to decide.
        // Or if the user really wants the Q1 look, we might just return the relevant months.
        // I will return all activities grouped by Month.

        const activitiesByMonth: Record<string, any[]> = {};
        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        activitiesData?.forEach(act => {
            const d = new Date(act.tanggal);
            const mName = monthNames[d.getMonth()];
            if (!activitiesByMonth[mName]) activitiesByMonth[mName] = [];

            const school = sekolahMap[act.sekolah_id];
            activitiesByMonth[mName].push({
                date: d.getDate() + " " + mName + " " + d.getFullYear(),
                place: school?.kabupaten_kota || school?.nama_sekolah || "Sekolah",
                schoolName: school?.nama_sekolah
            });
        });

        return NextResponse.json({
            pengawas: {
                nama: userData?.nama,
                nip: userData?.nip,
                jabatan: "Pengawas Sekolah Ahli Madya",
                pangkat: userData?.metadata?.pangkat || "Pembina Utama Muda/ IVC",
            },
            mainReport: mainReportRows,
            lampiran1: lampiran1Rows,
            lampiran2: lampiran2Rows,
            lampiran3: lampiran3Rows,
            lampiran4: lampiran4Rows,
            raporPendidikan: raporPendidikanRows,
            activities: activitiesByMonth,
            year: year
        });

    } catch (error) {
        console.error("Error fetching annual report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
