import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

/**
 * Create Supabase server client for Node.js runtime
 * Note: In Next.js 16, cookies() returns a Promise, so we need to await it
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    );
  }
  
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          try {
            const cookie = cookieStore.get(name);
            return cookie?.value;
          } catch {
            return undefined;
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Detect if running in production (HTTPS)
            const isProduction = process.env.NODE_ENV === 'production';
            const isSecure = options.secure !== undefined 
              ? options.secure 
              : isProduction;
            
            // Set cookie with proper production settings
            cookieStore.set({ 
              name, 
              value, 
              ...options,
              // Ensure sameSite is set for security
              // Use 'lax' for production, allows cookies in same-site and top-level navigation
              sameSite: options.sameSite || 'lax',
              // Secure flag: true in production (HTTPS), false in development
              secure: isSecure,
              // Ensure path is set (default to root)
              path: options.path || '/',
              // HTTPOnly should be handled by Supabase SSR
              httpOnly: options.httpOnly !== undefined ? options.httpOnly : true,
            });
          } catch (error) {
            // Log cookie errors in development, ignore in production to avoid noise
            if (process.env.NODE_ENV === 'development') {
              console.error('Cookie set error:', error);
            }
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ 
              name, 
              value: '', 
              ...options,
              maxAge: 0,
            });
          } catch {
            // Ignore remove cookie errors
          }
        },
      },
    },
  );
}

