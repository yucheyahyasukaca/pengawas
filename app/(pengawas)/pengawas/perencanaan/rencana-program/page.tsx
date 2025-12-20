"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus, Eye, FileText, Calendar, Loader2, Edit, Send, School, AlertCircle, Trash2, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Sekolah {
  id: string | number;
  npsn: string;
  nama: string;
}

interface RencanaProgram {
  id: string;
  periode: string;
  tanggal: string;
  status: string;
  file?: string;
  created_at?: string;
  updated_at?: string;
  sekolah_ids?: string[];
  sekolah?: Sekolah[];
}

export default function RencanaProgramPage() {
  const { toast } = useToast();
  const [rencanaProgram, setRencanaProgram] = useState<RencanaProgram[]>([]);

  const [sekolahBelumRencana, setSekolahBelumRencana] = useState<Sekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadRencanaProgram();
  }, []);

  const loadRencanaProgram = async () => {
    try {
      setIsLoading(true);

      // Fetch from database via API
      const response = await fetch("/api/pengawas/rencana-program");

      if (!response.ok) {
        throw new Error("Gagal memuat rencana program");
      }

      const data = await response.json();
      setRencanaProgram(data.rencanaProgram || []);
      setSekolahBelumRencana(data.sekolahBelumRencana || []);
    } catch (error) {
      console.error("Error loading rencana program:", error);
      toast({
        title: "Error",
        description: "Gagal memuat rencana program",
        variant: "error",
      });
      setRencanaProgram([]);
      setSekolahBelumRencana([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/pengawas/rencana-program/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus rencana program");
      }

      toast({
        title: "Berhasil",
        description: "Rencana program berhasil dihapus",
      });

      // Refresh list
      loadRencanaProgram();
    } catch (error) {
      console.error("Error deleting rencana program:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus rencana program",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-600">Memuat rencana program...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rencana Program Kepengawasan</h1>
          <p className="text-sm text-slate-600 mt-1">
            Input dan kelola rencana program kepengawasan, unduh laporan dalam format PDF
          </p>
        </div>
        <Button
          className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
          asChild
        >
          <Link href="/pengawas/perencanaan/rencana-program/pilih-sekolah">
            <Plus className="size-4 mr-2" />
            Buat Rencana Program
          </Link>
        </Button>
      </div>

      {/* Card Sekolah Binaan yang Belum Mendapat Rencana Program */}
      {sekolahBelumRencana.length > 0 && (
        <Card className="border border-amber-200 bg-amber-50/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <AlertCircle className="size-5 text-amber-600" />
              Sekolah Binaan yang Belum Mendapat Rencana Program
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              {sekolahBelumRencana.length} sekolah belum memiliki rencana program kepengawasan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sekolahBelumRencana.map((sekolah) => (
                <Badge
                  key={sekolah.id}
                  className="rounded-full border-0 bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800"
                >
                  <School className="size-3 mr-1.5" />
                  {sekolah.nama}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {rencanaProgram.length === 0 ? (
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <ClipboardList className="size-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum Ada Rencana Program</h3>
            <p className="text-sm text-slate-600 text-center mb-6 max-w-md">
              Anda belum memiliki rencana program kepengawasan. Klik tombol di atas untuk membuat rencana program baru.
            </p>
            <Button
              className="rounded-xl border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700"
              asChild
            >
              <Link href="/pengawas/perencanaan/rencana-program/pilih-sekolah">
                <Plus className="size-4 mr-2" />
                Buat Rencana Program Pertama
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.entries(
            rencanaProgram.reduce((acc, curr) => {
              const key = curr.periode || "Tanpa Periode";
              if (!acc[key]) acc[key] = [];
              acc[key].push(curr);
              return acc;
            }, {} as Record<string, RencanaProgram[]>)
          ).map(([periode, documents]) => (
            <Card
              key={periode}
              className="group overflow-hidden border-0 bg-white shadow-lg shadow-indigo-100/50 ring-1 ring-slate-200 py-0 gap-0"
            >
              <CardHeader className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

                <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md ring-1 ring-white/30">
                      <Calendar className="size-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white">
                        {periode}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-white/15 text-white hover:bg-white/25 border-0 backdrop-blur-md">
                          {documents.length} Dokumen
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="gap-2 bg-white text-indigo-700 hover:bg-slate-50 font-semibold shadow-sm"
                    asChild
                  >
                    <Link href={`/pengawas/perencanaan/rencana-program/rekap/${encodeURIComponent(periode)}`}>
                      <Printer className="size-4" />
                      Cetak Rekap
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                      <tr>
                        <th className="px-6 py-4">Sekolah Binaan</th>
                        <th className="px-6 py-4 w-[200px]">Dibuat Pada</th>
                        <th className="px-6 py-4 w-[150px]">Status</th>
                        <th className="px-6 py-4 w-[300px] text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {documents.map((rencana) => (
                        <tr key={rencana.id} className="group/row hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-wrap gap-2">
                              {rencana.sekolah && rencana.sekolah.length > 0 ? (
                                rencana.sekolah.map((sekolah) => (
                                  <div
                                    key={sekolah.id}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm"
                                  >
                                    <School className="size-3 text-indigo-500" />
                                    {sekolah.nama}
                                  </div>
                                ))
                              ) : (
                                <span className="flex items-center gap-1.5 font-medium text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded-md mb-2 w-fit">
                                  <AlertCircle className="size-3" />
                                  Belum ada sekolah
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{rencana.tanggal}</span>
                              <span className="text-xs text-slate-500">
                                Update: {rencana.updated_at ? new Date(rencana.updated_at).toLocaleDateString('id-ID') : '-'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <Badge
                              variant="outline"
                              className={cn(
                                "px-2.5 py-0.5 text-xs font-semibold border-0",
                                rencana.status === "Terbit"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-indigo-100 text-indigo-700"
                              )}
                            >
                              {rencana.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="flex items-center justify-center gap-2">
                              {/* Publish Button if Draft */}
                              {rencana.status === "Draft" && (
                                <Button
                                  size="sm"
                                  className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm px-3"
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(`/api/pengawas/rencana-program/${rencana.id}`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                          status: "Terbit",
                                        }),
                                      });

                                      if (response.ok) {
                                        toast({
                                          title: "Berhasil",
                                          description: "Rencana program berhasil diterbitkan",
                                        });
                                        loadRencanaProgram();
                                      } else {
                                        throw new Error("Gagal menerbitkan");
                                      }
                                    } catch (error) {
                                      toast({
                                        title: "Error",
                                        description: "Gagal menerbitkan rencana program",
                                        variant: "error",
                                      });
                                    }
                                  }}
                                >
                                  <Send className="size-3.5" />
                                  <span className="sr-only sm:not-sr-only sm:inline-block">Terbit</span>
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                asChild
                              >
                                <Link href={`/pengawas/perencanaan/rencana-program/${rencana.id}/edit`}>
                                  <Edit className="size-3.5" />
                                  <span className="sr-only lg:not-sr-only lg:inline-block">Edit</span>
                                </Link>
                              </Button>

                              <Button
                                size="sm"
                                className="h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200"
                                asChild
                              >
                                <Link href={`/pengawas/perencanaan/rencana-program/${rencana.id}`}>
                                  <Eye className="size-3.5" />
                                  <span className="sr-only lg:not-sr-only lg:inline-block">Lihat</span>
                                </Link>
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                onClick={() => setDeleteId(rencana.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden flex flex-col divide-y divide-slate-100">
                  {documents.map((rencana) => (
                    <div key={rencana.id} className="flex flex-col gap-4 p-5 hover:bg-slate-50/50 transition-colors">
                      {/* Mobile Header: Date & Status */}
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-slate-900">{rencana.tanggal}</span>
                          <span className="text-xs text-slate-500">
                            Update: {rencana.updated_at ? new Date(rencana.updated_at).toLocaleDateString('id-ID') : '-'}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-2.5 py-1 text-xs font-semibold border-0",
                            rencana.status === "Terbit"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-indigo-100 text-indigo-700"
                          )}
                        >
                          {rencana.status}
                        </Badge>
                      </div>

                      {/* Mobile: Schools */}
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Sekolah Binaan</p>
                        <div className="flex flex-wrap gap-2">
                          {rencana.sekolah && rencana.sekolah.length > 0 ? (
                            rencana.sekolah.map((sekolah) => (
                              <div
                                key={sekolah.id}
                                className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
                              >
                                <School className="size-3 text-indigo-500" />
                                {sekolah.nama}
                              </div>
                            ))
                          ) : (
                            <span className="flex items-center gap-1.5 font-medium text-amber-600 text-xs bg-amber-50 px-2.5 py-1.5 rounded-md">
                              <AlertCircle className="size-3" />
                              Belum ada sekolah
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mobile: Actions */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {rencana.status === "Draft" && (
                          <Button
                            size="sm"
                            className="col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            onClick={async () => {
                              try {
                                const response = await fetch(`/api/pengawas/rencana-program/${rencana.id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    status: "Terbit",
                                  }),
                                });

                                if (response.ok) {
                                  toast({
                                    title: "Berhasil",
                                    description: "Rencana program berhasil diterbitkan",
                                  });
                                  loadRencanaProgram();
                                } else {
                                  throw new Error("Gagal menerbitkan");
                                }
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "Gagal menerbitkan rencana program",
                                  variant: "error",
                                });
                              }
                            }}
                          >
                            <Send className="size-3.5 mr-2" /> Terbitkan
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 border-slate-200 text-slate-600"
                          asChild
                        >
                          <Link href={`/pengawas/perencanaan/rencana-program/${rencana.id}/edit`}>
                            <Edit className="size-3.5" /> Edit
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                          asChild
                        >
                          <Link href={`/pengawas/perencanaan/rencana-program/${rencana.id}`}>
                            <Eye className="size-3.5" /> Lihat
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="col-span-2 w-full text-slate-400 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteId(rencana.id)}
                        >
                          <Trash2 className="size-4 mr-2" /> Hapus Program
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
      }

      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Calendar className="size-5 text-indigo-600" />
            Panduan Penyusunan Rencana Program
          </CardTitle>
          <CardDescription className="text-slate-700 font-medium">
            Ketentuan dan format penyusunan rencana program kepengawasan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4">
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-900 mb-3">
                Komponen Rencana Program:
              </p>
              <ul className="text-sm sm:text-base font-medium text-slate-800 space-y-2 ml-5 list-disc">
                <li>Identitas pengawas dan wilayah tugas</li>
                <li>Daftar sekolah binaan</li>
                <li>Program kegiatan supervisi dan pendampingan</li>
                <li>Jadwal kegiatan per triwulan</li>
                <li>Target capaian dan indikator keberhasilan</li>
                <li>Rencana anggaran (jika diperlukan)</li>
              </ul>
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-900 mb-2">
                Format Laporan:
              </p>
              <p className="text-sm sm:text-base font-medium text-slate-800">
                Laporan dapat diunduh dalam format PDF dengan identitas pengawas dan tanda tangan digital.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-slate-900">Hapus Rencana Program?</DialogTitle>
            <DialogDescription className="text-slate-600">
              Tindakan ini tidak dapat dibatalkan. Data rencana program akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 shadow-sm border border-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}

