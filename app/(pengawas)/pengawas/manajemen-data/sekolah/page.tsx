"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School, Search, Plus, Filter, MapPin, Building2, FileText } from "lucide-react";

const dataSekolah = [
  {
    id: "skl-001",
    nama: "SMA Negeri 1 Semarang",
    npsn: "20325123",
    jenis: "Negeri",
    alamat: "Jl. Raya Semarang - Salatiga KM 15",
    kabupaten: "Kota Semarang",
    cabangDinas: "Cabang Dinas Pendidikan Wilayah I",
    status: "Aktif",
  },
  {
    id: "skl-002",
    nama: "SLB Negeri Ungaran",
    npsn: "20325124",
    jenis: "Negeri",
    alamat: "Jl. Pemuda No. 123",
    kabupaten: "Kabupaten Semarang",
    cabangDinas: "Cabang Dinas Pendidikan Wilayah I",
    status: "Aktif",
  },
  {
    id: "skl-003",
    nama: "SMA Negeri 2 Semarang",
    npsn: "20325125",
    jenis: "Negeri",
    alamat: "Jl. Dr. Cipto Mangunkusumo No. 45",
    kabupaten: "Kota Semarang",
    cabangDinas: "Cabang Dinas Pendidikan Wilayah I",
    status: "Aktif",
  },
  {
    id: "skl-004",
    nama: "SMA Swasta XYZ",
    npsn: "20325126",
    jenis: "Swasta",
    alamat: "Jl. Diponegoro No. 78",
    kabupaten: "Kota Semarang",
    cabangDinas: "Cabang Dinas Pendidikan Wilayah I",
    status: "Aktif",
  },
];

export default function DataSekolahPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSekolah = dataSekolah.filter((sekolah) =>
    sekolah.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sekolah.npsn.includes(searchQuery) ||
    sekolah.kabupaten.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Sekolah Binaan</h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola data sekolah binaan, NPSN, jenis, alamat, dan status binaan
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
          >
            <Filter className="size-4 mr-2" />
            Filter
          </Button>
          <Button className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white">
            <Plus className="size-4 mr-2" />
            Tambah Sekolah
          </Button>
        </div>
      </div>

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5 text-indigo-500" />
            Pencarian Sekolah
          </CardTitle>
          <CardDescription>
            Cari sekolah berdasarkan nama, NPSN, atau kabupaten/kota
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="search"
            placeholder="Cari sekolah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-inner transition placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredSekolah.map((sekolah) => (
          <Card
            key={sekolah.id}
            className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 transition hover:shadow-lg hover:shadow-indigo-200"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md shrink-0">
                    <School className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {sekolah.nama}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      NPSN: {sekolah.npsn}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600 shrink-0">
                  {sekolah.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <Building2 className="size-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium">Jenis:</span> {sekolah.jenis}
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="size-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium">Alamat:</span> {sekolah.alamat}
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="size-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium">Kabupaten/Kota:</span> {sekolah.kabupaten}
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <FileText className="size-4 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium">Cabang Dinas:</span> {sekolah.cabangDinas}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                >
                  Lihat Detail
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

