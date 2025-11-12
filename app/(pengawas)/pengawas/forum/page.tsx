"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  MessageSquare,
  Plus,
  Clock,
  User,
  ArrowRight,
  Loader2,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Thread {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  reply_count: number;
  last_reply_at: string | null;
  last_reply_by: string | null;
  author: {
    id: string;
    nama: string | null;
    email: string;
  };
  last_reply_author: {
    id: string;
    nama: string | null;
    email: string;
  } | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ForumPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"reply_count" | "last_reply_at" | "created_at">("reply_count");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, pagination.page]);

  const loadThreads = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/forum/threads?sort=${sortBy}&order=desc&page=${pagination.page}&limit=${pagination.limit}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "Gagal memuat topik";
        
        // Special handling for table not found
        if (errorData.code === "TABLE_NOT_FOUND") {
          setError("Tabel forum belum dibuat. Silakan jalankan migration database terlebih dahulu.");
        } else {
          setError(errorMessage);
        }
        return;
      }

      const result = await response.json();
      setThreads(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (err) {
      console.error("Error loading threads:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat topik");
    } finally {
      setIsLoading(false);
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
    });
  };

  // Strip HTML tags and get plain text
  const stripHtml = (html: string): string => {
    if (typeof window === "undefined") {
      // Server-side: use regex
      return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    }
    // Client-side: use DOM
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    const plainText = stripHtml(content);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  // Responsive truncate for mobile
  const truncateContentMobile = (content: string) => {
    return truncateContent(content, 80);
  };

  // Filter threads by search query (client-side filtering for current page)
  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const contentPlainText = stripHtml(thread.content).toLowerCase();
    return (
      thread.title.toLowerCase().includes(query) ||
      contentPlainText.includes(query) ||
      thread.author.nama?.toLowerCase().includes(query) ||
      thread.author.email.toLowerCase().includes(query)
    );
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-600">Memuat forum...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
            <MessageSquare className="size-6 sm:size-8 text-indigo-600 shrink-0" />
            <span className="truncate">Forum Komunikasi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Diskusikan topik dengan sesama pengawas
          </p>
        </div>
        <Button
          onClick={() => router.push("/pengawas/forum/buat")}
          className="w-full sm:w-auto rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md py-2.5 sm:py-2"
        >
          <Plus className="size-4 mr-2" />
          <span className="sm:hidden">Buat Topik Baru</span>
          <span className="hidden sm:inline">Buat Topik</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="border border-indigo-200 bg-white shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-full border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={sortBy === "reply_count" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSortBy("reply_count");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={cn(
                  "flex-1 sm:flex-initial rounded-full border-0 py-2.5 sm:py-2",
                  sortBy === "reply_count"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                )}
              >
                <MessageCircle className="size-4 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">Terpopuler</span>
              </Button>
              <Button
                variant={sortBy === "last_reply_at" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSortBy("last_reply_at");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={cn(
                  "flex-1 sm:flex-initial rounded-full border-0 py-2.5 sm:py-2",
                  sortBy === "last_reply_at"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                )}
              >
                <TrendingUp className="size-4 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">Terbaru</span>
              </Button>
              <Button
                variant={sortBy === "created_at" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSortBy("created_at");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={cn(
                  "flex-1 sm:flex-initial rounded-full border-0 py-2.5 sm:py-2",
                  sortBy === "created_at"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                )}
              >
                <Calendar className="size-4 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">Terlama</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-red-700">{error}</p>
              {error.includes("Tabel forum belum dibuat") && (
                <div className="mt-2 p-3 bg-white rounded-lg border border-red-200">
                  <p className="text-xs text-slate-600 mb-2">
                    <strong>Cara memperbaiki:</strong>
                  </p>
                  <ol className="text-xs text-slate-600 list-decimal list-inside space-y-1">
                    <li>Buka Supabase Dashboard → SQL Editor</li>
                    <li>Copy-paste isi file <code className="bg-slate-100 px-1 rounded">supabase/migrations/008_create_forum_tables.sql</code></li>
                    <li>Klik "Run" untuk menjalankan migration</li>
                    <li>Refresh halaman ini</li>
                  </ol>
                </div>
              )}
              {error.includes("Unauthorized") && (
                <p className="text-xs text-slate-600 mt-2">
                  Pastikan Anda sudah login sebagai pengawas dengan status approval "approved".
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Threads List */}
      {filteredThreads.length === 0 ? (
        <Card className="border border-indigo-200 bg-white shadow-sm">
          <CardContent className="pt-12 pb-12 text-center">
            <MessageSquare className="size-12 text-slate-300 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-700 mb-1">
              {searchQuery ? "Tidak ada topik yang ditemukan" : "Belum ada topik"}
            </p>
            <p className="text-xs text-slate-500 mb-6">
              {searchQuery
                ? "Coba gunakan kata kunci lain"
                : "Jadilah yang pertama membuat topik"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/pengawas/forum/buat")}
                className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="size-4 mr-2" />
                Buat Topik Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredThreads.map((thread) => (
            <Card
              key={thread.id}
              className="border border-indigo-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/pengawas/forum/${thread.id}`)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 line-clamp-2">
                        {thread.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 sm:line-clamp-3">
                        <span className="sm:hidden">{truncateContentMobile(thread.content)}</span>
                        <span className="hidden sm:inline">{truncateContent(thread.content, 150)}</span>
                      </p>
                    </div>
                    <Badge className="rounded-full bg-indigo-100 text-indigo-700 border-indigo-200 shrink-0 px-2 py-1">
                      <MessageSquare className="size-3 mr-1" />
                      <span className="text-xs font-semibold">{thread.reply_count}</span>
                    </Badge>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-3 sm:gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <User className="size-3 shrink-0" />
                      <span className="font-medium truncate max-w-[150px] sm:max-w-none">
                        {thread.author.nama || thread.author.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Clock className="size-3 shrink-0" />
                      <span>{formatDate(thread.created_at)}</span>
                    </div>
                    {thread.last_reply_at && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 sm:ml-auto w-full sm:w-auto">
                        <span className="text-slate-400 text-xs">Balasan terakhir:</span>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="font-medium">
                            {formatDate(thread.last_reply_at)}
                          </span>
                          {thread.last_reply_author && (
                            <span className="text-slate-400 truncate max-w-[120px] sm:max-w-none">
                              oleh {thread.last_reply_author.nama || thread.last_reply_author.email}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card className="border border-indigo-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-slate-600">
                Menampilkan <span className="font-semibold text-slate-900">
                  {((pagination.page - 1) * pagination.limit) + 1}
                </span> - <span className="font-semibold text-slate-900">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> dari <span className="font-semibold text-slate-900">
                  {pagination.total}
                </span> topik
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="rounded-full border-0 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="size-4 mr-1" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          "rounded-full border-0 min-w-[40px]",
                          pagination.page === pageNum
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        )}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="rounded-full border-0 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

