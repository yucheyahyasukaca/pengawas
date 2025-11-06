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
import { GraduationCap, Plus, Download, FileText, Calendar, Award } from "lucide-react";

const pengembanganDiri = [
  {
    id: "pd-001",
    nama: "Workshop Supervisi Akademik Berbasis Digital",
    tanggal: "15 Oktober 2025",
    materi: "Penggunaan teknologi dalam supervisi akademik",
    sertifikat: "Sertifikat_Pengembangan_Diri_001.pdf",
    status: "Disetujui",
  },
  {
    id: "pd-002",
    nama: "Pelatihan Pendampingan Kurikulum Merdeka",
    tanggal: "1 Oktober 2025",
    materi: "Strategi pendampingan implementasi Kurikulum Merdeka",
    sertifikat: "Sertifikat_Pengembangan_Diri_002.pdf",
    status: "Disetujui",
  },
  {
    id: "pd-003",
    nama: "Seminar Nasional Kepengawasan",
    tanggal: "20 September 2025",
    materi: "Best practice kepengawasan di era digital",
    sertifikat: "Sertifikat_Pengembangan_Diri_003.pdf",
    status: "Selesai",
  },
];

export default function PengembanganDiriPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengembangan Diri</h1>
          <p className="text-sm text-slate-600 mt-1">
            Upload laporan singkat pengembangan diri, sertifikat, dan materi kegiatan
          </p>
        </div>
        <Button
          className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
          asChild
        >
          <Link href="/pengawas/pengembangan-diri/buat">
            <Plus className="size-4 mr-2" />
            Upload Pengembangan Diri
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pengembanganDiri.map((pd) => (
          <Card
            key={pd.id}
            className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 transition hover:shadow-lg hover:shadow-indigo-200"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                    <GraduationCap className="size-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold text-slate-900">
                      {pd.nama}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      Tanggal: {pd.tanggal}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {pd.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <FileText className="size-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium">Materi:</span> {pd.materi}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Award className="size-3 text-indigo-500" />
                <span className="truncate">{pd.sertifikat}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                  asChild
                >
                  <Link href={`/pengawas/pengembangan-diri/${pd.id}`}>
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
            <FileText className="size-5 text-indigo-600" />
            Laporan Pengembangan Diri
          </CardTitle>
          <CardDescription className="text-slate-700">
            Laporan pengembangan diri dapat diunduh secara otomatis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-indigo-100 bg-white p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Komponen Laporan:
              </p>
              <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
                <li>Nama pengembangan diri</li>
                <li>Tanggal pelaksanaan</li>
                <li>Materi kegiatan</li>
                <li>Sertifikat (jika ada)</li>
                <li>Refleksi dan rencana tindak lanjut</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Format Laporan:
              </p>
              <p className="text-xs text-slate-600">
                Laporan pengembangan diri dapat diunduh secara otomatis dalam format PDF dengan identitas pengawas.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
            >
              <Download className="size-4 mr-2" />
              Unduh Laporan Pengembangan Diri
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

