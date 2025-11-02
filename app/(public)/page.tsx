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
import { PhotoSlider } from "@/components/ui/photo-slider";
import { siteConfig } from "@/config/site";

// Placeholder images - nanti bisa diganti dengan foto-foto di folder public
const sliderImages = [
  "/slider/slide-1.jpg",
  "/slider/slide-2.jpg",
  "/slider/slide-3.jpg",
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
        className="relative overflow-hidden bg-gradient-to-br from-[#371314] via-[#4A1B1C] to-[#2A0A0B] text-white"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay" />
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Content */}
            <div className="space-y-6 text-center sm:space-y-8 sm:text-left">
              <Badge className="mx-auto max-w-[280px] whitespace-normal break-words text-balance rounded-full border-white/30 bg-white/10 px-4 py-2 text-center text-xs font-medium leading-snug text-white sm:mx-0 sm:max-w-none sm:text-sm">
                {siteConfig.tagline}
              </Badge>
              <div className="mx-auto space-y-5 text-pretty sm:mx-0 sm:max-w-xl">
                <h1 className="text-balance text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  SIP-Kepengawasan
                  <span className="mt-2 block text-[#F1B0B7]">
                    Jawa Tengah
                  </span>
                </h1>
                <p className="text-base leading-relaxed text-white/85 sm:text-lg">
                  Platform terpadu untuk merencanakan, melaksanakan, dan melaporkan pengawasan pendidikan berbasis data dan kolaboratif.
                </p>
              </div>
              <div className="mx-auto flex w-full max-w-xs flex-col gap-3 sm:mx-0 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-start">
                <Button
                  size="lg"
                  className="w-full whitespace-normal rounded-full bg-white px-6 py-6 text-base text-[#371314] shadow-lg shadow-black/30 hover:bg-white/90 sm:w-auto"
                  asChild
                >
                  <Link href="/auth/login">Masuk ke Portal Pengawas</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full whitespace-normal rounded-full border-white/60 px-6 py-6 text-base text-white hover:bg-white/10 sm:w-auto"
                  asChild
                >
                  <Link href="/profil-mkps">Jelajahi Lebih Lanjut</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Photo Slider */}
            <div className="mx-auto w-full max-w-md sm:mx-0 sm:max-w-none lg:max-w-lg">
              <PhotoSlider 
                images={sliderImages} 
                interval={4000}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Agenda & News Section */}
      <section className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge className="mb-4 rounded-full border-white/30 bg-white/10 text-white">
              Informasi Terkini
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Agenda & Berita Terbaru
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Agenda Card */}
            <Card className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">
                  Agenda Terdekat
                </CardTitle>
                <CardDescription className="text-white/70">
                  Pastikan perencanaan supervisi dan pelaporan berjalan tepat waktu.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-white/20 bg-white/10 p-5">
                  <p className="text-sm font-bold text-[#F7CDD0]">12 November 2025</p>
                  <p className="mt-2 font-semibold text-white">
                    Workshop Penyelarasan RPK & RKS Berbasis Data
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    Cabdin Wilayah Surakarta · Wajib hadir untuk pengawas SMA.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* News Highlights */}
            <Card className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">
                  Berita & Highlight
                </CardTitle>
                <CardDescription className="text-white/70">
                  Update terbaru seputar kepengawasan dan kebijakan pendidikan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {newsHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="group rounded-lg border border-white/15 bg-white/5 p-4 transition-all hover:border-white/30 hover:bg-white/10"
                  >
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-white/70 line-clamp-2">
                      {item.description}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-2 inline-flex text-sm font-semibold text-[#F7CDD0] transition-colors hover:text-white"
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
      <section
        id="profil"
        className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 rounded-full border-white/30 bg-white/10 text-white">
              Profil MKPS
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Menguatkan Ekosistem Kepengawasan Provinsi Jawa Tengah
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-white/75">
              MKPS SMA & SLB Provinsi Jawa Tengah hadir sebagai penggerak utama peningkatan mutu melalui supervisi akademik, manajerial, dan pendampingan kepala sekolah yang terstruktur.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {programPillars.map((pillar) => (
              <Card
                key={pillar.title}
                className="group border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">
                    {pillar.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed text-white/70">
                    {pillar.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Karya Pengawas Section */}
      <section
        id="karya"
        className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 rounded-full border-white/30 bg-white/10 text-white">
              Tulisan & Karya Pengawas
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Dokumentasi Praktik Baik & Inovasi Kepengawasan
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-white/75">
              Pengawas dapat mengunggah karya dengan proses review admin. Konten dikurasi dalam kategori strategis sehingga mudah ditemukan.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {karyaCategories.map((category) => (
              <Card
                key={category.title}
                className="group h-full border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed text-white/70">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="px-0 text-[#F7CDD0] hover:text-white" asChild>
                    <Link href="#">Jelajahi arsip →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regulasi Section */}
      <section
        id="regulasi"
        className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Main Regulasi Card */}
            <Card className="border border-white/20 bg-gradient-to-br from-[#401416] via-[#592022] to-[#2B0D0E] text-white shadow-2xl shadow-black/30 backdrop-blur">
              <CardHeader>
                <Badge className="w-max rounded-full border-white/30 bg-white/10 text-white">
                  Regulasi Terbaru
                </Badge>
                <CardTitle className="text-2xl font-semibold text-[#F7CDD0]">
                  Pusat Informasi & Regulasi Pendidikan
                </CardTitle>
                <CardDescription className="text-white/70">
                  Update kebijakan, surat edaran, juknis terbaru, dan agenda MKPS dalam satu tempat dengan fitur pencarian cerdas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-white/80">
                <p className="leading-relaxed">• Kumpulan regulasi terstruktur berdasarkan jenis dan tahun.</p>
                <p className="leading-relaxed">• Unduh cepat dalam format PDF dengan metadata lengkap.</p>
                <p className="leading-relaxed">
                  • Notifikasi otomatis saat ada regulasi baru yang relevan dengan wilayah tugas pengawas.
                </p>
                <Button className="bg-white text-[#371314] shadow-lg shadow-black/30 hover:bg-white/90" asChild>
                  <Link href="#">Buka pusat regulasi</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <div className="grid gap-6">
              {featureCards.map((feature) => (
                <Card
                  key={feature.title}
                  className="group border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10"
                >
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="space-y-2">
                      <Badge className="rounded-full border-white/30 bg-white/10 text-white">
                        {feature.badge}
                      </Badge>
                      <CardTitle className="text-lg font-semibold text-white">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="leading-relaxed text-white/70">
                        {feature.description}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#F7CDD0] hover:text-white" asChild>
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
      <section
        id="forum"
        className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6 text-center lg:text-left">
              <Badge className="mx-auto rounded-full border-white/30 bg-white/10 text-white lg:mx-0">
                Forum & Kolaborasi
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Diskusi Terarah untuk Menjawab Tantangan Lapangan
              </h2>
              <p className="text-lg leading-relaxed text-white/75">
                Pengawas dapat membuka topik, berbagi dokumen pendukung, menandai wilayah terdampak, serta menyusun rekomendasi tindak lanjut bersama. Admin MKPS memoderasi diskusi agar tetap fokus pada peningkatan mutu.
              </p>
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <Badge className="rounded-full border-white/30 bg-white/10 px-3 py-1 text-white">
                  Moderasi Admin
                </Badge>
                <Badge className="rounded-full border-white/30 bg-white/10 px-3 py-1 text-white">
                  Role-Based Access
                </Badge>
                <Badge className="rounded-full border-white/30 bg-white/10 px-3 py-1 text-white">
                  Dokumen Pendukung
                </Badge>
              </div>
            </div>

            <Card className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 backdrop-blur">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl font-semibold text-white">
                  Aktivitas Forum Terbaru
                </CardTitle>
                <CardDescription className="text-white/70">
                  Lihat isu yang sedang dibahas dan kontribusi lintas kabupaten/kota.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-white/20 bg-white/10 p-4">
                  <p className="font-semibold text-white">
                    Strategi menindaklanjuti hasil AKM kelas XII 2024
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    · Pengawas: Wilayah Cabdin Pekalongan · 18 tanggapan
                  </p>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-4">
                  <p className="font-semibold text-white">
                    Template asesmen supervisi manajerial berbasis data keuangan
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    · Pengawas: Wilayah Cabdin Pati · 12 tanggapan
                  </p>
                </div>
                <Button
                  className="w-full border-white/30 text-white hover:bg-white/10"
                  variant="outline"
                  asChild
                >
                  <Link href="/auth/login">Gabung Forum Pengawas</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-24"
      >
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <Badge className="mb-6 rounded-full border-white/30 bg-white/10 text-white">
            Manfaat Strategis
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Satu Sistem, Seluruh Siklus Kepengawasan dalam Genggaman
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/75">
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
                className="rounded-xl border border-white/20 bg-white/10 p-6 text-center font-semibold text-white shadow-md shadow-black/30 transition-all hover:border-white/30 hover:bg-white/15"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="w-full bg-white text-[#371314] shadow-lg shadow-black/30 hover:bg-white/90 sm:w-auto"
              asChild
            >
              <Link href="/auth/register">Daftar Pengawas Baru</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white/40 text-white hover:bg-white/10 sm:w-auto"
              asChild
            >
              <Link href="/auth/login">Masuk sebagai Admin MKPS</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
