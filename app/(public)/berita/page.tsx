"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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
  Eye,
  Filter,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Generate view counts once with lazy initialization
  const [viewCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    newsData.forEach((news) => {
      counts[news.id] = Math.floor(Math.random() * 900 + 100);
    });
    return counts;
  });

  // Filter news based on selected category
  const featuredNews = newsData.find((news) => news.featured && (selectedCategory === "Semua" || news.category === selectedCategory));
  const regularNews = newsData.filter((news) => 
    !news.featured && (selectedCategory === "Semua" || news.category === selectedCategory)
  );

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
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                className="w-full rounded-full border border-slate-300 bg-slate-50 pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Mobile Dropdown Filter */}
              <div className="flex flex-col gap-3 md:hidden">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="size-4 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-900">Kategori:</span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex w-full items-center justify-between gap-4 rounded-full border-0 bg-slate-100 pl-4 pr-2 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
                  >
                    <span className="flex-1 text-left">{selectedCategory}</span>
                    <div className="flex shrink-0 items-center justify-center rounded-lg bg-white/80 px-2.5 py-1.5 mr-2 shadow-sm transition-all hover:bg-white">
                      <ChevronDown
                        className={cn(
                          "size-3.5 text-rose-600 transition-all duration-200",
                          isFilterOpen && "rotate-180 text-rose-700"
                        )}
                      />
                    </div>
                  </button>
                  {isFilterOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsFilterOpen(false)}
                      />
                      <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
                        {categories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsFilterOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50",
                              selectedCategory === category
                                ? "bg-rose-50 text-rose-700"
                                : "text-slate-700"
                            )}
                          >
                            <span>{category}</span>
                            {selectedCategory === category && (
                              <Check className="size-4 text-rose-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Desktop Button Filter */}
              <div className="hidden flex-wrap items-center gap-2 md:flex">
                <Filter className="size-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">Kategori:</span>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === selectedCategory ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      category === selectedCategory
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
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured News */}
            {featuredNews && (
              <Card className="group overflow-hidden border-0 bg-gradient-to-br from-blue-600 to-cyan-600 shadow-2xl transition hover:shadow-3xl p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <Image
                      src={featuredNews.thumbnail}
                      alt={featuredNews.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 rounded-full border border-white/30 bg-white/90 backdrop-blur-md px-4 py-2 shadow-lg">
                      <span className="text-xs font-bold text-slate-900">{featuredNews.category}</span>
                    </div>
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
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/80">
                      <span className="font-semibold">{featuredNews.author}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="size-3.5" />
                        <span>{viewCounts[featuredNews.id] || 0} dilihat</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-6 rounded-full border-white/30 bg-white/10 px-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
                      asChild
                    >
                      <Link href={`/berita/${featuredNews.id}`}>
                        Baca Selengkapnya
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
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
                      <CardHeader className="pt-5">
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
            <div className="flex justify-center pt-10">
              <Button
                variant="outline"
                size="lg"
                className="group relative overflow-hidden rounded-full border-0 bg-gradient-to-r from-blue-600 to-cyan-600 px-10 py-6 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Muat Lebih Banyak
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-lg font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-rose-600 transition">
                        {news.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <Eye className="size-3.5" />
                        <span>{viewCounts[news.id] || 0} dilihat</span>
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

