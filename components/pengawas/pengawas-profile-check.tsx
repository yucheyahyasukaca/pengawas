"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function PengawasProfileCheck() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkProfile() {
      // Skip check jika di halaman lengkapi-profil atau login
      if (pathname?.includes('/lengkapi-profil') || pathname?.includes('/auth')) {
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          return;
        }

        // Check apakah profil sudah lengkap dan status approval
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('nama, role, status_approval')
          .eq('id', user.id)
          .single();

        if (userError || !userData) {
          return;
        }

        // Jika role pengawas
        if (userData.role === 'pengawas' && pathname?.startsWith('/pengawas')) {
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
        }
      } catch (err) {
        console.error("Profile check error:", err);
      }
    }

    checkProfile();
  }, [pathname, router]);

  return null;
}

