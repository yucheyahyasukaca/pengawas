import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check environment variables first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables in get-current-user:", {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
      });
      return NextResponse.json(
        { error: "Server configuration error: Missing Supabase credentials" },
        { status: 500 }
      );
    }

    // Get authenticated user from session
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error in get-current-user:", authError);
    }

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
      if (serviceRoleKey) {
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
            console.warn("Admin client failed, falling back to regular client:", adminError);
            // Fallback to regular client
            const { data: regularData, error: regularError } = await supabase
              .from('users')
              .select('role, nama, nip, status_approval, metadata')
              .eq('id', user.id)
              .single();
            
            userData = regularData;
            userError = regularError;
          }
        } catch (adminErr) {
          console.error("Admin client error:", adminErr);
          // Fallback to regular client
          const { data: regularData, error: regularError } = await supabase
            .from('users')
            .select('role, nama, nip, status_approval, metadata')
            .eq('id', user.id)
            .single();
          
          userData = regularData;
          userError = regularError;
        }
      } else {
        console.warn("Service role key not available, using regular client");
        // Use regular client if service role key is not available
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

    if (userError) {
      console.error("User data query error:", userError);
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

