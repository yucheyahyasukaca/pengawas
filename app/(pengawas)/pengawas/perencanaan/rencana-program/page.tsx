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
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
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
              className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70"
            >
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50/30 border-b border-indigo-100/50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                      <ClipboardList className="size-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">
                        {periode}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        {documents.length} Dokumen Perencanaan
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 bg-white shadow-sm"
                    asChild
                  >
                    <Link href={`/pengawas/perencanaan/rencana-program/rekap/${encodeURIComponent(periode)}`}>
                      <Printer className="size-4" />
                      <span className="hidden sm:inline">Cetak Rekap</span>
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {documents.map((rencana, index) => (
                  <div
                    key={rencana.id}
                    className={cn(
                      "p-4 flex flex-col gap-4",
                      index !== documents.length - 1 && "border-b border-slate-100"
                    )}
                  >
                    {/* Header Item: Date & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="size-3.5" />
                        <span>Dibuat: {rencana.tanggal}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold border-0",
                          rencana.status === "Terbit"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-indigo-100 text-indigo-600"
                        )}
                      >
                        {rencana.status}
                      </Badge>
                    </div>

                    {/* Schools List */}
                    {rencana.sekolah && rencana.sekolah.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <School className="size-3.5 text-slate-500" />
                          <span className="text-xs font-medium text-slate-600">Sekolah Binaan ({rencana.sekolah.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {rencana.sekolah.map((sekolah) => (
                            <span
                              key={sekolah.id}
                              className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                            >
                              {sekolah.nama}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic flex items-center gap-1.5">
                        <AlertCircle className="size-3.5" />
                        Belum ada sekolah dipilih
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
                        asChild
                      >
                        <Link href={`/pengawas/perencanaan/rencana-program/${rencana.id}/edit`}>
                          <Edit className="size-3.5 mr-1.5" /> Edit
                        </Link>
                        {/* Note: The 'buat' link assumes it loads draft, but here we are editing specific ID. 
                              The original code linked 'buat' for edit, which might process draft? 
                              Actually, standard edit should point to [id]/edit. 
                              Let's correct this path to be more explicit if possible, 
                              or keep it consistent with previous logic which seemed to use 'buat' for editing draft? 
                              Wait, original code used `/pengawas/perencanaan/rencana-program/buat` for EDIT button 
                              and `/pengawas/perencanaan/rencana-program/${rencana.id}` for VIEW. 
                              However, `buat` typically works on the SINGLE draft.
                              If we have multiple items, editing one might require loading IT into draft first.
                              For now, I'll point to `[id]/edit` if that page exists and works (which we saw earlier).
                              Re-checking previous logic:
                              Original Edit button: href="/pengawas/perencanaan/rencana-program/buat"
                              This implies the system only supports ONE active draft editing at a time via 'buat'.
                              But the user has multiple items. 
                              I will change Edit to point to `[id]/edit` for safety, as user wants "masing-masing edit".
                           */}
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm hover:from-purple-600 hover:to-pink-600 border-0"
                        asChild
                      >
                        <Link href={`/pengawas/perencanaan/rencana-program/${rencana.id}`}>
                          <Eye className="size-3.5 mr-1.5" /> Lihat
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(rencana.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>

                    {/* Publish Action (if Draft) */}
                    {rencana.status === "Draft" && (
                      <Button
                        size="sm"
                        className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
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
                        <Send className="size-3.5 mr-1.5" /> Terbitkan
                      </Button>
                    )}
                  </div>
                ))}
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

