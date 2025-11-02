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
import { cn } from "@/lib/utils";
import {
  CalendarPlus,
  Download,
  Filter,
  MapPin,
  Users,
  ChevronDown,
  Check,
} from "lucide-react";

const agendaData = [
  {
    id: "AGD-001",
    title: "Supervisi Implementasi Kurikulum Merdeka",
    date: "5 November 2025",
    location: "SMA Negeri 1 Semarang",
    coordinator: "Eka Suryani",
    status: "Terjadwal",
    type: "Supervisi",
  },
  {
    id: "AGD-002",
    title: "Pendampingan Literasi Numerasi",
    date: "7 November 2025",
    location: "SLB Negeri Ungaran",
    coordinator: "Rudi Hartono",
    status: "Siap Jalan",
    type: "Pendampingan",
  },
  {
    id: "AGD-003",
    title: "Monitoring Simulasi Asesmen",
    date: "9 November 2025",
    location: "SMA Negeri 3 Surakarta",
    coordinator: "Fitri Handayani",
    status: "Butuh Dokumen",
    type: "Monitoring",
  },
  {
    id: "AGD-004",
    title: "Rapat Koordinasi MKPS Kabupaten",
    date: "12 November 2025",
    location: "Kantor Dinas Pendidikan Kudus",
    coordinator: "Admin MKPS",
    status: "Perlu Konfirmasi",
    type: "Rakor",
  },
];

const agendaFilters = ["Semua", "Supervisi", "Pendampingan", "Monitoring", "Rakor"];

export default function AgendaManagementPage() {
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter agenda data based on selected filter
  const filteredAgenda = agendaData.filter((agenda) => {
    if (selectedFilter === "Semua") {
      return true;
    }
    return agenda.type === selectedFilter;
  });

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-lg font-semibold text-slate-900">Manajemen Agenda</CardTitle>
            <CardDescription className="text-slate-600">
              Atur jadwal supervisi, pendampingan, dan kegiatan MKPS secara terstruktur.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              asChild
            >
              <Link href="/admin/agenda/template">
                <Download className="size-4" />
                Unduh Template
              </Link>
            </Button>
            <Button
              size="sm"
              variant="default"
              className="gap-2 rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
              asChild
            >
              <Link href="/admin/agenda/buat">
                <CalendarPlus className="size-4" />
                Agenda Baru
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mobile Dropdown Filter */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-900">Filter:</span>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Filter className="size-4" />
                Filter Lanjut
              </Button>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex w-full items-center justify-between gap-4 rounded-full border-0 bg-slate-100 pl-4 pr-2 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
              >
                <span className="flex-1 text-left">{selectedFilter}</span>
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-white/80 px-2.5 py-1.5 mr-2 shadow-sm transition-all hover:bg-white">
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-rose-600 transition-all duration-200",
                      isFilterOpen && "rotate-180 text-rose-700"
                    )}
                  />
                </div>
              </button>
              {isFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
                    {agendaFilters.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => {
                          setSelectedFilter(filter);
                          setIsFilterOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50",
                          selectedFilter === filter
                            ? "bg-rose-50 text-rose-700"
                            : "text-slate-700"
                        )}
                      >
                        <span>{filter}</span>
                        {selectedFilter === filter && (
                          <Check className="size-4 text-rose-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Button Filter */}
          <div className="hidden flex-wrap items-center gap-2 text-sm text-slate-600 md:flex">
            <span className="font-semibold text-slate-900">Filter:</span>
            {agendaFilters.map((filter) => (
              <Button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full border-0 px-4",
                  selectedFilter === filter
                    ? "bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
                    : "bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900",
                )}
              >
                {filter}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto gap-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Filter className="size-4" />
              Filter Lanjut
            </Button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-md shadow-rose-100/70 md:block">
            <table className="w-full border-collapse text-left text-sm text-slate-700">
              <thead className="bg-gradient-to-r from-rose-50 via-white to-amber-50 text-xs font-semibold uppercase tracking-wide text-slate-700">
                <tr>
                  <th className="px-5 py-3 font-semibold">Agenda</th>
                  <th className="px-5 py-3 font-semibold">Tanggal</th>
                  <th className="px-5 py-3 font-semibold">Lokasi</th>
                  <th className="px-5 py-3 font-semibold">Koordinator</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100">
                {filteredAgenda.map((agenda) => (
                  <tr key={agenda.id} className="hover:bg-rose-50/70">
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-900">
                          {agenda.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Badge
                            variant="outline"
                            className="rounded-full border-0 bg-rose-100 px-2 text-rose-600 shadow-sm"
                          >
                            {agenda.type}
                          </Badge>
                          <span>•</span>
                          <span>{agenda.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{agenda.date}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4 text-rose-500" />
                        {agenda.location}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <Users className="size-4 text-rose-500" />
                        {agenda.coordinator}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                        <Badge
                          variant={agenda.status === "Siap Jalan" ? "secondary" : "outline"}
                          className={cn(
                            "rounded-full border-0 px-3",
                            agenda.status === "Siap Jalan"
                              ? "bg-emerald-200 text-emerald-800"
                              : "bg-rose-100 text-rose-600 shadow-sm",
                          )}
                        >
                          {agenda.status}
                        </Badge>
                    </td>
                    <td className="px-5 py-4 text-right text-xs">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-semibold text-slate-700 hover:bg-slate-50"
                          asChild
                        >
                          <Link href={`/admin/agenda/${agenda.id.toLowerCase()}`}>
                            Detil
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                          asChild
                        >
                          <Link href={`/admin/agenda/${agenda.id.toLowerCase()}/edit`}>
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
            {filteredAgenda.map((agenda) => (
              <div
                key={agenda.id}
                className="rounded-2xl border border-rose-200 bg-white p-4 shadow-md shadow-rose-100/70"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold leading-tight text-slate-900">
                      {agenda.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <Badge
                        variant="outline"
                        className="rounded-full border-0 bg-rose-100 px-2 text-rose-600 shadow-sm"
                      >
                        {agenda.type}
                      </Badge>
                      <span>•</span>
                      <span>{agenda.id}</span>
                      <span>•</span>
                      <Badge
                        variant={agenda.status === "Siap Jalan" ? "secondary" : "outline"}
                        className={cn(
                          "rounded-full border-0 px-2.5 text-xs",
                          agenda.status === "Siap Jalan"
                            ? "bg-emerald-200 text-emerald-800"
                            : "bg-rose-100 text-rose-600 shadow-sm",
                        )}
                      >
                        {agenda.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 border-t border-rose-100 pt-3">
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 text-xs font-semibold text-slate-500 sm:w-20">
                        Tanggal:
                      </span>
                      <span className="flex-1 text-sm text-slate-700">{agenda.date}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 text-xs font-semibold text-slate-500 sm:w-20">
                        Lokasi:
                      </span>
                      <span className="flex flex-1 items-center gap-1.5 text-sm text-slate-700">
                        <MapPin className="size-4 shrink-0 text-rose-500" />
                        <span className="break-words">{agenda.location}</span>
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 text-xs font-semibold text-slate-500 sm:w-20">
                        Koordinator:
                      </span>
                      <span className="flex flex-1 items-center gap-1.5 text-sm text-slate-700">
                        <Users className="size-4 shrink-0 text-rose-500" />
                        <span className="break-words">{agenda.coordinator}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-rose-100 pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 rounded-full border-0 bg-slate-100 px-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                      asChild
                    >
                      <Link href={`/admin/agenda/${agenda.id.toLowerCase()}`}>
                        Detil
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full border-0 bg-slate-100 px-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                      asChild
                    >
                      <Link href={`/admin/agenda/${agenda.id.toLowerCase()}/edit`}>
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
          <p>Menampilkan {filteredAgenda.length} dari {agendaData.length} agenda aktif.</p>
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

      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">Agenda Perlu Tindak Lanjut</CardTitle>
          <CardDescription className="text-slate-600">
            Pastikan dokumen, notulen, dan catatan evaluasi terselesaikan tepat waktu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <div className="rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
            <p className="font-semibold text-slate-900">Monitoring Simulasi Asesmen</p>
            <p className="text-xs text-slate-600">Unggah hasil analisis asesmen sebelum 6 November 2025.</p>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
            <p className="font-semibold text-slate-900">Rapat Koordinasi MKPS Kabupaten</p>
            <p className="text-xs text-slate-600">Konfirmasi kehadiran dan materi presentasi narasumber.</p>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
            <p className="font-semibold text-slate-900">Pendampingan Literasi Numerasi</p>
            <p className="text-xs text-slate-600">Lengkapi daftar hadir dan dokumentasi kegiatan.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


