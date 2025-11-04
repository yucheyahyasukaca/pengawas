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
import { ClipboardList, Plus, Download, FileText, Calendar } from "lucide-react";

const rencanaProgram = [
  {
    id: "rp-001",
    periode: "Semester Genap 2025/2026",
    tanggal: "1 Desember 2025",
    status: "Disetujui",
    file: "Rencana_Program_Kepengawasan_Semester_Genap_2025.pdf",
  },
  {
    id: "rp-002",
    periode: "Semester Ganjil 2025/2026",
    tanggal: "1 Juli 2025",
    status: "Disetujui",
    file: "Rencana_Program_Kepengawasan_Semester_Ganjil_2025.pdf",
  },
  {
    id: "rp-003",
    periode: "Semester Genap 2024/2025",
    tanggal: "1 Desember 2024",
    status: "Selesai",
    file: "Rencana_Program_Kepengawasan_Semester_Genap_2024.pdf",
  },
];

export default function RencanaProgramPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rencana Program Kepengawasan</h1>
          <p className="text-sm text-slate-600 mt-1">
            Input dan kelola rencana program kepengawasan, unduh laporan dalam format PDF
          </p>
        </div>
        <Button
          className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
          asChild
        >
          <Link href="/pengawas/perencanaan/rencana-program/buat">
            <Plus className="size-4 mr-2" />
            Buat Rencana Program
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rencanaProgram.map((rencana) => (
          <Card
            key={rencana.id}
            className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 transition hover:shadow-lg hover:shadow-indigo-200"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                    <ClipboardList className="size-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {rencana.periode}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      Dibuat: {rencana.tanggal}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {rencana.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FileText className="size-4 text-indigo-500" />
                <span className="text-xs truncate">{rencana.file}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                  asChild
                >
                  <Link href={`/pengawas/perencanaan/rencana-program/${rencana.id}`}>
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
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-indigo-500" />
            Panduan Penyusunan Rencana Program
          </CardTitle>
          <CardDescription>
            Ketentuan dan format penyusunan rencana program kepengawasan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-indigo-100 bg-white p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Komponen Rencana Program:
              </p>
              <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
                <li>Identitas pengawas dan wilayah tugas</li>
                <li>Daftar sekolah binaan</li>
                <li>Program kegiatan supervisi dan pendampingan</li>
                <li>Jadwal kegiatan per triwulan</li>
                <li>Target capaian dan indikator keberhasilan</li>
                <li>Rencana anggaran (jika diperlukan)</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Format Laporan:
              </p>
              <p className="text-xs text-slate-600">
                Laporan dapat diunduh dalam format PDF dengan identitas pengawas dan tanda tangan digital.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

