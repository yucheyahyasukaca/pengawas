"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCheck, Download, CheckCircle2, BarChart3, TrendingUp, ArrowRight, Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function LaporanTahunanPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState(laporanTahunan);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load state from localStorage on client mount
  useEffect(() => {
    const storedDeleted = localStorage.getItem("laporan_deleted");
    const storedPublished = localStorage.getItem("laporan_published");

    let updatedReports = [...laporanTahunan];

    // Filter deleted
    if (storedDeleted) {
      const deletedIds = JSON.parse(storedDeleted);
      updatedReports = updatedReports.filter(r => !deletedIds.includes(r.id));
    }

    // Update published status
    if (storedPublished) {
      const publishedIds = JSON.parse(storedPublished);
      updatedReports = updatedReports.map(r =>
        publishedIds.includes(r.id) ? { ...r, status: "Selesai" } : r
      );
    }

    setReports(updatedReports);
  }, []);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setReports((prev) => {
        const newState = prev.filter((item) => item.id !== deleteId);

        // Persist deletion
        const currentDeleted = JSON.parse(localStorage.getItem("laporan_deleted") || "[]");
        localStorage.setItem("laporan_deleted", JSON.stringify([...currentDeleted, deleteId]));

        return newState;
      });

      toast({
        title: "Laporan Dihapus",
        description: "Laporan tahunan berhasil dihapus dari daftar.",
        variant: "success",
      });
      setDeleteId(null);
    }
  };

  const handlePublish = (id: string) => {
    setReports((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, status: "Selesai" } : r
      );

      // Persist status
      const currentPublished = JSON.parse(localStorage.getItem("laporan_published") || "[]");
      localStorage.setItem("laporan_published", JSON.stringify([...currentPublished, id]));

      return updated;
    });

    toast({
      title: "Laporan Diterbitkan",
      description: "Laporan tahunan berhasil diterbitkan.",
      variant: "success",
    });
  };

  const [statistik, setStatistik] = useState([
    { label: "Total Kegiatan", value: "...", change: "...", icon: BarChart3 },
    { label: "Sekolah Binaan", value: "...", change: "...", icon: TrendingUp },
    { label: "Pelaporan Triwulan", value: "...", change: "...", icon: FileCheck },
    { label: "Tingkat Penyelesaian", value: "...", change: "...", icon: CheckCircle2 },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const res = await fetch(`/api/pengawas/laporan/tahunan/stats?year=${currentYear}`);
        if (res.ok) {
          const data = await res.json();
          setStatistik([
            {
              label: "Total Kegiatan",
              value: data.totalKegiatan.value.toString(),
              change: data.totalKegiatan.text,
              icon: BarChart3
            },
            {
              label: "Sekolah Binaan",
              value: data.sekolahBinaan.value.toString(),
              change: data.sekolahBinaan.text,
              icon: TrendingUp
            },
            {
              label: "Pelaporan Triwulan",
              value: data.pelaporanTriwulan.value,
              change: data.pelaporanTriwulan.text,
              icon: FileCheck
            },
            {
              label: "Tingkat Penyelesaian",
              value: data.tingkatPenyelesaian.value,
              change: data.tingkatPenyelesaian.text,
              icon: CheckCircle2
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

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
        {statistik.map((stat) => (
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
        {reports.map((laporan) => (
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
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-300 transition-all duration-300 group"
                  asChild
                >
                  <Link href={`/pengawas/pelaporan/tahunan/${laporan.id}`}>
                    <span className="mr-2">Lihat Detail</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                {laporan.status === "Draft" && (
                  <Button
                    className="size-10 rounded-full border-0 bg-green-50 text-green-600 shadow-sm hover:bg-green-100 hover:text-green-700 transition-all duration-300"
                    title="Terbitkan Laporan"
                    onClick={() => handlePublish(laporan.id)}
                  >
                    <Send className="size-4" />
                  </Button>
                )}
                <Button
                  className="size-10 rounded-full border-0 bg-indigo-50 text-indigo-600 shadow-sm hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-300"
                >
                  <Download className="size-4" />
                </Button>
                <Button
                  className="size-10 rounded-full border-0 bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-100 hover:text-rose-700 transition-all duration-300"
                  onClick={() => handleDelete(laporan.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-slate-900 font-bold">Laporan Tahunan Otomatis</CardTitle>
          <CardDescription className="text-slate-700">
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

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-slate-900 font-bold">Hapus Laporan?</DialogTitle>
            <DialogDescription className="text-slate-600">
              Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-2 border-slate-200 bg-transparent text-slate-900 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors">
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

