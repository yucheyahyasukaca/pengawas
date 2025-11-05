import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

// GET - Get all approved pengawas
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
      .select('id, email, nama, nip, status_approval, created_at, updated_at, metadata')
      .eq('role', 'pengawas')
      .eq('status_approval', 'approved')
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

    // Map data to match frontend format
    const pengawas = (data || []).map((user) => ({
      id: user.id,
      name: user.nama || 'Belum mengisi nama',
      nip: user.nip || '',
      wilayah: user.metadata?.wilayah_tugas || 'Belum diisi',
      jumlahSekolah: Array.isArray(user.metadata?.sekolah_binaan) 
        ? user.metadata.sekolah_binaan.length 
        : 0,
      status: 'Aktif',
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      metadata: user.metadata,
    }));

    return NextResponse.json(
      { 
        success: true,
        pengawas: pengawas,
        count: pengawas.length
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in pengawas route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data" },
      { status: 500 }
    );
  }
}

