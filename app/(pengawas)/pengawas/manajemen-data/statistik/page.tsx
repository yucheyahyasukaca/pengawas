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
import { BarChart3, Filter, School, MapPin, Loader2, AlertCircle } from "lucide-react";

interface StatistikKabupaten {
  kabupaten: string;
  jumlahSekolah: number;
  jumlahKegiatan: number;
  status: string;
}

interface StatistikJenis {
  jenis: string;
  jumlah: number;
  persentase: number;
}

interface StatistikData {
  summary: {
    totalSekolah: number;
    totalKegiatan: number;
    jumlahKabupaten: number;
    tingkatPenyelesaian: number;
  };
  statistikKabupaten: StatistikKabupaten[];
  statistikJenis: StatistikJenis[];
}

export default function StatistikPage() {
  const [filterKabupaten, setFilterKabupaten] = useState<string>("Semua");
  const [filterJenis, setFilterJenis] = useState<string>("Semua");
  const [data, setData] = useState<StatistikData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filterKabupaten && filterKabupaten !== "Semua") {
          params.append("kabupaten", filterKabupaten);
        }
        if (filterJenis && filterJenis !== "Semua") {
          params.append("jenis", filterJenis);
        }

        const response = await fetch(`/api/pengawas/statistik?${params.toString()}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Gagal memuat data statistik");
        }

        if (result.success && result.data) {
          setData(result.data);
        } else {
          throw new Error("Format data tidak valid");
        }
      } catch (err) {
        console.error("Error fetching statistik:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterKabupaten, filterJenis]);

  // Get unique kabupaten list for filter
  const kabupatenList = data
    ? Array.from(new Set(data.statistikKabupaten.map((s) => s.kabupaten))).sort()
    : [];

  // Get unique jenis list for filter
  const jenisList = data
    ? Array.from(new Set(data.statistikJenis.map((s) => s.jenis))).sort()
    : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-700">Memuat data statistik...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="size-8 text-rose-600" />
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900">Gagal Memuat Data</p>
          <p className="text-sm text-slate-700 mt-1">{error}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="size-8 text-slate-400" />
        <p className="text-sm font-medium text-slate-700">Tidak ada data yang tersedia</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analitik Data</h1>
          <p className="text-sm font-medium text-slate-700 mt-1">
            Analisis data per kabupaten/kota, jenis sekolah, dan jumlah kegiatan
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filterKabupaten}
            onChange={(e) => setFilterKabupaten(e.target.value)}
            className="px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-white text-slate-900 font-medium shadow-sm hover:border-indigo-400 transition-colors"
          >
            <option value="Semua">Semua Kabupaten/Kota</option>
            {kabupatenList.map((kab) => (
              <option key={kab} value={kab}>
                {kab}
              </option>
            ))}
          </select>
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-white text-slate-900 font-medium shadow-sm hover:border-indigo-400 transition-colors"
          >
            <option value="Semua">Semua Jenis</option>
            {jenisList.map((jenis) => (
              <option key={jenis} value={jenis}>
                {jenis}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Total Sekolah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{data.summary.totalSekolah}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">Sekolah binaan</p>
          </CardContent>
        </Card>
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Total Kegiatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{data.summary.totalKegiatan}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">Kegiatan tahun ini</p>
          </CardContent>
        </Card>
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Kabupaten/Kota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{data.summary.jumlahKabupaten}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">Wilayah binaan</p>
          </CardContent>
        </Card>
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Tingkat Penyelesaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{data.summary.tingkatPenyelesaian}%</p>
            <p className="text-sm font-medium text-slate-700 mt-1">Kegiatan tuntas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
              <MapPin className="size-5 text-indigo-600" />
              Statistik per Kabupaten/Kota
            </CardTitle>
            <CardDescription className="text-slate-700 font-medium">
              Jumlah sekolah dan kegiatan per wilayah
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.statistikKabupaten.length > 0 ? (
              data.statistikKabupaten.map((stat) => (
                <div
                  key={stat.kabupaten}
                  className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">{stat.kabupaten}</h3>
                    <Badge className="rounded-full border-2 border-indigo-300 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      {stat.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <School className="size-5 text-indigo-600" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Sekolah</p>
                        <p className="text-lg font-bold text-slate-900">{stat.jumlahSekolah}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="size-5 text-indigo-600" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Kegiatan</p>
                        <p className="text-lg font-bold text-slate-900">{stat.jumlahKegiatan}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600 text-center py-4">Tidak ada data kabupaten/kota</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
              <School className="size-5 text-indigo-600" />
              Statistik per Jenis Sekolah
            </CardTitle>
            <CardDescription className="text-slate-700 font-medium">
              Distribusi sekolah berdasarkan jenis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.statistikJenis.length > 0 ? (
              data.statistikJenis.map((stat) => (
                <div
                  key={stat.jenis}
                  className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900">{stat.jenis}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-indigo-700">{stat.jumlah}</span>
                      <Badge className="rounded-full border-2 border-indigo-300 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                        {stat.persentase}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-indigo-100 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${stat.persentase}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600 text-center py-4">Tidak ada data jenis sekolah</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

