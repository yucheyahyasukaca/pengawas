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

    // Filter duplicate NPSN in incoming data (keep first occurrence, skip duplicates)
    const npsnSet = new Set<string>();
    const duplicateNPSN: string[] = [];
    const uniqueValidData: SekolahData[] = [];
    
    validData.forEach((data, index) => {
      if (npsnSet.has(data.npsn)) {
        duplicateNPSN.push(data.npsn);
        errors.push(`Baris ${index + 2}: NPSN ${data.npsn} duplikat dalam data import (dilewati)`);
      } else {
        npsnSet.add(data.npsn);
        uniqueValidData.push(data);
      }
    });

    if (uniqueValidData.length === 0) {
      return NextResponse.json(
        { 
          error: "Semua data memiliki NPSN duplikat atau tidak valid",
          errors
        },
        { status: 400 }
      );
    }

    // Check existing NPSN in database and filter them out
    const npsnList = uniqueValidData.map(d => d.npsn);
    const { data: existing } = await adminClient
      .from('sekolah')
      .select('npsn')
      .in('npsn', npsnList);

    const existingNPSN = new Set(existing?.map(e => e.npsn) || []);
    const dataToInsert: SekolahData[] = [];
    const skippedNPSN: string[] = [];

    uniqueValidData.forEach((data, index) => {
      if (existingNPSN.has(data.npsn)) {
        skippedNPSN.push(data.npsn);
        errors.push(`Baris ${index + 2}: NPSN ${data.npsn} sudah terdaftar di database (dilewati)`);
      } else {
        dataToInsert.push(data);
      }
    });

    if (dataToInsert.length === 0) {
      return NextResponse.json(
        { 
          error: "Semua NPSN sudah terdaftar di database",
          errors,
          skipped: skippedNPSN.length
        },
        { status: 400 }
      );
    }

    // Insert only non-duplicate data
    const { data: insertedData, error: insertError } = await adminClient
      .from('sekolah')
      .insert(
        dataToInsert.map(d => ({
          ...d,
          created_by: adminUser.id
        }))
      )
      .select();

    if (insertError) {
      console.error("Error importing sekolah:", insertError);
      return NextResponse.json(
        { 
          error: insertError.message || "Gagal mengimport data sekolah",
          errors
        },
        { status: 400 }
      );
    }

    // Build success message
    const successMessages: string[] = [];
    successMessages.push(`${dataToInsert.length} sekolah berhasil diimport`);
    
    if (skippedNPSN.length > 0) {
      successMessages.push(`${skippedNPSN.length} NPSN sudah terdaftar (dilewati)`);
    }
    
    if (duplicateNPSN.length > 0) {
      successMessages.push(`${duplicateNPSN.length} NPSN duplikat dalam data (dilewati)`);
    }

    return NextResponse.json(
      { 
        success: true,
        message: successMessages.join('. '),
        imported: dataToInsert.length,
        skipped: skippedNPSN.length,
        duplicate: duplicateNPSN.length,
        errors: errors.length > 0 ? errors : undefined,
        skippedNPSN: skippedNPSN.length > 0 ? skippedNPSN : undefined,
        duplicateNPSN: duplicateNPSN.length > 0 ? Array.from(new Set(duplicateNPSN)) : undefined,
        sekolah: insertedData
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

