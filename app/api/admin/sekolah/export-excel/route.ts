import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

// GET - Export sekolah to Excel file (.xlsx)
export async function GET() {
  try {
    // Check admin authentication
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    // Dynamic import xlsx
    const XLSX = await import('xlsx');

    // Use admin client to bypass RLS
    const adminClient = createSupabaseAdminClient();
    
    const { data, error } = await adminClient
      .from('sekolah')
      .select('*')
      .order('nama_sekolah', { ascending: true });

    if (error) {
      console.error("Error exporting sekolah:", error);
      return NextResponse.json(
        { error: error.message || "Gagal mengekspor data sekolah" },
        { status: 400 }
      );
    }

    // Prepare data for Excel
    const excelData = (data || []).map(sekolah => ({
      'NPSN': String(sekolah.npsn || ''),
      'UNIT SEKOLAH': String(sekolah.nama_sekolah || ''),
      'Status': String(sekolah.status || ''),
      'Jenjang': String(sekolah.jenjang || ''),
      'Kabupaten/Kota': String(sekolah.kabupaten_kota || ''),
      'Alamat': String(sekolah.alamat || ''),
      'KCD WILAYAH': String(sekolah.kcd_wilayah || '')
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 12 }, // NPSN
      { wch: 40 }, // UNIT SEKOLAH
      { wch: 10 }, // Status
      { wch: 10 }, // Jenjang
      { wch: 25 }, // Kabupaten/Kota
      { wch: 50 }, // Alamat
      { wch: 12 }  // KCD WILAYAH
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data Sekolah');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Return Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Data_Sekolah_Binaan.xlsx"',
      },
    });
  } catch (err) {
    console.error("Error in export-excel route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat mengekspor data" },
      { status: 500 }
    );
  }
}

