import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

// GET - Export sekolah to Excel format (JSON)
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

    // Format data for Excel (TSV format - Excel compatible)
    const excelData = (data || []).map(sekolah => ({
      npsn: sekolah.npsn,
      nama_sekolah: sekolah.nama_sekolah,
      status: sekolah.status,
      jenjang: sekolah.jenjang,
      kabupaten_kota: sekolah.kabupaten_kota,
      alamat: sekolah.alamat,
      kcd_wilayah: sekolah.kcd_wilayah,
      // For display in Excel
      'NPSN': sekolah.npsn,
      'UNIT SEKOLAH': sekolah.nama_sekolah,
      'Status': sekolah.status,
      'Jenjang': sekolah.jenjang,
      'Kabupaten/Kota': sekolah.kabupaten_kota,
      'Alamat': sekolah.alamat,
      'KCD WILAYAH': sekolah.kcd_wilayah
    }));

    return NextResponse.json(
      { 
        success: true,
        data: excelData,
        count: excelData.length
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in export sekolah route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat mengekspor data" },
      { status: 500 }
    );
  }
}

