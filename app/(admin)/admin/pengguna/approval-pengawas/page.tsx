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
import { User, CheckCircle2, XCircle, Clock, Mail, FileText, MapPin, School, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PengawasPending {
  id: string;
  email: string;
  nama: string | null;
  nip: string | null;
  status_approval: string;
  created_at: string;
  metadata: Record<string, any> | null;
}

export default function ApprovalPengawasPage() {
  const { toast } = useToast();
  const [pengawasPending, setPengawasPending] = useState<PengawasPending[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "rejected" | "approved">("all");

  useEffect(() => {
    loadPengawasPending();
  }, []);

  const loadPengawasPending = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use API route that bypasses RLS using admin client
      const response = await fetch('/api/admin/pengawas-pending');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Gagal memuat data pengawas' }));
        const errorMessage = errorData.error || 'Gagal memuat data pengawas';
        console.error("Error loading pengawas:", {
          status: response.status,
          message: errorMessage
        });
        setError(errorMessage);
        setPengawasPending([]);
        setPendingCount(0);
        return;
      }

      const data = await response.json();
      
      if (!data.success) {
        const errorMessage = data.error || 'Gagal memuat data pengawas';
        setError(errorMessage);
        setPengawasPending([]);
        setPendingCount(0);
        return;
      }

      setPengawasPending(data.pengawas || []);
      setPendingCount(data.pendingCount || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
      console.error("Error loading pengawas:", {
        message: errorMessage,
        error: err
      });
      setError(errorMessage);
      setPengawasPending([]);
      setPendingCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (pengawasId: string, action: 'approve' | 'reject') => {
    // Validate inputs
    if (!pengawasId || typeof pengawasId !== 'string' || pengawasId.trim() === '') {
      toast({
        variant: "error",
        title: "ID Tidak Valid",
        description: "ID pengawas tidak valid",
      });
      return;
    }

    // Validate action - ensure it's exactly 'approve' or 'reject'
    const validAction = action === 'approve' || action === 'reject';
    if (!validAction) {
      toast({
        variant: "error",
        title: "Aksi Tidak Valid",
        description: `Aksi harus 'approve' atau 'reject'. Diterima: ${JSON.stringify(action)} (${typeof action})`,
      });
      return;
    }

    setProcessing(pengawasId);
    try {
      // Ensure action is exactly 'approve' or 'reject'
      const finalAction: 'approve' | 'reject' = action === 'approve' ? 'approve' : 'reject';
      const requestBody = { action: finalAction };
      
      console.log("Sending approval request:", { 
        pengawasId, 
        action, 
        finalAction,
        requestBody,
        stringified: JSON.stringify(requestBody)
      });

      const url = `/api/admin/approve-pengawas/${encodeURIComponent(pengawasId)}`;
      console.log("Request URL:", url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        toast({
          variant: "error",
          title: finalAction === 'approve' ? "Gagal Menyetujui" : "Gagal Menolak",
          description: data.error || 'Gagal memproses approval',
        });
        setProcessing(null);
        return;
      }

      // Show success toast
      toast({
        variant: "success",
        title: finalAction === 'approve' ? "Pengawas Disetujui" : "Pengawas Ditolak",
        description: data.message || `Pengawas berhasil ${finalAction === 'approve' ? 'disetujui' : 'ditolak'}`,
      });

      // Reload list
      await loadPengawasPending();
    } catch (err) {
      console.error("Error:", err);
      toast({
        variant: "error",
        title: "Terjadi Kesalahan",
        description: err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses approval',
      });
    } finally {
      setProcessing(null);
    }
  };

  // Filter pengawas berdasarkan search query dan status filter
  const filteredPengawas = useMemo(() => {
    let filtered = pengawasPending;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status_approval === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => {
        const nama = p.nama?.toLowerCase() || "";
        const email = p.email?.toLowerCase() || "";
        const nip = p.nip?.toLowerCase() || "";
        const wilayah = p.metadata?.wilayah_tugas?.toLowerCase() || "";
        const sekolahBinaan = Array.isArray(p.metadata?.sekolah_binaan) 
          ? p.metadata.sekolah_binaan.join(" ").toLowerCase() 
          : "";

        return nama.includes(query) || 
               email.includes(query) || 
               nip.includes(query) || 
               wilayah.includes(query) ||
               sekolahBinaan.includes(query);
      });
    }

    return filtered;
  }, [pengawasPending, searchQuery, statusFilter]);

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
          <h1 className="text-2xl font-bold text-slate-900">Approval Pendaftaran Pengawas</h1>
          <p className="text-sm text-slate-600 mt-1">
            Review dan setujui pendaftaran pengawas baru
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
            placeholder="Cari nama, email, NIP, atau wilayah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20"
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
                ? "bg-[#B53740] text-white hover:bg-[#8B2A31]"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            )}
          >
            <Filter className="size-3 mr-1.5" />
            Semua ({pengawasPending.length})
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
            Pending ({pengawasPending.filter(p => p.status_approval === 'pending').length})
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
            Ditolak ({pengawasPending.filter(p => p.status_approval === 'rejected').length})
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
            Disetujui ({pengawasPending.filter(p => p.status_approval === 'approved').length})
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
                  onClick={loadPengawasPending}
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

      {!error && pengawasPending.length === 0 ? (
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
                  Semua pengawas sudah diproses atau belum ada pendaftaran baru
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : filteredPengawas.length === 0 ? (
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
                  Tidak ada pengawas yang sesuai dengan pencarian Anda
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-md shadow-rose-100/70 md:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-700">
                <thead className="bg-gradient-to-r from-rose-50 via-white to-amber-50 text-xs font-semibold uppercase tracking-wide text-slate-700">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Nama Pengawas</th>
                    <th className="px-5 py-4 font-semibold">Email</th>
                    <th className="px-5 py-4 font-semibold">NIP</th>
                    <th className="px-5 py-4 font-semibold">Wilayah</th>
                    <th className="px-5 py-4 font-semibold">Tanggal Daftar</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100">
                  {filteredPengawas.map((pengawas) => (
                    <tr key={pengawas.id} className="transition-colors hover:bg-rose-50/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-rose-400 to-amber-400 text-white shadow-sm">
                            <User className="size-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {pengawas.nama || 'Belum mengisi nama'}
                            </div>
                            {pengawas.metadata?.sekolah_binaan && Array.isArray(pengawas.metadata.sekolah_binaan) && (
                              <div className="mt-0.5 text-xs text-slate-500">
                                {pengawas.metadata.sekolah_binaan.length} sekolah binaan
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="size-3.5 text-rose-500" />
                          <span className="text-xs">{pengawas.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {pengawas.nip ? (
                          <div className="flex items-center gap-2 text-slate-600">
                            <FileText className="size-3.5 text-rose-500" />
                            <span className="text-xs font-mono">{pengawas.nip}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {pengawas.metadata?.wilayah_tugas ? (
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="size-3.5 text-rose-500" />
                            <span className="text-xs">{pengawas.metadata.wilayah_tugas}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="size-3.5" />
                          {new Date(pengawas.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={cn(
                          "rounded-full border-0 px-3 py-1 text-xs font-semibold",
                          pengawas.status_approval === 'pending'
                            ? "bg-amber-100 text-amber-600"
                            : pengawas.status_approval === 'approved'
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        )}>
                          {pengawas.status_approval === 'pending' ? 'Pending' : pengawas.status_approval === 'approved' ? 'Disetujui' : 'Ditolak'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {pengawas.status_approval === 'pending' ? (
                            <>
                              <Button
                                onClick={() => handleApproval(pengawas.id, 'approve')}
                                disabled={processing === pengawas.id}
                                size="sm"
                                className="rounded-lg border-0 bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50"
                              >
                                {processing === pengawas.id ? (
                                  <div className="size-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                ) : (
                                  <>
                                    <CheckCircle2 className="size-3 mr-1" />
                                    Setujui
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={() => handleApproval(pengawas.id, 'reject')}
                                disabled={processing === pengawas.id}
                                size="sm"
                                variant="outline"
                                className="rounded-lg border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                              >
                                <XCircle className="size-3" />
                              </Button>
                            </>
                          ) : pengawas.status_approval === 'rejected' ? (
                            <Button
                              onClick={() => handleApproval(pengawas.id, 'approve')}
                              disabled={processing === pengawas.id}
                              size="sm"
                              className="rounded-lg border-0 bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50"
                            >
                              {processing === pengawas.id ? (
                                <div className="size-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              ) : (
                                <>
                                  <CheckCircle2 className="size-3 mr-1" />
                                  Setujui Kembali
                                </>
                              )}
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400">Sudah disetujui</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {filteredPengawas.map((pengawas) => (
            <Card
              key={pengawas.id}
              className="border border-rose-200 bg-white shadow-md shadow-rose-100/70 transition hover:shadow-lg hover:shadow-rose-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-rose-400 to-amber-400 text-white shadow-md">
                      <User className="size-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900">
                        {pengawas.nama || 'Belum mengisi nama'}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        {pengawas.email}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={cn(
                    "rounded-full border-0 px-3 py-1 text-xs font-semibold",
                    pengawas.status_approval === 'pending'
                      ? "bg-amber-100 text-amber-600"
                      : pengawas.status_approval === 'approved'
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  )}>
                    {pengawas.status_approval === 'pending' ? 'Pending' : pengawas.status_approval === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {pengawas.nip && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText className="size-4 text-rose-500" />
                    <span>NIP: {pengawas.nip}</span>
                  </div>
                )}
                {pengawas.metadata?.wilayah_tugas && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="size-4 text-rose-500" />
                    <span>Wilayah: {pengawas.metadata.wilayah_tugas}</span>
                  </div>
                )}
                {pengawas.metadata?.sekolah_binaan && Array.isArray(pengawas.metadata.sekolah_binaan) && pengawas.metadata.sekolah_binaan.length > 0 && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <School className="size-4 text-rose-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">Sekolah Binaan:</span>
                      <ul className="mt-1 space-y-1">
                        {pengawas.metadata.sekolah_binaan.map((sekolah: string, idx: number) => (
                          <li key={idx} className="text-xs">• {sekolah}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="size-3" />
                  <span>Daftar: {new Date(pengawas.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  {pengawas.status_approval === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleApproval(pengawas.id, 'approve')}
                        disabled={processing === pengawas.id}
                        className="flex-1 rounded-full border-0 bg-green-600 px-4 font-semibold text-white shadow-md transition hover:bg-green-700 hover:text-white disabled:opacity-50"
                      >
                        {processing === pengawas.id ? 'Memproses...' : (
                          <>
                            <CheckCircle2 className="size-4 mr-2" />
                            Setujui
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleApproval(pengawas.id, 'reject')}
                        disabled={processing === pengawas.id}
                        variant="outline"
                        className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                      >
                        <XCircle className="size-4" />
                      </Button>
                    </>
                  )}
                  {pengawas.status_approval === 'rejected' && (
                    <Button
                      onClick={() => handleApproval(pengawas.id, 'approve')}
                      disabled={processing === pengawas.id}
                      className="flex-1 rounded-full border-0 bg-green-600 px-4 font-semibold text-white shadow-md transition hover:bg-green-700 hover:text-white disabled:opacity-50"
                    >
                      {processing === pengawas.id ? 'Memproses...' : (
                        <>
                          <CheckCircle2 className="size-4 mr-2" />
                          Setujui Kembali
                        </>
                      )}
                    </Button>
                  )}
                  {pengawas.status_approval === 'approved' && (
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

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

