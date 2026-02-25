import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// GET - Get public list of sekolah (no authentication required)
// This endpoint is for registration purposes
export async function GET(request: Request) {
  try {
    // Use admin client to bypass RLS
    // This allows unauthenticated users to see sekolah list for registration
    const adminClient = createSupabaseAdminClient();

    // Always load all data (no search filter on server)
    // Client-side filtering is much faster than server-side search
    let query = adminClient
      .from('sekolah')
      .select('id, npsn, nama_sekolah, status, jenjang, kabupaten_kota, kcd_wilayah, alamat')
      .order('nama_sekolah', { ascending: true })
      .limit(10000); // Increased limit to allow more data for client-side filtering

    const { data, error } = await query;

    if (error) {
      console.error("Error loading sekolah:", error);
      return NextResponse.json(
        { error: error.message || "Gagal memuat data sekolah" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        sekolah: data || [],
        count: (data || []).length
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in public sekolah list route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data" },
      { status: 500 }
    );
  }
}

