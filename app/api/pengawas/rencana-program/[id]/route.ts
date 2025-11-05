import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 requires this)
    const { id: rencanaProgramId } = await params;
    
    if (!rencanaProgramId || rencanaProgramId === "undefined" || rencanaProgramId === "null") {
      return NextResponse.json(
        { error: "ID rencana program tidak valid" },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Fetch specific rencana program using admin client
    const { data: rencanaProgram, error } = await adminClient
      .from("rencana_program")
      .select("*")
      .eq("id", rencanaProgramId)
      .eq("pengawas_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching rencana program:", error);
      
      // Check if it's a not found error (PGRST116) or other error
      if (error.code === "PGRST116" || error.message?.includes("No rows")) {
        return NextResponse.json(
          { error: "Rencana program tidak ditemukan" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error.message || "Gagal memuat rencana program" },
        { status: 500 }
      );
    }

    if (!rencanaProgram) {
      return NextResponse.json(
        { error: "Rencana program tidak ditemukan" },
        { status: 404 }
      );
    }

    // Ensure sekolah_ids is an array
    if (rencanaProgram.sekolah_ids && typeof rencanaProgram.sekolah_ids === "string") {
      try {
        rencanaProgram.sekolah_ids = JSON.parse(rencanaProgram.sekolah_ids);
      } catch (e) {
        rencanaProgram.sekolah_ids = [];
      }
    }

    // Ensure form_data is an object
    if (rencanaProgram.form_data && typeof rencanaProgram.form_data === "string") {
      try {
        rencanaProgram.form_data = JSON.parse(rencanaProgram.form_data);
      } catch (e) {
        rencanaProgram.form_data = {};
      }
    }

    return NextResponse.json({ rencanaProgram });
  } catch (error) {
    console.error("Error in GET /api/pengawas/rencana-program/[id]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memuat rencana program" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 requires this)
    const { id: rencanaProgramId } = await params;
    
    if (!rencanaProgramId || rencanaProgramId === "undefined" || rencanaProgramId === "null") {
      return NextResponse.json(
        { error: "ID rencana program tidak valid" },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      formData,
      sekolah_ids,
      periode,
      status,
    } = body;

    // Update rencana program using admin client
    const { data: updatedRencanaProgram, error: updateError } = await adminClient
      .from("rencana_program")
      .update({
        form_data: formData,
        sekolah_ids: sekolah_ids,
        periode: periode,
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", rencanaProgramId)
      .eq("pengawas_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating rencana program:", updateError);
      return NextResponse.json(
        { error: "Gagal memperbarui rencana program" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rencanaProgram: updatedRencanaProgram,
    });
  } catch (error) {
    console.error("Error in PUT /api/pengawas/rencana-program/[id]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui rencana program" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 16 requires this)
    const { id: rencanaProgramId } = await params;
    
    if (!rencanaProgramId || rencanaProgramId === "undefined" || rencanaProgramId === "null") {
      return NextResponse.json(
        { error: "ID rencana program tidak valid" },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete rencana program using admin client
    const { error: deleteError } = await adminClient
      .from("rencana_program")
      .delete()
      .eq("id", rencanaProgramId)
      .eq("pengawas_id", user.id);

    if (deleteError) {
      console.error("Error deleting rencana program:", deleteError);
      return NextResponse.json(
        { error: "Gagal menghapus rencana program" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/pengawas/rencana-program/[id]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus rencana program" },
      { status: 500 }
    );
  }
}

