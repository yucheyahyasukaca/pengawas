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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-600">Memuat data pengawas...</p>
      </div>
    );
  }

  if (error || !pengawas) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Card className="border-red-200 bg-red-50/50 max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600 text-center">{error || 'Data pengawas tidak ditemukan'}</p>
            <Button
              onClick={loadPengawasData}
              variant="outline"
              className="w-full mt-4 rounded-full border-red-200 text-red-600 hover:bg-red-50"
            >
              Coba Lagi
            </Button>
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Profil Pengawas
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Informasi lengkap profil, NIP, wilayah tugas, dan sekolah binaan
          </p>
        </div>
        <Button 
          onClick={handleEditProfile}
          className="rounded-xl border-0 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <Edit className="size-4 mr-2" />
          <span className="hidden sm:inline">Edit Profil</span>
          <span className="sm:hidden">Edit</span>
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="border-0 bg-white shadow-xl shadow-indigo-100/50 overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex size-20 sm:size-24 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-xl ring-2 ring-white/30">
                <User className="size-10 sm:size-12" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">
                  {pengawas.nama || 'Nama Belum Diisi'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-white/90">
                  {pengawas.nip ? `NIP: ${pengawas.nip}` : 'NIP: Belum diisi'}
                </CardDescription>
              </div>
            </div>
            <Badge 
              className={cn(
                "rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold flex items-center gap-2 w-fit",
                statusConfig.className
              )}
            >
              <StatusIcon className={cn("size-4", statusConfig.iconClassName)} />
              <span>{statusConfig.label}</span>
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8">
          <div className="grid gap-4 sm:gap-6">
            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Mail className="size-5" />
                </div>
                <div className="flex-1 sm:flex-none">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                    Email
                  </span>
                  <span className="text-sm sm:text-base font-medium text-slate-900 break-all">
                    {pengawas.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Wilayah Tugas */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <MapPin className="size-5" />
                </div>
                <div className="flex-1 sm:flex-none">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                    Wilayah Tugas
                  </span>
                  <span className="text-sm sm:text-base font-medium text-slate-900">
                    {wilayahTugas}
                  </span>
                </div>
              </div>
            </div>

            {/* Jumlah Sekolah Binaan */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-md">
                  <School className="size-5" />
                </div>
                <div className="flex-1 sm:flex-none">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1">
                    Jumlah Sekolah Binaan
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-indigo-600">
                    {jumlahSekolah}
                  </span>
                </div>
              </div>
            </div>

            {/* Daftar Sekolah Binaan */}
            {jumlahSekolah > 0 && (
              <div className="mt-2 pt-6 border-t-2 border-indigo-100">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <School className="size-5 text-indigo-600" />
                  Daftar Sekolah Binaan
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {Array.isArray(sekolahBinaan) && sekolahBinaan.map((sekolah, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full border-2 border-indigo-200 bg-indigo-50 px-4 py-2 text-xs sm:text-sm font-medium text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors"
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

