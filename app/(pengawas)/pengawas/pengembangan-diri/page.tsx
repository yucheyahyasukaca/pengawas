"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Plus, Download, FileText, Award, MoreVertical, Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface PengembanganDiri {
  id: string;
  nama_kegiatan: string;
  tanggal_kegiatan: string;
  materi_kegiatan: string;
  sertifikat_url: string | null;
  status: string;
}

export default function PengembanganDiriPage() {
  const [data, setData] = useState<PengembanganDiri[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("semua");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pengawas/pengembangan-diri");
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Gagal mengambil data (${response.status})`);
      }
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disetujui":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "selesai":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "ditolak":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
    }
  };

  const filteredData = data.filter((item) => {
    if (filter === "semua") return true;
    return item.status === filter;
  });

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

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["semua", "diajukan", "disetujui", "selesai"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "ghost"}
            className={`rounded-full capitalize px-6 transition-all duration-200 ${filter === status
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg"
              : "bg-slate-100 text-slate-600 hover:bg-white hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 shadow-sm"
              }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">Error: {error}</div>
      ) : filteredData.length === 0 ? (
        <Card className="border border-dashed border-slate-300 bg-slate-50 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-slate-100 p-4 mb-3">
              <GraduationCap className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {filter === "semua" ? "Belum ada kegiatan" : "Tidak ada kegiatan dengan status ini"}
            </h3>
            <p className="text-slate-500 max-w-sm mt-1 mb-4">
              {filter === "semua" ? "Anda belum menambahkan kegiatan pengembangan diri. Silakan tambahkan kegiatan baru." : "Cobalah ubah filter status atau tambahkan kegiatan baru."}
            </p>
            {filter === "semua" && (
              <Button
                className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
                asChild
              >
                <Link href="/pengawas/pengembangan-diri/buat">
                  <Plus className="size-4 mr-2" />
                  Tambah Kegiatan
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((pd) => (
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
                      <CardTitle className="text-base font-semibold text-slate-900 line-clamp-2">
                        {pd.nama_kegiatan}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar className="size-3" />
                        {format(new Date(pd.tanggal_kegiatan), "d MMMM yyyy", { locale: id })}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${getStatusColor(pd.status)}`}>
                    {pd.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <FileText className="size-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div className="line-clamp-2">
                    <span className="font-medium">Materi:</span> {pd.materi_kegiatan}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Award className="size-3 text-indigo-500" />
                  <span className="truncate">{pd.sertifikat_url ? "Sertifikat tersedia" : "Belum ada sertifikat"}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="default"
                    className="flex-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-0 shadow-none font-medium"
                    asChild
                  >
                    <Link href={`/pengawas/pengembangan-diri/${pd.id}`}>
                      Lihat Detail
                    </Link>
                  </Button>
                  {pd.sertifikat_url && (
                    <Button
                      variant="outline"
                      className="rounded-full border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50 hover:text-indigo-700"
                      asChild
                    >
                      <a href={pd.sertifikat_url} target="_blank" rel="noopener noreferrer">
                        <Download className="size-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
              className="w-full rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all"
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
