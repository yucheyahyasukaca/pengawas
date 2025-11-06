import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Use admin client to check role (bypass RLS)
    const adminClient = createSupabaseAdminClient();
    const { data: userData, error: userError } = await adminClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData || userData.role !== "pengawas") {
      console.error("Role check failed:", { userError, userData, userId: user.id });
      return NextResponse.json(
        { error: "Forbidden: Only pengawas can access this resource" },
        { status: 403 }
      );
    }

    // Fetch rencana program for this pengawas using admin client to bypass RLS
    const { data: rencanaProgram, error } = await adminClient
      .from("rencana_program")
      .select("*")
      .eq("pengawas_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching rencana program:", error);
      return NextResponse.json(
        { error: "Gagal memuat rencana program" },
        { status: 500 }
      );
    }

    // Get all sekolah_ids from rencana programs
    const allSekolahIds: string[] = [];
    (rencanaProgram || []).forEach((item: any) => {
      if (item.sekolah_ids) {
        let sekolahIds = item.sekolah_ids;
        if (typeof sekolahIds === "string") {
          try {
            sekolahIds = JSON.parse(sekolahIds);
          } catch (e) {
            sekolahIds = [];
          }
        }
        if (Array.isArray(sekolahIds)) {
          allSekolahIds.push(...sekolahIds.map(String));
        }
      }
    });

    // Fetch sekolah details for all sekolah_ids
    let sekolahMap: Record<string, any> = {};
    if (allSekolahIds.length > 0) {
      const uniqueSekolahIds = [...new Set(allSekolahIds)];
      const { data: sekolahData, error: sekolahError } = await adminClient
        .from("sekolah")
        .select("id, npsn, nama_sekolah")
        .in("id", uniqueSekolahIds);

      if (!sekolahError && sekolahData) {
        sekolahData.forEach((sekolah: any) => {
          sekolahMap[String(sekolah.id)] = {
            id: sekolah.id,
            npsn: sekolah.npsn,
            nama: sekolah.nama_sekolah,
          };
        });
      }
    }

    // Get current pengawas sekolah binaan from metadata
    const { data: userMetadata, error: userMetadataError } = await adminClient
      .from("users")
      .select("metadata")
      .eq("id", user.id)
      .single();

    let sekolahBinaan: any[] = [];
    if (!userMetadataError && userMetadata?.metadata?.sekolah_binaan) {
      const sekolahBinaanNames = Array.isArray(userMetadata.metadata.sekolah_binaan)
        ? userMetadata.metadata.sekolah_binaan
        : [];

      if (sekolahBinaanNames.length > 0) {
        const { data: sekolahBinaanData, error: sekolahBinaanError } = await adminClient
          .from("sekolah")
          .select("id, npsn, nama_sekolah")
          .in("nama_sekolah", sekolahBinaanNames);

        if (!sekolahBinaanError && sekolahBinaanData) {
          sekolahBinaan = sekolahBinaanData.map((s: any) => ({
            id: s.id,
            npsn: s.npsn,
            nama: s.nama_sekolah,
          }));
        }
      }
    }

    // Transform data to match interface
    const transformedData = (rencanaProgram || []).map((item: any) => {
      let sekolahIds = item.sekolah_ids;
      if (typeof sekolahIds === "string") {
        try {
          sekolahIds = JSON.parse(sekolahIds);
        } catch (e) {
          sekolahIds = [];
        }
      }
      if (!Array.isArray(sekolahIds)) {
        sekolahIds = [];
      }

      const sekolahList = sekolahIds
        .map(String)
        .map((id: string) => sekolahMap[id])
        .filter((s: any) => s !== undefined);

      return {
        id: item.id,
        periode: item.periode || `Tahun ${new Date(item.created_at).getFullYear()}`,
        tanggal: item.created_at
          ? new Date(item.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "-",
        status: item.status || "Draft",
        file: item.file,
        created_at: item.created_at,
        updated_at: item.updated_at,
        sekolah_ids: sekolahIds,
        sekolah: sekolahList,
      };
    });

    // Get sekolah yang belum mendapat rencana program
    const sekolahIdsWithRencana = new Set(allSekolahIds.map(String));
    const sekolahBelumRencana = sekolahBinaan.filter(
      (s) => !sekolahIdsWithRencana.has(String(s.id))
    );

    return NextResponse.json({
      rencanaProgram: transformedData,
      sekolahBinaan: sekolahBinaan,
      sekolahBelumRencana: sekolahBelumRencana,
    });
  } catch (error) {
    console.error("Error in GET /api/pengawas/rencana-program:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memuat rencana program" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    // Use admin client to check role (bypass RLS)
    const adminClient = createSupabaseAdminClient();
    const { data: userData, error: userError } = await adminClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user data:", userError);
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      );
    }

    if (userData.role !== "pengawas") {
      console.error("Role mismatch:", { expected: "pengawas", actual: userData.role, userId: user.id });
      return NextResponse.json(
        { error: "Forbidden: Only pengawas can create rencana program" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      formData,
      sekolah_ids,
      periode,
    } = body;

    if (!formData) {
      return NextResponse.json(
        { error: "Data form harus diisi" },
        { status: 400 }
      );
    }

    // Insert rencana program to database using admin client to bypass RLS
    const { data: newRencanaProgram, error: insertError } = await adminClient
      .from("rencana_program")
      .insert({
        pengawas_id: user.id,
        periode: periode || `Tahun ${new Date().getFullYear()}`,
        status: "Draft",
        form_data: formData,
        sekolah_ids: sekolah_ids || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting rencana program:", insertError);
      return NextResponse.json(
        { error: "Gagal menyimpan rencana program" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rencanaProgram: {
        id: newRencanaProgram.id,
        periode: newRencanaProgram.periode,
        tanggal: new Date(newRencanaProgram.created_at).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: newRencanaProgram.status,
        created_at: newRencanaProgram.created_at,
        updated_at: newRencanaProgram.updated_at,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/pengawas/rencana-program:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan rencana program" },
      { status: 500 }
    );
  }
}

