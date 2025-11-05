import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

// GET - Get pengawas detail by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check admin authentication
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    // Resolve params if it's a Promise (Next.js 15+)
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json(
        { error: "Invalid request: pengawas ID is required" },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const adminClient = createSupabaseAdminClient();

    // Get pengawas data
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .select('id, email, nama, nip, status_approval, created_at, updated_at, metadata')
      .eq('id', id)
      .eq('role', 'pengawas')
      .eq('status_approval', 'approved')
      .single();

    if (userError || !userData) {
      console.error("Error fetching pengawas:", userError);
      return NextResponse.json(
        { error: "Pengawas tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get sekolah binaan data from metadata or fetch from sekolah table
    const sekolahBinaanNames = Array.isArray(userData.metadata?.sekolah_binaan) 
      ? userData.metadata.sekolah_binaan 
      : [];

    // Fetch sekolah details from sekolah table if we have names or IDs
    let sekolahBinaanDetails: any[] = [];
    
    if (sekolahBinaanNames.length > 0) {
      // Try to fetch sekolah by nama_sekolah
      const { data: sekolahData, error: sekolahError } = await adminClient
        .from('sekolah')
        .select('id, npsn, nama_sekolah, status, jenjang, kabupaten_kota, alamat, kcd_wilayah')
        .in('nama_sekolah', sekolahBinaanNames)
        .order('nama_sekolah', { ascending: true });

      if (!sekolahError && sekolahData) {
        sekolahBinaanDetails = sekolahData.map((sekolah, index) => ({
          id: sekolah.id || index + 1,
          nama: sekolah.nama_sekolah,
          npsn: sekolah.npsn,
          jenis: sekolah.status,
          alamat: sekolah.alamat,
          kabupaten: sekolah.kabupaten_kota,
          cabangDinas: `KCD Wilayah ${sekolah.kcd_wilayah}`,
          status: "Aktif",
        }));
      } else {
        // If fetch fails, create basic data from names
        sekolahBinaanDetails = sekolahBinaanNames.map((nama: string, index: number) => ({
          id: index + 1,
          nama: nama,
          npsn: '-',
          jenis: 'Negeri',
          alamat: '-',
          kabupaten: userData.metadata?.wilayah_tugas || '-',
          cabangDinas: '-',
          status: "Aktif",
        }));
      }
    }

    // Format response
    const pengawas = {
      id: userData.id,
      name: userData.nama || 'Belum mengisi nama',
      nip: userData.nip || '',
      wilayah: userData.metadata?.wilayah_tugas || 'Belum diisi',
      jumlahSekolah: sekolahBinaanDetails.length,
      status: "Aktif",
      email: userData.email,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      sekolahBinaan: sekolahBinaanDetails,
      // Mock data for other sections (will be replaced later)
      pelaporanStatus: [],
      jadwalKegiatan: [],
      notifikasi: [],
      statistikData: {
        perKabupaten: [],
        perJenis: [],
        kegiatan: {
          bulanan: 0,
          triwulanan: 0,
          tahunan: 0,
        },
      },
    };

    return NextResponse.json(
      { 
        success: true,
        pengawas: pengawas
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in pengawas detail route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data" },
      { status: 500 }
    );
  }
}

