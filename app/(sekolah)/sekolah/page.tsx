"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  User, 
  FileText, 
  Settings, 
  ArrowRight,
  Loader2,
  School,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { sekolahQuickActions } from "@/config/sekolah";

export default function SekolahDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [sekolahData, setSekolahData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load user data
      const userResponse = await fetch('/api/auth/get-current-user');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        const currentUser = userData.user;
        
        // Check approval status - redirect if not approved
        if (currentUser && currentUser.role === 'sekolah') {
          if (currentUser.status_approval !== 'approved') {
            router.replace('/sekolah/pending-approval');
            return;
          }
        }
        
        setUser(currentUser);
        
        // Load sekolah data if user has sekolah_id in metadata
        if (currentUser?.metadata?.sekolah_id) {
          const sekolahResponse = await fetch(`/api/sekolah/profile?sekolah_id=${currentUser.metadata.sekolah_id}`);
          if (sekolahResponse.ok) {
            const sekolahData = await sekolahResponse.json();
            setSekolahData(sekolahData);
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-green-600" />
        <p className="text-sm text-slate-600">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Selamat Datang, {user?.nama || user?.email?.split('@')[0] || 'Sekolah'}!
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola data profil sekolah Anda di sini
          </p>
        </div>
        {sekolahData && (
          <Badge className="rounded-full border-2 border-green-300 bg-green-50 px-4 py-1.5 text-sm font-bold text-green-700 w-fit">
            <School className="size-4 mr-2" />
            {sekolahData.nama_sekolah || 'Sekolah'}
          </Badge>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Aksi Cepat</CardTitle>
          <CardDescription className="text-slate-600">Akses cepat ke fitur utama</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sekolahQuickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto flex flex-col items-start gap-2 p-4 border-green-200 bg-white hover:bg-green-50 hover:border-green-300 transition"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Building2 className="size-5 text-green-600" />
                    <span className="font-semibold text-slate-900">{action.title}</span>
                    <ArrowRight className="size-4 ml-auto text-green-600" />
                  </div>
                  <p className="text-xs text-slate-600 text-left">{action.description}</p>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Status Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {sekolahData ? (
                <>
                  <CheckCircle2 className="size-8 text-green-600" />
                  <div>
                    <p className="text-lg font-bold text-slate-900">Lengkap</p>
                    <p className="text-xs text-slate-600">Profil sekolah sudah diisi</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="size-8 text-amber-600" />
                  <div>
                    <p className="text-lg font-bold text-slate-900">Belum Lengkap</p>
                    <p className="text-xs text-slate-600">Lengkapi profil sekolah Anda</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Akses Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <FileText className="size-8 text-green-600" />
              <div>
                <p className="text-lg font-bold text-slate-900">Tersedia</p>
                <p className="text-xs text-slate-600">Data dapat diakses pengawas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Pengaturan</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/sekolah/pengaturan">
              <Button
                variant="outline"
                className="w-full border-green-200 bg-white hover:bg-green-50 hover:border-green-300"
              >
                <Settings className="size-4 mr-2" />
                Kelola Pengaturan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-md shadow-green-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <School className="size-5 text-green-600" />
            Informasi Penting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-700">
            Pastikan data profil sekolah Anda selalu terbarui. Data yang Anda isi akan dapat diakses oleh pengawas sekolah binaan dan admin.
          </p>
          <Link href="/sekolah/profil">
            <Button className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white">
              Lengkapi Profil Sekolah
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

