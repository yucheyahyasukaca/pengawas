"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

export default function BuatPengembanganDiriPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    nama_kegiatan: "",
    tanggal_kegiatan: "",
    materi_kegiatan: "",
    sertifikat_url: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];

      // Validation
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Format file tidak didukung",
          description: "Gunakan PDF, JPG, PNG, atau WEBP",
          variant: "error"
        })
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Maksimal ukuran file adalah 5MB",
          variant: "error"
        })
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
          // Continue with original file if compression fails
        }
      }

      setSelectedFile(file);

      // Auto upload
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/pengawas/pengembangan-diri/upload', {
        method: 'POST',
        body: uploadFormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal upload file");
      }

      setFormData(prev => ({ ...prev, sertifikat_url: data.url }));
      toast({
        title: "Berhasil upload",
        description: "File berhasil diupload",
      });

    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Gagal upload",
        description: error.message,
        variant: "error"
      });
      setSelectedFile(null); // Reset if failed
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
      // Basic validation
      if (!formData.nama_kegiatan || !formData.tanggal_kegiatan) {
        throw new Error("Nama dan Tanggal Kegiatan wajib diisi");
      }

      const response = await fetch("/api/pengawas/pengembangan-diri", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan data");
      }

      toast({
        title: "Berhasil",
        description: "Data pengembangan diri berhasil disimpan",
      });

      router.push("/pengawas/pengembangan-diri");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Upload Pengembangan Diri</h1>
          <p className="text-sm text-slate-600 mt-1">
            Isi formulir untuk mengupload laporan pengembangan diri dan sertifikat
          </p>
        </div>
      </div>

      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-slate-900 font-bold">Formulir Pengembangan Diri</CardTitle>
          <CardDescription className="text-slate-700">
            Lengkapi semua data yang diperlukan untuk laporan pengembangan diri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nama_kegiatan" className="text-slate-900">Nama Kegiatan <span className="text-red-500">*</span></Label>
              <Input
                id="nama_kegiatan"
                placeholder="Contoh: Workshop Supervisi Akademik"
                value={formData.nama_kegiatan}
                onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                required
                className="bg-white text-slate-900 border-slate-300 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal_kegiatan" className="text-slate-900">Tanggal Pelaksanaan <span className="text-red-500">*</span></Label>
              <Input
                id="tanggal_kegiatan"
                type="date"
                value={formData.tanggal_kegiatan}
                onChange={(e) => setFormData({ ...formData, tanggal_kegiatan: e.target.value })}
                required
                className="bg-white text-slate-900 border-slate-300 focus:border-indigo-500"
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
                className="bg-white text-slate-900 border-slate-300 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-900">Upload Sertifikat / Laporan</Label>

              {!selectedFile ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition cursor-pointer relative">
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600 font-medium">Klik untuk upload file</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  <Input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 border border-indigo-100 rounded-lg bg-indigo-50/50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      {uploading ? (
                        <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                      ) : (
                        <FileIcon className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">
                        {uploading ? "Mengupload..." : (formData.sertifikat_url ? "Terupload" : "Menunggu")}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-red-500"
                    onClick={removeFile}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                asChild
              >
                <Link href="/pengawas/pengembangan-diri">Batal</Link>
              </Button>
              <Button
                type="submit"
                className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
                disabled={loading || uploading}
              >
                {loading ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
