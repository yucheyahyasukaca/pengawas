"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

// List email admin yang diizinkan untuk akses admin
const ADMIN_EMAILS = [
  "mkps@garuda-21.com",
  "admin@sip-mkps.id",
];

function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.some(adminEmail => 
    email.toLowerCase() === adminEmail.toLowerCase()
  );
}

/**
 * Check if user is authenticated as admin
 * @returns User info if admin, null otherwise
 */
export async function getAdminUser() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return null;
    }

    if (!isAdminEmail(user.email)) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  } catch (error) {
    console.error("Error getting admin user:", error);
    return null;
  }
}

