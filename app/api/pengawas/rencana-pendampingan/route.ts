import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("GET /api/pengawas/rencana-pendampingan - Starting");
    
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("User authenticated:", user.id);

    // Use admin client to check role (bypass RLS)
    let adminClient;
    try {
      adminClient = createSupabaseAdminClient();
    } catch (clientError: any) {
      console.error("Error creating admin client:", clientError);
      return NextResponse.json(
        { 
          error: "Server configuration error",
          details: clientError.message || "Failed to create admin client"
        },
        { status: 500 }
      );
    }

    const { data: userData, error: userError } = await adminClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return NextResponse.json(
        { 
          error: "Gagal memuat data pengguna", 
          details: userError.message,
          code: userError.code
        },
        { status: 500 }
      );
    }

    if (!userData || userData.role !== "pengawas") {
      console.log("User role check failed:", { userData, role: userData?.role });
      return NextResponse.json(
        { error: "Forbidden: Only pengawas can access this resource" },
        { status: 403 }
      );
    }

    console.log("User role verified as pengawas");

    // Get query parameters for filtering by date range
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    console.log("Query parameters:", { year, month, userId: user.id });

    // Build query - fetch rencana pendampingan first
    let query = adminClient
      .from("rencana_pendampingan")
      .select("*")
      .eq("pengawas_id", user.id)
      .order("tanggal", { ascending: false });

    // Filter by year and month if provided
    // Note: month from frontend is 1-indexed (1-12)
    if (year) {
      const yearNum = parseInt(year);
      const monthNum = month ? parseInt(month) : null;
      
      if (monthNum && monthNum >= 1 && monthNum <= 12) {
        // Get the last day of the month
        // monthNum is 1-indexed (1-12) from frontend
        // JavaScript Date constructor uses 0-indexed months (0-11)
        // new Date(year, month, 0) gives the last day of the previous month
        // So for monthNum=11 (November in 1-indexed):
        //   - new Date(2025, 11, 0) = last day of November (month 11 in 0-indexed) = 30
        //   - new Date(2025, 10, 0) = last day of October (month 10 in 0-indexed) = 31
        // Therefore: new Date(yearNum, monthNum, 0) gives last day of monthNum
        // Get last day of the month
        // monthNum is 1-indexed (1-12), JavaScript Date uses 0-indexed (0-11)
        // For monthNum=11 (November in 1-indexed):
        //   - JavaScript Date month 11 = December (0-indexed)
        //   - new Date(2025, 11, 0) = last day of November = 30
        //   - new Date(2025, 12, 0) = last day of December = 31
        // So we use: new Date(yearNum, monthNum, 0).getDate() to get last day of monthNum
        const lastDay = new Date(yearNum, monthNum, 0).getDate();
        
        // Double-check: verify the calculated date is correct
        // Parse the month and day from the calculated date
        const testDate = new Date(yearNum, monthNum - 1, lastDay);
        const actualMonth = testDate.getMonth() + 1; // Convert back to 1-indexed
        const actualDay = testDate.getDate();
        
        if (actualMonth !== monthNum || actualDay !== lastDay) {
          console.error("Date calculation mismatch:", {
            yearNum,
            monthNum,
            lastDay,
            actualMonth,
            actualDay,
            testDate: testDate.toISOString()
          });
          return NextResponse.json(
            { error: "Invalid date range calculated" },
            { status: 500 }
          );
        }
        
        const startDate = `${year}-${String(monthNum).padStart(2, "0")}-01`;
        const endDate = `${year}-${String(monthNum).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
        
        // Validate that endDate string matches the expected format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(endDate)) {
          console.error("Invalid endDate format:", endDate);
          return NextResponse.json(
            { error: "Invalid date format" },
            { status: 500 }
          );
        }
        
        // Validate that the date is actually valid (not like 2025-11-31)
        const [yearStr, monthStr, dayStr] = endDate.split('-');
        const parsedYear = parseInt(yearStr);
        const parsedMonth = parseInt(monthStr);
        const parsedDay = parseInt(dayStr);
        
        if (parsedMonth !== monthNum || parsedDay !== lastDay || parsedYear !== yearNum) {
          console.error("Date validation failed:", {
            endDate,
            expected: { yearNum, monthNum, lastDay },
            parsed: { parsedYear, parsedMonth, parsedDay }
          });
          return NextResponse.json(
            { error: "Invalid date validation" },
            { status: 500 }
          );
        }
        
        console.log("Date filter:", { yearNum, monthNum, lastDay, startDate, endDate });
        
        query = query.gte("tanggal", startDate).lte("tanggal", endDate);
      } else {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        query = query.gte("tanggal", startDate).lte("tanggal", endDate);
      }
    }

    console.log("Executing query for rencana_pendampingan");
    const { data: rencanaPendampingan, error } = await query;

    if (error) {
      console.error("Error fetching rencana pendampingan:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      
      // If table doesn't exist, return empty array instead of error
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("Table rencana_pendampingan does not exist yet, returning empty array");
        return NextResponse.json({
          success: true,
          rencanaPendampingan: [],
        });
      }
      
      return NextResponse.json(
        { 
          error: "Gagal memuat rencana pendampingan", 
          details: error.message || "Unknown error",
          code: error.code || "UNKNOWN",
          hint: error.hint || null
        },
        { status: 500 }
      );
    }

    console.log("Rencana pendampingan fetched:", rencanaPendampingan?.length || 0, "items");

    // Fetch sekolah data for all sekolah_ids
    const sekolahIds = [...new Set((rencanaPendampingan || []).map((r: any) => r.sekolah_id).filter(Boolean))];
    let sekolahMap: Record<string, any> = {};
    
    if (sekolahIds.length > 0) {
      try {
        const { data: sekolahData, error: sekolahError } = await adminClient
          .from("sekolah")
          .select("id, nama_sekolah, npsn")
          .in("id", sekolahIds);
        
        if (sekolahError) {
          console.error("Error fetching sekolah data:", sekolahError);
        } else if (sekolahData) {
          sekolahMap = sekolahData.reduce((acc: Record<string, any>, sekolah: any) => {
            acc[sekolah.id] = sekolah;
            return acc;
          }, {});
        }
      } catch (sekolahErr) {
        console.error("Exception fetching sekolah data:", sekolahErr);
        // Continue without sekolah data
      }
    }

    // Transform data
    const transformedData = (rencanaPendampingan || []).map((item: any) => ({
      id: item.id,
      tanggal: item.tanggal,
      sekolah_id: item.sekolah_id,
      sekolah_nama: sekolahMap[item.sekolah_id]?.nama_sekolah || "",
      indikator_utama: item.indikator_utama,
      akar_masalah: item.akar_masalah,
      kegiatan_benahi: item.kegiatan_benahi,
      penjelasan_implementasi: Array.isArray(item.penjelasan_implementasi)
        ? item.penjelasan_implementasi
        : [],
      apakah_kegiatan: item.apakah_kegiatan,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return NextResponse.json({
      success: true,
      rencanaPendampingan: transformedData,
    });
  } catch (error: any) {
    console.error("Error in GET /api/pengawas/rencana-pendampingan:", error);
    console.error("Error stack:", error?.stack);
    return NextResponse.json(
      { 
        error: "Terjadi kesalahan saat memuat rencana pendampingan",
        details: error?.message || "Unknown error",
        type: error?.name || "Unknown"
      },
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
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      );
    }

    if (userData.role !== "pengawas") {
      return NextResponse.json(
        { error: "Forbidden: Only pengawas can create rencana pendampingan" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      tanggal,
      sekolah_id,
      indikator_utama,
      akar_masalah,
      kegiatan_benahi,
      penjelasan_implementasi,
      apakah_kegiatan,
    } = body;

    // Validation
    if (!tanggal) {
      return NextResponse.json(
        { error: "Tanggal harus diisi" },
        { status: 400 }
      );
    }

    if (!sekolah_id) {
      return NextResponse.json(
        { error: "Sekolah harus dipilih" },
        { status: 400 }
      );
    }

    if (!indikator_utama) {
      return NextResponse.json(
        { error: "Indikator utama harus dipilih" },
        { status: 400 }
      );
    }

    if (!akar_masalah || !akar_masalah.trim()) {
      return NextResponse.json(
        { error: "Akar masalah harus diisi" },
        { status: 400 }
      );
    }

    if (!kegiatan_benahi || !kegiatan_benahi.trim()) {
      return NextResponse.json(
        { error: "Kegiatan benahi harus diisi" },
        { status: 400 }
      );
    }

    if (!penjelasan_implementasi || !Array.isArray(penjelasan_implementasi) || penjelasan_implementasi.length === 0) {
      return NextResponse.json(
        { error: "Penjelasan implementasi kegiatan harus diisi minimal satu" },
        { status: 400 }
      );
    }

    // Insert rencana pendampingan to database
    const { data: newRencanaPendampingan, error: insertError } = await adminClient
      .from("rencana_pendampingan")
      .insert({
        pengawas_id: user.id,
        tanggal: tanggal,
        sekolah_id: sekolah_id,
        indikator_utama: indikator_utama.trim(),
        akar_masalah: akar_masalah.trim(),
        kegiatan_benahi: kegiatan_benahi.trim(),
        penjelasan_implementasi: penjelasan_implementasi.filter((p: string) => p.trim()),
        apakah_kegiatan: apakah_kegiatan ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("Error inserting rencana pendampingan:", insertError);
      return NextResponse.json(
        { error: "Gagal menyimpan rencana pendampingan", details: insertError.message },
        { status: 500 }
      );
    }

    // Fetch sekolah data
    let sekolahNama = "";
    try {
      const { data: sekolahData, error: sekolahError } = await adminClient
        .from("sekolah")
        .select("id, nama_sekolah")
        .eq("id", sekolah_id)
        .single();

      if (!sekolahError && sekolahData) {
        sekolahNama = sekolahData.nama_sekolah || "";
      }
    } catch (sekolahErr) {
      console.error("Error fetching sekolah data:", sekolahErr);
      // Continue without sekolah name
    }

    return NextResponse.json({
      success: true,
      rencanaPendampingan: {
        id: newRencanaPendampingan.id,
        tanggal: newRencanaPendampingan.tanggal,
        sekolah_id: newRencanaPendampingan.sekolah_id,
        sekolah_nama: sekolahNama,
        indikator_utama: newRencanaPendampingan.indikator_utama,
        akar_masalah: newRencanaPendampingan.akar_masalah,
        kegiatan_benahi: newRencanaPendampingan.kegiatan_benahi,
        penjelasan_implementasi: Array.isArray(newRencanaPendampingan.penjelasan_implementasi)
          ? newRencanaPendampingan.penjelasan_implementasi
          : [],
        apakah_kegiatan: newRencanaPendampingan.apakah_kegiatan,
        created_at: newRencanaPendampingan.created_at,
        updated_at: newRencanaPendampingan.updated_at,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/pengawas/rencana-pendampingan:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan rencana pendampingan" },
      { status: 500 }
    );
  }
}

