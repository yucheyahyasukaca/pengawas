import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

// GET - Get Excel template
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

    // Template data for Excel (example data)
    const templateData = [
      {
        npsn: '20337887',
        nama_sekolah: 'SMK NEGERI 1 PUNGGELAN',
        status: 'Negeri',
        jenjang: 'SMK',
        kabupaten_kota: 'Kabupaten Banjarnegara',
        alamat: 'JL. RAYA PASAR MANIS, LOJI, PUNGGELAN, BANJARNEGARA',
        kcd_wilayah: 9,
        // For Excel display
        'NPSN': '20337887',
        'UNIT SEKOLAH': 'SMK NEGERI 1 PUNGGELAN',
        'Status': 'Negeri',
        'Jenjang': 'SMK',
        'Kabupaten/Kota': 'Kabupaten Banjarnegara',
        'Alamat': 'JL. RAYA PASAR MANIS, LOJI, PUNGGELAN, BANJARNEGARA',
        'KCD WILAYAH': 9
      },
      {
        npsn: '69774957',
        nama_sekolah: 'SMKN 1 PEJAWARAN',
        status: 'Negeri',
        jenjang: 'SMK',
        kabupaten_kota: 'Kabupaten Banjarnegara',
        alamat: 'Jalan Raya Pejawaran - Batur Km.3, Pejawaran, Banjarnegara',
        kcd_wilayah: 9,
        // For Excel display
        'NPSN': '69774957',
        'UNIT SEKOLAH': 'SMKN 1 PEJAWARAN',
        'Status': 'Negeri',
        'Jenjang': 'SMK',
        'Kabupaten/Kota': 'Kabupaten Banjarnegara',
        'Alamat': 'Jalan Raya Pejawaran - Batur Km.3, Pejawaran, Banjarnegara',
        'KCD WILAYAH': 9
      }
    ];

    return NextResponse.json(
      { 
        success: true,
        template: templateData,
        columns: [
          'NPSN',
          'UNIT SEKOLAH',
          'Status',
          'Jenjang',
          'Kabupaten/Kota',
          'Alamat',
          'KCD WILAYAH'
        ],
        instructions: [
          'Isi data sekolah sesuai format kolom di atas',
          'Status: Negeri atau Swasta',
          'Jenjang: SMK, SMA, atau SLB',
          'KCD WILAYAH: Angka 1 sampai 13',
          'NPSN harus unik (tidak boleh duplikat)'
        ]
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in template route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}

