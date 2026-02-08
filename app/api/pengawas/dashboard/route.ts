import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getPengawasUser } from "@/lib/auth-utils";

// GET - Get dashboard data for pengawas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const offset = (page - 1) * limit;

    // Check pengawas authentication
    const pengawasUser = await getPengawasUser();
    if (!pengawasUser) {
      return NextResponse.json(
        { error: "Unauthorized: Pengawas access required" },
        { status: 401 }
      );
    }

    // Use admin client to bypass RLS if needed
    const adminClient = createSupabaseAdminClient();

    // Get sekolah binaan from metadata
    const sekolahBinaanNames = Array.isArray(pengawasUser.metadata?.sekolah_binaan)
      ? pengawasUser.metadata.sekolah_binaan
      : [];

    let sekolahBinaanDetails: any[] = [];
    let totalSekolah = 0;
    let statsChangeText = "0 Sekolah";

    // Filter sekolah based on names and apply pagination
    if (sekolahBinaanNames.length > 0) {
      // 1. Get total count and details for stats
      const { data: allSekolahData, error: sekolahError } = await adminClient
        .from('sekolah')
        .select('id, npsn, nama_sekolah, status, jenjang, kabupaten_kota, alamat, kcd_wilayah')
        .in('nama_sekolah', sekolahBinaanNames)
        .order('nama_sekolah', { ascending: true });

      if (!sekolahError && allSekolahData) {
        totalSekolah = allSekolahData.length;

        // Apply pagination in memory since we're filtering by an array of names
        // (In a real DB relation we would use .range() on the query, but here we filter by 'in')
        const paginatedSekolah = allSekolahData.slice(offset, offset + limit);

        sekolahBinaanDetails = paginatedSekolah.map((sekolah) => ({
          id: sekolah.id,
          nama: sekolah.nama_sekolah,
          npsn: sekolah.npsn,
          jenis: sekolah.status, // Negeri/Swasta
          jenjang: sekolah.jenjang, // SMA/SLB/SMK
          status: 'Aktif', // Default status
          pelaporan: 'Menunggu', // Placeholder - will be updated when pelaporan table exists
        }));

        // Calculate stats from all data
        const jumlahSMA = allSekolahData.filter(s => s.jenjang === 'SMA' || s.nama_sekolah?.includes('SMA')).length;
        const jumlahSLB = allSekolahData.filter(s => s.jenjang === 'SLB' || s.nama_sekolah?.includes('SLB')).length;
        const jumlahSMK = allSekolahData.filter(s => s.jenjang === 'SMK' || s.nama_sekolah?.includes('SMK')).length;

        // Return full stats in meta or separate field if needed, but here we just update the specific stat
        statsChangeText = `${jumlahSMA} SMA, ${jumlahSLB} SLB${jumlahSMK > 0 ? `, ${jumlahSMK} SMK` : ''}`;
      }
    }

    // Calculate pelaporan triwulan stats (placeholder - will be updated when pelaporan table exists)
    // For now, we'll use a simple calculation based on current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentDay = currentDate.getDate();

    // Determine which quarters have been completed based on deadlines
    // Q1 deadline: 31 March, Q2 deadline: 30 June, Q3 deadline: 30 September, Q4 deadline: 30 November
    let completedQuarters = 0;
    if (currentMonth > 11 || (currentMonth === 11 && currentDay >= 30)) {
      completedQuarters = 4;
    } else if (currentMonth > 9 || (currentMonth === 9 && currentDay >= 30)) {
      completedQuarters = 3;
    } else if (currentMonth > 6 || (currentMonth === 6 && currentDay >= 30)) {
      completedQuarters = 2;
    } else if (currentMonth > 3 || (currentMonth === 3 && currentDay >= 31)) {
      completedQuarters = 1;
    } else {
      completedQuarters = 0;
    }

    const pelaporanTriwulan = {
      completed: completedQuarters,
      total: 4,
      percentage: Math.round((completedQuarters / 4) * 100),
    };

    // Fetch upcoming activities (rencana_pendampingan)
    let jadwalKegiatan: any[] = [];
    let totalJadwal = 0;

    try {
      // Get today's date in YYYY-MM-DD format for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      // Get count of upcoming activities
      const { count: upcomingCount, error: countError } = await adminClient
        .from('rencana_pendampingan')
        .select('*', { count: 'exact', head: true })
        .eq('pengawas_id', pengawasUser.id)
        .gte('tanggal', todayStr);

      if (!countError) {
        totalJadwal = upcomingCount || 0;
      }

      const { data: rencanaData, error: rencanaError } = await adminClient
        .from('rencana_pendampingan')
        .select('id, tanggal, sekolah_id, indikator_utama, apakah_kegiatan')
        .eq('pengawas_id', pengawasUser.id)
        .gte('tanggal', todayStr)
        .order('tanggal', { ascending: true })
        .limit(5);

      if (!rencanaError && rencanaData && rencanaData.length > 0) {
        // Fetch sekolah names for these activities
        const sekolahIds = [...new Set(rencanaData.map((r: any) => r.sekolah_id))];
        let sekolahMap: Record<string, string> = {};

        if (sekolahIds.length > 0) {
          const { data: sekolahData } = await adminClient
            .from('sekolah')
            .select('id, nama_sekolah')
            .in('id', sekolahIds);

          if (sekolahData) {
            sekolahData.forEach((s: any) => {
              sekolahMap[s.id] = s.nama_sekolah;
            });
          }
        }

        // Map to dashboard format
        jadwalKegiatan = rencanaData.map((r: any) => {
          const sekolahNama = sekolahMap[r.sekolah_id] || 'Sekolah';
          // Format date for display (e.g., "Senin, 12 Jan 2025")
          const dateObj = new Date(r.tanggal);
          const dateDisplay = dateObj.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          return {
            id: r.id,
            title: `${sekolahNama}`,
            date: dateDisplay,
            type: r.apakah_kegiatan ? 'Pendampingan' : 'Non-Pendampingan',
            status: 'Terjadwal'
          };
        });
      }
    } catch (err) {
      console.error("Error fetching jadwal kegiatan:", err);
    }

    // Placeholder data for notifikasi
    const notifikasi: any[] = [];

    // Calculate tenggat waktu based on pelaporan schedule
    // Logic: If within 7 days of deadline and quarter not complete, show warning
    let tenggatWaktu = 0;
    const deadlines = [
      new Date(currentYear, 2, 31), // Mar 31
      new Date(currentYear, 5, 30), // Jun 30
      new Date(currentYear, 8, 30), // Sep 30
      new Date(currentYear, 10, 30) // Nov 30
    ];

    // Find next deadline
    const nextDeadline = deadlines.find(d => d > currentDate);
    if (nextDeadline) {
      const diffTime = Math.abs(nextDeadline.getTime() - currentDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 14) { // Warning if within 14 days
        tenggatWaktu = 1;
      }
    }

    // Build response
    const dashboardData = {
      stats: {
        sekolahBinaan: {
          value: totalSekolah.toString(),
          change: statsChangeText,
        },
        pelaporanTriwulan: {
          value: `${pelaporanTriwulan.percentage}%`,
          change: `${pelaporanTriwulan.completed} dari ${pelaporanTriwulan.total} triwulan`,
        },
        supervisiTerjadwal: {
          value: totalJadwal.toString(),
          change: totalJadwal > 0 ? "Agenda mendatang" : "Tidak ada jadwal",
        },
        tenggatWaktu: {
          value: tenggatWaktu.toString(),
          change: tenggatWaktu > 0 ? "Perlu perhatian" : "Semua aman",
        },
      },
      sekolahBinaan: sekolahBinaanDetails,
      pagination: {
        page,
        limit,
        total: totalSekolah,
        totalPages: Math.ceil(totalSekolah / limit)
      },
      jadwalKegiatan: jadwalKegiatan,
      notifikasi: notifikasi.slice(0, 3), // Limit to 3 for preview
      pelaporanTriwulan: {
        year: currentYear,
        quarters: [
          {
            triwulan: "Triwulan 1",
            status: completedQuarters >= 1 ? "Selesai" : "Pending",
            date: "31 Maret " + currentYear,
          },
          {
            triwulan: "Triwulan 2",
            status: completedQuarters >= 2 ? "Selesai" : "Pending",
            date: "30 Juni " + currentYear,
          },
          {
            triwulan: "Triwulan 3",
            status: completedQuarters >= 3 ? "Selesai" : "Pending",
            date: "30 September " + currentYear,
          },
          {
            triwulan: "Triwulan 4",
            status: completedQuarters >= 4 ? "Selesai" : "Pending",
            date: "30 November " + currentYear,
          },
        ],
        percentage: pelaporanTriwulan.percentage,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: dashboardData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in pengawas dashboard route:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data dashboard",
      },
      { status: 500 }
    );
  }
}

