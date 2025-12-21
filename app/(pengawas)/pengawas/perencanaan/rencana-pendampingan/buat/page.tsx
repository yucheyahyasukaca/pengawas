"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, Calendar, School, ChevronDown, Check, Plus, X, Save, AlertTriangle, BookOpen, Loader2, FileText, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Types
interface Sekolah {
  id: string;
  nama_sekolah: string;
  npsn: string;
  status: string;
  jenjang: string;
  kabupaten_kota: string;
}

// Constants
const INDIKATOR_UTAMA = [
  { code: "A.1", label: "Kemampuan Literasi" },
  { code: "A.2", label: "Kemampuan Numerasi" },
  { code: "A.3", label: "Karakter" },
  { code: "C.3", label: "Pengalaman Pelatihan PTK" },
  { code: "D.1", label: "Kualitas Pembelajaran" },
  { code: "D.2", label: "Refleksi dan perbaikan pembelajaran oleh guru" },
  { code: "D.3", label: "Kepemimpinan instruksional" },
  { code: "D.4", label: "Iklim keamanan satuan pendidikan" },
  { code: "D.6", label: "Iklim Kesetaraan Gender" },
  { code: "D.8", label: "Iklim Kebinekaan" },
  { code: "D.10", label: "Iklim Inklusivitas" },
  { code: "E.1", label: "Partisipasi warga satuan pendidikan" },
  { code: "E.2", label: "Proporsi pemanfaatan sumber daya sekolah untuk peningkatan mutu" },
  { code: "E.3", label: "Pemanfaatan TIK untuk pengelolaan anggaran" },
  { code: "E.5", label: "Program dan kebijakan satuan pendidikan" },
];

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function BuatRencanaPage() {
  const router = useRouter();
  const { toast } = useToast();

  // State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sekolahBinaanList, setSekolahBinaanList] = useState<Sekolah[]>([]);
  const [isSekolahDropdownOpen, setIsSekolahDropdownOpen] = useState(false);
  const [isIndikatorDropdownOpen, setIsIndikatorDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formSekolahId, setFormSekolahId] = useState("");
  // const [formIndikatorUtama, setFormIndikatorUtama] = useState(""); // Deprecated
  const [selectedIndikators, setSelectedIndikators] = useState<string[]>([]);
  const [formAkarMasalah, setFormAkarMasalah] = useState("");
  const [formKegiatanBenahi, setFormKegiatanBenahi] = useState("");
  const [formPenjelasanImplementasi, setFormPenjelasanImplementasi] = useState<string[]>([""]);
  const [formApakahKegiatan, setFormApakahKegiatan] = useState(true);

  // Rapor Pendidikan State
  const [raporData, setRaporData] = useState<any[]>([]);
  const [isLoadingRapor, setIsLoadingRapor] = useState(false);
  const [isRaporDialogOpen, setIsRaporDialogOpen] = useState(false);
  const [raporError, setRaporError] = useState<string | null>(null);
  const [tempSelectedIndikators, setTempSelectedIndikators] = useState<string[]>([]);

  // Program Info State
  const [activeProgramInfo, setActiveProgramInfo] = useState<any>(null);
  const [isLoadingProgramInfo, setIsLoadingProgramInfo] = useState(false);

  // Load Sekolah Binaan
  useEffect(() => {
    const loadSekolahBinaan = async () => {
      try {
        const userResponse = await fetch("/api/auth/get-current-user");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.user?.metadata?.sekolah_binaan) {
            const sekolahBinaanNames = userData.user.metadata.sekolah_binaan;

            const sekolahResponse = await fetch("/api/sekolah/list");
            if (sekolahResponse.ok) {
              const sekolahData = await sekolahResponse.json();
              if (sekolahData.success && sekolahData.sekolah) {
                const filteredSekolah = sekolahData.sekolah.filter((sekolah: Sekolah) =>
                  sekolahBinaanNames.includes(sekolah.nama_sekolah)
                );
                setSekolahBinaanList(filteredSekolah);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading sekolah binaan:", error);
      }
    };
    loadSekolahBinaan();
  }, []);

  // Fetch active program info when school changes
  useEffect(() => {
    async function fetchProgramInfo() {
      if (!formSekolahId) {
        setActiveProgramInfo(null);
        return;
      }

      setIsLoadingProgramInfo(true);
      try {
        const res = await fetch(`/api/pengawas/rencana-program/check-sekolah?sekolah_id=${formSekolahId}`);
        if (res.ok) {
          const data = await res.json();
          setActiveProgramInfo(data);
        } else {
          setActiveProgramInfo(null);
        }
      } catch (err) {
        console.error("Failed to fetch program info", err);
        setActiveProgramInfo(null);
      } finally {
        setIsLoadingProgramInfo(false);
      }
    }

    fetchProgramInfo();
  }, [formSekolahId]);

  // Fetch Rapor Pendidikan when Sekolah is selected
  useEffect(() => {
    const fetchSekolahDetail = async () => {
      if (!formSekolahId) {
        setRaporData([]);
        setSelectedIndikators([]);
        setRaporError(null);
        return;
      }

      setIsLoadingRapor(true);
      setRaporError(null);

      try {
        const response = await fetch(`/api/pengawas/sekolah/${formSekolahId}`);
        const result = await response.json();

        if (response.ok && result.success) {
          const rawData = result.data.rapor_pendidikan;
          let raporList: any[] = []; // Explicitly type as array

          // Handle { detail: [...] } structure
          if (rawData && typeof rawData === 'object' && !Array.isArray(rawData) && rawData.detail && Array.isArray(rawData.detail)) {
            raporList = rawData.detail;
          }
          // Handle direct array structure (legacy or fallback)
          else if (Array.isArray(rawData)) {
            raporList = rawData;
          }
          // Handle potential JSON string (rare but possible)
          else if (typeof rawData === 'string') {
            try {
              const parsed = JSON.parse(rawData);
              if (parsed.detail && Array.isArray(parsed.detail)) {
                raporList = parsed.detail;
              } else if (Array.isArray(parsed)) {
                raporList = parsed;
              }
            } catch (e) {
              console.error("Failed to parse rapor_pendidikan string:", e);
              raporList = [];
            }
          }

          setRaporData(raporList);

          if (raporList.length === 0) {
            setRaporError("Sekolah ini belum mengisi data Rapor Pendidikan.");
          }
        } else {
          setRaporError(result.error || "Gagal memuat data rapor pendidikan.");
        }
      } catch (error) {
        console.error("Error fetching sekolah detail:", error);
        setRaporError("Terjadi kesalahan saat memuat data sekolah.");
      } finally {
        setIsLoadingRapor(false);
        // Reset selection when school changes
        setSelectedIndikators([]);
      }
    };

    fetchSekolahDetail();
  }, [formSekolahId]);

  // Wizard State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 3;

  // Handlers
  const handleNextStep = () => {
    // Validation per step
    if (currentStep === 1) {
      if (!formSekolahId) {
        toast({ title: "Error", description: "Pilih sekolah binaan terlebih dahulu", variant: "error" });
        return;
      }
      if (raporData.length > 0 && selectedIndikators.length === 0) {
        toast({ title: "Error", description: "Pilih minimal satu indikator dari Rapor Pendidikan", variant: "error" });
        return;
      }
      // Strict rule: fail if rapor empty
      if (raporData.length === 0) {
        toast({ title: "Error", description: "Sekolah ini belum mengisi Rapor Pendidikan", variant: "error" });
        return;
      }
    }

    if (currentStep === 2) {
      if (!formAkarMasalah.trim()) {
        toast({ title: "Error", description: "Isi akar masalah terlebih dahulu", variant: "error" });
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.back();
    }
  };

  const handleAddPenjelasanImplementasi = () => {
    setFormPenjelasanImplementasi([...formPenjelasanImplementasi, ""]);
  };

  const handlePenjelasanImplementasiChange = (index: number, value: string) => {
    const updated = [...formPenjelasanImplementasi];
    updated[index] = value;
    setFormPenjelasanImplementasi(updated);
  };

  const handleRemovePenjelasanImplementasi = (index: number) => {
    if (formPenjelasanImplementasi.length > 1) {
      setFormPenjelasanImplementasi(
        formPenjelasanImplementasi.filter((_, i) => i !== index)
      );
    }
  };

  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const openRaporDialog = () => {
    // Sync temp selection with actual selection when opening dialog
    setTempSelectedIndikators([...selectedIndikators]);
    setIsRaporDialogOpen(true);
  };

  const toggleIndikatorSelection = (indikator: string) => {
    if (tempSelectedIndikators.includes(indikator)) {
      setTempSelectedIndikators(tempSelectedIndikators.filter(i => i !== indikator));
    } else {
      setTempSelectedIndikators([...tempSelectedIndikators, indikator]);
    }
  };

  const saveIndikatorSelection = () => {
    setSelectedIndikators(tempSelectedIndikators);
    setIsRaporDialogOpen(false);
  };

  const handleSave = async () => {
    // Final Validation on Step 3
    if (!formKegiatanBenahi.trim()) {
      toast({ title: "Error", description: "Isi kegiatan benahi terlebih dahulu", variant: "error" });
      return;
    }

    // Filter empty explanation
    const penjelasanFiltered = formPenjelasanImplementasi.filter(p => p.trim() !== "");
    if (penjelasanFiltered.length === 0) {
      toast({ title: "Error", description: "Isi minimal satu penjelasan implementasi", variant: "error" });
      return;
    }

    setIsSaving(true);

    try {
      const dateStr = formatDateLocal(selectedDate);

      const response = await fetch("/api/pengawas/rencana-pendampingan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tanggal: dateStr,
          sekolah_id: formSekolahId,
          indikator_utama: selectedIndikators.join(", "), // Join array to string for backend compatibility
          akar_masalah: formAkarMasalah,
          kegiatan_benahi: formKegiatanBenahi,
          penjelasan_implementasi: penjelasanFiltered,
          apakah_kegiatan: formApakahKegiatan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan rencana pendampingan");
      }

      toast({
        title: "Berhasil",
        description: "Rencana pendampingan berhasil disimpan",
      });

      router.push("/pengawas/perencanaan/rencana-pendampingan");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menyimpan rencana pendampingan",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (currentStep > 1) handlePrevStep();
            else router.back();
          }}
          className="rounded-full border-slate-200"
        >
          <ChevronLeft className="size-5 text-slate-700" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Buat Rencana Pendampingan</h1>
          <p className="text-sm text-slate-600">Langkah {currentStep} dari {totalSteps}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step 1 Content: Identifikasi */}
      {currentStep === 1 && (
        <>
          <Card className="bg-white border-indigo-100 shadow-lg shadow-indigo-100/50 overflow-visible pt-0">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-50 rounded-t-xl py-6">
              <CardTitle className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-indigo-100">
                  <Calendar className="size-5 text-indigo-600" />
                </div>
                Tanggal Pelaksanaan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {/* Tanggal */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Tanggal</label>
                  <div className="relative">
                    <select
                      value={selectedDate.getDate()}
                      onChange={(e) => {
                        const newDay = parseInt(e.target.value);
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDay);
                        setSelectedDate(newDate);
                      }}
                      className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300 transition-all"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Bulan */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Bulan</label>
                  <div className="relative">
                    <select
                      value={selectedDate.getMonth()}
                      onChange={(e) => {
                        const newMonth = parseInt(e.target.value);
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newMonth);
                        setSelectedDate(newDate);
                      }}
                      className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300 transition-all"
                    >
                      {monthNames.map((m, i) => (
                        <option key={i} value={i}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tahun */}
                <div className="col-span-3 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Tahun</label>
                  <div className="relative">
                    <select
                      value={selectedDate.getFullYear()}
                      onChange={(e) => {
                        const newYear = parseInt(e.target.value);
                        const newDate = new Date(selectedDate);
                        newDate.setFullYear(newYear);
                        setSelectedDate(newDate);
                      }}
                      className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300 transition-all"
                    >
                      {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 1 + i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-indigo-100 shadow-lg shadow-indigo-100/50 overflow-visible">
            <CardContent className="pt-6 space-y-6">
              {/* Pilih Sekolah Binaan */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <School className="size-4 text-indigo-600" />
                  Pilih Sekolah Binaan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSekolahDropdownOpen(!isSekolahDropdownOpen);
                      setIsIndikatorDropdownOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-4 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 font-medium shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300"
                  >
                    <span className={formSekolahId ? "" : "text-slate-400"}>
                      {formSekolahId
                        ? sekolahBinaanList.find((s) => s.id === formSekolahId)?.nama_sekolah
                        : "Pilih Sekolah Binaan"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-5 text-slate-400 transition-transform",
                        isSekolahDropdownOpen && "rotate-180 text-indigo-600"
                      )}
                    />
                  </button>
                  {isSekolahDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsSekolahDropdownOpen(false)} />
                      <div className="absolute z-20 mt-2 w-full rounded-2xl border border-indigo-100 bg-white p-2 shadow-xl shadow-indigo-100/50 max-h-60 overflow-y-auto">
                        {sekolahBinaanList.map((sekolah) => (
                          <button
                            key={sekolah.id}
                            type="button"
                            onClick={() => {
                              setFormSekolahId(sekolah.id);
                              setIsSekolahDropdownOpen(false);
                            }}
                            className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-3 text-sm font-bold transition hover:bg-indigo-50 text-left"
                          >
                            <span className={formSekolahId === sekolah.id ? "text-indigo-700" : "text-slate-700"}>
                              {sekolah.nama_sekolah}
                            </span>
                            {formSekolahId === sekolah.id && <Check className="size-4 text-indigo-600" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Program Info Display */}
              {formSekolahId && (
                <div className="space-y-2">
                  {isLoadingProgramInfo ? (
                    <div className="flex items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <Loader2 className="size-5 text-slate-400 animate-spin mr-2" />
                      <span className="text-sm text-slate-500">Memuat informasi program...</span>
                    </div>
                  ) : activeProgramInfo?.found ? (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-pink-500 text-white">
                          <FileText className="size-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900 mb-1">Rencana Program Kepengawasan</h4>
                          <p className="text-xs text-slate-600">Informasi dari rencana program yang sudah dibuat</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/60">
                          <span className="text-xs font-semibold text-slate-500 uppercase">Prioritas:</span>
                          <span className="text-sm font-bold text-pink-700">{activeProgramInfo.priority}</span>
                        </div>

                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/60">
                          <span className="text-xs font-semibold text-slate-500 uppercase">Strategi:</span>
                          <span className="text-sm font-bold text-slate-800">{activeProgramInfo.strategyName}</span>
                        </div>

                        {activeProgramInfo.methods && activeProgramInfo.methods.length > 0 && (
                          <div className="p-2 rounded-lg bg-white/60">
                            <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Metode:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {activeProgramInfo.methods.map((method: string, idx: number) => (
                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-semibold">
                                  {method}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-amber-900 mb-1">Belum Ada Rencana Program</h4>
                          <p className="text-xs text-amber-700 mb-2">
                            Sekolah ini belum memiliki Rencana Program Kepengawasan. Silakan buat terlebih dahulu.
                          </p>
                          <Link
                            href="/pengawas/perencanaan/rencana-program/pilih-sekolah"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                          >
                            <Plus className="size-3.5" />
                            Buat Rencana Program
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Identifikasi - Indikator Utama */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">
                  Identifikasi (Indikator Utama) <span className="text-red-500">*</span>
                </label>

                {/* Alert if Rapor Data is Empty or Error */}
                {formSekolahId && (raporError || (raporData.length === 0 && !isLoadingRapor)) && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                    <div className="flex items-start">
                      <AlertTriangle className="size-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-bold text-red-800">
                          {raporError || "Data Rapor Pendidikan Kosong"}
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          Sekolah ini belum mengisi data Rapor Pendidikan. Rencana pendampingan tidak dapat dibuat sebelum sekolah melengkapi data tersebut.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {selectedIndikators.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedIndikators.map((indikator, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                          <BookOpen className="size-3.5" />
                          <span>{indikator}</span>
                          <button
                            onClick={() => setSelectedIndikators(selectedIndikators.filter(i => i !== indikator))}
                            className="text-indigo-400 hover:text-indigo-600 transition-colors"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={openRaporDialog}
                    disabled={!formSekolahId || isLoadingRapor || !!raporError || raporData.length === 0}
                    className={cn(
                      "w-full justify-between h-auto py-3 px-4 border-2 rounded-xl text-left font-medium transition-all",
                      "disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:opacity-100 disabled:hover:bg-slate-50 disabled:cursor-not-allowed",
                      !formSekolahId || !!raporError || raporData.length === 0
                        ? ""
                        : "bg-white border-indigo-200 text-indigo-700 hover:bg-slate-50 hover:border-indigo-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {isLoadingRapor ? (
                        <Loader2 className="size-5 animate-spin text-indigo-500" />
                      ) : (
                        <BookOpen className="size-5" />
                      )}
                      <span>
                        {isLoadingRapor
                          ? "Memuat data rapor..."
                          : selectedIndikators.length > 0
                            ? "Pilih Indikator Lainnya"
                            : "Lihat Rapor Pendidikan & Pilih Indikator"}
                      </span>
                    </div>
                    <ChevronDown className="size-5 opacity-50" />
                  </Button>
                  {!formSekolahId && (
                    <p className="text-xs text-slate-500 italic">
                      *Pilih sekolah terlebih dahulu untuk memuat data rapor
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step 2 Content: Refleksi - Akar Masalah */}
      {currentStep === 2 && (
        <Card className="bg-white border-indigo-100 shadow-lg shadow-indigo-100/50 overflow-visible pt-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-50 rounded-t-xl py-6">
            <CardTitle className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-indigo-100">
                <AlertTriangle className="size-5 text-indigo-600" />
              </div>
              Refleksi Akar Masalah
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Akar Masalah */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900">
                Akar Masalah <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formAkarMasalah}
                onChange={(e) => setFormAkarMasalah(e.target.value)}
                placeholder="Deskripsikan akar masalah yang ditemukan..."
                rows={6}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm sm:text-base text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 resize-none"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 Content: Benahi - Implementasi */}
      {currentStep === 3 && (
        <Card className="bg-white border-indigo-100 shadow-lg shadow-indigo-100/50 overflow-visible pt-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-50 rounded-t-xl py-6">
            <CardTitle className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-indigo-100">
                <Check className="size-5 text-indigo-600" />
              </div>
              Kegiatan Benahi
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Kegiatan Benahi */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">
                Kegiatan Benahi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formKegiatanBenahi}
                onChange={(e) => setFormKegiatanBenahi(e.target.value)}
                placeholder="Contoh: Peningkatan kompetensi guru dalam hal literasi melalui PMM"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm sm:text-base text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300"
              />
            </div>

            {/* Penjelasan Implementasi Kegiatan */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">
                Penjelasan Implementasi Kegiatan <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {formPenjelasanImplementasi.map((penjelasan, index) => (
                  <div key={index} className="flex gap-3">
                    <textarea
                      value={penjelasan}
                      onChange={(e) => handlePenjelasanImplementasiChange(index, e.target.value)}
                      placeholder="Contoh: Diskusi mingguan guru terkait modul literasi di PMM"
                      rows={3}
                      className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm sm:text-base text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300 resize-none"
                    />
                    {formPenjelasanImplementasi.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemovePenjelasanImplementasi(index)}
                        className="rounded-xl border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 h-full w-12 flex-shrink-0 transition-colors"
                      >
                        <X className="size-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleAddPenjelasanImplementasi}
                className="rounded-xl mt-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-sm py-2 px-4 transition-colors"
              >
                <Plus className="size-4 mr-2" />
                Tambah Penjelasan Implementasi
              </Button>
            </div>

            {/* Apakah Kegiatan (Toggle like) */}
            <div className="pt-2">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-sm font-bold text-slate-900">
                  Apakah Kegiatan?
                </label>
                <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFormApakahKegiatan(true)}
                    className={cn(
                      "px-4 py-2 text-sm font-bold rounded-md transition-all",
                      formApakahKegiatan ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Ya
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormApakahKegiatan(false)}
                    className={cn(
                      "px-4 py-2 text-sm font-bold rounded-md transition-all",
                      !formApakahKegiatan ? "bg-slate-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Tidak
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Bar for Mobile or Sticky Footer */}
      <div className="sticky bottom-4 z-10 mx-4 sm:mx-0">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-indigo-100 shadow-2xl shadow-indigo-200/50 flex items-center justify-between gap-3">
          <div className="pl-4 text-xs font-medium text-slate-500 hidden sm:block">
            {currentStep === 1
              ? "Pastikan data sekolah benar"
              : currentStep === 2
                ? "Isi refleksi akar masalah"
                : "Tinjau kembali sebelum menyimpan"}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={handlePrevStep}
              className="flex-1 sm:flex-none rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
            >
              {currentStep === 1 ? "Batal" : "Kembali"}
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNextStep}
                disabled={isSaving}
                className="flex-1 sm:flex-none rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 shadow-lg shadow-indigo-500/20"
              >
                Lanjut
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 shadow-lg shadow-indigo-500/20 disabled:bg-slate-300 disabled:shadow-none"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="size-4 mr-2" />
                    Simpan Rencana
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Rapor Pendidikan Dialog */}
      <Dialog open={isRaporDialogOpen} onOpenChange={setIsRaporDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Pilih Indikator Rapor Pendidikan</DialogTitle>
            <DialogDescription className="text-slate-600">
              Pilih satu atau lebih indikator masalah yang ingin ditangani berdasarkan Rapor Pendidikan sekolah.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            {raporData.map((item, index) => {
              // Assuming item has format { indikator: string, nilai?: string/number, ... }
              // Adjust based on exact DB schema. 
              // For now, handling generic object or text.
              const label = item.indikator || item.uraian || item.label || (typeof item === 'string' ? item : JSON.stringify(item));
              const nilai = item.nilai || item.skor || item.capaian || "";
              const isSelected = tempSelectedIndikators.includes(label);

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:border-indigo-300",
                    isSelected ? "bg-indigo-50 border-indigo-500" : "bg-white border-slate-200"
                  )}
                  onClick={() => toggleIndikatorSelection(label)}
                >
                  <div className={cn(
                    "size-5 rounded border flex items-center justify-center mt-0.5 flex-shrink-0",
                    isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                  )}>
                    {isSelected && <Check className="size-3.5" />}
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", isSelected ? "text-indigo-900" : "text-slate-900")}>
                      {label}
                    </p>
                    {nilai && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        Capaian: {nilai}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {raporData.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p>Tidak ada data rapor pendidikan tersedia.</p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsRaporDialogOpen(false)} className="text-slate-700 font-bold hover:bg-slate-100">
              Batal
            </Button>
            <Button onClick={saveIndikatorSelection} disabled={tempSelectedIndikators.length === 0} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Simpan Pilihan ({tempSelectedIndikators.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
