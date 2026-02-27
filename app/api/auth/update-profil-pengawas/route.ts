import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const {
      nama,
      nip,
      wilayah_tugas,
      wilayah_tugas_kcd,
      sekolah_binaan,
      pangkat_golongan,
      jabatan,
      no_handphone,
      tempat_lahir,
      tanggal_lahir,
      alamat_rumah,
      keahlian
    } = body;

    // Validasi input
    if (!nama) {
      return NextResponse.json(
        { error: "Nama lengkap harus diisi" },
        { status: 400 }
      );
    }

    // Get Supabase server client
    const supabase = await createSupabaseServerClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized: Please login first" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Verify user is pengawas using admin client to bypass RLS
    // This allows pending pengawas to update their profile
    const adminClient = createSupabaseAdminClient();
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .select('role, metadata')
      .eq('id', userId)
      .single();

    if (userError || !userData || userData.role !== 'pengawas') {
      return NextResponse.json(
        { error: "Unauthorized: Only pengawas can update their profile" },
        { status: 403 }
      );
    }

    // Update profil pengawas
    // Fetch existing metadata first to avoid overwriting (e.g., foto_profil)
    const currentMetadata = userData.metadata || {};

    // Merge existing metadata with new updates
    const updatedMetadata = {
      ...currentMetadata,
      ...(wilayah_tugas && { wilayah_tugas }),
      ...(wilayah_tugas_kcd && Array.isArray(wilayah_tugas_kcd) && { wilayah_tugas_kcd }),
      ...(sekolah_binaan && Array.isArray(sekolah_binaan) && { sekolah_binaan }),
      ...(pangkat_golongan && { pangkat_golongan }),
      ...(jabatan && { jabatan }),
      ...(no_handphone !== undefined && { no_handphone }),
      ...(tempat_lahir !== undefined && { tempat_lahir }),
      ...(tanggal_lahir !== undefined && { tanggal_lahir }),
      ...(alamat_rumah !== undefined && { alamat_rumah }),
      ...(keahlian !== undefined && Array.isArray(keahlian) && { keahlian }),
    };

    const updateData: Record<string, any> = {
      nama: nama.trim(),
      ...(nip && nip.trim() && { nip: nip.trim() }),
      metadata: updatedMetadata,
    };

    // Use admin client to update profile to bypass RLS for pending pengawas
    const { data, error } = await adminClient
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error("Update profil error:", error);
      return NextResponse.json(
        { error: error.message || "Gagal mengupdate profil" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profil berhasil diupdate",
        user: data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update profil exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat update profil" },
      { status: 500 }
    );
  }
}

