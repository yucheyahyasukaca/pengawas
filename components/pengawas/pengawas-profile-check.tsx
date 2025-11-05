"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function PengawasProfileCheck() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip check jika di halaman lengkapi-profil, pending-approval, atau login
    if (pathname?.includes('/lengkapi-profil') || pathname?.includes('/pending-approval') || pathname?.includes('/auth')) {
      return;
    }

    // Add a delay to avoid race conditions with session setting
    // Server-side layout already validates authentication, so we only need to check
    // for profile completion redirects, not authentication
    const timeoutId = setTimeout(() => {
      async function checkProfile() {
        try {
          // Use API route to get user data instead of direct Supabase query
          // This is more reliable and bypasses potential RLS issues
          const response = await fetch('/api/auth/get-current-user');
          
          if (!response.ok) {
            // If API fails, don't redirect - server-side layout handles auth
            return;
          }
          
          const data = await response.json();
          const userData = data.user;
          
          if (!userData || userData.role !== 'pengawas') {
            // Not a pengawas or no user data, don't redirect
            return;
          }
          
          // Only handle redirects for incomplete profiles
          // Server-side layout already handles authentication
          const statusApproval = userData.status_approval || 'pending';
          
          // Check status approval terlebih dahulu
          if (statusApproval === 'pending' || statusApproval === 'rejected') {
            if (!pathname?.includes('/pending-approval')) {
              router.push('/pengawas/pending-approval');
            }
            return;
          }
          
          // Jika sudah approved tapi belum lengkap profil, redirect ke lengkapi-profil
          if (!userData.nama && !pathname?.includes('/lengkapi-profil')) {
            router.push('/pengawas/lengkapi-profil');
          }
        } catch (err) {
          console.error("Profile check error:", err);
          // Don't redirect on error, just log it
        }
      }
      
      checkProfile();
    }, 1000); // Wait 1 second before checking - server-side layout already validated auth

    return () => clearTimeout(timeoutId);
  }, [pathname, router]);

  return null;
}

