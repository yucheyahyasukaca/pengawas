import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

// Static import xlsx for server-side API route
// @ts-ignore - xlsx might not have types
import * as XLSX from 'xlsx';

// POST - Parse Excel file
export async function POST(request: Request) {
  try {
    console.log("Parse Excel: Starting request...");
    
    // Check admin authentication
    const adminUser = await getAdminUser();
    if (!adminUser) {
      console.log("Parse Excel: Unauthorized");
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    console.log("Parse Excel: Admin authenticated, xlsx library ready");

    console.log("Parse Excel: Getting form data...");
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log("Parse Excel: No file found");
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    console.log("Parse Excel: File found, reading as ArrayBuffer...", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Read file as ArrayBuffer for Excel files
    const arrayBuffer = await file.arrayBuffer();
    console.log("Parse Excel: ArrayBuffer read, parsing Excel...");
    
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    console.log("Parse Excel: Workbook parsed, sheet names:", workbook.SheetNames);
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json(
        { error: "File Excel tidak memiliki sheet" },
        { status: 400 }
      );
    }

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    if (!jsonData || jsonData.length === 0) {
      return NextResponse.json(
        { error: "File Excel tidak valid atau kosong. Pastikan file memiliki header dan data." },
        { status: 400 }
      );
    }

    // Expected headers
    const expectedHeaders = ['NPSN', 'UNIT SEKOLAH', 'Status', 'Jenjang', 'Kabupaten/Kota', 'Alamat', 'KCD WILAYAH'];
    
    // Check if all required headers are present
    const firstRow = jsonData[0] as any;
    const missingHeaders = expectedHeaders.filter(h => {
      const found = Object.keys(firstRow).find(k => k.toLowerCase() === h.toLowerCase());
      return !found;
    });

    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `Kolom yang diperlukan tidak ditemukan: ${missingHeaders.join(', ')}` },
        { status: 400 }
      );
    }

    // Parse data rows
    const data: any[] = [];
    const errors: string[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as any;
      
      // Find headers by case-insensitive match
      const headerMap: Record<string, string> = {};
      expectedHeaders.forEach(expected => {
        const found = Object.keys(row).find(k => k.toLowerCase() === expected.toLowerCase());
        if (found) {
          headerMap[expected] = found;
        }
      });

      // Map to expected format
      const mappedRow: any = {
        npsn: String(row[headerMap['NPSN']] || '').trim(),
        nama_sekolah: String(row[headerMap['UNIT SEKOLAH']] || '').trim(),
        status: String(row[headerMap['Status']] || '').trim(),
        jenjang: String(row[headerMap['Jenjang']] || '').trim(),
        kabupaten_kota: String(row[headerMap['Kabupaten/Kota']] || '').trim(),
        alamat: String(row[headerMap['Alamat']] || '').trim(),
        kcd_wilayah: String(row[headerMap['KCD WILAYAH']] || '').trim()
      };

      // Validate
      if (!mappedRow.npsn || !mappedRow.nama_sekolah) {
        errors.push(`Baris ${i + 2}: NPSN dan Nama Sekolah harus diisi`);
        continue;
      }

      // Validate KCD Wilayah
      const kcdWilayah = parseInt(mappedRow.kcd_wilayah);
      if (isNaN(kcdWilayah) || kcdWilayah < 1 || kcdWilayah > 13) {
        errors.push(`Baris ${i + 2}: KCD WILAYAH harus antara 1-13`);
        continue;
      }
      mappedRow.kcd_wilayah = kcdWilayah;

      // Validate status
      if (mappedRow.status && !['Negeri', 'Swasta'].includes(mappedRow.status)) {
        errors.push(`Baris ${i + 2}: Status harus 'Negeri' atau 'Swasta'`);
        continue;
      }

      // Validate jenjang
      if (mappedRow.jenjang && !['SMK', 'SMA', 'SLB'].includes(mappedRow.jenjang)) {
        errors.push(`Baris ${i + 2}: Jenjang harus 'SMK', 'SMA', atau 'SLB'`);
        continue;
      }

      data.push(mappedRow);
    }

    if (data.length === 0) {
      return NextResponse.json(
        { 
          error: "Tidak ada data valid untuk diimport",
          errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        data,
        count: data.length,
        errors: errors.length > 0 ? errors : undefined
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error parsing Excel:", err);
    console.error("Error details:", {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
      code: err?.code
    });
    return NextResponse.json(
      { 
        error: err instanceof Error ? err.message : "Terjadi kesalahan saat memparse file",
        details: err?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

