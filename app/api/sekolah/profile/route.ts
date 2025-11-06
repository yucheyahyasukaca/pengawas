import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSekolahUser } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

// GET - Get sekolah profile for current user
export async function GET(request: Request) {
  try {
    const sekolahUser = await getSekolahUser();
    
    if (!sekolahUser) {
      return NextResponse.json(
        { error: "Unauthorized: Sekolah access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sekolahId = searchParams.get('sekolah_id');

    // Use admin client to bypass RLS
    const adminClient = createSupabaseAdminClient();

    let query = adminClient.from('sekolah').select('*');

    // If sekolah_id is provided, use it
    if (sekolahId) {
      query = query.eq('id', sekolahId);
    } else {
      // Otherwise, try to find by user metadata or email
      const userSekolahId = sekolahUser.metadata?.sekolah_id;
      if (userSekolahId) {
        query = query.eq('id', userSekolahId);
      } else {
        // Try to find by email
        query = query.eq('email_sekolah', sekolahUser.email);
      }
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { error: "Sekolah tidak ditemukan" },
          { status: 404 }
        );
      }
      console.error("Error loading sekolah profile:", error);
      return NextResponse.json(
        { error: error.message || "Gagal memuat data sekolah" },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/sekolah/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update sekolah profile
export async function PUT(request: Request) {
  try {
    const sekolahUser = await getSekolahUser();
    
    if (!sekolahUser) {
      return NextResponse.json(
        { error: "Unauthorized: Sekolah access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const adminClient = createSupabaseAdminClient();

    // Find sekolah by user metadata or email
    let sekolahId = sekolahUser.metadata?.sekolah_id;
    
    if (!sekolahId) {
      // Try to find by email
      const { data: existingSekolah } = await adminClient
        .from('sekolah')
        .select('id')
        .eq('email_sekolah', sekolahUser.email)
        .single();
      
      if (existingSekolah) {
        sekolahId = existingSekolah.id;
      } else {
        return NextResponse.json(
          { error: "Sekolah tidak ditemukan. Hubungi admin untuk menghubungkan akun Anda dengan sekolah." },
          { status: 404 }
        );
      }
    }

    // Prepare update data (only include allowed fields)
    const updateData: any = {};
    
    // Identitas sekolah fields
    if (body.kepala_sekolah !== undefined) updateData.kepala_sekolah = body.kepala_sekolah;
    if (body.status_akreditasi !== undefined) updateData.status_akreditasi = body.status_akreditasi;
    if (body.jalan !== undefined) updateData.jalan = body.jalan;
    if (body.desa !== undefined) updateData.desa = body.desa;
    if (body.kecamatan !== undefined) updateData.kecamatan = body.kecamatan;
    if (body.nomor_telepon !== undefined) updateData.nomor_telepon = body.nomor_telepon;
    if (body.whatsapp !== undefined) updateData.whatsapp = body.whatsapp;
    if (body.email_sekolah !== undefined) updateData.email_sekolah = body.email_sekolah;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.facebook !== undefined) updateData.facebook = body.facebook;
    if (body.instagram !== undefined) updateData.instagram = body.instagram;
    if (body.tiktok !== undefined) updateData.tiktok = body.tiktok;
    if (body.twitter !== undefined) updateData.twitter = body.twitter;

    // JSONB fields
    if (body.profil_guru !== undefined) updateData.profil_guru = body.profil_guru;
    if (body.profil_tenaga_kependidikan !== undefined) updateData.profil_tenaga_kependidikan = body.profil_tenaga_kependidikan;
    if (body.profil_siswa !== undefined) updateData.profil_siswa = body.profil_siswa;
    if (body.branding_sekolah !== undefined) updateData.branding_sekolah = body.branding_sekolah;
    if (body.kokurikuler !== undefined) updateData.kokurikuler = body.kokurikuler;
    if (body.ekstrakurikuler !== undefined) updateData.ekstrakurikuler = body.ekstrakurikuler;
    if (body.rapor_pendidikan !== undefined) updateData.rapor_pendidikan = body.rapor_pendidikan;

    const { data, error } = await adminClient
      .from('sekolah')
      .update(updateData)
      .eq('id', sekolahId)
      .select()
      .single();

    if (error) {
      console.error("Error updating sekolah profile:", error);
      return NextResponse.json(
        { error: error.message || "Gagal memperbarui data sekolah" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/sekolah/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

