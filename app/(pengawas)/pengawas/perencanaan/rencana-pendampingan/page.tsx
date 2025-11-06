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
import { Target, Plus, FileText, School, TrendingUp } from "lucide-react";

const rencanaPendampingan = [
  {
    id: "rd-001",
    sekolah: "SMA Negeri 1 Semarang",
    periode: "2025/2026",
    tanggal: "15 November 2025",
    status: "Disusun",
    prioritas: "Tinggi",
  },
  {
    id: "rd-002",
    sekolah: "SLB Negeri Ungaran",
    periode: "2025/2026",
    tanggal: "10 November 2025",
    status: "Disetujui",
    prioritas: "Sedang",
  },
  {
    id: "rd-003",
    sekolah: "SMA Negeri 2 Semarang",
    periode: "2024/2025",
    tanggal: "1 Oktober 2024",
    status: "Selesai",
    prioritas: "Tinggi",
  },
];

export default function RencanaPendampinganPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rencana Pendampingan RKS</h1>
          <p className="text-sm text-slate-600 mt-1">
            Menyusun rencana pendampingan dalam menyusun RKS berbasis data
          </p>
        </div>
        <Button
          className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
          asChild
        >
          <Link href="/pengawas/perencanaan/rencana-pendampingan/buat">
            <Plus className="size-4 mr-2" />
            Buat Rencana Pendampingan
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rencanaPendampingan.map((rencana) => (
          <Card
            key={rencana.id}
            className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 transition hover:shadow-lg hover:shadow-indigo-200"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                    <Target className="size-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold text-slate-900">
                      {rencana.sekolah}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      Periode: {rencana.periode}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Status:</span>
                <Badge className="rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {rencana.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Prioritas:</span>
                <Badge className={cn(
                  "rounded-full border-0 px-3 py-1 text-xs font-semibold",
                  rencana.prioritas === "Tinggi" 
                    ? "bg-red-100 text-red-600"
                    : rencana.prioritas === "Sedang"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-green-100 text-green-600"
                )}>
                  {rencana.prioritas}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FileText className="size-3" />
                <span>Dibuat: {rencana.tanggal}</span>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                asChild
              >
                <Link href={`/pengawas/perencanaan/rencana-pendampingan/${rencana.id}`}>
                  Lihat Detail
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <TrendingUp className="size-5 text-indigo-600" />
            Integrasi Rapor Pendidikan
          </CardTitle>
          <CardDescription className="text-slate-700">
            Mengaitkan hasil Rapor Pendidikan sekolah binaan untuk menetapkan prioritas masalah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-indigo-100 bg-white p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Komponen Rencana Pendampingan:
              </p>
              <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
                <li>Analisis Rapor Pendidikan sekolah binaan</li>
                <li>Identifikasi prioritas masalah berbasis data</li>
                <li>Rencana perbaikan dan pengembangan</li>
                <li>Jadwal pendampingan kepala sekolah</li>
                <li>Target capaian perbaikan</li>
                <li>Indikator keberhasilan pendampingan</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Tujuan Pendampingan:
              </p>
              <p className="text-xs text-slate-600">
                Membantu kepala sekolah menyusun Rencana Kerja Sekolah (RKS) yang berbasis data dan mengacu pada prioritas masalah yang teridentifikasi dari Rapor Pendidikan.
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

