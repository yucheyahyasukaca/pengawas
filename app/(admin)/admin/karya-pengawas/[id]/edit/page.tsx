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
  Upload,
  Calendar,
  User,
  BookOpen,
  GraduationCap,
  Award,
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
    </ul>`,
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
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
    excerpt: "Hasil penelitian menyeluruh tentang implementasi Kurikulum Merdeka dengan fokus pada tantangan dan solusi inovatif yang telah diterapkan.",
    content: `<p>Implementasi Kurikulum Merdeka di SMA Negeri se-Jawa Tengah telah memasuki tahap yang lebih matang dengan berbagai inovasi dan adaptasi lokal.</p>`,
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
  },
];

export default function EditKaryaPage() {
  const params = useParams();
  const router = useRouter();
  const karyaId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    author: "",
    type: "Tulisan Ilmiah Populer",
    category: "",
    status: "Draft",
    publishedDate: "",
    submittedBy: "",
  });

  useEffect(() => {
    // Find karya by ID and populate form
    const foundKarya = karyaDatabase.find(
      (k) => k.id.toLowerCase() === karyaId.toLowerCase()
    );
    if (foundKarya) {
      setFormData({
        title: foundKarya.title,
        excerpt: foundKarya.excerpt,
        content: foundKarya.content,
        thumbnail: foundKarya.thumbnail || "",
        author: foundKarya.author,
        type: foundKarya.type,
        category: foundKarya.category || "",
        status: foundKarya.status,
        publishedDate: "",
        submittedBy: foundKarya.submittedBy || "",
      });
    }
    setIsLoading(false);
  }, [karyaId]);

  const typeOptions = [
    { value: "Tulisan Ilmiah Populer", label: "Tulisan Ilmiah Populer", icon: FileText },
    { value: "Hasil Penelitian Pengawas", label: "Hasil Penelitian Pengawas", icon: GraduationCap },
    { value: "Best Practice / Praktik Baik Pengawas", label: "Best Practice / Praktik Baik Pengawas", icon: Award },
  ];

  const categoryOptions = [
    "Supervisi Akademik",
    "Manajerial",
    "Pendampingan Kepala Sekolah",
    "Inovasi Kepengawasan",
  ];

  const statusOptions = [
    { value: "Draft", label: "Draft", color: "bg-amber-100 text-amber-800" },
    { value: "Menunggu Review", label: "Menunggu Review", color: "bg-blue-100 text-blue-800" },
    { value: "Tayang", label: "Tayang", color: "bg-emerald-100 text-emerald-800" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Reset category if type changes and category is not applicable
      if (field === "type" && value !== "Best Practice / Praktik Baik Pengawas") {
        updated.category = "";
      }
      return updated;
    });
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
      router.push("/admin/karya-pengawas");
    }, 2000);
  };

  const isFormValid = formData.title && formData.excerpt && formData.content && formData.author;
  const showCategory = formData.type === "Best Practice / Praktik Baik Pengawas";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Clock className="size-6 animate-spin text-rose-600" />
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
                <BookOpen className="size-5 text-white" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-xl font-bold text-slate-900">Edit Karya Pengawas</CardTitle>
                <CardDescription className="text-slate-600">
                  Ubah informasi dan konten karya pengawas
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
              <Link href={`/admin/karya-pengawas/${karyaId}`}>
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
                  Karya Berhasil Diperbarui!
                </p>
                <p className="text-sm text-emerald-700">
                  Mengarahkan ke halaman manajemen karya...
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
                  <CardTitle className="text-lg font-bold text-slate-900">Informasi Karya</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                {/* Type Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <BookOpen className="size-4 text-rose-500" />
                    Tipe Karya
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {typeOptions.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleInputChange("type", type.value)}
                          className={`relative rounded-xl border-2 p-4 text-left transition ${
                            formData.type === type.value
                              ? "border-rose-500 bg-rose-50 shadow-md"
                              : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              formData.type === type.value
                                ? "bg-rose-500 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              <Icon className="size-5" />
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${
                                formData.type === type.value ? "text-rose-900" : "text-slate-900"
                              }`}>
                                {type.label === "Best Practice / Praktik Baik Pengawas" ? "Best Practice" : type.label}
                              </p>
                            </div>
                          </div>
                          {formData.type === type.value && (
                            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 shadow-sm">
                              <CheckCircle2 className="size-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category (only for Best Practice) */}
                {showCategory && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Award className="size-4 text-rose-500" />
                      Kategori Best Practice
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {categoryOptions.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleInputChange("category", category)}
                          className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                            formData.category === category
                              ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="title">
                    <FileText className="size-4 text-rose-500" />
                    Judul Karya
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    placeholder="Contoh: Peningkatan Kualitas Supervisi Akademik melalui Pendekatan Kolaboratif"
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
                    placeholder="Tulis ringkasan singkat karya yang akan muncul di preview..."
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <FileText className="size-4 text-rose-500" />
                    Isi Karya
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="rounded-xl border border-slate-300 shadow-sm">
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => handleInputChange("content", content)}
                      placeholder="Tulis isi karya lengkap di sini..."
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
                  <CardTitle className="text-lg font-bold text-slate-900">Thumbnail Karya</CardTitle>
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
                        Unggah gambar sebagai thumbnail karya
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
                    <FileText className="size-4 text-rose-500" />
                    Status
                  </label>
                  <div className="grid grid-cols-1 gap-2">
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
                {formData.status === "Tayang" && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="publishedDate">
                      <Calendar className="size-4 text-rose-500" />
                      Tanggal Publikasi
                    </label>
                    <input
                      id="publishedDate"
                      type="date"
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
                    placeholder="Contoh: Dr. Ahmad Hidayat, M.Pd."
                  />
                </div>

                {/* Submitted By */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="submittedBy">
                    <User className="size-4 text-rose-500" />
                    Diajukan Oleh
                  </label>
                  <input
                    id="submittedBy"
                    type="text"
                    value={formData.submittedBy}
                    onChange={(e) => handleInputChange("submittedBy", e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    placeholder="Nama pengawas yang mengajukan"
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
              <Link href={`/admin/karya-pengawas/${karyaId}`}>
                <X className="size-4" />
                Batal
              </Link>
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={!isFormValid || isSubmitting || (showCategory && !formData.category)}
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

