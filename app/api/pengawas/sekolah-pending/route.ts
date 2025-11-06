import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getPengawasUser } from "@/lib/auth-utils";

export async function GET() {
  try {
    // Check pengawas authentication
    const pengawasUser = await getPengawasUser();
    if (!pengawasUser) {
      return NextResponse.json(
        { error: "Unauthorized: Pengawas access required" },
        { status: 401 }
      );
    }

    // Get sekolah binaan from pengawas metadata
    const sekolahBinaan = pengawasUser.metadata?.sekolah_binaan || [];
    const sekolahNames = Array.isArray(sekolahBinaan) ? sekolahBinaan : [];

    if (sekolahNames.length === 0) {
      return NextResponse.json(
        { 
          success: true,
          sekolah: [],
          count: 0,
          pendingCount: 0
        },
        { status: 200 }
      );
    }

    // Use admin client to bypass RLS
    const adminClient = createSupabaseAdminClient();
    
    // Get sekolah users with pending/rejected status
    const { data: users, error: usersError } = await adminClient
      .from('users')
      .select('id, email, nama, nip, status_approval, created_at, metadata')
      .eq('role', 'sekolah')
      .in('status_approval', ['pending', 'rejected'])
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error("Error loading sekolah users:", usersError);
      return NextResponse.json(
        { error: usersError.message || "Gagal memuat data sekolah" },
        { status: 400 }
      );
    }

    // Filter and get sekolah data for each user
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

    // Filter only sekolah that are in pengawas's binaan
    const filteredSekolah = sekolahWithData.filter((item) => {
      if (!item.sekolah) return false;
      return sekolahNames.includes(item.sekolah.nama_sekolah);
    });

    return NextResponse.json(
      { 
        success: true,
        sekolah: filteredSekolah || [],
        count: (filteredSekolah || []).length,
        pendingCount: (filteredSekolah || []).filter(s => s.status_approval === 'pending').length
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in pengawas sekolah-pending route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data" },
      { status: 500 }
    );
  }
}

