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
import { Badge } from "@/components/ui/badge";
import { User, CheckCircle2, XCircle, Clock, Mail, FileText, MapPin, School } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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
  const [pengawasPending, setPengawasPending] = useState<PengawasPending[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    loadPengawasPending();
  }, []);

  const loadPengawasPending = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('users')
        .select('id, email, nama, nip, status_approval, created_at, metadata')
        .eq('role', 'pengawas')
        .in('status_approval', ['pending', 'rejected'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading pengawas:", error);
        return;
      }

      setPengawasPending(data || []);
      
      // Count pending
      const pending = (data || []).filter(p => p.status_approval === 'pending').length;
      setPendingCount(pending);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (pengawasId: string, action: 'approve' | 'reject') => {
    setProcessing(pengawasId);
    try {
      const response = await fetch(`/api/admin/approve-pengawas/${pengawasId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Gagal memproses approval');
        return;
      }

      // Reload list
      await loadPengawasPending();
    } catch (err) {
      console.error("Error:", err);
      alert('Terjadi kesalahan saat memproses approval');
    } finally {
      setProcessing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Memuat...</p>
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

      {pengawasPending.length === 0 ? (
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
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pengawasPending.map((pengawas) => (
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
                      : "bg-red-100 text-red-600"
                  )}>
                    {pengawas.status_approval === 'pending' ? 'Pending' : 'Ditolak'}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

