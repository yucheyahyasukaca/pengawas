"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  School,
  Plus,
  Search,
  Building2,
  Users,
  MapPin,
  ChevronRight,
  ArrowLeft,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock data pengawas
const pengawas = [
  {
    id: "1",
    nama: "Dr. Ahmad Hidayat, M.Pd",
    nip: "196503151987031001",
    jabatan: "Pengawas Sekolah Madya",
    wilayah: "Semarang",
  },
  {
    id: "2",
    nama: "Dra. Siti Nurhaliza, M.Pd",
    nip: "196804201989022003",
    jabatan: "Pengawas Sekolah Madya",
    wilayah: "Semarang",
  },
  {
    id: "3",
    nama: "Drs. Budi Santoso, M.Pd",
    nip: "197001101990031004",
    jabatan: "Pengawas Sekolah Utama",
    wilayah: "Kudus",
  },
  {
    id: "4",
    nama: "Dr. Muhammad Fauzi, M.Pd",
    nip: "197205151991031005",
    jabatan: "Pengawas Sekolah Utama",
    wilayah: "Magelang",
  },
  {
    id: "5",
    nama: "Dra. Rini Handayani, M.Pd",
    nip: "197510201992022006",
    jabatan: "Pengawas Sekolah Madya",
    wilayah: "Salatiga",
  },
];

// Mock data sekolah binaan
const sekolahBinaan = [
  {
    id: "1",
    nama: "SMA Negeri 1 Semarang",
    npsn: "20329378",
    alamat: "Jl. Pemuda No. 143, Semarang",
    kepalaSekolah: "Dr. Ahmad Hidayat, M.Pd",
    status: "Aktif",
    totalGuru: 45,
    totalSiswa: 720,
  },
  {
    id: "2",
    nama: "SMA Negeri 2 Semarang",
    npsn: "20329379",
    alamat: "Jl. Sendangguwo No. 1, Semarang",
    kepalaSekolah: "Drs. Budi Santoso, M.Pd",
    status: "Aktif",
    totalGuru: 42,
    totalSiswa: 680,
  },
  {
    id: "3",
    nama: "SMA Negeri 3 Semarang",
    npsn: "20329380",
    alamat: "Jl. Dr. Wahidin No. 12, Semarang",
    kepalaSekolah: "Dra. Siti Nurhaliza, M.Pd",
    status: "Aktif",
    totalGuru: 48,
    totalSiswa: 750,
  },
  {
    id: "4",
    nama: "SMA Negeri 4 Semarang",
    npsn: "20329381",
    alamat: "Jl. Kartini No. 45, Semarang",
    kepalaSekolah: "Dr. Muhammad Fauzi, M.Pd",
    status: "Aktif",
    totalGuru: 40,
    totalSiswa: 650,
  },
];

export default function SekolahBinaanPage() {
  const params = useParams();
  const pengawasId = params.pengawasId as string;
  const [searchQuery, setSearchQuery] = useState("");

  const pengawasData = pengawas.find((p) => p.id === pengawasId) || pengawas[0];

  const filteredSekolah = sekolahBinaan.filter((sekolah) =>
    sekolah.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sekolah.npsn.includes(searchQuery) ||
    sekolah.kepalaSekolah.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 px-3 sm:px-0">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pt-4 sm:pt-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="rounded-xl hover:bg-blue-50/50 text-slate-600 shrink-0"
          >
            <ArrowLeft className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-sm shrink-0">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-700 truncate">
                Sekolah Binaan
              </h1>
              <p className="text-xs text-slate-500 truncate">
                {pengawasData.nama}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pengawas Info Card */}
      <Card className="border-0 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 backdrop-blur-sm shadow-md">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex size-12 sm:size-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-md shrink-0">
              <User className="size-6 sm:size-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-slate-700 truncate">
                {pengawasData.nama}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {pengawasData.jabatan} • {pengawasData.wilayah}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                NIP: {pengawasData.nip}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-md">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 sm:size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari sekolah binaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-0 bg-slate-50/50 pl-9 sm:pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition focus:bg-white focus:shadow-md focus:ring-2 focus:ring-blue-100/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Schools Grid */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {filteredSekolah.map((sekolah) => (
          <Card
            key={sekolah.id}
            className={cn(
              "relative overflow-hidden border-0 bg-white/95 backdrop-blur-sm transition-all duration-300",
              "hover:-translate-y-1 hover:shadow-lg shadow-md cursor-pointer"
            )}
          >
            <CardHeader className="pb-3 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-md">
                  <School className="size-6" />
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold leading-tight text-slate-700 line-clamp-2">
                    {sekolah.nama}
                  </CardTitle>
                  <p className="mt-1 text-xs text-slate-500">
                    NPSN: {sekolah.npsn}
                  </p>
                </div>

                {/* Arrow Icon */}
                <ChevronRight className="size-5 shrink-0 text-slate-300" />
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0 px-4 sm:px-5 pb-4 sm:pb-5">
              {/* School Info */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <MapPin className="size-3.5 mt-0.5 shrink-0 text-slate-400" />
                  <span className="leading-relaxed line-clamp-1">
                    {sekolah.alamat}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Users className="size-3.5 shrink-0 text-slate-400" />
                  <span>{sekolah.kepalaSekolah}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Building2 className="size-3.5 text-slate-400" />
                  <span>{sekolah.totalGuru} Guru</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Users className="size-3.5 text-slate-400" />
                  <span>{sekolah.totalSiswa} Siswa</span>
                </div>
              </div>

              {/* Action Button */}
              <Link href={`/admin/pelaporan/rencana-program-kepengawasan/${pengawasId}/buat?sekolah=${sekolah.id}`}>
                <Button
                  className={cn(
                    "w-full rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300",
                    "hover:from-blue-500 hover:to-cyan-500 hover:shadow-md hover:scale-[1.01]"
                  )}
                >
                  <Plus className="size-4 mr-1.5" />
                  Buat Rencana Program
                </Button>
              </Link>
            </CardContent>

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700 shadow-sm">
                {sekolah.status}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSekolah.length === 0 && (
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex size-16 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Search className="size-8 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">
              Tidak ada sekolah ditemukan
            </h3>
            <p className="text-sm text-slate-500 text-center">
              Coba gunakan kata kunci lain untuk mencari sekolah binaan
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

