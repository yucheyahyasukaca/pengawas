"use client";

import { useState } from "react";
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
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  X,
  Loader2,
  Upload,
} from "lucide-react";
import Image from "next/image";

interface Attachment {
  url: string;
  name: string;
  size: number;
  type: string;
}

export default function BuatThreadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/forum/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Gagal mengupload gambar");
      }

      const result = await response.json();
      setAttachments((prev) => [...prev, result.data]);
    } catch (err) {
      console.error("Error uploading image:", err);
      const errorMessage = err instanceof Error ? err.message : "Gagal mengupload gambar";
      
      // Special handling for bucket not found
      if (errorMessage.includes("Bucket not found") || errorMessage.includes("bucket belum dibuat")) {
        setError("Storage bucket belum dibuat. Silakan hubungi admin untuk membuat bucket 'forum-attachments' di Supabase.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper function to strip HTML tags and get plain text length
  const getPlainTextLength = (html: string): number => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.trim().length || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title wajib diisi");
      return;
    }

    if (title.trim().length < 3) {
      setError("Title minimal 3 karakter");
      return;
    }

    const plainTextLength = getPlainTextLength(content);
    if (plainTextLength < 10) {
      setError("Content minimal 10 karakter");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forum/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          attachments: attachments.length > 0 ? attachments : undefined,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Gagal membuat topik");
      }

      const result = await response.json();
      router.push(`/pengawas/forum/${result.data.id}`);
    } catch (err) {
      console.error("Error creating thread:", err);
      setError(err instanceof Error ? err.message : "Gagal membuat topik");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="w-fit rounded-full border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 shadow-sm"
        >
          <ArrowLeft className="size-4 mr-2" />
          Kembali
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Buat Topik Baru</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Bagikan topik diskusi dengan sesama pengawas
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card className="border border-indigo-200 bg-white shadow-md">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              Informasi Topik
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-600">
              Isi judul dan konten topik Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Judul Topik <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul topik..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                maxLength={200}
              />
              <p className="text-xs text-slate-500">
                {title.length}/200 karakter
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Konten <span className="text-red-500">*</span>
              </label>
              <div className="rounded-lg border border-slate-200 shadow-sm">
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Tuliskan konten topik Anda di sini..."
                  minHeight="300px"
                />
              </div>
              <p className="text-xs text-slate-500">
                Minimal 10 karakter. Gunakan toolbar untuk formatting teks.
              </p>
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Lampiran Gambar (Opsional)
              </label>
              <div className="flex flex-col gap-4">
                {/* Upload Button */}
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                  {isUploading ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-indigo-600" />
                      <span className="text-sm text-slate-600">Mengupload...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="size-4 text-indigo-600" />
                      <span className="text-sm text-slate-600">
                        Klik untuk upload gambar
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {attachments.map((att, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={att.url}
                            alt={att.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute top-2 right-2 p-1.5 sm:p-1 rounded-full bg-red-500 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
                        >
                          <X className="size-3.5 sm:size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Format: JPEG, PNG, GIF, WebP. Maksimal 5MB per gambar
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto rounded-full border-0 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 sm:py-2"
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || getPlainTextLength(content) < 10}
                className="w-full sm:flex-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md py-2.5 sm:py-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Membuat Topik...
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" />
                    Buat Topik
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

