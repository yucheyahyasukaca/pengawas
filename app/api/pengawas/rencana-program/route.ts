import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Use admin client to check role (bypass RLS)
    const adminClient = createSupabaseAdminClient();
    const { data: userData, error: userError } = await adminClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData || userData.role !== "pengawas") {
      console.error("Role check failed:", { userError, userData, userId: user.id });
      return NextResponse.json(
        { error: "Forbidden: Only pengawas can access this resource" },
        { status: 403 }
      );
    }

    // Fetch rencana program for this pengawas using admin client to bypass RLS
    const { data: rencanaProgram, error } = await adminClient
      .from("rencana_program")
      .select("*")
      .eq("pengawas_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching rencana program:", error);
      return NextResponse.json(
        { error: "Gagal memuat rencana program" },
        { status: 500 }
      );
    }

    // Transform data to match interface
    const transformedData = (rencanaProgram || []).map((item: any) => ({
      id: item.id,
      periode: item.periode || `Tahun ${new Date(item.created_at).getFullYear()}`,
      tanggal: item.created_at
        ? new Date(item.created_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "-",
      status: item.status || "Draft",
      file: item.file,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return NextResponse.json({ rencanaProgram: transformedData });
  } catch (error) {
    console.error("Error in GET /api/pengawas/rencana-program:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memuat rencana program" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    // Use admin client to check role (bypass RLS)
    const adminClient = createSupabaseAdminClient();
    const { data: userData, error: userError } = await adminClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user data:", userError);
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      );
    }

    if (userData.role !== "pengawas") {
      console.error("Role mismatch:", { expected: "pengawas", actual: userData.role, userId: user.id });
      return NextResponse.json(
        { error: "Forbidden: Only pengawas can create rencana program" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      formData,
      sekolah_ids,
      periode,
    } = body;

    if (!formData) {
      return NextResponse.json(
        { error: "Data form harus diisi" },
        { status: 400 }
      );
    }

    // Insert rencana program to database using admin client to bypass RLS
    const { data: newRencanaProgram, error: insertError } = await adminClient
      .from("rencana_program")
      .insert({
        pengawas_id: user.id,
        periode: periode || `Tahun ${new Date().getFullYear()}`,
        status: "Draft",
        form_data: formData,
        sekolah_ids: sekolah_ids || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting rencana program:", insertError);
      return NextResponse.json(
        { error: "Gagal menyimpan rencana program" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rencanaProgram: {
        id: newRencanaProgram.id,
        periode: newRencanaProgram.periode,
        tanggal: new Date(newRencanaProgram.created_at).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: newRencanaProgram.status,
        created_at: newRencanaProgram.created_at,
        updated_at: newRencanaProgram.updated_at,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/pengawas/rencana-program:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan rencana program" },
      { status: 500 }
    );
  }
}

