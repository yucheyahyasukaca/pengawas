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
  BookOpen,
  GraduationCap,
  Award,
  FileCheck,
} from "lucide-react";

// Mock data - in production, this would come from an API
const karyaDatabase = [
  {
    id: "kry-001",
    title: "Peningkatan Kualitas Supervisi Akademik melalui Pendekatan Kolaboratif",
    author: "Dr. Ahmad Hidayat, M.Pd.",
    status: "Tayang",
    type: "Tulisan Ilmiah Populer",
    category: null,
    date: "31 Oktober 2025",
    submittedBy: "Dr. Ahmad Hidayat, M.Pd.",
    reviewer: "Admin MKPS",
    excerpt: "Penelitian tentang efektivitas pendekatan kolaboratif dalam supervisi akademik yang menghasilkan peningkatan signifikan pada kualitas pembelajaran.",
    content: `<p>Supervisi akademik sebagai salah satu fungsi utama pengawas sekolah memerlukan pendekatan yang lebih kolaboratif dan partisipatif untuk meningkatkan efektivitasnya.</p>
    
    <h2>Metodologi Penelitian</h2>
    <p>Penelitian ini menggunakan pendekatan kualitatif dengan studi kasus di beberapa SMA di Jawa Tengah. Data dikumpulkan melalui observasi, wawancara mendalam, dan analisis dokumen.</p>
    
    <h2>Temuan Utama</h2>
    <ul>
      <li>Pendekatan kolaboratif meningkatkan keterlibatan guru dalam proses pembelajaran</li>
      <li>Komunikasi yang terbuka memfasilitasi perbaikan berkelanjutan</li>
      <li>Hasil pembelajaran siswa meningkat secara signifikan</li>
      <li>Kepuasan guru terhadap proses supervisi meningkat</li>
    </ul>

    <h2>Implikasi Praktis</h2>
    <p>Pendekatan kolaboratif dalam supervisi akademik dapat diimplementasikan melalui:</p>
    <ul>
      <li>Pembentukan komunitas praktik</li>
      <li>Diskusi berbasis refleksi</li>
      <li>Rencana perbaikan bersama</li>
      <li>Evaluasi kolaboratif</li>
    </ul>

    <h2>Kesimpulan</h2>
    <p>Pendekatan kolaboratif dalam supervisi akademik terbukti efektif dalam meningkatkan kualitas pembelajaran dan kepuasan stakeholder pendidikan.</p>`,
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
    views: 1245,
    downloads: 87,
  },
  {
    id: "kry-002",
    title: "Evaluasi Implementasi Kurikulum Merdeka di SMA Negeri Se-Jawa Tengah",
    author: "Prof. Dr. Siti Nurhaliza, M.Si.",
    status: "Menunggu Review",
    type: "Hasil Penelitian Pengawas",
    category: null,
    date: "28 Oktober 2025",
    submittedBy: "Prof. Dr. Siti Nurhaliza, M.Si.",
    reviewer: "-",
    excerpt: "Hasil penelitian menyeluruh tentang implementasi Kurikulum Merdeka dengan fokus pada tantangan dan solusi inovatif yang telah diterapkan.",
    content: `<p>Implementasi Kurikulum Merdeka di SMA Negeri se-Jawa Tengah telah memasuki tahap yang lebih matang dengan berbagai inovasi dan adaptasi lokal.</p>
    
    <h2>Metodologi Penelitian</h2>
    <p>Penelitian ini menggunakan pendekatan mixed method dengan survei terhadap 150 SMA Negeri dan studi kasus mendalam di 10 sekolah.</p>

    <h2>Temuan Utama</h2>
    <p>Beberapa temuan utama dari penelitian ini meliputi:</p>
    <ul>
      <li>Tingkat adopsi Kurikulum Merdeka mencapai 85%</li>
      <li>Tantangan utama terletak pada adaptasi asesmen</li>
      <li>Inovasi lokal berkembang pesat di berbagai sekolah</li>
      <li>Keterlibatan stakeholder sangat penting</li>
    </ul>`,
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    views: 0,
    downloads: 0,
  },
];

export default function KaryaDetailPage() {
  const params = useParams();
  const karyaId = params.id as string;
  const [karya, setKarya] = useState<any>(null);

  useEffect(() => {
    // Find karya by ID
    const foundKarya = karyaDatabase.find(
      (k) => k.id.toLowerCase() === karyaId.toLowerCase()
    );
    setKarya(foundKarya || null);
  }, [karyaId]);

  if (!karya) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-semibold text-slate-900">Karya tidak ditemukan</p>
        <Button
          variant="outline"
          className="mt-4 gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
          asChild
        >
          <Link href="/admin/karya-pengawas">
            <ArrowLeft className="size-4" />
            Kembali ke Daftar Karya
          </Link>
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tayang":
        return "bg-emerald-200 text-emerald-800";
      case "Diterima":
        return "bg-blue-200 text-blue-800";
      case "Menunggu Review":
        return "bg-amber-200 text-amber-800";
      case "Ditolak":
        return "bg-rose-200 text-rose-800";
      case "Draft":
        return "bg-slate-200 text-slate-800";
      default:
        return "bg-slate-200 text-slate-800";
    }
  };

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

  const TypeIcon = getTypeIcon(karya.type);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-md">
              <BookOpen className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-xl font-bold text-slate-900">Detail Karya</CardTitle>
              <CardDescription className="text-slate-600">
                Informasi lengkap tentang karya pengawas
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              asChild
            >
              <Link href="/admin/karya-pengawas">
                <ArrowLeft className="size-4" />
                Kembali
              </Link>
            </Button>
            {karya.status === "Menunggu Review" && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-0 bg-emerald-100 px-4 font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-200 hover:text-emerald-900"
                asChild
              >
                <Link href={`/admin/karya-pengawas/${karyaId}/review`}>
                  <FileCheck className="size-4" />
                  Review
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              asChild
            >
              <Link href={`/admin/karya-pengawas/${karyaId}/edit`}>
                <Edit3 className="size-4" />
                Edit
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          {karya.thumbnail && (
            <Card className="overflow-hidden border border-rose-200 bg-white shadow-md shadow-rose-100/70">
              <div className="relative h-64 w-full">
                <Image
                  src={karya.thumbnail}
                  alt={karya.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          )}

          {/* Content */}
          <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className={cn("rounded-full border px-3 py-1 font-semibold shadow-sm", getTypeColor(karya.type))}
                >
                  <TypeIcon className="mr-1.5 inline size-4" />
                  {karya.type === "Best Practice / Praktik Baik Pengawas" ? "Best Practice" : karya.type}
                </Badge>
                {karya.category && (
                  <Badge className={cn("rounded-full border px-3 py-1 font-semibold", getTypeColor(karya.type))}>
                    {karya.category}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full border-0 px-3 font-semibold shadow-sm",
                    getStatusColor(karya.status)
                  )}
                >
                  {karya.status}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                {karya.title}
              </CardTitle>
              <CardDescription className="mt-2 text-base text-slate-600">
                {karya.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-ul:text-slate-700 prose-li:text-slate-700"
                dangerouslySetInnerHTML={{ __html: karya.content }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Informasi Karya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 size-5 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Penulis</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{karya.author}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 size-5 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tanggal</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{karya.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 size-5 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tipe</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{karya.type}</p>
                </div>
              </div>
              {karya.category && (
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 size-5 shrink-0 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kategori</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{karya.category}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <User className="mt-0.5 size-5 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Diajukan Oleh</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{karya.submittedBy}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileCheck className="mt-0.5 size-5 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reviewer</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{karya.reviewer}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          {karya.status === "Tayang" && (
            <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="size-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Dilihat</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{karya.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="size-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Diunduh</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{karya.downloads}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {karya.status === "Tayang" && (
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                  asChild
                >
                  <Link href={`/karya-pengawas/${karya.id}`}>
                    <Globe className="size-4" />
                    Lihat di Portal
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              >
                <Download className="size-4" />
                Unduh PDF
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              >
                <Share2 className="size-4" />
                Bagikan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

