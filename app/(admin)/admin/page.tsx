import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  CheckCircle2,
  Megaphone,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    label: "Agenda Aktif",
    value: "12",
    change: "+3 minggu ini",
    icon: CalendarCheck,
    trend: "positive",
  },
  {
    label: "Berita Terbit",
    value: "28",
    change: "+6 bulan ini",
    icon: Megaphone,
    trend: "positive",
  },
  {
    label: "Kolaborasi",
    value: "46",
    change: "12 pengawas aktif",
    icon: Target,
    trend: "neutral",
  },
  {
    label: "Tingkat Penyelesaian",
    value: "92%",
    change: "Agenda tuntas",
    icon: CheckCircle2,
    trend: "positive",
  },
];

const upcomingAgenda = [
  {
    title: "Supervisi Mutu SMA Negeri 1 Semarang",
    date: "5 November 2025",
    type: "Supervisi",
    status: "Siap Jalan",
  },
  {
    title: "Pendampingan Kurikulum Merdeka",
    date: "8 November 2025",
    type: "Pendampingan",
    status: "Butuh Dokumen",
  },
  {
    title: "Rakor Pengawas Kabupaten Kudus",
    date: "12 November 2025",
    type: "Rakor",
    status: "Terjadwal",
  },
];

const recentNews = [
  {
    title: "Peluncuran Modul Supervisi Digital",
    date: "31 Oktober 2025",
    status: "Tayang",
  },
  {
    title: "Best Practice Penguatan Literasi di SLB",
    date: "28 Oktober 2025",
    status: "Draft",
  },
  {
    title: "Sinergi MKPS dengan Dinas Pendidikan",
    date: "25 Oktober 2025",
    status: "Tayang",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border border-rose-200 bg-white shadow-md shadow-rose-100/70"
          >
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-rose-500 via-rose-400 to-amber-400 p-2.5 text-white shadow-md">
                <stat.icon className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                  {stat.label}
                </CardTitle>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className="flex size-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <TrendingUp className="size-3.5" />
                </span>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-900">Agenda Terdekat</CardTitle>
              <CardDescription className="text-slate-600">
                Pantau kesiapan agenda yang akan berlangsung minggu ini.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="default"
              className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white sm:w-auto"
            >
              Lihat Kalender
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAgenda.map((agenda) => (
              <div
                key={agenda.title}
                className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-base font-semibold text-slate-900">
                      {agenda.title}
                    </p>
                    <p className="text-xs text-slate-500">{agenda.date}</p>
                  </div>
                  <Badge className="w-fit rounded-full border-0 bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm">
                    {agenda.type}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600">
                    {agenda.status}
                  </span>
                  <span>•</span>
                  <span>Koordinasi dengan tim pengawas telah dijadwalkan.</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-slate-900">Berita Terbaru</CardTitle>
              <CardDescription className="text-slate-600">
                Kelola publikasi dan pastikan informasi strategis tersampaikan.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="default"
              className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white sm:w-auto"
            >
              Kelola Berita
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentNews.map((news) => (
              <div
                key={news.title}
                className="flex flex-col gap-1 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100"
              >
                <p className="text-base font-semibold text-slate-900">
                  {news.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{news.date}</span>
                  <span>•</span>
                  <Badge
                    variant="outline"
                    className="rounded-full border-0 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600"
                  >
                    {news.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-rose-400 to-amber-400 text-white shadow-md">
                <Sparkles className="size-4" />
              </span>
              Rekomendasi Aksi
            </CardTitle>
            <CardDescription className="text-slate-600">
              Sistem mengidentifikasi langkah prioritas untuk seminggu ke depan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-dashed border-rose-200 bg-gradient-to-r from-rose-50 via-white to-amber-50 p-5 shadow-inner">
              <p className="text-base font-semibold text-slate-900">
                Perbarui berita terkait Rakor MKPS Kabupaten Kudus
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Meningkatkan eksposur publikasi dan memastikan tindak lanjut kolaborasi dengan dinas.
              </p>
              <Button
                size="sm"
                variant="default"
                className="mt-3 rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
              >
                Tulis Berita Baru
              </Button>
            </div>
            <div className="grid gap-3 text-sm text-slate-600">
              <div className="rounded-xl border border-rose-100 bg-white p-3 text-slate-600 shadow-sm">
                Pastikan dokumen pendukung supervisi SMA Negeri 1 Semarang telah diunggah.
              </div>
              <div className="rounded-xl border border-rose-100 bg-white p-3 text-slate-600 shadow-sm">
                Jadwalkan briefing singkat dengan tim pendampingan Kurikulum Merdeka.
              </div>
              <div className="rounded-xl border border-rose-100 bg-white p-3 text-slate-600 shadow-sm">
                Tinjau ulang peran pengguna yang belum aktif dalam 30 hari terakhir.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Aktivitas Terbaru</CardTitle>
            <CardDescription className="text-slate-600">
              Catatan singkat kolaborasi dan perubahan terakhir dalam sistem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="flex flex-col gap-1 rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
              <p className="font-semibold text-slate-900">Eka Suryani memperbarui agenda supervisi.</p>
              <p className="text-xs">2 jam lalu • Agenda • SMA Negeri 1 Semarang</p>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
              <p className="font-semibold text-slate-900">Admin MKPS menerbitkan berita baru.</p>
              <p className="text-xs">6 jam lalu • Berita • Portal Publik</p>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
              <p className="font-semibold text-slate-900">Rudi Hartono menambahkan catatan evaluasi.</p>
              <p className="text-xs">Kemarin • Pelaporan • SLB Negeri Ungaran</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}


