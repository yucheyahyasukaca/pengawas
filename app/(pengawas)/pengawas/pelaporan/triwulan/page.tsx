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
import { FileBarChart, Download, CheckCircle2, Clock, Calendar } from "lucide-react";

const laporanTriwulan = [
  {
    id: "triwulan-1",
    periode: "Triwulan 1 (Januari - Maret)",
    tahun: "2025",
    tanggal: "31 Maret 2025",
    status: "Selesai",
    file: "Laporan_Triwulan_1_2025.pdf",
  },
  {
    id: "triwulan-2",
    periode: "Triwulan 2 (April - Juni)",
    tahun: "2025",
    tanggal: "30 Juni 2025",
    status: "Selesai",
    file: "Laporan_Triwulan_2_2025.pdf",
  },
  {
    id: "triwulan-3",
    periode: "Triwulan 3 (Juli - September)",
    tahun: "2025",
    tanggal: "30 September 2025",
    status: "Selesai",
    file: "Laporan_Triwulan_3_2025.pdf",
  },
  {
    id: "triwulan-4",
    periode: "Triwulan 4 (Oktober - Desember)",
    tahun: "2025",
    tanggal: "30 November 2025",
    status: "Draft",
    file: "Laporan_Triwulan_4_2025.pdf",
  },
];

export default function LaporanTriwulanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Triwulan</h1>
          <p className="text-sm text-slate-600 mt-1">
            Format laporan Triwulan 1, 2, 3, 4 sesuai dengan template resmi
          </p>
        </div>
        <Button
          className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
          asChild
        >
          <Link href="/pengawas/pelaporan/triwulan/buat">
            Buat Laporan Triwulan
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {laporanTriwulan.map((laporan) => (
          <Card
            key={laporan.id}
            className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 transition hover:shadow-lg hover:shadow-indigo-200"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                    <FileBarChart className="size-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {laporan.periode}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      Tahun {laporan.tahun} • Batas: {laporan.tanggal}
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
                {laporan.status === "Selesai" ? (
                  <CheckCircle2 className="size-4 text-green-600" />
                ) : (
                  <Clock className="size-4 text-indigo-600" />
                )}
                <span className="text-xs truncate">{laporan.file}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                  asChild
                >
                  <Link href={`/pengawas/pelaporan/triwulan/${laporan.id}`}>
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
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Calendar className="size-5 text-indigo-600" />
            Format Laporan Triwulan
          </CardTitle>
          <CardDescription className="text-slate-700">
            Ketentuan dan format laporan triwulan sesuai template resmi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-indigo-100 bg-white p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Komponen Laporan Triwulan:
              </p>
              <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
                <li>Identitas pengawas dan periode pelaporan</li>
                <li>Ringkasan kegiatan supervisi dan pendampingan</li>
                <li>Rekap kegiatan per sekolah binaan</li>
                <li>Hasil dan temuan supervisi</li>
                <li>Tindak lanjut dan rekomendasi</li>
                <li>Lampiran bukti kegiatan</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Fitur Ekspor:
              </p>
              <p className="text-xs text-slate-600">
                Laporan dapat diekspor ke PDF secara otomatis dengan identitas pengawas dan tanda tangan digital.
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

