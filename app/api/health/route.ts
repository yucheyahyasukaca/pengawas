import { NextResponse } from "next/server";

/**
 * Health check endpoint
 * Useful for diagnosing server configuration issues
 */
export async function GET() {
  try {
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nodeEnv: process.env.NODE_ENV,
      supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) || 'NOT SET',
    };

    const isHealthy = 
      envCheck.hasSupabaseUrl && 
      envCheck.hasSupabaseKey && 
      envCheck.hasServiceRoleKey;

    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      message: isHealthy 
        ? 'Server is configured correctly' 
        : 'Server is missing required environment variables',
    }, {
      status: isHealthy ? 200 : 503,
    });
  } catch (err) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: err instanceof Error ? err.message : 'Unknown error',
    }, {
      status: 500,
    });
  }
}

