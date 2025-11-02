"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  FileImage,
  Eye,
  Save,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Globe,
  Upload,
  Calendar,
  User,
  Trash2,
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
  },
];

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    author: "",
    status: "Draft",
    publishedDate: "",
  });

  const statusOptions = [
    { value: "Draft", label: "Draft", color: "bg-amber-100 text-amber-800" },
    { value: "Terjadwal", label: "Terjadwal", color: "bg-blue-100 text-blue-800" },
    { value: "Tayang", label: "Tayang", color: "bg-emerald-100 text-emerald-800" },
    { value: "Butuh Review", label: "Butuh Review", color: "bg-rose-100 text-rose-800" },
  ];

  useEffect(() => {
    // Load news data
    const loadNews = () => {
      setIsLoading(true);
      const foundNews = newsDatabase.find(
        (item) => item.id.toLowerCase() === (params.id as string)
      );
      
      setTimeout(() => {
        if (foundNews) {
          setFormData({
            title: foundNews.title || "",
            excerpt: foundNews.excerpt || "",
            content: foundNews.content || "",
            thumbnail: foundNews.thumbnail || "",
            author: foundNews.author || "",
            status: foundNews.status || "Draft",
            publishedDate: "",
          });
        }
        setIsLoading(false);
      }, 300);
    };

    loadNews();
  }, [params.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push(`/admin/berita/${params.id}`);
    }, 2000);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setShowDeleteConfirm(false);
    router.push("/admin/berita");
  };

  const isFormValid = formData.title && formData.excerpt && formData.content && formData.author;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        <p className="text-slate-600">Memuat berita...</p>
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
                <CardTitle className="text-xl font-bold text-slate-900">Ubah Berita</CardTitle>
                <CardDescription className="text-slate-600">
                  Edit dan publikasikan informasi strategis
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
              <Link href={`/admin/berita/${params.id}`}>
                <ArrowLeft className="size-4" />
                Kembali
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Success Message */}
      {showSuccess && (
        <Card className="border border-emerald-200 bg-emerald-50/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <CheckCircle2 className="size-6 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold text-emerald-900">
                  Berita Berhasil Diperbarui!
                </p>
                <p className="text-sm text-emerald-700">
                  Mengarahkan ke halaman detail berita...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Editor Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Basic Information */}
            <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
              <CardHeader className="border-b border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-sm">
                    <FileText className="size-4 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">Konten Berita</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="title">
                    <FileText className="size-4 text-rose-500" />
                    Judul Berita
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    placeholder="Contoh: Peluncuran Modul Supervisi Digital"
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="excerpt">
                    <FileText className="size-4 text-rose-500" />
                    Ringkasan (Excerpt)
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="excerpt"
                    required
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200 resize-none"
                    placeholder="Tulis ringkasan singkat berita yang akan muncul di preview..."
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <FileText className="size-4 text-rose-500" />
                    Isi Berita
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="rounded-xl border border-slate-300 shadow-sm">
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => handleInputChange("content", content)}
                      placeholder="Tulis isi berita lengkap di sini..."
                      minHeight="400px"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Upload */}
            <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
              <CardHeader className="border-b border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-sm">
                    <ImageIcon className="size-4 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">Thumbnail Berita</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {formData.thumbnail ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50">
                      <Image
                        src={formData.thumbnail}
                        alt="Thumbnail preview"
                        width={800}
                        height={400}
                        className="w-full h-64 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange("thumbnail", "")}
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition hover:bg-rose-700"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                        <FileImage className="size-8 text-rose-600" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-700">
                        Belum ada thumbnail
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Unggah gambar sebagai thumbnail berita
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-6 gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                        onClick={() => handleInputChange("thumbnail", "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop")}
                      >
                        <Upload className="size-4" />
                        Unggah Thumbnail
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Publish Settings */}
            <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900">Publikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Globe className="size-4 text-rose-500" />
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => handleInputChange("status", status.value)}
                        className={`relative rounded-xl border-2 px-3 py-2.5 text-xs font-semibold transition ${
                          formData.status === status.value
                            ? `${status.color} border-current shadow-md`
                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {status.label}
                        {formData.status === status.value && (
                          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm">
                            <CheckCircle2 className="size-2.5 text-rose-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Published Date */}
                {formData.status === "Terjadwal" && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="publishedDate">
                      <Calendar className="size-4 text-rose-500" />
                      Jadwal Publikasi
                    </label>
                    <input
                      id="publishedDate"
                      type="datetime-local"
                      value={formData.publishedDate}
                      onChange={(e) => handleInputChange("publishedDate", e.target.value)}
                      className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                )}

                {/* Author */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="author">
                    <User className="size-4 text-rose-500" />
                    Penulis
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="author"
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    placeholder="Contoh: Admin MKPS"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {isFormValid && (
              <Card className="border border-blue-200 bg-blue-50/30 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Eye className="size-5 text-blue-600" />
                    <CardTitle className="text-base font-bold text-blue-900">Preview</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-blue-700">Form sudah lengkap. Preview tersedia.</p>
                </CardContent>
              </Card>
            )}

            {/* Danger Zone */}
            <Card className="border border-red-200 bg-red-50/30 shadow-md">
              <CardHeader>
                <CardTitle className="text-base font-bold text-red-900">Zona Berbahaya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-red-700">
                  Hapus berita ini secara permanen. Tindakan ini tidak dapat dibatalkan.
                </p>
                {!showDeleteConfirm ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full gap-2 rounded-full border-red-200 bg-white px-4 font-semibold text-red-700 shadow-sm transition hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                    Hapus Berita
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-red-900">
                      Yakin ingin menghapus berita ini?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="flex-1 gap-2 rounded-full border-red-300 bg-red-600 px-4 font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="size-4" />
                        Ya, Hapus
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isSubmitting}
                        className="flex-1 gap-2 rounded-full border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <AlertCircle className="size-4 text-amber-500" />
            <span>Pastikan semua informasi sudah benar sebelum menyimpan</span>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="gap-2 rounded-full border-0 bg-slate-100 px-6 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              asChild
            >
              <Link href={`/admin/berita/${params.id}`}>
                <X className="size-4" />
                Batal
              </Link>
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={!isFormValid || isSubmitting}
              className="gap-2 rounded-full border-0 bg-gradient-to-r from-rose-600 to-pink-600 px-6 font-semibold text-white shadow-md transition hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Clock className="size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

