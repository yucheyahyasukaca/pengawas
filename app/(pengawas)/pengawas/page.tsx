"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  School,
  FileCheck,
  Calendar,
  Bell,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";

const stats = [
  {
    label: "Sekolah Binaan",
    value: "8",
    change: "3 SMA, 5 SLB",
    icon: School,
    trend: "neutral",
  },
  {
    label: "Pelaporan Triwulan",
    value: "75%",
    change: "3 dari 4 triwulan",
    icon: FileCheck,
    trend: "positive",
  },
  {
    label: "Supervisi Terjadwal",
    value: "12",
    change: "Bulan ini",
    icon: Calendar,
    trend: "positive",
  },
  {
    label: "Tenggat Waktu",
    value: "3",
    change: "Perlu perhatian",
    icon: Bell,
    trend: "warning",
  },
];

const sekolahBinaan = [
  {
    id: "skl-001",
    nama: "SMA Negeri 1 Semarang",
    npsn: "20325123",
    jenis: "Negeri",
    status: "Aktif",
    pelaporan: "Triwulan 3 selesai",
  },
  {
    id: "skl-002",
    nama: "SLB Negeri Ungaran",
    npsn: "20325124",
    jenis: "Negeri",
    status: "Aktif",
    pelaporan: "Triwulan 3 selesai",
  },
  {
    id: "skl-003",
    nama: "SMA Negeri 2 Semarang",
    npsn: "20325125",
    jenis: "Negeri",
    status: "Aktif",
    pelaporan: "Triwulan 3 pending",
  },
];

const jadwalKegiatan = [
  {
    id: "keg-001",
    title: "Supervisi Akademik SMA Negeri 1 Semarang",
    date: "10 November 2025",
    type: "Supervisi Akademik",
    status: "Terjadwal",
  },
  {
    id: "keg-002",
    title: "Pendampingan Pengembangan KSP SLB Negeri Ungaran",
    date: "15 November 2025",
    type: "Pendampingan",
    status: "Terjadwal",
  },
  {
    id: "keg-003",
    title: "Supervisi Manajerial SMA Negeri 2 Semarang",
    date: "20 November 2025",
    type: "Supervisi Manajerial",
    status: "Butuh Persiapan",
  },
];

const notifikasi = [
  {
    id: "notif-001",
    title: "Tenggat Pelaporan Triwulan 4",
    message: "Batas waktu pengiriman laporan triwulan 4: 30 November 2025",
    priority: "high",
    date: "2 hari lagi",
  },
  {
    id: "notif-002",
    title: "Perlu Tindak Lanjut Supervisi",
    message: "SMA Negeri 2 Semarang memerlukan tindak lanjut dari hasil supervisi bulan lalu",
    priority: "medium",
    date: "5 hari lalu",
  },
  {
    id: "notif-003",
    title: "Rencana Program Kepengawasan",
    message: "Rencana program kepengawasan untuk semester genap perlu disusun",
    priority: "medium",
    date: "1 minggu lagi",
  },
];

export default function PengawasDashboardPage() {
  // Note: We don't need to check authentication here because:
  // 1. Server-side layout already validates user via getCurrentUser()
  // 2. Client-side checks were causing automatic logout due to race conditions
  // 3. PengawasProfileCheck component handles profile completion redirects
  // 
  // If server-side validation passes, user is authenticated.
  // Client-side checks should only handle redirects for incomplete profiles,
  // which is handled by PengawasProfileCheck component.

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
            <Button
              size="sm"
              variant="default"
              className="w-full rounded-full border-0 bg-indigo-600 px-4 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white sm:w-auto"
              asChild
            >
              <Link href="/pengawas/manajemen-data/sekolah">
                Lihat Semua
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sekolahBinaan.map((sekolah) => (
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
            {jadwalKegiatan.map((kegiatan) => (
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
            ))}
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
            {notifikasi.map((notif) => (
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
            ))}
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
                  Pelaporan Triwulan 2025
                </p>
                <Badge className="rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  75% Selesai
                </Badge>
              </div>
              <div className="space-y-2">
                {[
                  { triwulan: "Triwulan 1", status: "Selesai", date: "31 Maret 2025" },
                  { triwulan: "Triwulan 2", status: "Selesai", date: "30 Juni 2025" },
                  { triwulan: "Triwulan 3", status: "Selesai", date: "30 September 2025" },
                  { triwulan: "Triwulan 4", status: "Pending", date: "30 November 2025" },
                ].map((item) => (
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
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

