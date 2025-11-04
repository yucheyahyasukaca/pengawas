import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { action } = await request.json();

    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid request: action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Verify user is pengawas
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, role, status_approval')
      .eq('id', id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (userData.role !== 'pengawas') {
      return NextResponse.json(
        { error: "User is not a pengawas" },
        { status: 400 }
      );
    }

    // Update status approval
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    const { data, error } = await supabase
      .from('users')
      .update({ 
        status_approval: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Update approval error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update approval status" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: `Pengawas ${action === 'approve' ? 'disetujui' : 'ditolak'} berhasil`,
        user: data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Approval exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat memproses approval" },
      { status: 500 }
    );
  }
}

