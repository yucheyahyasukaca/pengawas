import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

const stats = [
  {
    label: "Pengawas Aktif",
    value: "182",
    description: "Pengawas SMA & SLB terintegrasi dalam SIP Kepengawasan",
  },
  {
    label: "Sekolah Binaan",
    value: "1.204",
    description: "Sebaran sekolah negeri dan swasta di 35 kabupaten/kota",
  },
  {
    label: "Laporan Tersimpan",
    value: "9.830",
    description: "Dokumen supervisi, pendampingan, dan laporan berkala",
  },
];

const newsHighlights = [
  {
    title: "Integrasi Rapor Pendidikan dalam Supervisi Akademik 2025",
    description:
      "Panduan langkah demi langkah menggunakan data Rapor Pendidikan untuk menyusun strategi supervisi dan pendampingan sekolah binaan.",
    href: "#",
  },
  {
    title: "Peluncuran Modul Pendampingan RKS Berbasis Data",
    description:
      "Modul terbaru membantu pengawas mengawal penyusunan Rencana Kerja Sekolah dengan fokus pada perbaikan mutu berkelanjutan.",
    href: "#",
  },
];

const programPillars = [
  {
    title: "Perencanaan Kepengawasan",
    description:
      "Rencanakan program kepengawasan yang terukur dan kolaboratif, lengkap dengan target dan indikator capaian.",
  },
  {
    title: "Pelaksanaan & Supervisi",
    description:
      "Catat seluruh proses supervisi akademik maupun manajerial, lampirkan bukti, dan pantau progres setiap sekolah.",
  },
  {
    title: "Pelaporan & Analitik",
    description:
      "Ekspor laporan triwulan dan tahunan dalam sekali klik disertai grafik capaian dan rekomendasi tindak lanjut.",
  },
];

const karyaCategories = [
  {
    title: "Supervisi Akademik",
    description:
      "Artikel reflektif mengenai inovasi pembelajaran, coaching guru, dan implementasi kurikulum terbaru.",
  },
  {
    title: "Pendampingan Kepala Sekolah",
    description:
      "Best practice pendampingan manajerial dan penguatan budaya mutu sekolah binaan.",
  },
  {
    title: "Penelitian & Inovasi",
    description:
      "Kumpulan penelitian tindakan kepengawasan dan model inovasi yang siap direplikasi di wilayah lain.",
  },
];

const featureCards = [
  {
    title: "Forum Diskusi Pengawas",
    badge: "Kolaborasi",
    description:
      "Ruang terbuka untuk berbagi solusi lapangan, moderasi topik oleh admin, dan unggah dokumen pendukung.",
    href: "#forum",
  },
  {
    title: "Regulasi & Dokumen",
    badge: "Regulasi",
    description:
      "Kumpulan Permendikbud, SE, juknis terbaru yang tersusun rapi dan dapat diunduh dalam format PDF.",
    href: "#regulasi",
  },
  {
    title: "Kalender Kepengawasan",
    badge: "Produktivitas",
    description:
      "Jadwalkan supervisi, pendampingan, dan tenggat pelaporan dengan pengingat otomatis via email.",
    href: "#",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Hero Section - Modern & Clean */}
      <section
        id="beranda"
        className="relative overflow-hidden bg-gradient-to-br from-white via-secondary/30 to-accent/20"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <Badge className="w-fit rounded-full border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {siteConfig.tagline}
              </Badge>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  SIP-Kepengawasan
                  <span className="mt-2 block text-primary">
                    Jawa Tengah
                  </span>
                </h1>
                <p className="text-lg leading-relaxed text-foreground/80 sm:text-xl">
                  Platform terpadu untuk merencanakan, melaksanakan, dan melaporkan pengawasan pendidikan berbasis data dan kolaboratif.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90" asChild>
                  <Link href="/auth/login">Masuk ke Portal Pengawas</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary/40 text-foreground hover:bg-primary/5" asChild>
                  <Link href="#profil">Jelajahi Lebih Lanjut</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((item) => (
                <Card
                  key={item.label}
                  className="group border border-border/50 bg-white/80 shadow-sm backdrop-blur transition-all hover:shadow-md hover:shadow-primary/10"
                >
                  <CardContent className="p-6">
                    <p className="text-4xl font-bold text-primary">{item.value}</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Agenda & News Section */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge variant="outline" className="mb-4 rounded-full">
              Informasi Terkini
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Agenda & Berita Terbaru
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Agenda Card */}
            <Card className="border border-border/50 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Agenda Terdekat
                </CardTitle>
                <CardDescription>
                  Pastikan perencanaan supervisi dan pelaporan berjalan tepat waktu.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                  <p className="text-sm font-bold text-primary">12 November 2025</p>
                  <p className="mt-2 font-semibold text-foreground">
                    Workshop Penyelarasan RPK & RKS Berbasis Data
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cabdin Wilayah Surakarta · Wajib hadir untuk pengawas SMA.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* News Highlights */}
            <Card className="border border-border/50 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Berita & Highlight
                </CardTitle>
                <CardDescription>
                  Update terbaru seputar kepengawasan dan kebijakan pendidikan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {newsHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="group rounded-lg border border-border/50 bg-background p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-2 inline-flex text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      Baca selengkapnya →
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Profil MKPS Section */}
      <section id="profil" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 rounded-full">
              Profil MKPS
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Menguatkan Ekosistem Kepengawasan Provinsi Jawa Tengah
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              MKPS SMA & SLB Provinsi Jawa Tengah hadir sebagai penggerak utama peningkatan mutu melalui supervisi akademik, manajerial, dan pendampingan kepala sekolah yang terstruktur.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {programPillars.map((pillar) => (
              <Card
                key={pillar.title}
                className="group border border-border/50 bg-white shadow-sm transition-all hover:shadow-md hover:shadow-primary/10"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {pillar.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {pillar.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Karya Pengawas Section */}
      <section id="karya" className="bg-gradient-to-br from-secondary/20 via-white to-accent/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 rounded-full">
              Tulisan & Karya Pengawas
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Dokumentasi Praktik Baik & Inovasi Kepengawasan
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
              Pengawas dapat mengunggah karya dengan proses review admin. Konten dikurasi dalam kategori strategis sehingga mudah ditemukan.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {karyaCategories.map((category) => (
              <Card
                key={category.title}
                className="group h-full border border-border/50 bg-white shadow-sm transition-all hover:shadow-md hover:shadow-primary/10"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="px-0 text-primary" asChild>
                    <Link href="#">Jelajahi arsip →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regulasi Section */}
      <section id="regulasi" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Main Regulasi Card */}
            <Card className="border border-primary/20 bg-gradient-to-br from-white via-secondary/50 to-secondary/20 text-foreground shadow-xl">
              <CardHeader>
                <Badge variant="outline" className="w-max rounded-full border-primary/40 text-primary">
                  Regulasi Terbaru
                </Badge>
                <CardTitle className="text-2xl font-semibold text-primary">
                  Pusat Informasi & Regulasi Pendidikan
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Update kebijakan, surat edaran, juknis terbaru, dan agenda MKPS dalam satu tempat dengan fitur pencarian cerdas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-foreground/90">
                <p className="leading-relaxed">• Kumpulan regulasi terstruktur berdasarkan jenis dan tahun.</p>
                <p className="leading-relaxed">• Unduh cepat dalam format PDF dengan metadata lengkap.</p>
                <p className="leading-relaxed">
                  • Notifikasi otomatis saat ada regulasi baru yang relevan dengan wilayah tugas pengawas.
                </p>
                <Button className="bg-primary text-primary-foreground shadow-md hover:bg-primary/90" asChild>
                  <Link href="#">Buka pusat regulasi</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <div className="grid gap-6">
              {featureCards.map((feature) => (
                <Card
                  key={feature.title}
                  className="group border border-border/50 bg-white shadow-sm transition-all hover:shadow-md hover:shadow-primary/10"
                >
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="space-y-2">
                      <Badge variant="outline" className="rounded-full">
                        {feature.badge}
                      </Badge>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary" asChild>
                      <Link href={feature.href}>Buka</Link>
                    </Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Forum Section */}
      <section id="forum" className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="rounded-full">
                Forum & Kolaborasi
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Diskusi Terarah untuk Menjawab Tantangan Lapangan
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Pengawas dapat membuka topik, berbagi dokumen pendukung, menandai wilayah terdampak, serta menyusun rekomendasi tindak lanjut bersama. Admin MKPS memoderasi diskusi agar tetap fokus pada peningkatan mutu.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="rounded-full border-primary/30 text-primary">
                  Moderasi Admin
                </Badge>
                <Badge variant="outline" className="rounded-full border-primary/30 text-primary">
                  Role-Based Access
                </Badge>
                <Badge variant="outline" className="rounded-full border-primary/30 text-primary">
                  Dokumen Pendukung
                </Badge>
              </div>
            </div>

            <Card className="border border-border/50 bg-white shadow-md">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl font-semibold text-foreground">
                  Aktivitas Forum Terbaru
                </CardTitle>
                <CardDescription>
                  Lihat isu yang sedang dibahas dan kontribusi lintas kabupaten/kota.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-secondary/30 p-4">
                  <p className="font-semibold text-foreground">
                    Strategi menindaklanjuti hasil AKM kelas XII 2024
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    · Pengawas: Wilayah Cabdin Pekalongan · 18 tanggapan
                  </p>
                </div>
                <div className="rounded-lg border border-primary/20 bg-secondary/30 p-4">
                  <p className="font-semibold text-foreground">
                    Template asesmen supervisi manajerial berbasis data keuangan
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    · Pengawas: Wilayah Cabdin Pati · 12 tanggapan
                  </p>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/auth/login">Gabung Forum Pengawas</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-secondary/20 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <Badge variant="outline" className="mb-6 rounded-full">
            Manfaat Strategis
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Satu Sistem, Seluruh Siklus Kepengawasan dalam Genggaman
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            SIP-Kepengawasan Jateng mempermudah koordinasi lintas wilayah, menyediakan data real-time, dan mempercepat penyusunan laporan berkala maupun tahunan.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Integrasi Data",
              "Kolaborasi Lintas Wilayah",
              "Analitik Real-Time",
              "Pelaporan Otomatis",
              "Notifikasi Pintar",
              "Backup Cloud",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-primary/20 bg-white/80 p-6 text-center font-semibold text-foreground shadow-sm transition-all hover:shadow-md hover:shadow-primary/10"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="shadow-lg shadow-primary/20" asChild>
              <Link href="/auth/register">Daftar Pengawas Baru</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary/30" asChild>
              <Link href="/auth/login">Masuk sebagai Admin MKPS</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
