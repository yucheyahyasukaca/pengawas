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

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    const search = searchParams.get('q');

    // Use admin client to bypass RLS for pending pengawas
    // This allows pending pengawas to select schools during registration
    let adminClient;
    try {
      adminClient = createSupabaseAdminClient();
    } catch (adminClientError) {
      console.error("Critical: Failed to create admin client:", adminClientError);
      return NextResponse.json(
        { error: "Configuration Error: Admin client creation failed" },
        { status: 500 }
      );
    }

    // Build query
    let query = adminClient
      .from('sekolah')
      .select('id, npsn, nama_sekolah, status, jenjang, kabupaten_kota, kcd_wilayah, alamat');

    // Apply filtering
    if (ids) {
      const idList = ids.split(',').map(id => id.trim());
      if (idList.length > 0) {
        query = query.in('id', idList);
      }
    } else if (search) {
      query = query.ilike('nama_sekolah', `%${search}%`).limit(20);
    } else {
      // Only limit if loading all (no specific IDs requested)
      query = query.order('nama_sekolah', { ascending: true }).limit(500);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error loading sekolah from DB:", error);
      return NextResponse.json(
        { error: error.message || "Gagal memuat data sekolah" },
        { status: 400 }
      );
    }

    // Log success
    // console.log(`Successfully fetched ${data?.length} schools`);

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

