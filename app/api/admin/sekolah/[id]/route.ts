import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

// PUT - Update sekolah
export async function PUT(
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
    const body = await request.json();
    const { npsn, nama_sekolah, status, jenjang, kabupaten_kota, alamat, kcd_wilayah } = body;

    // Validasi
    if (!npsn || !nama_sekolah || !status || !jenjang || !kabupaten_kota || !alamat || !kcd_wilayah) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    if (kcd_wilayah < 1 || kcd_wilayah > 13) {
      return NextResponse.json(
        { error: "KCD Wilayah harus antara 1 sampai 13" },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const adminClient = createSupabaseAdminClient();

    // Check if NPSN already exists (for other records)
    if (npsn) {
      const { data: existing } = await adminClient
        .from('sekolah')
        .select('id')
        .eq('npsn', npsn.trim())
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: "NPSN sudah terdaftar untuk sekolah lain" },
          { status: 400 }
        );
      }
    }

    // Update sekolah
    const { data, error } = await adminClient
      .from('sekolah')
      .update({
        npsn: npsn.trim(),
        nama_sekolah: nama_sekolah.trim(),
        status,
        jenjang,
        kabupaten_kota: kabupaten_kota.trim(),
        alamat: alamat.trim(),
        kcd_wilayah: parseInt(kcd_wilayah),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating sekolah:", error);
      return NextResponse.json(
        { error: error.message || "Gagal mengupdate sekolah" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Sekolah berhasil diupdate",
        sekolah: data
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in PUT sekolah route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat mengupdate sekolah" },
      { status: 500 }
    );
  }
}

// DELETE - Delete sekolah
export async function DELETE(
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

    // Use admin client to bypass RLS
    const adminClient = createSupabaseAdminClient();

    // Delete sekolah
    const { error } = await adminClient
      .from('sekolah')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting sekolah:", error);
      return NextResponse.json(
        { error: error.message || "Gagal menghapus sekolah" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Sekolah berhasil dihapus"
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in DELETE sekolah route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus sekolah" },
      { status: 500 }
    );
  }
}

