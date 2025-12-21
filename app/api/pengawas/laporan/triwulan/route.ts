import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { calculateLevels, getStrategy, METHOD_OPTIONS } from "@/lib/rencana-utils";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get("year");
        const quarter = searchParams.get("quarter"); // 1, 2, 3, 4

        if (!year || !quarter) {
            return NextResponse.json(
                { error: "Year and Quarter are required" },
                { status: 400 }
            );
        }

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

        // 2. Determine Date Range for Quarter
        // Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec
        const qStartMonth = (parseInt(quarter) - 1) * 3; // 0, 3, 6, 9
        const startDate = new Date(parseInt(year), qStartMonth, 1);
        const endDate = new Date(parseInt(year), qStartMonth + 3, 0, 23, 59, 59);

        // 3. Fetch Rencana Programs in Range (Based on Updated At)
        const { data: programs, error: progError } = await adminClient
            .from("rencana_program")
            .select("*")
            .eq("pengawas_id", user.id)
            .eq("status", "Terbit") // Only published ones
            .ilike("periode", `%${year}%`); // Match period string (e.g. "Tahun 2025")

        if (progError) throw progError;

        // 4. Fetch Rencana Pendampingan (Activities) in Range - NEW
        const { data: activitiesData, error: actError } = await adminClient
            .from("rencana_pendampingan")
            .select("tanggal, sekolah_id")
            .eq("pengawas_id", user.id)
            .gte("tanggal", startDate.toISOString())
            .lte("tanggal", endDate.toISOString())
            .order("tanggal", { ascending: true });

        if (actError) throw actError;

        // Group activities by month
        const activities = {
            month1: [] as any[],
            month2: [] as any[],
            month3: [] as any[]
        };

        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        const formatDateIndo = (dateStr: string) => {
            const d = new Date(dateStr);
            return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        }

        // Collect School IDs for activities
        const actSekolahIds = new Set<string>();
        if (Array.isArray(activitiesData)) {
            activitiesData.forEach(act => act.sekolah_id && actSekolahIds.add(act.sekolah_id));
        }

        // 5. Collect School IDs for Programs
        const allSekolahIds = new Set<string>(actSekolahIds);
        programs?.forEach((p: any) => {
            let ids = p.sekolah_ids;
            if (typeof ids === "string") try { ids = JSON.parse(ids); } catch (e) { ids = []; }
            if (Array.isArray(ids)) ids.forEach((id: string) => allSekolahIds.add(String(id)));
        });

        // 6. Fetch Schools
        const sekolahMap: Record<string, any> = {};
        if (allSekolahIds.size > 0) {
            const { data: schools, error: schoolError } = await adminClient
                .from("sekolah")
                .select("id, npsn, nama_sekolah, kabupaten_kota") // Added kabupaten_kota for 'Tempat'
                .in("id", Array.from(allSekolahIds));

            if (schoolError) throw schoolError;
            schools?.forEach((s: any) => sekolahMap[String(s.id)] = s);
        }

        // Process Activities into Months
        if (Array.isArray(activitiesData)) {
            activitiesData.forEach(act => {
                const date = new Date(act.tanggal);
                // Adjust month index based on year if expanding to multiple years, but here we filter by quarter
                // Simply use month index relative to quarter start
                // But handle case where year might be different (unlikely with filter)
                let relativeMonth = date.getMonth() - qStartMonth;

                // Correction for year boundary if ever needed (not for single quarter filter though)
                // If quarter spans year (unlikely), logic differs. 
                // Assuming standard quarters.

                const school = sekolahMap[act.sekolah_id];
                // User requested "Tempat" to be the city name without "Kabupaten" or "Kota"
                let place = school?.kabupaten_kota || school?.nama_sekolah || "Sekolah";
                place = place.replace(/Kabupaten\s+/i, "").replace(/Kota\s+/i, "").trim();

                const item = {
                    date: formatDateIndo(act.tanggal),
                    place: place,
                    schoolName: school?.nama_sekolah
                };

                if (relativeMonth === 0) activities.month1.push(item);
                else if (relativeMonth === 1) activities.month2.push(item);
                else if (relativeMonth === 2) activities.month3.push(item);
            });
        }

        // 7. Build Report Rows
        const rows: any[] = [];
        let summaryStrategi = new Set<string>();
        let summaryMetode = new Set<string>();
        let summaryPrioritas = new Set<string>();

        programs?.forEach((p: any) => {
            // Calculate Strategy & Priority
            const formData = p.form_data || {};
            const { reflectionLevel, capacityLevel } = calculateLevels(formData.selectedAnswers || {});
            const strategyObj = getStrategy(reflectionLevel, capacityLevel);

            // Collect Methods
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

            // Add to summary
            summaryStrategi.add(strategyObj.title);
            summaryPrioritas.add(strategyObj.priority);
            methods.forEach(m => summaryMetode.add(m));

            // Process Schools
            let ids = p.sekolah_ids;
            if (typeof ids === "string") try { ids = JSON.parse(ids); } catch (e) { ids = []; }

            if (Array.isArray(ids)) {
                ids.forEach((sid: string) => {
                    const school = sekolahMap[String(sid)];
                    if (school) {
                        rows.push({
                            id: p.id, // program id
                            schoolId: school.id,
                            npsn: school.npsn,
                            namaSekolah: school.nama_sekolah,
                            komitmen: `${capacityLevel}-${reflectionLevel}`, // "Berdaya-Tinggi" format
                            strategi: strategyObj.title,
                            dokumen: "Bukti dukung dan dokumentasi",
                            metode: methods.join(", "),
                            prioritas: strategyObj.priority
                        });
                    }
                });
            }
        });

        // Use Set to remove duplicates in activities if any (though strict uniqueness isn't required by spec)
        // Taking first item of month for standard report if that's the format, or just passing all.
        // Frontend will decide how to display.

        return NextResponse.json({
            pengawas: {
                nama: userData?.nama,
                nip: userData?.nip,
                jabatan: "Pengawas Sekolah Ahli Madya",
                pangkat: userData?.metadata?.pangkat || "Pembina Utama Muda/ IVC",
                pendampinganTahun: year
            },
            summary: {
                strategi: Array.from(summaryStrategi),
                metode: Array.from(summaryMetode),
                prioritas: Array.from(summaryPrioritas)
            },
            activities: {
                month1: {
                    label: `KEGIATAN BULAN ${monthNames[qStartMonth].toUpperCase()}`,
                    items: activities.month1
                },
                month2: {
                    label: `KEGIATAN BULAN ${monthNames[qStartMonth + 1].toUpperCase()}`,
                    items: activities.month2
                },
                month3: {
                    label: `KEGIATAN BULAN ${monthNames[qStartMonth + 2].toUpperCase()}`,
                    items: activities.month3
                }
            },
            rows
        });

    } catch (error) {
        console.error("Error fetching triwulan report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
