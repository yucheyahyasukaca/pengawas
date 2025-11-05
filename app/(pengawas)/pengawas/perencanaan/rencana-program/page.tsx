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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus, Eye, FileText, Calendar, Loader2, Edit, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RencanaProgram {
  id: string;
  periode: string;
  tanggal: string;
  status: string;
  file?: string;
  created_at?: string;
  updated_at?: string;
}

export default function RencanaProgramPage() {
  const { toast } = useToast();
  const [rencanaProgram, setRencanaProgram] = useState<RencanaProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } catch (error) {
      console.error("Error loading rencana program:", error);
      toast({
        title: "Error",
        description: "Gagal memuat rencana program",
        variant: "destructive",
      });
      setRencanaProgram([]);
    } finally {
      setIsLoading(false);
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rencanaProgram.map((rencana) => (
            <Card
              key={rencana.id}
              className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 transition hover:shadow-lg hover:shadow-indigo-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                      <ClipboardList className="size-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900">
                        {rencana.periode}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        Dibuat: {rencana.tanggal}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {rencana.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {rencana.file && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText className="size-4 text-indigo-500" />
                    <span className="text-xs truncate">{rencana.file}</span>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 font-semibold text-white shadow-md transition-all hover:from-indigo-600 hover:to-blue-600 hover:shadow-lg hover:scale-105"
                      asChild
                    >
                      <Link href={`/pengawas/perencanaan/rencana-program/${rencana.id}/edit`}>
                        <Edit className="size-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-semibold text-white shadow-md transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:scale-105"
                      asChild
                    >
                      <Link href={`/pengawas/perencanaan/rencana-program/${rencana.id}`}>
                        <Eye className="size-4 mr-2" />
                        Lihat
                      </Link>
                    </Button>
                  </div>
                  {rencana.status === "Draft" && (
                    <Button
                      className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 font-semibold text-white shadow-md transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:scale-105"
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
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Send className="size-4 mr-2" />
                      Terbitkan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
    </div>
  );
}

