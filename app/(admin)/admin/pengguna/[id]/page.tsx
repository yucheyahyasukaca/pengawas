"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  School,
  FileSpreadsheet,
  Upload,
  Download,
  Bell,
  Calendar,
  MapPin,
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  Search,
  ChevronDown,
  FileText,
  Building2,
  ArrowLeft,
} from "lucide-react";

interface Pengawas {
  id: string;
  name: string;
  nip: string;
  wilayah: string;
  jumlahSekolah: number;
  status: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  sekolahBinaan: Array<{
    id: string | number;
    nama: string;
    npsn: string;
    jenis: string;
    alamat: string;
    kabupaten: string;
    cabangDinas: string;
    status: string;
  }>;
  pelaporanStatus: Array<{
    periode: string;
    status: string;
    deadline: string;
    submitted: boolean;
  }>;
  jadwalKegiatan: Array<{
    id: number;
    jenis: string;
    sekolah: string;
    tanggal: string;
    waktu: string;
    status: string;
  }>;
  notifikasi: Array<{
    id: number;
    pesan: string;
    tanggal: string;
    prioritas: string;
  }>;
  statistikData: {
    perKabupaten: Array<{ kabupaten: string; jumlah: number }>;
    perJenis: Array<{ jenis: string; jumlah: number }>;
    kegiatan: {
      bulanan: number;
      triwulanan: number;
      tahunan: number;
    };
  };
}

export default function PenggunaDetailPage() {
  const params = useParams();
  const [pengawas, setPengawas] = useState<Pengawas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKabupaten, setFilterKabupaten] = useState("Semua");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const loadPengawas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/admin/pengawas/${params.id}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Pengawas tidak ditemukan' }));
          const errorMessage = errorData.error || 'Pengawas tidak ditemukan';
          console.error("Error loading pengawas:", {
            status: response.status,
            message: errorMessage
          });
          setError(errorMessage);
          setPengawas(null);
          return;
        }

        const data = await response.json();
        
        if (!data.success) {
          const errorMessage = data.error || 'Pengawas tidak ditemukan';
          setError(errorMessage);
          setPengawas(null);
          return;
        }

        setPengawas(data.pengawas);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
        console.error("Error loading pengawas:", {
          message: errorMessage,
          error: err
        });
        setError(errorMessage);
        setPengawas(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadPengawas();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
          <p className="text-sm text-slate-600">Memuat detail pengawas...</p>
        </div>
      </div>
    );
  }

  if (error || !pengawas) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                <AlertCircle className="size-8 text-rose-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-slate-900">Pengawas Tidak Ditemukan</h3>
                <p className="text-slate-600">
                  {error || "Data pengawas yang Anda cari tidak ada atau telah dihapus."}
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                asChild
              >
                <Link href="/admin/pengguna">
                  <ArrowLeft className="size-4" />
                  Kembali ke Daftar Pengawas
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter sekolah
  const filteredSekolah = pengawas.sekolahBinaan.filter((sekolah) => {
    const matchesSearch =
      searchTerm === "" ||
      sekolah.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sekolah.npsn.includes(searchTerm) ||
      sekolah.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesKabupaten =
      filterKabupaten === "Semua" || sekolah.kabupaten === filterKabupaten;
    
    const matchesJenis =
      filterJenis === "Semua" || sekolah.jenis === filterJenis;

    return matchesSearch && matchesKabupaten && matchesJenis;
  });

  const uniqueKabupaten = [
    "Semua",
    ...Array.from(new Set(pengawas.sekolahBinaan.map((s) => s.kabupaten))),
  ];
  const uniqueJenis = [
    "Semua",
    ...Array.from(new Set(pengawas.sekolahBinaan.map((s) => s.jenis))),
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      // TODO: Implement Excel import logic
      console.log("Importing file:", selectedFile.name);
      alert(`File ${selectedFile.name} akan diimport. Fitur ini akan terhubung ke backend.`);
      setIsImportOpen(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-full border-0 bg-slate-100 px-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
            asChild
          >
            <Link href="/admin/pengguna">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Detail Pengguna</h1>
            <p className="mt-1 text-sm text-slate-600">
              Kelola data pengawas, sekolah binaan, dan kegiatan supervisi
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportOpen(true)}
            className="gap-2 rounded-full border-rose-200 bg-white px-4 font-semibold text-rose-600 shadow-sm hover:bg-rose-50"
          >
            <Upload className="size-4" />
            Import Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="size-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Data Pengawas Card */}
      <Card className="border border-rose-200 bg-gradient-to-br from-white via-rose-50/30 to-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-rose-400 to-pink-500 text-white shadow-lg">
              <Users className="size-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-slate-900">
                Data Pengawas
              </CardTitle>
              <CardDescription className="text-slate-600">
                Informasi lengkap pengawas sekolah
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                Nama Pengawas
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {pengawas.name}
              </p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                NIP
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {pengawas.nip}
              </p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                Wilayah Tugas
              </p>
              <div className="mt-2 flex items-center gap-2">
                <MapPin className="size-4 text-rose-500" />
                <p className="text-base font-bold text-slate-900">
                  {pengawas.wilayah}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                Jumlah Sekolah Binaan
              </p>
              <div className="mt-2 flex items-center gap-2">
                <School className="size-4 text-rose-500" />
                <p className="text-base font-bold text-slate-900">
                  {pengawas.jumlahSekolah} Sekolah
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Jumlah & Nama Sekolah, Status Pelaporan, Jadwal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Jumlah & Nama Sekolah Binaan */}
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md">
                <School className="size-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Sekolah Binaan
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {pengawas.jumlahSekolah} sekolah di wilayah tugas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pengawas.sekolahBinaan.slice(0, 5).map((sekolah) => (
                <div
                  key={sekolah.id}
                  className="flex items-center justify-between rounded-xl border border-rose-100 bg-white p-3 shadow-sm transition hover:border-rose-200 hover:shadow-md"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{sekolah.nama}</p>
                    <p className="text-xs text-slate-500">{sekolah.alamat}</p>
                  </div>
                  <Badge className="rounded-full border-0 bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                    {sekolah.jenis}
                  </Badge>
                </div>
              ))}
              {pengawas.sekolahBinaan.length > 5 && (
                <p className="text-center text-sm text-slate-500">
                  +{pengawas.sekolahBinaan.length - 5} sekolah lainnya
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Pelaporan */}
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                <FileSpreadsheet className="size-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Status Pelaporan
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Triwulan & Tahunan
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pengawas.pelaporanStatus.slice(0, 3).map((laporan, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {laporan.periode}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Deadline: {laporan.deadline}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        "rounded-full border-0 px-3 py-1 text-xs font-semibold",
                        laporan.submitted
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-amber-100 text-amber-600"
                      )}
                    >
                      {laporan.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jadwal & Notifikasi */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Jadwal Kegiatan */}
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">
                <Calendar className="size-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Jadwal Kegiatan
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Supervisi & Pendampingan
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pengawas.jadwalKegiatan.map((jadwal) => (
                <div
                  key={jadwal.id}
                  className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className="rounded-full border-0 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                          {jadwal.jenis}
                        </Badge>
                      </div>
                      <p className="mt-2 font-semibold text-slate-900">
                        {jadwal.sekolah}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {jadwal.tanggal}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {jadwal.waktu}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifikasi Tenggat Waktu */}
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
                <Bell className="size-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Notifikasi Tenggat
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Reminder deadline penting
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pengawas.notifikasi.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "rounded-xl border bg-white p-4 shadow-sm",
                    notif.prioritas === "tinggi"
                      ? "border-red-200 bg-red-50/50"
                      : "border-amber-100"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        notif.prioritas === "tinggi"
                          ? "text-red-500"
                          : "text-amber-500"
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {notif.pesan}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {notif.tanggal}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Sekolah Binaan Table */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md">
                <Building2 className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Data Sekolah Binaan
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Informasi lengkap semua sekolah binaan
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari sekolah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100 sm:w-64"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="gap-2 rounded-full border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <Filter className="size-4" />
                Filter
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    isFilterOpen && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Kabupaten/Kota
                  </label>
                  <select
                    value={filterKabupaten}
                    onChange={(e) => setFilterKabupaten(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  >
                    {uniqueKabupaten.map((kab) => (
                      <option key={kab} value={kab}>
                        {kab}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Jenis Sekolah
                  </label>
                  <select
                    value={filterJenis}
                    onChange={(e) => setFilterJenis(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  >
                    {uniqueJenis.map((jenis) => (
                      <option key={jenis} value={jenis}>
                        {jenis}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Mobile View - Cards */}
          <div className="block space-y-3 sm:hidden">
            {filteredSekolah.map((sekolah) => (
              <div
                key={sekolah.id}
                className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-slate-900">{sekolah.nama}</p>
                    <Badge className="rounded-full border-0 bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600">
                      {sekolah.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p>
                      <span className="font-medium">NPSN:</span> {sekolah.npsn}
                    </p>
                    <p>
                      <span className="font-medium">Jenis:</span> {sekolah.jenis}
                    </p>
                    <p>
                      <span className="font-medium">Alamat:</span> {sekolah.alamat}
                    </p>
                    <p>
                      <span className="font-medium">Kabupaten:</span> {sekolah.kabupaten}
                    </p>
                    <p>
                      <span className="font-medium">Cabang Dinas:</span>{" "}
                      {sekolah.cabangDinas}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-rose-100 bg-rose-50/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Nama Sekolah
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                    NPSN
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Jenis
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Alamat
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Kabupaten/Kota
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Cabang Dinas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {filteredSekolah.map((sekolah) => (
                  <tr
                    key={sekolah.id}
                    className="transition hover:bg-rose-50/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{sekolah.nama}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {sekolah.npsn}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="rounded-full border-0 bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                        {sekolah.jenis}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {sekolah.alamat}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {sekolah.kabupaten}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {sekolah.cabangDinas}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="rounded-full border-0 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                        {sekolah.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSekolah.length === 0 && (
              <div className="py-12 text-center text-sm text-slate-500">
                Tidak ada data sekolah yang sesuai dengan filter
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filter & Statistik */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
              <TrendingUp className="size-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-900">
                Filter & Statistik
              </CardTitle>
              <CardDescription className="text-slate-600">
                Analisis data sekolah binaan dan kegiatan
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Statistik Per Kabupaten */}
            <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                Per Kabupaten/Kota
              </p>
              <div className="mt-3 space-y-2">
                {pengawas.statistikData.perKabupaten.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-purple-100 bg-white p-2"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {stat.kabupaten}
                    </span>
                    <Badge className="rounded-full border-0 bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
                      {stat.jumlah}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistik Per Jenis */}
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Per Jenis Sekolah
              </p>
              <div className="mt-3 space-y-2">
                {pengawas.statistikData.perJenis.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-blue-100 bg-white p-2"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {stat.jenis}
                    </span>
                    <Badge className="rounded-full border-0 bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                      {stat.jumlah}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistik Kegiatan */}
            <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Jumlah Kegiatan
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-white p-2">
                  <span className="text-sm font-medium text-slate-700">
                    Bulanan
                  </span>
                  <Badge className="rounded-full border-0 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {pengawas.statistikData.kegiatan.bulanan}
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-white p-2">
                  <span className="text-sm font-medium text-slate-700">
                    Triwulanan
                  </span>
                  <Badge className="rounded-full border-0 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {pengawas.statistikData.kegiatan.triwulanan}
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-white p-2">
                  <span className="text-sm font-medium text-slate-700">
                    Tahunan
                  </span>
                  <Badge className="rounded-full border-0 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {pengawas.statistikData.kegiatan.tahunan}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Excel Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md border border-rose-200 bg-white shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md">
                    <Upload className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      Import Data Excel
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Unggah file Excel dengan format standar
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setIsImportOpen(false);
                    setSelectedFile(null);
                  }}
                  className="rounded-full"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/50 p-6 text-center">
                <FileText className="mx-auto size-12 text-rose-400" />
                <p className="mt-2 text-sm font-medium text-slate-700">
                  {selectedFile ? selectedFile.name : "Pilih file Excel"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Format: .xlsx, .xls (Maks 10MB)
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="mt-4 hidden"
                  id="file-input"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("file-input")?.click()}
                  className="mt-4 rounded-full border-rose-200 bg-white px-4 font-semibold text-rose-600 hover:bg-rose-50"
                >
                  {selectedFile ? "Ganti File" : "Pilih File"}
                </Button>
              </div>

              <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3">
                <p className="text-xs font-semibold text-amber-700">
                  Format Kolom Standar:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-amber-600">
                  <li>• Nama Sekolah</li>
                  <li>• NPSN</li>
                  <li>• Jenis (Negeri/Swasta)</li>
                  <li>• Alamat</li>
                  <li>• Kabupaten/Kota</li>
                  <li>• Cabang Dinas Pendidikan Wilayah</li>
                  <li>• Status Binaan</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    setIsImportOpen(false);
                    setSelectedFile(null);
                  }}
                >
                  Batal
                </Button>
                <Button
                  className="flex-1 rounded-full border-0 bg-rose-600 font-semibold text-white shadow-md hover:bg-rose-700"
                  onClick={handleImport}
                  disabled={!selectedFile}
                >
                  Import Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

