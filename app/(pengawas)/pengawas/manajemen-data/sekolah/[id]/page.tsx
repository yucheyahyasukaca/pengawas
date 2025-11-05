"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  School, 
  MapPin, 
  Building2, 
  FileText, 
  ArrowLeft,
  Loader2,
  XCircle
} from "lucide-react";
import Link from "next/link";

interface Sekolah {
  id: string | number;
  nama: string;
  npsn: string;
  jenjang: string;
  alamat: string;
  kabupaten: string;
  cabangDinas: string;
  status: string;
}

export default function SekolahDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sekolahId = params.id as string;
  
  const [sekolah, setSekolah] = useState<Sekolah | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSekolahDetail();
  }, [sekolahId]);

  const loadSekolahDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First, get current user to get sekolah_binaan from metadata
      const userResponse = await fetch('/api/auth/get-current-user');
      
      if (!userResponse.ok) {
        throw new Error('Gagal memuat data pengawas');
      }

      const userData = await userResponse.json();
      const pengawas = userData.user;

      if (!pengawas || pengawas.role !== 'pengawas') {
        throw new Error('Data pengawas tidak ditemukan');
      }

      // Get sekolah_binaan names from metadata
      const sekolahBinaanNames = Array.isArray(pengawas.metadata?.sekolah_binaan) 
        ? pengawas.metadata.sekolah_binaan 
        : [];

      if (sekolahBinaanNames.length === 0) {
        setError('Tidak ada sekolah binaan');
        setIsLoading(false);
        return;
      }

      // Fetch sekolah details from sekolah table
      const sekolahResponse = await fetch('/api/sekolah/list');
      
      if (!sekolahResponse.ok) {
        throw new Error('Gagal memuat data sekolah');
      }

      const sekolahData = await sekolahResponse.json();
      const allSekolah = sekolahData.sekolah || [];

      // Find sekolah by ID
      const foundSekolah = allSekolah.find((s: any) => 
        s.id === sekolahId || s.id?.toString() === sekolahId
      );

      if (!foundSekolah) {
        // If not found by ID, try to find by sekolah_binaan names
        const filteredSekolah = allSekolah
          .filter((s: any) => sekolahBinaanNames.includes(s.nama_sekolah))
          .find((s: any) => 
            s.id === sekolahId || 
            s.id?.toString() === sekolahId ||
            s.nama_sekolah?.toLowerCase().includes(sekolahId.toLowerCase())
          );

        if (!filteredSekolah) {
          setError('Sekolah tidak ditemukan atau tidak termasuk sekolah binaan Anda');
          setIsLoading(false);
          return;
        }

        setSekolah({
          id: filteredSekolah.id,
          nama: filteredSekolah.nama_sekolah,
          npsn: filteredSekolah.npsn || '-',
          jenjang: filteredSekolah.jenjang || '-',
          alamat: filteredSekolah.alamat ? filteredSekolah.alamat.trim() : '',
          kabupaten: filteredSekolah.kabupaten_kota || '-',
          cabangDinas: `KCD Wilayah ${filteredSekolah.kcd_wilayah || '-'}`,
          status: filteredSekolah.status || 'Aktif',
        });
      } else {
        // Verify sekolah is in sekolah_binaan
        if (!sekolahBinaanNames.includes(foundSekolah.nama_sekolah)) {
          setError('Sekolah ini tidak termasuk sekolah binaan Anda');
          setIsLoading(false);
          return;
        }

        setSekolah({
          id: foundSekolah.id,
          nama: foundSekolah.nama_sekolah,
          npsn: foundSekolah.npsn || '-',
          jenjang: foundSekolah.jenjang || '-',
          alamat: foundSekolah.alamat ? foundSekolah.alamat.trim() : '',
          kabupaten: foundSekolah.kabupaten_kota || '-',
          cabangDinas: `KCD Wilayah ${foundSekolah.kcd_wilayah || '-'}`,
          status: foundSekolah.status || 'Aktif',
        });
      }
    } catch (err) {
      console.error("Error loading sekolah detail:", err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-600">Memuat detail sekolah...</p>
      </div>
    );
  }

  if (error || !sekolah) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="size-4 mr-2" />
            Kembali
          </Button>
        </div>
        <Card className="border-red-200 bg-red-50/50 max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <XCircle className="size-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700 mb-1">
                  {error || 'Sekolah tidak ditemukan'}
                </p>
                <p className="text-xs text-red-600">
                  Sekolah mungkin tidak termasuk dalam daftar sekolah binaan Anda
                </p>
              </div>
              <Button
                onClick={() => router.push('/pengawas/manajemen-data/sekolah')}
                variant="outline"
                className="w-full rounded-full border-red-200 text-red-600 hover:bg-red-50"
              >
                Lihat Semua Sekolah
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="size-4 mr-2" />
          Kembali
        </Button>
      </div>

      {/* School Detail Card */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader className="bg-gradient-to-br from-indigo-50 via-indigo-100/30 to-blue-50 px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                <School className="size-8 sm:size-10" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  {sekolah.nama}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base font-medium text-slate-700">
                  NPSN: {sekolah.npsn}
                </CardDescription>
              </div>
            </div>
            <Badge className="rounded-full border-2 border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 w-fit">
              {sekolah.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-4">
          {/* Jenjang */}
          <div className="flex items-start gap-4 text-sm rounded-xl bg-slate-50/50 p-5 border border-slate-200/50">
            <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shadow-sm border border-indigo-200/50 shrink-0">
              <Building2 className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-slate-900 block mb-1">Jenjang:</span>
              <span className="font-medium text-slate-700 block">{sekolah.jenjang}</span>
            </div>
          </div>

          {/* Alamat */}
          <div className="flex items-start gap-4 text-sm rounded-xl bg-slate-50/50 p-5 border border-slate-200/50">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200/50 shrink-0">
              <MapPin className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-slate-900 block mb-1">Alamat:</span>
              <span className="font-medium text-slate-700 block break-words leading-relaxed">
                {sekolah.alamat && sekolah.alamat.trim() !== '' ? sekolah.alamat : 'Alamat belum diisi'}
              </span>
            </div>
          </div>

          {/* Kabupaten/Kota */}
          <div className="flex items-start gap-4 text-sm rounded-xl bg-slate-50/50 p-5 border border-slate-200/50">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200/50 shrink-0">
              <MapPin className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-slate-900 block mb-1">Kabupaten/Kota:</span>
              <span className="font-medium text-slate-700 block">{sekolah.kabupaten}</span>
            </div>
          </div>

          {/* Cabang Dinas */}
          <div className="flex items-start gap-4 text-sm rounded-xl bg-slate-50/50 p-5 border border-slate-200/50">
            <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shadow-sm border border-indigo-200/50 shrink-0">
              <FileText className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-slate-900 block mb-1">Cabang Dinas:</span>
              <span className="font-medium text-slate-700 block">{sekolah.cabangDinas}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          asChild
          variant="outline"
          className="flex-1 rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
        >
          <Link href="/pengawas/manajemen-data/sekolah">
            Lihat Semua Sekolah
          </Link>
        </Button>
      </div>
    </div>
  );
}

