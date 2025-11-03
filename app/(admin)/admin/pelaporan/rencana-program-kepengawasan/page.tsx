"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  User,
  Search,
  MapPin,
  Building2,
  Eye,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Users,
  Percent,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock data rencana program kepengawasan
const rencanaProgramStatus = [
  {
    pengawasId: "1",
    hasPlan: true,
    totalSekolah: 8,
    completedSekolah: 8,
    completionRate: 100,
    firstCreatedDate: new Date("2025-01-05"),
    lastUpdatedDate: new Date("2025-01-15"),
  },
  {
    pengawasId: "2",
    hasPlan: true,
    totalSekolah: 6,
    completedSekolah: 6,
    completionRate: 100,
    firstCreatedDate: new Date("2025-01-03"),
    lastUpdatedDate: new Date("2025-01-12"),
  },
  {
    pengawasId: "3",
    hasPlan: true,
    totalSekolah: 10,
    completedSekolah: 9,
    completionRate: 90,
    firstCreatedDate: new Date("2025-01-02"),
    lastUpdatedDate: new Date("2025-01-18"),
  },
  {
    pengawasId: "4",
    hasPlan: true,
    totalSekolah: 7,
    completedSekolah: 7,
    completionRate: 100,
    firstCreatedDate: new Date("2025-01-01"),
    lastUpdatedDate: new Date("2025-01-10"),
  },
  {
    pengawasId: "5",
    hasPlan: true,
    totalSekolah: 5,
    completedSekolah: 4,
    completionRate: 80,
    firstCreatedDate: new Date("2025-01-08"),
    lastUpdatedDate: new Date("2025-01-16"),
  },
  {
    pengawasId: "6",
    hasPlan: false,
    totalSekolah: 9,
    completedSekolah: 0,
    completionRate: 0,
    firstCreatedDate: null,
    lastUpdatedDate: null,
  },
  {
    pengawasId: "7",
    hasPlan: false,
    totalSekolah: 6,
    completedSekolah: 0,
    completionRate: 0,
    firstCreatedDate: null,
    lastUpdatedDate: null,
  },
];

// Mock data pengawas
const pengawas = [
  {
    id: "1",
    nama: "Dr. Eka Suryani, M.Pd",
    nip: "19650515 198903 2 001",
    jabatan: "Pengawas Sekolah Madya",
    wilayah: "Kabupaten Semarang",
    totalSekolah: 8,
    status: "Aktif",
    email: "eka.suryani@mkps.jateng.go.id",
    telepon: "081234567890",
  },
  {
    id: "2",
    nama: "Rudi Hartono, S.Pd., M.Pd",
    nip: "19660520 199003 2 002",
    jabatan: "Pengawas Sekolah Madya",
    wilayah: "Kota Semarang",
    totalSekolah: 6,
    status: "Aktif",
    email: "rudi.hartono@mkps.jateng.go.id",
    telepon: "081234567891",
  },
  {
    id: "3",
    nama: "Fitri Handayani, S.Pd., M.M",
    nip: "19670625 199103 2 003",
    jabatan: "Pengawas Sekolah Utama",
    wilayah: "Kabupaten Kendal",
    totalSekolah: 10,
    status: "Aktif",
    email: "fitri.handayani@mkps.jateng.go.id",
    telepon: "081234567892",
  },
  {
    id: "4",
    nama: "Drs. Budi Santoso, M.Pd",
    nip: "19700110 199003 1 004",
    jabatan: "Pengawas Sekolah Utama",
    wilayah: "Kota Magelang",
    totalSekolah: 7,
    status: "Aktif",
    email: "budi.santoso@mkps.jateng.go.id",
    telepon: "081234567893",
  },
  {
    id: "5",
    nama: "Dra. Siti Nurhaliza, M.Pd",
    nip: "19720515 199103 2 005",
    jabatan: "Pengawas Sekolah Madya",
    wilayah: "Kabupaten Demak",
    totalSekolah: 5,
    status: "Aktif",
    email: "siti.nurhaliza@mkps.jateng.go.id",
    telepon: "081234567894",
  },
  {
    id: "6",
    nama: "Dr. Muhammad Fauzi, M.Pd",
    nip: "19751020 199203 1 006",
    jabatan: "Pengawas Sekolah Utama",
    wilayah: "Kota Salatiga",
    totalSekolah: 9,
    status: "Aktif",
    email: "muhammad.fauzi@mkps.jateng.go.id",
    telepon: "081234567895",
  },
  {
    id: "7",
    nama: "Dra. Rini Handayani, M.Pd",
    nip: "19780525 199303 2 007",
    jabatan: "Pengawas Sekolah Madya",
    wilayah: "Kabupaten Grobogan",
    totalSekolah: 6,
    status: "Aktif",
    email: "rini.handayani@mkps.jateng.go.id",
    telepon: "081234567896",
  },
];

export default function RencanaProgramKepengawasanPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPengawas = pengawas.filter((pengawas) =>
    pengawas.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pengawas.nip.replace(/\s/g, "").includes(searchQuery.replace(/\s/g, "")) ||
    pengawas.wilayah.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalPengawas = pengawas.length;
  const pengawasDenganRencana = rencanaProgramStatus.filter((status) => status.hasPlan).length;
  const persentaseRencana = totalPengawas > 0 ? Math.round((pengawasDenganRencana / totalPengawas) * 100) : 0;

  // Find most diligent pengawas (fastest to create and most complete)
  const pengawasDenganData = rencanaProgramStatus
    .filter((status) => status.hasPlan && status.firstCreatedDate)
    .map((status) => {
      const pengawasData = pengawas.find((p) => p.id === status.pengawasId);
      const daysToComplete = status.firstCreatedDate
        ? Math.floor((status.lastUpdatedDate.getTime() - status.firstCreatedDate.getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      
      return {
        ...status,
        pengawasData,
        daysToComplete,
        score: status.completionRate * 100 - daysToComplete, // Higher completion, lower days = better score
      };
    })
    .sort((a, b) => {
      // Sort by completion rate first, then by speed
      if (b.completionRate !== a.completionRate) {
        return b.completionRate - a.completionRate;
      }
      return a.daysToComplete - b.daysToComplete;
    });

  const pengawasPalingRajin = pengawasDenganData.length > 0 ? pengawasDenganData[0] : null;

  const stats = [
    {
      label: "Jumlah Pengawas",
      value: totalPengawas.toString(),
      change: `${pengawas.filter((p) => p.status === "Aktif").length} aktif`,
      icon: Users,
      trend: "neutral" as const,
    },
    {
      label: "Sudah Membuat Rencana",
      value: `${persentaseRencana}%`,
      change: `${pengawasDenganRencana} dari ${totalPengawas} pengawas`,
      icon: Percent,
      trend: persentaseRencana >= 70 ? "positive" as const : "neutral" as const,
    },
    {
      label: "Pengawas Paling Rajin",
      value: pengawasPalingRajin?.pengawasData?.nama
        ? pengawasPalingRajin.pengawasData.nama.split(",")[0].split(" ").slice(-2).join(" ") // Take last 2 words (usually first name)
        : "-",
      change: pengawasPalingRajin
        ? `${pengawasPalingRajin.completionRate}% lengkap, ${pengawasPalingRajin.completedSekolah}/${pengawasPalingRajin.totalSekolah} sekolah`
        : "Belum ada data",
      icon: Trophy,
      trend: "positive" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-5 px-3 sm:px-0">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pt-4 sm:pt-0">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-sm">
              <FileText className="size-4" />
            </div>
            <h1 className="text-xl font-semibold text-slate-700 sm:text-2xl">
              Daftar Pengawas
            </h1>
          </div>
          <p className="text-xs text-slate-500 sm:text-sm ml-10">
            Kelola data pengawas sekolah binaan
          </p>
        </div>
      </div>

      {/* Statistics Boxes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-0 bg-white/90 backdrop-blur-sm shadow-md"
          >
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 p-2.5 text-white shadow-md">
                <stat.icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {stat.label}
                </CardTitle>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 truncate">
                  {stat.value}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600">
                <span className="flex size-5 sm:size-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <TrendingUp className="size-3 sm:size-3.5" />
                </span>
                <span className="line-clamp-2">{stat.change}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Bar */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-md">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 sm:size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pengawas berdasarkan nama, NIP, atau wilayah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-0 bg-slate-50/50 pl-9 sm:pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition focus:bg-white focus:shadow-md focus:ring-2 focus:ring-blue-100/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table View */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-md">
        <CardContent className="p-0 overflow-x-auto">
          <div className="hidden md:block overflow-hidden rounded-xl">
            <table className="w-full border-collapse text-left text-sm text-slate-700">
              <thead className="bg-gradient-to-r from-blue-50/50 via-white to-cyan-50/50 text-xs font-semibold uppercase tracking-wide text-slate-600 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Nama Pengawas</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">NIP</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Wilayah Tugas</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Jumlah Sekolah</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPengawas.map((pengawas, index) => (
                  <tr
                    key={pengawas.id}
                    className={cn(
                      "transition-colors duration-150 hover:bg-blue-50/30 cursor-pointer",
                      index % 2 === 0 && "bg-white",
                      index % 2 === 1 && "bg-slate-50/30"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-sm">
                          <User className="size-4" />
                        </div>
                        <span className="font-medium text-slate-800">{pengawas.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="font-mono text-xs">{pengawas.nip}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="size-4 text-rose-400 shrink-0" />
                        <span>{pengawas.wilayah}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="size-4 text-rose-400 shrink-0" />
                        <span>{pengawas.totalSekolah} Sekolah</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium shadow-sm",
                        pengawas.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      )}>
                        {pengawas.status === "Aktif" ? (
                          <CheckCircle2 className="size-3 mr-1" />
                        ) : (
                          <AlertCircle className="size-3 mr-1" />
                        )}
                        {pengawas.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/pelaporan/rencana-program-kepengawasan/${pengawas.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors"
                      >
                        <Eye className="size-4" />
                        <span>Detail</span>
                        <ChevronRight className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredPengawas.map((pengawas) => (
          <Link
            key={pengawas.id}
            href={`/admin/pelaporan/rencana-program-kepengawasan/${pengawas.id}`}
          >
            <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-sm">
                    <User className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 mb-1 line-clamp-1">
                      {pengawas.nama}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2 font-mono">
                      {pengawas.nip}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="size-3.5 text-rose-400 shrink-0" />
                        <span className="line-clamp-1">{pengawas.wilayah}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Building2 className="size-3.5 text-rose-400 shrink-0" />
                        <span>{pengawas.totalSekolah} Sekolah</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm",
                      pengawas.status === "Aktif"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    )}>
                      {pengawas.status === "Aktif" ? (
                        <CheckCircle2 className="size-3 mr-1" />
                      ) : (
                        <AlertCircle className="size-3 mr-1" />
                      )}
                      {pengawas.status}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-medium text-rose-600">
                      <Eye className="size-3.5" />
                      <span>Detail</span>
                      <ChevronRight className="size-3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredPengawas.length === 0 && (
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex size-16 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Search className="size-8 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">
              Tidak ada pengawas ditemukan
            </h3>
            <p className="text-sm text-slate-500 text-center">
              Coba gunakan kata kunci lain untuk mencari pengawas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
