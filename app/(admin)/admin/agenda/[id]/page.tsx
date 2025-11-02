"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Edit,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Info,
  CalendarClock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - in production, this would come from an API
const agendaDatabase = [
  {
    id: "agd-001",
    title: "Supervisi Implementasi Kurikulum Merdeka",
    type: "Supervisi",
    date: "2025-11-05",
    time: "08:00",
    location: "SMA Negeri 1 Semarang",
    coordinator: "Eka Suryani",
    status: "Terjadwal",
    description: "<p>Kegiatan supervisi untuk memastikan implementasi Kurikulum Merdeka berjalan dengan baik di SMA Negeri 1 Semarang. Fokus akan diberikan pada:</p><ul><li>Evaluasi pelaksanaan pembelajaran</li><li>Review dokumen kurikulum</li><li>Wawancara dengan guru dan siswa</li><li>Pendampingan penilaian</li></ul><p><strong>Dokumen yang perlu dipersiapkan:</strong></p><ol><li>Dokumen KTSP</li><li>Daftar hadir guru</li><li>Rencana pelaksanaan pembelajaran</li><li>Catatan asesmen formatif dan sumatif</li></ol>",
  },
  {
    id: "agd-002",
    title: "Pendampingan Literasi Numerasi",
    type: "Pendampingan",
    date: "2025-11-07",
    time: "09:00",
    location: "SLB Negeri Ungaran",
    coordinator: "Rudi Hartono",
    status: "Siap Jalan",
    description: "<p>Program pendampingan untuk meningkatkan kemampuan literasi dan numerasi siswa di SLB Negeri Ungaran. Kegiatan ini mencakup:</p><ul><li>Workshop untuk guru tentang metode pembelajaran literasi numerasi</li><li>Praktik terbaik dalam pembelajaran inklusif</li><li>Evaluasi materi pembelajaran</li></ul>",
  },
  {
    id: "agd-003",
    title: "Monitoring Simulasi Asesmen",
    type: "Monitoring",
    date: "2025-11-09",
    time: "13:00",
    location: "SMA Negeri 3 Surakarta",
    coordinator: "Fitri Handayani",
    status: "Butuh Dokumen",
    description: "<p>Monitoring pelaksanaan simulasi asesmen untuk memastikan kesiapan pelaksanaan asesmen sesungguhnya. Pemantauan akan dilakukan pada:</p><ul><li>Proses administratif asesmen</li><li>Keterampilan siswa dalam mengikuti asesmen</li><li>Kesiapan infrastruktur</li><li>Kompetensi pengawas ruang</li></ul>",
  },
  {
    id: "agd-004",
    title: "Rapat Koordinasi MKPS Kabupaten",
    type: "Rakor",
    date: "2025-11-12",
    time: "10:00",
    location: "Kantor Dinas Pendidikan Kudus",
    coordinator: "Admin MKPS",
    status: "Perlu Konfirmasi",
    description: "<p>Rapat koordinasi pengawas sekolah tingkat kabupaten untuk membahas program kerja dan capaian kepengawasan semester ini.</p>",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Siap Jalan":
      return "bg-emerald-100 text-emerald-800";
    case "Terjadwal":
      return "bg-sky-100 text-sky-800";
    case "Butuh Dokumen":
      return "bg-amber-100 text-amber-800";
    case "Perlu Konfirmasi":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Supervisi":
      return "bg-rose-100 text-rose-600";
    case "Pendampingan":
      return "bg-blue-100 text-blue-600";
    case "Monitoring":
      return "bg-emerald-100 text-emerald-600";
    case "Rakor":
      return "bg-amber-100 text-amber-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

export default function AgendaDetailPage() {
  const params = useParams();
  const [agenda, setAgenda] = useState<typeof agendaDatabase[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const loadAgenda = () => {
      setIsLoading(true);
      const foundAgenda = agendaDatabase.find(
        (item) => item.id === params.id
      );
      
      setTimeout(() => {
        setAgenda(foundAgenda || null);
        setIsLoading(false);
      }, 500);
    };

    loadAgenda();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
          <p className="text-sm text-slate-600">Memuat detail agenda...</p>
        </div>
      </div>
    );
  }

  if (!agenda) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                <AlertCircle className="size-8 text-rose-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-slate-900">Agenda Tidak Ditemukan</h3>
                <p className="text-slate-600">
                  Agenda yang Anda cari tidak ada atau telah dihapus.
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                asChild
              >
                <Link href="/admin/agenda">
                  <ArrowLeft className="size-4" />
                  Kembali ke Daftar Agenda
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-md">
                <CalendarClock className="size-6 text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("rounded-full border-0 px-3 py-1 font-semibold", getTypeColor(agenda.type))}
                  >
                    {agenda.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("rounded-full border-0 px-3 py-1 font-semibold", getStatusColor(agenda.status))}
                  >
                    {agenda.status}
                  </Badge>
                  <span className="text-sm text-slate-500">•</span>
                  <span className="text-sm text-slate-500">{agenda.id.toUpperCase()}</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">{agenda.title}</CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Detail lengkap agenda kegiatan ini
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              asChild
            >
              <Link href="/admin/agenda">
                <ArrowLeft className="size-4" />
                Kembali
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-0 bg-blue-100 px-4 font-semibold text-blue-800 shadow-sm transition hover:bg-blue-200 hover:text-blue-900"
            >
              <Share2 className="size-4" />
              Bagikan
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Info Card */}
          <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
            <CardHeader className="border-b border-rose-100">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-sm">
                  <Info className="size-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-900">Informasi Agenda</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-5">
                {/* Date and Time */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-rose-50/50 to-pink-50/30 border border-rose-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Calendar className="size-5 text-rose-600" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tanggal & Waktu</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-bold text-slate-900">
                        {new Date(agenda.date).toLocaleDateString('id-ID', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="text-sm text-slate-600">
                        <Clock className="size-4 inline mr-1" />
                        {agenda.time} WIB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-sky-50/30 border border-blue-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <MapPin className="size-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lokasi</span>
                    <span className="text-base font-semibold text-slate-900">{agenda.location}</span>
                  </div>
                </div>

                {/* Coordinator */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Users className="size-5 text-emerald-600" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Koordinator</span>
                    <span className="text-base font-semibold text-slate-900">{agenda.coordinator}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
            <CardHeader className="border-b border-rose-100">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-sm">
                  <FileText className="size-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-900">Deskripsi Agenda</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div 
                className="prose prose-slate max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: agenda.description }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Action Card */}
          <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="default"
                className="w-full gap-2 rounded-full border-0 bg-gradient-to-r from-rose-600 to-pink-600 px-4 font-semibold text-white shadow-md transition hover:from-rose-700 hover:to-pink-700"
                asChild
              >
                <Link href={`/admin/agenda/${params.id}/edit`}>
                  <Edit className="size-4" />
                  Ubah Agenda
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              >
                <Download className="size-4" />
                Unduh PDF
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 rounded-full border-0 bg-blue-100 px-4 font-semibold text-blue-800 shadow-sm transition hover:bg-blue-200 hover:text-blue-900"
              >
                <Share2 className="size-4" />
                Bagikan
              </Button>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span className="text-sm font-medium text-slate-700">Status</span>
                  <Badge
                    variant="outline"
                    className={cn("rounded-full border-0 px-3 py-1 font-semibold", getStatusColor(agenda.status))}
                  >
                    {agenda.status}
                  </Badge>
                </div>
                {agenda.status === "Butuh Dokumen" && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="size-4 text-amber-600 mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-amber-900">Perlu Perhatian</span>
                        <p className="text-xs text-amber-700">
                          Agenda ini memerlukan dokumen tambahan sebelum dapat dilaksanakan.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {agenda.status === "Siap Jalan" && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600 mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-emerald-900">Siap Dilaksanakan</span>
                        <p className="text-xs text-emerald-700">
                          Semua persiapan sudah lengkap. Agenda siap untuk dilaksanakan.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

