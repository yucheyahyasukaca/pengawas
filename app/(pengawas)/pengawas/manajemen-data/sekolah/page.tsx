"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School, Search, Plus, Filter, MapPin, Building2, FileText, Loader2 } from "lucide-react";

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

export default function DataSekolahPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSekolahBinaan();
  }, []);

  const loadSekolahBinaan = async () => {
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
        setSekolahList([]);
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

      // Filter sekolah based on sekolah_binaan names
      const filteredSekolah = allSekolah
        .filter((sekolah: any) => sekolahBinaanNames.includes(sekolah.nama_sekolah))
        .map((sekolah: any) => ({
          id: sekolah.id,
          nama: sekolah.nama_sekolah,
          npsn: sekolah.npsn || '-',
          jenjang: sekolah.jenjang || '-',
          alamat: sekolah.alamat ? sekolah.alamat.trim() : '',
          kabupaten: sekolah.kabupaten_kota || '-',
          cabangDinas: `KCD Wilayah ${sekolah.kcd_wilayah || '-'}`,
          status: sekolah.status || 'Aktif',
        }));

      setSekolahList(filteredSekolah);
    } catch (err) {
      console.error("Error loading sekolah binaan:", err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSekolah = useMemo(() => {
    if (!searchQuery.trim()) {
      return sekolahList;
    }

    const query = searchQuery.toLowerCase();
    return sekolahList.filter((sekolah) =>
      sekolah.nama.toLowerCase().includes(query) ||
      sekolah.npsn.toLowerCase().includes(query) ||
      sekolah.kabupaten.toLowerCase().includes(query) ||
      sekolah.cabangDinas.toLowerCase().includes(query)
    );
  }, [sekolahList, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-600">Memuat data sekolah binaan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Card className="border-red-200 bg-red-50/50 max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600 text-center">{error}</p>
            <Button
              onClick={loadSekolahBinaan}
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Sekolah Binaan</h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola data sekolah binaan, NPSN, jenis, alamat, dan status binaan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="rounded-full border-2 border-indigo-300 bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-700">
            {sekolahList.length} Sekolah
          </Badge>
        </div>
      </div>

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Search className="size-5 text-indigo-600" />
            Pencarian Sekolah
          </CardTitle>
          <CardDescription className="text-slate-700">
            Cari sekolah berdasarkan nama, NPSN, atau kabupaten/kota
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="search"
            placeholder="Cari sekolah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border-2 border-indigo-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
          />
        </CardContent>
      </Card>

      {filteredSekolah.length === 0 ? (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <School className="size-12 text-indigo-400" />
              <div>
                <p className="text-sm font-semibold text-indigo-900 mb-1">
                  Belum ada sekolah binaan
                </p>
                <p className="text-xs text-indigo-600">
                  Silakan lengkapi profil Anda dengan menambahkan sekolah binaan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredSekolah.map((sekolah) => (
          <Link key={sekolah.id} href={`/pengawas/manajemen-data/sekolah/${sekolah.id}`}>
          <Card
            className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 transition hover:shadow-lg hover:shadow-indigo-200 cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md shrink-0">
                    <School className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {sekolah.nama}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-700 mt-1">
                      NPSN: {sekolah.npsn}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="rounded-full border-2 border-indigo-300 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 shrink-0">
                  {sekolah.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Building2 className="size-5 text-indigo-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-900 block mb-0.5">Jenjang:</span>
                  <span className="font-medium text-slate-700 block">{sekolah.jenjang}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="size-5 text-indigo-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-900 block mb-0.5">Alamat:</span>
                  <span className="font-medium text-slate-700 block break-words leading-relaxed">
                    {sekolah.alamat && sekolah.alamat.trim() !== '' ? sekolah.alamat : 'Alamat belum diisi'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="size-5 text-indigo-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-900 block mb-0.5">Kabupaten/Kota:</span>
                  <span className="font-medium text-slate-700 block">{sekolah.kabupaten}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <FileText className="size-5 text-indigo-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-900 block mb-0.5">Cabang Dinas:</span>
                  <span className="font-medium text-slate-700 block">{sekolah.cabangDinas}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          </Link>
          ))}
        </div>
      )}
    </div>
  );
}

