"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
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
  ArrowLeft,
  School,
  FileText,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Hash,
  Users,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface IdentitasSekolah {
  namaSekolah: string;
  namaKepalaSekolah: string;
  nip: string;
  kabupatenKota: string;
  tanggalSupervisi: string;
}

interface IndikatorData {
  id: string;
  skor: number | null;
  catatan: string;
}

interface SekolahData {
  id: string | number;
  nama: string;
  npsn: string;
  jenjang: string;
  alamat: string;
  kabupaten: string;
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

// Definisi indikator untuk Instrumen Persiapan Kebiasaan Anak Indonesia Hebat
const indikatorPersiapan = [
  {
    id: "indikator-1",
    pertanyaan: "Sekolah sudah mempunyai buku Panduan Penerapan Gerakan Tujuh Kebiasaan Anak",
    opsi: [
      { skor: 0, label: "belum mempunyai" },
      { skor: 1, label: "mempunyai hanya dalam bentuk soft copy" },
      { skor: 2, label: "mempunyai dalam bentuk soft copy dan hard copy" },
    ],
  },
  {
    id: "indikator-2",
    pertanyaan: "Sekolah sudah melakukan sosialisasi pelaksanaan Gerakan Tujuh Kebiasaan Anak Indonesia Hebat pada warga sekolah",
    opsi: [
      { skor: 0, label: "belum melakukan sosialisasi" },
      { skor: 1, label: "hanya pada guru dan tenaga kependidikan" },
      { skor: 2, label: "pada guru, tenaga kependidikan, dan peserta didik" },
    ],
  },
  {
    id: "indikator-3",
    pertanyaan: "Sekolah sudah melakukan sosialisasi pelaksanaan Gerakan Tujuh Kebiasaan Anak Indonesia Hebat pada orang tua/wali murid",
    opsi: [
      { skor: 0, label: "belum melakukan sosialisasi" },
      { skor: 1, label: "sudah dilakukan secara daring/WA Group kelas" },
      { skor: 2, label: "Sudah dilakukan secara luring" },
    ],
  },
  {
    id: "indikator-4",
    pertanyaan: "Sekolah sudah menciptakan suasana lingkungan belajar/lingkungan sekolah yang mendukung pelaksanaan Gerakan Tujuh Kebiasaan Anak",
    opsi: [
      { skor: 0, label: "belum ada" },
      { skor: 1, label: "sudah ada melalui poster tetapi masih minim" },
      { skor: 2, label: "Sudah ada dan lengkap seperti poster dan memutar lagu-lagu anak Indonesia hebat" },
    ],
  },
  {
    id: "indikator-5",
    pertanyaan: "Sekolah sudah mempunyai kepanitiaan untuk melaksanakan gerakan tujuh kebiasaan anak",
    opsi: [
      { skor: 0, label: "belum mempunyai" },
      { skor: 1, label: "sudah ada tetapi belum lengkap" },
      { skor: 2, label: "sudah ada dan lengkap melibatkan guru dan orang tua/wali murid" },
    ],
  },
  {
    id: "indikator-6",
    pertanyaan: "Sekolah sudah mempunyai jadwal dan SOP pelaksanaan gerakan Tujuh Kebiasaan anak",
    opsi: [
      { skor: 0, label: "belum mempunyai" },
      { skor: 1, label: "sudah ada jadwal atau SOP tetapi belum lengkap" },
      { skor: 2, label: "sudah ada jadwal dan SOP yang lengkap" },
    ],
  },
  {
    id: "indikator-7",
    pertanyaan: "Setiap siswa sudah mempunyai buku catatan untuk pemantauan pelaksanaan gerakan tujuh kebiasaan anak Indonesia hebat sesuai ketentuan",
    opsi: [
      { skor: 0, label: "belum mempunyai" },
      { skor: 1, label: "sudah mempunyai tetapi belum tertata rapi" },
      { skor: 2, label: "sudah mempunyai dan tertata rapi atau sudah berbasis digital" },
    ],
  },
  {
    id: "indikator-8",
    pertanyaan: "Sekolah sudah memiliki sarana/aplikasi/catatan untuk mengetahui perkembangan pelaksanaan",
    opsi: [
      { skor: 0, label: "belum mempunyai" },
      { skor: 1, label: "sudah ada tetapi masih manual" },
      { skor: 2, label: "sudah ada aplikasi digital yang lengkap" },
    ],
  },
];

// Definisi indikator untuk Instrumen Pelaksanaan Kebiasaan Anak Indonesia Hebat
const indikatorPelaksanaan = [
  {
    id: "indikator-1",
    pertanyaan: "Guru dan wali kelas menginformasikan dan memberi motivasi kepada siswa untuk selalu melaksanakan 7 kebiasaan anak Indonesia hebat baik di sekolah maupun di rumah",
    opsi: [
      { skor: 0, label: "Tidak pernah" },
      { skor: 1, label: "Hanya wali kelas yang menginformasikan dan memberi motivasi" },
      { skor: 2, label: "Guru dan wali kelas sering menginformasikan dan memberi motivasi" },
    ],
  },
  {
    id: "indikator-2",
    pertanyaan: "Sekolah melaksanakan kegiatan senam anak indonesia hebat atau olah raga ringan untuk siswa",
    opsi: [
      { skor: 0, label: "belum melaksanakan" },
      { skor: 1, label: "sudah melaksanakan tetapi belum secara rutin" },
      { skor: 2, label: "sudah melaksanakan secara konsisten setiap hari" },
    ],
  },
  {
    id: "indikator-3",
    pertanyaan: "Sekolah melaksanakan kegiatan menyanyikan atau mendengarkan lagu kebangsaan Indonesia raya setiap pagi",
    opsi: [
      { skor: 0, label: "belum melaksanakan" },
      { skor: 1, label: "sudah melaksanakan tetapi tidak rutin" },
      { skor: 2, label: "sudah melaksanakan secara rutin sesuai jadwal" },
    ],
  },
  {
    id: "indikator-4",
    pertanyaan: "Sekolah membiasakan siswa melaksanakan kegiatan berdo'a sesuai agama masing-masing sebelum dan sesudah kegiatan belajar mengajar, serta kegiatan ibadah lainnya di sekolah",
    opsi: [
      { skor: 0, label: "belum melaksanakan" },
      { skor: 1, label: "sudah melaksanakan tetapi hanya berdo'a" },
      { skor: 2, label: "sudah melaksanakan secara rutin termasuk kegiatan ibadah lainnya" },
    ],
  },
  {
    id: "indikator-5",
    pertanyaan: "Siswa secara jujur mengisi catatan pelaksanaan ibadah baik di sekolah maupun di luar sekolah serta diketahui oleh orang tua/wali murid dan wali kelas",
    opsi: [
      { skor: 0, label: "belum melaksanakan" },
      { skor: 1, label: "sudah melaksanakan tetapi belum secara rutin" },
      { skor: 2, label: "sudah melaksanakan secara rutin" },
    ],
  },
  {
    id: "indikator-6",
    pertanyaan: "Siswa secara jujur mengisi catatan kegiatan belajar yang dilakukan di sekolah dan di rumah serta diketahui oleh orang tua/wali murid dan wali kelas",
    opsi: [
      { skor: 0, label: "belum melaksanakan" },
      { skor: 1, label: "sudah melaksanakan tetapi belum secara rutin" },
      { skor: 2, label: "sudah melaksanakan secara rutin" },
    ],
  },
  {
    id: "indikator-7",
    pertanyaan: "Siswa secara jujur mengisi kegiatan bermasyarakat yang dilakukan di sekolah maupun di luar sekolah serta diketahui oleh orang tua/wali murid dan wali kelas",
    opsi: [
      { skor: 0, label: "belum melaksanakan" },
      { skor: 1, label: "sudah melaksanakan tetapi belum secara rutin" },
      { skor: 2, label: "sudah melaksanakan secara rutin" },
    ],
  },
  {
    id: "indikator-8",
    pertanyaan: "Siswa secara jujur mengisi makanan bergizi yang dikonsumsi setiap hari di sekolah dan/atau di rumah serta diketahui oleh orang tua/wali murid",
    opsi: [
      { skor: 0, label: "belum melaksanakan" },
      { skor: 1, label: "sudah melaksanakan tetapi belum secara rutin" },
      { skor: 2, label: "sudah melaksanakan secara rutin" },
    ],
  },
  {
    id: "indikator-9",
    pertanyaan: "Siswa secara jujur mengisi awal waktu tidur pada malam hari yang diketahui oleh orang tua/wali murid dan wali kelas",
    opsi: [
      { skor: 0, label: "belum melaksanakan" },
      { skor: 1, label: "sudah melaksanakan tetapi belum secara rutin" },
      { skor: 2, label: "sudah melaksanakan secara rutin" },
    ],
  },
  {
    id: "indikator-10",
    pertanyaan: "Wali kelas melakukan analisis perkembangan anak dalam melaksanakan gerakan tujuh kebiasaan anak Indonesia hebat",
    opsi: [
      { skor: 0, label: "belum melaksanakan" },
      { skor: 1, label: "sudah melaksanakan tetapi belum secara rutin" },
      { skor: 2, label: "sudah melaksanakan secara rutin" },
    ],
  },
  {
    id: "indikator-11",
    pertanyaan: "Wali kelas berkoordinasi dengan orang tua/wali murid untuk memantau perkembangan gerakan 7 kebiasaan anak Indonesia hebat dan memberi laporan serta mencari jalan keluarnya",
    opsi: [
      { skor: 0, label: "belum melaksanakan" },
      { skor: 1, label: "sudah melaksanakan tetapi belum secara berkala dan belum ada solusi atau jalan keluarnya" },
      { skor: 2, label: "sudah melaksanakan secara berkala termasuk solusi atau jalan keluarnya" },
    ],
  },
];

// Fungsi untuk mendapatkan daftar indikator berdasarkan instrumen
const getIndikatorList = (instrumenId: string) => {
  if (instrumenId === "pelaksanaan-kebiasaan") {
    return indikatorPelaksanaan;
  }
  return indikatorPersiapan;
};

// Fungsi untuk generate saran otomatis berdasarkan indikator dan skor
const generateSaran = (indikatorId: string, skor: number | null, instrumenId: string): string => {
  if (skor === null) return "";

  if (instrumenId === "pelaksanaan-kebiasaan") {
    const saranMapPelaksanaan: Record<string, Record<number, string>> = {
      "indikator-1": {
        0: "Silahkan guru dan wali kelas segera menginformasikan dan memberi motivasi kepada siswa untuk selalu melaksanakan 7 kebiasaan anak Indonesia hebat baik di sekolah maupun di rumah",
        1: "Silahkan semua guru juga menginformasikan dan memberi motivasi kepada siswa, tidak hanya wali kelas",
        2: "Ok",
      },
      "indikator-2": {
        0: "Silahkan sekolah segera melaksanakan kegiatan senam anak indonesia hebat atau olah raga ringan untuk siswa",
        1: "Silahkan sekolah melaksanakan kegiatan senam anak indonesia hebat secara rutin setiap hari",
        2: "Ok",
      },
      "indikator-3": {
        0: "Silahkan sekolah segera melaksanakan kegiatan menyanyikan atau mendengarkan lagu kebangsaan Indonesia raya setiap pagi",
        1: "Silahkan sekolah melaksanakan kegiatan menyanyikan atau mendengarkan lagu kebangsaan Indonesia raya secara rutin sesuai jadwal",
        2: "Ok",
      },
      "indikator-4": {
        0: "Silahkan sekolah segera membiasakan siswa melaksanakan kegiatan berdo'a sesuai agama masing-masing sebelum dan sesudah kegiatan belajar mengajar, serta kegiatan ibadah lainnya di sekolah",
        1: "Silahkan sekolah melaksanakan kegiatan ibadah lainnya di sekolah secara rutin, tidak hanya berdo'a",
        2: "Ok",
      },
      "indikator-5": {
        0: "Silahkan sekolah meminta siswa secara rutin agar mengisi catatan pelaksanaan ibadah baik di sekolah maupun di luar sekolah serta diketahui oleh orang tua/wali murid dan wali kelas",
        1: "Silahkan sekolah meminta siswa secara rutin agar mengisi catatan pelaksanaan ibadah baik di sekolah maupun di luar sekolah serta diketahui oleh orang tua/wali murid dan wali kelas",
        2: "Ok",
      },
      "indikator-6": {
        0: "Silahkan siswa secara jujur mengisi catatan kegiatan belajar yang dilakukan di sekolah dan di rumah serta diketahui oleh orang tua/wali murid dan wali kelas secara rutin",
        1: "Silahkan siswa secara jujur mengisi catatan kegiatan belajar yang dilakukan di sekolah dan di rumah serta diketahui oleh orang tua/wali murid dan wali kelas secara rutin",
        2: "Ok",
      },
      "indikator-7": {
        0: "Silahkan siswa secara jujur mengisi kegiatan bermasyarakat yang dilakukan di sekolah maupun di luar sekolah serta diketahui oleh orang tua/wali murid dan wali kelas secara rutin",
        1: "Silahkan siswa secara jujur mengisi kegiatan bermasyarakat yang dilakukan di sekolah maupun di luar sekolah serta diketahui oleh orang tua/wali murid dan wali kelas secara rutin",
        2: "Ok",
      },
      "indikator-8": {
        0: "Sekolah meminta siswa secara jujur mengisi makanan bergizi yang dikonsumsi setiap hari di sekolah dan/atau di rumah secara rutin",
        1: "Sekolah meminta siswa secara jujur mengisi makanan bergizi yang dikonsumsi setiap hari di sekolah dan/atau di rumah secara rutin",
        2: "Ok",
      },
      "indikator-9": {
        0: "Siswa harus secara jujur mengisi awal waktu tidur pada malam hari yang diketahui oleh orang tua/wali murid dan wali kelas secara rutin",
        1: "Siswa harus secara jujur mengisi awal waktu tidur pada malam hari yang diketahui oleh orang tua/wali murid dan wali kelas secara rutin",
        2: "Ok",
      },
      "indikator-10": {
        0: "Wali kelas segera melakukan analisis perkembangan anak dalam melaksanakan gerakan tujuh kebiasaan anak Indonesia hebat",
        1: "Wali kelas melakukan analisis perkembangan anak dalam melaksanakan gerakan tujuh kebiasaan anak Indonesia hebat secara rutin",
        2: "Ok",
      },
      "indikator-11": {
        0: "Wali kelas segera berkoordinasi dengan orang tua/wali murid untuk memantau perkembangan gerakan 7 kebiasaan anak Indonesia hebat dan memberi laporan serta mencari jalan keluarnya",
        1: "Wali kelas berkoordinasi dengan orang tua/wali murid untuk memantau perkembangan gerakan 7 kebiasaan anak Indonesia hebat secara berkala termasuk solusi atau jalan keluarnya",
        2: "Ok",
      },
    };
    return saranMapPelaksanaan[indikatorId]?.[skor] || "";
  }

  // Saran untuk instrumen persiapan
  const saranMapPersiapan: Record<string, Record<number, string>> = {
    "indikator-1": {
      0: "Silahkan segera siapkan buku panduan penerapan Gerakan Tujuh Kebiasaan Anak",
      1: "Silahkan buku panduan di cetak dalam bentuk hard copy",
      2: "Ok",
    },
    "indikator-2": {
      0: "Silahkan segera lakukan sosialisasi ke semua warga sekolah",
      1: "Silahkan perluas sosialisasi hingga ke peserta didik",
      2: "Ok",
    },
    "indikator-3": {
      0: "Silahkan segera lakukan sosialisasi kepada orang tua/wali murid",
      1: "Akan lebih baik jika sosialisasi dilakukan secara luring",
      2: "Ok",
    },
    "indikator-4": {
      0: "Silahkan segera ciptakan suasana sekolah yang mendukung Gerakan Tujuh Kebiasaan Anak Indonesia Hebat, dengan poster, spanduk, dan memutar lagu-lagu anak Indonesia hebat",
      1: "Silahkan lengkapi suasana sekolah dengan poster dan memutar lagu-lagu anak Indonesia hebat",
      2: "Ok",
    },
    "indikator-5": {
      0: "Silahkan segera dibentuk kepanitiaan yang melibatkan guru dan orang tua/wali murid",
      1: "Silahkan lengkapi kepanitiaan dengan melibatkan orang tua/wali murid",
      2: "Ok",
    },
    "indikator-6": {
      0: "Silahkan segera dibuat jadwal dan SOP yang melibatkan guru dan orang tua murid",
      1: "Silahkan lengkapi jadwal dan SOP pelaksanaan gerakan Tujuh Kebiasaan anak",
      2: "Ok",
    },
    "indikator-7": {
      0: "Silahkan segera siapkan buku catatan untuk setiap siswa",
      1: "Silahkan atur buku catatan agar tertata rapi atau gunakan sistem digital",
      2: "Ok",
    },
    "indikator-8": {
      0: "Silahkan segera dirancang aplikasi digitalnya",
      1: "Silahkan kembangkan sistem digital untuk memantau perkembangan pelaksanaan",
      2: "Ok",
    },
  };

  return saranMapPersiapan[indikatorId]?.[skor] || "";
};

// Fungsi untuk generate saran global
const generateSaranGlobal = (indikatorData: Record<string, IndikatorData>, instrumenId: string): string => {
  const skorList = Object.values(indikatorData)
    .map((data) => data.skor)
    .filter((skor) => skor !== null) as number[];

  if (skorList.length === 0) {
    return "Silahkan lengkapi semua indikator terlebih dahulu";
  }

  const totalSkor = skorList.reduce((sum, skor) => sum + skor, 0);
  const maxSkor = skorList.length * 2;
  const persentase = Math.round((totalSkor / maxSkor) * 100);

  const jumlahSkor0 = skorList.filter((s) => s === 0).length;
  const jumlahSkor1 = skorList.filter((s) => s === 1).length;
  const jumlahSkor2 = skorList.filter((s) => s === 2).length;

  if (instrumenId === "pelaksanaan-kebiasaan") {
    if (persentase < 50) {
      return `Persentase pelaksanaan: ${persentase}% (Belum Siap). Silahkan segera laksanakan kegiatan yang belum dilaksanakan sehingga pelaksanaan Gerakan Tujuh Kebiasaan Anak Indonesia hebat bisa terlaksana dengan baik dan lakukan kerja sama yang baik antara siswa, guru, tenaga kependidikan, kepala Sekolah, dan Orang tua/wali murid.`;
    } else if (persentase < 75) {
      return `Persentase pelaksanaan: ${persentase}% (Kurang Siap). Beberapa kegiatan masih perlu dilaksanakan secara rutin. Silahkan tingkatkan koordinasi dan kerjasama antara semua pihak untuk melaksanakan kegiatan yang masih kurang.`;
    } else {
      return `Persentase pelaksanaan: ${persentase}% (Siap). Sekolah sudah melaksanakan Gerakan Tujuh Kebiasaan Anak Indonesia Hebat dengan baik. Tetap pertahankan dan tingkatkan kegiatan yang sudah berjalan.`;
    }
  } else {
    // Untuk instrumen persiapan
    if (persentase < 50) {
      return `Persentase kesiapan: ${persentase}% (Belum Siap). Silahkan segera lengkapi komponen yang masih kurang dan lakukan koordinasi intensif agar pelaksanaan Gerakan Tujuh Kebiasaan Anak Indonesia hebat dapat terlaksana dengan baik. Dalam pelaksanaan harus kerjasama secara intensif antara siswa, guru, tenaga kependidikan, kepala Sekolah, dan Orang tua/wali murid.`;
    } else if (persentase < 75) {
      return `Persentase kesiapan: ${persentase}% (Kurang Siap). Beberapa komponen masih perlu dilengkapi. Silahkan tingkatkan koordinasi dan kerjasama antara semua pihak untuk memperbaiki komponen yang masih kurang.`;
    } else {
      return `Persentase kesiapan: ${persentase}% (Siap). Sekolah sudah cukup siap untuk melaksanakan Gerakan Tujuh Kebiasaan Anak Indonesia Hebat. Tetap pertahankan dan tingkatkan komponen yang sudah ada.`;
    }
  }
};

export default function MonitoringDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const monitoringId = params.id as string;
  const instrumenId = params.instrumenId as string;
  const sekolahId = searchParams.get("sekolah");

  const monitoringType = monitoringTypes[monitoringId];

  const [sekolahList, setSekolahList] = useState<SekolahData[]>([]);
  const [selectedSekolah, setSelectedSekolah] = useState<SekolahData | null>(null);
  const [identitas, setIdentitas] = useState<IdentitasSekolah>({
    namaSekolah: "",
    namaKepalaSekolah: "",
    nip: "",
    kabupatenKota: "",
    tanggalSupervisi: new Date().toISOString().split("T")[0],
  });
  const [indikatorData, setIndikatorData] = useState<Record<string, IndikatorData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [monitoringId, instrumenId, sekolahId]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load sekolah yang dipilih dari sessionStorage
      const selectedSekolahIds = sessionStorage.getItem(
        `monitoring_${monitoringId}_selected_sekolah`
      );
      
      if (!selectedSekolahIds) {
        toast({
          title: "Error",
          description: "Data sekolah tidak ditemukan. Silakan pilih sekolah terlebih dahulu.",
          variant: "error",
        });
        router.push(`/pengawas/pelaksanaan/monitoring/${monitoringId}`);
        return;
      }

      const sekolahIds = JSON.parse(selectedSekolahIds) as (string | number)[];

      // Load data sekolah
      const userResponse = await fetch("/api/auth/get-current-user");
      if (!userResponse.ok) throw new Error("Gagal memuat data pengawas");

      const userData = await userResponse.json();
      const pengawas = userData.user;
      const sekolahBinaanNames = Array.isArray(pengawas.metadata?.sekolah_binaan)
        ? pengawas.metadata.sekolah_binaan
        : [];

      const sekolahResponse = await fetch("/api/sekolah/list");
      if (!sekolahResponse.ok) throw new Error("Gagal memuat data sekolah");

      const sekolahData = await sekolahResponse.json();
      const allSekolah = sekolahData.sekolah || [];

      const filteredSekolah = allSekolah
        .filter((sekolah: any) => sekolahBinaanNames.includes(sekolah.nama_sekolah))
        .filter((sekolah: any) => sekolahIds.includes(sekolah.id))
        .map((sekolah: any) => ({
          id: sekolah.id,
          nama: sekolah.nama_sekolah,
          npsn: sekolah.npsn || "-",
          jenjang: sekolah.jenjang || "-",
          alamat: sekolah.alamat ? sekolah.alamat.trim() : "",
          kabupaten: sekolah.kabupaten_kota || "-",
        }));

      setSekolahList(filteredSekolah);

      // Set selected sekolah dan load detail
      const targetSekolahId = sekolahId || (filteredSekolah.length > 0 ? filteredSekolah[0].id.toString() : null);
      
      if (targetSekolahId) {
        const found = filteredSekolah.find((s) => s.id.toString() === targetSekolahId);
        if (found) {
          setSelectedSekolah(found);
          
          // Load detail sekolah lengkap dari database
          try {
            const detailResponse = await fetch(`/api/pengawas/sekolah/${found.id}`);
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              const sekolahDetail = detailData.data;
              
              // Auto-fill identitas dari database
              setIdentitas((prev) => ({
                ...prev,
                namaSekolah: sekolahDetail.nama_sekolah || found.nama,
                namaKepalaSekolah: sekolahDetail.kepala_sekolah || "",
                nip: sekolahDetail.nip_kepala_sekolah || "",
                kabupatenKota: sekolahDetail.kabupaten_kota || found.kabupaten,
                tanggalSupervisi: new Date().toISOString().split("T")[0],
              }));
            } else {
              // Fallback jika API gagal
              setIdentitas((prev) => ({
                ...prev,
                namaSekolah: found.nama,
                kabupatenKota: found.kabupaten,
                tanggalSupervisi: new Date().toISOString().split("T")[0],
              }));
            }
          } catch (err) {
            console.error("Error loading sekolah detail:", err);
            // Fallback jika error
            setIdentitas((prev) => ({
              ...prev,
              namaSekolah: found.nama,
              kabupatenKota: found.kabupaten,
              tanggalSupervisi: new Date().toISOString().split("T")[0],
            }));
          }
        } else if (filteredSekolah.length > 0) {
          const first = filteredSekolah[0];
          setSelectedSekolah(first);
          
          // Load detail untuk sekolah pertama
          try {
            const detailResponse = await fetch(`/api/pengawas/sekolah/${first.id}`);
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              const sekolahDetail = detailData.data;
              
              setIdentitas((prev) => ({
                ...prev,
                namaSekolah: sekolahDetail.nama_sekolah || first.nama,
                namaKepalaSekolah: sekolahDetail.kepala_sekolah || "",
                nip: sekolahDetail.nip_kepala_sekolah || "",
                kabupatenKota: sekolahDetail.kabupaten_kota || first.kabupaten,
                tanggalSupervisi: new Date().toISOString().split("T")[0],
              }));
            } else {
              setIdentitas((prev) => ({
                ...prev,
                namaSekolah: first.nama,
                kabupatenKota: first.kabupaten,
                tanggalSupervisi: new Date().toISOString().split("T")[0],
              }));
            }
          } catch (err) {
            console.error("Error loading sekolah detail:", err);
            setIdentitas((prev) => ({
              ...prev,
              namaSekolah: first.nama,
              kabupatenKota: first.kabupaten,
              tanggalSupervisi: new Date().toISOString().split("T")[0],
            }));
          }
        }
      }

      // Initialize indikator data
      const initialData: Record<string, IndikatorData> = {};
      const currentIndikatorList = getIndikatorList(instrumenId);
      currentIndikatorList.forEach((ind) => {
        initialData[ind.id] = {
          id: ind.id,
          skor: null,
          catatan: "",
        };
      });
      setIndikatorData(initialData);
    } catch (err) {
      console.error("Error loading data:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndikatorChange = (indikatorId: string, skor: number) => {
    setIndikatorData((prev) => {
      const newData = { ...prev };
      newData[indikatorId] = {
        ...newData[indikatorId],
        skor,
        catatan: generateSaran(indikatorId, skor, instrumenId),
      };
      return newData;
    });
  };

  const handleCatatanChange = (indikatorId: string, catatan: string) => {
    setIndikatorData((prev) => {
      const newData = { ...prev };
      newData[indikatorId] = {
        ...newData[indikatorId],
        catatan,
      };
      return newData;
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validasi
      if (!identitas.namaSekolah || !identitas.namaKepalaSekolah || !identitas.tanggalSupervisi) {
        toast({
          title: "Peringatan",
          description: "Silakan lengkapi identitas sekolah terlebih dahulu",
          variant: "error",
        });
        return;
      }

      const allFilled = Object.values(indikatorData).every((data) => data.skor !== null);
      if (!allFilled) {
        toast({
          title: "Peringatan",
          description: "Silakan lengkapi semua indikator terlebih dahulu",
          variant: "error",
        });
        return;
      }

      // Simulate save - nanti bisa diintegrasikan dengan API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Berhasil",
        description: "Data monitoring berhasil disimpan",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data monitoring",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!monitoringType || (instrumenId !== "persiapan-kebiasaan" && instrumenId !== "pelaksanaan-kebiasaan")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="size-12 text-red-500" />
        <p className="text-lg font-semibold text-slate-900">Halaman tidak ditemukan</p>
        <Button onClick={() => router.push("/pengawas/pelaksanaan")} variant="outline">
          <ArrowLeft className="size-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  const indikatorList = getIndikatorList(instrumenId);
  const judulInstrumen = instrumenId === "pelaksanaan-kebiasaan" 
    ? "Instrumen Pelaksanaan Kebiasaan Anak Indonesia Hebat"
    : "Instrumen Persiapan Kebiasaan Anak Indonesia Hebat";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  const MonitoringIcon = monitoringType.icon;
  const saranGlobal = generateSaranGlobal(indikatorData, instrumenId);

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/pengawas/pelaksanaan/monitoring/${monitoringId}`)}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="size-4 mr-2" />
            Kembali
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-green-200 bg-green-50">
              <MonitoringIcon className="size-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {judulInstrumen}
              </h1>
              <p className="text-sm text-slate-600">
                {instrumenId === "pelaksanaan-kebiasaan" 
                  ? "Form monitoring pelaksanaan kebiasaan"
                  : "Form monitoring persiapan kebiasaan"}
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="size-4 mr-2" />
              Simpan
            </>
          )}
        </Button>
      </div>

      {/* Pilih Sekolah (jika ada multiple sekolah) */}
      {sekolahList.length > 1 && (
        <Card className="border border-indigo-200 bg-white shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {sekolahList.map((sekolah) => (
                <Button
                  key={sekolah.id}
                  variant={selectedSekolah?.id === sekolah.id ? "default" : "outline"}
                  size="sm"
                  onClick={async () => {
                    setSelectedSekolah(sekolah);
                    
                    // Load detail sekolah dari database
                    try {
                      const detailResponse = await fetch(`/api/pengawas/sekolah/${sekolah.id}`);
                      if (detailResponse.ok) {
                        const detailData = await detailResponse.json();
                        const sekolahDetail = detailData.data;
                        
                        setIdentitas((prev) => ({
                          ...prev,
                          namaSekolah: sekolahDetail.nama_sekolah || sekolah.nama,
                          namaKepalaSekolah: sekolahDetail.kepala_sekolah || "",
                          nip: sekolahDetail.nip_kepala_sekolah || "",
                          kabupatenKota: sekolahDetail.kabupaten_kota || sekolah.kabupaten,
                        }));
                      } else {
                        setIdentitas((prev) => ({
                          ...prev,
                          namaSekolah: sekolah.nama,
                          kabupatenKota: sekolah.kabupaten,
                        }));
                      }
                    } catch (err) {
                      console.error("Error loading sekolah detail:", err);
                      setIdentitas((prev) => ({
                        ...prev,
                        namaSekolah: sekolah.nama,
                        kabupatenKota: sekolah.kabupaten,
                      }));
                    }
                    
                    router.push(
                      `/pengawas/pelaksanaan/monitoring/${monitoringId}/${instrumenId}?sekolah=${sekolah.id}`
                    );
                  }}
                  className={cn(
                    selectedSekolah?.id === sekolah.id
                      ? "bg-indigo-600 text-white"
                      : "border-slate-200"
                  )}
                >
                  <School className="size-4 mr-2" />
                  {sekolah.nama}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Identitas Sekolah */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">A. IDENTITAS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nama Sekolah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={identitas.namaSekolah}
                onChange={(e) =>
                  setIdentitas((prev) => ({ ...prev, namaSekolah: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Nama Sekolah"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nama Kepala Sekolah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={identitas.namaKepalaSekolah}
                onChange={(e) =>
                  setIdentitas((prev) => ({ ...prev, namaKepalaSekolah: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Nama Kepala Sekolah"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">NIP</label>
              <input
                type="text"
                value={identitas.nip}
                onChange={(e) => setIdentitas((prev) => ({ ...prev, nip: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="NIP Kepala Sekolah"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Kabupaten/Kota Tempat Sekolah
              </label>
              <input
                type="text"
                value={identitas.kabupatenKota}
                onChange={(e) =>
                  setIdentitas((prev) => ({ ...prev, kabupatenKota: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Kabupaten/Kota"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tanggal Supervisi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={identitas.tanggalSupervisi}
                onChange={(e) =>
                  setIdentitas((prev) => ({ ...prev, tanggalSupervisi: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Indikator */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">B. INDIKATOR</CardTitle>
          <CardDescription className="text-slate-600">
            Pilih skor untuk setiap indikator (0, 1, atau 2)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {indikatorList.map((indikator, index) => {
            const data = indikatorData[indikator.id] || { id: indikator.id, skor: null, catatan: "" };
            return (
              <div
                key={indikator.id}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6"
              >
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                    {index + 1}. {indikator.pertanyaan}
                  </h3>
                </div>

                {/* Opsi Skor */}
                <div className="mb-4 grid gap-3 sm:grid-cols-3">
                  {indikator.opsi.map((opsi) => (
                    <label
                      key={opsi.skor}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition hover:shadow-sm",
                        data.skor === opsi.skor
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 bg-white"
                      )}
                    >
                      <input
                        type="radio"
                        name={indikator.id}
                        value={opsi.skor}
                        checked={data.skor === opsi.skor}
                        onChange={() => handleIndikatorChange(indikator.id, opsi.skor)}
                        className="mt-1 size-4 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-indigo-600">Skor {opsi.skor}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-700 sm:text-sm">{opsi.label}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Catatan/Saran */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700 sm:text-sm">
                    Catatan/Saran
                  </label>
                  <textarea
                    value={data.catatan}
                    onChange={(e) => handleCatatanChange(indikator.id, e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Catatan atau saran..."
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Saran Global */}
      <Card className="border border-amber-200 bg-amber-50/50 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <FileText className="size-5 text-amber-600" />
            Saran Global
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-amber-200 bg-white p-4">
            <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{saranGlobal}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tombol Simpan di Bawah */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/pengawas/pelaksanaan/monitoring/${monitoringId}`)}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="size-4 mr-2" />
          Batal
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="size-4 mr-2" />
              Simpan Data Monitoring
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

