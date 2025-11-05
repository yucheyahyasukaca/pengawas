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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, MapPin, School, Edit, Mail, Loader2, CheckCircle2, Clock, XCircle, Camera, Save, AlertCircle, FileText, X, Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PengawasData {
  id: string;
  email: string;
  nama: string | null;
  nip: string | null;
  status_approval: string | null;
  metadata: {
    wilayah_tugas?: string;
    sekolah_binaan?: string[];
    foto_profil?: string;
  } | null;
}

const KCD_WILAYAH_OPTIONS = Array.from({ length: 13 }, (_, i) => `KCD Wilayah ${i + 1}`);

export default function DataPengawasPage() {
  const router = useRouter();
  const [pengawas, setPengawas] = useState<PengawasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingFoto, setIsUploadingFoto] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  
  // Edit form state
  const [editNama, setEditNama] = useState("");
  const [editNip, setEditNip] = useState("");
  const [editWilayahTugas, setEditWilayahTugas] = useState("");
  const [editWilayahInput, setEditWilayahInput] = useState("");
  const [isKcdDropdownOpen, setIsKcdDropdownOpen] = useState(false);
  const [editFotoProfil, setEditFotoProfil] = useState<string | null>(null);
  
  // Sekolah binaan state
  const [sekolahList, setSekolahList] = useState<Array<{id: string; nama_sekolah: string; npsn: string; status: string; jenjang: string; kabupaten_kota: string}>>([]);
  const [editSekolahBinaan, setEditSekolahBinaan] = useState<Array<{id: string; nama: string; npsn: string}>>([]);
  const [sekolahSearchQuery, setSekolahSearchQuery] = useState("");
  const [isSekolahDropdownOpen, setIsSekolahDropdownOpen] = useState(false);
  const [isLoadingSekolah, setIsLoadingSekolah] = useState(false);

  useEffect(() => {
    loadPengawasData();
  }, []);

  const loadPengawasData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/get-current-user');
      
      if (!response.ok) {
        throw new Error('Gagal memuat data pengawas');
      }

      const data = await response.json();
      const userData = data.user;

      if (!userData || userData.role !== 'pengawas') {
        throw new Error('Data pengawas tidak ditemukan');
      }

      setPengawas(userData);
    } catch (err) {
      console.error("Error loading pengawas data:", err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    if (!pengawas) return;
    
    // Populate form with current data
    setEditNama(pengawas.nama || "");
    setEditNip(pengawas.nip || "");
    const wilayahTugas = pengawas.metadata?.wilayah_tugas || "";
    setEditWilayahTugas(wilayahTugas);
    setEditWilayahInput(wilayahTugas);
    setEditFotoProfil(pengawas.metadata?.foto_profil || null);
    
    // Convert sekolah binaan to object array
    const sekolahBinaan = pengawas.metadata?.sekolah_binaan || [];
    if (Array.isArray(sekolahBinaan) && sekolahBinaan.length > 0) {
      const convertedSekolah = sekolahBinaan.map((s: any) => {
        if (typeof s === 'string') {
          return { id: '', nama: s, npsn: '' };
        }
        return { id: s.id || '', nama: s.nama || s.nama_sekolah || '', npsn: s.npsn || '' };
      });
      setEditSekolahBinaan(convertedSekolah);
    } else {
      setEditSekolahBinaan([]);
    }
    
    setIsEditDialogOpen(true);
    loadSekolahList();
  };

  const loadSekolahList = async () => {
    if (sekolahList.length > 0) return;
    
    try {
      setIsLoadingSekolah(true);
      const response = await fetch('/api/sekolah/list');
      
      if (!response.ok) {
        console.error("Error loading sekolah list");
        return;
      }
      
      const data = await response.json();
      if (data.success && data.sekolah) {
        setSekolahList(data.sekolah);
      }
    } catch (err) {
      console.error("Error loading sekolah list:", err);
    } finally {
      setIsLoadingSekolah(false);
    }
  };

  const filteredSekolahOptions = sekolahList.filter(sekolah => {
    const isSelected = editSekolahBinaan.some(s => s.id === sekolah.id || s.nama === sekolah.nama_sekolah);
    if (isSelected) return false;
    
    if (!sekolahSearchQuery.trim()) return true;
    
    const query = sekolahSearchQuery.toLowerCase();
    return (
      sekolah.nama_sekolah.toLowerCase().includes(query) ||
      sekolah.npsn.toLowerCase().includes(query) ||
      sekolah.kabupaten_kota.toLowerCase().includes(query)
    );
  });

  const filteredKcdOptions = editWilayahInput.trim()
    ? KCD_WILAYAH_OPTIONS.filter(option =>
        option.toLowerCase().includes(editWilayahInput.toLowerCase())
      )
    : KCD_WILAYAH_OPTIONS;

  const handleSelectSekolah = (sekolah: {id: string; nama_sekolah: string; npsn: string}) => {
    const isSelected = editSekolahBinaan.some(s => s.id === sekolah.id || s.nama === sekolah.nama_sekolah);
    if (isSelected) return;
    
    setEditSekolahBinaan([...editSekolahBinaan, {
      id: sekolah.id,
      nama: sekolah.nama_sekolah,
      npsn: sekolah.npsn
    }]);
    setSekolahSearchQuery("");
    setIsSekolahDropdownOpen(false);
  };

  const handleRemoveSekolah = (id: string) => {
    setEditSekolahBinaan(editSekolahBinaan.filter(s => s.id !== id));
  };

  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setEditError("Format file tidak didukung. Gunakan JPG, PNG, atau WEBP");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setEditError("Ukuran file terlalu besar. Maksimal 5MB");
      return;
    }

    setIsUploadingFoto(true);
    setEditError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/pengawas/upload-foto', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengupload foto');
      }

      if (data.success && data.url) {
        setEditFotoProfil(data.url);
      }
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Gagal mengupload foto');
    } finally {
      setIsUploadingFoto(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editNama.trim()) {
      setEditError("Nama lengkap harus diisi");
      return;
    }

    setIsSaving(true);
    setEditError(null);

    try {
      const sekolahBinaanNames = editSekolahBinaan.map(s => s.nama);
      
      const response = await fetch('/api/auth/update-profil-pengawas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: editNama.trim(),
          nip: editNip.trim(),
          wilayah_tugas: editWilayahTugas.trim(),
          sekolah_binaan: sekolahBinaanNames,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan data profil");
      }

      // Reload data
      await loadPengawasData();
      setIsEditDialogOpen(false);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-in fade-in">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-indigo-200 animate-ping opacity-75" />
          <Loader2 className="relative size-12 animate-spin text-indigo-600" />
        </div>
        <p className="text-sm font-medium text-slate-700">Memuat data pengawas...</p>
      </div>
    );
  }

  if (error || !pengawas) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-in fade-in slide-in-from-bottom-4">
        <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100/50 max-w-md w-full shadow-xl">
          <CardContent className="pt-8 pb-6 px-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <XCircle className="size-8" />
              </div>
              <p className="text-sm font-semibold text-red-700 text-center">{error || 'Data pengawas tidak ditemukan'}</p>
              <Button
                onClick={loadPengawasData}
                className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transition-all"
              >
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const wilayahTugas = pengawas.metadata?.wilayah_tugas || 'Belum diisi';
  const sekolahBinaan = pengawas.metadata?.sekolah_binaan || [];
  const jumlahSekolah = Array.isArray(sekolahBinaan) ? sekolahBinaan.length : 0;
  const statusApproval = pengawas.status_approval || 'pending';
  
  const getStatusConfig = () => {
    switch (statusApproval) {
      case 'approved':
        return {
          label: 'Aktif',
          icon: CheckCircle2,
          className: 'bg-green-50 text-green-700 border-green-200',
          iconClassName: 'text-green-600',
        };
      case 'pending':
        return {
          label: 'Menunggu Persetujuan',
          icon: Clock,
          className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          iconClassName: 'text-yellow-600',
        };
      case 'rejected':
        return {
          label: 'Ditolak',
          icon: XCircle,
          className: 'bg-red-50 text-red-700 border-red-200',
          iconClassName: 'text-red-600',
        };
      default:
        return {
          label: 'Belum Diketahui',
          icon: Clock,
          className: 'bg-slate-50 text-slate-700 border-slate-200',
          iconClassName: 'text-slate-600',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const fotoProfil = pengawas.metadata?.foto_profil || null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Profil Pengawas</h1>
          <p className="text-sm text-slate-600 mt-1">Informasi profil Anda</p>
        </div>
        <Button 
          onClick={handleEditProfile}
          size="sm"
          className="rounded-full bg-indigo-700 hover:bg-indigo-800 text-white shadow-md font-semibold"
        >
          <Edit className="size-4 mr-2" />
          Edit Profil
        </Button>
      </div>

      {/* Profile Card - Simplified */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Photo Section */}
            <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
              <div className="relative size-24 sm:size-28 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 border-2 border-indigo-200 overflow-hidden">
                {fotoProfil ? (
                  <Image
                    src={fotoProfil}
                    alt={pengawas.nama || "Foto Profil"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User className="size-12 text-indigo-600" />
                  </div>
                )}
              </div>
              <Badge 
                className={cn(
                  "mt-4 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5",
                  statusConfig.className
                )}
              >
                <StatusIcon className={cn("size-3.5", statusConfig.iconClassName)} />
                <span>{statusConfig.label}</span>
              </Badge>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">
                  {pengawas.nama || 'Nama Belum Diisi'}
                </h2>
                <p className="text-sm text-slate-600">
                  {pengawas.nip ? `NIP: ${pengawas.nip}` : 'NIP: Belum diisi'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="size-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Email</p>
                    <p className="text-sm font-medium text-slate-900 break-all">{pengawas.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Wilayah Tugas</p>
                    <p className="text-sm font-medium text-slate-900">{wilayahTugas}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <School className="size-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Sekolah Binaan</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold text-indigo-700">{jumlahSekolah}</span>
                      <span className="text-sm text-slate-600">sekolah</span>
                    </div>
                    {jumlahSekolah > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.isArray(sekolahBinaan) && sekolahBinaan.slice(0, 3).map((sekolah, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="rounded-full border-indigo-200 bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5"
                          >
                            {sekolah}
                          </Badge>
                        ))}
                        {jumlahSekolah > 3 && (
                          <Badge variant="outline" className="rounded-full border-indigo-200 bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5">
                            +{jumlahSekolah - 3} lainnya
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[95vh] p-0 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="px-0 sm:px-0 mb-4 sm:mb-6">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-slate-900">
              <Edit className="size-5 text-indigo-700" />
              Edit Profil Pengawas
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-1">
              Update informasi profil Anda di bawah ini
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
            {editError && (
              <div className="flex items-start gap-3 rounded-lg border-2 border-red-300 bg-red-100 p-3 sm:p-4 text-sm text-red-900">
                <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-700" />
                <span className="flex-1 font-medium">{editError}</span>
              </div>
            )}

            {/* Foto Profil Upload */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 pb-4 border-b border-slate-200">
              <label className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <Camera className="size-4 sm:size-5 text-indigo-700" />
                Foto Profil
              </label>
              <div className="relative">
                <div className="relative size-24 sm:size-32 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 border-2 border-indigo-300 overflow-hidden">
                  {editFotoProfil ? (
                    <Image
                      src={editFotoProfil}
                      alt="Foto Profil"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <User className="size-12 sm:size-16 text-indigo-700" />
                    </div>
                  )}
                  {isUploadingFoto && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="size-6 sm:size-8 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="edit-foto-upload"
                  className="absolute -bottom-1 -right-1 flex size-9 sm:size-10 items-center justify-center rounded-full bg-indigo-700 text-white shadow-lg cursor-pointer hover:bg-indigo-800 transition-all border-2 border-white"
                  title="Unggah Foto"
                >
                  {isUploadingFoto ? (
                    <Loader2 className="size-4 sm:size-5 animate-spin" />
                  ) : (
                    <Camera className="size-4 sm:size-5" />
                  )}
                </label>
                <input
                  id="edit-foto-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFotoUpload}
                  className="hidden"
                  disabled={isUploadingFoto}
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 text-center font-medium">
                Ukuran maksimal 5MB. Format: JPG, PNG, atau WEBP
              </p>
            </div>

            {/* Nama */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <User className="size-4 sm:size-5 text-indigo-700" />
                Nama Lengkap dengan Gelar <span className="text-red-600 font-bold">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Dr. Ahmad Fauzi, M.Pd"
                value={editNama}
                onChange={(e) => setEditNama(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 disabled:opacity-50"
                required
                disabled={isSaving}
              />
            </div>

            {/* NIP */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="size-4 sm:size-5 text-indigo-700" />
                NIP
              </label>
              <input
                type="text"
                placeholder="Contoh: 196512151988031001"
                value={editNip}
                onChange={(e) => setEditNip(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 disabled:opacity-50"
                disabled={isSaving}
              />
            </div>

            {/* Wilayah Tugas */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <MapPin className="size-4 sm:size-5 text-indigo-700" />
                KCD Wilayah
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ketik atau pilih KCD Wilayah..."
                  value={editWilayahInput}
                  onChange={(e) => {
                    setEditWilayahInput(e.target.value);
                    setEditWilayahTugas(e.target.value);
                    setIsKcdDropdownOpen(true);
                  }}
                  onFocus={() => setIsKcdDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsKcdDropdownOpen(false), 200)}
                  className="w-full rounded-lg border-2 border-slate-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 disabled:opacity-50"
                  disabled={isSaving}
                />
                <ChevronDown className="absolute right-3 top-1/2 size-4 sm:size-5 -translate-y-1/2 text-slate-500 pointer-events-none" />
                {isKcdDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full max-h-48 sm:max-h-60 overflow-auto rounded-lg border-2 border-slate-300 bg-white shadow-xl">
                    <div className="py-1">
                      {filteredKcdOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setEditWilayahTugas(option);
                            setEditWilayahInput(option);
                            setIsKcdDropdownOpen(false);
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-sm sm:text-base text-slate-900 font-medium transition-colors hover:bg-indigo-100 hover:text-indigo-700 focus:bg-indigo-100 focus:text-indigo-700 focus:outline-none"
                          disabled={isSaving}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sekolah Binaan */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                <School className="size-4 sm:size-5 text-indigo-700" />
                Sekolah Binaan
              </label>
              
              {editSekolahBinaan.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {editSekolahBinaan.map((sekolah) => (
                    <div
                      key={sekolah.id || sekolah.nama}
                      className="flex items-center gap-2 rounded-lg border-2 border-indigo-300 bg-indigo-100 px-3 py-2 shadow-sm"
                    >
                      <span className="text-sm sm:text-base font-medium text-slate-900">{sekolah.nama}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSekolah(sekolah.id || sekolah.nama)}
                        className="text-red-700 hover:text-red-800 hover:bg-red-50 rounded p-1 transition-colors"
                        disabled={isSaving}
                        title="Hapus"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 sm:size-5 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ketik untuk mencari sekolah..."
                  value={sekolahSearchQuery}
                  onChange={(e) => {
                    setSekolahSearchQuery(e.target.value);
                    setIsSekolahDropdownOpen(true);
                    if (!sekolahList.length && !isLoadingSekolah) {
                      loadSekolahList();
                    }
                  }}
                  onFocus={() => {
                    setIsSekolahDropdownOpen(true);
                    if (!sekolahList.length && !isLoadingSekolah) {
                      loadSekolahList();
                    }
                  }}
                  onBlur={() => setTimeout(() => setIsSekolahDropdownOpen(false), 200)}
                  className="w-full rounded-lg border-2 border-slate-300 bg-white pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 disabled:opacity-50"
                  disabled={isSaving || isLoadingSekolah}
                />
                <ChevronDown className="absolute right-3 top-1/2 size-4 sm:size-5 -translate-y-1/2 text-slate-500 pointer-events-none" />
                
                {isSekolahDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full max-h-48 sm:max-h-64 overflow-auto rounded-lg border-2 border-slate-300 bg-white shadow-xl">
                    {isLoadingSekolah ? (
                      <div className="px-4 py-4 text-sm sm:text-base text-slate-600 text-center font-medium">
                        <Loader2 className="inline size-4 sm:size-5 animate-spin mr-2" />
                        Memuat data sekolah...
                      </div>
                    ) : filteredSekolahOptions.length > 0 ? (
                      <div className="py-1">
                        {filteredSekolahOptions.map((sekolah) => (
                          <button
                            key={sekolah.id}
                            type="button"
                            onClick={() => handleSelectSekolah(sekolah)}
                            onMouseDown={(e) => e.preventDefault()}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-colors hover:bg-indigo-100 focus:bg-indigo-100 focus:outline-none border-b border-slate-100 last:border-b-0"
                            disabled={isSaving}
                          >
                            <div className="text-sm sm:text-base font-semibold text-slate-900">{sekolah.nama_sekolah}</div>
                            <div className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
                              NPSN: {sekolah.npsn} • {sekolah.kabupaten_kota}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-4 text-sm sm:text-base text-slate-600 text-center font-medium">
                        {sekolahSearchQuery.trim() ? "Tidak ada sekolah yang ditemukan" : "Ketik untuk mencari sekolah..."}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 px-4 sm:px-6 pb-4 sm:pb-6 border-t border-slate-200 pt-4 sm:pt-6 bg-slate-50/50">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSaving}
              className="w-full sm:w-auto order-2 sm:order-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="w-full sm:w-auto order-1 sm:order-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold shadow-md"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 sm:size-5 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4 sm:size-5 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

