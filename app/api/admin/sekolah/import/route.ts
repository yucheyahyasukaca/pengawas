import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

interface SekolahData {
  npsn: string;
  nama_sekolah: string;
  status: string;
  jenjang: string;
  kabupaten_kota: string;
  alamat: string;
  kcd_wilayah: number;
}

// POST - Import sekolah from Excel data
export async function POST(request: Request) {
  try {
    // Check admin authentication
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sekolahData } = body;

    if (!Array.isArray(sekolahData) || sekolahData.length === 0) {
      return NextResponse.json(
        { error: "Data sekolah tidak valid atau kosong" },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const adminClient = createSupabaseAdminClient();

    // Validate and prepare data
    const validData: SekolahData[] = [];
    const errors: string[] = [];

    for (let i = 0; i < sekolahData.length; i++) {
      const row = sekolahData[i];
      const rowNum = i + 2; // +2 karena row 1 adalah header, dan array index mulai 0

      // Validate required fields
      if (!row.npsn || !row.nama_sekolah || !row.status || !row.jenjang || !row.kabupaten_kota || !row.alamat || !row.kcd_wilayah) {
        errors.push(`Baris ${rowNum}: Semua field harus diisi`);
        continue;
      }

      // Validate KCD Wilayah
      const kcdWilayah = parseInt(row.kcd_wilayah);
      if (isNaN(kcdWilayah) || kcdWilayah < 1 || kcdWilayah > 13) {
        errors.push(`Baris ${rowNum}: KCD Wilayah harus antara 1-13`);
        continue;
      }

      // Validate status
      if (!['Negeri', 'Swasta'].includes(row.status)) {
        errors.push(`Baris ${rowNum}: Status harus 'Negeri' atau 'Swasta'`);
        continue;
      }

      // Validate jenjang
      if (!['SMK', 'SMA', 'SLB'].includes(row.jenjang)) {
        errors.push(`Baris ${rowNum}: Jenjang harus 'SMK', 'SMA', atau 'SLB'`);
        continue;
      }

      validData.push({
        npsn: String(row.npsn).trim(),
        nama_sekolah: String(row.nama_sekolah).trim(),
        status: row.status,
        jenjang: row.jenjang,
        kabupaten_kota: String(row.kabupaten_kota).trim(),
        alamat: String(row.alamat).trim(),
        kcd_wilayah: kcdWilayah
      });
    }

    if (validData.length === 0) {
      return NextResponse.json(
        { 
          error: "Tidak ada data valid untuk diimport",
          errors
        },
        { status: 400 }
      );
    }

    // Check for duplicate NPSN in incoming data
    const npsnSet = new Set<string>();
    const duplicateNPSN: string[] = [];
    validData.forEach((data, index) => {
      if (npsnSet.has(data.npsn)) {
        duplicateNPSN.push(data.npsn);
      } else {
        npsnSet.add(data.npsn);
      }
    });

    if (duplicateNPSN.length > 0) {
      return NextResponse.json(
        { 
          error: `NPSN duplikat ditemukan: ${duplicateNPSN.join(', ')}`,
          errors
        },
        { status: 400 }
      );
    }

    // Check existing NPSN in database
    const npsnList = validData.map(d => d.npsn);
    const { data: existing } = await adminClient
      .from('sekolah')
      .select('npsn')
      .in('npsn', npsnList);

    const existingNPSN = existing?.map(e => e.npsn) || [];
    if (existingNPSN.length > 0) {
      return NextResponse.json(
        { 
          error: `NPSN sudah terdaftar: ${existingNPSN.join(', ')}`,
          errors
        },
        { status: 400 }
      );
    }

    // Insert data
    const { data, error } = await adminClient
      .from('sekolah')
      .insert(
        validData.map(d => ({
          ...d,
          created_by: adminUser.id
        }))
      )
      .select();

    if (error) {
      console.error("Error importing sekolah:", error);
      return NextResponse.json(
        { 
          error: error.message || "Gagal mengimport data sekolah",
          errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: `${validData.length} sekolah berhasil diimport`,
        imported: validData.length,
        errors: errors.length > 0 ? errors : undefined,
        sekolah: data
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in import sekolah route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat mengimport data" },
      { status: 500 }
    );
  }
}

