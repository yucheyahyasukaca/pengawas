import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { nama, nip, wilayah_tugas, sekolah_binaan } = body;

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

    // Verify user is pengawas
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || !userData || userData.role !== 'pengawas') {
      return NextResponse.json(
        { error: "Unauthorized: Only pengawas can update their profile" },
        { status: 403 }
      );
    }

    // Update profil pengawas
    const metadata: Record<string, any> = {};
    
    if (wilayah_tugas) {
      metadata.wilayah_tugas = wilayah_tugas;
    }
    
    if (sekolah_binaan && Array.isArray(sekolah_binaan)) {
      metadata.sekolah_binaan = sekolah_binaan;
    }

    const updateData: Record<string, any> = {
      nama: nama.trim(),
      ...(nip && nip.trim() && { nip: nip.trim() }),
      ...(Object.keys(metadata).length > 0 && { metadata }),
    };

    const { data, error } = await supabase
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

