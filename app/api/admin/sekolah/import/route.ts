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
    console.log('[DEBUG] Import Route - Admin User:', adminUser ? { id: adminUser.id, role: adminUser.role } : 'null');

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

    // Filter duplicate NPSN in incoming data (keep first occurrence, skip duplicates)
    const npsnSet = new Set<string>();
    const duplicateNPSN: string[] = [];
    const dataToInsert: SekolahData[] = [];

    validData.forEach((data, index) => {
      if (npsnSet.has(data.npsn)) {
        duplicateNPSN.push(data.npsn);
        errors.push(`Baris ${index + 2}: NPSN ${data.npsn} duplikat dalam data import (dilewati)`);
      } else {
        npsnSet.add(data.npsn);
        dataToInsert.push(data);
      }
    });

    if (dataToInsert.length === 0) {
      return NextResponse.json(
        {
          error: "Semua data memiliki NPSN duplikat atau tidak valid",
          errors
        },
        { status: 400 }
      );
    }

    // Insert or Update data (Upsert)
    // We use onConflict: 'npsn' to update if NPSN already exists
    const { data: upsertedData, error: upsertError } = await adminClient
      .from('sekolah')
      .upsert(
        dataToInsert.map(d => ({
          ...d,
          created_by: adminUser.id,
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'npsn' }
      )
      .select();

    if (upsertError) {
      console.error("Error upserting sekolah:", upsertError);
      return NextResponse.json(
        {
          error: upsertError.message || "Gagal mengimport/update data sekolah",
          errors
        },
        { status: 400 }
      );
    }

    // Build success message
    const successMessages: string[] = [];
    successMessages.push(`${dataToInsert.length} data sekolah berhasil diproses (tambah/update)`);

    if (duplicateNPSN.length > 0) {
      successMessages.push(`${duplicateNPSN.length} NPSN duplikat dalam file Excel (hanya data pertama yang diambil)`);
    }

    return NextResponse.json(
      {
        success: true,
        message: successMessages.join('. '),
        processed: dataToInsert.length,
        duplicateInFile: duplicateNPSN.length,
        errors: errors.length > 0 ? errors : undefined,
        duplicateNPSNInFile: duplicateNPSN.length > 0 ? Array.from(new Set(duplicateNPSN)) : undefined,
        sekolah: upsertedData
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

