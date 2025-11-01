// Update this file with the generated types from Supabase once the schema is ready.
// Run the following command after setting up your Supabase project:
// npx supabase gen types typescript --project-id "<project_ref>" --schema public > lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

