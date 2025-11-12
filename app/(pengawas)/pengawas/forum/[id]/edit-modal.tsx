"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { X, Loader2 } from "lucide-react";

interface Thread {
  id: string;
  title: string;
  content: string;
}

interface EditThreadModalProps {
  thread: Thread;
  onClose: () => void;
}

export function EditThreadModal({ thread, onClose }: EditThreadModalProps) {
  const [title, setTitle] = useState(thread.title);
  const [content, setContent] = useState(thread.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(thread.title);
    setContent(thread.content);
  }, [thread]);

  // Helper function to strip HTML tags and get plain text length
  const getPlainTextLength = (html: string): number => {
    if (typeof window === "undefined") return html.length;
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
      const response = await fetch(`/api/forum/threads/${thread.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Gagal mengupdate topik");
      }

      onClose();
    } catch (err) {
      console.error("Error updating thread:", err);
      setError(err instanceof Error ? err.message : "Gagal mengupdate topik");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <Card className="w-full max-w-2xl border-indigo-200 bg-white shadow-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b p-4 sm:p-6">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              Edit Topik
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-600">
              Edit judul dan konten topik
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full shrink-0 ml-2"
          >
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Judul Topik <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                maxLength={200}
              />
              <p className="text-xs text-slate-500">{title.length}/200 karakter</p>
            </div>

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

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
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
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

