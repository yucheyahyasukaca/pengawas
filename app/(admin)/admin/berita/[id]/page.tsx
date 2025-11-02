"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Edit3,
  Globe,
  Calendar,
  User,
  FileText,
  Eye,
  Download,
  Share2,
} from "lucide-react";

// Mock data - in production, this would come from an API
const newsDatabase = [
  {
    id: "BRT-001",
    title: "Sinergi MKPS dan Komite Sekolah untuk Penguatan Literasi",
    author: "Admin MKPS",
    status: "Tayang",
    date: "31 Oktober 2025",
    channel: "Portal Publik",
    excerpt: "Kolaborasi strategis antara MKPS dan komite sekolah dalam meningkatkan kemampuan literasi siswa di seluruh Jawa Tengah.",
    content: `<p>Dengan semangat kolaborasi yang kuat, Musyawarah Kerja Pengawas Sekolah (MKPS) Provinsi Jawa Tengah melaksanakan program penguatan literasi melalui kerja sama dengan komite sekolah di berbagai daerah.</p>
    
    <h2>Program Strategis</h2>
    <p>Program ini mencakup beberapa komponen utama:</p>
    <ul>
      <li>Pelatihan guru dalam pengembangan materi literasi</li>
      <li>Penyediaan sumber bacaan berkualitas</li>
      <li>Monitoring dan evaluasi berkelanjutan</li>
      <li>Pembentukan komunitas belajar</li>
    </ul>

    <h2>Dampak Positif</h2>
    <p>Dalam tiga bulan pertama implementasi, program ini telah menunjukkan hasil yang menggembirakan dengan peningkatan skor literasi rata-rata sebesar 15% di sekolah-sekolah yang dilibatkan.</p>

    <h2>Komitmen Berkelanjutan</h2>
    <p>MKPS berkomitmen untuk terus mendukung penguatan literasi melalui pendekatan kolaboratif dan berbasis data, dengan fokus pada peningkatan kualitas pembelajaran dan hasil belajar siswa.</p>`,
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
    views: 1245,
    shares: 87,
  },
  {
    id: "BRT-002",
    title: "Pendampingan Implementasi Kurikulum Merdeka di SLB",
    author: "Eka Suryani",
    status: "Draft",
    date: "29 Oktober 2025",
    channel: "Rilis Internal",
    excerpt: "Program pendampingan intensif untuk guru SLB dalam implementasi Kurikulum Merdeka yang lebih inklusif.",
    content: `<p>Implementasi Kurikulum Merdeka di Sekolah Luar Biasa (SLB) membutuhkan pendekatan khusus yang mempertimbangkan kebutuhan dan karakteristik siswa berkebutuhan khusus.</p>
    
    <h2>Materi Pelatihan</h2>
    <p>Pelatihan mencakup adaptasi kurikulum, pengembangan asesmen, dan strategi pembelajaran inklusif yang disesuaikan dengan kebutuhan setiap siswa.</p>

    <h2>Dukungan Berkelanjutan</h2>
    <p>Tim pendamping MKPS akan memberikan dukungan teknis dan mentoring selama satu semester untuk memastikan implementasi yang efektif.</p>`,
    thumbnail: "",
    views: 0,
    shares: 0,
  },
  {
    id: "BRT-003",
    title: "Best Practice Penguatan Numerasi di SMA",
    author: "Rudi Hartono",
    status: "Terjadwal",
    date: "28 Oktober 2025",
    channel: "Portal Publik",
    excerpt: "Berbagi praktik terbaik dalam meningkatkan kompetensi numerasi siswa SMA melalui pendekatan kontekstual.",
    content: `<p>Numerasi sebagai kompetensi dasar perlu dikembangkan dengan pendekatan yang menarik dan relevan dengan kehidupan sehari-hari.</p>
    
    <h2>Strategi Pembelajaran</h2>
    <ul>
      <li>Pembelajaran berbasis proyek</li>
      <li>Integrasi teknologi digital</li>
      <li>Kolaborasi lintas mata pelajaran</li>
      <li>Asesmen autentik</li>
    </ul>

    <h2>Case Studies</h2>
    <p>Beberapa SMA telah berhasil meningkatkan minat dan hasil belajar numerasi siswa melalui implementasi strategi inovatif yang akan dibagikan dalam artikel ini.</p>`,
    thumbnail: "",
    views: 0,
    shares: 0,
  },
  {
    id: "BRT-004",
    title: "Pelatihan Dashboard Pengawasan Berbasis Data",
    author: "Admin MKPS",
    status: "Butuh Review",
    date: "26 Oktober 2025",
    channel: "Portal Publik",
    excerpt: "Pelatihan penggunaan dashboard digital untuk pengawasan berbasis data real-time.",
    content: `<p>Era digital menuntut pengawas sekolah untuk memanfaatkan teknologi dalam melaksanakan tugas pengawasan.</p>
    
    <h2>Dashboard Features</h2>
    <p>Dashboard ini menyediakan berbagai fitur analitik untuk mendukung pengambilan keputusan berbasis data.</p>

    <h2>Output yang Diharapkan</h2>
    <p>Setelah pelatihan, pengawas diharapkan mampu:</p>
    <ul>
      <li>Mengakses dan menafsirkan data real-time</li>
      <li>Mengidentifikasi tren dan pola</li>
      <li>Menyusun rekomendasi berbasis evidence</li>
    </ul>`,
    thumbnail: "",
    views: 0,
    shares: 0,
  },
];

export default function NewsDetailPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState<typeof newsDatabase[0] | null>(null);

  useEffect(() => {
    // Load news data
    const loadNews = () => {
      setIsLoading(true);
      const foundNews = newsDatabase.find(
        (item) => item.id.toLowerCase() === (params.id as string)
      );
      
      setTimeout(() => {
        if (foundNews) {
          setNews(foundNews);
        }
        setIsLoading(false);
      }, 300);
    };

    loadNews();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        <p className="text-slate-600">Memuat berita...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-xl font-semibold text-slate-900">Berita tidak ditemukan</p>
        <Button variant="outline" asChild>
          <Link href="/admin/berita">
            <ArrowLeft className="size-4 mr-2" />
            Kembali ke Manajemen Berita
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-md">
                <FileText className="size-5 text-white" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-xl font-bold text-slate-900">Detail Berita</CardTitle>
                <CardDescription className="text-slate-600">
                  Lihat dan kelola konten berita
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
              <Link href="/admin/berita">
                <ArrowLeft className="size-4" />
                Kembali
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-0 bg-rose-100 px-4 font-semibold text-rose-700 shadow-sm transition hover:bg-rose-200"
              asChild
            >
              <Link href={`/admin/berita/${params.id}/edit`}>
                <Edit3 className="size-4" />
                Ubah
              </Link>
            </Button>
            <Button
              size="sm"
              variant="default"
              className="gap-2 rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700"
              asChild
            >
              <Link href="/berita">
                <Globe className="size-4" />
                Lihat di Portal
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Article */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Thumbnail */}
          {news.thumbnail && (
            <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70 overflow-hidden">
              <div className="relative w-full h-96">
                <Image
                  src={news.thumbnail}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>
          )}

          {/* Article Header */}
          <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
            <CardHeader className="border-b border-rose-100">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border-0 px-3 font-semibold shadow-sm",
                      news.status === "Tayang"
                        ? "bg-emerald-200 text-emerald-800"
                        : news.status === "Draft"
                          ? "bg-amber-200 text-amber-800"
                          : news.status === "Terjadwal"
                            ? "bg-sky-200 text-sky-800"
                            : "bg-rose-100 text-rose-600",
                    )}
                  >
                    {news.status}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-0 bg-slate-100 px-3 font-semibold text-slate-700 shadow-sm">
                    {news.id}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-0 bg-blue-50 px-3 font-semibold text-blue-700 shadow-sm">
                    {news.channel}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900">
                  {news.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-rose-500" />
                    <span className="font-semibold">{news.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-rose-500" />
                    <span>{news.date}</span>
                  </div>
                  {news.status === "Tayang" && (
                    <>
                      <div className="flex items-center gap-2">
                        <Eye className="size-4 text-rose-500" />
                        <span>{news.views.toLocaleString()} dilihat</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Share2 className="size-4 text-rose-500" />
                        <span>{news.shares} dibagikan</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Excerpt */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <p className="text-base leading-relaxed text-slate-700 italic">
                  {news.excerpt}
                </p>
              </div>

              {/* Content */}
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Actions */}
          <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Tindakan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 rounded-full border-0 bg-rose-100 px-4 font-semibold text-rose-700 shadow-sm transition hover:bg-rose-200"
                asChild
              >
                <Link href={`/admin/berita/${params.id}/edit`}>
                  <Edit3 className="size-4" />
                  Ubah Berita
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200"
              >
                <Download className="size-4" />
                Unduh PDF
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 rounded-full border-0 bg-blue-50 px-4 font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100"
                asChild
              >
                <Link href="/berita">
                  <Globe className="size-4" />
                  Lihat di Portal Publik
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Article Info */}
          <Card className="border border-slate-200 bg-gradient-to-br from-rose-50 to-amber-50 shadow-md">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full border-0 px-3 font-semibold shadow-sm",
                    news.status === "Tayang"
                      ? "bg-emerald-200 text-emerald-800"
                      : news.status === "Draft"
                        ? "bg-amber-200 text-amber-800"
                        : news.status === "Terjadwal"
                          ? "bg-sky-200 text-sky-800"
                          : "bg-rose-100 text-rose-600",
                  )}
                >
                  {news.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Channel
                </p>
                <p className="text-sm font-medium text-slate-900">{news.channel}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tanggal Publikasi
                </p>
                <p className="text-sm font-medium text-slate-900">{news.date}</p>
              </div>
              {news.status === "Tayang" && (
                <>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total Dilihat
                    </p>
                    <p className="text-2xl font-bold text-rose-600">{news.views.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total Dibagikan
                    </p>
                    <p className="text-2xl font-bold text-blue-600">{news.shares}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

