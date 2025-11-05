import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

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
      .from('users')
      .select('id, email, nama, nip, status_approval, created_at, metadata')
      .eq('role', 'pengawas')
      .in('status_approval', ['pending', 'rejected'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error loading pengawas (admin client):", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { error: error.message || "Gagal memuat data pengawas" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        pengawas: data || [],
        count: (data || []).length,
        pendingCount: (data || []).filter(p => p.status_approval === 'pending').length
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in pengawas-pending route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data" },
      { status: 500 }
    );
  }
}

