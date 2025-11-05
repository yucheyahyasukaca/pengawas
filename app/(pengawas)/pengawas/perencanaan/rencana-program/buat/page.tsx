"use client";

import { useRouter } from "next/navigation";
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

interface SelectedSekolah {
  id: string | number;
  nama: string;
  npsn: string;
}

export default function BuatRencanaProgramPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedSekolah, setSelectedSekolah] = useState<SelectedSekolah[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);

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
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStep, setAiStep] = useState<"indikator" | "form" | "generating">("indikator");
  const [selectedIndikator, setSelectedIndikator] = useState<string[]>([]);
  const [indikatorData, setIndikatorData] = useState<Record<string, { skorTahunLalu: number; skorTahunIni: number; sekolah: string }[]>>({});
  const [aiFormData, setAiFormData] = useState({
    akarMasalah: "",
    harapan: "",
    rencanaKegiatan: "",
    ideProgram: "",
  });

  // Load selected schools from sessionStorage
  useEffect(() => {
    const loadSelectedSchools = async () => {
      try {
        const storedSelectedIds = sessionStorage.getItem("rencana_program_selected_sekolah");
        
        if (!storedSelectedIds) {
          // No schools selected, redirect to pilih-sekolah
          router.push("/pengawas/perencanaan/rencana-program/pilih-sekolah");
          return;
        }

        const selectedIds: (string | number)[] = JSON.parse(storedSelectedIds);
        
        if (selectedIds.length === 0) {
          router.push("/pengawas/perencanaan/rencana-program/pilih-sekolah");
          return;
        }

        // Fetch school details
        const sekolahResponse = await fetch("/api/sekolah/list");
        if (!sekolahResponse.ok) {
          throw new Error("Gagal memuat data sekolah");
        }

        const sekolahData = await sekolahResponse.json();
        const allSekolah = sekolahData.sekolah || [];

        const selectedSchools = allSekolah
          .filter((sekolah: any) => selectedIds.includes(sekolah.id))
          .map((sekolah: any) => ({
            id: sekolah.id,
            nama: sekolah.nama_sekolah,
            npsn: sekolah.npsn || "-",
          }));

        setSelectedSekolah(selectedSchools);
      } catch (error) {
        console.error("Error loading selected schools:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data sekolah yang dipilih",
          variant: "destructive",
        });
        router.push("/pengawas/perencanaan/rencana-program/pilih-sekolah");
      } finally {
        setIsLoadingSchools(false);
      }
    };

    loadSelectedSchools();
  }, [router, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeSekolah = () => {
    // Clear selected schools and redirect to pilih-sekolah
    sessionStorage.removeItem("rencana_program_selected_sekolah");
    router.push("/pengawas/perencanaan/rencana-program/pilih-sekolah");
  };

  const handleResetDialog = () => {
    setIsAIDialogOpen(false);
    setAiStep("indikator");
    setSelectedIndikator([]);
    setIndikatorData({});
    setAiFormData({
      akarMasalah: "",
      harapan: "",
      rencanaKegiatan: "",
      ideProgram: "",
    });
  };

  const indikatorList = [
    { code: "A.1", name: "Kemampuan Literasi" },
    { code: "A.2", name: "Kemampuan Numerasi" },
    { code: "A.3", name: "Karakter" },
    { code: "C.3", name: "Pengalaman Pelatihan PTK" },
    { code: "D.1", name: "Kualitas Pembelajaran" },
    { code: "D.2", name: "Refleksi dan perbaikan pembelajaran oleh guru" },
    { code: "D.3", name: "Kepemimpinan instruksional" },
    { code: "D.4", name: "Iklim keamanan satuan pendidikan" },
    { code: "D.6", name: "Iklim Kesetaraan Gender" },
    { code: "D.8", name: "Iklim Kebinekaan" },
    { code: "D.10", name: "Iklim Inklusivitas" },
    { code: "E.1", name: "Partisipasi warga satuan pendidikan" },
    { code: "E.2", name: "Proporsi pemanfaatan sumber daya sekolah untuk peningkatan mutu" },
    { code: "E.3", name: "Pemanfaatan TIK untuk pengelolaan anggaran" },
    { code: "E.5", name: "Program dan kebijakan satuan pendidikan" },
  ];

  const toggleIndikator = (indikatorCode: string) => {
    setSelectedIndikator((prev) => {
      if (prev.includes(indikatorCode)) {
        return prev.filter((i) => i !== indikatorCode);
      } else {
        return [...prev, indikatorCode];
      }
    });
  };

  const handleLoadIndikatorData = async () => {
    if (selectedIndikator.length === 0) {
      toast({
        title: "Peringatan",
        description: "Silakan pilih minimal satu indikator utama",
        variant: "destructive",
      });
      return;
    }

    // Simulate loading data from API
    // In real implementation, this would fetch from API based on selected schools
    const mockData: Record<string, { skorTahunLalu: number; skorTahunIni: number; sekolah: string }[]> = {};
    
    selectedIndikator.forEach((indCode) => {
      mockData[indCode] = selectedSekolah.map((sekolah) => {
        const skorTahunLalu = Math.random() * 40 + 50; // 50-90
        const selisih = (Math.random() - 0.5) * 20; // -10 to +10
        const skorTahunIni = Math.max(0, Math.min(100, skorTahunLalu + selisih));
        return {
          skorTahunLalu: Math.round(skorTahunLalu * 10) / 10,
          skorTahunIni: Math.round(skorTahunIni * 10) / 10,
          sekolah: sekolah.nama,
        };
      });
    });

    setIndikatorData(mockData);
    setAiStep("form");
  };

  const handleGenerateAllFields = async () => {
    if (!aiFormData.akarMasalah || !aiFormData.harapan || !aiFormData.rencanaKegiatan || !aiFormData.ideProgram) {
      toast({
        title: "Peringatan",
        description: "Silakan lengkapi semua field (Akar Masalah, Harapan, Rencana Kegiatan, Ide Program)",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setAiStep("generating");
    
    try {
      // Simulate AI generation delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Format user input: convert short phrases to complete sentences
      const formatUserInput = (input: string): string => {
        if (!input || input.trim().length === 0) return input;
        
        let formatted = input.trim();
        
        // Capitalize first letter
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
        
        // Check if it ends with punctuation
        const endsWithPunctuation = /[.!?]$/.test(formatted);
        
        // If it's a very short phrase (less than 30 chars), expand it into a complete sentence
        if (formatted.length < 30 && !formatted.includes('.') && !formatted.includes('!') && !formatted.includes('?')) {
          const lowerFormatted = formatted.toLowerCase();
          
          // Check if it's already a complete sentence (has verb)
          const hasVerb = /(membuat|mengembangkan|meningkatkan|melakukan|melaksanakan|menyusun|merancang|mengadakan|menyelenggarakan|melatih|mendampingi|mengawasi|mengevaluasi|memantau|mengoptimalkan|memperbaiki|mengatasi|menyelesaikan|mengurangi|menambah|mengimplementasikan)/i.test(lowerFormatted);
          
          // If it doesn't have a verb, it's likely a noun phrase - expand it
          if (!hasVerb) {
            // Check what type of phrase it is and expand accordingly
            if (lowerFormatted.includes('kurang') || lowerFormatted.includes('tidak ada') || lowerFormatted.includes('belum ada')) {
              formatted = `Masalah utama yang dihadapi adalah ${formatted.toLowerCase()}.`;
            } else if (lowerFormatted.includes('kegiatan') || lowerFormatted.includes('program') || lowerFormatted.includes('aktivitas')) {
              formatted = `Program ini akan mengembangkan ${formatted.toLowerCase()} yang efektif dan bermakna.`;
            } else if (lowerFormatted.includes('peningkatan') || lowerFormatted.includes('peningkatan')) {
              formatted = `Fokus utama adalah pada ${formatted.toLowerCase()} secara berkelanjutan.`;
            } else {
              // Default: expand as a problem statement or goal
              formatted = `${formatted} menjadi fokus utama dalam program ini.`;
            }
          } else {
            // Has verb, just add period if needed
            if (!endsWithPunctuation) {
              formatted += '.';
            }
          }
        } else {
          // Longer text, just add period if no punctuation at the end
          if (!endsWithPunctuation) {
            formatted += '.';
          }
        }
        
        return formatted;
      };

      // Format all AI form data
      const formattedFormData = {
        akarMasalah: formatUserInput(aiFormData.akarMasalah),
        harapan: formatUserInput(aiFormData.harapan),
        rencanaKegiatan: formatUserInput(aiFormData.rencanaKegiatan),
        ideProgram: formatUserInput(aiFormData.ideProgram),
      };

      // Analyze trend from indicator data
      const trendAnalysis = selectedIndikator.map((indCode) => {
        const data = indikatorData[indCode];
        const avgTahunLalu = data.reduce((sum, d) => sum + d.skorTahunLalu, 0) / data.length;
        const avgTahunIni = data.reduce((sum, d) => sum + d.skorTahunIni, 0) / data.length;
        const selisih = avgTahunIni - avgTahunLalu;
        const trend = selisih > 2 ? "naik" : selisih < -2 ? "turun" : "stabil";
        const indikatorName = indikatorList.find((i) => i.code === indCode)?.name || indCode;
        
        return {
          code: indCode,
          name: indikatorName,
          trend,
          selisih: Math.abs(selisih),
          avgTahunLalu: Math.round(avgTahunLalu * 10) / 10,
          avgTahunIni: Math.round(avgTahunIni * 10) / 10,
        };
      });

      const indikatorNaik = trendAnalysis.filter((t) => t.trend === "naik");
      const indikatorTurun = trendAnalysis.filter((t) => t.trend === "turun");
      const indikatorStabil = trendAnalysis.filter((t) => t.trend === "stabil");

      // Generate professional content based on inputs
      const sekolahNames = selectedSekolah.map((s) => s.nama).join(", ");
      const jumlahSekolah = selectedSekolah.length;
      const indikatorNames = selectedIndikator.map((code) => {
        const ind = indikatorList.find((i) => i.code === code);
        return ind ? ind.name : code;
      }).join(", ");

      // Generate content for each field using formatted data
      const generatedContent = {
        latarBelakang: generateLatarBelakang(sekolahNames, jumlahSekolah, indikatorNames, trendAnalysis, formattedFormData),
        tujuan: generateTujuan(sekolahNames, indikatorNames, formattedFormData),
        profilSekolah: generateProfilSekolah(sekolahNames, jumlahSekolah, selectedSekolah),
        identifikasiMasalah: generateIdentifikasiMasalah(sekolahNames, indikatorTurun, indikatorStabil, formattedFormData),
        tujuanJangkaPanjang: generateTujuanJangkaPanjang(sekolahNames, indikatorNames, formattedFormData),
        sasaranJangkaPendek: generateSasaranJangkaPendek(indikatorTurun, indikatorNaik, formattedFormData),
        strategiPengawasan: generateStrategiPengawasan(indikatorNames, formattedFormData),
        programKerja: generateProgramKerja(indikatorNames, formattedFormData),
        jadwalKegiatan: generateJadwalKegiatan(formattedFormData),
        tanggungJawab: generateTanggungJawab(sekolahNames),
        sumberDayaManusia: generateSumberDayaManusia(sekolahNames),
        anggaran: generateAnggaran(formattedFormData),
        indikatorKeberhasilan: generateIndikatorKeberhasilan(indikatorNames, trendAnalysis),
        prosesMonitoring: generateProsesMonitoring(sekolahNames),
        evaluasi: generateEvaluasi(sekolahNames, indikatorNames),
      };

      // Fill all fields
      Object.keys(generatedContent).forEach((key) => {
        handleInputChange(key, generatedContent[key as keyof typeof generatedContent]);
      });

      setIsAIDialogOpen(false);
      handleResetDialog();
      toast({
        title: "Berhasil",
        description: "Semua field telah diisi oleh GARUDA-21 AI System",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghasilkan konten",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions to generate content
  function generateLatarBelakang(sekolahNames: string, jumlahSekolah: number, indikatorNames: string, trendAnalysis: any[], formData: any) {
    const indikatorTurun = trendAnalysis.filter((t) => t.trend === "turun");
    const indikatorNaik = trendAnalysis.filter((t) => t.trend === "naik");
    
    let content = `<p>Pendidikan merupakan investasi jangka panjang yang memegang peranan penting dalam pembangunan bangsa. Sebagai pengawas sekolah, kami memiliki tanggung jawab untuk memastikan bahwa setiap sekolah binaan dapat memberikan layanan pendidikan yang berkualitas dan bermutu. Rencana program kepengawasan ini disusun sebagai upaya sistematis untuk meningkatkan kualitas pendidikan di ${jumlahSekolah} sekolah binaan yang menjadi tanggung jawab kami, yaitu ${sekolahNames}.</p>`;

    if (indikatorTurun.length > 0) {
      content += `<p>Berdasarkan analisis data yang telah dilakukan, teridentifikasi beberapa indikator utama yang mengalami penurunan, yaitu ${indikatorTurun.map((t) => t.name).join(", ")}. Penurunan ini menunjukkan adanya tantangan yang perlu segera diatasi melalui program kepengawasan yang terstruktur dan terukur.`;
      indikatorTurun.forEach((t) => {
        content += ` Pada indikator ${t.name}, terjadi penurunan skor rata-rata dari ${t.avgTahunLalu} menjadi ${t.avgTahunIni} (penurunan ${t.selisih.toFixed(1)} poin).`;
      });
      content += `</p>`;
    }

    if (indikatorNaik.length > 0) {
      content += `<p>Di sisi positif, terdapat indikator yang mengalami peningkatan, yaitu ${indikatorNaik.map((t) => t.name).join(", ")}. Peningkatan ini menunjukkan bahwa upaya perbaikan yang telah dilakukan memberikan dampak positif dan perlu dipertahankan serta ditingkatkan lebih lanjut.</p>`;
    }

    if (formData.akarMasalah) {
      content += `<p>Berdasarkan analisis mendalam, ${formData.akarMasalah.toLowerCase()} menjadi akar masalah yang perlu mendapat perhatian khusus dalam program ini.</p>`;
    }

    content += `<p>Program ini dirancang untuk mengatasi berbagai tantangan yang dihadapi sekolah, sekaligus mempertahankan dan meningkatkan aspek-aspek yang sudah baik. Melalui pendekatan yang sistematis dan berbasis data, diharapkan semua indikator dapat mencapai standar yang diharapkan. Kolaborasi antara pengawas, kepala sekolah, dan seluruh komponen sekolah perlu ditingkatkan untuk menciptakan sinergi dalam mencapai tujuan bersama.</p>`;

    return content;
  }

  function generateTujuan(sekolahNames: string, indikatorNames: string, formData: any) {
    return `<p>Tujuan utama dari rencana program kepengawasan ini adalah untuk meningkatkan kualitas pendidikan di sekolah binaan (${sekolahNames}) melalui pendekatan yang sistematis dan terukur. Program ini difokuskan pada peningkatan indikator utama yaitu ${indikatorNames}.</p>

<p>${formData.harapan ? `Secara spesifik, program ini bertujuan untuk: ${formData.harapan}` : "Melalui program ini, diharapkan dapat tercipta lingkungan pembelajaran yang kondusif, peningkatan kompetensi guru, dan perbaikan sistem manajemen sekolah yang lebih efektif dan efisien."}</p>

<p>Program ini dirancang untuk memberikan dampak positif terhadap proses pembelajaran, manajemen sekolah, dan pencapaian hasil belajar siswa di semua sekolah binaan.</p>`;
  }

  function generateProfilSekolah(sekolahNames: string, jumlahSekolah: number, sekolahList: SelectedSekolah[]) {
    return `<p>Berdasarkan data yang terkumpul, ${jumlahSekolah} sekolah binaan yang menjadi target program ini menunjukkan karakteristik yang beragam dengan berbagai tantangan dan peluang. Sekolah-sekolah tersebut adalah ${sekolahNames}.</p>

<p>Setiap sekolah memiliki karakteristik unik dalam hal kondisi sarana prasarana, kualitas sumber daya manusia, dan capaian pembelajaran siswa. Profil sekolah mencakup aspek-aspek penting seperti kondisi fisik sekolah, ketersediaan fasilitas pembelajaran, kompetensi guru dan tenaga kependidikan, serta capaian akademik dan non-akademik siswa.</p>

<p>Identifikasi profil sekolah dilakukan melalui observasi langsung, analisis dokumen, dan wawancara dengan berbagai pihak terkait untuk mendapatkan gambaran yang komprehensif tentang kondisi masing-masing sekolah binaan.</p>`;
  }

  function generateIdentifikasiMasalah(sekolahNames: string, indikatorTurun: any[], indikatorStabil: any[], formData: any) {
    let content = `<p>Melalui analisis mendalam terhadap data dan kondisi sekolah binaan (${sekolahNames}), teridentifikasi beberapa masalah utama yang perlu mendapatkan perhatian khusus:</p>`;

    if (indikatorTurun.length > 0) {
      content += `<p><strong>Masalah Berdasarkan Data Indikator:</strong> Teridentifikasi ${indikatorTurun.length} indikator utama yang mengalami penurunan, yaitu ${indikatorTurun.map((t) => t.name).join(", ")}. Penurunan ini mengindikasikan adanya masalah yang perlu segera diatasi.</p>`;
    }

    if (formData.akarMasalah) {
      content += `<p><strong>Akar Masalah:</strong> ${formData.akarMasalah}</p>`;
    }

    content += `<p>Masalah-masalah tersebut memerlukan pendekatan yang sistematis dan kolaboratif untuk dapat diatasi secara efektif dan berkelanjutan. Variasi kualitas pembelajaran di kelas, kebutuhan peningkatan kompetensi guru, dan optimalisasi penggunaan sumber daya sekolah juga menjadi perhatian khusus dalam program ini.</p>`;

    return content;
  }

  function generateTujuanJangkaPanjang(sekolahNames: string, indikatorNames: string, formData: any) {
    return `<p>Tujuan jangka panjang dari program ini adalah untuk menciptakan sekolah binaan (${sekolahNames}) yang memiliki budaya mutu yang kuat, dengan indikator pencapaian yang jelas dan terukur pada aspek ${indikatorNames}.</p>

<p>Sekolah diharapkan dapat menjadi pusat pembelajaran yang unggul dan menjadi rujukan bagi sekolah lain. ${formData.harapan ? `Secara spesifik, tujuan jangka panjang mencakup: ${formData.harapan}` : "Melalui program yang berkelanjutan, sekolah akan memiliki sistem manajemen yang efektif, guru yang kompeten, dan siswa yang berprestasi."}</p>`;
  }

  function generateSasaranJangkaPendek(indikatorTurun: any[], indikatorNaik: any[], formData: any) {
    let content = `<p>Sasaran jangka pendek (satu tahun program) mencakup:</p><ul>`;

    if (indikatorTurun.length > 0) {
      content += `<li>Menghentikan tren penurunan pada indikator ${indikatorTurun.map((t) => t.name).join(", ")} dan meningkatkan skor minimal 5 poin dari kondisi saat ini</li>`;
    }

    if (indikatorNaik.length > 0) {
      content += `<li>Mempertahankan dan meningkatkan lebih lanjut capaian pada indikator ${indikatorNaik.map((t) => t.name).join(", ")}</li>`;
    }

    content += `<li>Meningkatkan capaian pembelajaran siswa minimal 10%</li>`;
    content += `<li>Meningkatkan kompetensi guru dalam implementasi kurikulum melalui program pelatihan dan pendampingan</li>`;
    content += `<li>Memperbaiki sistem manajemen sekolah yang lebih efisien</li>`;
    
    if (formData.rencanaKegiatan) {
      content += `<li>${formData.rencanaKegiatan}</li>`;
    }

    content += `</ul>`;

    return content;
  }

  function generateStrategiPengawasan(indikatorNames: string, formData: any) {
    return `<p>Strategi pengawasan yang akan diterapkan meliputi pendekatan supervisi akademik dan manajerial yang terintegrasi, dengan fokus pada peningkatan indikator ${indikatorNames}.</p>

<p>${formData.ideProgram ? `Strategi utama yang akan diterapkan adalah: ${formData.ideProgram}` : "Pendekatan ini dirancang untuk memberikan dukungan yang maksimal bagi peningkatan kualitas sekolah melalui pendampingan yang berkelanjutan, dan evaluasi yang objektif dan konstruktif."}</p>

<p>Strategi akan dilaksanakan melalui kombinasi supervisi langsung, pendampingan intensif, dan evaluasi berkala untuk memastikan pencapaian target yang telah ditetapkan.</p>`;
  }

  function generateProgramKerja(indikatorNames: string, formData: any) {
    let content = `<p>Program kerja mencakup berbagai kegiatan yang dirancang untuk meningkatkan indikator ${indikatorNames}, antara lain:</p><ul>`;

    if (formData.rencanaKegiatan) {
      content += `<li>${formData.rencanaKegiatan}</li>`;
    } else {
      content += `<li>Workshop peningkatan kompetensi guru</li>`;
      content += `<li>Supervisi kelas dan pendampingan pembelajaran</li>`;
      content += `<li>Pendampingan penyusunan RKS dan RKAS</li>`;
      content += `<li>Evaluasi berkala dan monitoring capaian</li>`;
    }

    if (formData.ideProgram) {
      content += `<li>Program inovatif: ${formData.ideProgram}</li>`;
    }

    content += `</ul><p>Setiap kegiatan dirancang dengan target capaian yang jelas dan terukur, serta dilengkapi dengan indikator keberhasilan yang spesifik.</p>`;

    return content;
  }

  function generateJadwalKegiatan(formData: any) {
    return `<p>Jadwal kegiatan disusun secara sistematis dengan mempertimbangkan kalender akademik dan ketersediaan sumber daya:</p>

<p><strong>Triwulan I:</strong> Persiapan dan sosialisasi program, observasi awal kondisi sekolah, dan penyusunan rencana tindak lanjut.</p>

<p><strong>Triwulan II-III:</strong> Pelaksanaan kegiatan utama seperti ${formData.rencanaKegiatan ? formData.rencanaKegiatan.toLowerCase() : "pelatihan, supervisi, dan pendampingan"} dengan intensitas yang lebih tinggi.</p>

<p><strong>Triwulan IV:</strong> Evaluasi program, monitoring capaian, dan penyusunan rencana pengembangan selanjutnya.</p>

<p>Kegiatan akan dilaksanakan secara bertahap dengan monitoring dan evaluasi di setiap tahapannya untuk memastikan pencapaian target yang telah ditetapkan.</p>`;
  }

  function generateTanggungJawab(sekolahNames: string) {
    return `<p>Tanggung jawab pelaksanaan program dibagi secara jelas antara pengawas, kepala sekolah, dan tim sekolah:</p>

<p><strong>Pengawas Sekolah:</strong> Sebagai koordinator utama, bertanggung jawab untuk merencanakan, mengawal pelaksanaan, dan mengevaluasi program kepengawasan di sekolah binaan (${sekolahNames}).</p>

<p><strong>Kepala Sekolah:</strong> Bertanggung jawab untuk mengimplementasikan program di masing-masing sekolah, memastikan partisipasi aktif guru dan tenaga kependidikan, serta melaporkan perkembangan secara berkala.</p>

<p><strong>Tim Sekolah (Guru dan Tenaga Kependidikan):</strong> Bertanggung jawab untuk melaksanakan kegiatan sesuai dengan rencana yang telah disusun dan berpartisipasi aktif dalam proses peningkatan mutu sekolah.</p>`;
  }

  function generateSumberDayaManusia(sekolahNames: string) {
    return `<p>Sumber daya manusia yang terlibat dalam program ini meliputi:</p>

<p><strong>Pengawas Sekolah</strong> sebagai koordinator utama yang akan memberikan supervisi, pendampingan, dan evaluasi secara berkala.</p>

<p><strong>Kepala Sekolah dan Wakil Kepala Sekolah</strong> di setiap sekolah binaan (${sekolahNames}) yang akan memimpin implementasi program di tingkat sekolah.</p>

<p><strong>Guru-guru Inti</strong> yang akan menjadi agen perubahan dan membantu menyebarluaskan praktik baik kepada rekan sejawat.</p>

<p><strong>Tim Manajemen Sekolah</strong> yang akan mendukung pelaksanaan program dari aspek administratif dan manajerial.</p>

<p>Setiap pihak akan diberikan pelatihan dan pendampingan yang diperlukan untuk memastikan keberhasilan program.</p>`;
  }

  function generateAnggaran(formData: any) {
    return `<p>Anggaran yang diperlukan untuk melaksanakan program ini mencakup:</p>

<ul>
<li>Biaya pelatihan dan workshop untuk peningkatan kompetensi guru</li>
<li>Biaya pendampingan dan supervisi berkala</li>
<li>Biaya evaluasi dan monitoring program</li>
<li>Biaya transportasi dan akomodasi untuk kegiatan lapangan</li>
${formData.ideProgram ? `<li>Biaya implementasi program khusus: ${formData.ideProgram}</li>` : ""}
</ul>

<p>Anggaran akan dikelola secara transparan dan akuntabel sesuai dengan perencanaan yang telah disusun, dengan prioritas pada kegiatan yang berdampak langsung terhadap peningkatan mutu pendidikan.</p>`;
  }

  function generateIndikatorKeberhasilan(indikatorNames: string, trendAnalysis: any[]) {
    const indikatorTurun = trendAnalysis.filter((t) => t.trend === "turun");
    const indikatorNaik = trendAnalysis.filter((t) => t.trend === "naik");
    
    let content = `<p>Indikator keberhasilan program meliputi:</p><ul>`;

    if (indikatorTurun.length > 0) {
      content += `<li>Peningkatan skor pada indikator ${indikatorTurun.map((t) => t.name).join(", ")} minimal 5 poin dari kondisi baseline</li>`;
    }

    if (indikatorNaik.length > 0) {
      content += `<li>Mempertahankan dan meningkatkan lebih lanjut capaian pada indikator ${indikatorNaik.map((t) => t.name).join(", ")}</li>`;
    }

    content += `<li>Peningkatan capaian pembelajaran siswa minimal 10%</li>`;
    content += `<li>Peningkatan kompetensi guru yang terukur melalui instrumen penilaian</li>`;
    content += `<li>Perbaikan sistem manajemen sekolah yang lebih efektif dan efisien</li>`;
    content += `<li>Peningkatan kepuasan stakeholder (guru, siswa, orang tua, masyarakat)</li>`;
    content += `</ul>`;

    content += `<p>Setiap indikator memiliki target capaian yang jelas dan terukur, serta dilengkapi dengan mekanisme pengukuran yang objektif.</p>`;

    return content;
  }

  function generateProsesMonitoring(sekolahNames: string) {
    return `<p>Proses monitoring dilakukan secara berkala melalui berbagai metode:</p>

<p><strong>Monitoring Berkala:</strong> Dilakukan setiap bulan melalui kunjungan langsung ke sekolah binaan (${sekolahNames}), observasi kegiatan, dan wawancara dengan berbagai pihak terkait.</p>

<p><strong>Evaluasi Dokumen:</strong> Analisis dokumen seperti RKS, RKAS, program kerja sekolah, dan laporan perkembangan untuk memastikan kesesuaian dengan rencana yang telah disusun.</p>

<p><strong>Forum Koordinasi:</strong> Pertemuan berkala dengan kepala sekolah dan tim sekolah untuk membahas perkembangan, tantangan, dan solusi yang diperlukan.</p>

<p>Hasil monitoring akan digunakan sebagai bahan evaluasi dan perbaikan program secara berkelanjutan, serta menjadi dasar untuk pengambilan keputusan strategis dalam pelaksanaan program.</p>`;
  }

  function generateEvaluasi(sekolahNames: string, indikatorNames: string) {
    return `<p>Evaluasi program dilakukan secara komprehensif di akhir periode program dengan mempertimbangkan berbagai aspek:</p>

<p><strong>Evaluasi Kuantitatif:</strong> Mengukur pencapaian target berdasarkan indikator ${indikatorNames} melalui perbandingan data baseline dengan data akhir program.</p>

<p><strong>Evaluasi Kualitatif:</strong> Menganalisis dampak program terhadap kualitas pembelajaran, kompetensi guru, dan manajemen sekolah di ${sekolahNames}.</p>

<p><strong>Evaluasi Kepuasan Stakeholder:</strong> Mengukur tingkat kepuasan guru, siswa, orang tua, dan masyarakat terhadap program yang telah dilaksanakan.</p>

<p>Hasil evaluasi akan menjadi bahan pembelajaran untuk perbaikan program selanjutnya, serta menjadi dasar untuk pengembangan program kepengawasan yang lebih efektif dan berkelanjutan di masa yang akan datang.</p>`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database via API
      const response = await fetch("/api/pengawas/rencana-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: formData,
          sekolah_ids: selectedSekolah.map((s) => s.id),
          periode: `Tahun ${new Date().getFullYear()}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Gagal menyimpan rencana program" }));
        throw new Error(errorData.error || "Gagal menyimpan rencana program");
      }

      const data = await response.json();

      // Clear selected schools from sessionStorage after successful save
      sessionStorage.removeItem("rencana_program_selected_sekolah");

      toast({
        title: "Berhasil",
        description: "Rencana program berhasil disimpan",
      });

      router.push("/pengawas/perencanaan/rencana-program");
    } catch (error) {
      console.error("Error saving rencana program:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menyimpan rencana program",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoadingSchools) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="size-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
        <p className="text-sm text-slate-600">Memuat data sekolah...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 px-3 sm:px-0 bg-slate-50 min-h-screen pb-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-4 sm:pt-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="rounded-xl hover:bg-sky-50 text-slate-700 hover:text-slate-900 shrink-0"
            >
              <ArrowLeft className="size-4 sm:mr-2" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex size-7 sm:size-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-sm shrink-0">
              <FileText className="size-3.5 sm:size-4" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 truncate">
              Buat Rencana Program
            </h1>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800 shadow-sm shrink-0 w-full sm:w-auto"
        >
          <Download className="size-4 sm:mr-2" />
          <span className="hidden sm:inline">Unduh PDF</span>
        </Button>
      </div>

      {/* Selected Schools Card */}
      {selectedSekolah.length > 0 && (
        <Card className="border border-indigo-200 bg-indigo-50 shadow-md">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex size-8 sm:size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-sm shrink-0">
                  <School className="size-4 sm:size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
                    Sekolah Binaan Terpilih
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSekolah.map((sekolah) => (
                      <Badge
                        key={sekolah.id}
                        className="rounded-full border-2 border-indigo-400 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800"
                      >
                        {sekolah.nama}
                        {sekolah.npsn !== "-" && ` (${sekolah.npsn})`}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 mt-2">
                    Rencana program ini akan berlaku untuk {selectedSekolah.length} sekolah binaan yang dipilih.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleChangeSekolah}
                className="rounded-xl hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 shrink-0"
              >
                <X className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">Ubah</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      <Card className="border border-slate-200 bg-white shadow-md">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-sm">
                <TrendingUp className="size-4 sm:size-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-800">Progress Pengisian</h3>
                <p className="text-[10px] sm:text-xs text-slate-600 mt-0.5">
                  {sections.filter((s) => isSectionComplete(s.id)).length} dari {sections.length} section selesai
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xl sm:text-2xl font-bold text-sky-600">{progress}%</div>
            </div>
          </div>
          <div className="w-full h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 via-emerald-500 via-amber-500 via-indigo-500 via-rose-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
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
                  <span className="text-[8px] sm:text-[9px] font-semibold text-slate-600 text-center leading-tight whitespace-nowrap">
                    {section.title.split(". ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Button */}
      <Card className="border border-purple-200 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 shadow-md">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="flex size-8 sm:size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white shadow-sm shrink-0">
                <Sparkles className="size-4 sm:size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1">
                  Bantuan AI untuk Mengisi Semua Bagian
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Gunakan GARUDA-21 AI System untuk menghasilkan konten untuk semua field di semua bagian secara otomatis
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => setIsAIDialogOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 px-4 sm:px-6 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 shrink-0 w-full sm:w-auto"
            >
              <Sparkles className="size-4 sm:size-5" />
              <span>Gunakan GARUDA-21 AI System</span>
            </Button>
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
                "relative overflow-hidden border border-slate-200 transition-all duration-300",
                "bg-white",
                isOpen ? "shadow-lg" : "shadow-md hover:shadow-lg",
                !isAccessible && "opacity-60 cursor-not-allowed"
              )}
            >
              {/* Section Header */}
              <CardHeader
                className={cn(
                  "cursor-pointer transition-all duration-200 p-3 sm:p-4",
                  isOpen ? status.hoverBg : "bg-white hover:bg-slate-50",
                  !isAccessible && "cursor-not-allowed hover:bg-white"
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
                      <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="truncate">{section.title}</span>
                        {isComplete && (
                          <CheckCircle2 className={cn("size-4 sm:size-5 shrink-0", status.color)} />
                        )}
                        {!isAccessible && (
                          <Lock className="size-3.5 sm:size-4 text-slate-400 shrink-0" />
                        )}
                      </CardTitle>
                      <p className="text-[10px] sm:text-xs text-slate-600 mt-0.5 sm:mt-1">
                        {section.fields.length} bagian
                        {isComplete && " • Selesai"}
                        {!isAccessible && " • Lengkapi section sebelumnya"}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-4 sm:size-5 text-slate-500 transition-transform duration-300 shrink-0",
                      isOpen && "transform rotate-180 text-sky-600"
                    )}
                  />
                </div>
              </CardHeader>

              {/* Section Content */}
              {isOpen && isAccessible && (
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

              {/* Locked Message */}
              {isOpen && !isAccessible && (
                <CardContent className="pt-4 sm:pt-5 border-t-0 p-3 sm:p-4 sm:px-6">
                  <div className="flex items-start gap-3 rounded-xl bg-slate-100 border border-slate-200 shadow-sm p-3 sm:p-4">
                    <Lock className="size-4 sm:size-5 text-slate-500 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-700">
                        Section Terkunci
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-600 mt-1">
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
        <Card className="border border-slate-200 bg-white shadow-md">
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-4 sm:pt-6 p-4 sm:p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm sm:w-auto w-full order-2 sm:order-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || progress < 100}
              className={cn(
                "rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 sm:px-6 py-2.5 font-semibold text-white shadow-sm transition-all duration-300",
                "hover:from-sky-600 hover:to-cyan-600 hover:shadow-md hover:scale-[1.01]",
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

      {/* AI Dialog */}
      <Dialog open={isAIDialogOpen} onOpenChange={handleResetDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[calc(100vw-2.5rem)] sm:w-full mx-0 p-4 sm:p-6">
          <DialogHeader className="px-0 sm:px-0">
            <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-xl font-bold text-slate-900">
              <div className="flex size-8 sm:size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 shadow-md shrink-0">
                <Sparkles className="size-4 sm:size-5 text-white" />
              </div>
              <span className="leading-tight">GARUDA-21 AI System</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 mt-2">
              {aiStep === "indikator" && "Pilih indikator utama yang akan dianalisis untuk menghasilkan rencana program kepengawasan."}
              {aiStep === "form" && "Lengkapi informasi berikut untuk menghasilkan konten yang lebih akurat dan relevan."}
              {aiStep === "generating" && "Sistem sedang menghasilkan konten profesional untuk semua bagian..."}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Select Indicators */}
          {aiStep === "indikator" && (
            <div className="space-y-4 py-2 sm:py-4">
              <Card className="border border-purple-200 bg-purple-50/30">
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
                    Pilih Indikator Utama
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-slate-600">
                    Pilih satu atau lebih indikator utama yang akan dianalisis untuk semua sekolah binaan yang dipilih
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                    {indikatorList.map((indikator) => {
                      const isSelected = selectedIndikator.includes(indikator.code);
                      return (
                        <button
                          key={indikator.code}
                          type="button"
                          onClick={() => toggleIndikator(indikator.code)}
                          className={cn(
                            "text-left p-3 rounded-xl border-2 transition-all",
                            isSelected
                              ? "border-purple-500 bg-purple-100 shadow-md"
                              : "border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-purple-700 mb-1">
                                {indikator.code}
                              </div>
                              <div className="text-xs sm:text-sm font-medium text-slate-900">
                                {indikator.name}
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="size-5 text-purple-600 shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedIndikator.length > 0 && (
                    <div className="mt-4 p-3 bg-purple-100 rounded-xl">
                      <p className="text-xs sm:text-sm font-medium text-purple-900">
                        {selectedIndikator.length} indikator dipilih
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Show Data & Form */}
          {aiStep === "form" && (
            <div className="space-y-4 py-2 sm:py-4">
              {/* Indicator Data Table */}
              {Object.keys(indikatorData).length > 0 && (
                <Card className="border border-purple-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
                      Data Skor Indikator (Tahun Lalu vs Tahun Ini)
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-600">
                      Data skor untuk semua sekolah binaan yang dipilih
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 overflow-x-auto">
                      {Object.entries(indikatorData).map(([indCode, data]) => {
                        const indikator = indikatorList.find((i) => i.code === indCode);
                        const avgTahunLalu = data.reduce((sum, d) => sum + d.skorTahunLalu, 0) / data.length;
                        const avgTahunIni = data.reduce((sum, d) => sum + d.skorTahunIni, 0) / data.length;
                        const selisih = avgTahunIni - avgTahunLalu;
                        const trend = selisih > 2 ? "naik" : selisih < -2 ? "turun" : "stabil";
                        
                        return (
                          <div key={indCode} className="border border-slate-200 rounded-xl p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-xs font-semibold text-purple-700 mb-1">
                                  {indCode}
                                </div>
                                <div className="text-sm font-semibold text-slate-900">
                                  {indikator?.name || indCode}
                                </div>
                              </div>
                              <Badge
                                className={cn(
                                  "text-xs font-semibold",
                                  trend === "naik" && "bg-emerald-100 text-emerald-700 border-emerald-300",
                                  trend === "turun" && "bg-rose-100 text-rose-700 border-rose-300",
                                  trend === "stabil" && "bg-amber-100 text-amber-700 border-amber-300"
                                )}
                              >
                                {trend === "naik" ? "↑ Naik" : trend === "turun" ? "↓ Turun" : "→ Stabil"}
                              </Badge>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs sm:text-sm">
                                <thead>
                                  <tr className="border-b border-slate-200">
                                    <th className="text-left p-2 font-semibold text-slate-700">Sekolah</th>
                                    <th className="text-center p-2 font-semibold text-slate-700">Tahun Lalu</th>
                                    <th className="text-center p-2 font-semibold text-slate-700">Tahun Ini</th>
                                    <th className="text-center p-2 font-semibold text-slate-700">Selisih</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.map((item, idx) => {
                                    const itemSelisih = item.skorTahunIni - item.skorTahunLalu;
                                    return (
                                      <tr key={idx} className="border-b border-slate-100">
                                        <td className="p-2 text-slate-900">{item.sekolah}</td>
                                        <td className="p-2 text-center text-slate-700">{item.skorTahunLalu.toFixed(1)}</td>
                                        <td className="p-2 text-center text-slate-700">{item.skorTahunIni.toFixed(1)}</td>
                                        <td className={cn(
                                          "p-2 text-center font-semibold",
                                          itemSelisih > 0 ? "text-emerald-600" : itemSelisih < 0 ? "text-rose-600" : "text-slate-600"
                                        )}>
                                          {itemSelisih > 0 ? "+" : ""}{itemSelisih.toFixed(1)}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  <tr className="bg-slate-50 font-semibold">
                                    <td className="p-2 text-slate-900">Rata-rata</td>
                                    <td className="p-2 text-center text-slate-700">{avgTahunLalu.toFixed(1)}</td>
                                    <td className="p-2 text-center text-slate-700">{avgTahunIni.toFixed(1)}</td>
                                    <td className={cn(
                                          "p-2 text-center",
                                          selisih > 0 ? "text-emerald-600" : selisih < 0 ? "text-rose-600" : "text-slate-600"
                                        )}>
                                          {selisih > 0 ? "+" : ""}{selisih.toFixed(1)}
                                        </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Form Fields */}
              <Card className="border border-purple-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base font-semibold text-slate-900">
                    Informasi Tambahan
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-slate-600">
                    Lengkapi informasi berikut untuk menghasilkan konten yang lebih akurat
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-800">
                      Akar Masalah <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      value={aiFormData.akarMasalah}
                      onChange={(e) => setAiFormData({ ...aiFormData, akarMasalah: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
                      placeholder="Jelaskan akar masalah yang menjadi fokus program ini..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-800">
                      Harapan (Tujuan untuk Guru, Murid, Sekolah) <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      value={aiFormData.harapan}
                      onChange={(e) => setAiFormData({ ...aiFormData, harapan: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
                      placeholder="Jelaskan harapan/tujuan yang ingin dicapai untuk guru, murid, dan sekolah..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-800">
                      Rencana Kegiatan <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      value={aiFormData.rencanaKegiatan}
                      onChange={(e) => setAiFormData({ ...aiFormData, rencanaKegiatan: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
                      placeholder="Jelaskan rencana kegiatan yang akan dilakukan untuk mencapai tujuan..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-800">
                      Ide Program <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      value={aiFormData.ideProgram}
                      onChange={(e) => setAiFormData({ ...aiFormData, ideProgram: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
                      placeholder="Jelaskan ide program atau strategi inovatif yang akan diterapkan..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Generating */}
          {aiStep === "generating" && (
            <div className="space-y-4 py-8 sm:py-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="size-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                    GARUDA-21 AI System sedang bekerja...
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Sistem sedang menganalisis data dan menghasilkan konten profesional untuk semua bagian
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 px-0 sm:px-0">
            {aiStep !== "generating" && (
              <Button
                type="button"
                variant="outline"
                onClick={aiStep === "form" ? () => setAiStep("indikator") : handleResetDialog}
                className="rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto order-2 sm:order-1"
              >
                {aiStep === "form" ? "Kembali" : "Batal"}
              </Button>
            )}
            {aiStep === "indikator" && (
              <Button
                type="button"
                onClick={handleLoadIndikatorData}
                disabled={selectedIndikator.length === 0}
                className="rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 px-4 sm:px-6 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto order-1 sm:order-2 text-sm sm:text-base"
              >
                Lanjutkan
              </Button>
            )}
            {aiStep === "form" && (
              <Button
                type="button"
                onClick={handleGenerateAllFields}
                disabled={isGenerating || !aiFormData.akarMasalah || !aiFormData.harapan || !aiFormData.rencanaKegiatan || !aiFormData.ideProgram}
                className="rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 px-4 sm:px-6 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto order-1 sm:order-2 text-sm sm:text-base"
              >
                <Sparkles className="size-4 mr-2" />
                Generate Semua Field
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
