import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  }

  // Validate service role key format (should start with eyJ)
  if (!serviceRoleKey.startsWith('eyJ')) {
    console.error('WARNING: SUPABASE_SERVICE_ROLE_KEY does not look like a valid JWT token');
    console.error('Service role key should start with "eyJ" (JWT format)');
  }

  // Log in production for debugging (without exposing full key)
  if (process.env.NODE_ENV === 'production') {
    console.log('createSupabaseAdminClient:', {
      supabaseUrl: supabaseUrl.substring(0, 30) + '...',
      hasServiceRoleKey: !!serviceRoleKey,
      serviceRoleKeyLength: serviceRoleKey.length,
      serviceRoleKeyPrefix: serviceRoleKey.substring(0, 20) + '...',
    });
  }

  try {
    const client = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
        },
      },
    );

    // Test connection by making a simple query
    // This will help catch invalid credentials early
    if (process.env.NODE_ENV === 'production') {
      // Only log, don't throw - we'll catch errors in actual usage
      Promise.resolve(client.from('users').select('id').limit(1)).then(({ error }) => {
        if (error) {
          console.error('Supabase admin client connection test failed:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
        }
      }).catch(() => {
        // Ignore - will be caught in actual usage
      });
    }

    return client;
  } catch (error) {
    console.error('Error creating Supabase admin client:', error);
    throw error;
  }
}

