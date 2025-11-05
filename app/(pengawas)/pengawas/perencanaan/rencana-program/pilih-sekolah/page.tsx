"use client";

import { useRouter } from "next/navigation";
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
import {
  School,
  ArrowLeft,
  CheckCircle2,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Sekolah {
  id: string | number;
  nama: string;
  npsn: string;
  jenjang: string;
  alamat: string;
  kabupaten: string;
  cabangDinas: string;
  status: string;
}

export default function PilihSekolahPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [selectedSekolah, setSelectedSekolah] = useState<Set<string | number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSekolahBinaan();
  }, []);

  const loadSekolahBinaan = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user to get sekolah_binaan from metadata
      const userResponse = await fetch("/api/auth/get-current-user");

      if (!userResponse.ok) {
        throw new Error("Gagal memuat data pengawas");
      }

      const userData = await userResponse.json();
      const pengawas = userData.user;

      if (!pengawas || pengawas.role !== "pengawas") {
        throw new Error("Data pengawas tidak ditemukan");
      }

      // Get sekolah_binaan names from metadata
      const sekolahBinaanNames = Array.isArray(pengawas.metadata?.sekolah_binaan)
        ? pengawas.metadata.sekolah_binaan
        : [];

      if (sekolahBinaanNames.length === 0) {
        setError("Anda belum memiliki sekolah binaan. Silakan lengkapi profil Anda terlebih dahulu.");
        setSekolahList([]);
        setIsLoading(false);
        return;
      }

      // Fetch sekolah details from sekolah table
      const sekolahResponse = await fetch("/api/sekolah/list");

      if (!sekolahResponse.ok) {
        throw new Error("Gagal memuat data sekolah");
      }

      const sekolahData = await sekolahResponse.json();
      const allSekolah = sekolahData.sekolah || [];

      // Filter sekolah based on sekolah_binaan names
      const filteredSekolah = allSekolah
        .filter((sekolah: any) => sekolahBinaanNames.includes(sekolah.nama_sekolah))
        .map((sekolah: any) => ({
          id: sekolah.id,
          nama: sekolah.nama_sekolah,
          npsn: sekolah.npsn || "-",
          jenjang: sekolah.jenjang || "-",
          alamat: sekolah.alamat ? sekolah.alamat.trim() : "",
          kabupaten: sekolah.kabupaten_kota || "-",
          cabangDinas: `KCD Wilayah ${sekolah.kcd_wilayah || "-"}`,
          status: sekolah.status || "Aktif",
        }));

      setSekolahList(filteredSekolah);
    } catch (err) {
      console.error("Error loading sekolah binaan:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSekolah = (sekolahId: string | number) => {
    setSelectedSekolah((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sekolahId)) {
        newSet.delete(sekolahId);
      } else {
        newSet.add(sekolahId);
      }
      return newSet;
    });
  };

  const filteredSekolah = sekolahList.filter((sekolah) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      sekolah.nama.toLowerCase().includes(query) ||
      sekolah.npsn.toLowerCase().includes(query) ||
      sekolah.kabupaten.toLowerCase().includes(query)
    );
  });

  const handleContinue = () => {
    if (selectedSekolah.size === 0) {
      toast({
        title: "Peringatan",
        description: "Silakan pilih minimal satu sekolah binaan",
        variant: "destructive",
      });
      return;
    }

    // Store selected schools in sessionStorage and redirect to buat page
    const selectedIds = Array.from(selectedSekolah);
    sessionStorage.setItem("rencana_program_selected_sekolah", JSON.stringify(selectedIds));
    
    router.push("/pengawas/perencanaan/rencana-program/buat");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-600">Memuat data sekolah binaan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Card className="border-red-200 bg-red-50/50 max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="size-5 text-red-600" />
              <p className="text-sm font-semibold text-red-900">Error</p>
            </div>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button
                onClick={loadSekolahBinaan}
                variant="outline"
                className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              >
                Coba Lagi
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex-1 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Kembali
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 px-3 sm:px-0 bg-gradient-to-b from-slate-50/30 to-white min-h-screen pb-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-4 sm:pt-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="rounded-xl hover:bg-sky-50/50 text-slate-600 shrink-0"
          >
            <ArrowLeft className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex size-7 sm:size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-300 to-blue-300 text-white shadow-sm shrink-0">
              <School className="size-3.5 sm:size-4" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-700 truncate">
              Pilih Sekolah Binaan
            </h1>
          </div>
        </div>
        {selectedSekolah.size > 0 && (
          <Badge className="rounded-full border-2 border-indigo-300 bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-700 shrink-0">
            {selectedSekolah.size} Sekolah Dipilih
          </Badge>
        )}
      </div>

      {/* Info Card */}
      <Card className="border-0 bg-indigo-50/50 backdrop-blur-sm shadow-md">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 sm:size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-300 to-blue-300 text-white shadow-sm shrink-0">
              <School className="size-4 sm:size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1">
                Pilih Sekolah untuk Rencana Program
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Pilih satu atau lebih sekolah binaan yang akan menjadi target rencana program kepengawasan ini. 
                Rencana program akan berlaku untuk semua sekolah yang dipilih.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Card */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Search className="size-5 text-indigo-600" />
            Cari Sekolah
          </CardTitle>
          <CardDescription className="text-slate-700">
            Cari sekolah berdasarkan nama, NPSN, atau kabupaten/kota
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="search"
            placeholder="Cari sekolah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border-2 border-indigo-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
          />
        </CardContent>
      </Card>

      {/* School List */}
      {filteredSekolah.length === 0 ? (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <School className="size-12 text-indigo-400" />
              <div>
                <p className="text-sm font-semibold text-indigo-900 mb-1">
                  {searchQuery ? "Sekolah tidak ditemukan" : "Tidak ada sekolah binaan"}
                </p>
                <p className="text-xs text-indigo-600">
                  {searchQuery
                    ? "Coba gunakan kata kunci lain untuk mencari"
                    : "Silakan lengkapi profil Anda dengan menambahkan sekolah binaan"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSekolah.map((sekolah) => {
            const isSelected = selectedSekolah.has(sekolah.id);
            return (
              <Card
                key={sekolah.id}
                className={cn(
                  "border-2 transition-all cursor-pointer",
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-200"
                    : "border-indigo-200 bg-white shadow-md shadow-indigo-100/70 hover:shadow-lg hover:shadow-indigo-200 hover:border-indigo-300"
                )}
                onClick={() => toggleSekolah(sekolah.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "flex size-12 items-center justify-center rounded-full shadow-md shrink-0 transition-all",
                          isSelected
                            ? "bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400"
                            : "bg-gradient-to-br from-indigo-300 to-blue-300"
                        )}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="size-6 text-white" />
                        ) : (
                          <School className="size-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                          {sekolah.nama}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm font-medium text-slate-700 mt-1">
                          NPSN: {sekolah.npsn}
                        </CardDescription>
                      </div>
                    </div>
                    {isSelected && (
                      <Badge className="rounded-full border-2 border-indigo-500 bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 shrink-0">
                        Dipilih
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-slate-900">Jenjang:</span>
                    <span className="text-slate-700">{sekolah.jenjang}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-slate-900">Kabupaten/Kota:</span>
                    <span className="text-slate-700">{sekolah.kabupaten}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-slate-900">Cabang Dinas:</span>
                    <span className="text-slate-700 truncate">{sekolah.cabangDinas}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-md">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-4 sm:pt-6 p-4 sm:p-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl border-0 bg-slate-50/50 text-slate-600 hover:bg-slate-100/50 shadow-sm sm:w-auto w-full order-2 sm:order-1"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            disabled={selectedSekolah.size === 0}
            className={cn(
              "rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-5 sm:px-6 py-2.5 font-medium text-white shadow-sm transition-all duration-300",
              "hover:from-indigo-600 hover:to-blue-600 hover:shadow-md hover:scale-[1.01]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "sm:w-auto w-full order-1 sm:order-2"
            )}
          >
            Lanjutkan ({selectedSekolah.size} sekolah dipilih)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

