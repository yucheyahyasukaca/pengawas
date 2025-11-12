"use client";

import { useRouter, useParams } from "next/navigation";
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
  School,
  ArrowLeft,
  CheckCircle2,
  Search,
  Loader2,
  AlertCircle,
  FileText,
  Hash,
  Users,
  Heart,
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

interface InstrumenMonitoring {
  id: string;
  nama: string;
  deskripsi: string;
}

const monitoringTypes: Record<string, { title: string; icon: any }> = {
  "7-kebiasaan-hebat": {
    title: "7 Kebiasaan Hebat",
    icon: Hash,
  },
  "8-profil-lulusan": {
    title: "8 Profil Lulusan",
    icon: Users,
  },
  "penguatan-karakter": {
    title: "Penguatan Karakter",
    icon: Heart,
  },
};

// Placeholder data untuk instrumen monitoring - nanti bisa diambil dari database
const getInstrumenMonitoring = (monitoringId: string): InstrumenMonitoring[] => {
  const baseInstrumen: InstrumenMonitoring[] = [
    {
      id: "instrumen-1",
      nama: "Instrumen Monitoring 1",
      deskripsi: "Deskripsi instrumen monitoring untuk " + monitoringId,
    },
    {
      id: "instrumen-2",
      nama: "Instrumen Monitoring 2",
      deskripsi: "Deskripsi instrumen monitoring untuk " + monitoringId,
    },
    {
      id: "instrumen-3",
      nama: "Instrumen Monitoring 3",
      deskripsi: "Deskripsi instrumen monitoring untuk " + monitoringId,
    },
  ];

  // Bisa dikustomisasi berdasarkan jenis monitoring
  if (monitoringId === "7-kebiasaan-hebat") {
    return [
      {
        id: "persiapan-kebiasaan",
        nama: "Instrumen Persiapan Kebiasaan Anak Indonesia Hebat",
        deskripsi: "Instrumen untuk memonitoring persiapan kebiasaan anak Indonesia hebat",
      },
      {
        id: "pelaksanaan-kebiasaan",
        nama: "Instrumen Pelaksanaan Kebiasaan Anak Indonesia Hebat",
        deskripsi: "Instrumen untuk memonitoring pelaksanaan kebiasaan anak Indonesia hebat",
      },
    ];
  }

  if (monitoringId === "8-profil-lulusan") {
    return [
      {
        id: "profil-1",
        nama: "Instrumen Profil Lulusan: Beriman dan Bertakwa",
        deskripsi: "Instrumen untuk memonitoring profil lulusan beriman dan bertakwa",
      },
      {
        id: "profil-2",
        nama: "Instrumen Profil Lulusan: Berakhlak Mulia",
        deskripsi: "Instrumen untuk memonitoring profil lulusan berakhlak mulia",
      },
    ];
  }

  if (monitoringId === "penguatan-karakter") {
    return [
      {
        id: "karakter-1",
        nama: "Instrumen Penguatan Karakter: Religius",
        deskripsi: "Instrumen untuk memonitoring penguatan karakter religius",
      },
      {
        id: "karakter-2",
        nama: "Instrumen Penguatan Karakter: Nasionalis",
        deskripsi: "Instrumen untuk memonitoring penguatan karakter nasionalis",
      },
    ];
  }

  return baseInstrumen;
};

export default function MonitoringPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const monitoringId = params.id as string;
  const monitoringType = monitoringTypes[monitoringId];

  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [selectedSekolah, setSelectedSekolah] = useState<Set<string | number>>(new Set());
  const [selectedInstrumen, setSelectedInstrumen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const instrumenList = useMemo(() => getInstrumenMonitoring(monitoringId), [monitoringId]);

  useEffect(() => {
    if (!monitoringType) {
      setError("Jenis monitoring tidak ditemukan");
      setIsLoading(false);
      return;
    }
    loadSekolahBinaan();
  }, [monitoringId]);

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

  const filteredSekolah = useMemo(() => {
    if (!searchQuery.trim()) return sekolahList;
    const query = searchQuery.toLowerCase();
    return sekolahList.filter(
      (sekolah) =>
        sekolah.nama.toLowerCase().includes(query) ||
        sekolah.npsn.toLowerCase().includes(query) ||
        sekolah.kabupaten.toLowerCase().includes(query)
    );
  }, [sekolahList, searchQuery]);

  const handleContinue = () => {
    if (selectedSekolah.size === 0) {
      toast({
        title: "Peringatan",
        description: "Silakan pilih minimal satu sekolah binaan",
        variant: "error",
      });
      return;
    }

    if (!selectedInstrumen) {
      toast({
        title: "Peringatan",
        description: "Silakan pilih instrumen monitoring",
        variant: "error",
      });
      return;
    }

    // Store selected data and navigate to detail page
    const selectedIds = Array.from(selectedSekolah);
    sessionStorage.setItem(
      `monitoring_${monitoringId}_selected_sekolah`,
      JSON.stringify(selectedIds)
    );
    sessionStorage.setItem(
      `monitoring_${monitoringId}_selected_instrumen`,
      selectedInstrumen
    );

    // Navigate to detail page
    router.push(`/pengawas/pelaksanaan/monitoring/${monitoringId}/${selectedInstrumen}?sekolah=${selectedIds[0]}`);
  };

  if (!monitoringType) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="size-12 text-red-500" />
        <p className="text-lg font-semibold text-slate-900">Jenis monitoring tidak ditemukan</p>
        <Button onClick={() => router.push("/pengawas/pelaksanaan")} variant="outline">
          <ArrowLeft className="size-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  const MonitoringIcon = monitoringType.icon;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        {/* Tombol Kembali - di atas untuk mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/pengawas/pelaksanaan")}
          className="self-start text-slate-600 hover:text-slate-900 sm:hidden"
        >
          <ArrowLeft className="size-4 mr-2" />
          Kembali
        </Button>

        {/* Header Content */}
        <div className="flex items-start gap-3 sm:items-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-green-200 bg-green-50">
            <MonitoringIcon className="size-5 text-green-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/pengawas/pelaksanaan")}
                className="hidden text-slate-600 hover:text-slate-900 sm:flex"
              >
                <ArrowLeft className="size-4 mr-2" />
                Kembali
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{monitoringType.title}</h1>
                <p className="mt-1 text-sm text-slate-600">Pilih sekolah binaan dan instrumen monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Card className="border border-indigo-200 bg-white shadow-md">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-indigo-600" />
            <p className="ml-3 text-sm text-slate-600">Memuat data sekolah binaan...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border border-red-200 bg-white shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle className="size-12 text-red-500" />
            <p className="text-sm font-semibold text-slate-900">{error}</p>
            <Button onClick={loadSekolahBinaan} variant="outline">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pilih Sekolah Binaan */}
          <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
                <School className="size-5 text-indigo-600" />
                Pilih Sekolah Binaan
              </CardTitle>
              <CardDescription className="text-slate-700">
                Pilih satu atau lebih sekolah binaan yang akan dimonitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari sekolah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Selected count */}
              {selectedSekolah.size > 0 && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-sm font-semibold text-green-800">
                    {selectedSekolah.size} sekolah dipilih
                  </p>
                </div>
              )}

              {/* School list */}
              <div className="max-h-[400px] space-y-2 overflow-y-auto">
                {filteredSekolah.length === 0 ? (
                  <div className="py-8 text-center">
                    <School className="mx-auto size-12 text-slate-300" />
                    <p className="mt-2 text-sm text-slate-600">
                      {searchQuery ? "Sekolah tidak ditemukan" : "Tidak ada sekolah binaan"}
                    </p>
                  </div>
                ) : (
                  filteredSekolah.map((sekolah) => {
                    const isSelected = selectedSekolah.has(sekolah.id);
                    return (
                      <button
                        key={sekolah.id}
                        onClick={() => toggleSekolah(sekolah.id)}
                        className={cn(
                          "w-full rounded-lg border p-3 text-left transition hover:shadow-sm",
                          isSelected
                            ? "border-green-500 bg-green-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-0.5 flex size-5 items-center justify-center rounded border",
                              isSelected
                                ? "border-green-500 bg-green-500"
                                : "border-slate-300 bg-white"
                            )}
                          >
                            {isSelected && (
                              <CheckCircle2 className="size-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900">
                              {sekolah.nama}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                              <span>NPSN: {sekolah.npsn}</span>
                              <span>•</span>
                              <span>{sekolah.jenjang}</span>
                              <span>•</span>
                              <span>{sekolah.kabupaten}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pilih Instrumen Monitoring */}
          <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
                <FileText className="size-5 text-indigo-600" />
                Pilih Instrumen Monitoring
              </CardTitle>
              <CardDescription className="text-slate-700">
                Pilih instrumen monitoring yang akan digunakan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {instrumenList.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="mx-auto size-12 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-600">
                    Belum ada instrumen monitoring tersedia
                  </p>
                </div>
              ) : (
                instrumenList.map((instrumen) => {
                  const isSelected = selectedInstrumen === instrumen.id;
                  return (
                    <button
                      key={instrumen.id}
                      onClick={() => setSelectedInstrumen(instrumen.id)}
                      className={cn(
                        "w-full rounded-lg border p-4 text-left transition hover:shadow-sm",
                        isSelected
                          ? "border-green-500 bg-green-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "mt-0.5 flex size-5 items-center justify-center rounded-full border-2",
                            isSelected
                              ? "border-green-500 bg-green-500"
                              : "border-slate-300 bg-white"
                          )}
                        >
                          {isSelected && (
                            <div className="size-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {instrumen.nama}
                          </h3>
                          <p className="mt-1 text-xs text-slate-600">
                            {instrumen.deskripsi}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push("/pengawas/pelaksanaan")}
        >
          Batal
        </Button>
        <Button
          onClick={handleContinue}
          disabled={selectedSekolah.size === 0 || !selectedInstrumen}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Lanjutkan
        </Button>
      </div>
    </div>
  );
}

