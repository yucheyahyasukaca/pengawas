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
  FileText,
  GraduationCap,
  Award,
  Filter,
} from "lucide-react";

// Mock data - in production, this would come from an API
const karyaData = [
  {
    id: "kry-001",
    title: "Peningkatan Kualitas Supervisi Akademik melalui Pendekatan Kolaboratif",
    excerpt: "Penelitian tentang efektivitas pendekatan kolaboratif dalam supervisi akademik yang menghasilkan peningkatan signifikan pada kualitas pembelajaran.",
    author: "Dr. Ahmad Hidayat, M.Pd.",
    date: "2025-10-31",
    readTime: "12 menit",
    type: "Tulisan Ilmiah Populer",
    category: null,
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
    featured: true,
    views: 1245,
  },
  {
    id: "kry-002",
    title: "Evaluasi Implementasi Kurikulum Merdeka di SMA Negeri Se-Jawa Tengah",
    excerpt: "Hasil penelitian menyeluruh tentang implementasi Kurikulum Merdeka dengan fokus pada tantangan dan solusi inovatif yang telah diterapkan.",
    author: "Prof. Dr. Siti Nurhaliza, M.Si.",
    date: "2025-10-28",
    readTime: "15 menit",
    type: "Hasil Penelitian Pengawas",
    category: null,
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    featured: false,
    views: 892,
  },
  {
    id: "kry-003",
    title: "Model Pendampingan Kepala Sekolah dalam Era Digital",
    excerpt: "Praktik baik pendampingan kepala sekolah dengan memanfaatkan teknologi digital untuk meningkatkan efektivitas kepemimpinan sekolah.",
    author: "Drs. Bambang Sutrisno, M.M.",
    date: "2025-10-25",
    readTime: "10 menit",
    type: "Best Practice / Praktik Baik Pengawas",
    category: "Pendampingan Kepala Sekolah",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
    featured: false,
    views: 756,
  },
  {
    id: "kry-004",
    title: "Inovasi Supervisi Akademik Berbasis Data dan Teknologi",
    excerpt: "Pengalaman implementasi sistem supervisi akademik berbasis data yang meningkatkan akurasi dan efisiensi proses pengawasan.",
    author: "Hj. Sari Indrawati, S.Pd., M.Pd.",
    date: "2025-10-22",
    readTime: "8 menit",
    type: "Best Practice / Praktik Baik Pengawas",
    category: "Supervisi Akademik",
    thumbnail: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop",
    featured: false,
    views: 634,
  },
  {
    id: "kry-005",
    title: "Penguatan Manajemen Sekolah melalui Supervisi Manajerial",
    excerpt: "Refleksi praktik tentang bagaimana supervisi manajerial dapat mengoptimalkan pengelolaan sumber daya sekolah untuk mencapai tujuan pendidikan.",
    author: "Dr. Agus Setiawan, M.Pd.",
    date: "2025-10-20",
    readTime: "11 menit",
    type: "Tulisan Ilmiah Populer",
    category: null,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    featured: false,
    views: 523,
  },
  {
    id: "kry-006",
    title: "Platform Digital untuk Inovasi Kepengawasan",
    excerpt: "Best practice pengembangan dan implementasi platform digital yang memfasilitasi kolaborasi dan komunikasi antar pengawas sekolah.",
    author: "Ir. Budi Santoso, M.T.",
    date: "2025-10-18",
    readTime: "9 menit",
    type: "Best Practice / Praktik Baik Pengawas",
    category: "Inovasi Kepengawasan",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop",
    featured: false,
    views: 412,
  },
  {
    id: "kry-007",
    title: "Strategi Peningkatan Mutu Pendidikan melalui Supervisi Manajerial",
    excerpt: "Penelitian tentang hubungan antara kualitas supervisi manajerial dengan peningkatan mutu pendidikan di tingkat sekolah menengah.",
    author: "Dr. Retno Widyastuti, M.Si.",
    date: "2025-10-15",
    readTime: "14 menit",
    type: "Hasil Penelitian Pengawas",
    category: null,
    thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop",
    featured: false,
    views: 678,
  },
  {
    id: "kry-008",
    title: "Refleksi Praktik: Membangun Kultur Pembelajaran di Era Disrupsi",
    excerpt: "Tulisan reflektif tentang bagaimana pengawas dapat membantu sekolah membangun kultur pembelajaran yang adaptif di tengah perubahan cepat.",
    author: "Drs. Endang Sri Wahyuni, M.Pd.",
    date: "2025-10-12",
    readTime: "7 menit",
    type: "Tulisan Ilmiah Populer",
    category: null,
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop",
    featured: false,
    views: 445,
  },
];

const typeOptions = ["Semua", "Tulisan Ilmiah Populer", "Hasil Penelitian Pengawas", "Best Practice / Praktik Baik Pengawas"];
const categoryOptions = ["Semua Kategori", "Supervisi Akademik", "Manajerial", "Pendampingan Kepala Sekolah", "Inovasi Kepengawasan"];

export default function KaryaPengawasPage() {
  const [selectedType, setSelectedType] = useState("Semua");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredKarya = karyaData.find((karya) => karya.featured);
  const regularKarya = karyaData.filter((karya) => !karya.featured);

  // Filter karya based on type, category, and search
  const filteredKarya = regularKarya.filter((karya) => {
    const matchesType = selectedType === "Semua" || karya.type === selectedType;
    const matchesCategory = selectedCategory === "Semua Kategori" || karya.category === selectedCategory || (selectedCategory !== "Semua Kategori" && karya.category === null);
    const matchesSearch = searchQuery === "" || 
      karya.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      karya.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      karya.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    if (type === "Tulisan Ilmiah Populer") return FileText;
    if (type === "Hasil Penelitian Pengawas") return GraduationCap;
    return Award;
  };

  const getTypeColor = (type: string) => {
    if (type === "Tulisan Ilmiah Populer") return "bg-blue-100 text-blue-800 border-blue-200";
    if (type === "Hasil Penelitian Pengawas") return "bg-purple-100 text-purple-800 border-purple-200";
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#371314] via-[#4A1B1C] to-[#2A0A0B] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 rounded-full border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              Galeri Karya Pengawas
            </Badge>
            <h1 className="text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Tulisan & Karya
              <span className="mt-2 block text-[#F1B0B7]">
                Pengawas Sekolah
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              Kumpulan tulisan ilmiah, hasil penelitian, dan praktik baik pengawas sekolah dalam meningkatkan kualitas pendidikan
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari karya, penulis, atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-300 bg-slate-50 pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="size-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">Tipe Karya:</span>
                {typeOptions.map((type) => (
                  <Button
                    key={type}
                    variant={type === selectedType ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className={
                      type === selectedType
                        ? "rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700"
                        : "rounded-full border-slate-300 px-4 font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                    }
                  >
                    {type}
                  </Button>
                ))}
              </div>

              {selectedType === "Best Practice / Praktik Baik Pengawas" && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">Kategori:</span>
                  {categoryOptions.map((category) => (
                    <Button
                      key={category}
                      variant={category === selectedCategory ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        category === selectedCategory
                          ? "rounded-full border-0 bg-emerald-600 px-4 font-semibold text-white shadow-md transition hover:bg-emerald-700"
                          : "rounded-full border-slate-300 px-4 font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-600"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Karya */}
            {featuredKarya && (
              <Card className="group overflow-hidden border-0 bg-gradient-to-br from-rose-500 to-pink-600 shadow-2xl transition hover:shadow-3xl">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <Image
                      src={featuredKarya.thumbnail}
                      alt={featuredKarya.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 right-4 border-0 bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                      {featuredKarya.type}
                    </Badge>
                    {featuredKarya.category && (
                      <Badge className="absolute top-4 left-4 border-0 bg-emerald-500/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                        {featuredKarya.category}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="flex flex-col justify-center p-8 text-white">
                    <div className="flex items-center gap-3 text-sm text-white/90">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>{new Date(featuredKarya.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{featuredKarya.readTime}</span>
                      </div>
                    </div>
                    <h2 className="mt-3 text-2xl font-bold leading-tight">
                      {featuredKarya.title}
                    </h2>
                    <p className="mt-3 text-white/90 line-clamp-3">
                      {featuredKarya.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/80">
                      <span className="font-semibold">{featuredKarya.author}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="size-3.5" />
                        <span>{featuredKarya.views} dilihat</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-6 rounded-full border-white/30 bg-white/10 px-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
                      asChild
                    >
                      <Link href={`/karya-pengawas/${featuredKarya.id}`}>
                        Baca Selengkapnya
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Regular Karya Grid */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedType === "Semua" ? "Semua Karya" : selectedType}
                </h2>
                <span className="text-sm text-slate-600">
                  {filteredKarya.length} karya ditemukan
                </span>
              </div>
              
              {filteredKarya.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredKarya.map((karya) => {
                    const TypeIcon = getTypeIcon(karya.type);
                    return (
                      <Card
                        key={karya.id}
                        className="group overflow-hidden border border-slate-200 bg-white shadow-md transition hover:shadow-lg"
                      >
                        <Link href={`/karya-pengawas/${karya.id}`}>
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={karya.thumbnail}
                              alt={karya.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <Badge className={`absolute top-3 right-3 border px-3 py-1 text-xs font-semibold ${getTypeColor(karya.type)}`}>
                              <TypeIcon className="mr-1.5 inline size-3" />
                              {karya.type === "Best Practice / Praktik Baik Pengawas" ? "Best Practice" : karya.type}
                            </Badge>
                            {karya.category && (
                              <Badge className="absolute top-3 left-3 border-0 bg-emerald-500/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                                {karya.category}
                              </Badge>
                            )}
                          </div>
                          <CardHeader>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="size-3.5" />
                                <span>{new Date(karya.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="size-3.5" />
                                <span>{karya.readTime}</span>
                              </div>
                            </div>
                            <CardTitle className="mt-2 line-clamp-2 text-lg font-bold text-slate-900 group-hover:text-rose-600 transition">
                              {karya.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 text-slate-600">
                              {karya.excerpt}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-slate-500">
                                  {karya.author}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                  <Eye className="size-3" />
                                  <span>{karya.views} dilihat</span>
                                </div>
                              </div>
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
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="size-16 text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Tidak ada karya ditemukan
                  </h3>
                  <p className="text-sm text-slate-600">
                    Coba ubah filter atau kata kunci pencarian Anda
                  </p>
                </div>
              )}
            </div>

            {/* Load More */}
            {filteredKarya.length > 0 && (
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
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Popular Karya */}
            <Card className="border border-slate-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Terpopuler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {karyaData
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((karya, index) => (
                    <Link
                      key={karya.id}
                      href={`/karya-pengawas/${karya.id}`}
                      className="group flex gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-lg font-bold text-white">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-rose-600 transition">
                          {karya.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <Eye className="size-3.5" />
                          <span>{karya.views} dilihat</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </CardContent>
            </Card>

            {/* Kategori Best Practice */}
            <Card className="border border-slate-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Kategori Best Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {categoryOptions.slice(1).map((category) => (
                    <Link
                      key={category}
                      href={`/karya-pengawas?type=Best Practice / Praktik Baik Pengawas&category=${category}`}
                      className="rounded-lg border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Type Stats */}
            <Card className="border border-slate-200 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Statistik Karya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">Tulisan Ilmiah</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {karyaData.filter(k => k.type === "Tulisan Ilmiah Populer").length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-purple-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="size-4 text-purple-600" />
                    <span className="text-sm font-medium text-slate-700">Penelitian</span>
                  </div>
                  <span className="text-sm font-bold text-purple-600">
                    {karyaData.filter(k => k.type === "Hasil Penelitian Pengawas").length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Award className="size-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">Best Practice</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">
                    {karyaData.filter(k => k.type === "Best Practice / Praktik Baik Pengawas").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

