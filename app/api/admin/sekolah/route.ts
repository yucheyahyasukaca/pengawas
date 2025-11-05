import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-utils";

// GET - Get all sekolah
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
      .from('sekolah')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error loading sekolah:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { error: error.message || "Gagal memuat data sekolah" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        sekolah: data || [],
        count: (data || []).length
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in sekolah route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data" },
      { status: 500 }
    );
  }
}

// POST - Create new sekolah
export async function POST(request: Request) {
  try {
    // Check admin authentication
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

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

    // Check if NPSN already exists
    const { data: existing } = await adminClient
      .from('sekolah')
      .select('id')
      .eq('npsn', npsn.trim())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "NPSN sudah terdaftar" },
        { status: 400 }
      );
    }

    const { data, error } = await adminClient
      .from('sekolah')
      .insert({
        npsn: npsn.trim(),
        nama_sekolah: nama_sekolah.trim(),
        status,
        jenjang,
        kabupaten_kota: kabupaten_kota.trim(),
        alamat: alamat.trim(),
        kcd_wilayah: parseInt(kcd_wilayah),
        created_by: adminUser.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating sekolah:", error);
      return NextResponse.json(
        { error: error.message || "Gagal menambahkan sekolah" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Sekolah berhasil ditambahkan",
        sekolah: data
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in POST sekolah route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat menambahkan sekolah" },
      { status: 500 }
    );
  }
}

