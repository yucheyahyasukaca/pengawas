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
            // Let Supabase SSR handle cookie expiration by default
            // Only add additional settings if not already set
            cookieStore.set({ 
              name, 
              value, 
              ...options,
              // Ensure sameSite is set for security
              sameSite: options.sameSite || 'lax',
              // Ensure secure in production
              secure: options.secure !== undefined 
                ? options.secure 
                : process.env.NODE_ENV === 'production',
            });
          } catch {
            // Ignore set cookie errors
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

