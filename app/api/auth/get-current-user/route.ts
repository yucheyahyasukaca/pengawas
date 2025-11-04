import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get authenticated user from session
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user data using admin client to bypass RLS
    let userData = null;
    let userError = null;

    try {
      const adminClient = createSupabaseAdminClient();
      const { data: adminData, error: adminError } = await adminClient
        .from('users')
        .select('role, nama, nip, status_approval, metadata')
        .eq('id', user.id)
        .single();
      
      if (!adminError && adminData) {
        userData = adminData;
      } else {
        // Fallback to regular client
        const { data: regularData, error: regularError } = await supabase
          .from('users')
          .select('role, nama, nip, status_approval, metadata')
          .eq('id', user.id)
          .single();
        
        userData = regularData;
        userError = regularError;
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: userData.role,
        nama: userData.nama || null,
        nip: userData.nip || null,
        status_approval: userData.status_approval || null,
        metadata: userData.metadata || null,
      }
    });
  } catch (err) {
    console.error("Get current user error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

