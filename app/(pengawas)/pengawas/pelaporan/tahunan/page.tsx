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
import { FileCheck, Download, CheckCircle2, BarChart3, TrendingUp } from "lucide-react";

const laporanTahunan = [
  {
    id: "tahun-2025",
    tahun: "2025",
    periode: "Januari - Desember 2025",
    tanggal: "31 Desember 2025",
    status: "Draft",
    file: "Laporan_Tahunan_2025.pdf",
  },
  {
    id: "tahun-2024",
    tahun: "2024",
    periode: "Januari - Desember 2024",
    tanggal: "31 Desember 2024",
    status: "Selesai",
    file: "Laporan_Tahunan_2024.pdf",
  },
  {
    id: "tahun-2023",
    tahun: "2023",
    periode: "Januari - Desember 2023",
    tanggal: "31 Desember 2023",
    status: "Selesai",
    file: "Laporan_Tahunan_2023.pdf",
  },
];

const statistikTahunan = [
  { label: "Total Kegiatan", value: "119", change: "+15 dari tahun lalu", icon: BarChart3 },
  { label: "Sekolah Binaan", value: "31", change: "+3 sekolah baru", icon: TrendingUp },
  { label: "Pelaporan Triwulan", value: "75%", change: "3 dari 4 triwulan", icon: FileCheck },
  { label: "Tingkat Penyelesaian", value: "85%", change: "Kegiatan tuntas", icon: CheckCircle2 },
];

export default function LaporanTahunanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Tahunan</h1>
          <p className="text-sm text-slate-600 mt-1">
            Laporan tahunan otomatis merekap seluruh kegiatan dan capaian
          </p>
        </div>
        <Button
          className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
        >
          <Download className="size-4 mr-2" />
          Unduh Laporan Tahunan
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statistikTahunan.map((stat) => (
          <Card
            key={stat.label}
            className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wide text-indigo-500 flex items-center gap-2">
                <stat.icon className="size-4" />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {laporanTahunan.map((laporan) => (
          <Card
            key={laporan.id}
            className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 transition hover:shadow-lg hover:shadow-indigo-200"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                    <FileCheck className="size-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      Laporan Tahun {laporan.tahun}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      {laporan.periode}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={cn(
                  "rounded-full border-0 px-3 py-1 text-xs font-semibold",
                  laporan.status === "Selesai"
                    ? "bg-green-100 text-green-600"
                    : "bg-indigo-100 text-indigo-600"
                )}>
                  {laporan.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FileCheck className="size-4 text-indigo-500" />
                <span className="text-xs truncate">{laporan.file}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                  asChild
                >
                  <Link href={`/pengawas/pelaporan/tahunan/${laporan.id}`}>
                    Lihat Detail
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                >
                  <Download className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle>Laporan Tahunan Otomatis</CardTitle>
          <CardDescription>
            Sistem otomatis merekap seluruh kegiatan dan capaian dari laporan triwulan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-indigo-100 bg-white p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Komponen Laporan Tahunan:
              </p>
              <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
                <li>Ringkasan kegiatan sepanjang tahun</li>
                <li>Rekap kegiatan per sekolah binaan</li>
                <li>Analisis capaian dan indikator keberhasilan</li>
                <li>Temuan dan rekomendasi strategis</li>
                <li>Rencana tindak lanjut tahun berikutnya</li>
                <li>Lampiran data statistik dan grafik</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Fitur Ekspor:
              </p>
              <p className="text-xs text-slate-600">
                Laporan tahunan dapat diekspor ke PDF secara otomatis dengan identitas pengawas dan tanda tangan digital.
              </p>
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

