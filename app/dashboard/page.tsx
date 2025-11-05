"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectToCorrectDashboard() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Jika tidak ada user, redirect ke login
          router.push("/auth/login");
          return;
        }

        // Ambil role dari database
        const { data: userData } = await supabase
          .from('users')
          .select('role, status_approval, nama')
          .eq('id', user.id)
          .single();

        if (userData?.role === 'admin') {
          router.push("/admin");
        } else if (userData?.role === 'pengawas') {
          if (userData.status_approval !== 'approved') {
            router.push("/pengawas/pending-approval");
          } else if (!userData.nama) {
            router.push("/pengawas/lengkapi-profil");
          } else {
            router.push("/pengawas");
          }
        } else {
          // Default redirect ke pengawas
          router.push("/pengawas");
        }
      } catch (error) {
        console.error("Error redirecting:", error);
        // Fallback redirect
        router.push("/pengawas");
      }
    }

    redirectToCorrectDashboard();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-slate-600">Mengalihkan ke dashboard...</p>
      </div>
    </div>
  );
}

