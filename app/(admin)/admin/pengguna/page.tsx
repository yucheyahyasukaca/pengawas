"use client";

export const runtime = 'edge';

import { useState } from "react";
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
import { cn } from "@/lib/utils";
import {
  Users,
  Search,
  MapPin,
  School,
  Eye,
  ChevronRight,
} from "lucide-react";

// Mock data - will be replaced with real data from Supabase
const pengawasList = [
  {
    id: "peng-001",
    name: "Dr. Eka Suryani, M.Pd.",
    nip: "19650515 198903 2 001",
    wilayah: "Kabupaten Semarang",
    jumlahSekolah: 8,
    status: "Aktif",
  },
  {
    id: "peng-002",
    name: "Rudi Hartono, S.Pd., M.Pd.",
    nip: "19660520 199003 2 002",
    wilayah: "Kota Semarang",
    jumlahSekolah: 6,
    status: "Aktif",
  },
  {
    id: "peng-003",
    name: "Fitri Handayani, S.Pd., M.M.",
    nip: "19670625 199103 2 003",
    wilayah: "Kabupaten Kendal",
    jumlahSekolah: 7,
    status: "Aktif",
  },
  {
    id: "peng-004",
    name: "Bambang Sutrisno, S.Pd., M.Pd.",
    nip: "19650730 199204 1 004",
    wilayah: "Kota Magelang",
    jumlahSekolah: 5,
    status: "Aktif",
  },
  {
    id: "peng-005",
    name: "Siti Nurhaliza, S.Pd., M.Pd.",
    nip: "19680810 199305 2 005",
    wilayah: "Kabupaten Demak",
    jumlahSekolah: 9,
    status: "Aktif",
  },
  {
    id: "peng-006",
    name: "Ahmad Dahlan, S.Pd., M.M.",
    nip: "19650915 199406 1 006",
    wilayah: "Kota Salatiga",
    jumlahSekolah: 4,
    status: "Aktif",
  },
  {
    id: "peng-007",
    name: "Dewi Sartika, S.Pd., M.Pd.",
    nip: "19671020 199507 2 007",
    wilayah: "Kabupaten Grobogan",
    jumlahSekolah: 6,
    status: "Aktif",
  },
  {
    id: "peng-008",
    name: "Sudarsono, S.Pd., M.M.",
    nip: "19661125 199608 1 008",
    wilayah: "Kota Semarang",
    jumlahSekolah: 8,
    status: "Aktif",
  },
  {
    id: "peng-009",
    name: "Maya Indira, S.Pd., M.Pd.",
    nip: "19671230 199709 2 009",
    wilayah: "Kabupaten Semarang",
    jumlahSekolah: 7,
    status: "Aktif",
  },
  {
    id: "peng-010",
    name: "Hendra Wijaya, S.Pd., M.M.",
    nip: "19651305 199810 1 010",
    wilayah: "Kota Pekalongan",
    jumlahSekolah: 5,
    status: "Aktif",
  },
];

export default function PenggunaListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter pengawas based on search
  const filteredPengawas = pengawasList.filter(
    (pengawas) =>
      searchTerm === "" ||
      pengawas.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pengawas.nip.includes(searchTerm) ||
      pengawas.wilayah.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daftar Pengawas</h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola data pengawas sekolah binaan
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pengawas berdasarkan nama, NIP, atau wilayah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pengawas List - Desktop View */}
      <div className="hidden overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-md shadow-rose-100/70 md:block">
        <table className="w-full border-collapse text-left text-sm text-slate-700">
          <thead className="bg-gradient-to-r from-rose-50 via-white to-amber-50 text-xs font-semibold uppercase tracking-wide text-slate-700">
            <tr>
              <th className="px-5 py-4 font-semibold">Nama Pengawas</th>
              <th className="px-5 py-4 font-semibold">NIP</th>
              <th className="px-5 py-4 font-semibold">Wilayah Tugas</th>
              <th className="px-5 py-4 font-semibold">Jumlah Sekolah</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100">
            {filteredPengawas.map((pengawas) => (
              <tr key={pengawas.id} className="hover:bg-rose-50/70 transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-rose-400 to-pink-500 text-white shadow-md">
                      <Users className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        {pengawas.name}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {pengawas.nip}
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="size-4 text-rose-500" />
                    {pengawas.wilayah}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <School className="size-4 text-rose-500" />
                    {pengawas.jumlahSekolah} Sekolah
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Badge className="rounded-full border-0 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {pengawas.status}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    asChild
                  >
                    <Link href={`/admin/pengguna/${pengawas.id}`}>
                      <Eye className="size-4" />
                      Detail
                      <ChevronRight className="size-4" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPengawas.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">
            Tidak ada pengawas yang ditemukan
          </div>
        )}
      </div>

      {/* Pengawas List - Mobile View */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredPengawas.map((pengawas) => (
          <Link
            key={pengawas.id}
            href={`/admin/pengguna/${pengawas.id}`}
            className="block rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-rose-400 to-pink-500 text-white shadow-md">
                <Users className="size-6" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{pengawas.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{pengawas.nip}</p>
                  </div>
                  <Badge className="rounded-full border-0 bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                    {pengawas.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-rose-500" />
                    {pengawas.wilayah}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <School className="size-3 text-rose-500" />
                    {pengawas.jumlahSekolah} Sekolah
                  </span>
                </div>
                <div className="flex items-center justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Lihat Detail
                    <ChevronRight className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filteredPengawas.length === 0 && (
          <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
            <CardContent className="py-12 text-center text-sm text-slate-500">
              Tidak ada pengawas yang ditemukan
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
