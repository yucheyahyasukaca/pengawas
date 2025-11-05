import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

// GET - Get Excel template as .xlsx file
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

    // Template data for Excel
    const templateData = [
      {
        'NPSN': '20337887',
        'UNIT SEKOLAH': 'SMK NEGERI 1 PUNGGELAN',
        'Status': 'Negeri',
        'Jenjang': 'SMK',
        'Kabupaten/Kota': 'Kabupaten Banjarnegara',
        'Alamat': 'JL. RAYA PASAR MANIS, LOJI, PUNGGELAN, BANJARNEGARA',
        'KCD WILAYAH': '9'
      },
      {
        'NPSN': '69774957',
        'UNIT SEKOLAH': 'SMKN 1 PEJAWARAN',
        'Status': 'Negeri',
        'Jenjang': 'SMK',
        'Kabupaten/Kota': 'Kabupaten Banjarnegara',
        'Alamat': 'Jalan Raya Pejawaran - Batur Km.3, Pejawaran, Banjarnegara',
        'KCD WILAYAH': '9'
      }
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

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
    XLSX.utils.book_append_sheet(wb, ws, 'Template');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Return Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Template_Import_Sekolah.xlsx"',
      },
    });
  } catch (err) {
    console.error("Error in template-excel route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}

