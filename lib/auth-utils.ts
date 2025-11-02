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
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    // Silently handle refresh token errors - this is normal when user is not logged in
    if (error || !user || !user.email) {
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
    // Silently handle errors - this is normal when user is not logged in
    return null;
  }
}

