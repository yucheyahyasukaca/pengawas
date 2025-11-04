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
import { ArrowLeft, Save, Upload } from "lucide-react";

export default function BuatPengembanganDiriPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
          asChild
        >
          <Link href="/pengawas/pengembangan-diri">
            <ArrowLeft className="size-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Upload Pengembangan Diri</h1>
          <p className="text-sm text-slate-600 mt-1">
            Isi formulir untuk mengupload laporan pengembangan diri dan sertifikat
          </p>
        </div>
      </div>

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle>Formulir Pengembangan Diri</CardTitle>
          <CardDescription>
            Lengkapi semua data yang diperlukan untuk laporan pengembangan diri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-indigo-100 bg-white p-8 text-center">
            <p className="text-sm text-slate-600 mb-4">
              Formulir input pengembangan diri akan dikembangkan lebih lanjut
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
              >
                <Save className="size-4 mr-2" />
                Simpan
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
              >
                <Upload className="size-4 mr-2" />
                Upload Sertifikat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

