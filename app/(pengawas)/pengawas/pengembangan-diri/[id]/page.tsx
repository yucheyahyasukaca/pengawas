"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, FileText, Download, Edit, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";

interface PengembanganDiri {
    id: string;
    nama_kegiatan: string;
    tanggal_kegiatan: string;
    materi_kegiatan: string;
    sertifikat_url: string | null;
    status: string;
}

export default function DetailPengembanganDiriPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { toast } = useToast();
    const [data, setData] = useState<PengembanganDiri | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [idParam, setIdParam] = useState<string>("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        params.then((resolvedParams) => {
            setIdParam(resolvedParams.id);
            fetchData(resolvedParams.id);
        });
    }, [params]);

    const fetchData = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/pengawas/pengembangan-diri/${id}`);
            if (!response.ok) {
                throw new Error("Gagal mengambil data");
            }
            const result = await response.json();
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!idParam) return;
        setDeleting(true);
        try {
            const response = await fetch(`/api/pengawas/pengembangan-diri/${idParam}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Gagal menghapus data");
            }

            toast({
                title: "Berhasil",
                description: "Data pengembangan diri berhasil dihapus",
            });

            setDeleteDialogOpen(false);
            router.push("/pengawas/pengembangan-diri");
            router.refresh(); // Refresh list to reflect changes
        } catch (error: any) {
            toast({
                title: "Gagal",
                description: error.message,
                variant: "error",
            });
        } finally {
            setDeleting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "disetujui":
                return "bg-green-100 text-green-700";
            case "selesai":
                return "bg-blue-100 text-blue-700";
            case "ditolak":
                return "bg-red-100 text-red-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-red-500">Error: {error || "Data tidak ditemukan"}</p>
                <Button variant="outline" onClick={() => router.push("/pengawas/pengembangan-diri")}>
                    Kembali ke Daftar
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                    asChild
                >
                    <Link href="/pengawas/pengembangan-diri">
                        <ArrowLeft className="size-4 mr-2" />
                        Kembali
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Detail Kegiatan</h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Informasi lengkap mengenai kegiatan pengembangan diri
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl text-slate-900 font-bold mb-2">
                                        {data.nama_kegiatan}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar className="size-4" />
                                        {format(new Date(data.tanggal_kegiatan), "EEEE, d MMMM yyyy", { locale: localeId })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${getStatusColor(data.status)}`}>
                                    {data.status.toUpperCase()}
                                </Badge>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-600" asChild>
                                    <Link href={`/pengawas/pengembangan-diri/${idParam}/edit`}>
                                        <Edit className="size-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <FileText className="size-4 text-indigo-600" />
                                    Materi Kegiatan
                                </h3>
                                <div className="p-4 bg-slate-50 rounded-lg text-slate-700 text-sm whitespace-pre-wrap leading-relaxed border border-slate-100">
                                    {data.materi_kegiatan || "-"}
                                </div>
                            </div>

                            {data.sertifikat_url && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                        <Download className="size-4 text-indigo-600" />
                                        Dokumen Bukti
                                    </h3>
                                    <div className="flex items-center justify-between p-4 border border-indigo-100 rounded-lg bg-indigo-50/50">
                                        <span className="text-sm text-indigo-900 font-medium truncate flex-1 mr-4">
                                            Dokumen Sertifikat/Laporan
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 shrink-0"
                                            asChild
                                        >
                                            <a href={data.sertifikat_url} target="_blank" rel="noopener noreferrer">
                                                <Download className="size-4 mr-2" />
                                                Unduh
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-slate-900">Aksi</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                                onClick={() => router.push(`/pengawas/pengembangan-diri/${idParam}/edit`)}
                            >
                                <Edit className="size-4 mr-2" />
                                Edit Kegiatan
                            </Button>

                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        className="w-full justify-start rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200 shadow-none hover:shadow-sm"
                                    >
                                        <Trash2 className="size-4 mr-2" />
                                        Hapus Kegiatan
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Apakah Anda yakin?</DialogTitle>
                                        <DialogDescription>
                                            Tindakan ini tidak dapat dibatalkan. Data kegiatan ini akan dihapus permanen dari sistem.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
                                        <Button
                                            onClick={handleDelete}
                                            disabled={deleting}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            {deleting ? "Menghapus..." : "Ya, Hapus"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
