"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Bell,
  Bug,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  Loader2,
  School,
  TrendingUp,
} from "lucide-react";

interface DashboardData {
  stats: {
    sekolahBinaan: {
      value: string;
      change: string;
    };
    pelaporanTriwulan: {
      value: string;
      change: string;
    };
    supervisiTerjadwal: {
      value: string;
      change: string;
    };
    tenggatWaktu: {
      value: string;
      change: string;
    };
  };
  sekolahBinaan: Array<{
    id: string;
    nama: string;
    npsn: string;
    jenis: string;
    status: string;
    pelaporan: string;
  }>;
  jadwalKegiatan: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
    status: string;
  }>;
  notifikasi: Array<{
    id: string;
    title: string;
    message: string;
    priority: string;
    date: string;
  }>;
  pelaporanTriwulan: {
    year: number;
    quarters: Array<{
      triwulan: string;
      status: string;
      date: string;
    }>;
    percentage: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statIcons = {
  sekolahBinaan: School,
  pelaporanTriwulan: FileCheck,
  supervisiTerjadwal: Calendar,
  tenggatWaktu: Bell,
};

export default function PengawasDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/pengawas/dashboard?page=${page}&limit=5`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Gagal memuat data dashboard");
        }

        if (result.success && result.data) {
          setData(result.data);
        } else {
          throw new Error("Format data tidak valid");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-red-200 bg-red-50/50 max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="size-5" />
              Terjadi Kesalahan
            </CardTitle>
            <CardDescription className="text-red-600">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Muat Ulang
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const stats = [
    {
      label: "Sekolah Binaan",
      value: data.stats.sekolahBinaan.value,
      change: data.stats.sekolahBinaan.change,
      icon: statIcons.sekolahBinaan,
      trend: "neutral" as const,
    },
    {
      label: "Pelaporan Triwulan",
      value: data.stats.pelaporanTriwulan.value,
      change: data.stats.pelaporanTriwulan.change,
      icon: statIcons.pelaporanTriwulan,
      trend: "positive" as const,
    },
    {
      label: "Supervisi Terjadwal",
      value: data.stats.supervisiTerjadwal.value,
      change: data.stats.supervisiTerjadwal.change,
      icon: statIcons.supervisiTerjadwal,
      trend: "positive" as const,
    },
    {
      label: "Tenggat Waktu",
      value: data.stats.tenggatWaktu.value,
      change: data.stats.tenggatWaktu.change,
      icon: statIcons.tenggatWaktu,
      trend: data.stats.tenggatWaktu.value !== "0" ? ("warning" as const) : ("neutral" as const),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70"
          >
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 p-2.5 text-white shadow-md">
                <stat.icon className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  {stat.label}
                </CardTitle>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className="flex size-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <TrendingUp className="size-3.5" />
                </span>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-900">Sekolah Binaan</CardTitle>
              <CardDescription className="text-slate-600">
                Daftar sekolah binaan dan status pelaporan terbaru.
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 rounded-full p-1 border border-slate-100 shadow-sm">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full text-slate-500 hover:bg-white hover:text-indigo-600 disabled:opacity-30"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <span className="text-xs font-semibold text-slate-600 px-2 min-w-[3rem] text-center">
                {page} / {data?.pagination?.totalPages || 1}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full text-slate-500 hover:bg-white hover:text-indigo-600 disabled:opacity-30"
                disabled={!data?.pagination || page >= data.pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.sekolahBinaan.length > 0 ? (
              <>
                {data.sekolahBinaan.map((sekolah) => (
                  <Link
                    key={sekolah.id}
                    href={`/pengawas/manajemen-data/sekolah/${sekolah.id}`}
                    className="block rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col gap-1 flex-1">
                        <p className="text-base font-semibold text-slate-900">
                          {sekolah.nama}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>NPSN: {sekolah.npsn}</span>
                          <span>•</span>
                          <span>{sekolah.jenis}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="w-fit rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm">
                          {sekolah.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        {sekolah.pelaporan}
                      </span>
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">Belum ada sekolah binaan</p>
                <Link href="/pengawas/lengkapi-profil">
                  <Button variant="link" className="text-indigo-600 mt-2">
                    Lengkapi Profil
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-900">Jadwal Kegiatan</CardTitle>
              <CardDescription className="text-slate-600">
                Agenda supervisi dan pendampingan yang akan datang.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="default"
              className="w-full rounded-full border-0 bg-indigo-600 px-4 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white sm:w-auto"
              asChild
            >
              <Link href="/pengawas/pelaksanaan">
                Lihat Kalender
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.jadwalKegiatan.length > 0 ? (
              data.jadwalKegiatan.map((kegiatan) => (
                <div
                  key={kegiatan.id}
                  className="flex flex-col gap-1 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100"
                >
                  <p className="text-base font-semibold text-slate-900">
                    {kegiatan.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {kegiatan.date}
                    </span>
                    <span>•</span>
                    <Badge
                      variant="outline"
                      className="rounded-full border-0 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600"
                    >
                      {kegiatan.type}
                    </Badge>
                    <span>•</span>
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600">
                      {kegiatan.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">Belum ada jadwal kegiatan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                <Bell className="size-4" />
              </span>
              Notifikasi Tenggat Waktu
            </CardTitle>
            <CardDescription className="text-slate-600">
              Item yang memerlukan perhatian segera.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.notifikasi.length > 0 ? (
              data.notifikasi.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "rounded-2xl border p-4 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md",
                    notif.priority === "high"
                      ? "border-red-200 bg-red-50/50"
                      : "border-indigo-100 bg-white"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        notif.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : "bg-indigo-100 text-indigo-600"
                      )}
                    >
                      {notif.priority === "high" ? (
                        <AlertTriangle className="size-4" />
                      ) : (
                        <Clock className="size-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">
                        {notif.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {notif.message}
                      </p>
                      <p className="mt-2 text-[10px] font-medium text-slate-500">
                        {notif.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">Tidak ada notifikasi</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Status Pelaporan</CardTitle>
            <CardDescription className="text-slate-600">
              Ringkasan status pelaporan triwulan dan tahunan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-5 shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <p className="text-base font-semibold text-slate-900">
                  Pelaporan Triwulan {data.pelaporanTriwulan.year}
                </p>
                <Badge className="rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {data.pelaporanTriwulan.percentage}% Selesai
                </Badge>
              </div>
              <div className="space-y-2">
                {data.pelaporanTriwulan.quarters.map((item) => (
                  <div
                    key={item.triwulan}
                    className="flex items-center justify-between rounded-xl border border-indigo-100 bg-white p-3 text-sm"
                  >
                    <span className="font-medium text-slate-700">{item.triwulan}</span>
                    <div className="flex items-center gap-2">
                      {item.status === "Selesai" ? (
                        <CheckCircle2 className="size-4 text-green-600" />
                      ) : (
                        <Clock className="size-4 text-indigo-600" />
                      )}
                      <span className={cn(
                        "text-xs font-medium",
                        item.status === "Selesai" ? "text-green-600" : "text-indigo-600"
                      )}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                variant="default"
                className="mt-4 w-full rounded-full border-0 bg-indigo-600 px-4 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
                asChild
              >
                <Link href="/pengawas/pelaporan/triwulan">
                  Kelola Pelaporan
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 shadow-lg shadow-indigo-100/70">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                <Bug className="size-4" />
              </span>
              Laporkan Bug di Portal Pengawas
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-600">
              Sampaikan kendala teknis agar kami dapat memperbaiki dan meningkatkan pengalaman Anda.
            </CardDescription>
          </div>
          <Button
            asChild
            className="w-full rounded-full border-0 bg-indigo-600 px-5 py-2 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg sm:w-auto"
          >
            <Link href="https://forms.gle/6L4u5n59M9qKbdDz5" target="_blank" rel="noopener noreferrer">
              Kirim Bug Report
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

