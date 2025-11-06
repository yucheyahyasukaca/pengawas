"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  FileText,
  CheckCircle2,
  Target,
  TrendingUp,
  Calendar,
  Users,
  School,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SelectedSekolah {
  id: string | number;
  nama: string;
  npsn: string;
}

interface RencanaProgram {
  id: string;
  periode: string;
  status: string;
  form_data: any;
  sekolah_ids: string[];
  created_at: string;
  updated_at: string;
}

export default function ViewRencanaProgramPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [rencanaProgram, setRencanaProgram] = useState<RencanaProgram | null>(null);
  const [selectedSekolah, setSelectedSekolah] = useState<SelectedSekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get ID directly from params
    const id = params?.id;
    
    if (!id) {
      console.error("Params:", params, "ID:", id);
      toast({
        title: "Error",
        description: "ID tidak ditemukan di URL",
        variant: "error",
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
        variant: "error",
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
        const errorData = await response.json().catch(() => ({ error: "Gagal memuat rencana program" }));
        throw new Error(errorData.error || "Gagal memuat rencana program");
      }

      const data = await response.json();
      const rencana = data.rencanaProgram;

      if (!rencana) {
        throw new Error("Rencana program tidak ditemukan");
      }

      setRencanaProgram(rencana);

      // Load selected schools from sekolah_ids
      try {
        if (rencana.sekolah_ids && Array.isArray(rencana.sekolah_ids) && rencana.sekolah_ids.length > 0) {
          const sekolahResponse = await fetch("/api/sekolah/list");
          if (sekolahResponse.ok) {
            const sekolahData = await sekolahResponse.json();
            const sekolahList = sekolahData.sekolah || [];
            
            // Convert sekolah_ids to string for comparison if needed
            const selected = sekolahList
              .filter((s: any) => {
                const sId = String(s.id);
                return rencana.sekolah_ids.some((id: any) => String(id) === sId);
              })
              .map((s: any) => ({
                id: s.id,
                nama: s.nama_sekolah || s.nama || "Nama tidak tersedia",
                npsn: s.npsn || "-",
              }));
            
            setSelectedSekolah(selected);
          }
        }
      } catch (schoolError) {
        console.error("Error loading schools:", schoolError);
        // Don't throw error, just log it
      }
    } catch (error) {
      console.error("Error loading rencana program:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal memuat rencana program",
        variant: "error",
      });
      // Don't redirect immediately, let user see the error
      setTimeout(() => {
        router.push("/pengawas/perencanaan/rencana-program");
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    toast({
      title: "Info",
      description: "Fitur export PDF akan segera tersedia",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  const id = params?.id;
  const idString = typeof id === "string" ? id : Array.isArray(id) ? id[0] : id ? String(id) : null;

  if (!idString || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="size-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="text-sm text-slate-600">Memuat rencana program...</p>
      </div>
    );
  }

  if (!rencanaProgram) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-sm text-slate-600">Rencana program tidak ditemukan</p>
        <Button onClick={() => router.push("/pengawas/perencanaan/rencana-program")}>
          Kembali ke Daftar
        </Button>
      </div>
    );
  }

  const formData = rencanaProgram.form_data || {};

  const sections = [
    {
      id: "pendahuluan",
      title: "A. Pendahuluan",
      icon: FileText,
      fields: [
        { key: "latarBelakang", label: "Latar Belakang" },
        { key: "tujuan", label: "Tujuan" },
      ],
    },
    {
      id: "analisis-situasi",
      title: "B. Analisis Situasi",
      icon: Target,
      fields: [
        { key: "profilSekolah", label: "Profil Sekolah" },
        { key: "identifikasiMasalah", label: "Identifikasi Masalah" },
      ],
    },
    {
      id: "tujuan-sasaran",
      title: "C. Tujuan dan Sasaran",
      icon: CheckCircle2,
      fields: [
        { key: "tujuanJangkaPanjang", label: "Tujuan Jangka Panjang" },
        { key: "sasaranJangkaPendek", label: "Sasaran Jangka Pendek" },
      ],
    },
    {
      id: "strategi-program",
      title: "D. Strategi dan Program Kerja",
      icon: TrendingUp,
      fields: [
        { key: "strategiPengawasan", label: "Strategi Pengawasan" },
        { key: "programKerja", label: "Program Kerja" },
      ],
    },
    {
      id: "rencana-aksi",
      title: "E. Rencana Aksi",
      icon: Calendar,
      fields: [
        { key: "jadwalKegiatan", label: "Jadwal Kegiatan" },
        { key: "tanggungJawab", label: "Tanggung Jawab" },
      ],
    },
    {
      id: "sumber-daya",
      title: "F. Pengalokasian Sumber Daya",
      icon: Users,
      fields: [
        { key: "sumberDayaManusia", label: "Sumber Daya Manusia" },
        { key: "anggaran", label: "Anggaran" },
      ],
    },
    {
      id: "monitoring-evaluasi",
      title: "G. Monitoring dan Evaluasi",
      icon: CheckCircle2,
      fields: [
        { key: "indikatorKeberhasilan", label: "Indikator Keberhasilan" },
        { key: "prosesMonitoring", label: "Proses Monitoring" },
        { key: "evaluasi", label: "Evaluasi" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="size-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Rencana Program Kepengawasan</h1>
            <p className="text-sm text-slate-600 mt-1">
              Periode: {rencanaProgram.periode || "Tahun " + new Date().getFullYear()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className={cn(
              "rounded-full border-0 px-4 py-1.5 text-sm font-semibold",
              rencanaProgram.status === "Terbit"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-indigo-100 text-indigo-600"
            )}
          >
            {rencanaProgram.status}
          </Badge>
          <Button
            onClick={handleExportPDF}
            className="rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-lg hover:scale-105"
          >
            <Download className="size-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* School Info */}
      {selectedSekolah.length > 0 && (
        <Card className="border border-indigo-200 bg-indigo-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <School className="size-5 text-indigo-600" />
              Sekolah Binaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSekolah.map((sekolah) => (
                <Badge
                  key={sekolah.id}
                  className="rounded-full border-0 bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-700"
                >
                  {sekolah.nama}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Info */}
      <Card className="border border-slate-200 bg-slate-50/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500 font-medium mb-1">Dibuat</p>
              <p className="text-slate-900 font-semibold">{formatDate(rencanaProgram.created_at)}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">Diperbarui</p>
              <p className="text-slate-900 font-semibold">{formatDate(rencanaProgram.updated_at)}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-1">Status</p>
              <p className="text-slate-900 font-semibold">{rencanaProgram.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className="border border-slate-200 bg-white shadow-sm"
            >
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-md">
                    <Icon className="size-5" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {section.fields.map((field) => {
                    const content = formData[field.key] || "";

                    if (!content || (typeof content === "string" && content.trim() === "")) {
                      return (
                        <div key={field.key} className="space-y-2">
                          <h3 className="text-base font-bold text-slate-900 mb-3">
                            {field.label}
                          </h3>
                          <p className="text-slate-500 italic">Tidak ada konten</p>
                        </div>
                      );
                    }

                    return (
                      <div key={field.key} className="space-y-3">
                        <h3 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">
                          {field.label}
                        </h3>
                        <div
                          className="prose prose-slate max-w-none [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:my-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:my-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:my-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:my-2 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_em]:italic [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-3 [&_ul]:text-slate-700 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-3 [&_ol]:text-slate-700 [&_li]:my-2 [&_li]:text-slate-700 [&_blockquote]:border-l-4 [&_blockquote]:border-rose-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-3"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
        <Button
          className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:from-indigo-600 hover:to-blue-600 hover:shadow-lg hover:scale-105"
          asChild
        >
          <Link href={`/pengawas/perencanaan/rencana-program/${idString}/edit`}>
            <FileText className="size-4 mr-2" />
            Edit Rencana Program
          </Link>
        </Button>
        <Button
          onClick={handleExportPDF}
          className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-lg hover:scale-105"
        >
          <Download className="size-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}

