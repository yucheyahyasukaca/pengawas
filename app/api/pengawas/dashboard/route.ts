import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getPengawasUser } from "@/lib/auth-utils";

// GET - Get dashboard data for pengawas
export async function GET() {
  try {
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
    const supabase = await createSupabaseServerClient();

    // Get sekolah binaan from metadata
    const sekolahBinaanNames = Array.isArray(pengawasUser.metadata?.sekolah_binaan)
      ? pengawasUser.metadata.sekolah_binaan
      : [];

    // Fetch sekolah details from sekolah table
    let sekolahBinaanDetails: any[] = [];
    if (sekolahBinaanNames.length > 0) {
      // Try to fetch sekolah by nama_sekolah
      const { data: sekolahData, error: sekolahError } = await adminClient
        .from('sekolah')
        .select('id, npsn, nama_sekolah, status, jenjang, kabupaten_kota, alamat, kcd_wilayah')
        .in('nama_sekolah', sekolahBinaanNames)
        .order('nama_sekolah', { ascending: true });

      if (!sekolahError && sekolahData) {
      sekolahBinaanDetails = sekolahData.map((sekolah) => ({
        id: sekolah.id,
        nama: sekolah.nama_sekolah,
        npsn: sekolah.npsn,
        jenis: sekolah.status, // Negeri/Swasta
        jenjang: sekolah.jenjang, // SMA/SLB/SMK
        status: 'Aktif', // Default status
        pelaporan: 'Triwulan 3 selesai', // Placeholder - will be updated when pelaporan table exists
      }));
      }
    }

    // Calculate statistics
    const jumlahSekolah = sekolahBinaanDetails.length;
    // Count by jenjang (SMA, SLB, SMK)
    const jumlahSMA = sekolahBinaanDetails.filter(s => s.jenjang === 'SMA' || s.nama?.includes('SMA')).length;
    const jumlahSLB = sekolahBinaanDetails.filter(s => s.jenjang === 'SLB' || s.nama?.includes('SLB')).length;
    const jumlahSMK = sekolahBinaanDetails.filter(s => s.jenjang === 'SMK' || s.nama?.includes('SMK')).length;

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
      // After Q4 deadline (30 Nov) - all 4 quarters completed
      completedQuarters = 4;
    } else if (currentMonth > 9 || (currentMonth === 9 && currentDay >= 30)) {
      // After Q3 deadline (30 Sep) - Q1, Q2, Q3 completed
      completedQuarters = 3;
    } else if (currentMonth > 6 || (currentMonth === 6 && currentDay >= 30)) {
      // After Q2 deadline (30 Jun) - Q1, Q2 completed
      completedQuarters = 2;
    } else if (currentMonth > 3 || (currentMonth === 3 && currentDay >= 31)) {
      // After Q1 deadline (31 Mar) - Q1 completed
      completedQuarters = 1;
    } else {
      // Before Q1 deadline - no quarters completed yet
      completedQuarters = 0;
    }

    const pelaporanTriwulan = {
      completed: completedQuarters,
      total: 4,
      percentage: Math.round((completedQuarters / 4) * 100),
    };

    // Placeholder data for jadwal kegiatan (will be updated when agenda/supervisi table exists)
    const jadwalKegiatan: any[] = [];

    // Placeholder data for notifikasi (will be updated when notifications table exists)
    const notifikasi: any[] = [];

    // Calculate tenggat waktu (placeholder - will be updated when pelaporan table exists)
    const tenggatWaktu = 0; // Placeholder

    // Build response
    const dashboardData = {
      stats: {
        sekolahBinaan: {
          value: jumlahSekolah.toString(),
          change: `${jumlahSMA} SMA, ${jumlahSLB} SLB${jumlahSMK > 0 ? `, ${jumlahSMK} SMK` : ''}`,
        },
        pelaporanTriwulan: {
          value: `${pelaporanTriwulan.percentage}%`,
          change: `${pelaporanTriwulan.completed} dari ${pelaporanTriwulan.total} triwulan`,
        },
        supervisiTerjadwal: {
          value: jadwalKegiatan.length.toString(),
          change: "Bulan ini",
        },
        tenggatWaktu: {
          value: tenggatWaktu.toString(),
          change: tenggatWaktu > 0 ? "Perlu perhatian" : "Semua on time",
        },
      },
      sekolahBinaan: sekolahBinaanDetails.slice(0, 3), // Limit to 3 for preview
      jadwalKegiatan: jadwalKegiatan.slice(0, 3), // Limit to 3 for preview
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

