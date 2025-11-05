import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getPengawasUser } from "@/lib/auth-utils";

// GET - Get statistics data for pengawas
export async function GET(request: Request) {
  try {
    // Check pengawas authentication
    const pengawasUser = await getPengawasUser();
    if (!pengawasUser) {
      return NextResponse.json(
        { error: "Unauthorized: Pengawas access required" },
        { status: 401 }
      );
    }

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const filterKabupaten = searchParams.get('kabupaten') || null;
    const filterJenis = searchParams.get('jenis') || null;

    // Use admin client to bypass RLS if needed
    const adminClient = createSupabaseAdminClient();
    const supabase = await createSupabaseServerClient();

    // Get sekolah binaan from metadata
    const sekolahBinaanNames = Array.isArray(pengawasUser.metadata?.sekolah_binaan)
      ? pengawasUser.metadata.sekolah_binaan
      : [];

    // Build query for sekolah
    let sekolahQuery = adminClient
      .from('sekolah')
      .select('id, npsn, nama_sekolah, status, jenjang, kabupaten_kota, alamat, kcd_wilayah');

    // Filter by sekolah binaan if available
    if (sekolahBinaanNames.length > 0) {
      sekolahQuery = sekolahQuery.in('nama_sekolah', sekolahBinaanNames);
    }

    // Apply additional filters
    if (filterKabupaten && filterKabupaten !== 'Semua') {
      sekolahQuery = sekolahQuery.eq('kabupaten_kota', filterKabupaten);
    }

    if (filterJenis && filterJenis !== 'Semua') {
      // Filter by combination like "SMA Negeri", "SMA Swasta", etc.
      // Split the filter to get jenjang and status
      const parts = filterJenis.split(' ');
      if (parts.length === 2) {
        const jenjang = parts[0]; // SMA, SLB, SMK
        const status = parts[1]; // Negeri, Swasta
        sekolahQuery = sekolahQuery.eq('jenjang', jenjang).eq('status', status);
      } else if (parts.length === 1) {
        // If only one part, check if it's status or jenjang
        if (filterJenis === 'Negeri' || filterJenis === 'Swasta') {
          sekolahQuery = sekolahQuery.eq('status', filterJenis);
        } else if (filterJenis === 'SMA' || filterJenis === 'SLB' || filterJenis === 'SMK') {
          sekolahQuery = sekolahQuery.eq('jenjang', filterJenis);
        }
      }
    }

    const { data: sekolahData, error: sekolahError } = await sekolahQuery;

    if (sekolahError) {
      console.error("Error loading sekolah:", sekolahError);
      return NextResponse.json(
        { error: sekolahError.message || "Gagal memuat data sekolah" },
        { status: 400 }
      );
    }

    const sekolahList = sekolahData || [];

    // Calculate statistics
    const totalSekolah = sekolahList.length;

    // Count by kabupaten/kota
    const statistikKabupaten: Record<string, { jumlahSekolah: number; jumlahKegiatan: number }> = {};
    const kabupatenList = Array.from(new Set(sekolahList.map(s => s.kabupaten_kota).filter(Boolean)));

    kabupatenList.forEach(kab => {
      const sekolahDiKab = sekolahList.filter(s => s.kabupaten_kota === kab);
      statistikKabupaten[kab] = {
        jumlahSekolah: sekolahDiKab.length,
        jumlahKegiatan: 0, // Placeholder - will be updated when kegiatan table exists
      };
    });

    // Count by jenis sekolah (status: Negeri/Swasta)
    const statistikJenis: Record<string, { jumlah: number; persentase: number }> = {};
    const jenisList = Array.from(new Set(sekolahList.map(s => s.status).filter(Boolean)));

    jenisList.forEach(jenis => {
      const jumlah = sekolahList.filter(s => s.status === jenis).length;
      const persentase = totalSekolah > 0 ? Math.round((jumlah / totalSekolah) * 100) : 0;
      statistikJenis[jenis] = { jumlah, persentase };
    });

    // Also count by jenjang (SMA/SLB/SMK)
    const statistikJenjang: Record<string, { jumlah: number; persentase: number }> = {};
    const jenjangList = Array.from(new Set(sekolahList.map(s => s.jenjang).filter(Boolean)));

    jenjangList.forEach(jenjang => {
      const jumlah = sekolahList.filter(s => s.jenjang === jenjang).length;
      const persentase = totalSekolah > 0 ? Math.round((jumlah / totalSekolah) * 100) : 0;
      statistikJenjang[jenjang] = { jumlah, persentase };
    });

    // Format statistik kabupaten for response
    const statistikKabupatenFormatted = Object.entries(statistikKabupaten).map(([kabupaten, data]) => ({
      kabupaten,
      jumlahSekolah: data.jumlahSekolah,
      jumlahKegiatan: data.jumlahKegiatan,
      status: 'Aktif',
    }));

    // Format statistik jenis (combine jenjang and status)
    // Create combinations like: "SMA Negeri", "SMA Swasta", "SLB Negeri", etc.
    const statistikJenisFormatted: Array<{ jenis: string; jumlah: number; persentase: number }> = [];
    const jenisCombinations: Record<string, number> = {};

    // Count by combination of jenjang and status
    sekolahList.forEach(sekolah => {
      if (sekolah.jenjang && sekolah.status) {
        const key = `${sekolah.jenjang} ${sekolah.status}`;
        jenisCombinations[key] = (jenisCombinations[key] || 0) + 1;
      }
    });

    // Convert to array format
    Object.entries(jenisCombinations).forEach(([jenis, jumlah]) => {
      const persentase = totalSekolah > 0 ? Math.round((jumlah / totalSekolah) * 100) : 0;
      statistikJenisFormatted.push({
        jenis,
        jumlah,
        persentase,
      });
    });

    // Sort by jumlah descending
    statistikJenisFormatted.sort((a, b) => b.jumlah - a.jumlah);

    // Calculate total kegiatan (placeholder - will be updated when kegiatan table exists)
    // For now, estimate based on current date and sekolah count
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    // Estimate: average 3-4 kegiatan per sekolah per year
    const estimatedKegiatanPerSekolah = 3.5;
    const totalKegiatan = Math.round(totalSekolah * estimatedKegiatanPerSekolah * (currentMonth / 12));

    // Count unique kabupaten/kota
    const jumlahKabupaten = kabupatenList.length;

    // Calculate completion rate (placeholder)
    const tingkatPenyelesaian = 85; // Placeholder - will be updated when pelaporan table exists

    // Build response
    const responseData = {
      summary: {
        totalSekolah,
        totalKegiatan,
        jumlahKabupaten,
        tingkatPenyelesaian,
      },
      statistikKabupaten: statistikKabupatenFormatted,
      statistikJenis: statistikJenisFormatted,
    };

    return NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in pengawas statistik route:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data statistik",
      },
      { status: 500 }
    );
  }
}

