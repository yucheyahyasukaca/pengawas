"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Upload, Loader2, FileIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import imageCompression from 'browser-image-compression';

export default function EditPengembanganDiriPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false); // For saving
    const [fetching, setFetching] = useState(true); // For initial data
    const [uploading, setUploading] = useState(false);
    const [idParam, setIdParam] = useState<string>("");

    const [formData, setFormData] = useState({
        nama_kegiatan: "",
        tanggal_kegiatan: "",
        materi_kegiatan: "",
        sertifikat_url: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        params.then((resolvedParams) => {
            setIdParam(resolvedParams.id);
            fetchData(resolvedParams.id);
        });
    }, [params]);

    const fetchData = async (id: string) => {
        try {
            setFetching(true);
            const response = await fetch(`/api/pengawas/pengembangan-diri/${id}`);
            if (!response.ok) throw new Error("Gagal mengambil data");
            const data = await response.json();
            setFormData({
                nama_kegiatan: data.nama_kegiatan,
                tanggal_kegiatan: data.tanggal_kegiatan, // Ensure format YYYY-MM-DD
                materi_kegiatan: data.materi_kegiatan || "",
                sertifikat_url: data.sertifikat_url || "",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "error"
            });
        } finally {
            setFetching(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            let file = e.target.files[0];

            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast({ title: "Format tidak didukung", variant: "error" });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast({ title: "File terlalu besar (Max 5MB)", variant: "error" });
                return;
            }

            // Compress if image
            if (file.type.startsWith('image/')) {
                try {
                    toast({ title: "Mengompresi gambar...", description: "Mohon tunggu sebentar." });
                    const options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                    };
                    const compressedFile = await imageCompression(file, options);
                    file = new File([compressedFile], file.name, { type: file.type });
                    toast({ title: "Kompresi berhasil", description: `Ukuran: ${(compressedFile.size / 1024).toFixed(0)}KB` });
                } catch (error) {
                    console.error("Compression error:", error);
                }
            }

            setSelectedFile(file);
            await uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        try {
            setUploading(true);
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const response = await fetch('/api/pengawas/pengembangan-diri/upload', {
                method: 'POST', body: uploadFormData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setFormData(prev => ({ ...prev, sertifikat_url: data.url }));
            toast({ title: "Upload berhasil" });

        } catch (error: any) {
            toast({ title: "Gagal upload", description: error.message, variant: "error" });
            setSelectedFile(null);
        } finally {
            setUploading(false);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setFormData(prev => ({ ...prev, sertifikat_url: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.nama_kegiatan || !formData.tanggal_kegiatan) {
                throw new Error("Wajib diisi");
            }

            const response = await fetch(`/api/pengawas/pengembangan-diri/${idParam}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            toast({ title: "Berhasil disimpan" });
            router.push(`/pengawas/pengembangan-diri/${idParam}`);
            router.refresh();
        } catch (error: any) {
            toast({ title: "Gagal menyimpan", description: error.message, variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-600" /></div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                    asChild
                >
                    <Link href={`/pengawas/pengembangan-diri/${idParam}`}>
                        <ArrowLeft className="size-4 mr-2" />
                        Batal
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Pengembangan Diri</h1>
                </div>
            </div>

            <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nama_kegiatan" className="text-slate-900">Nama Kegiatan</Label>
                            <Input
                                id="nama_kegiatan"
                                placeholder="Contoh: Workshop Supervisi Akademik"
                                value={formData.nama_kegiatan}
                                onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                                required
                                className="bg-white text-slate-900 border-slate-300 focus:border-indigo-500 placeholder:text-slate-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tanggal_kegiatan" className="text-slate-900">Tanggal Pelaksanaan</Label>
                            <Input
                                id="tanggal_kegiatan"
                                type="date"
                                value={formData.tanggal_kegiatan}
                                onChange={(e) => setFormData({ ...formData, tanggal_kegiatan: e.target.value })}
                                required
                                className="bg-white text-slate-900 border-slate-300 focus:border-indigo-500 placeholder:text-slate-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="materi_kegiatan" className="text-slate-900">Materi Kegiatan</Label>
                            <Textarea
                                id="materi_kegiatan"
                                placeholder="Ringkasan materi kegiatan..."
                                value={formData.materi_kegiatan}
                                onChange={(e) => setFormData({ ...formData, materi_kegiatan: e.target.value })}
                                rows={4}
                                className="bg-white text-slate-900 border-slate-300 focus:border-indigo-500 placeholder:text-slate-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-900">Upload Sertifikat / Laporan (Opsional, untuk update)</Label>
                            {!formData.sertifikat_url ? (
                                <div className="border border-dashed p-4 rounded-lg text-center cursor-pointer relative hover:bg-slate-50">
                                    <p className="text-sm text-slate-500">Klik untuk upload (Max 5MB)</p>
                                    <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} disabled={uploading} accept=".pdf,.jpg,.jpeg,.png" />
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 border-indigo-100">
                                    <span className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{selectedFile?.name || "File Tersimpan"}</span>
                                    <Button type="button" variant="ghost" size="sm" onClick={removeFile} className="hover:bg-red-50 hover:text-red-500"><X className="size-4" /></Button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full" disabled={loading || uploading}>
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 size-4" />} Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
