import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
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

    // Resolve params if it's a Promise (Next.js 15+)
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    // Parse request body safely
    let body;
    try {
      body = await request.json();
    } catch (err) {
      console.error("Error parsing request body:", err);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { action } = body || {};

    // Log for debugging
    console.log("Sekolah approval request:", { id, action, body });

    // Validate id
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error("Invalid id:", id);
      return NextResponse.json(
        { error: "Invalid request: sekolah user ID is required" },
        { status: 400 }
      );
    }

    // Validate action
    if (!action || typeof action !== 'string' || !['approve', 'reject'].includes(action)) {
      console.error("Invalid action:", action);
      return NextResponse.json(
        { error: `Invalid request: action must be 'approve' or 'reject'. Received: ${action}` },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const adminClient = createSupabaseAdminClient();

    // Verify user is sekolah
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .select('id, role, status_approval, email, metadata')
      .eq('id', id)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (userData.role !== 'sekolah') {
      return NextResponse.json(
        { error: "User is not a sekolah" },
        { status: 400 }
      );
    }

    // Update status approval
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    // Prepare update data
    const updateData: Record<string, any> = {
      status_approval: newStatus,
      updated_at: new Date().toISOString()
    };
    
    // Ensure role is 'sekolah' when approving
    if (action === 'approve' && userData.role !== 'sekolah') {
      updateData.role = 'sekolah';
    }
    
    const { data, error } = await adminClient
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Update approval error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { error: error.message || "Failed to update approval status" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: `Sekolah ${action === 'approve' ? 'disetujui' : 'ditolak'} berhasil`,
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

