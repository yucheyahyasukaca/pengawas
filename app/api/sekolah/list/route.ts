import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// GET - Get list of sekolah for pengawas (read-only, bypasses RLS for pending users)
export async function GET(request: Request) {
  try {
    // Get authenticated user from session
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }
    
    // Get search query from URL params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    // Use admin client to bypass RLS for pending pengawas
    // This allows pending pengawas to select schools during registration
    const adminClient = createSupabaseAdminClient();
    
    // Always load all data (no search filter on server)
    // Client-side filtering is much faster than server-side search
    let query = adminClient
      .from('sekolah')
      .select('id, npsn, nama_sekolah, status, jenjang, kabupaten_kota, kcd_wilayah')
      .order('nama_sekolah', { ascending: true })
      .limit(500); // Increased limit to allow more data for client-side filtering
    
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
    console.error("Error in sekolah list route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data" },
      { status: 500 }
    );
  }
}

