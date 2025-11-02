"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BuatRencanaProgramPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pengawasId = params.pengawasId as string;
  const sekolahId = searchParams.get("sekolah");

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
  const [openSection, setOpenSection] = useState<string>("pendahuluan");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulasi save
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    router.push(`/admin/pelaporan/rencana-program-kepengawasan/${pengawasId}`);
  };

  const sections = [
    {
      id: "pendahuluan",
      title: "A. Pendahuluan",
      icon: FileText,
      colorScheme: {
        bg: "bg-blue-50/70",
        border: "border-blue-100",
        hoverBg: "bg-blue-50/90",
        iconColor: "text-blue-500",
        gradient: "from-blue-300 to-cyan-300",
        indicatorBorder: "border-blue-300",
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
        bg: "bg-purple-50/70",
        border: "border-purple-100",
        hoverBg: "bg-purple-50/90",
        iconColor: "text-purple-500",
        gradient: "from-purple-300 to-pink-300",
        indicatorBorder: "border-purple-300",
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
        bg: "bg-rose-50/70",
        border: "border-rose-100",
        hoverBg: "bg-rose-50/90",
        iconColor: "text-rose-500",
        gradient: "from-rose-300 to-pink-300",
        indicatorBorder: "border-rose-300",
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
      return value && value.trim() !== "" && value !== "<p></p>";
    });
  };

  // Check if previous sections are complete
  const canOpenSection = (sectionId: string) => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === 0) return true; // First section is always accessible

    // Check if all previous sections are complete
    for (let i = 0; i < sectionIndex; i++) {
      if (!isSectionComplete(sections[i].id)) {
        return false;
      }
    }
    return true;
  };

  // Calculate progress
  const progress = useMemo(() => {
    const completedSections = sections.filter((section) => isSectionComplete(section.id)).length;
    return Math.round((completedSections / sections.length) * 100);
  }, [formData]);

  // Get section status with colorful scheme
  const getSectionStatus = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    const isComplete = isSectionComplete(sectionId);
    const isAccessible = canOpenSection(sectionId);
    const isActive = openSection === sectionId;

    if (!section) return {
      status: "pending",
      icon: FileText,
      color: "text-slate-400",
      bg: "bg-slate-50/50",
      border: "border-slate-100",
      hoverBg: "bg-slate-50/70",
      gradient: "from-slate-300 to-slate-400",
      indicatorBorder: "border-slate-300",
    };

    if (isComplete) return { 
      status: "complete", 
      icon: CheckCircle2, 
      color: section.colorScheme.iconColor, 
      bg: section.colorScheme.bg, 
      border: section.colorScheme.border,
      hoverBg: section.colorScheme.hoverBg,
      gradient: section.colorScheme.gradient,
      indicatorBorder: section.colorScheme.indicatorBorder,
    };
    if (isActive) return { 
      status: "active", 
      icon: FileText, 
      color: section.colorScheme.iconColor, 
      bg: section.colorScheme.bg, 
      border: section.colorScheme.border,
      hoverBg: section.colorScheme.hoverBg,
      gradient: section.colorScheme.gradient,
      indicatorBorder: section.colorScheme.indicatorBorder,
    };
    if (!isAccessible) return { 
      status: "locked", 
      icon: Lock, 
      color: "text-slate-300", 
      bg: "bg-slate-50/30", 
      border: "border-slate-100",
      hoverBg: "bg-slate-50/30",
      gradient: "from-slate-200 to-slate-300",
      indicatorBorder: "border-slate-200",
    };
    return { 
      status: "pending", 
      icon: FileText, 
      color: section.colorScheme.iconColor.replace("500", "400"), 
      bg: section.colorScheme.bg.replace("/70", "/50"),
      border: "border-slate-100",
      hoverBg: section.colorScheme.bg,
      gradient: section.colorScheme.gradient,
      indicatorBorder: section.colorScheme.indicatorBorder,
    };
  };

  const toggleSection = (sectionId: string) => {
    if (!canOpenSection(sectionId)) return;
    setOpenSection(openSection === sectionId ? "" : sectionId);
  };

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
            <div className="flex size-7 sm:size-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-300 to-cyan-300 text-white shadow-sm shrink-0">
              <FileText className="size-3.5 sm:size-4" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-700 truncate">
              Buat Rencana Program
            </h1>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-0 bg-sky-50/50 text-sky-600 hover:bg-sky-100/50 shadow-sm shrink-0 w-full sm:w-auto"
        >
          <Download className="size-4 sm:mr-2" />
          <span className="hidden sm:inline">Unduh PDF</span>
        </Button>
      </div>

      {/* Progress Indicator */}
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-md">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-300 to-cyan-300 text-white shadow-sm">
                <TrendingUp className="size-4 sm:size-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-medium text-slate-600">Progress Pengisian</h3>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                  {sections.filter((s) => isSectionComplete(s.id)).length} dari {sections.length} section selesai
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xl sm:text-2xl font-semibold text-sky-500">{progress}%</div>
            </div>
          </div>
          <div className="w-full h-2 sm:h-2.5 bg-slate-100/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-300 via-purple-300 via-emerald-300 via-amber-300 via-indigo-300 via-rose-300 to-teal-300 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Section Indicators - Mobile: Scrollable, Desktop: Full */}
          <div className="flex items-center gap-1 sm:gap-0 sm:justify-between overflow-x-auto pb-2 sm:pb-0 mt-3 sm:mt-4 -mx-1 px-1 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {sections.map((section, index) => {
              const status = getSectionStatus(section.id);
              const StatusIcon = status.icon;
              return (
                <div
                  key={section.id}
                  className={cn(
                    "flex flex-col items-center gap-1 relative shrink-0 sm:flex-1",
                    index < sections.length - 1 && "after:content-[''] after:absolute after:top-2.5 after:left-full after:w-full after:h-px after:bg-slate-200/60 after:-z-10 hidden sm:block"
                  )}
                  style={{ minWidth: "60px" }}
                >
                  <div
                    className={cn(
                      "flex size-5 sm:size-6 items-center justify-center rounded-full border transition-all duration-300 shrink-0",
                      status.status === "locked" && "bg-slate-50/30 border-slate-200",
                      status.status !== "locked" && `bg-gradient-to-br ${status.gradient} border-white/60 shadow-sm`
                    )}
                  >
                    {status.status === "locked" ? (
                      <StatusIcon className="size-3 sm:size-3.5 text-slate-300" />
                    ) : (
                      <StatusIcon className="size-3 sm:size-3.5 text-white" />
                    )}
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-medium text-slate-400 text-center leading-tight whitespace-nowrap">
                    {section.title.split(". ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
        {sections.map((section) => {
          const isAccessible = canOpenSection(section.id);
          const isComplete = isSectionComplete(section.id);
          const isOpen = openSection === section.id;
          const status = getSectionStatus(section.id);
          const SectionIcon = section.icon;

          return (
            <Card
              key={section.id}
              className={cn(
                "relative overflow-hidden border-0 transition-all duration-300",
                "bg-white/95 backdrop-blur-sm",
                isOpen ? "shadow-lg" : "shadow-md hover:shadow-lg",
                !isAccessible && "opacity-60 cursor-not-allowed"
              )}
            >
              {/* Section Header */}
              <CardHeader
                className={cn(
                  "cursor-pointer transition-all duration-200 p-3 sm:p-4",
                  isOpen ? status.hoverBg : "bg-white/50 hover:bg-slate-50/50",
                  !isAccessible && "cursor-not-allowed hover:bg-white/50"
                )}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className={cn(
                      "flex size-10 sm:size-12 items-center justify-center rounded-xl shadow-sm transition-all duration-300 shrink-0",
                      status.status === "locked" && status.bg,
                      status.status !== "locked" && `bg-gradient-to-br ${status.gradient} shadow-md`,
                      isOpen && "scale-105"
                    )}>
                      <SectionIcon className={cn(
                        "size-4 sm:size-5",
                        status.status === "locked" ? "text-slate-300" : "text-white"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm sm:text-base md:text-lg font-medium text-slate-700 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="truncate">{section.title}</span>
                        {isComplete && (
                          <CheckCircle2 className={cn("size-4 sm:size-5 shrink-0", status.color)} />
                        )}
                        {!isAccessible && (
                          <Lock className="size-3.5 sm:size-4 text-slate-300 shrink-0" />
                        )}
                      </CardTitle>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">
                        {section.fields.length} field
                        {isComplete && " • Selesai"}
                        {!isAccessible && " • Lengkapi section sebelumnya"}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-4 sm:size-5 text-slate-300 transition-transform duration-300 shrink-0",
                      isOpen && "transform rotate-180 text-sky-400"
                    )}
                  />
                </div>
              </CardHeader>

              {/* Section Content */}
              {isOpen && isAccessible && (
                <CardContent className="space-y-4 sm:space-y-5 pt-4 sm:pt-5 border-t-0 p-3 sm:p-4 sm:px-6">
                  {section.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600">
                        {field.label}
                        {field.required && (
                          <span className="text-rose-400">*</span>
                        )}
                      </label>
                      {field.key === "anggaran" ? (
                        <textarea
                          id={field.key}
                          required={field.required}
                          rows={4}
                          value={formData[field.key as keyof typeof formData] as string}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="block w-full rounded-xl border-0 bg-slate-50/50 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:bg-white focus:shadow-md focus:ring-2 focus:ring-sky-100/50 resize-none"
                          placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                        />
                      ) : (
                        <RichTextEditor
                          content={formData[field.key as keyof typeof formData] as string}
                          onChange={(content) => handleInputChange(field.key, content)}
                          placeholder={`Tulis ${field.label.toLowerCase()} di sini...`}
                          minHeight="200px"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              )}

              {/* Locked Message */}
              {isOpen && !isAccessible && (
                <CardContent className="pt-4 sm:pt-5 border-t-0 p-3 sm:p-4 sm:px-6">
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50/50 shadow-sm p-3 sm:p-4">
                    <Lock className="size-4 sm:size-5 text-slate-300 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-slate-500">
                        Section Terkunci
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                        Silakan lengkapi section sebelumnya terlebih dahulu untuk membuka section ini.
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

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
              type="submit"
              disabled={isSubmitting || progress < 100}
              className={cn(
                "rounded-xl bg-gradient-to-r from-sky-300 to-cyan-300 px-5 sm:px-6 py-2.5 font-medium text-white shadow-sm transition-all duration-300",
                "hover:from-sky-400 hover:to-cyan-400 hover:shadow-md hover:scale-[1.01]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                "sm:w-auto w-full order-1 sm:order-2"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Simpan Rencana Program
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

