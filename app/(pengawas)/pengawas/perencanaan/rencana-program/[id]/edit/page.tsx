"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  FileText,
  ArrowLeft,
  Save,
  Download,
  CheckCircle2,
  Lock,
  ChevronDown,
  Target,
  TrendingUp,
  Calendar,
  Users,
  School,
  X,
  Sparkles,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface SelectedSekolah {
  id: string | number;
  nama: string;
  npsn: string;
}

export default function EditRencanaProgramPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [selectedSekolah, setSelectedSekolah] = useState<SelectedSekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<string>("Draft");

  const [formData, setFormData] = useState({
    // A. Pendahuluan
    latarBelakang: "",
    tujuan: "",

    // B. Analisis Situasi
    profilSekolah: "",
    identifikasiMasalah: "",

    // C. Tujuan dan Sasaran
    tujuanJangkaPanjang: "",
    sasaranJangkaPendek: "",

    // D. Strategi dan Program Kerja
    strategiPengawasan: "",
    programKerja: "",

    // E. Rencana Aksi
    jadwalKegiatan: "",
    tanggungJawab: "",

    // F. Pengalokasian Sumber Daya
    sumberDayaManusia: "",
    anggaran: "",

    // G. Monitoring dan Evaluasi
    indikatorKeberhasilan: "",
    prosesMonitoring: "",
    evaluasi: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [openSection, setOpenSection] = useState<string>("pendahuluan");

  // Load existing rencana program data
  useEffect(() => {
    // Get ID directly from params
    const id = params?.id;
    
    if (!id) {
      console.error("Params:", params, "ID:", id);
      toast({
        title: "Error",
        description: "ID tidak ditemukan di URL",
        variant: "destructive",
      });
      router.push("/pengawas/perencanaan/rencana-program");
      return;
    }

    // Convert to string if needed
    const idString = typeof id === "string" ? id : Array.isArray(id) ? id[0] : String(id);
    
    if (!idString || idString === "undefined" || idString === "null") {
      console.error("Invalid ID:", idString);
      toast({
        title: "Error",
        description: "ID rencana program tidak valid",
        variant: "destructive",
      });
      router.push("/pengawas/perencanaan/rencana-program");
      return;
    }
    
    loadRencanaProgram(idString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const loadRencanaProgram = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/pengawas/rencana-program/${id}`);

      if (!response.ok) {
        throw new Error("Gagal memuat rencana program");
      }

      const data = await response.json();
      const rencana = data.rencanaProgram;

      if (rencana) {
        // Load form data
        if (rencana.form_data) {
          setFormData(rencana.form_data);
        }

        // Load selected schools from sekolah_ids
        if (rencana.sekolah_ids && Array.isArray(rencana.sekolah_ids)) {
          // Fetch sekolah details from sekolah_ids
          const sekolahResponse = await fetch("/api/sekolah/list");
          if (sekolahResponse.ok) {
            const sekolahData = await sekolahResponse.json();
            const selected = sekolahData.sekolah
              .filter((s: any) => rencana.sekolah_ids.includes(s.id))
              .map((s: any) => ({
                id: s.id,
                nama: s.nama_sekolah,
                npsn: s.npsn,
              }));
            setSelectedSekolah(selected);
          }
        }

        setCurrentStatus(rencana.status || "Draft");
      }
    } catch (error) {
      console.error("Error loading rencana program:", error);
      toast({
        title: "Error",
        description: "Gagal memuat rencana program",
        variant: "destructive",
      });
      router.push("/pengawas/perencanaan/rencana-program");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeSekolah = () => {
    const id = params?.id;
    const idString = typeof id === "string" ? id : Array.isArray(id) ? id[0] : id ? String(id) : null;
    
    if (!idString) return;
    
    // Save current data to sessionStorage for school selection page
    sessionStorage.setItem("rencana_program_selected_sekolah", JSON.stringify(selectedSekolah));
    sessionStorage.setItem("rencana_program_edit_id", idString);
    router.push("/pengawas/perencanaan/rencana-program/pilih-sekolah");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const id = params?.id;
      const idString = typeof id === "string" ? id : Array.isArray(id) ? id[0] : id ? String(id) : null;
      
      if (!idString) {
        throw new Error("ID rencana program tidak valid");
      }

      // Update to database via API
      const response = await fetch(`/api/pengawas/rencana-program/${idString}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: formData,
          sekolah_ids: selectedSekolah.map((s) => s.id),
          periode: `Tahun ${new Date().getFullYear()}`,
          status: currentStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Gagal memperbarui rencana program" }));
        throw new Error(errorData.error || "Gagal memperbarui rencana program");
      }

      toast({
        title: "Berhasil",
        description: "Rencana program berhasil diperbarui",
      });

      router.push("/pengawas/perencanaan/rencana-program");
    } catch (error) {
      console.error("Error updating rencana program:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal memperbarui rencana program",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      const id = params?.id;
      const idString = typeof id === "string" ? id : Array.isArray(id) ? id[0] : id ? String(id) : null;
      
      if (!idString) {
        throw new Error("ID rencana program tidak valid");
      }

      // Update status to "Terbit" via API
      const response = await fetch(`/api/pengawas/rencana-program/${idString}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: formData,
          sekolah_ids: selectedSekolah.map((s) => s.id),
          periode: `Tahun ${new Date().getFullYear()}`,
          status: "Terbit",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Gagal menerbitkan rencana program" }));
        throw new Error(errorData.error || "Gagal menerbitkan rencana program");
      }

      setCurrentStatus("Terbit");
      toast({
        title: "Berhasil",
        description: "Rencana program berhasil diterbitkan",
      });

      router.push("/pengawas/perencanaan/rencana-program");
    } catch (error) {
      console.error("Error publishing rencana program:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menerbitkan rencana program",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Sections configuration (same as buat page)
  const sections = [
    {
      id: "pendahuluan",
      title: "A. Pendahuluan",
      icon: FileText,
      colorScheme: {
        bg: "bg-sky-50/70",
        border: "border-sky-100",
        hoverBg: "bg-sky-50/90",
        iconColor: "text-sky-500",
        gradient: "from-sky-300 to-blue-300",
        indicatorBorder: "border-sky-300",
      },
      fields: [
        { key: "latarBelakang", label: "Latar Belakang", required: true },
        { key: "tujuan", label: "Tujuan", required: true },
      ],
    },
    {
      id: "analisis-situasi",
      title: "B. Analisis Situasi",
      icon: Target,
      colorScheme: {
        bg: "bg-rose-50/70",
        border: "border-rose-100",
        hoverBg: "bg-rose-50/90",
        iconColor: "text-rose-500",
        gradient: "from-rose-300 to-pink-300",
        indicatorBorder: "border-rose-300",
      },
      fields: [
        { key: "profilSekolah", label: "Profil Sekolah", required: true },
        { key: "identifikasiMasalah", label: "Identifikasi Masalah", required: true },
      ],
    },
    {
      id: "tujuan-sasaran",
      title: "C. Tujuan dan Sasaran",
      icon: Target,
      colorScheme: {
        bg: "bg-emerald-50/70",
        border: "border-emerald-100",
        hoverBg: "bg-emerald-50/90",
        iconColor: "text-emerald-500",
        gradient: "from-emerald-300 to-teal-300",
        indicatorBorder: "border-emerald-300",
      },
      fields: [
        { key: "tujuanJangkaPanjang", label: "Tujuan Jangka Panjang", required: true },
        { key: "sasaranJangkaPendek", label: "Sasaran Jangka Pendek", required: true },
      ],
    },
    {
      id: "strategi-program",
      title: "D. Strategi dan Program Kerja",
      icon: TrendingUp,
      colorScheme: {
        bg: "bg-amber-50/70",
        border: "border-amber-100",
        hoverBg: "bg-amber-50/90",
        iconColor: "text-amber-500",
        gradient: "from-amber-300 to-orange-300",
        indicatorBorder: "border-amber-300",
      },
      fields: [
        { key: "strategiPengawasan", label: "Strategi Pengawasan", required: true },
        { key: "programKerja", label: "Program Kerja", required: true },
      ],
    },
    {
      id: "rencana-aksi",
      title: "E. Rencana Aksi",
      icon: Calendar,
      colorScheme: {
        bg: "bg-indigo-50/70",
        border: "border-indigo-100",
        hoverBg: "bg-indigo-50/90",
        iconColor: "text-indigo-500",
        gradient: "from-indigo-300 to-blue-300",
        indicatorBorder: "border-indigo-300",
      },
      fields: [
        { key: "jadwalKegiatan", label: "Jadwal Kegiatan", required: true },
        { key: "tanggungJawab", label: "Tanggung Jawab", required: true },
      ],
    },
    {
      id: "sumber-daya",
      title: "F. Pengalokasian Sumber Daya",
      icon: Users,
      colorScheme: {
        bg: "bg-purple-50/70",
        border: "border-purple-100",
        hoverBg: "bg-purple-50/90",
        iconColor: "text-purple-500",
        gradient: "from-purple-300 to-pink-300",
        indicatorBorder: "border-purple-300",
      },
      fields: [
        { key: "sumberDayaManusia", label: "Sumber Daya Manusia", required: true },
        { key: "anggaran", label: "Anggaran", required: true },
      ],
    },
    {
      id: "monitoring-evaluasi",
      title: "G. Monitoring dan Evaluasi",
      icon: CheckCircle2,
      colorScheme: {
        bg: "bg-teal-50/70",
        border: "border-teal-100",
        hoverBg: "bg-teal-50/90",
        iconColor: "text-teal-500",
        gradient: "from-teal-300 to-cyan-300",
        indicatorBorder: "border-teal-300",
      },
      fields: [
        { key: "indikatorKeberhasilan", label: "Indikator Keberhasilan", required: true },
        { key: "prosesMonitoring", label: "Proses Monitoring", required: true },
        { key: "evaluasi", label: "Evaluasi", required: true },
      ],
    },
  ];

  // Check if section is complete
  const isSectionComplete = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return false;
    return section.fields.every((field) => {
      const value = formData[field.key as keyof typeof formData];
      return value && value.trim().length > 0;
    });
  };

  // Calculate progress
  const completedSections = sections.filter((s) => isSectionComplete(s.id)).length;
  const progress = (completedSections / sections.length) * 100;

  const id = params?.id;
  const idString = typeof id === "string" ? id : Array.isArray(id) ? id[0] : id ? String(id) : null;

  if (!idString || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="size-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
        <p className="text-sm text-slate-600">Memuat rencana program...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="size-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Rencana Program</h1>
            <p className="text-sm text-slate-600 mt-1">
              Edit dan perbarui rencana program kepengawasan
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge
            className={cn(
              "rounded-full border-0 px-3 py-1 text-xs font-semibold",
              currentStatus === "Terbit"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-indigo-100 text-indigo-600"
            )}
          >
            {currentStatus}
          </Badge>
        </div>
      </div>

      {/* Selected Schools */}
      {selectedSekolah.length > 0 && (
        <Card className="border border-sky-200 bg-sky-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <School className="size-4 sm:size-5 text-sky-600" />
                Sekolah Binaan yang Dipilih
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleChangeSekolah}
                className="rounded-full border border-sky-200 text-sky-600 hover:bg-sky-100 text-xs"
              >
                Ubah
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSekolah.map((sekolah) => (
                <Badge
                  key={sekolah.id}
                  className="rounded-full border-0 bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700"
                >
                  {sekolah.nama}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
            Progress Penyelesaian
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-slate-600">
            {completedSections} dari {sections.length} bagian telah selesai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => {
                const isComplete = isSectionComplete(section.id);
                return (
                  <Badge
                    key={section.id}
                    className={cn(
                      "rounded-full border-0 px-2 py-1 text-xs font-semibold",
                      isComplete
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {isComplete ? "✓" : "○"} {section.title.split(". ")[0]}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Sections */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {sections.map((section) => {
          const isOpen = openSection === section.id;
          const isComplete = isSectionComplete(section.id);
          const Icon = section.icon;

          return (
            <Card
              key={section.id}
              className={cn(
                "border bg-white shadow-sm transition",
                section.colorScheme.border,
                isOpen && section.colorScheme.bg,
                !isOpen && "hover:" + section.colorScheme.hoverBg
              )}
            >
              <CardHeader
                className="cursor-pointer"
                onClick={() => setOpenSection(isOpen ? "" : section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 sm:size-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-md",
                        section.colorScheme.gradient
                      )}
                    >
                      <Icon className={cn("size-5 sm:size-6", section.colorScheme.iconColor.replace("text-", "text-white"))} />
                    </div>
                    <div>
                      <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-slate-600 mt-1">
                        {section.fields.length} field
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isComplete && (
                      <CheckCircle2 className="size-5 text-emerald-600" />
                    )}
                    <ChevronDown
                      className={cn(
                        "size-5 text-slate-400 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </div>
                </div>
              </CardHeader>

              {/* Section Content */}
              {isOpen && (
                <CardContent className="space-y-4 sm:space-y-5 pt-4 sm:pt-5 border-t-0 p-3 sm:p-4 sm:px-6">
                  {section.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                        {field.label}
                        {field.required && (
                          <span className="text-rose-600">*</span>
                        )}
                      </label>
                      <RichTextEditor
                        content={formData[field.key as keyof typeof formData] as string}
                        onChange={(content) => handleInputChange(field.key, content)}
                        placeholder={`Tulis ${field.label.toLowerCase()} di sini...`}
                        minHeight="200px"
                      />
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-slate-200">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-full border-0 bg-sky-600 px-6 font-semibold text-white shadow-md transition hover:bg-sky-700"
          >
            {isSubmitting ? (
              <>
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
          {currentStatus !== "Terbit" && (
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || isSubmitting}
              className="flex-1 rounded-full border-0 bg-emerald-600 px-6 font-semibold text-white shadow-md transition hover:bg-emerald-700"
            >
              {isPublishing ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Menerbitkan...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Terbitkan
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

