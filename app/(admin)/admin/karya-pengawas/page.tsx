"use client";

export const runtime = 'edge';

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlignLeft, ClipboardCheck, Edit3, Globe, Plus, Upload, ChevronDown, Check, Eye, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const karyaData = [
  {
    id: "KRY-001",
    title: "Peningkatan Kualitas Supervisi Akademik melalui Pendekatan Kolaboratif",
    author: "Dr. Ahmad Hidayat, M.Pd.",
    status: "Tayang",
    type: "Tulisan Ilmiah Populer",
    category: null,
    date: "31 Oktober 2025",
    submittedBy: "Dr. Ahmad Hidayat, M.Pd.",
    reviewer: "Admin MKPS",
  },
  {
    id: "KRY-002",
    title: "Evaluasi Implementasi Kurikulum Merdeka di SMA Negeri Se-Jawa Tengah",
    author: "Prof. Dr. Siti Nurhaliza, M.Si.",
    status: "Menunggu Review",
    type: "Hasil Penelitian Pengawas",
    category: null,
    date: "28 Oktober 2025",
    submittedBy: "Prof. Dr. Siti Nurhaliza, M.Si.",
    reviewer: "-",
  },
  {
    id: "KRY-003",
    title: "Model Pendampingan Kepala Sekolah dalam Era Digital",
    author: "Drs. Bambang Sutrisno, M.M.",
    status: "Draft",
    type: "Best Practice / Praktik Baik Pengawas",
    category: "Pendampingan Kepala Sekolah",
    date: "25 Oktober 2025",
    submittedBy: "Drs. Bambang Sutrisno, M.M.",
    reviewer: "-",
  },
  {
    id: "KRY-004",
    title: "Inovasi Supervisi Akademik Berbasis Data dan Teknologi",
    author: "Hj. Sari Indrawati, S.Pd., M.Pd.",
    status: "Diterima",
    type: "Best Practice / Praktik Baik Pengawas",
    category: "Supervisi Akademik",
    date: "22 Oktober 2025",
    submittedBy: "Hj. Sari Indrawati, S.Pd., M.Pd.",
    reviewer: "Admin MKPS",
  },
  {
    id: "KRY-005",
    title: "Penguatan Manajemen Sekolah melalui Supervisi Manajerial",
    author: "Dr. Agus Setiawan, M.Pd.",
    status: "Ditolak",
    type: "Tulisan Ilmiah Populer",
    category: null,
    date: "20 Oktober 2025",
    submittedBy: "Dr. Agus Setiawan, M.Pd.",
    reviewer: "Admin MKPS",
  },
  {
    id: "KRY-006",
    title: "Platform Digital untuk Inovasi Kepengawasan",
    author: "Ir. Budi Santoso, M.T.",
    status: "Tayang",
    type: "Best Practice / Praktik Baik Pengawas",
    category: "Inovasi Kepengawasan",
    date: "18 Oktober 2025",
    submittedBy: "Ir. Budi Santoso, M.T.",
    reviewer: "Admin MKPS",
  },
];

const statusFilters = ["Semua Status", "Tayang", "Menunggu Review", "Diterima", "Ditolak", "Draft"];
const typeFilters = ["Semua Tipe", "Tulisan Ilmiah Populer", "Hasil Penelitian Pengawas", "Best Practice / Praktik Baik Pengawas"];

export default function KaryaPengawasManagementPage() {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("Semua Status");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("Semua Tipe");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);

  // Filter karya data
  const filteredKarya = karyaData.filter((karya) => {
    const matchesStatus = selectedStatusFilter === "Semua Status" || karya.status === selectedStatusFilter;
    const matchesType = selectedTypeFilter === "Semua Tipe" || karya.type === selectedTypeFilter;
    return matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tayang":
        return "bg-emerald-200 text-emerald-800";
      case "Diterima":
        return "bg-blue-200 text-blue-800";
      case "Menunggu Review":
        return "bg-amber-200 text-amber-800";
      case "Ditolak":
        return "bg-rose-200 text-rose-800";
      case "Draft":
        return "bg-slate-200 text-slate-800";
      default:
        return "bg-slate-200 text-slate-800";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    if (type === "Tulisan Ilmiah Populer") return "bg-blue-100 text-blue-800 border-blue-200";
    if (type === "Hasil Penelitian Pengawas") return "bg-purple-100 text-purple-800 border-purple-200";
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Tulisan & Karya
            </CardTitle>
            <CardDescription className="text-slate-600">
              Review dan kelola karya pengawas: tulisan ilmiah, hasil penelitian, dan praktik baik.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              asChild
            >
              <Link href="/karya-pengawas">
                <Globe className="size-4" />
                Lihat Portal
              </Link>
            </Button>
            <Button
              size="sm"
              variant="default"
              className="gap-2 rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
              asChild
            >
              <Link href="/admin/karya-pengawas/buat">
                <Plus className="size-4" />
                Buat Karya
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mobile Dropdown Filters */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-900">Filter:</span>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Upload className="size-4" />
                Impor
              </Button>
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                className="flex w-full items-center justify-between gap-4 rounded-full border-0 bg-slate-100 pl-4 pr-2 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
              >
                <span className="flex-1 text-left">Status: {selectedStatusFilter}</span>
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-white/80 px-2.5 py-1.5 mr-2 shadow-sm transition-all hover:bg-white">
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-rose-600 transition-all duration-200",
                      isStatusFilterOpen && "rotate-180 text-rose-700"
                    )}
                  />
                </div>
              </button>
              {isStatusFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsStatusFilterOpen(false)}
                  />
                  <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
                    {statusFilters.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => {
                          setSelectedStatusFilter(filter);
                          setIsStatusFilterOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50",
                          selectedStatusFilter === filter
                            ? "bg-rose-50 text-rose-700"
                            : "text-slate-700"
                        )}
                      >
                        <span>{filter}</span>
                        {selectedStatusFilter === filter && (
                          <Check className="size-4 text-rose-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Type Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                className="flex w-full items-center justify-between gap-4 rounded-full border-0 bg-slate-100 pl-4 pr-2 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
              >
                <span className="flex-1 text-left">Tipe: {selectedTypeFilter}</span>
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-white/80 px-2.5 py-1.5 mr-2 shadow-sm transition-all hover:bg-white">
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-rose-600 transition-all duration-200",
                      isTypeFilterOpen && "rotate-180 text-rose-700"
                    )}
                  />
                </div>
              </button>
              {isTypeFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsTypeFilterOpen(false)}
                  />
                  <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
                    {typeFilters.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => {
                          setSelectedTypeFilter(filter);
                          setIsTypeFilterOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50",
                          selectedTypeFilter === filter
                            ? "bg-rose-50 text-rose-700"
                            : "text-slate-700"
                        )}
                      >
                        <span>{filter}</span>
                        {selectedTypeFilter === filter && (
                          <Check className="size-4 text-rose-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Button Filters */}
          <div className="hidden flex-wrap items-center gap-2 text-sm text-slate-600 md:flex">
            <span className="font-semibold text-slate-900">Filter Status:</span>
            {statusFilters.map((filter) => (
              <Button
                key={filter}
                onClick={() => setSelectedStatusFilter(filter)}
                variant={selectedStatusFilter === filter ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full border-0 px-4",
                  selectedStatusFilter === filter
                    ? "bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
                    : "bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900",
                )}
              >
                {filter}
              </Button>
            ))}
            <div className="ml-4 flex items-center gap-2">
              <span className="font-semibold text-slate-900">Tipe:</span>
              {typeFilters.map((filter) => (
                <Button
                  key={filter}
                  onClick={() => setSelectedTypeFilter(filter)}
                  variant={selectedTypeFilter === filter ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full border-0 px-4",
                    selectedTypeFilter === filter
                      ? "bg-blue-600 px-4 font-semibold text-white shadow-md transition hover:bg-blue-700 hover:text-white"
                      : "bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900",
                  )}
                >
                  {filter}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto gap-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Upload className="size-4" />
              Impor dari Dokumen
            </Button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-md shadow-rose-100/70 md:block">
            <table className="w-full border-collapse text-left text-sm text-slate-700">
              <thead className="bg-gradient-to-r from-rose-50 via-white to-amber-50 text-xs font-semibold uppercase tracking-wide text-slate-700">
                <tr>
                  <th className="px-5 py-3 font-semibold">Judul Karya</th>
                  <th className="px-5 py-3 font-semibold">Penulis</th>
                  <th className="px-5 py-3 font-semibold">Tipe</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Tanggal</th>
                  <th className="px-5 py-3 font-semibold">Reviewer</th>
                  <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100">
                {filteredKarya.map((karya) => (
                  <tr key={karya.id} className="hover:bg-rose-50/70">
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-900">
                          {karya.title}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-600">{karya.id}</span>
                          {karya.category && (
                            <Badge className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", getTypeBadgeColor(karya.type))}>
                              {karya.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{karya.author}</td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={cn("rounded-full border px-3 py-1 text-xs font-semibold shadow-sm", getTypeBadgeColor(karya.type))}
                      >
                        {karya.type === "Best Practice / Praktik Baik Pengawas" ? "Best Practice" : karya.type}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full border-0 px-3 font-semibold shadow-sm",
                          getStatusColor(karya.status)
                        )}
                      >
                        {karya.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{karya.date}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{karya.reviewer}</td>
                    <td className="px-5 py-4 text-right text-xs">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-semibold text-slate-700 hover:bg-slate-50"
                          asChild
                        >
                          <Link href={`/admin/karya-pengawas/${karya.id.toLowerCase()}`}>
                            <Eye className="size-3.5 mr-1" />
                            Lihat
                          </Link>
                        </Button>
                        {karya.status === "Menunggu Review" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-0 bg-emerald-100 px-3 font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-200 hover:text-emerald-900"
                            asChild
                          >
                            <Link href={`/admin/karya-pengawas/${karya.id.toLowerCase()}/review`}>
                              <FileCheck className="size-3.5 mr-1" />
                              Review
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                          asChild
                        >
                          <Link href={`/admin/karya-pengawas/${karya.id.toLowerCase()}/edit`}>
                            <Edit3 className="size-3.5 mr-1" />
                            Ubah
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredKarya.map((karya) => (
              <div
                key={karya.id}
                className="rounded-2xl border border-rose-200 bg-white p-4 shadow-md shadow-rose-100/70"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold leading-tight text-slate-900">
                      {karya.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{karya.id}</span>
                      <span>•</span>
                      <Badge
                        variant="outline"
                        className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold shadow-sm", getTypeBadgeColor(karya.type))}
                      >
                        {karya.type === "Best Practice / Praktik Baik Pengawas" ? "Best Practice" : karya.type}
                      </Badge>
                      {karya.category && (
                        <>
                          <span>•</span>
                          <Badge className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", getTypeBadgeColor(karya.type))}>
                            {karya.category}
                          </Badge>
                        </>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "w-fit rounded-full border-0 px-3 font-semibold shadow-sm",
                        getStatusColor(karya.status)
                      )}
                    >
                      {karya.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 border-t border-rose-100 pt-3">
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 text-xs font-semibold text-slate-500 sm:w-20">
                        Penulis:
                      </span>
                      <span className="flex-1 text-sm text-slate-700 break-words">{karya.author}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 text-xs font-semibold text-slate-500 sm:w-20">
                        Tanggal:
                      </span>
                      <span className="flex-1 text-sm text-slate-700">{karya.date}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 text-xs font-semibold text-slate-500 sm:w-20">
                        Reviewer:
                      </span>
                      <span className="flex-1 text-sm text-slate-700">{karya.reviewer}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-rose-100 pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 rounded-full border-0 bg-slate-100 px-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                      asChild
                    >
                      <Link href={`/admin/karya-pengawas/${karya.id.toLowerCase()}`}>
                        <Eye className="size-3.5 mr-1" />
                        Lihat
                      </Link>
                    </Button>
                    {karya.status === "Menunggu Review" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-0 bg-emerald-100 px-3 font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-200 hover:text-emerald-900"
                        asChild
                      >
                        <Link href={`/admin/karya-pengawas/${karya.id.toLowerCase()}/review`}>
                          <FileCheck className="size-3.5 mr-1" />
                          Review
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full border-0 bg-slate-100 px-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                      asChild
                    >
                      <Link href={`/admin/karya-pengawas/${karya.id.toLowerCase()}/edit`}>
                        <Edit3 className="size-3.5 mr-1" />
                        Ubah
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-3 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <p>Menampilkan {filteredKarya.length} dari {karyaData.length} karya.</p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
            >
              Sebelumnya
            </Button>
            <Button
              variant="default"
              size="sm"
              className="rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
            >
              Berikutnya
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <ClipboardCheck className="size-5" />
              Checklist Review
            </CardTitle>
            <CardDescription className="text-slate-600">
              Pastikan setiap karya melewati proses review dan validasi yang konsisten.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-600">
            <p>• Verifikasi keaslian dan orisinalitas karya.</p>
            <p>• Pastikan konten sesuai dengan pedoman penulisan.</p>
            <p>• Konfirmasi kelengkapan referensi dan sumber data.</p>
            <p>• Validasi kesesuaian dengan topik kepengawasan.</p>
          </CardContent>
        </Card>

        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">
              Karya Perlu Review
            </CardTitle>
            <CardDescription className="text-slate-600">
              Prioritaskan review karya yang telah diajukan pengawas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            {karyaData
              .filter((k) => k.status === "Menunggu Review")
              .slice(0, 2)
              .map((karya) => (
                <div key={karya.id} className="rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
                  <p className="font-semibold text-slate-900">{karya.title}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {karya.type} • {karya.submittedBy}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 gap-2 font-semibold text-slate-700 hover:bg-slate-50"
                    asChild
                  >
                    <Link href={`/admin/karya-pengawas/${karya.id.toLowerCase()}/review`}>
                      <AlignLeft className="size-4" />
                      Review Sekarang
                    </Link>
                  </Button>
                </div>
              ))}
          </CardContent>
          {karyaData.filter((k) => k.status === "Menunggu Review").length > 2 && (
            <CardFooter>
              <Button
                variant="outline"
                className="gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                asChild
              >
                <Link href="/admin/karya-pengawas?status=Menunggu Review">
                  <AlignLeft className="size-4" />
                  Lihat Semua Review
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

