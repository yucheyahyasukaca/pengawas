"use client";

export const runtime = 'edge';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  MapPin,
  Users,
  FileText,
  AlertCircle,
  Save,
  X,
  Clock,
  Check,
  ChevronDown,
  Plus,
} from "lucide-react";

export default function BuatAgendaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    location: "",
    coordinator: "",
    description: "",
    status: "Terjadwal",
  });

  const [agendaTypes, setAgendaTypes] = useState([
    { value: "Supervisi", label: "Supervisi", color: "bg-rose-100 text-rose-600" },
    { value: "Pendampingan", label: "Pendampingan", color: "bg-blue-100 text-blue-600" },
    { value: "Monitoring", label: "Monitoring", color: "bg-emerald-100 text-emerald-600" },
    { value: "Rakor", label: "Rakor", color: "bg-amber-100 text-amber-600" },
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newType = {
        value: newCategory.trim(),
        label: newCategory.trim(),
        color: "bg-purple-100 text-purple-600",
      };
      setAgendaTypes([...agendaTypes, newType]);
      setNewCategory("");
      setShowAddCategory(false);
      handleInputChange("type", newType.value);
    }
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
      router.push("/admin/agenda");
    }, 2000);
  };

  const isFormValid = formData.title && formData.type && formData.date && formData.location && formData.coordinator;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-md">
                <CalendarPlus className="size-5 text-white" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-xl font-bold text-slate-900">Buat Agenda Baru</CardTitle>
                <CardDescription className="text-slate-600">
                  Rencanakan kegiatan supervisi, pendampingan, atau monitoring yang akan dilaksanakan
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
              <Link href="/admin/agenda">
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
                  Agenda Berhasil Dibuat!
                </p>
                <p className="text-sm text-emerald-700">
                  Mengarahkan ke halaman manajemen agenda...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Information */}
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader className="border-b border-rose-100">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-sm">
                <FileText className="size-4 text-white" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-lg font-bold text-slate-900">Informasi Dasar</CardTitle>
                <CardDescription className="text-slate-600">Lengkapi detail agenda kegiatan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="title">
                <FileText className="size-4 text-rose-500" />
                Judul Agenda
                <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                placeholder="Contoh: Supervisi Implementasi Kurikulum Merdeka"
              />
            </div>

            {/* Type and Date Grid */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Type */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="type">
                  <CalendarClock className="size-4 text-rose-500" />
                  Tipe Agenda
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  >
                    <span className={formData.type ? "" : "text-slate-400"}>
                      {formData.type || "Pilih tipe agenda"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-5 text-slate-400 transition-transform",
                        isDropdownOpen && "rotate-180 text-rose-600"
                      )}
                    />
                  </button>
                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50">
                        {agendaTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => {
                              handleInputChange("type", type.value);
                              setIsDropdownOpen(false);
                            }}
                            className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
                          >
                            <span className={formData.type === type.value ? "text-rose-700" : "text-slate-700"}>
                              {type.label}
                            </span>
                            {formData.type === type.value && (
                              <Check className="size-4 text-rose-600" />
                            )}
                          </button>
                        ))}
                        {showAddCategory ? (
                          <div className="border-t border-slate-200 pt-2 mt-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddCategory();
                                  }
                                }}
                                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                                placeholder="Kategori baru..."
                                autoFocus
                              />
                              <Button
                                type="button"
                                onClick={handleAddCategory}
                                className="shrink-0 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                                size="sm"
                              >
                                <Check className="size-4" />
                              </Button>
                              <Button
                                type="button"
                                onClick={() => {
                                  setShowAddCategory(false);
                                  setNewCategory("");
                                }}
                                variant="ghost"
                                className="shrink-0 rounded-xl hover:bg-slate-100"
                                size="sm"
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowAddCategory(true)}
                            className="flex w-full items-center gap-2 rounded-xl border-t border-slate-200 px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 mt-2 pt-2"
                          >
                            <Plus className="size-4" />
                            Tambah Kategori
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="date">
                  <Calendar className="size-4 text-rose-500" />
                  Tanggal Agenda
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    id="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                  />
                  <input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              </div>
            </div>

            {/* Location and Coordinator Grid */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="location">
                  <MapPin className="size-4 text-rose-500" />
                  Lokasi
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                  placeholder="Contoh: SMA Negeri 1 Semarang"
                />
              </div>

              {/* Coordinator */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="coordinator">
                  <Users className="size-4 text-rose-500" />
                  Koordinator
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="coordinator"
                  type="text"
                  required
                  value={formData.coordinator}
                  onChange={(e) => handleInputChange("coordinator", e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                  placeholder="Contoh: Eka Suryani"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <FileText className="size-4 text-rose-500" />
                Deskripsi Agenda
              </label>
              <div className="rounded-xl border border-slate-300 shadow-sm">
                <RichTextEditor
                  content={formData.description}
                  onChange={(content) => handleInputChange("description", content)}
                  placeholder="Jelaskan detail agenda, tujuan, dan hal-hal yang perlu dipersiapkan..."
                  minHeight="200px"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
              <Link href="/admin/agenda">
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
                  Simpan Agenda
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

