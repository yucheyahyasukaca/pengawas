import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Eye,
} from "lucide-react";

// Mock data - in production, this would come from an API
const newsData = [
  {
    id: "brt-001",
    title: "Peluncuran Modul Supervisi Digital MKPS",
    excerpt: "Platform terbaru untuk memudahkan pengawas sekolah dalam melaksanakan supervisi akademik dan manajerial berbasis digital.",
    author: "Admin MKPS",
    date: "2025-10-31",
    readTime: "5 menit",
    category: "Inovasi",
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "brt-002",
    title: "Sinergi MKPS dan Komite Sekolah untuk Penguatan Literasi",
    excerpt: "Kolaborasi strategis antara MKPS dan komite sekolah dalam menguatkan program literasi di jenjang SMA dan SLB se-Jawa Tengah.",
    author: "Admin MKPS",
    date: "2025-10-28",
    readTime: "7 menit",
    category: "Kolaborasi",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "brt-003",
    title: "Best Practice Penguatan Numerasi di SMA",
    excerpt: "Kisah sukses implementasi program numerasi di beberapa SMA yang menunjukkan peningkatan signifikan dalam kemampuan siswa.",
    author: "Rudi Hartono",
    date: "2025-10-25",
    readTime: "6 menit",
    category: "Best Practice",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "brt-004",
    title: "Pendampingan Implementasi Kurikulum Merdeka di SLB",
    excerpt: "Upaya nyata MKPS dalam mendampingi sekolah luar biasa dalam mengimplementasikan Kurikulum Merdeka yang inklusif.",
    author: "Eka Suryani",
    date: "2025-10-22",
    readTime: "8 menit",
    category: "Pendampingan",
    thumbnail: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "brt-005",
    title: "Pelatihan Dashboard Pengawasan Berbasis Data",
    excerpt: "Pelatihan intensif untuk pengawas sekolah dalam mengoptimalkan penggunaan dashboard berbasis data untuk supervisi.",
    author: "Admin MKPS",
    date: "2025-10-20",
    readTime: "4 menit",
    category: "Pelatihan",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "brt-006",
    title: "Monitoring Evaluasi Implementasi Program Kepengawasan",
    excerpt: "Hasil monitoring dan evaluasi program kepengawasan semester ganjil menunjukkan peningkatan kualitas supervisi.",
    author: "Admin MKPS",
    date: "2025-10-18",
    readTime: "6 menit",
    category: "Monitoring",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop",
    featured: false,
  },
];

const categories = ["Semua", "Inovasi", "Kolaborasi", "Best Practice", "Pendampingan", "Pelatihan", "Monitoring"];

export default function BeritaPage() {
  const featuredNews = newsData.find((news) => news.featured);
  const regularNews = newsData.filter((news) => !news.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#371314] via-[#4A1B1C] to-[#2A0A0B] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 rounded-full border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              Portal Berita MKPS
            </Badge>
            <h1 className="text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Berita & Informasi
              <span className="mt-2 block text-[#F1B0B7]">
                Kepengawasan
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              Informasi terkini seputar program, inovasi, dan capaian kepengawasan di Provinsi Jawa Tengah
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                className="w-full rounded-full border border-slate-300 bg-slate-50 pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-200"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "Semua" ? "default" : "outline"}
                  size="sm"
                  className={
                    category === "Semua"
                      ? "rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700"
                      : "rounded-full border-slate-300 px-4 font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured News */}
            {featuredNews && (
              <Card className="group overflow-hidden border-0 bg-gradient-to-br from-rose-500 to-pink-600 shadow-2xl transition hover:shadow-3xl">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <Image
                      src={featuredNews.thumbnail}
                      alt={featuredNews.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 right-4 border-0 bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                      {featuredNews.category}
                    </Badge>
                  </div>
                  <CardContent className="flex flex-col justify-center p-8 text-white">
                    <div className="flex items-center gap-3 text-sm text-white/90">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>{new Date(featuredNews.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{featuredNews.readTime}</span>
                      </div>
                    </div>
                    <h2 className="mt-3 text-2xl font-bold leading-tight">
                      {featuredNews.title}
                    </h2>
                    <p className="mt-3 text-white/90 line-clamp-3">
                      {featuredNews.excerpt}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm font-medium text-white/80">
                        {featuredNews.author}
                      </span>
                      <Button
                        variant="outline"
                        className="rounded-full border-white/30 bg-white/10 px-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
                        asChild
                      >
                        <Link href={`/berita/${featuredNews.id}`}>
                          Baca Selengkapnya
                          <ArrowRight className="ml-2 size-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Regular News Grid */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-900">Berita Terbaru</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {regularNews.map((news) => (
                  <Card
                    key={news.id}
                    className="group overflow-hidden border border-slate-200 bg-white shadow-md transition hover:shadow-lg"
                  >
                    <Link href={`/berita/${news.id}`}>
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={news.thumbnail}
                          alt={news.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <Badge className="absolute top-3 right-3 border-0 bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                          {news.category}
                        </Badge>
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            <span>{new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            <span>{news.readTime}</span>
                          </div>
                        </div>
                        <CardTitle className="mt-2 line-clamp-2 text-lg font-bold text-slate-900 group-hover:text-rose-600 transition">
                          {news.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-slate-600">
                          {news.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">
                            {news.author}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                          >
                            Baca
                            <ArrowRight className="size-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>

            {/* Load More */}
            <div className="flex justify-center pt-8">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-rose-200 bg-white px-8 font-semibold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50"
              >
                Muat Lebih Banyak
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Popular News */}
            <Card className="border border-slate-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Terpopuler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {newsData.slice(0, 5).map((news, index) => (
                  <Link
                    key={news.id}
                    href={`/berita/${news.id}`}
                    className="group flex gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-lg font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-rose-600 transition">
                        {news.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <Eye className="size-3.5" />
                        <span>{Math.floor(Math.random() * 900 + 100)} dilihat</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="border border-slate-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(1).map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="rounded-full border-slate-300 px-4 py-1.5 font-medium text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

