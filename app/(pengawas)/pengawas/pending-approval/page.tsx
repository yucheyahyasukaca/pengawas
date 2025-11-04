"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle, AlertCircle, Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function PendingApprovalPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'rejected' | 'approved' | 'loading'>('loading');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      console.log("PendingApprovalPage: Checking status...");
      const supabase = createSupabaseBrowserClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      console.log("PendingApprovalPage: Auth check", { hasUser: !!user, error: authError?.message });

      if (authError || !user) {
        console.log("PendingApprovalPage: No user, redirecting to login");
        router.push("/auth/login");
        return;
      }

      // Fetch user data from API route that bypasses RLS
      const response = await fetch('/api/auth/get-current-user');
      
      if (!response.ok) {
        console.error("PendingApprovalPage: Error fetching user data from API");
        // If API fails, assume pending status
        setStatus('pending');
        return;
      }

      const data = await response.json();
      const userData = data.user;

      if (!userData) {
        console.log("PendingApprovalPage: No user data, using default pending status");
        setStatus('pending');
        return;
      }

      if (userData.role !== 'pengawas') {
        router.push("/pengawas");
        return;
      }

      const approvalStatus = userData.status_approval || 'pending';
      
      if (approvalStatus === 'approved') {
        router.push("/pengawas");
        return;
      }

      setStatus(approvalStatus as 'pending' | 'rejected');
    } catch (err) {
      console.error("Check status error:", err);
      setStatus('loading');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-indigo-50/90 to-blue-50/80">
        <div className="text-center">
          <p className="text-slate-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-indigo-50/90 to-blue-50/80 px-4 py-12">
      <div className="w-full max-w-2xl">
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader className="text-center">
            {status === 'pending' ? (
              <>
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-indigo-100">
                  <Clock className="size-8 text-indigo-600" />
                </div>
                <CardTitle className="mt-4 text-2xl font-bold text-slate-900">
                  Menunggu Persetujuan Admin
                </CardTitle>
                <CardDescription className="mt-2 text-base text-slate-600">
                  Pendaftaran Anda sedang dalam proses review oleh admin
                </CardDescription>
              </>
            ) : (
              <>
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="size-8 text-red-600" />
                </div>
                <CardTitle className="mt-4 text-2xl font-bold text-slate-900">
                  Pendaftaran Ditolak
                </CardTitle>
                <CardDescription className="mt-2 text-base text-slate-600">
                  Pendaftaran Anda tidak disetujui oleh admin
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {status === 'pending' ? (
              <>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-5 text-indigo-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Status: Menunggu Persetujuan
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Admin akan memeriksa data pendaftaran Anda. Setelah disetujui, Anda akan dapat mengakses dashboard pengawas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Langkah selanjutnya:
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-indigo-600 mt-0.5 shrink-0" />
                      <span>Pastikan Anda telah melengkapi data profil dengan benar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-indigo-600 mt-0.5 shrink-0" />
                      <span>Tunggu admin memproses pendaftaran Anda</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-indigo-600 mt-0.5 shrink-0" />
                      <span>Anda akan menerima notifikasi setelah status berubah</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <Button
                    onClick={checkStatus}
                    className="w-full rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
                  >
                    Refresh Status
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                    asChild
                  >
                    <Link href="/auth/login">
                      Kembali ke Login
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-5 text-red-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Pendaftaran Tidak Disetujui
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Jika Anda merasa ini adalah kesalahan, silakan hubungi admin untuk informasi lebih lanjut.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                    asChild
                  >
                    <Link href="mailto:mkps@garuda-21.com">
                      <Mail className="size-4 mr-2" />
                      Hubungi Admin
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                    asChild
                  >
                    <Link href="/auth/login">
                      Kembali ke Login
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

