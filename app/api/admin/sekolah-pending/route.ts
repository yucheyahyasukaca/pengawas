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
    
    // Get sekolah users with pending/rejected status
    const { data: users, error: usersError } = await adminClient
      .from('users')
      .select('id, email, nama, nip, status_approval, created_at, metadata')
      .eq('role', 'sekolah')
      .in('status_approval', ['pending', 'rejected', 'approved'])
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error("Error loading sekolah users:", usersError);
      return NextResponse.json(
        { error: usersError.message || "Gagal memuat data sekolah" },
        { status: 400 }
      );
    }

    // Get sekolah data for each user
    const sekolahWithData = await Promise.all(
      (users || []).map(async (user) => {
        const sekolahId = user.metadata?.sekolah_id;
        let sekolahData = null;

        if (sekolahId) {
          const { data: sekolah } = await adminClient
            .from('sekolah')
            .select('id, npsn, nama_sekolah, jenjang, kabupaten_kota, alamat, kcd_wilayah')
            .eq('id', sekolahId)
            .single();

          if (sekolah) {
            sekolahData = sekolah;
          }
        }

        return {
          ...user,
          sekolah: sekolahData,
        };
      })
    );

    return NextResponse.json(
      { 
        success: true,
        sekolah: sekolahWithData || [],
        count: (sekolahWithData || []).length,
        pendingCount: (sekolahWithData || []).filter(s => s.status_approval === 'pending').length
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in sekolah-pending route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data" },
      { status: 500 }
    );
  }
}

