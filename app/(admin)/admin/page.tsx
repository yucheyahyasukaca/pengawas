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
            className="border border-white/70 bg-gradient-to-br from-white via-sky-50/80 to-emerald-50/70 shadow-sm"
          >
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 p-2 text-white shadow-lg">
                <stat.icon className="size-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.label}
                </CardTitle>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="flex items-center gap-1 text-sm text-slate-600">
                <TrendingUp className="size-4 text-emerald-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="border border-white/70 bg-white/90 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Agenda Terdekat</CardTitle>
              <CardDescription className="text-slate-600">
                Pantau kesiapan agenda yang akan berlangsung minggu ini.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-sky-100 bg-white/90 text-sky-600 hover:border-sky-200 hover:bg-sky-50"
            >
              Lihat Kalender
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAgenda.map((agenda) => (
              <div
                key={agenda.title}
                className="rounded-xl border border-sky-100 bg-sky-50/60 p-4 transition hover:border-sky-200 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground">
                      {agenda.title}
                    </p>
                    <p className="text-xs text-slate-600">{agenda.date}</p>
                  </div>
                  <Badge className="bg-sky-100 text-sky-700">{agenda.type}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-gradient-to-r from-sky-500/10 to-emerald-500/10 px-3 py-1 font-medium text-sky-600">
                    {agenda.status}
                  </span>
                  <span>•</span>
                  <span>Koordinasi dengan tim pengawas telah dijadwalkan.</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-white/70 bg-white/90 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Berita Terbaru</CardTitle>
              <CardDescription className="text-slate-600">
                Kelola publikasi dan pastikan informasi strategis tersampaikan.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-sky-100 bg-white/90 text-sky-600 hover:border-sky-200 hover:bg-sky-50"
            >
              Kelola Berita
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentNews.map((news) => (
              <div
                key={news.title}
                className="flex flex-col gap-1 rounded-lg border border-sky-100 bg-sky-50/60 p-4 hover:border-sky-200 hover:bg-white"
              >
                <p className="text-sm font-semibold text-foreground">
                  {news.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span>{news.date}</span>
                  <span>•</span>
                  <Badge variant={news.status === "Tayang" ? "outline" : "secondary"}>
                    {news.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card className="border border-white/70 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Sparkles className="size-5 text-sky-500" />
              Rekomendasi Aksi
            </CardTitle>
            <CardDescription className="text-slate-600">
              Sistem mengidentifikasi langkah prioritas untuk seminggu ke depan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-dashed border-sky-200 bg-sky-50/80 p-4">
              <p className="text-sm font-semibold text-sky-700">
                Perbarui berita terkait Rakor MKPS Kabupaten Kudus
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Meningkatkan eksposur publikasi dan memastikan tindak lanjut kolaborasi dengan dinas.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 border-sky-100 bg-white/90 text-sky-600 hover:border-sky-200 hover:bg-sky-50"
              >
                Tulis Berita Baru
              </Button>
            </div>
            <div className="grid gap-3 text-xs text-slate-600">
              <div className="rounded-lg border border-sky-100 bg-white/90 p-3 text-slate-700">
                Pastikan dokumen pendukung supervisi SMA Negeri 1 Semarang telah diunggah.
              </div>
              <div className="rounded-lg border border-sky-100 bg-white/90 p-3 text-slate-700">
                Jadwalkan briefing singkat dengan tim pendampingan Kurikulum Merdeka.
              </div>
              <div className="rounded-lg border border-sky-100 bg-white/90 p-3 text-slate-700">
                Tinjau ulang peran pengguna yang belum aktif dalam 30 hari terakhir.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/70 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Aktivitas Terbaru</CardTitle>
            <CardDescription className="text-slate-600">
              Catatan singkat kolaborasi dan perubahan terakhir dalam sistem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <div className="flex flex-col gap-1 rounded-lg border border-sky-100 bg-sky-50/70 p-3">
              <p className="font-medium text-foreground">Eka Suryani memperbarui agenda supervisi.</p>
              <p className="text-xs text-slate-600">2 jam lalu • Agenda • SMA Negeri 1 Semarang</p>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-sky-100 bg-sky-50/70 p-3">
              <p className="font-medium text-foreground">Admin MKPS menerbitkan berita baru.</p>
              <p className="text-xs text-slate-600">6 jam lalu • Berita • Portal Publik</p>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-sky-100 bg-sky-50/70 p-3">
              <p className="font-medium text-foreground">Rudi Hartono menambahkan catatan evaluasi.</p>
              <p className="text-xs text-slate-600">Kemarin • Pelaporan • SLB Negeri Ungaran</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}


