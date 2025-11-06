"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School, CheckCircle2, XCircle, Clock, Mail, Search, Filter, MapPin, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SekolahPending {
  id: string;
  email: string;
  nama: string | null;
  nip: string | null;
  status_approval: string;
  created_at: string;
  metadata: Record<string, any> | null;
  sekolah: {
    id: string;
    npsn: string;
    nama_sekolah: string;
    jenjang: string;
    kabupaten_kota: string;
    alamat: string;
    kcd_wilayah: number;
  } | null;
}

export default function ApprovalSekolahPage() {
  const { toast } = useToast();
  const [sekolahPending, setSekolahPending] = useState<SekolahPending[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "rejected" | "approved">("all");

  useEffect(() => {
    loadSekolahPending();
  }, []);

  const loadSekolahPending = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/sekolah-pending');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Gagal memuat data sekolah' }));
        const errorMessage = errorData.error || 'Gagal memuat data sekolah';
        console.error("Error loading sekolah:", errorMessage);
        setError(errorMessage);
        setSekolahPending([]);
        setPendingCount(0);
        return;
      }

      const data = await response.json();
      
      if (!data.success) {
        const errorMessage = data.error || 'Gagal memuat data sekolah';
        setError(errorMessage);
        setSekolahPending([]);
        setPendingCount(0);
        return;
      }

      setSekolahPending(data.sekolah || []);
      setPendingCount(data.pendingCount || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      console.error("Error loading sekolah:", err);
      setError(errorMessage);
      setSekolahPending([]);
      setPendingCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (sekolahUserId: string, action: 'approve' | 'reject') => {
    if (!sekolahUserId || typeof sekolahUserId !== 'string' || sekolahUserId.trim() === '') {
      toast({
        variant: "destructive",
        title: "ID Tidak Valid",
        description: "ID sekolah tidak valid",
      });
      return;
    }

    const validAction = action === 'approve' || action === 'reject';
    if (!validAction) {
      toast({
        variant: "destructive",
        title: "Aksi Tidak Valid",
        description: `Aksi harus 'approve' atau 'reject'`,
      });
      return;
    }

    setProcessing(sekolahUserId);
    try {
      const finalAction: 'approve' | 'reject' = action === 'approve' ? 'approve' : 'reject';
      const requestBody = { action: finalAction };
      
      const url = `/api/admin/approve-sekolah/${encodeURIComponent(sekolahUserId)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: finalAction === 'approve' ? "Gagal Menyetujui" : "Gagal Menolak",
          description: data.error || 'Gagal memproses approval',
        });
        setProcessing(null);
        return;
      }

      toast({
        title: finalAction === 'approve' ? "Sekolah Disetujui" : "Sekolah Ditolak",
        description: data.message || `Sekolah berhasil ${finalAction === 'approve' ? 'disetujui' : 'ditolak'}`,
      });

      await loadSekolahPending();
    } catch (err) {
      console.error("Error:", err);
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses approval',
      });
    } finally {
      setProcessing(null);
    }
  };

  const filteredSekolah = useMemo(() => {
    let filtered = sekolahPending;

    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status_approval === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(s => {
        const email = s.email?.toLowerCase() || "";
        const namaSekolah = s.sekolah?.nama_sekolah?.toLowerCase() || "";
        const npsn = s.sekolah?.npsn?.toLowerCase() || "";
        const kabupaten = s.sekolah?.kabupaten_kota?.toLowerCase() || "";

        return email.includes(query) || 
               namaSekolah.includes(query) || 
               npsn.includes(query) ||
               kabupaten.includes(query);
      });
    }

    return filtered;
  }, [sekolahPending, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-flex size-12 animate-spin items-center justify-center rounded-full border-4 border-rose-200 border-t-rose-600">
            <div className="size-8 rounded-full bg-rose-100" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Approval Pendaftaran Sekolah</h1>
          <p className="text-sm text-slate-600 mt-1">
            Review dan setujui pendaftaran sekolah baru
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge className="rounded-full border-0 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-600">
            {pendingCount} Menunggu Approval
          </Badge>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama sekolah, email, NPSN, atau kabupaten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className={cn(
              "rounded-xl text-xs sm:text-sm font-medium transition-all",
              statusFilter === "all"
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            <Filter className="size-3 mr-1.5" />
            Semua ({sekolahPending.length})
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
            className={cn(
              "rounded-xl text-xs sm:text-sm font-medium transition-all",
              statusFilter === "pending"
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            Pending ({sekolahPending.filter(s => s.status_approval === 'pending').length})
          </Button>
          <Button
            variant={statusFilter === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("rejected")}
            className={cn(
              "rounded-xl text-xs sm:text-sm font-medium transition-all",
              statusFilter === "rejected"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            Ditolak ({sekolahPending.filter(s => s.status_approval === 'rejected').length})
          </Button>
          <Button
            variant={statusFilter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("approved")}
            className={cn(
              "rounded-xl text-xs sm:text-sm font-medium transition-all",
              statusFilter === "approved"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            Disetujui ({sekolahPending.filter(s => s.status_approval === 'approved').length})
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border border-red-200 bg-red-50/50">
          <CardContent className="py-6">
            <div className="flex items-start gap-3">
              <XCircle className="size-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900">Error Memuat Data</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <Button
                  onClick={loadSekolahPending}
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-full border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300"
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!error && sekolahPending.length === 0 ? (
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-rose-100">
                <CheckCircle2 className="size-8 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Tidak Ada Pendaftaran Pending
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Semua sekolah sudah diproses atau belum ada pendaftaran baru
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : filteredSekolah.length === 0 ? (
        <Card className="border border-slate-200 bg-white shadow-md">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-slate-100">
                <Search className="size-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Tidak Ditemukan
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Tidak ada sekolah yang sesuai dengan filter atau pencarian
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Sekolah</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">NPSN</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Lokasi</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Tanggal Daftar</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100">
                      {filteredSekolah.map((sekolah) => (
                        <tr key={sekolah.id} className="hover:bg-rose-50/50 transition-colors">
                          <td className="px-4 py-3">
                            {sekolah.status_approval === 'pending' && (
                              <Badge className="rounded-full border-0 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                <Clock className="size-3 mr-1 inline" />
                                Pending
                              </Badge>
                            )}
                            {sekolah.status_approval === 'rejected' && (
                              <Badge className="rounded-full border-0 bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                <XCircle className="size-3 mr-1 inline" />
                                Ditolak
                              </Badge>
                            )}
                            {sekolah.status_approval === 'approved' && (
                              <Badge className="rounded-full border-0 bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                <CheckCircle2 className="size-3 mr-1 inline" />
                                Disetujui
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">
                              {sekolah.sekolah?.nama_sekolah || '-'}
                            </div>
                            <div className="text-xs text-slate-600">
                              {sekolah.sekolah?.jenjang || '-'}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Mail className="size-3.5 text-slate-400" />
                              {sekolah.email}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-mono text-slate-700">
                              {sekolah.sekolah?.npsn || '-'}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-sm text-slate-700">
                              <MapPin className="size-3.5 text-slate-400" />
                              {sekolah.sekolah?.kabupaten_kota || '-'}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-slate-600">
                              {new Date(sekolah.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              {sekolah.status_approval === 'pending' && (
                                <>
                                  <Button
                                    onClick={() => handleApproval(sekolah.id, 'approve')}
                                    disabled={processing === sekolah.id}
                                    size="sm"
                                    className="rounded-full border-0 bg-green-600 px-3 text-xs font-semibold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
                                  >
                                    {processing === sekolah.id ? '...' : (
                                      <>
                                        <CheckCircle2 className="size-3 mr-1" />
                                        Setujui
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    onClick={() => handleApproval(sekolah.id, 'reject')}
                                    disabled={processing === sekolah.id}
                                    size="sm"
                                    variant="outline"
                                    className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                                  >
                                    <XCircle className="size-3" />
                                  </Button>
                                </>
                              )}
                              {sekolah.status_approval === 'rejected' && (
                                <Button
                                  onClick={() => handleApproval(sekolah.id, 'approve')}
                                  disabled={processing === sekolah.id}
                                  size="sm"
                                  className="rounded-full border-0 bg-green-600 px-3 text-xs font-semibold text-white shadow-md transition hover:bg-green-700 disabled:opacity-50"
                                >
                                  {processing === sekolah.id ? '...' : (
                                    <>
                                      <CheckCircle2 className="size-3 mr-1" />
                                      Setujui Kembali
                                    </>
                                  )}
                                </Button>
                              )}
                              {sekolah.status_approval === 'approved' && (
                                <div className="text-xs text-slate-400">
                                  Sudah disetujui
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {filteredSekolah.map((sekolah) => (
              <Card
                key={sekolah.id}
                className="border border-rose-200 bg-white shadow-md shadow-rose-100/70"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-base font-bold text-slate-900">
                        {sekolah.sekolah?.nama_sekolah || 'Sekolah'}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-600 mt-1">
                        {sekolah.sekolah?.jenjang || '-'} • NPSN: {sekolah.sekolah?.npsn || '-'}
                      </CardDescription>
                    </div>
                    {sekolah.status_approval === 'pending' && (
                      <Badge className="rounded-full border-0 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 shrink-0">
                        <Clock className="size-3 mr-1 inline" />
                        Pending
                      </Badge>
                    )}
                    {sekolah.status_approval === 'rejected' && (
                      <Badge className="rounded-full border-0 bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 shrink-0">
                        <XCircle className="size-3 mr-1 inline" />
                        Ditolak
                      </Badge>
                    )}
                    {sekolah.status_approval === 'approved' && (
                      <Badge className="rounded-full border-0 bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 shrink-0">
                        <CheckCircle2 className="size-3 mr-1 inline" />
                        Disetujui
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="size-4 text-slate-400" />
                      <span>{sekolah.email}</span>
                    </div>
                    {sekolah.sekolah && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="size-4 text-slate-400" />
                        <span>{sekolah.sekolah.kabupaten_kota}</span>
                      </div>
                    )}
                    <div className="text-xs text-slate-500">
                      Daftar: {new Date(sekolah.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {sekolah.status_approval === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleApproval(sekolah.id, 'approve')}
                          disabled={processing === sekolah.id}
                          className="flex-1 rounded-full border-0 bg-green-600 px-4 font-semibold text-white shadow-md transition hover:bg-green-700 hover:text-white disabled:opacity-50"
                        >
                          {processing === sekolah.id ? 'Memproses...' : (
                            <>
                              <CheckCircle2 className="size-4 mr-2" />
                              Setujui
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleApproval(sekolah.id, 'reject')}
                          disabled={processing === sekolah.id}
                          variant="outline"
                          className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                        >
                          <XCircle className="size-4" />
                        </Button>
                      </>
                    )}
                    {sekolah.status_approval === 'rejected' && (
                      <Button
                        onClick={() => handleApproval(sekolah.id, 'approve')}
                        disabled={processing === sekolah.id}
                        className="flex-1 rounded-full border-0 bg-green-600 px-4 font-semibold text-white shadow-md transition hover:bg-green-700 hover:text-white disabled:opacity-50"
                      >
                        {processing === sekolah.id ? 'Memproses...' : (
                          <>
                            <CheckCircle2 className="size-4 mr-2" />
                            Setujui Kembali
                          </>
                        )}
                      </Button>
                    )}
                    {sekolah.status_approval === 'approved' && (
                      <div className="flex-1 text-center text-xs text-slate-400 py-2">
                        Sudah disetujui
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

