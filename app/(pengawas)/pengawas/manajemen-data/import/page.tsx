"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle } from "lucide-react";

export default function ImportDataPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Import Data Excel</h1>
        <p className="text-sm text-slate-600 mt-1">
          Import data sekolah binaan, pengawas, atau kegiatan dalam format Excel standar
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-5 text-indigo-500" />
              Upload File Excel
            </CardTitle>
            <CardDescription>
              Unggah file Excel dengan format standar yang telah ditentukan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50">
              <Upload className="mx-auto size-12 text-indigo-500 mb-4" />
              <p className="text-sm font-semibold text-slate-900 mb-2">
                Seret file Excel ke sini atau klik untuk memilih
              </p>
              <p className="text-xs text-slate-600 mb-4">
                Format yang didukung: .xlsx, .xls
              </p>
              <Button className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white">
                Pilih File
              </Button>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-white p-4">
              <p className="text-xs font-semibold text-slate-900 mb-2">
                Format Kolom Standar:
              </p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Nama Sekolah / Nama Pengawas</li>
                <li>• NPSN / NIP</li>
                <li>• Jenis (Negeri/Swasta)</li>
                <li>• Alamat</li>
                <li>• Kabupaten/Kota</li>
                <li>• Status (Aktif/Nonaktif)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="size-5 text-indigo-500" />
              Unduh Template
            </CardTitle>
            <CardDescription>
              Download template Excel untuk memastikan format yang benar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
              >
                <FileSpreadsheet className="size-4 mr-2" />
                Template Data Sekolah Binaan
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
              >
                <FileSpreadsheet className="size-4 mr-2" />
                Template Data Pengawas
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
              >
                <FileSpreadsheet className="size-4 mr-2" />
                Template Data Kegiatan
              </Button>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-white p-4">
              <p className="text-xs font-semibold text-slate-900 mb-2">
                Panduan Import:
              </p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3 text-green-600 mt-0.5 shrink-0" />
                  <span>Pastikan kolom sesuai dengan template</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3 text-green-600 mt-0.5 shrink-0" />
                  <span>Data wajib tidak boleh kosong</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-3 text-indigo-600 mt-0.5 shrink-0" />
                  <span>Format NPSN dan NIP harus berupa angka</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-3 text-indigo-600 mt-0.5 shrink-0" />
                  <span>Data duplikat akan diabaikan</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle>Riwayat Import</CardTitle>
          <CardDescription>
            Daftar import data yang telah dilakukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-indigo-100 bg-white p-4 text-center">
            <p className="text-sm text-slate-600">
              Belum ada riwayat import
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

