"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import imageCompression from "browser-image-compression";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, Plus, X, School, ChevronDown, Check, FileText, Clock, Edit, Trash2, Upload, ImageIcon, Loader2, Eye, AlertCircle } from "lucide-react";

// ... (existing imports and constants)

interface RencanaPendampingan {
  id: string;
  tanggal: Date;
  sekolah_id: string;
  sekolah_nama: string;
  indikator_utama: string;
  akar_masalah: string;
  kegiatan_benahi: string;
  penjelasan_implementasi: string[];
  apakah_kegiatan: boolean;
  dokumentasi: string[];
}



import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Data hari libur dan perayaan
const HOLIDAYS: Record<string, { summary: string[]; holiday: boolean; description: string[] }> = {
  "2025-01-01": { summary: ["Hari Tahun Baru"], holiday: true, description: ["Hari libur nasional"] },
  "2025-01-27": { summary: ["Isra Mikraj Nabi Muhammad"], holiday: true, description: ["Hari libur nasional"] },
  "2025-01-28": { summary: ["Cuti Bersama Tahun Baru Imlek"], holiday: true, description: ["Hari libur nasional"] },
  "2025-01-29": { summary: ["Tahun Baru Imlek"], holiday: true, description: ["Hari libur nasional"] },
  "2025-03-01": { summary: ["1 Ramadan"], holiday: false, description: ["Perayaan"] },
  "2025-03-28": { summary: ["Cuti Bersama Hari Suci Nyepi (Tahun Baru Saka)"], holiday: true, description: ["Hari libur nasional"] },
  "2025-03-29": { summary: ["Hari Suci Nyepi (Tahun Baru Saka)"], holiday: true, description: ["Hari libur nasional"] },
  "2025-03-31": { summary: ["Hari Idul Fitri"], holiday: true, description: ["Hari libur nasional"] },
  "2025-04-01": { summary: ["Hari Idul Fitri"], holiday: true, description: ["Hari libur nasional"] },
  "2025-04-02": { summary: ["Cuti Bersama Idul Fitri"], holiday: true, description: ["Hari libur nasional"] },
  "2025-04-03": { summary: ["Cuti Bersama Idul Fitri"], holiday: true, description: ["Hari libur nasional"] },
  "2025-04-04": { summary: ["Cuti Bersama Idul Fitri"], holiday: true, description: ["Hari libur nasional"] },
  "2025-04-07": { summary: ["Cuti Bersama Idul Fitri"], holiday: true, description: ["Hari libur nasional"] },
  "2025-04-18": { summary: ["Wafat Isa Almasih"], holiday: true, description: ["Hari libur nasional"] },
  "2025-04-20": { summary: ["Hari Paskah"], holiday: true, description: ["Hari libur nasional"] },
  "2025-05-01": { summary: ["Hari Buruh Internasional / Pekerja"], holiday: true, description: ["Hari libur nasional"] },
  "2025-05-12": { summary: ["Hari Raya Waisak"], holiday: true, description: ["Hari libur nasional"] },
  "2025-05-13": { summary: ["Cuti Bersama Waisak"], holiday: true, description: ["Hari libur nasional"] },
  "2025-05-29": { summary: ["Kenaikan Isa Al Masih"], holiday: true, description: ["Hari libur nasional"] },
  "2025-05-30": { summary: ["Cuti Bersama Kenaikan Isa Al Masih"], holiday: true, description: ["Hari libur nasional"] },
  "2025-06-01": { summary: ["Hari Lahir Pancasila"], holiday: true, description: ["Hari libur nasional"] },
  "2025-06-06": { summary: ["Idul Adha (Lebaran Haji)"], holiday: true, description: ["Hari libur nasional"] },
  "2025-06-09": { summary: ["Idul Adha (Lebaran Haji)"], holiday: true, description: ["Hari libur nasional"] },
  "2025-06-27": { summary: ["Satu Muharam / Tahun Baru Hijriah"], holiday: true, description: ["Hari libur nasional"] },
  "2025-08-17": { summary: ["Hari Proklamasi Kemerdekaan R.I."], holiday: true, description: ["Hari libur nasional"] },
  "2025-08-18": { summary: ["Hari Proklamasi Kemerdekaan R.I. observed"], holiday: true, description: ["Hari libur nasional"] },
  "2025-09-05": { summary: ["Maulid Nabi Muhammad"], holiday: true, description: ["Hari libur nasional"] },
  "2025-10-21": { summary: ["Diwali"], holiday: false, description: ["Perayaan"] },
  "2025-12-24": { summary: ["Malam Natal"], holiday: false, description: ["Perayaan"] },
  "2025-12-25": { summary: ["Hari Raya Natal"], holiday: true, description: ["Hari libur nasional"] },
  "2025-12-26": { summary: ["Cuti Bersama Natal (Hari Tinju)"], holiday: true, description: ["Hari libur nasional"] },
  "2025-12-31": { summary: ["Malam Tahun Baru"], holiday: false, description: ["Perayaan"] },
  "2026-01-01": { summary: ["Hari Tahun Baru"], holiday: true, description: ["Hari libur nasional"] },
  "2026-01-16": { summary: ["Isra Mikraj Nabi Muhammad (belum pasti)"], holiday: true, description: ["Hari libur nasional"] },
  "2026-02-16": { summary: ["Cuti Bersama Tahun Baru Imlek"], holiday: true, description: ["Hari libur nasional"] },
  "2026-02-17": { summary: ["Tahun Baru Imlek"], holiday: true, description: ["Hari libur nasional"] },
  "2026-02-20": { summary: ["1 Ramadan (belum pasti)"], holiday: false, description: ["Perayaan"] },
  "2026-03-18": { summary: ["Cuti Bersama Hari Suci Nyepi (Tahun Baru Saka)"], holiday: true, description: ["Hari libur nasional"] },
  "2026-03-19": { summary: ["Hari Suci Nyepi (Tahun Baru Saka)"], holiday: true, description: ["Hari libur nasional"] },
  "2026-03-20": { summary: ["Cuti Bersama Idul Fitri"], holiday: true, description: ["Hari libur nasional"] },
  "2026-03-21": { summary: ["Hari Idul Fitri (belum pasti)"], holiday: true, description: ["Hari libur nasional"] },
  "2026-03-22": { summary: ["Hari Idul Fitri (belum pasti)"], holiday: true, description: ["Hari libur nasional"] },
  "2026-03-23": { summary: ["Cuti Bersama Idul Fitri"], holiday: true, description: ["Hari libur nasional"] },
  "2026-03-24": { summary: ["Cuti Bersama Idul Fitri"], holiday: true, description: ["Hari libur nasional"] },
  "2026-04-03": { summary: ["Wafat Isa Almasih"], holiday: true, description: ["Hari libur nasional"] },
  "2026-04-05": { summary: ["Hari Paskah"], holiday: true, description: ["Hari libur nasional"] },
  "2026-05-01": { summary: ["Hari Buruh Internasional / Pekerja"], holiday: true, description: ["Hari libur nasional"] },
  "2026-05-14": { summary: ["Kenaikan Isa Al Masih"], holiday: true, description: ["Hari libur nasional"] },
  "2026-05-15": { summary: ["Cuti Bersama Kenaikan Isa Al Masih"], holiday: true, description: ["Hari libur nasional"] },
  "2026-05-27": { summary: ["Idul Adha (Lebaran Haji) (belum pasti)"], holiday: true, description: ["Hari libur nasional"] },
  "2026-05-28": { summary: ["Idul Adha (Lebaran Haji)"], holiday: true, description: ["Hari libur nasional"] },
  "2026-05-31": { summary: ["Hari Raya Waisak (belum pasti)"], holiday: true, description: ["Hari libur nasional"] },
  "2026-06-01": { summary: ["Hari Lahir Pancasila"], holiday: true, description: ["Hari libur nasional"] },
  "2026-06-16": { summary: ["Satu Muharam / Tahun Baru Hijriah (belum pasti)"], holiday: true, description: ["Hari libur nasional"] },
  "2026-08-17": { summary: ["Hari Proklamasi Kemerdekaan R.I."], holiday: true, description: ["Hari libur nasional"] },
  "2026-08-25": { summary: ["Maulid Nabi Muhammad (belum pasti)"], holiday: true, description: ["Hari libur nasional"] },
  "2026-12-24": { summary: ["Cuti Bersama Natal (Malam Natal)"], holiday: true, description: ["Hari libur nasional"] },
  "2026-12-25": { summary: ["Hari Raya Natal"], holiday: true, description: ["Hari libur nasional"] },
  "2026-12-31": { summary: ["Malam Tahun Baru"], holiday: false, description: ["Perayaan"] },
};

// Indikator Utama options
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

interface Sekolah {
  id: string;
  nama_sekolah: string;
  npsn: string;
  status: string;
  jenjang: string;
  kabupaten_kota: string;
}



export default function RencanaPendampinganPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<{ summary: string[]; holiday: boolean; description: string[] } | null>(null);
  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [sekolahBinaanList, setSekolahBinaanList] = useState<Sekolah[]>([]);
  const [rencanaList, setRencanaList] = useState<RencanaPendampingan[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRencana, setSelectedRencana] = useState<RencanaPendampingan | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRencana, setEditingRencana] = useState<RencanaPendampingan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
  const [rencanaToDelete, setRencanaToDelete] = useState<RencanaPendampingan | null>(null);
  const [isManualCreate, setIsManualCreate] = useState(false);
  const [isGuidanceDialogOpen, setIsGuidanceDialogOpen] = useState(false);

  // Dropdown states
  const [isSekolahDropdownOpen, setIsSekolahDropdownOpen] = useState(false);
  const [isIndikatorDropdownOpen, setIsIndikatorDropdownOpen] = useState(false);

  // Form state
  const [formSekolahId, setFormSekolahId] = useState("");
  const [formIndikatorUtama, setFormIndikatorUtama] = useState("");
  const [formAkarMasalah, setFormAkarMasalah] = useState("");
  const [formKegiatanBenahi, setFormKegiatanBenahi] = useState("");
  const [formPenjelasanImplementasi, setFormPenjelasanImplementasi] = useState<string[]>([""]);
  const [formApakahKegiatan, setFormApakahKegiatan] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [formDokumentasi, setFormDokumentasi] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [viewImage, setViewImage] = useState<string | null>(null);

  // Program Info State
  const [activeProgramInfo, setActiveProgramInfo] = useState<any>(null);
  const [isLoadingProgramInfo, setIsLoadingProgramInfo] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Load sekolah binaan for current pengawas
  useEffect(() => {
    const loadSekolahBinaan = async () => {
      try {
        // Get current user data
        const userResponse = await fetch("/api/auth/get-current-user");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.user?.metadata?.sekolah_binaan) {
            const sekolahBinaanNames = userData.user.metadata.sekolah_binaan;

            // Get all sekolah list
            const sekolahResponse = await fetch("/api/sekolah/list");
            if (sekolahResponse.ok) {
              const sekolahData = await sekolahResponse.json();
              if (sekolahData.success && sekolahData.sekolah) {
                // Filter only sekolah binaan for this pengawas
                const filteredSekolah = sekolahData.sekolah.filter((sekolah: Sekolah) =>
                  sekolahBinaanNames.includes(sekolah.nama_sekolah)
                );
                setSekolahBinaanList(filteredSekolah);
                setSekolahList(filteredSekolah);
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

  // Load rencana pendampingan when year/month changes
  const loadRencanaPendampingan = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("Loading rencana pendampingan for:", { year, month: month + 1 });

      const response = await fetch(
        `/api/pengawas/rencana-pendampingan?year=${year}&month=${month + 1}`
      );

      console.log("Response status:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);

        if (data.success) {
          if (data.rencanaPendampingan && Array.isArray(data.rencanaPendampingan)) {
            // Transform data to match interface
            const transformed = data.rencanaPendampingan.map((r: any) => {
              // Parse tanggal correctly - handle both string and Date
              // When parsing date string (YYYY-MM-DD), treat it as local date, not UTC
              let tanggalDate: Date;
              if (typeof r.tanggal === 'string') {
                // Parse YYYY-MM-DD as local date
                const [year, month, day] = r.tanggal.split('-').map(Number);
                tanggalDate = new Date(year, month - 1, day);
              } else {
                tanggalDate = new Date(r.tanggal);
              }
              // Normalize to start of day in local time
              tanggalDate.setHours(0, 0, 0, 0);

              return {
                id: r.id,
                tanggal: tanggalDate,
                sekolah_id: r.sekolah_id,
                sekolah_nama: r.sekolah_nama || "",
                indikator_utama: r.indikator_utama,
                akar_masalah: r.akar_masalah,
                kegiatan_benahi: r.kegiatan_benahi,
                penjelasan_implementasi: Array.isArray(r.penjelasan_implementasi)
                  ? r.penjelasan_implementasi
                  : [],
                apakah_kegiatan: r.apakah_kegiatan,
                dokumentasi: (() => {
                  console.log(`Raw dokumentasi for ${r.id}:`, r.dokumentasi, typeof r.dokumentasi);
                  if (Array.isArray(r.dokumentasi)) return r.dokumentasi;
                  if (typeof r.dokumentasi === 'string') {
                    // Try parsing if it's a JSON string
                    try {
                      const parsed = JSON.parse(r.dokumentasi);
                      if (Array.isArray(parsed)) return parsed;
                    } catch (e) {
                      // Maybe postgres array string?
                      if (r.dokumentasi.startsWith('{') && r.dokumentasi.endsWith('}')) {
                        return r.dokumentasi.slice(1, -1).split(',').map((s: string) => s.replace(/"/g, ''));
                      }
                    }
                  }
                  return [];
                })(),
              };
            });
            console.log("Transformed data:", transformed.length, "items");
            setRencanaList(transformed);
            // Reset to first page when data changes
            setCurrentPage(1);
          } else {
            // If no data, set empty list
            console.log("No rencanaPendampingan array, setting empty list");
            setRencanaList([]);
            setCurrentPage(1);
          }
        } else {
          console.error("API returned success=false:", data);
          setRencanaList([]);
        }
      } else {
        let errorData: any = {};
        try {
          const text = await response.text();
          console.error("Response text:", text);
          errorData = text ? JSON.parse(text) : {};
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }

        console.error("Failed to load rencana pendampingan:", response.status, errorData);
        toast({
          title: "Error",
          description: errorData.error || errorData.details || `Gagal memuat rencana pendampingan (${response.status})`,
          variant: "error",
        });
        setRencanaList([]);
      }
    } catch (error: any) {
      console.error("Error loading rencana pendampingan:", error);
      console.error("Error stack:", error?.stack);
      toast({
        title: "Error",
        description: error?.message || "Terjadi kesalahan saat memuat rencana pendampingan",
        variant: "error",
      });
      setRencanaList([]);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadRencanaPendampingan();
  }, [loadRencanaPendampingan]);

  // Fetch active program info when school changes
  useEffect(() => {
    async function fetchProgramInfo() {
      if (!formSekolahId) {
        setActiveProgramInfo(null);
        return;
      }

      console.log('[Program Info] Fetching for school ID:', formSekolahId);
      setIsLoadingProgramInfo(true);
      try {
        const res = await fetch(`/api/pengawas/rencana-program/check-sekolah?sekolah_id=${formSekolahId}`);
        console.log('[Program Info] Response status:', res.status);
        if (res.ok) {
          const data = await res.json();
          console.log('[Program Info] Data received:', data);
          setActiveProgramInfo(data);
        } else {
          const errorData = await res.json();
          console.log('[Program Info] Error response:', errorData);
          setActiveProgramInfo(null);
        }
      } catch (err) {
        console.error("[Program Info] Failed to fetch program info", err);
        setActiveProgramInfo(null);
      } finally {
        setIsLoadingProgramInfo(false);
      }
    }

    fetchProgramInfo();
  }, [formSekolahId]);

  // Handle file upload with compression and auto-save
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Safety check
    if (!editingRencana) return;

    setIsUploading(true);
    const newDocs: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Compress image
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };

        let fileToUpload = file;

        // Only compress if it's an image
        if (file.type.startsWith('image/')) {
          try {
            const compressedFile = await imageCompression(file, options);
            fileToUpload = compressedFile;
          } catch (error) {
            console.error("Compression failed, using original file", error);
          }
        }

        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("bucket", "dokumen_kegiatan");
        formData.append("path", "rencana_pendampingan");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.url) {
            newDocs.push(data.url);
          }
        } else {
          const errorData = await response.json();
          console.error("Upload failed for file", file.name, errorData);
          toast({
            title: "Gagal Upload",
            description: `Gagal mengupload ${file.name}: ${errorData.error || errorData.details || "Unknown error"}`,
            variant: "error"
          });
        }
      }

      if (newDocs.length > 0) {
        // Auto-save to database immediately
        const updatedDokumentasi = [...(editingRencana.dokumentasi || []), ...newDocs];
        setFormDokumentasi(updatedDokumentasi); // Update local state for preview

        // Perform DB Update
        const dateStr = formatDateLocal(editingRencana.tanggal);
        const saveResponse = await fetch("/api/pengawas/rencana-pendampingan", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingRencana.id,
            tanggal: dateStr,
            sekolah_id: editingRencana.sekolah_id,
            indikator_utama: editingRencana.indikator_utama,
            akar_masalah: editingRencana.akar_masalah,
            kegiatan_benahi: editingRencana.kegiatan_benahi,
            penjelasan_implementasi: editingRencana.penjelasan_implementasi,
            apakah_kegiatan: editingRencana.apakah_kegiatan,
            dokumentasi: updatedDokumentasi,
          }),
        });

        if (saveResponse.ok) {
          toast({
            title: "Berhasil",
            description: "Dokumentasi berhasil diupload dan disimpan",
          });
          await loadRencanaPendampingan(); // Refresh parent list

          // Update the editingRencana ref locally so verify logic works if they upload again
          setEditingRencana(prev => prev ? ({ ...prev, dokumentasi: updatedDokumentasi }) : null);

        } else {
          const errorData = await saveResponse.json();
          throw new Error(errorData.error || "Gagal menyimpan link dokumen ke database");
        }
      }

    } catch (error: any) {
      console.error("Upload process error", error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat upload",
        variant: "error"
      });
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const handleRemoveDokumentasi = (index: number) => {
    setFormDokumentasi(prev => prev.filter((_, i) => i !== index));
  };


  // Helper function to format date as YYYY-MM-DD using local time
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if date is a holiday
  const getHoliday = (date: Date) => {
    const dateStr = formatDateLocal(date);
    return HOLIDAYS[dateStr] || null;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    const holiday = getHoliday(clickedDate);

    if (holiday) {
      // Show holiday info dialog
      setSelectedHoliday(holiday);
      setSelectedDate(clickedDate);
      setIsHolidayDialogOpen(true);
    } else {
      // Show rencana pendampingan form
      setSelectedDate(clickedDate);
      setIsManualCreate(false);
      setIsDialogOpen(true);
      // Reset form
      setFormSekolahId("");
      setFormIndikatorUtama("");
      setFormAkarMasalah("");
      setFormKegiatanBenahi("");
      setFormPenjelasanImplementasi([""]);
      setFormApakahKegiatan(true);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setCurrentDate(new Date(year, newMonth, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setCurrentDate(new Date(newYear, month, 1));
  };

  const handleAddPenjelasanImplementasi = () => {
    setFormPenjelasanImplementasi([...formPenjelasanImplementasi, ""]);
  };

  const handleRemovePenjelasanImplementasi = (index: number) => {
    if (formPenjelasanImplementasi.length > 1) {
      setFormPenjelasanImplementasi(
        formPenjelasanImplementasi.filter((_, i) => i !== index)
      );
    }
  };

  const handlePenjelasanImplementasiChange = (index: number, value: string) => {
    const updated = [...formPenjelasanImplementasi];
    updated[index] = value;
    setFormPenjelasanImplementasi(updated);
  };


  const handleSave = async () => {
    if (!selectedDate) return;

    if (!formSekolahId) {
      toast({
        title: "Error",
        description: "Pilih sekolah binaan terlebih dahulu",
        variant: "error",
      });
      return;
    }

    const penjelasanFiltered = [formKegiatanBenahi.trim()];
    if (!formKegiatanBenahi.trim()) {
      toast({
        title: "Error",
        description: "Isi rencana kepengawasan terlebih dahulu",
        variant: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Format date as YYYY-MM-DD using local time
      const dateStr = formatDateLocal(selectedDate);

      const response = await fetch("/api/pengawas/rencana-pendampingan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tanggal: dateStr,
          sekolah_id: formSekolahId,
          indikator_utama: "E.5", // Default value
          akar_masalah: "-", // Default value
          kegiatan_benahi: formKegiatanBenahi,
          penjelasan_implementasi: penjelasanFiltered,
          apakah_kegiatan: true,
          dokumentasi: formDokumentasi,
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

      // Update view to match selected date if necessary
      const selectedYear = selectedDate.getFullYear();
      const selectedMonth = selectedDate.getMonth();

      if (selectedYear !== year || selectedMonth !== month) {
        setCurrentDate(new Date(selectedYear, selectedMonth, 1));
        // useEffect will handle loading
      } else {
        // Reload if only same month
        await loadRencanaPendampingan();
      }

      setIsDialogOpen(false);
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

  const handleEdit = (rencana: RencanaPendampingan) => {
    setEditingRencana(rencana);
    setFormSekolahId(rencana.sekolah_id);
    setFormIndikatorUtama(rencana.indikator_utama);
    setFormAkarMasalah(rencana.akar_masalah);
    setFormKegiatanBenahi(rencana.kegiatan_benahi);
    setFormPenjelasanImplementasi(
      rencana.penjelasan_implementasi.length > 0
        ? rencana.penjelasan_implementasi
        : [""]
    );
    setFormApakahKegiatan(rencana.apakah_kegiatan);
    setFormDokumentasi(rencana.dokumentasi || []);
    setSelectedDate(rencana.tanggal);
    setIsDetailDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleOpenUploadDialog = (rencana: RencanaPendampingan) => {
    setEditingRencana(rencana);
    setFormDokumentasi(rencana.dokumentasi || []);
    setIsUploadDialogOpen(true);
  };

  const handleUpdateDokumentasi = async () => {
    if (!editingRencana) return;
    setIsSaving(true);
    try {
      // Only update documentation field
      // We need to send other required fields or use a PATCH endpoint. 
      // Since the current API is PUT (update all), we need to reconstruct the object. 
      // However, it's safer to just send the updated documentation list specifically if API supports it, 
      // but assuming we must use the existing PUT logic which expects full object.
      // Wait, we can reuse the existing handleUpdate but that relies on form state.
      // Let's create a specific update payload reusing the existing data + new documentation.

      const dateStr = formatDateLocal(editingRencana.tanggal);

      const response = await fetch("/api/pengawas/rencana-pendampingan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingRencana.id,
          tanggal: dateStr,
          sekolah_id: editingRencana.sekolah_id,
          indikator_utama: editingRencana.indikator_utama,
          akar_masalah: editingRencana.akar_masalah,
          kegiatan_benahi: editingRencana.kegiatan_benahi,
          penjelasan_implementasi: editingRencana.penjelasan_implementasi,
          apakah_kegiatan: editingRencana.apakah_kegiatan,
          dokumentasi: formDokumentasi,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan dokumentasi");
      }

      toast({
        title: "Berhasil",
        description: "Dokumentasi berhasil disimpan",
      });

      await loadRencanaPendampingan();
      setIsUploadDialogOpen(false);
      setEditingRencana(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menyimpan dokumentasi",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingRencana || !selectedDate) return;

    // Validation
    if (!formSekolahId) {
      toast({
        title: "Error",
        description: "Pilih sekolah binaan terlebih dahulu",
        variant: "error",
      });
      return;
    }

    if (!formIndikatorUtama) {
      toast({
        title: "Error",
        description: "Pilih indikator utama terlebih dahulu",
        variant: "error",
      });
      return;
    }

    if (!formAkarMasalah.trim()) {
      toast({
        title: "Error",
        description: "Isi akar masalah terlebih dahulu",
        variant: "error",
      });
      return;
    }

    if (!formKegiatanBenahi.trim()) {
      toast({
        title: "Error",
        description: "Isi kegiatan benahi terlebih dahulu",
        variant: "error",
      });
      return;
    }

    const penjelasanFiltered = formPenjelasanImplementasi.filter((p) => p.trim() !== "");
    if (penjelasanFiltered.length === 0) {
      toast({
        title: "Error",
        description: "Isi minimal satu penjelasan implementasi kegiatan",
        variant: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Format date as YYYY-MM-DD using local time
      const dateStr = formatDateLocal(selectedDate);

      const response = await fetch("/api/pengawas/rencana-pendampingan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingRencana.id,
          tanggal: dateStr,
          sekolah_id: formSekolahId,
          indikator_utama: formIndikatorUtama,
          akar_masalah: formAkarMasalah,
          kegiatan_benahi: formKegiatanBenahi,
          penjelasan_implementasi: penjelasanFiltered,
          apakah_kegiatan: formApakahKegiatan,
          dokumentasi: formDokumentasi,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengupdate rencana pendampingan");
      }

      toast({
        title: "Berhasil",
        description: "Rencana pendampingan berhasil diupdate",
      });

      // Reload rencana pendampingan to ensure consistency
      await loadRencanaPendampingan();

      setIsEditDialogOpen(false);
      setEditingRencana(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengupdate rencana pendampingan",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (rencana: RencanaPendampingan) => {
    setRencanaToDelete(rencana);
    setIsDeleteConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!rencanaToDelete) return;

    setIsDeleting(true);
    setIsDeleteConfirmDialogOpen(false);

    try {
      const response = await fetch(`/api/pengawas/rencana-pendampingan?id=${rencanaToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus rencana pendampingan");
      }

      toast({
        title: "Berhasil",
        description: "Rencana pendampingan berhasil dihapus",
      });

      // Reload rencana pendampingan to ensure consistency
      await loadRencanaPendampingan();

      setIsDetailDialogOpen(false);
      setSelectedRencana(null);
      setRencanaToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menghapus rencana pendampingan",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Get rencana for a specific date
  const getRencanaForDate = (day: number) => {
    const checkDate = new Date(year, month, day);
    // Normalize checkDate to start of day in local time
    checkDate.setHours(0, 0, 0, 0);

    return rencanaList.filter((r) => {
      const rDate = new Date(r.tanggal);
      // Normalize rDate to start of day in local time
      rDate.setHours(0, 0, 0, 0);

      return (
        rDate.getDate() === checkDate.getDate() &&
        rDate.getMonth() === checkDate.getMonth() &&
        rDate.getFullYear() === checkDate.getFullYear()
      );
    });
  };

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex flex-col gap-2 sm:gap-2.5 h-full max-h-[calc(100vh-200px)]">
      <div className="flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900">Rencana Pendampingan RKS</h1>
          <p className="text-[10px] sm:text-xs text-slate-600">
            Klik pada tanggal untuk menambahkan rencana pendampingan
          </p>
        </div>
        <Button
          onClick={() => setIsGuidanceDialogOpen(true)}
          className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-9 text-xs sm:text-sm px-4"
        >
          <Plus className="size-4 mr-1.5" />
          Petunjuk Pengisian
        </Button>
      </div>

      {/* Container untuk Kalender dan List Kegiatan */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Kalender Card */}
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 flex-shrink-0 flex flex-col lg:max-w-md">
          <CardHeader className="pb-3 pt-4 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-slate-900 text-sm sm:text-base font-bold mb-3">
              <Calendar className="size-4 text-indigo-600 flex-shrink-0" />
              <span className="whitespace-nowrap">Kalender Rencana Pendampingan</span>
            </CardTitle>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={year}
                  onChange={handleYearChange}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={handleMonthChange}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                >
                  {monthNames.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousMonth}
                  className="rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 h-9 w-9 flex-shrink-0 transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 h-9 w-9 flex-shrink-0 transition-colors"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-3 pb-4 px-2 sm:pt-3 sm:pb-4 sm:px-3 md:pt-4 md:pb-5 md:px-4 flex-shrink-0 flex flex-col">
            {/* Day headers - always visible */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2 w-full mb-2 sm:mb-3 flex-shrink-0">
              {dayNames.map((day, dayIndex) => {
                const isSunday = dayIndex === 0; // Minggu is the first day
                return (
                  <div
                    key={day}
                    className={`text-center text-xs sm:text-sm font-semibold py-1.5 sm:py-2 whitespace-nowrap ${isSunday ? "text-red-600" : "text-slate-700"
                      }`}
                  >
                    <span className="sm:hidden">{day.substring(0, 1)}</span>
                    <span className="hidden sm:inline">{day.substring(0, 3)}</span>
                  </div>
                );
              })}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2 w-full flex-shrink-0">

              {/* Calendar days */}
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square w-full min-h-[36px] sm:min-h-[40px] md:min-h-[44px]"
                    />
                  );
                }

                const rencanaForDay = getRencanaForDate(day);
                const hasRencana = rencanaForDay.length > 0;
                const isToday =
                  day === new Date().getDate() &&
                  month === new Date().getMonth() &&
                  year === new Date().getFullYear();

                // Check if this day is Sunday (index % 7 === startingDayOfWeek, but we need to check the actual day)
                const dayOfWeek = (startingDayOfWeek + (day - 1)) % 7;
                const isSunday = dayOfWeek === 0;

                // Check if this day is a holiday
                const checkDate = new Date(year, month, day);
                const holiday = getHoliday(checkDate);
                const isHoliday = !!holiday;

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                    aspect-square w-full rounded-lg border transition-all
                    min-h-0
                    ${isToday
                        ? "border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-200/30"
                        : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                      }
                    ${hasRencana ? "bg-green-50 border-green-300 hover:border-green-400" : ""}
                    ${isHoliday ? "bg-red-100 border-red-400 hover:border-red-500" : ""}
                    ${!isHoliday && isSunday ? "bg-red-50/30 border-red-200" : ""}
                    flex flex-col items-center justify-center p-1 sm:p-1.5 md:p-2
                    active:scale-95 min-h-[36px] sm:min-h-[40px] md:min-h-[44px]
                  `}
                  >
                    <span
                      className={`text-sm sm:text-base font-semibold leading-tight ${isToday
                        ? "text-indigo-600"
                        : isHoliday
                          ? "text-red-600 font-bold"
                          : isSunday
                            ? "text-red-600"
                            : "text-slate-900"
                        }`}
                    >
                      {day}
                    </span>
                    {isHoliday && (
                      <span className="text-[9px] sm:text-[10px] text-red-600 font-semibold leading-none mt-0.5">
                        ⭐
                      </span>
                    )}
                    {hasRencana && (
                      <span className="text-[10px] sm:text-[11px] text-green-600 font-semibold leading-none mt-0.5">
                        {rencanaForDay.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* List Kegiatan Card */}
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 flex-1 flex flex-col min-h-[350px] sm:min-h-[400px] lg:flex-1 overflow-hidden lg:min-h-[500px]">
          <CardHeader className="pb-3 pt-4 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-slate-900 text-sm sm:text-base">
              <FileText className="size-4 text-indigo-600" />
              Kegiatan Bulan Ini - {monthNames[month]} {year}
              {rencanaList.length > 0 && (
                <span className="ml-2 text-xs font-normal text-slate-500">
                  ({rencanaList.length} kegiatan)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4 flex-1 min-h-0 overflow-y-auto">
            {rencanaList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                <FileText className="size-10 sm:size-12 text-slate-300 mb-3" />
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  Tidak ada kegiatan pendampingan bulan ini
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Klik pada tanggal di kalendar untuk menambahkan rencana pendampingan
                </p>
              </div>
            ) : (() => {
              // Sort and paginate
              const sortedRencana = [...rencanaList].sort((a, b) => a.tanggal.getTime() - b.tanggal.getTime());
              const totalPages = Math.ceil(sortedRencana.length / itemsPerPage);
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              const paginatedRencana = sortedRencana.slice(startIndex, endIndex);

              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {paginatedRencana.map((rencana) => {
                      const indikatorLabel = INDIKATOR_UTAMA.find(
                        (i) => i.code === rencana.indikator_utama
                      )?.label || rencana.indikator_utama;

                      return (
                        <div
                          key={rencana.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedRencana(rencana);
                            setIsDetailDialogOpen(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setSelectedRencana(rencana);
                              setIsDetailDialogOpen(true);
                            }
                          }}
                          className="group relative rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100/50 active:scale-[0.98] cursor-pointer"
                        >
                          {/* Badge */}
                          <div className="absolute top-3 right-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${rencana.apakah_kegiatan
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-700"
                                }`}
                            >
                              {rencana.apakah_kegiatan ? "Kegiatan" : "Non-Kegiatan"}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="space-y-3 pr-16">
                            {/* Tanggal */}
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                <Clock className="size-4" />
                              </div>
                              <span className="text-sm font-semibold text-slate-900">
                                {rencana.tanggal.toLocaleDateString("id-ID", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>

                            {/* Sekolah */}
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                <School className="size-4" />
                              </div>
                              <span className="text-sm font-medium text-slate-700 line-clamp-1">
                                {rencana.sekolah_nama}
                              </span>
                            </div>

                            {/* Indikator */}
                            <div className="flex items-start gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors flex-shrink-0">
                                <FileText className="size-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-0.5">
                                  Indikator
                                </p>
                                <p className="text-sm font-semibold text-indigo-700 line-clamp-2">
                                  {rencana.indikator_utama === indikatorLabel
                                    ? rencana.indikator_utama
                                    : `${rencana.indikator_utama} - ${indikatorLabel}`}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                            {/* Lihat Button - Only if docs exist */}
                            {rencana.dokumentasi && rencana.dokumentasi.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRencana(rencana);
                                  setIsDetailDialogOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-xs font-semibold z-10 relative"
                              >
                                <Eye className="size-3.5" />
                                Lihat
                              </button>
                            )}

                            {/* Upload Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenUploadDialog(rencana);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-semibold z-10 relative"
                            >
                              <Upload className="size-3.5" />
                              {rencana.dokumentasi && rencana.dokumentasi.length > 0 ? "Tambah" : "Upload"}
                            </button>
                          </div>

                          {/* Hover indicator */}
                          <div className="absolute top-1/2 -translate-y-1/2 right-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <ChevronRight className="size-5 text-indigo-300" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200">
                      <div className="text-xs sm:text-sm text-slate-600">
                        Menampilkan {startIndex + 1}-{Math.min(endIndex, sortedRencana.length)} dari {sortedRencana.length} kegiatan
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="size-3.5 mr-1" />
                          Sebelumnya
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1) ||
                              (currentPage <= 3 && page <= 5) ||
                              (currentPage >= totalPages - 2 && page >= totalPages - 4)
                            ) {
                              return (
                                <Button
                                  key={page}
                                  variant={currentPage === page ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                  className={`rounded-lg h-8 w-8 p-0 text-xs ${currentPage === page
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                                    }`}
                                >
                                  {page}
                                </Button>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <span key={page} className="text-slate-400 text-xs">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Selanjutnya
                          <ChevronRight className="size-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full mx-2 sm:mx-0 bg-white">
          <DialogHeader className="border-b border-slate-200 pb-4 mb-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <Calendar className="size-5" />
              </div>
              Rencana Pendampingan
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-2 font-medium">
              {!isManualCreate && selectedDate &&
                selectedDate.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </DialogDescription>
          </DialogHeader>

          {isManualCreate && selectedDate && (
            <div className="mb-5 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <label className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Calendar className="size-4 text-indigo-600" />
                Tanggal Pelaksanaan <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Tanggal */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Tanggal</label>
                  <div className="relative">
                    <select
                      value={selectedDate.getDate()}
                      onChange={(e) => {
                        const newDay = parseInt(e.target.value);
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDay);
                        setSelectedDate(newDate);
                      }}
                      className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300 transition-all"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Bulan */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Bulan</label>
                  <div className="relative">
                    <select
                      value={selectedDate.getMonth()}
                      onChange={(e) => {
                        const newMonth = parseInt(e.target.value);
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newMonth);
                        setSelectedDate(newDate);
                      }}
                      className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300 transition-all"
                    >
                      {monthNames.map((m, i) => (
                        <option key={i} value={i}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tahun */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Tahun</label>
                  <div className="relative">
                    <select
                      value={selectedDate.getFullYear()}
                      onChange={(e) => {
                        const newYear = parseInt(e.target.value);
                        const newDate = new Date(selectedDate);
                        newDate.setFullYear(newYear);
                        setSelectedDate(newDate);
                      }}
                      className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300 transition-all"
                    >
                      {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 sm:space-y-5">
            {/* Pilih Sekolah Binaan */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
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
                  className="flex w-full items-center justify-between gap-4 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-900 font-bold shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300"
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
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsSekolahDropdownOpen(false)}
                    />
                    <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
                      {sekolahBinaanList.map((sekolah) => (
                        <button
                          key={sekolah.id}
                          type="button"
                          onClick={() => {
                            setFormSekolahId(sekolah.id);
                            setIsSekolahDropdownOpen(false);
                          }}
                          className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
                        >
                          <span className={formSekolahId === sekolah.id ? "text-indigo-700" : "text-slate-700"}>
                            {sekolah.nama_sekolah}
                          </span>
                          {formSekolahId === sekolah.id && (
                            <Check className="size-4 text-indigo-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Rencana Kepengawasan */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">
                Langkah Rencana Kepengawasan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formKegiatanBenahi}
                onChange={(e) => setFormKegiatanBenahi(e.target.value)}
                placeholder="Masukkan rencana kepengawasan..."
                rows={4}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm sm:text-base text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
              className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm py-2.5 px-5 transition-colors"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2.5 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check className="size-4 mr-2" />
                  Simpan Rencana
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Guidance Dialog */}
      <Dialog open={isGuidanceDialogOpen} onOpenChange={setIsGuidanceDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="border-b border-slate-200 pb-4 mb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                <AlertCircle className="size-5" />
              </div>
              Petunjuk Pengisian
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">1</div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pilih tanggal pada <span className="font-bold text-indigo-600">Kalender Rencana Pendampingan</span> untuk mulai membuat rencana baru.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">2</div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Isi form dengan memilih <span className="font-bold">Sekolah Binaan</span> dan masukkan <span className="font-bold">Langkah Rencana Kepengawasan</span>.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">3</div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Klik tombol <span className="font-bold text-indigo-600">Simpan Rencana</span> untuk menyimpan data Anda.
              </p>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-slate-200">
            <Button
              onClick={() => setIsGuidanceDialogOpen(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Mengerti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Holiday Info Dialog */}
      < Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen} >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-slate-900 font-bold">
              <Calendar className="size-5 text-red-700" />
              {selectedHoliday?.holiday ? "Hari Libur Nasional" : "Perayaan"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 mt-1">
              {selectedDate &&
                selectedDate.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedHoliday && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Nama Hari:</h3>
                <div className="text-sm text-slate-900 bg-red-50 border-2 border-red-300 rounded-lg p-3 font-medium">
                  {selectedHoliday.summary.join(", ")}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Keterangan:</h3>
                <p className="text-sm text-slate-700 font-medium">
                  {selectedHoliday.description.join(", ")}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setIsHolidayDialogOpen(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold w-full sm:w-auto"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      {/* Detail Rencana Dialog */}
      < Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen} >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-slate-900 font-bold">
              <FileText className="size-5 text-indigo-600" />
              Detail Rencana Pendampingan
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 mt-1">
              {selectedRencana &&
                selectedRencana.tanggal.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedRencana && (() => {
            const indikatorLabel = INDIKATOR_UTAMA.find(
              (i) => i.code === selectedRencana.indikator_utama
            )?.label || selectedRencana.indikator_utama;

            return (
              <div className="space-y-4">
                {/* Tanggal & Sekolah */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Tanggal</label>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-indigo-600" />
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedRencana.tanggal.toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Sekolah</label>
                    <div className="flex items-center gap-2">
                      <School className="size-4 text-indigo-600" />
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedRencana.sekolah_nama}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${selectedRencana.apakah_kegiatan
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {selectedRencana.apakah_kegiatan ? "Kegiatan" : "Non-Kegiatan"}
                  </span>
                </div>

                {/* Indikator Utama */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Indikator Utama</label>
                  <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                    <p className="text-sm font-semibold text-indigo-900">
                      {selectedRencana.indikator_utama === indikatorLabel
                        ? selectedRencana.indikator_utama
                        : `${selectedRencana.indikator_utama} - ${indikatorLabel}`}
                    </p>
                  </div>
                </div>

                {/* Akar Masalah */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Akar Masalah</label>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm text-slate-900 leading-relaxed">
                      {selectedRencana.akar_masalah}
                    </p>
                  </div>
                </div>

                {/* Kegiatan Benahi */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Kegiatan Benahi</label>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm text-slate-900 leading-relaxed">
                      {selectedRencana.kegiatan_benahi}
                    </p>
                  </div>
                </div>

                {/* Penjelasan Implementasi */}
                {selectedRencana.penjelasan_implementasi.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Penjelasan Implementasi
                    </label>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <ul className="space-y-2">
                        {selectedRencana.penjelasan_implementasi.map((item, idx) => (
                          item && (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-indigo-600 mt-1 flex-shrink-0">•</span>
                              <p className="text-sm text-slate-900 leading-relaxed flex-1">{item}</p>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Dokumentasi */}
                {selectedRencana.dokumentasi && selectedRencana.dokumentasi.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Dokumentasi</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedRencana.dokumentasi.map((url, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden border border-slate-200 aspect-video">
                          <img src={url} alt={`Dokumentasi ${idx + 1}`} className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => setViewImage(url)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={() => selectedRencana && handleEdit(selectedRencana)}
                className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                disabled={isDeleting || !selectedRencana}
              >
                <Edit className="size-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => selectedRencana && handleDeleteClick(selectedRencana)}
                className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={isDeleting || !selectedRencana}
              >
                <Trash2 className="size-4 mr-2" />
                Hapus
              </Button>
            </div>
            <Button
              onClick={() => setIsDetailDialogOpen(false)}
              variant="outline"
              className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50"
              disabled={isDeleting}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent >
      </Dialog >

      {/* Edit Dialog */}
      < Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingRencana(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full mx-2 sm:mx-0 bg-white">
          <DialogHeader className="border-b border-slate-200 pb-4 mb-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <Edit className="size-5" />
              </div>
              Edit Rencana Pendampingan
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-2 font-medium">
              {selectedDate &&
                selectedDate.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </DialogDescription>
          </DialogHeader>

          {isManualCreate && selectedDate && (
            <div className="mb-5 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <label className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Calendar className="size-4 text-indigo-600" />
                Tanggal Pelaksanaan <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Tanggal */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Tanggal</label>
                  <div className="relative">
                    <select
                      value={selectedDate.getDate()}
                      onChange={(e) => {
                        const newDay = parseInt(e.target.value);
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDay);
                        setSelectedDate(newDate);
                      }}
                      className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Bulan */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Bulan</label>
                  <div className="relative">
                    <select
                      value={selectedDate.getMonth()}
                      onChange={(e) => {
                        const newMonth = parseInt(e.target.value);
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newMonth);
                        setSelectedDate(newDate);
                      }}
                      className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {monthNames.map((m, i) => (
                        <option key={i} value={i}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tahun */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Tahun</label>
                  <div className="relative">
                    <select
                      value={selectedDate.getFullYear()}
                      onChange={(e) => {
                        const newYear = parseInt(e.target.value);
                        const newDate = new Date(selectedDate);
                        newDate.setFullYear(newYear);
                        setSelectedDate(newDate);
                      }}
                      className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 sm:space-y-5">
            {/* Pilih Sekolah Binaan */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
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
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsSekolahDropdownOpen(false)}
                    />
                    <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
                      {sekolahBinaanList.map((sekolah) => (
                        <button
                          key={sekolah.id}
                          type="button"
                          onClick={() => {
                            setFormSekolahId(sekolah.id);
                            setIsSekolahDropdownOpen(false);
                          }}
                          className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
                        >
                          <span className={formSekolahId === sekolah.id ? "text-indigo-700" : "text-slate-700"}>
                            {sekolah.nama_sekolah}
                          </span>
                          {formSekolahId === sekolah.id && (
                            <Check className="size-4 text-indigo-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Identifikasi - Indikator Utama */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-bold text-slate-900">
                Identifikasi (Indikator Utama) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsIndikatorDropdownOpen(!isIndikatorDropdownOpen);
                    setIsSekolahDropdownOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <span className={formIndikatorUtama ? "text-slate-900" : "text-slate-400"}>
                    {(() => {
                      if (!formIndikatorUtama) return "Pilih Indikator Utama";

                      const selectedIndikator = INDIKATOR_UTAMA.find(
                        (i) => i.code === formIndikatorUtama || i.label === formIndikatorUtama
                      );

                      // If found by code or label, display formatted string
                      if (selectedIndikator) {
                        return `${selectedIndikator.code} - ${selectedIndikator.label}`;
                      }

                      // Fallback: display the raw value (e.g. legacy data)
                      return formIndikatorUtama;
                    })()}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-5 text-slate-400 transition-transform",
                      isIndikatorDropdownOpen && "rotate-180 text-indigo-600"
                    )}
                  />
                </button>
                {isIndikatorDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsIndikatorDropdownOpen(false)}
                    />
                    <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50 max-h-60 overflow-y-auto">
                      {INDIKATOR_UTAMA.map((indikator) => (
                        <button
                          key={indikator.code}
                          type="button"
                          onClick={() => {
                            setFormIndikatorUtama(indikator.code);
                            setIsIndikatorDropdownOpen(false);
                          }}
                          className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50 text-left"
                        >
                          <span className={formIndikatorUtama === indikator.code ? "text-indigo-700" : "text-slate-700"}>
                            {indikator.code} - {indikator.label}
                          </span>
                          {formIndikatorUtama === indikator.code && (
                            <Check className="size-4 text-indigo-600 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Akar Masalah */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-bold text-slate-900">
                Akar Masalah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formAkarMasalah}
                onChange={(e) => setFormAkarMasalah(e.target.value)}
                placeholder="Contoh: kompetensi membaca teks sastra"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm sm:text-base text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300"
              />
            </div>

            {/* Kegiatan Benahi */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-bold text-slate-900">
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
              <label className="text-sm sm:text-base font-bold text-slate-900">
                Penjelasan Implementasi Kegiatan <span className="text-red-500">*</span>
              </label>
              {formPenjelasanImplementasi.map((penjelasan, index) => (
                <div key={index} className="flex gap-3">
                  <textarea
                    value={penjelasan}
                    onChange={(e) =>
                      handlePenjelasanImplementasiChange(index, e.target.value)
                    }
                    placeholder="Contoh: Diskusi mingguan guru terkait modul literasi di PMM"
                    rows={4}
                    className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm sm:text-base text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300 resize-none"
                  />
                  {formPenjelasanImplementasi.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemovePenjelasanImplementasi(index)}
                      className="rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 h-10 w-10 flex-shrink-0 transition-colors"
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={handleAddPenjelasanImplementasi}
                className="rounded-lg border-0 bg-transparent text-slate-900 hover:bg-slate-100 font-medium text-sm py-2 px-4 transition-colors"
              >
                <Plus className="size-4 mr-2" />
                Tambah Penjelasan Implementasi
              </Button>
            </div>

            {/* Apakah Kegiatan */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-semibold text-slate-900 block">
                Apakah Kegiatan <span className="text-red-500">*</span>
              </label>
              <div className="inline-flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFormApakahKegiatan(true)}
                  className={`
                    px-5 py-2 rounded-md text-sm font-medium transition-all
                    ${formApakahKegiatan === true
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                    }
                  `}
                >
                  Ya
                </button>
                <button
                  type="button"
                  onClick={() => setFormApakahKegiatan(false)}
                  className={`
                    px-5 py-2 rounded-md text-sm font-medium transition-all
                    ${formApakahKegiatan === false
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                    }
                  `}
                >
                  Tidak
                </button>
              </div>
            </div>


          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingRencana(null);
              }}
              disabled={isSaving}
              className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm py-2.5 px-5 transition-colors"
            >
              Batal
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isSaving}
              className="w-full sm:w-auto rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 px-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      {/* Delete Confirmation Dialog */}
      < Dialog open={isDeleteConfirmDialogOpen} onOpenChange={setIsDeleteConfirmDialogOpen} >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2 text-slate-900 font-bold">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Trash2 className="size-5" />
              </div>
              Konfirmasi Hapus
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-2">
              Apakah Anda yakin ingin menghapus rencana pendampingan ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {rencanaToDelete && (
            <div className="space-y-3 py-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-red-600" />
                    <span className="text-sm font-semibold text-slate-900">
                      {rencanaToDelete.tanggal.toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="size-4 text-red-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {rencanaToDelete.sekolah_nama}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="size-4 text-red-600 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">
                      {rencanaToDelete.indikator_utama} - {INDIKATOR_UTAMA.find((i) => i.code === rencanaToDelete.indikator_utama)?.label || rencanaToDelete.indikator_utama}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmDialogOpen(false);
                setRencanaToDelete(null);
              }}
              disabled={isDeleting}
              className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Batal
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      {/* Upload Dokumentasi Dialog */}
      < Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Upload className="size-5" />
              </div>
              Dokumentasi Kegiatan
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {formDokumentasi.map((url, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
                    <img src={url} alt={`Dokumentasi ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveDokumentasi(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                  {isUploading ? (
                    <Loader2 className="size-6 text-slate-400 animate-spin" />
                  ) : (
                    <>
                      <Upload className="size-6 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500 font-medium">Upload Foto</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Format: JPG, PNG. Maks 5MB per file.
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Tutup
            </Button>
            <Button
              onClick={handleUpdateDokumentasi}
              disabled={isSaving || isUploading}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSaving ? "Menyimpan..." : "Simpan Dokumentasi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      {/* Image Preview Dialog (Lightbox) */}
      < Dialog open={!!viewImage} onOpenChange={(open) => !open && setViewImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none text-white">
          <DialogTitle className="sr-only">Preview Dokumentasi</DialogTitle>
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-2 right-2 z-50">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setViewImage(null)}
                className="rounded-full bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="size-5" />
              </Button>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 min-h-[50vh] sm:min-h-[80vh]">
              {viewImage && (
                <img
                  src={viewImage}
                  alt="Preview Dokumentasi"
                  className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-sm"
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog >
    </div >
  );
}
