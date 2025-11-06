"use client";

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
import { Activity, Plus, Upload, FileText, School, Calendar } from "lucide-react";

const jenisKegiatan = [
  {
    id: "pendampingan-ksp",
    title: "Pendampingan Pengembangan KSP",
    description: "Pendampingan dalam pengembangan Kurikulum Satuan Pendidikan",
    icon: Activity,
    color: "indigo",
  },
  {
    id: "pendampingan-pembelajaran",
    title: "Pendampingan Pembelajaran Mendalam",
    description: "Pendampingan pada kegiatan kurikuler",
    icon: Activity,
    color: "blue",
  },
  {
    id: "pendampingan-program",
    title: "Pendampingan Program Prioritas",
    description: "Program Prioritas Kementerian Pendidikan dan Dinas Pendidikan Provinsi Jawa Tengah",
    icon: Activity,
    color: "indigo",
  },
  {
    id: "supervisi-akademik",
    title: "Supervisi Akademik",
    description: "Supervisi kegiatan pembelajaran dan akademik",
    icon: FileText,
    color: "blue",
  },
  {
    id: "supervisi-manajerial",
    title: "Supervisi Manajerial",
    description: "Supervisi manajemen sekolah dan administrasi",
    icon: FileText,
    color: "indigo",
  },
  {
    id: "supervisi-snp",
    title: "Supervisi Pemenuhan 8 SNP",
    description: "Supervisi Standar Nasional Pendidikan",
    icon: FileText,
    color: "blue",
  },
  {
    id: "supervisi-tematik",
    title: "Supervisi Tematik",
    description: "AKM, TKA, Penilaian Sumatif, Ekstrakurikuler, PPK, dll.",
    icon: FileText,
    color: "indigo",
  },
  {
    id: "pkks",
    title: "Pengelolaan Kinerja (PKKS)",
    description: "Sebelum melakukan penilaian akhir sebagai anggota Tim Kerja",
    icon: Activity,
    color: "blue",
  },
];

const kegiatanTerbaru = [
  {
    id: "keg-001",
    jenis: "Supervisi Akademik",
    sekolah: "SMA Negeri 1 Semarang",
    tanggal: "10 November 2025",
    status: "Selesai",
  },
  {
    id: "keg-002",
    jenis: "Pendampingan Pengembangan KSP",
    sekolah: "SLB Negeri Ungaran",
    tanggal: "8 November 2025",
    status: "Selesai",
  },
  {
    id: "keg-003",
    jenis: "Supervisi Manajerial",
    sekolah: "SMA Negeri 2 Semarang",
    tanggal: "5 November 2025",
    status: "Selesai",
  },
];

export default function PelaksanaanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pelaksanaan Pendampingan & Supervisi</h1>
          <p className="text-sm text-slate-600 mt-1">
            Entri data pendampingan dan supervisi, upload bukti kegiatan, dan rekap hasil
          </p>
        </div>
        <Button
          className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
          asChild
        >
          <Link href="/pengawas/pelaksanaan/buat">
            <Plus className="size-4 mr-2" />
            Entri Kegiatan Baru
          </Link>
        </Button>
      </div>

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Activity className="size-5 text-indigo-600" />
            Jenis Kegiatan
          </CardTitle>
          <CardDescription className="text-slate-700">
            Pilih jenis kegiatan untuk melakukan entri data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {jenisKegiatan.map((kegiatan) => (
              <Link
                key={kegiatan.id}
                href={`/pengawas/pelaksanaan/${kegiatan.id}`}
                className="block rounded-xl border border-indigo-100 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex size-10 items-center justify-center rounded-lg text-white shadow-md",
                    kegiatan.color === "indigo" 
                      ? "bg-gradient-to-br from-indigo-500 to-indigo-400"
                      : "bg-gradient-to-br from-blue-500 to-blue-400"
                  )}>
                    <kegiatan.icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      {kegiatan.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {kegiatan.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Calendar className="size-5 text-indigo-600" />
            Kegiatan Terbaru
          </CardTitle>
          <CardDescription className="text-slate-700">
            Daftar kegiatan pendampingan dan supervisi yang telah dilakukan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {kegiatanTerbaru.map((kegiatan) => (
            <div
              key={kegiatan.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-indigo-100 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                  <Activity className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    {kegiatan.jenis}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <School className="size-3" />
                      {kegiatan.sekolah}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {kegiatan.tanggal}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {kegiatan.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                  asChild
                >
                  <Link href={`/pengawas/pelaksanaan/${kegiatan.id}`}>
                    Lihat Detail
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Upload className="size-5 text-indigo-600" />
            Fitur Entri Data
          </CardTitle>
          <CardDescription className="text-slate-700">
            Kemudahan dalam melakukan entri dan pengelolaan data kegiatan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-indigo-100 bg-white p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Fitur yang Tersedia:
              </p>
              <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
                <li>Entri data pendampingan dan supervisi berbagai jenis</li>
                <li>Upload bukti kegiatan (foto, berita acara, instrumen hasil pengawasan)</li>
                <li>Rekap hasil otomatis dalam bentuk simpulan, grafik dan tabel</li>
                <li>Filter dan pencarian berdasarkan sekolah, tanggal, jenis kegiatan</li>
                <li>Ekspor data ke Excel atau PDF</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

