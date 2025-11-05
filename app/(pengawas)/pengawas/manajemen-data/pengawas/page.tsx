"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, School, Edit, Mail, Loader2, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PengawasData {
  id: string;
  email: string;
  nama: string | null;
  nip: string | null;
  status_approval: string | null;
  metadata: {
    wilayah_tugas?: string;
    sekolah_binaan?: string[];
  } | null;
}

export default function DataPengawasPage() {
  const router = useRouter();
  const [pengawas, setPengawas] = useState<PengawasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPengawasData();
  }, []);

  const loadPengawasData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/get-current-user');
      
      if (!response.ok) {
        throw new Error('Gagal memuat data pengawas');
      }

      const data = await response.json();
      const userData = data.user;

      if (!userData || userData.role !== 'pengawas') {
        throw new Error('Data pengawas tidak ditemukan');
      }

      setPengawas(userData);
    } catch (err) {
      console.error("Error loading pengawas data:", err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Redirect ke halaman pending-approval untuk edit profil
    router.push('/pengawas/pending-approval');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-in fade-in">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-indigo-200 animate-ping opacity-75" />
          <Loader2 className="relative size-12 animate-spin text-indigo-600" />
        </div>
        <p className="text-sm font-medium text-slate-700">Memuat data pengawas...</p>
      </div>
    );
  }

  if (error || !pengawas) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-in fade-in slide-in-from-bottom-4">
        <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100/50 max-w-md w-full shadow-xl">
          <CardContent className="pt-8 pb-6 px-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <XCircle className="size-8" />
              </div>
              <p className="text-sm font-semibold text-red-700 text-center">{error || 'Data pengawas tidak ditemukan'}</p>
              <Button
                onClick={loadPengawasData}
                className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transition-all"
              >
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const wilayahTugas = pengawas.metadata?.wilayah_tugas || 'Belum diisi';
  const sekolahBinaan = pengawas.metadata?.sekolah_binaan || [];
  const jumlahSekolah = Array.isArray(sekolahBinaan) ? sekolahBinaan.length : 0;
  const statusApproval = pengawas.status_approval || 'pending';
  
  const getStatusConfig = () => {
    switch (statusApproval) {
      case 'approved':
        return {
          label: 'Aktif',
          icon: CheckCircle2,
          className: 'bg-green-50 text-green-700 border-green-200',
          iconClassName: 'text-green-600',
        };
      case 'pending':
        return {
          label: 'Menunggu Persetujuan',
          icon: Clock,
          className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          iconClassName: 'text-yellow-600',
        };
      case 'rejected':
        return {
          label: 'Ditolak',
          icon: XCircle,
          className: 'bg-red-50 text-red-700 border-red-200',
          iconClassName: 'text-red-600',
        };
      default:
        return {
          label: 'Belum Diketahui',
          icon: Clock,
          className: 'bg-slate-50 text-slate-700 border-slate-200',
          iconClassName: 'text-slate-600',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header - Soft design */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-indigo-100/50 to-blue-50 p-6 sm:p-8 border border-indigo-100/50 shadow-sm">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">
              Profil Pengawas
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              Informasi lengkap profil, NIP, wilayah tugas, dan sekolah binaan
            </p>
          </div>
          <Button 
            onClick={handleEditProfile}
            className="rounded-xl border border-indigo-200 bg-white/80 backdrop-blur-sm text-indigo-600 px-6 py-2.5 font-medium shadow-sm transition-all hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md"
          >
            <Edit className="size-4 mr-2" />
            <span className="hidden sm:inline">Edit Profil</span>
            <span className="sm:hidden">Edit</span>
          </Button>
        </div>
      </div>

      {/* Profile Card - Soft design */}
      <Card className="border border-slate-200/60 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
        {/* Header - Soft gradient */}
        <div className="relative bg-gradient-to-br from-indigo-50 via-indigo-100/30 to-blue-50 px-6 py-8 sm:px-8 sm:py-10">
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Avatar - Soft design */}
              <div className="flex size-20 sm:size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 shadow-sm border border-indigo-200/50">
                <User className="size-10 sm:size-12" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-slate-800 mb-1 truncate">
                  {pengawas.nama || 'Nama Belum Diisi'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-600 font-normal">
                  {pengawas.nip ? `NIP: ${pengawas.nip}` : 'NIP: Belum diisi'}
                </CardDescription>
              </div>
            </div>
            <Badge 
              className={cn(
                "rounded-full border px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-2 w-fit shadow-sm",
                statusConfig.className
              )}
            >
              <StatusIcon className={cn("size-4", statusConfig.iconClassName)} />
              <span>{statusConfig.label}</span>
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 bg-white">
          <div className="grid gap-4 sm:gap-5">
            {/* Email - Soft card design */}
            <div className="relative overflow-hidden rounded-xl bg-slate-50/50 p-5 sm:p-6 border border-slate-200/50 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
              <div className="flex items-start sm:items-center gap-4">
                <div className="flex size-12 sm:size-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shadow-sm border border-indigo-200/50">
                  <Mail className="size-5 sm:size-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
                    Email
                  </span>
                  <span className="text-sm sm:text-base font-medium text-slate-800 break-all">
                    {pengawas.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Wilayah Tugas - Soft card design */}
            <div className="relative overflow-hidden rounded-xl bg-slate-50/50 p-5 sm:p-6 border border-slate-200/50 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
              <div className="flex items-start sm:items-center gap-4">
                <div className="flex size-12 sm:size-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200/50">
                  <MapPin className="size-5 sm:size-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
                    Wilayah Tugas
                  </span>
                  <span className="text-sm sm:text-base font-medium text-slate-800">
                    {wilayahTugas}
                  </span>
                </div>
              </div>
            </div>

            {/* Jumlah Sekolah Binaan - Soft highlight */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-6 sm:p-8 border border-indigo-200/50 shadow-sm">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex size-14 sm:size-16 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shadow-sm border border-indigo-200/50">
                  <School className="size-6 sm:size-7" />
                </div>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-medium text-indigo-600 uppercase tracking-wide block mb-2">
                    Jumlah Sekolah Binaan
                  </span>
                  <span className="text-3xl sm:text-4xl font-semibold text-indigo-700">
                    {jumlahSekolah}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
                    Sekolah aktif
                  </p>
                </div>
              </div>
            </div>

            {/* Daftar Sekolah Binaan */}
            {jumlahSekolah > 0 && (
              <div className="mt-2 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 border border-indigo-200/50">
                    <School className="size-4.5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                    Daftar Sekolah Binaan
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {Array.isArray(sekolahBinaan) && sekolahBinaan.map((sekolah, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full border border-indigo-200 bg-indigo-50/50 px-4 py-1.5 text-xs sm:text-sm font-medium text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200"
                    >
                      {sekolah}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

