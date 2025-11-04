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
import { BarChart3, Filter, School, MapPin, TrendingUp } from "lucide-react";

const statistikKabupaten = [
  { kabupaten: "Kota Semarang", jumlahSekolah: 12, jumlahKegiatan: 45, status: "Aktif" },
  { kabupaten: "Kabupaten Semarang", jumlahSekolah: 8, jumlahKegiatan: 32, status: "Aktif" },
  { kabupaten: "Kota Salatiga", jumlahSekolah: 5, jumlahKegiatan: 18, status: "Aktif" },
  { kabupaten: "Kabupaten Kendal", jumlahSekolah: 6, jumlahKegiatan: 24, status: "Aktif" },
];

const statistikJenis = [
  { jenis: "SMA Negeri", jumlah: 18, persentase: 58 },
  { jenis: "SMA Swasta", jumlah: 8, persentase: 26 },
  { jenis: "SLB Negeri", jumlah: 4, persentase: 13 },
  { jenis: "SLB Swasta", jumlah: 1, persentase: 3 },
];

export default function StatistikPage() {
  const [filterKabupaten, setFilterKabupaten] = useState<string>("Semua");
  const [filterJenis, setFilterJenis] = useState<string>("Semua");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Filter & Statistik</h1>
          <p className="text-sm text-slate-600 mt-1">
            Analisis data per kabupaten/kota, jenis sekolah, dan jumlah kegiatan
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
        >
          <Filter className="size-4 mr-2" />
          Filter Lanjutan
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Total Sekolah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">31</p>
            <p className="text-sm text-slate-600 mt-1">Sekolah binaan</p>
          </CardContent>
        </Card>
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Total Kegiatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">119</p>
            <p className="text-sm text-slate-600 mt-1">Kegiatan tahun ini</p>
          </CardContent>
        </Card>
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Kabupaten/Kota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">4</p>
            <p className="text-sm text-slate-600 mt-1">Wilayah binaan</p>
          </CardContent>
        </Card>
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Tingkat Penyelesaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">85%</p>
            <p className="text-sm text-slate-600 mt-1">Kegiatan tuntas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-indigo-500" />
              Statistik per Kabupaten/Kota
            </CardTitle>
            <CardDescription>
              Jumlah sekolah dan kegiatan per wilayah
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statistikKabupaten.map((stat) => (
              <div
                key={stat.kabupaten}
                className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{stat.kabupaten}</h3>
                  <Badge className="rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {stat.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <School className="size-4 text-indigo-500" />
                    <div>
                      <p className="text-xs text-slate-600">Sekolah</p>
                      <p className="text-lg font-bold text-slate-900">{stat.jumlahSekolah}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="size-4 text-indigo-500" />
                    <div>
                      <p className="text-xs text-slate-600">Kegiatan</p>
                      <p className="text-lg font-bold text-slate-900">{stat.jumlahKegiatan}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="size-5 text-indigo-500" />
              Statistik per Jenis Sekolah
            </CardTitle>
            <CardDescription>
              Distribusi sekolah berdasarkan jenis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statistikJenis.map((stat) => (
              <div
                key={stat.jenis}
                className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{stat.jenis}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-indigo-600">{stat.jumlah}</span>
                    <Badge className="rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                      {stat.persentase}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-indigo-100 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-blue-400 h-2.5 rounded-full transition-all"
                    style={{ width: `${stat.persentase}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

