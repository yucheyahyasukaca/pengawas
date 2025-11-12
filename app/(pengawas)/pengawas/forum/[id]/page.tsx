"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  X,
  Loader2,
  Upload,
  User,
  Clock,
  Edit,
  Trash2,
  MoreVertical,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { EditThreadModal } from "./edit-modal";

interface Author {
  id: string;
  nama: string | null;
  email: string;
}

interface Attachment {
  id: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
}

interface Reply {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  edited_at: string | null;
  edited_by: string | null;
  author: Author;
  edited_by_user: Author | null;
  attachments: Attachment[];
}

interface Thread {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  edited_at: string | null;
  edited_by: string | null;
  reply_count: number;
  last_reply_at: string | null;
  author: Author;
  edited_by_user: Author | null;
  attachments: Attachment[];
  replies: Reply[];
}

export default function ThreadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const threadId = params.id as string;

  const [thread, setThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Reply form state
  const [replyContent, setReplyContent] = useState("");
  const [replyAttachments, setReplyAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  useEffect(() => {
    loadThread();
    loadCurrentUser();
  }, [threadId]);

  const loadCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/get-current-user");
      if (response.ok) {
        const result = await response.json();
        setCurrentUserId(result.user?.id || null);
        setCurrentUserRole(result.user?.role || null);
      }
    } catch (err) {
      console.error("Error loading current user:", err);
    }
  };

  const loadThread = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/forum/threads/${threadId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Topik tidak ditemukan");
        }
        throw new Error("Gagal memuat topik");
      }

      const result = await response.json();
      setThread(result.data);
    } catch (err) {
      console.error("Error loading thread:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setReplyError("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setReplyError("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    setReplyError(null);

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
      setReplyAttachments((prev) => [...prev, result.data]);
    } catch (err) {
      console.error("Error uploading image:", err);
      const errorMessage = err instanceof Error ? err.message : "Gagal mengupload gambar";
      
      // Special handling for bucket not found
      if (errorMessage.includes("Bucket not found") || errorMessage.includes("bucket belum dibuat")) {
        setReplyError("Storage bucket belum dibuat. Silakan hubungi admin untuk membuat bucket 'forum-attachments' di Supabase.");
      } else {
        setReplyError(errorMessage);
      }
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setReplyAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper function to strip HTML tags and get plain text length
  const getPlainTextLength = (html: string): number => {
    if (typeof window === "undefined") return html.length;
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.trim().length || 0;
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError(null);

    const plainTextLength = getPlainTextLength(replyContent);
    if (plainTextLength < 3) {
      setReplyError("Content minimal 3 karakter");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/forum/threads/${threadId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          attachments: replyAttachments.length > 0 ? replyAttachments : undefined,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Gagal membuat reply");
      }

      // Reset form
      setReplyContent("");
      setReplyAttachments([]);
      
      // Reload thread to get new reply
      await loadThread();
    } catch (err) {
      console.error("Error creating reply:", err);
      setReplyError(err instanceof Error ? err.message : "Gagal membuat reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-600">Memuat topik...</p>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="flex flex-col gap-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="rounded-full border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 shadow-sm w-fit"
        >
          <ArrowLeft className="size-4 mr-2" />
          Kembali
        </Button>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-700">{error || "Topik tidak ditemukan"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAuthor = currentUserId === thread.author_id;
  const isAdmin = currentUserRole === "admin";
  const canModerate = isAdmin || isAuthor;

  const handleDeleteThread = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus topik ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/forum/threads/${threadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Gagal menghapus topik");
      }

      router.push("/pengawas/forum");
    } catch (err) {
      console.error("Error deleting thread:", err);
      setError(err instanceof Error ? err.message : "Gagal menghapus topik");
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="rounded-full border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 shadow-sm shrink-0"
          >
            <ArrowLeft className="size-4 mr-2" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 break-words">{thread.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <User className="size-3.5 sm:size-4 shrink-0" />
                <span className="truncate">{thread.author.nama || thread.author.email}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="size-3.5 sm:size-4 shrink-0" />
                <span>{formatDate(thread.created_at)}</span>
              </div>
              {thread.edited_at && (
                <span className="text-xs text-slate-400">
                  (diedit {formatDate(thread.edited_at)})
                </span>
              )}
            </div>
          </div>
        </div>
        {canModerate && (
          <div className="flex gap-2 sm:ml-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
              className="flex-1 sm:flex-initial rounded-full border-0 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 sm:py-2"
            >
              <Edit className="size-4 mr-1.5 sm:mr-2" />
              <span className="text-xs sm:text-sm">Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 sm:flex-initial rounded-full border-0 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 sm:py-2"
            >
              <Trash2 className="size-4 mr-1.5 sm:mr-2" />
              <span className="text-xs sm:text-sm">Hapus</span>
            </Button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md border-red-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg font-bold text-red-700">
                Hapus Topik
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Apakah Anda yakin ingin menghapus topik ini? Tindakan ini tidak dapat dibatalkan.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full sm:flex-1 rounded-full border-0 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 sm:py-2"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleDeleteThread}
                  className="w-full sm:flex-1 rounded-full bg-red-600 hover:bg-red-700 text-white py-2.5 sm:py-2"
                >
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditThreadModal
          thread={thread}
          onClose={() => {
            setShowEditModal(false);
            loadThread();
          }}
        />
      )}

      {/* Thread Content */}
      <Card className="border border-indigo-200 bg-white shadow-md">
        <CardContent className="p-4 sm:p-6">
          <div 
            className="prose prose-sm max-w-none text-sm sm:text-base text-slate-700"
            dangerouslySetInnerHTML={{ __html: thread.content }}
          />

          {/* Thread Attachments */}
          {thread.attachments && thread.attachments.length > 0 && (
            <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {thread.attachments.map((att) => (
                <div
                  key={att.id}
                  className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer hover:opacity-90 transition touch-manipulation"
                  onClick={() => window.open(att.file_url, "_blank")}
                >
                  <Image
                    src={att.file_url}
                    alt={att.file_name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Replies Section */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="size-4 sm:size-5 text-indigo-600" />
            <span>Balasan ({thread.reply_count})</span>
          </h2>
        </div>

        {/* Replies List */}
        {thread.replies && thread.replies.length > 0 ? (
          <div className="flex flex-col gap-3 sm:gap-4">
            {thread.replies.map((reply) => {
              const isReplyAuthor = currentUserId === reply.author_id;
              return (
                <Card
                  key={reply.id}
                  className="border border-slate-200 bg-white shadow-sm"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      {/* Reply Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="flex size-8 sm:size-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs sm:text-sm shrink-0">
                            {(reply.author.nama || reply.author.email).charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                              {reply.author.nama || reply.author.email}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-500">
                              <Clock className="size-3 shrink-0" />
                              <span>{formatDate(reply.created_at)}</span>
                              {reply.edited_at && (
                                <span className="text-slate-400">
                                  • diedit {formatDate(reply.edited_at)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reply Content */}
                      <div 
                        className="prose prose-sm max-w-none text-xs sm:text-sm text-slate-700"
                        dangerouslySetInnerHTML={{ __html: reply.content }}
                      />

                      {/* Reply Attachments */}
                      {reply.attachments && reply.attachments.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                          {reply.attachments.map((att) => (
                            <div
                              key={att.id}
                              className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer hover:opacity-90 transition touch-manipulation"
                              onClick={() => window.open(att.file_url, "_blank")}
                            >
                              <Image
                                src={att.file_url}
                                alt={att.file_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border border-slate-200 bg-slate-50">
            <CardContent className="pt-12 pb-12 text-center">
              <MessageSquare className="size-12 text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Belum ada balasan
              </p>
              <p className="text-xs text-slate-500">
                Jadilah yang pertama membalas topik ini
              </p>
            </CardContent>
          </Card>
        )}

        {/* Reply Form */}
        <Card className="border border-indigo-200 bg-white shadow-md">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              Tulis Balasan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <form onSubmit={handleSubmitReply} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <div className="rounded-lg border border-slate-200 shadow-sm">
                  <RichTextEditor
                    content={replyContent}
                    onChange={setReplyContent}
                    placeholder="Tuliskan balasan Anda di sini..."
                    minHeight="200px"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Minimal 3 karakter. Gunakan toolbar untuk formatting teks.
                </p>
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer transition touch-manipulation">
                  {isUploading ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-indigo-600" />
                      <span className="text-xs sm:text-sm text-slate-600">Mengupload...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="size-4 text-indigo-600" />
                      <span className="text-xs sm:text-sm text-slate-600">
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

                {replyAttachments.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {replyAttachments.map((att, index) => (
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

              {replyError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs sm:text-sm text-red-700">{replyError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || getPlainTextLength(replyContent) < 3}
                className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md py-2.5 sm:py-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" />
                    Kirim Balasan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

