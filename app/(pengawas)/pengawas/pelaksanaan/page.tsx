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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hash, Users, Heart, Activity, Upload, FileText, School, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { JadwalPelaksanaanTable } from "@/components/pengawas/JadwalPelaksanaanTable";

const monitoringItems = [
  {
    id: "7-kebiasaan-hebat",
    title: "7 Kebiasaan Hebat",
    description: "7 Kebiasaan Hebat",
    icon: Hash,
  },
  {
    id: "8-profil-lulusan",
    title: "8 Profil Lulusan",
    description: "8 Profil Lulusan",
    icon: Users,
  },
  {
    id: "penguatan-karakter",
    title: "Penguatan Karakter",
    description: "Penguatan Karakter",
    icon: Heart,
  },
];

interface MonitoringData {
  id: string;
  monitoringId: string;
  monitoringTitle: string;
  instrumenId: string;
  instrumenNama: string;
  sekolahId: string | number;
  sekolahNama: string;
  tanggalSupervisi: string;
  createdAt: string;
  updatedAt: string;
}

const getMonitoringIcon = (monitoringId: string) => {
  const icons: Record<string, any> = {
    "7-kebiasaan-hebat": Hash,
    "8-profil-lulusan": Users,
    "penguatan-karakter": Heart,
  };
  return icons[monitoringId] || Activity;
};

const getMonitoringTitle = (monitoringId: string) => {
  const titles: Record<string, string> = {
    "7-kebiasaan-hebat": "7 Kebiasaan Hebat",
    "8-profil-lulusan": "8 Profil Lulusan",
    "penguatan-karakter": "Penguatan Karakter",
  };
  return titles[monitoringId] || "Monitoring";
};

const getInstrumenNama = (instrumenId: string) => {
  const names: Record<string, string> = {
    "persiapan-kebiasaan": "Instrumen Persiapan Kebiasaan Anak Indonesia Hebat",
    "pelaksanaan-kebiasaan": "Instrumen Pelaksanaan Kebiasaan Anak Indonesia Hebat",
  };
  return names[instrumenId] || instrumenId;
};

export default function PelaksanaanPage() {
  const [monitoringList, setMonitoringList] = useState<MonitoringData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMonitoringList(true);

    // Listen untuk perubahan di localStorage (dari halaman lain)
    const handleStorageChange = () => {
      loadMonitoringList(false); // Tidak show loading saat refresh
    };

    window.addEventListener("storage", handleStorageChange);

    // Juga listen untuk custom event jika save dilakukan di tab yang sama
    window.addEventListener("monitoring-saved", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("monitoring-saved", handleStorageChange);
    };
  }, []);

  const loadMonitoringList = (showLoading = false) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      // Load dari localStorage (nanti bisa diganti dengan API)
      const stored = localStorage.getItem("monitoring_list");
      if (stored) {
        const data = JSON.parse(stored) as MonitoringData[];
        // Sort by tanggal terbaru
        const sorted = data.sort((a, b) =>
          new Date(b.tanggalSupervisi).getTime() - new Date(a.tanggalSupervisi).getTime()
        );
        setMonitoringList(sorted);
      } else {
        setMonitoringList([]);
      }
    } catch (err) {
      console.error("Error loading monitoring list:", err);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus monitoring ini?")) {
      try {
        const updated = monitoringList.filter((m) => m.id !== id);
        localStorage.setItem("monitoring_list", JSON.stringify(updated));
        setMonitoringList(updated);
      } catch (err) {
        console.error("Error deleting monitoring:", err);
      }
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pelaksanaan Pendampingan & Supervisi</h1>
        <p className="text-sm text-slate-600 mt-1">
          Entri data pendampingan dan supervisi, upload bukti kegiatan, dan rekap hasil
        </p>
      </div>

      <JadwalPelaksanaanTable />

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Activity className="size-5 text-indigo-600" />
            Monitoring
          </CardTitle>
          <CardDescription className="text-slate-700">
            Pilih jenis monitoring yang akan dilakukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monitoringItems.map((item) => (
              <Link
                key={item.id}
                href={`/pengawas/pelaksanaan/monitoring/${item.id}`}
                className="flex items-center gap-4 rounded-xl border border-green-100 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-green-200 hover:shadow-lg hover:shadow-green-100"
              >
                <div className="flex size-12 items-center justify-center rounded-full border-2 border-green-200 bg-green-50">
                  <item.icon className="size-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>



      {/* List Monitoring yang Sudah Dilakukan */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Calendar className="size-5 text-indigo-600" />
            Monitoring yang Sudah Dilakukan
          </CardTitle>
          <CardDescription className="text-slate-700">
            Daftar monitoring yang telah dilakukan sebelumnya
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-slate-600">Memuat data...</div>
            </div>
          ) : monitoringList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="size-12 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-900 mb-1">
                Belum ada monitoring
              </p>
              <p className="text-xs text-slate-600">
                Mulai monitoring baru dengan memilih jenis monitoring di atas
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {monitoringList.map((monitoring) => {
                const Icon = getMonitoringIcon(monitoring.monitoringId);
                return (
                  <div
                    key={monitoring.id}
                    className="flex flex-col gap-3 rounded-xl border border-indigo-100 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 via-green-400 to-emerald-400 text-white shadow-md">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 mb-1 truncate">
                          {getMonitoringTitle(monitoring.monitoringId)}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {getInstrumenNama(monitoring.instrumenId)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <School className="size-3" />
                            <span className="truncate">{monitoring.sekolahNama}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {formatDate(monitoring.tanggalSupervisi)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                        asChild
                      >
                        <Link
                          href={`/pengawas/pelaksanaan/monitoring/${monitoring.monitoringId}/${monitoring.instrumenId}?sekolah=${monitoring.sekolahId}&id=${monitoring.id}`}
                        >
                          <Eye className="size-3 mr-1.5" />
                          Lihat
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                        asChild
                      >
                        <Link
                          href={`/pengawas/pelaksanaan/monitoring/${monitoring.monitoringId}/${monitoring.instrumenId}?sekolah=${monitoring.sekolahId}&id=${monitoring.id}&edit=true`}
                        >
                          <Edit className="size-3 mr-1.5" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={() => handleDelete(monitoring.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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


