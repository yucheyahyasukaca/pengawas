"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type UserRole = 'admin' | 'pengawas' | 'korwas_cabdin' | 'sekolah';

export interface UserWithRole {
  id: string;
  email: string;
  role: UserRole;
  nama?: string;
  nip?: string;
  status_approval?: 'pending' | 'approved' | 'rejected';
  metadata?: Record<string, any>;
}

/**
 * Get current user with role from database
 * @returns User info with role, null if not authenticated
 */
export async function getCurrentUser(): Promise<UserWithRole | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    // Log for debugging
    console.log('getCurrentUser:', {
      hasUser: !!user,
      userEmail: user?.email,
      hasError: !!error,
      errorMessage: error?.message,
      errorCode: error?.code,
    });

    // Silently handle refresh token errors - this is normal when user is not logged in
    if (error || !user || !user.email) {
      if (process.env.NODE_ENV === 'production' && error) {
        console.error('getCurrentUser error:', {
          message: error.message,
          code: error.code,
          status: error.status,
        });
      }
      return null;
    }

    // Try to get user role from database using admin client to bypass RLS
    // Fallback to regular client if admin client fails
    let userData = null;
    let userError = null;

    try {
      // First try with admin client to bypass RLS
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
      // If admin client fails, try regular client
      const { data: regularData, error: regularError } = await supabase
        .from('users')
        .select('role, nama, nip, status_approval, metadata')
        .eq('id', user.id)
        .single();

      userData = regularData;
      userError = regularError;
    }

    if (userError || !userData) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      role: userData.role as UserRole,
      nama: userData.nama || undefined,
      nip: userData.nip || undefined,
      status_approval: userData.status_approval || undefined,
      metadata: userData.metadata || undefined,
    };
  } catch (error) {
    // Silently handle errors - this is normal when user is not logged in
    return null;
  }
}

/**
 * Check if user is authenticated as admin
 * @returns User info if admin, null otherwise
 */
export async function getAdminUser(): Promise<UserWithRole | null> {
  const user = await getCurrentUser();

  // Log for debugging in production
  if (process.env.NODE_ENV === 'production') {
    console.log('getAdminUser:', {
      hasUser: !!user,
      userEmail: user?.email,
      userRole: user?.role,
      isAdmin: user?.role === 'admin',
    });
  }

  if (user && user.role === 'admin') {
    return user;
  }

  if (process.env.NODE_ENV === 'production' && user) {
    console.warn('getAdminUser: User found but not admin:', {
      email: user.email,
      role: user.role,
    });
  }

  return null;
}

/**
 * Check if user is authenticated as pengawas and approved
 * @returns User info if pengawas and approved, null otherwise
 */
export async function getPengawasUser(): Promise<UserWithRole | null> {
  const user = await getCurrentUser();
  if (user && user.role === 'pengawas' && user.status_approval === 'approved') {
    return user;
  }
  return null;
}

/**
 * Check if user is authenticated as korwas cabdin
 * @returns User info if korwas cabdin, null otherwise
 */
export async function getKorwasCabdinUser(): Promise<UserWithRole | null> {
  const user = await getCurrentUser();
  if (user && user.role === 'korwas_cabdin') {
    return user;
  }
  return null;
}

/**
 * Check if user is authenticated as sekolah
 * @returns User info if sekolah, null otherwise
 */
export async function getSekolahUser(): Promise<UserWithRole | null> {
  const user = await getCurrentUser();
  if (user && user.role === 'sekolah') {
    return user;
  }
  return null;
}

