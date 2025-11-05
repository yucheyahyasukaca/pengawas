"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  School, 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Download, 
  FileSpreadsheet,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Sekolah {
  id: string;
  npsn: string;
  nama_sekolah: string;
  status: string;
  jenjang: string;
  kabupaten_kota: string;
  alamat: string;
  kcd_wilayah: number;
  created_at: string;
  updated_at: string;
}

export default function DataSekolahPage() {
  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Negeri" | "Swasta">("all");
  const [jenjangFilter, setJenjangFilter] = useState<"all" | "SMK" | "SMA" | "SLB">("all");
  const [kcdFilter, setKcdFilter] = useState<"all" | number>("all");
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    npsn: "",
    nama_sekolah: "",
    status: "Negeri",
    jenjang: "SMK",
    kabupaten_kota: "",
    alamat: "",
    kcd_wilayah: "1"
  });
  const [formError, setFormError] = useState<string | null>(null);
  
  // Import states
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadSekolah();
  }, []);

  const loadSekolah = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/sekolah');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Gagal memuat data sekolah' }));
        setError(errorData.error || 'Gagal memuat data sekolah');
        setSekolahList([]);
        return;
      }

      const data = await response.json();
      
      if (!data.success) {
        setError(data.error || 'Gagal memuat data sekolah');
        setSekolahList([]);
        return;
      }

      setSekolahList(data.sekolah || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      setError(errorMessage);
      setSekolahList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter sekolah
  const filteredSekolah = useMemo(() => {
    let filtered = sekolahList;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Filter by jenjang
    if (jenjangFilter !== "all") {
      filtered = filtered.filter(s => s.jenjang === jenjangFilter);
    }

    // Filter by KCD Wilayah
    if (kcdFilter !== "all") {
      filtered = filtered.filter(s => s.kcd_wilayah === kcdFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(s => {
        const npsn = s.npsn?.toLowerCase() || "";
        const nama = s.nama_sekolah?.toLowerCase() || "";
        const kabupaten = s.kabupaten_kota?.toLowerCase() || "";
        const alamat = s.alamat?.toLowerCase() || "";

        return npsn.includes(query) || 
               nama.includes(query) || 
               kabupaten.includes(query) ||
               alamat.includes(query);
      });
    }

    return filtered;
  }, [sekolahList, searchQuery, statusFilter, jenjangFilter, kcdFilter]);

  const handleAddSekolah = async () => {
    setFormError(null);
    setIsProcessing(true);

    // Validasi
    if (!formData.npsn.trim() || !formData.nama_sekolah.trim() || !formData.kabupaten_kota.trim() || !formData.alamat.trim()) {
      setFormError("Semua field harus diisi");
      setIsProcessing(false);
      return;
    }

    const kcdWilayah = parseInt(formData.kcd_wilayah);
    if (isNaN(kcdWilayah) || kcdWilayah < 1 || kcdWilayah > 13) {
      setFormError("KCD Wilayah harus antara 1 sampai 13");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/sekolah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          kcd_wilayah: kcdWilayah
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Gagal menambahkan sekolah");
        setIsProcessing(false);
        return;
      }

      // Success
      setIsAddDialogOpen(false);
      setFormData({
        npsn: "",
        nama_sekolah: "",
        status: "Negeri",
        jenjang: "SMK",
        kabupaten_kota: "",
        alamat: "",
        kcd_wilayah: "1"
      });
      await loadSekolah();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan saat menambahkan sekolah");
    } finally {
      setIsProcessing(false);
    }
  };

  // Parse Excel file and show preview
  const handleParseExcel = async () => {
    if (!importFile) {
      setImportError("Pilih file Excel terlebih dahulu");
      return;
    }

    setIsProcessing(true);
    setImportError(null);
    setParsedData(null);
    setShowPreview(false);

    try {
      // Parse Excel file via API
      const formData = new FormData();
      formData.append('file', importFile);

      const parseResponse = await fetch('/api/admin/sekolah/parse-excel', {
        method: 'POST',
        body: formData,
      }).catch((fetchError) => {
        console.error('Fetch error:', fetchError);
        throw new Error(`Gagal menghubungkan ke server: ${fetchError.message}`);
      });

      if (!parseResponse.ok) {
        const errorText = await parseResponse.text();
        let errorMessage = "Gagal memparse file Excel";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || `Server error: ${parseResponse.status} ${parseResponse.statusText}`;
        }
        setImportError(errorMessage);
        setIsProcessing(false);
        return;
      }

      const parseData = await parseResponse.json().catch(() => {
        throw new Error("Gagal membaca response dari server");
      });

      if (!parseData.success) {
        setImportError(parseData.error || "Gagal memparse file Excel");
        setIsProcessing(false);
        return;
      }

      if (parseData.errors && parseData.errors.length > 0) {
        setImportError(`Error parsing: ${parseData.errors.slice(0, 3).join(', ')}${parseData.errors.length > 3 ? '...' : ''}`);
        setIsProcessing(false);
        return;
      }

      // Show preview
      setParsedData(parseData.data || []);
      setShowPreview(true);
      setIsProcessing(false);
    } catch (err) {
      console.error('Parse error:', err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat memparse file Excel";
      setImportError(errorMessage);
      setIsProcessing(false);
    }
  };

  // Import parsed data to database
  const handleImportExcel = async () => {
    if (!parsedData || parsedData.length === 0) {
      setImportError("Tidak ada data untuk diimport");
      return;
    }

    setIsProcessing(true);
    setImportError(null);

    try {
      // Send parsed data to import API
      const response = await fetch('/api/admin/sekolah/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sekolahData: parsedData }),
      }).catch((fetchError) => {
        console.error('Fetch error:', fetchError);
        throw new Error(`Gagal menghubungkan ke server: ${fetchError.message}`);
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Gagal mengimport data";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || `Server error: ${response.status} ${response.statusText}`;
        }
        setImportError(errorMessage);
        setIsProcessing(false);
        return;
      }

      const data = await response.json().catch(() => {
        throw new Error("Gagal membaca response dari server");
      });

      if (!data.success) {
        setImportError(data.error || "Gagal mengimport data");
        setIsProcessing(false);
        return;
      }

      // Success
      setIsImportDialogOpen(false);
      setImportFile(null);
      setImportError(null);
      setParsedData(null);
      setShowPreview(false);
      await loadSekolah();
      setIsProcessing(false);
    } catch (err) {
      console.error('Import error:', err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat mengimport data";
      setImportError(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsProcessing(true);
      // Download Excel file directly from API
      await downloadExcelFile('/api/admin/sekolah/export-excel', 'Data_Sekolah_Binaan.xlsx');
      setIsProcessing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengekspor data");
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsProcessing(true);
      // Download Excel file directly from API
      await downloadExcelFile('/api/admin/sekolah/template-excel', 'Template_Import_Sekolah.xlsx');
      setIsProcessing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengunduh template");
      setIsProcessing(false);
    }
  };

  // Download Excel file from API
  const downloadExcelFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Gagal mengunduh file');
      }
      
      const blob = await response.blob();
      const link = document.createElement('a');
      const downloadUrl = URL.createObjectURL(blob);
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengunduh file");
    }
  };

  // Get unique values for filters
  const uniqueKabupaten = useMemo(() => {
    const set = new Set(sekolahList.map(s => s.kabupaten_kota));
    return Array.from(set).sort();
  }, [sekolahList]);

  const uniqueKcdWilayah = useMemo(() => {
    const set = new Set(sekolahList.map(s => s.kcd_wilayah));
    return Array.from(set).sort((a, b) => a - b);
  }, [sekolahList]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-flex size-12 animate-spin items-center justify-center rounded-full border-4 border-rose-200 border-t-rose-600">
            <div className="size-8 rounded-full bg-rose-100" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Sekolah Binaan</h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola data sekolah binaan pengawas
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
          >
            <FileSpreadsheet className="size-4 mr-2" />
            Template
          </Button>
          <Button
            onClick={() => setIsImportDialogOpen(true)}
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
          >
            <Upload className="size-4 mr-2" />
            Import
          </Button>
          <Button
            onClick={handleExportExcel}
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
          >
            <Download className="size-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            size="sm"
            className="rounded-xl border-0 bg-gradient-to-r from-[#B53740] to-[#8B2A31] px-4 py-2 font-semibold text-white shadow-lg shadow-[#B53740]/25 transition-all hover:from-[#8B2A31] hover:to-[#6B1F24] hover:shadow-xl hover:shadow-[#B53740]/30"
          >
            <Plus className="size-4 mr-2" />
            Tambah Sekolah
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NPSN, nama sekolah, kabupaten, atau alamat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className={cn(
              "rounded-xl text-xs sm:text-sm font-medium transition-all",
              statusFilter === "all"
                ? "bg-[#B53740] text-white hover:bg-[#8B2A31]"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            <Filter className="size-3 mr-1.5" />
            Semua Status ({sekolahList.length})
          </Button>
          <Button
            variant={statusFilter === "Negeri" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("Negeri")}
            className={cn(
              "rounded-xl text-xs sm:text-sm font-medium transition-all",
              statusFilter === "Negeri"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            Negeri ({sekolahList.filter(s => s.status === 'Negeri').length})
          </Button>
          <Button
            variant={statusFilter === "Swasta" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("Swasta")}
            className={cn(
              "rounded-xl text-xs sm:text-sm font-medium transition-all",
              statusFilter === "Swasta"
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            Swasta ({sekolahList.filter(s => s.status === 'Swasta').length})
          </Button>
          <Button
            variant={jenjangFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setJenjangFilter("all")}
            className={cn(
              "rounded-xl text-xs sm:text-sm font-medium transition-all",
              jenjangFilter === "all"
                ? "bg-[#B53740] text-white hover:bg-[#8B2A31]"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            Semua Jenjang
          </Button>
          <Button
            variant={jenjangFilter === "SMK" ? "default" : "outline"}
            size="sm"
            onClick={() => setJenjangFilter("SMK")}
            className={cn(
              "rounded-xl text-xs sm:text-sm font-medium transition-all",
              jenjangFilter === "SMK"
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            SMK ({sekolahList.filter(s => s.jenjang === 'SMK').length})
          </Button>
          <Button
            variant={jenjangFilter === "SMA" ? "default" : "outline"}
            size="sm"
            onClick={() => setJenjangFilter("SMA")}
            className={cn(
              "rounded-xl text-xs sm:text-sm font-medium transition-all",
              jenjangFilter === "SMA"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            SMA ({sekolahList.filter(s => s.jenjang === 'SMA').length})
          </Button>
          <Button
            variant={jenjangFilter === "SLB" ? "default" : "outline"}
            size="sm"
            onClick={() => setJenjangFilter("SLB")}
            className={cn(
              "rounded-xl text-xs sm:text-sm font-medium transition-all",
              jenjangFilter === "SLB"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            SLB ({sekolahList.filter(s => s.jenjang === 'SLB').length})
          </Button>
          {kcdFilter === "all" ? (
            <select
              value=""
              onChange={(e) => setKcdFilter(e.target.value ? parseInt(e.target.value) : "all")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#B53740]/20"
            >
              <option value="">Semua KCD</option>
              {uniqueKcdWilayah.map(kcd => (
                <option key={kcd} value={kcd}>KCD {kcd}</option>
              ))}
            </select>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setKcdFilter("all")}
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              KCD {kcdFilter} ×
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Card className="border border-red-200 bg-red-50/50">
          <CardContent className="py-6">
            <div className="flex items-start gap-3">
              <XCircle className="size-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900">Error Memuat Data</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <Button
                  onClick={loadSekolah}
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-full border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300"
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!error && sekolahList.length === 0 ? (
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-rose-100">
                <School className="size-8 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Belum Ada Data Sekolah
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Tambahkan sekolah secara manual atau import dari Excel
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : filteredSekolah.length === 0 ? (
        <Card className="border border-slate-200 bg-white shadow-md">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-slate-100">
                <Search className="size-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Tidak Ditemukan
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Tidak ada sekolah yang sesuai dengan pencarian Anda
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-md shadow-rose-100/70 md:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-700">
                <thead className="bg-gradient-to-r from-rose-50 via-white to-amber-50 text-xs font-semibold uppercase tracking-wide text-slate-700">
                  <tr>
                    <th className="px-5 py-4 font-semibold">NPSN</th>
                    <th className="px-5 py-4 font-semibold">UNIT SEKOLAH</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Jenjang</th>
                    <th className="px-5 py-4 font-semibold">Kabupaten/Kota</th>
                    <th className="px-5 py-4 font-semibold">Alamat</th>
                    <th className="px-5 py-4 font-semibold">KCD WILAYAH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100">
                  {filteredSekolah.map((sekolah) => (
                    <tr key={sekolah.id} className="transition-colors hover:bg-rose-50/50">
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-medium text-slate-900">{sekolah.npsn}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">{sekolah.nama_sekolah}</div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={cn(
                          "rounded-full border-0 px-3 py-1 text-xs font-semibold",
                          sekolah.status === 'Negeri'
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                        )}>
                          {sekolah.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={cn(
                          "rounded-full border-0 px-3 py-1 text-xs font-semibold",
                          sekolah.jenjang === 'SMK'
                            ? "bg-amber-100 text-amber-600"
                            : sekolah.jenjang === 'SMA'
                            ? "bg-green-100 text-green-600"
                            : "bg-indigo-100 text-indigo-600"
                        )}>
                          {sekolah.jenjang}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="size-3.5 text-rose-500" />
                          <span className="text-xs">{sekolah.kabupaten_kota}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-600">{sekolah.alamat}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className="rounded-full border-0 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {sekolah.kcd_wilayah}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {filteredSekolah.map((sekolah) => (
              <Card
                key={sekolah.id}
                className="border border-rose-200 bg-white shadow-md shadow-rose-100/70 transition hover:shadow-lg hover:shadow-rose-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold text-slate-900">
                        {sekolah.nama_sekolah}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        NPSN: <span className="font-mono">{sekolah.npsn}</span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={cn(
                        "rounded-full border-0 px-2 py-1 text-xs font-semibold",
                        sekolah.status === 'Negeri'
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      )}>
                        {sekolah.status}
                      </Badge>
                      <Badge className={cn(
                        "rounded-full border-0 px-2 py-1 text-xs font-semibold",
                        sekolah.jenjang === 'SMK'
                          ? "bg-amber-100 text-amber-600"
                          : sekolah.jenjang === 'SMA'
                          ? "bg-green-100 text-green-600"
                          : "bg-indigo-100 text-indigo-600"
                      )}>
                        {sekolah.jenjang}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="size-4 text-rose-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">{sekolah.kabupaten_kota}</span>
                      <p className="mt-1 text-xs text-slate-500">{sekolah.alamat}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full border-0 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      KCD Wilayah {sekolah.kcd_wilayah}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Add Sekolah Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[95vh] p-4 sm:p-6">
          <DialogHeader className="pb-4 sm:pb-6">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900">
              <Plus className="size-5 sm:size-6 text-[#B53740] shrink-0" />
              <span>Tambah Sekolah Baru</span>
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-slate-600 mt-1.5">
              Isi data sekolah binaan dengan lengkap dan benar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
            {formError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200/50 bg-red-50/80 p-4 text-sm text-red-800 backdrop-blur-sm shadow-sm">
                <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-600" />
                <span className="flex-1 leading-relaxed">{formError}</span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="npsn" className="text-sm sm:text-base font-semibold text-slate-900">
                  NPSN <span className="text-[#B53740]">*</span>
                </label>
                <input
                  id="npsn"
                  type="text"
                  placeholder="Contoh: 20337887"
                  value={formData.npsn}
                  onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isProcessing}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="kcd_wilayah" className="text-sm sm:text-base font-semibold text-slate-900">
                  KCD Wilayah <span className="text-[#B53740]">*</span>
                </label>
                <select
                  id="kcd_wilayah"
                  value={formData.kcd_wilayah}
                  onChange={(e) => setFormData({ ...formData, kcd_wilayah: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isProcessing}
                >
                  {Array.from({ length: 13 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>KCD Wilayah {num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="nama_sekolah" className="text-sm sm:text-base font-semibold text-slate-900">
                Nama Sekolah <span className="text-[#B53740]">*</span>
              </label>
              <input
                id="nama_sekolah"
                type="text"
                placeholder="Contoh: SMK NEGERI 1 PUNGGELAN"
                value={formData.nama_sekolah}
                onChange={(e) => setFormData({ ...formData, nama_sekolah: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={isProcessing}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm sm:text-base font-semibold text-slate-900">
                  Status <span className="text-[#B53740]">*</span>
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isProcessing}
                >
                  <option value="Negeri">Negeri</option>
                  <option value="Swasta">Swasta</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="jenjang" className="text-sm sm:text-base font-semibold text-slate-900">
                  Jenjang <span className="text-[#B53740]">*</span>
                </label>
                <select
                  id="jenjang"
                  value={formData.jenjang}
                  onChange={(e) => setFormData({ ...formData, jenjang: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isProcessing}
                >
                  <option value="SMK">SMK</option>
                  <option value="SMA">SMA</option>
                  <option value="SLB">SLB</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="kabupaten_kota" className="text-sm sm:text-base font-semibold text-slate-900">
                Kabupaten/Kota <span className="text-[#B53740]">*</span>
              </label>
              <input
                id="kabupaten_kota"
                type="text"
                placeholder="Contoh: Kabupaten Banjarnegara"
                value={formData.kabupaten_kota}
                onChange={(e) => setFormData({ ...formData, kabupaten_kota: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="alamat" className="text-sm sm:text-base font-semibold text-slate-900">
                Alamat <span className="text-[#B53740]">*</span>
              </label>
              <textarea
                id="alamat"
                rows={3}
                placeholder="Contoh: JL. RAYA PASAR MANIS, LOJI, PUNGGELAN, BANJARNEGARA"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={isProcessing}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setFormError(null);
                setFormData({
                  npsn: "",
                  nama_sekolah: "",
                  status: "Negeri",
                  jenjang: "SMK",
                  kabupaten_kota: "",
                  alamat: "",
                  kcd_wilayah: "1"
                });
              }}
              disabled={isProcessing}
              className="w-full sm:w-auto rounded-xl border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </Button>
            <Button
              onClick={handleAddSekolah}
              disabled={isProcessing}
              className="w-full sm:w-auto rounded-xl border-0 bg-gradient-to-r from-[#B53740] to-[#8B2A31] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#B53740]/25 transition-all hover:from-[#8B2A31] hover:to-[#6B1F24] hover:shadow-xl hover:shadow-[#B53740]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="size-5" />
                  Simpan
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Excel Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl p-4 sm:p-6">
          <DialogHeader className="pb-4 sm:pb-6">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900">
              <Upload className="size-5 sm:size-6 text-[#B53740] shrink-0" />
              <span>Import Data Sekolah dari Excel</span>
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-slate-600 mt-1.5">
              Upload file Excel (.xlsx atau .xls) dengan format sesuai template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {importError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200/50 bg-red-50/80 p-4 text-sm text-red-800 backdrop-blur-sm shadow-sm">
                <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-600" />
                <span className="flex-1 leading-relaxed">{importError}</span>
              </div>
            )}

            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <Upload className="mx-auto size-12 text-slate-400 mb-4" />
              <p className="text-sm font-semibold text-slate-900 mb-2">
                {importFile ? importFile.name : "Seret file Excel ke sini atau klik untuk memilih"}
              </p>
              <p className="text-xs text-slate-600 mb-4">
                Format yang didukung: .xlsx, .xls, .csv, .tsv
              </p>
              <p className="text-xs text-slate-500 mb-4">
                File Excel (.xlsx/.xls) langsung didukung tanpa perlu konversi
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv,.tsv,.txt"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="hidden"
                id="import-file"
                disabled={isProcessing}
              />
              <label htmlFor="import-file">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                  disabled={isProcessing}
                  asChild
                >
                  <span>Pilih File</span>
                </Button>
              </label>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-900 mb-2">
                Format Kolom yang Diperlukan:
              </p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• NPSN (harus unik)</li>
                <li>• UNIT SEKOLAH (nama sekolah)</li>
                <li>• Status (Negeri atau Swasta)</li>
                <li>• Jenjang (SMK, SMA, atau SLB)</li>
                <li>• Kabupaten/Kota</li>
                <li>• Alamat</li>
                <li>• KCD WILAYAH (angka 1-13)</li>
              </ul>
            </div>

            {/* Preview Data Section */}
            {showPreview && parsedData && parsedData.length > 0 && (
              <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">
                    Preview Data ({parsedData.length} baris)
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPreview(false);
                      setParsedData(null);
                    }}
                    className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Sembunyikan
                  </Button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white max-h-[400px] overflow-auto shadow-sm">
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-slate-900 border-b border-slate-200">NPSN</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-900 border-b border-slate-200">Nama Sekolah</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-900 border-b border-slate-200">Status</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-900 border-b border-slate-200">Jenjang</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-900 border-b border-slate-200">Kabupaten/Kota</th>
                          <th className="px-4 py-3 text-left font-semibold text-slate-900 border-b border-slate-200">KCD Wilayah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedData.map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-700 font-mono text-xs">{row.npsn}</td>
                            <td className="px-4 py-3 text-slate-700">{row.nama_sekolah}</td>
                            <td className="px-4 py-3">
                              <Badge className={cn(
                                "rounded-full border-0 px-2 py-1 text-xs font-semibold",
                                row.status === 'Negeri' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                              )}>
                                {row.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={cn(
                                "rounded-full border-0 px-2 py-1 text-xs font-semibold",
                                row.jenjang === 'SMK' ? "bg-amber-100 text-amber-600" :
                                row.jenjang === 'SMA' ? "bg-green-100 text-green-600" : "bg-indigo-100 text-indigo-600"
                              )}>
                                {row.jenjang}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-slate-700 text-xs">{row.kabupaten_kota}</td>
                            <td className="px-4 py-3">
                              <Badge className="rounded-full border-0 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                                {row.kcd_wilayah}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-slate-100">
                    {parsedData.map((row, index) => (
                      <div key={index} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{row.nama_sekolah}</p>
                            <p className="text-xs text-slate-500 mt-1">NPSN: <span className="font-mono">{row.npsn}</span></p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge className={cn(
                              "rounded-full border-0 px-2 py-1 text-xs font-semibold",
                              row.status === 'Negeri' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                            )}>
                              {row.status}
                            </Badge>
                            <Badge className={cn(
                              "rounded-full border-0 px-2 py-1 text-xs font-semibold",
                              row.jenjang === 'SMK' ? "bg-amber-100 text-amber-600" :
                              row.jenjang === 'SMA' ? "bg-green-100 text-green-600" : "bg-indigo-100 text-indigo-600"
                            )}>
                              {row.jenjang}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                          <MapPin className="size-3 text-slate-400" />
                          <span>{row.kabupaten_kota}</span>
                        </div>
                        <Badge className="mt-2 rounded-full border-0 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          KCD Wilayah {row.kcd_wilayah}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsImportDialogOpen(false);
                setImportFile(null);
                setImportError(null);
                setParsedData(null);
                setShowPreview(false);
              }}
              disabled={isProcessing}
              className="w-full sm:w-auto rounded-xl border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </Button>
            {!showPreview ? (
              <Button
                onClick={handleParseExcel}
                disabled={isProcessing || !importFile}
                className="w-full sm:w-auto rounded-xl border-0 bg-gradient-to-r from-[#B53740] to-[#8B2A31] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#B53740]/25 transition-all hover:from-[#8B2A31] hover:to-[#6B1F24] hover:shadow-xl hover:shadow-[#B53740]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FileSpreadsheet className="size-5" />
                    Preview Data
                  </span>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleImportExcel}
                disabled={isProcessing || !parsedData || parsedData.length === 0}
                className="w-full sm:w-auto rounded-xl border-0 bg-gradient-to-r from-[#B53740] to-[#8B2A31] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#B53740]/25 transition-all hover:from-[#8B2A31] hover:to-[#6B1F24] hover:shadow-xl hover:shadow-[#B53740]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Mengimport...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Upload className="size-5" />
                    Import ke Database
                  </span>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

