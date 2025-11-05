import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser, getAdminUser } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

/**
 * Debug endpoint untuk troubleshooting authentication issues
 * GET /api/debug/auth
 */
export async function GET() {
  try {
    const debugInfo: Record<string, any> = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) || 'NOT SET',
      },
      cookies: {},
      auth: {},
      database: {},
    };

    // Check cookies
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      
      // Get all Supabase auth cookies
      const authCookies: string[] = [];
      cookieStore.getAll().forEach(cookie => {
        if (cookie.name.includes('sb-') || cookie.name.includes('auth')) {
          authCookies.push(cookie.name);
          debugInfo.cookies[cookie.name] = {
            exists: true,
            hasValue: !!cookie.value,
            valueLength: cookie.value?.length || 0,
            // Don't log actual value for security
          };
        }
      });
      
      debugInfo.cookies.totalAuthCookies = authCookies.length;
      debugInfo.cookies.authCookieNames = authCookies;
    } catch (cookieError) {
      debugInfo.cookies.error = cookieError instanceof Error ? cookieError.message : 'Unknown error';
    }

    // Check Supabase server client
    try {
      const supabase = await createSupabaseServerClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      debugInfo.auth = {
        hasUser: !!user,
        userEmail: user?.email || null,
        userId: user?.id || null,
        hasError: !!authError,
        errorMessage: authError?.message || null,
        errorCode: authError?.code || null,
      };
    } catch (authErr) {
      debugInfo.auth.error = authErr instanceof Error ? authErr.message : 'Unknown error';
    }

    // Check getCurrentUser
    try {
      const currentUser = await getCurrentUser();
      debugInfo.database.currentUser = {
        exists: !!currentUser,
        email: currentUser?.email || null,
        role: currentUser?.role || null,
        id: currentUser?.id || null,
        statusApproval: currentUser?.status_approval || null,
      };
    } catch (currentUserErr) {
      debugInfo.database.currentUserError = currentUserErr instanceof Error ? currentUserErr.message : 'Unknown error';
    }

    // Check getAdminUser
    try {
      const adminUser = await getAdminUser();
      debugInfo.database.adminUser = {
        exists: !!adminUser,
        email: adminUser?.email || null,
        role: adminUser?.role || null,
        id: adminUser?.id || null,
      };
    } catch (adminUserErr) {
      debugInfo.database.adminUserError = adminUserErr instanceof Error ? adminUserErr.message : 'Unknown error';
    }

    // Check database connection
    try {
      const adminClient = createSupabaseAdminClient();
      const { data, error } = await adminClient
        .from('users')
        .select('id, email, role')
        .limit(1);
      
      debugInfo.database.connection = {
        canConnect: !error,
        error: error?.message || null,
        hasData: !!data && data.length > 0,
        sampleUser: data?.[0] ? {
          id: data[0].id,
          email: data[0].email,
          role: data[0].role,
        } : null,
      };
    } catch (dbErr) {
      debugInfo.database.connectionError = dbErr instanceof Error ? dbErr.message : 'Unknown error';
    }

    return NextResponse.json(debugInfo, { status: 200 });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

