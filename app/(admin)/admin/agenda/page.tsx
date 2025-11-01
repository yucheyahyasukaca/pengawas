import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CalendarPlus,
  Download,
  Filter,
  MapPin,
  Users,
} from "lucide-react";

const agendaData = [
  {
    id: "AGD-001",
    title: "Supervisi Implementasi Kurikulum Merdeka",
    date: "5 November 2025",
    location: "SMA Negeri 1 Semarang",
    coordinator: "Eka Suryani",
    status: "Terjadwal",
    type: "Supervisi",
  },
  {
    id: "AGD-002",
    title: "Pendampingan Literasi Numerasi",
    date: "7 November 2025",
    location: "SLB Negeri Ungaran",
    coordinator: "Rudi Hartono",
    status: "Siap Jalan",
    type: "Pendampingan",
  },
  {
    id: "AGD-003",
    title: "Monitoring Simulasi Asesmen",
    date: "9 November 2025",
    location: "SMA Negeri 3 Surakarta",
    coordinator: "Fitri Handayani",
    status: "Butuh Dokumen",
    type: "Monitoring",
  },
  {
    id: "AGD-004",
    title: "Rapat Koordinasi MKPS Kabupaten",
    date: "12 November 2025",
    location: "Kantor Dinas Pendidikan Kudus",
    coordinator: "Admin MKPS",
    status: "Perlu Konfirmasi",
    type: "Rakor",
  },
];

const agendaFilters = ["Semua", "Supervisi", "Pendampingan", "Monitoring", "Rakor"];

export default function AgendaManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-white/70 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-800">Manajemen Agenda</CardTitle>
            <CardDescription className="text-slate-600">
              Atur jadwal supervisi, pendampingan, dan kegiatan MKPS secara terstruktur.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-sky-100 bg-white/90 text-sky-600 hover:border-sky-200 hover:bg-sky-50"
              asChild
            >
              <Link href="/admin/agenda/template">
                <Download className="size-4" />
                Unduh Template
              </Link>
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-gradient-to-r from-sky-600 to-emerald-500 text-white font-semibold shadow-md hover:from-sky-700 hover:to-emerald-600"
              asChild
            >
              <Link href="/admin/agenda/buat">
                <CalendarPlus className="size-4" />
                Agenda Baru
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-800">Filter:</span>
            {agendaFilters.map((filter, index) => (
              <Button
                key={filter}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full px-4",
                  index === 0
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md hover:from-sky-600 hover:to-emerald-600"
                    : "border-sky-100 bg-white/80 text-sky-600 hover:border-sky-200 hover:bg-sky-50",
                )}
              >
                {filter}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto gap-2 text-sky-600 hover:bg-sky-50"
            >
              <Filter className="size-4" />
              Filter Lanjut
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/70 bg-white/95 shadow-sm">
            <table className="w-full border-collapse text-left text-sm text-slate-700">
              <thead className="bg-gradient-to-r from-sky-50 to-emerald-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Agenda</th>
                  <th className="px-5 py-3 font-semibold">Tanggal</th>
                  <th className="px-5 py-3 font-semibold">Lokasi</th>
                  <th className="px-5 py-3 font-semibold">Koordinator</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100">
                {agendaData.map((agenda) => (
                  <tr key={agenda.id} className="hover:bg-sky-50/70">
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-800">
                          {agenda.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Badge
                            variant="outline"
                            className="rounded-full border-sky-200 bg-sky-50 px-2 text-sky-700"
                          >
                            {agenda.type}
                          </Badge>
                          <span>•</span>
                          <span>{agenda.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{agenda.date}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4 text-sky-500" />
                        {agenda.location}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <Users className="size-4 text-sky-500" />
                        {agenda.coordinator}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={agenda.status === "Siap Jalan" ? "secondary" : "outline"}
                        className={cn(
                          "rounded-full px-3",
                          agenda.status === "Siap Jalan"
                            ? "bg-emerald-200 text-emerald-800"
                            : "border-sky-300 text-sky-700",
                        )}
                      >
                        {agenda.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right text-xs">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-semibold text-sky-700 hover:bg-sky-50"
                          asChild
                        >
                          <Link href={`/admin/agenda/${agenda.id.toLowerCase()}`}>
                            Detil
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-sky-200 text-slate-700 font-semibold hover:border-sky-300 hover:bg-sky-50"
                          asChild
                        >
                          <Link href={`/admin/agenda/${agenda.id.toLowerCase()}/edit`}>
                            Ubah
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p>Menampilkan 1-4 dari 24 agenda aktif.</p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="border-sky-200 text-slate-700 font-semibold hover:border-sky-300 hover:bg-sky-50"
            >
              Sebelumnya
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-sky-600 to-emerald-500 text-white font-semibold shadow-md hover:from-sky-700 hover:to-emerald-600"
            >
              Berikutnya
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-dashed border-sky-200 bg-sky-50/80">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-sky-700">
              Blueprint Agenda Kolaboratif
            </CardTitle>
            <CardDescription className="text-sky-600">
              Gunakan template kolaborasi untuk mengundang pengawas lintas wilayah.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-xs text-sky-600/80">
            <p>
              • Sinkronkan jadwal dengan Google Calendar dan Supabase secara otomatis.
            </p>
            <p>• Bagikan agenda dan catatan persiapan kepada seluruh tim.</p>
            <p>• Monitor progres dan dokumen pendukung dalam satu panel.</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="border-sky-300 text-sky-700 font-semibold hover:border-sky-400 hover:bg-sky-50"
            >
              Pelajari Lebih Lanjut
            </Button>
          </CardFooter>
        </Card>

        <Card className="border border-white/70 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">Agenda Perlu Tindak Lanjut</CardTitle>
            <CardDescription className="text-slate-600">
              Pastikan dokumen, notulen, dan catatan evaluasi terselesaikan tepat waktu.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div className="rounded-lg border border-sky-100 bg-sky-50/60 p-3">
              <p className="font-semibold text-slate-800">Monitoring Simulasi Asesmen</p>
              <p className="text-xs text-slate-600">Unggah hasil analisis asesmen sebelum 6 November 2025.</p>
            </div>
            <div className="rounded-lg border border-sky-100 bg-sky-50/60 p-3">
              <p className="font-semibold text-slate-800">Rapat Koordinasi MKPS Kabupaten</p>
              <p className="text-xs text-slate-600">Konfirmasi kehadiran dan materi presentasi narasumber.</p>
            </div>
            <div className="rounded-lg border border-sky-100 bg-sky-50/60 p-3">
              <p className="font-semibold text-slate-800">Pendampingan Literasi Numerasi</p>
              <p className="text-xs text-slate-600">Lengkapi daftar hadir dan dokumentasi kegiatan.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


