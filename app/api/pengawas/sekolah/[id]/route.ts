import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPengawasUser } from "@/lib/auth-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // FIXED: Next.js 16 requires params to be awaited - DO NOT access params.id directly
    const resolvedParams = await params;
    const sekolahId = resolvedParams.id;

    if (!sekolahId) {
      return NextResponse.json(
        { error: "ID sekolah wajib diisi" },
        { status: 400 },
      );
    }

    const pengawasUser = await getPengawasUser();

    if (!pengawasUser) {
      return NextResponse.json(
        { error: "Unauthorized: Pengawas access required" },
        { status: 401 },
      );
    }

    const adminClient = createSupabaseAdminClient();

    const { data, error } = await adminClient
      .from("sekolah")
      .select(
        `
          id,
          npsn,
          nama_sekolah,
          status,
          jenjang,
          kabupaten_kota,
          alamat,
          kcd_wilayah,
          kepala_sekolah,
          status_akreditasi,
          jalan,
          desa,
          kecamatan,
          nomor_telepon,
          whatsapp,
          email_sekolah,
          website,
          facebook,
          instagram,
          tiktok,
          twitter,
          profil_guru,
          profil_tenaga_kependidikan,
          profil_siswa,
          branding_sekolah,
          kokurikuler,
          ekstrakurikuler,
          rapor_pendidikan
        `,
      )
      .eq("id", sekolahId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Sekolah tidak ditemukan" },
          { status: 404 },
        );
      }

      console.error("Error loading sekolah detail for pengawas:", error);
      return NextResponse.json(
        { error: error.message || "Gagal memuat data sekolah" },
        { status: 400 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Sekolah tidak ditemukan" },
        { status: 404 },
      );
    }

    const sekolahBinaanNames = Array.isArray(pengawasUser.metadata?.sekolah_binaan)
      ? pengawasUser.metadata.sekolah_binaan
      : [];

    if (
      sekolahBinaanNames.length > 0 &&
      data.nama_sekolah &&
      !sekolahBinaanNames.includes(data.nama_sekolah)
    ) {
      return NextResponse.json(
        { error: "Sekolah ini tidak termasuk dalam daftar sekolah binaan Anda" },
        { status: 403 },
      );
    }

    // Log profil_guru untuk debugging - lebih detail
    console.log("=== API Response Debug ===");
    console.log("Sekolah ID:", sekolahId);
    console.log("Sekolah Name:", data.nama_sekolah);
    console.log("profil_guru:", JSON.stringify(data.profil_guru, null, 2));
    console.log("profil_guru type:", typeof data.profil_guru);
    console.log("profil_guru is null:", data.profil_guru === null);
    console.log("profil_guru is undefined:", data.profil_guru === undefined);
    
    if (data.profil_guru) {
      console.log("profil_guru keys:", Object.keys(data.profil_guru));
      console.log("profil_guru.detail exists:", 'detail' in data.profil_guru);
      console.log("profil_guru.detail:", data.profil_guru.detail);
      console.log("profil_guru.detail type:", typeof data.profil_guru.detail);
      console.log("profil_guru.detail isArray:", Array.isArray(data.profil_guru.detail));
      if (Array.isArray(data.profil_guru.detail)) {
        console.log("profil_guru.detail length:", data.profil_guru.detail.length);
        if (data.profil_guru.detail.length > 0) {
          console.log("First guru sample:", JSON.stringify(data.profil_guru.detail[0], null, 2));
        }
      }
    } else {
      console.warn("⚠️ profil_guru is NULL or UNDEFINED!");
    }
    console.log("=== End API Response Debug ===");

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error in GET /api/pengawas/sekolah/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
