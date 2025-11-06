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
import { Clock, CheckCircle2, XCircle, AlertCircle, Mail, School, RefreshCw, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface UserData {
  id: string;
  email: string;
  nama: string | null;
  role: string;
  status_approval: string;
  metadata: Record<string, any> | null;
}

export default function SekolahPendingApprovalPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'rejected' | 'approved' | 'loading'>('loading');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sekolahData, setSekolahData] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      setIsChecking(true);
      const supabase = createSupabaseBrowserClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/auth/login");
        return;
      }

      // Fetch user data
      const response = await fetch('/api/auth/get-current-user');
      
      if (!response.ok) {
        setStatus('pending');
        return;
      }

      const data = await response.json();
      const fetchedUserData = data.user;

      if (!fetchedUserData) {
        setStatus('pending');
        return;
      }

      if (fetchedUserData.role !== 'sekolah') {
        router.push("/sekolah");
        return;
      }

      setUserData(fetchedUserData);

      // Check approval status
      if (fetchedUserData.status_approval === 'approved') {
        setStatus('approved');
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/sekolah");
        }, 2000);
        return;
      } else if (fetchedUserData.status_approval === 'rejected') {
        setStatus('rejected');
        return;
      } else {
        setStatus('pending');
      }

      // Load sekolah data if available
      if (fetchedUserData.metadata?.sekolah_id) {
        try {
          const sekolahResponse = await fetch(`/api/sekolah/profile?sekolah_id=${fetchedUserData.metadata.sekolah_id}`);
          if (sekolahResponse.ok) {
            const sekolahData = await sekolahResponse.json();
            setSekolahData(sekolahData);
          }
        } catch (err) {
          console.error("Error loading sekolah data:", err);
        }
      }
    } catch (error) {
      console.error("Error checking status:", error);
      setStatus('pending');
    } finally {
      setIsChecking(false);
    }
  };

  const handleRefresh = () => {
    checkStatus();
  };

  if (status === 'loading' || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-green-600" />
        <p className="text-sm text-slate-600">Memuat status...</p>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="size-8 text-green-600" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Akun Anda Sudah Disetujui!</h2>
          <p className="mt-2 text-sm text-slate-600">
            Mengarahkan ke dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-2 border-green-300 bg-white shadow-lg shadow-green-100/50">
        <CardHeader className="bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50/30 pb-6">
          <div className="flex items-center gap-4">
            {status === 'pending' ? (
              <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg">
                <Clock className="size-10 text-white" />
              </div>
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                <XCircle className="size-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-slate-900">
                {status === 'pending' ? 'Menunggu Persetujuan' : 'Akun Ditolak'}
              </CardTitle>
              <CardDescription className="text-base text-slate-700 mt-2 font-medium">
                {status === 'pending' 
                  ? 'Akun Anda sedang menunggu persetujuan dari admin atau pengawas sekolah'
                  : 'Akun Anda telah ditolak. Silakan hubungi admin untuk informasi lebih lanjut'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {sekolahData && (
            <div className="rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-emerald-100 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-green-600 text-white shadow-md">
                  <School className="size-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">{sekolahData.nama_sekolah}</p>
                  <p className="text-sm font-semibold text-slate-700">NPSN: {sekolahData.npsn}</p>
                </div>
              </div>
            </div>
          )}

          {status === 'pending' && (
            <>
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100/80 p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
                      <AlertCircle className="size-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-amber-900 mb-3">Informasi Penting</h3>
                      <p className="text-base text-amber-900 mb-4 font-medium leading-relaxed">
                        Akun sekolah Anda sedang menunggu persetujuan dari admin atau pengawas sekolah pembina. 
                        Setelah disetujui, Anda akan dapat mengakses dashboard sekolah.
                      </p>
                      <div className="space-y-3 rounded-lg bg-white/60 p-4 border border-amber-200">
                        <p className="font-bold text-base text-amber-900">Untuk mempercepat proses persetujuan:</p>
                        <ul className="list-disc list-inside space-y-2 text-sm font-medium text-amber-900 ml-2">
                          <li>Hubungi pengawas sekolah pembina Anda</li>
                          <li>Atau hubungi admin MKPS melalui email: <a href="mailto:mkps@garuda-21.com" className="underline font-bold text-amber-700 hover:text-amber-900">mkps@garuda-21.com</a></li>
                          <li>Berikan informasi email akun Anda: <span className="font-mono font-bold text-amber-900 bg-amber-200 px-2 py-1 rounded">{userData?.email}</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-2 border-green-300 bg-white shadow-md">
                    <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50/50">
                      <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-green-600 text-white">
                          <Mail className="size-4" />
                        </div>
                        Kontak Admin
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium text-slate-700 mb-4">
                        Hubungi admin MKPS untuk bantuan
                      </p>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md font-semibold"
                      >
                        <a href="mailto:mkps@garuda-21.com">
                          <Mail className="size-4 mr-2" />
                          Email Admin
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-300 bg-white shadow-md">
                    <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50/50">
                      <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-green-600 text-white">
                          <RefreshCw className="size-4" />
                        </div>
                        Periksa Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium text-slate-700 mb-4">
                        Refresh untuk memeriksa status terbaru
                      </p>
                      <Button
                        onClick={handleRefresh}
                        disabled={isChecking}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md font-semibold disabled:opacity-50"
                      >
                        <RefreshCw className={cn("size-4 mr-2", isChecking && "animate-spin")} />
                        {isChecking ? "Memeriksa..." : "Periksa Status"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {status === 'rejected' && (
            <div className="rounded-xl border-2 border-red-400 bg-gradient-to-br from-red-50 to-red-100/80 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-md">
                  <XCircle className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-red-900 mb-3">Akun Ditolak</h3>
                  <p className="text-base font-medium text-red-900 mb-4 leading-relaxed">
                    Akun Anda telah ditolak. Silakan hubungi admin MKPS untuk informasi lebih lanjut.
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md font-semibold"
                  >
                    <a href="mailto:mkps@garuda-21.com">
                      <Mail className="size-4 mr-2" />
                      Hubungi Admin
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t-2 border-green-200">
            <Button
              onClick={handleRefresh}
              disabled={isChecking}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md font-semibold disabled:opacity-50"
            >
              <RefreshCw className={cn("size-4 mr-2", isChecking && "animate-spin")} />
              {isChecking ? "Memeriksa..." : "Refresh Status"}
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-slate-300 bg-white hover:bg-slate-50 font-semibold text-slate-700"
            >
              <Link href="/auth/login">
                Kembali ke Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

