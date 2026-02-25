"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  School,
  ArrowLeft,
  Loader2,
  XCircle,
  Building2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Activity,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Save,
  Plus,
  Trash2,
  Eye,
  Edit,
  X,
  Download,
  UploadCloud,
  FileSpreadsheet,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import type { ChangeEvent } from "react";

type TabType =
  | "identitas"
  | "profil-guru"
  | "profil-tenaga-kependidikan"
  | "profil-siswa"
  | "branding"
  | "kokurikuler"
  | "ekstrakurikuler"
  | "rapor-pendidikan";

interface SekolahProfile {
  id?: string;
  npsn?: string;
  nama_sekolah?: string;
  jenjang?: string;
  status?: string;
  kabupaten_kota?: string;
  alamat?: string;
  kcd_wilayah?: number;
  kepala_sekolah?: string;
  status_akreditasi?: string;
  jalan?: string;
  desa?: string;
  kecamatan?: string;
  nomor_telepon?: string;
  whatsapp?: string;
  email_sekolah?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  profil_guru?: any;
  profil_tenaga_kependidikan?: any;
  profil_siswa?: any;
  branding_sekolah?: any;
  kokurikuler?: any;
  ekstrakurikuler?: any;
  rapor_pendidikan?: any;
}

import { useSekolahData } from "@/hooks/use-sekolah-data";

export default function SekolahProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  // Use SWR hook for data fetching
  const { sekolah, isLoading, isError, notFound, mutate } = useSekolahData();

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("identitas");
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<SekolahProfile>>({});

  // Update formData when sekolah data is loaded or changed
  useEffect(() => {
    if (sekolah) {
      setFormData(sekolah);
    }
  }, [sekolah]);

  // Handle not found error
  if (notFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-slate-700">
          Sekolah tidak ditemukan. Hubungi admin untuk menghubungkan akun Anda dengan sekolah.
        </p>
        <Button onClick={() => router.push('/sekolah')}>
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "identitas", label: "Identitas Sekolah", icon: Building2 },
    { id: "profil-guru", label: "Profil Guru", icon: User },
    { id: "profil-tenaga-kependidikan", label: "Profil Tenaga Kependidikan", icon: Briefcase },
    { id: "profil-siswa", label: "Profil Siswa", icon: GraduationCap },
    { id: "branding", label: "Branding Sekolah", icon: Award },
    { id: "kokurikuler", label: "Kokurikuler", icon: BookOpen },
    { id: "ekstrakurikuler", label: "Ekstrakurikuler", icon: Activity },
    { id: "rapor-pendidikan", label: "Laporan Rapor Pendidikan", icon: FileText },
  ];


  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch('/api/sekolah/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan data');
      }

      const result = await response.json();

      // Mutate the SWR cache with the new data
      await mutate(result.data, false); // Update validation without re-fetching immediately
      setFormData(result.data); // Update local form data

      toast({
        title: "Berhasil",
        description: "Data profil sekolah berhasil disimpan",
      });
    } catch (err) {
      console.error("Error saving sekolah profile:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Gagal menyimpan data',
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-green-600" />
        <p className="text-sm text-slate-600">Memuat profil sekolah...</p>
      </div>
    );
  }

  if (isError || !sekolah) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="rounded-full border-0 bg-gradient-to-r from-green-50 via-emerald-50/80 to-teal-50/60 text-green-700 hover:from-green-100 hover:via-emerald-100/90 hover:to-teal-100/70 hover:text-green-800 shadow-md shadow-green-200/30 hover:shadow-lg hover:shadow-green-300/40 transition-all duration-300 group"
          >
            <ArrowLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali
          </Button>
        </div>
        <Card className="border-red-200 bg-red-50/50 max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <XCircle className="size-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700 mb-1">
                  Sekolah tidak ditemukan atau terjadi kesalahan
                </p>
                <p className="text-xs text-red-600">
                  Hubungi admin untuk menghubungkan akun Anda dengan sekolah
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="rounded-full border-0 bg-gradient-to-r from-green-50 via-emerald-50/80 to-teal-50/60 text-green-700 hover:from-green-100 hover:via-emerald-100/90 hover:to-teal-100/70 hover:text-green-800 shadow-md shadow-green-200/30 hover:shadow-lg hover:shadow-green-300/40 transition-all duration-300 group"
        >
          <ArrowLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="size-4 mr-2" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>

      {/* School Header Card */}
      <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
        <CardHeader className="bg-gradient-to-br from-green-50 via-emerald-100/30 to-teal-50 px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 via-emerald-400 to-teal-400 text-white shadow-md">
                <School className="size-8 sm:size-10" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  {sekolah.nama_sekolah || 'Sekolah'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base font-medium text-slate-700">
                  NPSN: {sekolah.npsn || '-'} • {sekolah.jenjang || '-'}
                </CardDescription>
              </div>
            </div>
            <Badge className="rounded-full border-2 border-green-300 bg-green-50 px-4 py-2 text-sm font-bold text-green-700 w-fit">
              {sekolah.status || 'Aktif'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
        <CardContent className="p-0">
          {/* Mobile Dropdown Tabs */}
          <div className="border-b border-slate-200 bg-white p-4 md:hidden">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                className="flex w-full items-center justify-between gap-4 rounded-full border-0 bg-slate-100 pl-4 pr-2 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
              >
                <span className="flex-1 text-left">{tabs.find(t => t.id === activeTab)?.label}</span>
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-white/80 px-2.5 py-1.5 mr-2 shadow-sm transition-all hover:bg-white">
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-green-600 transition-all duration-200",
                      isTabDropdownOpen && "rotate-180 text-green-700"
                    )}
                  />
                </div>
              </button>
              {isTabDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsTabDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsTabDropdownOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold transition",
                            isActive
                              ? "bg-green-50 text-green-700"
                              : "text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          <Icon className="size-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white p-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition whitespace-nowrap",
                    isActive
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "identitas" && (
          <IdentitasSekolahTab
            sekolah={sekolah}
            formData={formData}
            updateFormData={updateFormData}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
        {activeTab === "profil-guru" && (
          <ProfilGuruTab
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {activeTab === "profil-tenaga-kependidikan" && (
          <ProfilTenagaKependidikanTab
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {activeTab === "profil-siswa" && (
          <ProfilSiswaTab
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {activeTab === "branding" && (
          <BrandingSekolahTab
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {activeTab === "kokurikuler" && (
          <KokurikulerTab
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {activeTab === "ekstrakurikuler" && (
          <EkstrakurikulerTab
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {activeTab === "rapor-pendidikan" && (
          <RaporPendidikanTab
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
      </div>
    </div>
  );
}

// Identitas Sekolah Tab Component
function IdentitasSekolahTab({
  sekolah,
  formData,
  updateFormData,
  onSave,
  isSaving,
}: {
  sekolah: SekolahProfile;
  formData: Partial<SekolahProfile>;
  updateFormData: (field: string, value: any) => void;
  onSave?: () => void;
  isSaving?: boolean;
}) {
  return (
    <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Identitas Sekolah</CardTitle>
        <CardDescription className="text-slate-600">Informasi lengkap identitas sekolah</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Nama Sekolah</label>
            <input
              type="text"
              value={formData.nama_sekolah || sekolah.nama_sekolah || ''}
              onChange={(e) => updateFormData('nama_sekolah', e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">NPSN</label>
            <input
              type="text"
              value={formData.npsn || sekolah.npsn || ''}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Jenjang</label>
            <input
              type="text"
              value={formData.jenjang || sekolah.jenjang || ''}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Nama Kepala Sekolah</label>
            <input
              type="text"
              value={formData.kepala_sekolah || sekolah.kepala_sekolah || ''}
              onChange={(e) => updateFormData('kepala_sekolah', e.target.value)}
              placeholder="Masukkan nama kepala sekolah"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Status Akreditasi</label>
            <input
              type="text"
              value={formData.status_akreditasi || sekolah.status_akreditasi || ''}
              onChange={(e) => updateFormData('status_akreditasi', e.target.value)}
              placeholder="Masukkan status akreditasi"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900">Alamat Sekolah</label>
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600">Jalan</label>
                <input
                  type="text"
                  value={formData.jalan || sekolah.jalan || ''}
                  onChange={(e) => updateFormData('jalan', e.target.value)}
                  placeholder="Masukkan nama jalan"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Desa</label>
                <input
                  type="text"
                  value={formData.desa || sekolah.desa || ''}
                  onChange={(e) => updateFormData('desa', e.target.value)}
                  placeholder="Masukkan nama desa"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Kecamatan</label>
                <input
                  type="text"
                  value={formData.kecamatan || sekolah.kecamatan || ''}
                  onChange={(e) => updateFormData('kecamatan', e.target.value)}
                  placeholder="Masukkan nama kecamatan"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Kabupaten/Kota</label>
                <input
                  type="text"
                  value={formData.kabupaten_kota || sekolah.kabupaten_kota || ''}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Nomor Telepon</label>
            <input
              type="text"
              value={formData.nomor_telepon || sekolah.nomor_telepon || ''}
              onChange={(e) => updateFormData('nomor_telepon', e.target.value)}
              placeholder="Masukkan nomor telepon"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">WhatsApp</label>
            <input
              type="text"
              value={formData.whatsapp || sekolah.whatsapp || ''}
              onChange={(e) => updateFormData('whatsapp', e.target.value)}
              placeholder="Masukkan nomor WhatsApp"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Email</label>
            <input
              type="email"
              value={formData.email_sekolah || sekolah.email_sekolah || ''}
              onChange={(e) => updateFormData('email_sekolah', e.target.value)}
              placeholder="Masukkan email sekolah"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900">Media Sosial</label>
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600">Website</label>
                <input
                  type="url"
                  value={formData.website || sekolah.website || ''}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  placeholder="https://example.com"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Facebook</label>
                <input
                  type="text"
                  value={formData.facebook || sekolah.facebook || ''}
                  onChange={(e) => updateFormData('facebook', e.target.value)}
                  placeholder="Username atau URL Facebook"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Instagram</label>
                <input
                  type="text"
                  value={formData.instagram || sekolah.instagram || ''}
                  onChange={(e) => updateFormData('instagram', e.target.value)}
                  placeholder="Username Instagram"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">TikTok</label>
                <input
                  type="text"
                  value={formData.tiktok || sekolah.tiktok || ''}
                  onChange={(e) => updateFormData('tiktok', e.target.value)}
                  placeholder="Username TikTok"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Twitter (X)</label>
                <input
                  type="text"
                  value={formData.twitter || sekolah.twitter || ''}
                  onChange={(e) => updateFormData('twitter', e.target.value)}
                  placeholder="Username Twitter"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sm:hidden pt-2">
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="w-full rounded-full border-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-5 py-2 font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span className="ml-2">Menyimpan...</span>
              </>
            ) : (
              "Simpan Identitas"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Profil Guru Tab Component
type GuruAdditionalDuties = {
  waka: boolean;
  kepala_lab: boolean;
  wali_kelas: boolean;
  guru_wali: boolean;
  ekstrakurikuler: boolean;
  lainnya: boolean;
};

type GuruForm = {
  nama: string;
  nip: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  status: string;
  pendidikan: string;
  jurusan: string;
  mata_pelajaran: string;
  jumlah_jam: string;
  tugas_tambahan: GuruAdditionalDuties;
  tanggal_purna_tugas: string;
};

const createEmptyGuru = (): GuruForm => ({
  nama: '',
  nip: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  status: '',
  pendidikan: '',
  jurusan: '',
  mata_pelajaran: '',
  jumlah_jam: '',
  tugas_tambahan: {
    waka: false,
    kepala_lab: false,
    wali_kelas: false,
    guru_wali: false,
    ekstrakurikuler: false,
    lainnya: false,
  },
  tanggal_purna_tugas: '',
});

function ProfilGuruTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  const { toast } = useToast();
  const [guruList, setGuruList] = useState<any[]>(formData.profil_guru?.detail || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGuruIndex, setSelectedGuruIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [newGuru, setNewGuru] = useState<GuruForm>(createEmptyGuru());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const PAGE_SIZE = 6;

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredGuruList = normalizedSearch
    ? guruList.filter(guru => {
      const combined = [guru?.nama, guru?.nip, guru?.mata_pelajaran, guru?.jurusan, guru?.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return combined.includes(normalizedSearch);
    })
    : guruList;

  const TEMPLATE_HEADERS = [
    "Nama",
    "NIP",
    "Tanggal Lahir (YYYY-MM-DD)",
    "Jenis Kelamin (Laki-laki/Perempuan)",
    "Status Kepegawaian",
    "Pendidikan",
    "Jurusan",
    "Mata Pelajaran",
    "Jumlah Jam",
    "Tugas Tambahan (pisahkan dengan koma: waka, kepala_lab, wali_kelas, guru_wali, ekstrakurikuler, lainnya)",
    "Tanggal Purna Tugas (YYYY-MM-DD)",
  ] as const;

  const tugasHeader = TEMPLATE_HEADERS[9];

  const handleDownloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([Array.from(TEMPLATE_HEADERS)]);

    const exampleRow = [{
      Nama: "Siti Rahmawati",
      NIP: "198765432100001",
      "Tanggal Lahir (YYYY-MM-DD)": "1985-04-12",
      "Jenis Kelamin (Laki-laki/Perempuan)": "Perempuan",
      "Status Kepegawaian": "PNS",
      Pendidikan: "S1/D4",
      Jurusan: "Pendidikan Bahasa Indonesia",
      "Mata Pelajaran": "Bahasa Indonesia",
      "Jumlah Jam": 24,
      [tugasHeader]: "waka, wali_kelas",
      "Tanggal Purna Tugas (YYYY-MM-DD)": "",
    }];

    XLSX.utils.sheet_add_json(worksheet, exampleRow, { origin: "A2", skipHeader: true });
    worksheet["!cols"] = TEMPLATE_HEADERS.map(() => ({ wch: 28 }));

    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Guru");
    XLSX.writeFile(workbook, "Template-Data-Guru.xlsx");
  };

  const normalizeDateValue = (value: any) => {
    if (!value) return "";
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    if (typeof value === "number") {
      return XLSX.SSF.format("yyyy-mm-dd", value as number);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return "";
      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
      }
      return trimmed;
    }
    return "";
  };

  const parseTugasTambahan = (value: any) => {
    if (!value) {
      return {
        waka: false,
        kepala_lab: false,
        wali_kelas: false,
        guru_wali: false,
        ekstrakurikuler: false,
        lainnya: false,
      };
    }

    const tokens = String(value)
      .split(",")
      .map(token => token.trim().toLowerCase().replace(/\s+/g, "_"));

    const normalized = tokens.map(token => token.replace(/[^a-z_]/g, ""));
    const hasToken = (...aliases: string[]) => normalized.some(token => aliases.includes(token));

    return {
      waka: hasToken("waka"),
      kepala_lab: hasToken("kepala_lab", "kepalalab", "kepala_labperpus", "kepala_lab_lainnya"),
      wali_kelas: hasToken("wali_kelas", "walikelas"),
      guru_wali: hasToken("guru_wali", "guruwali"),
      ekstrakurikuler: hasToken("ekstrakurikuler", "ekstra"),
      lainnya: hasToken("lainnya", "lain"),
    };
  };

  const handleImportGuru = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportSummary(null);

    try {
      setIsImporting(true);
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

      if (workbook.SheetNames.length === 0) {
        throw new Error("File tidak memiliki data");
      }

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(firstSheet, {
        defval: "",
        raw: false,
      });

      if (rows.length === 0) {
        throw new Error("Tidak ada baris data yang ditemukan dalam file");
      }

      const mapped = rows
        .map((row, index) => {
          const nama = String(row["Nama"] || "").trim();
          if (!nama) {
            return null;
          }

          const nip = String(row["NIP"] || "").trim();
          const tanggalLahir = normalizeDateValue(row["Tanggal Lahir (YYYY-MM-DD)"]);
          const jenisKelamin = String(row["Jenis Kelamin (Laki-laki/Perempuan)"] || "").trim();
          const statusKepegawaian = String(row["Status Kepegawaian"] || "").trim();
          const pendidikan = String(row["Pendidikan"] || "").trim();
          const jurusan = String(row["Jurusan"] || "").trim();
          const mataPelajaran = String(row["Mata Pelajaran"] || "").trim();
          const jumlahJamRaw = row["Jumlah Jam"];
          const jumlahJam = jumlahJamRaw !== null && jumlahJamRaw !== undefined && String(jumlahJamRaw).trim() !== ""
            ? String(jumlahJamRaw).trim()
            : "";
          const tanggalPurna = normalizeDateValue(row["Tanggal Purna Tugas (YYYY-MM-DD)"]);
          const tugasTambahan = parseTugasTambahan(row[tugasHeader]);

          return {
            nama,
            nip,
            tanggal_lahir: tanggalLahir,
            jenis_kelamin: jenisKelamin,
            status: statusKepegawaian,
            pendidikan,
            jurusan,
            mata_pelajaran: mataPelajaran,
            jumlah_jam: jumlahJam,
            tugas_tambahan: tugasTambahan,
            tanggal_purna_tugas: tanggalPurna,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

      if (mapped.length === 0) {
        throw new Error("Tidak ada data guru valid yang bisa diimpor. Pastikan kolom Nama terisi.");
      }

      const mergedList = [...guruList, ...mapped];

      setGuruList(mergedList);

      const updatedFormData = {
        ...formData,
        profil_guru: {
          ...formData.profil_guru,
          detail: mergedList,
        },
      };

      updateFormData('profil_guru', updatedFormData.profil_guru);

      const response = await fetch('/api/sekolah/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan hasil impor');
      }

      setImportSummary(`${mapped.length} data guru berhasil ditambahkan dari file ${file.name}`);

      toast({
        title: "Berhasil",
        description: `${mapped.length} data guru berhasil diimpor`,
      });
    } catch (err) {
      console.error('Error importing guru:', err);
      toast({
        title: "Gagal mengimpor",
        description: err instanceof Error ? err.message : 'Terjadi kesalahan saat membaca file',
        variant: "error",
      });
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (formData.profil_guru?.detail) {
      setGuruList(formData.profil_guru.detail);
      setCurrentPage(1);
    }
  }, [formData.profil_guru]);

  const totalPages = Math.max(1, Math.ceil(filteredGuruList.length / PAGE_SIZE));
  const paginatedGuruList = filteredGuruList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const showingFrom = filteredGuruList.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(currentPage * PAGE_SIZE, filteredGuruList.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);


  const openAddModal = () => {
    setNewGuru(createEmptyGuru());
    setIsAddModalOpen(true);
  };

  const openViewModal = (index: number) => {
    setSelectedGuruIndex(index);
    setIsViewModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setSelectedGuruIndex(index);
    setNewGuru({ ...guruList[index] });
    setIsEditModalOpen(true);
  };

  const handleSaveGuru = async () => {
    try {
      setIsSaving(true);

      let updatedList: any[];
      if (selectedGuruIndex !== null && isEditModalOpen) {
        // Edit existing guru
        updatedList = guruList.map((guru, i) =>
          i === selectedGuruIndex ? newGuru : guru
        );
      } else {
        // Add new guru
        updatedList = [...guruList, newGuru];
      }

      setGuruList(updatedList);

      // Update formData
      const updatedFormData = {
        ...formData,
        profil_guru: {
          ...formData.profil_guru,
          detail: updatedList,
        },
      };
      updateFormData('profil_guru', updatedFormData.profil_guru);

      // Save to database
      const response = await fetch('/api/sekolah/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan data');
      }

      const result = await response.json();

      toast({
        title: "Berhasil",
        description: selectedGuruIndex !== null ? "Data guru berhasil diperbarui" : "Data guru berhasil ditambahkan",
      });

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedGuruIndex(null);
      setNewGuru({
        nama: '',
        nip: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        status: '',
        pendidikan: '',
        jurusan: '',
        mata_pelajaran: '',
        jumlah_jam: '',
        tugas_tambahan: {
          waka: false,
          kepala_lab: false,
          wali_kelas: false,
          guru_wali: false,
          ekstrakurikuler: false,
          lainnya: false,
        },
        tanggal_purna_tugas: '',
      });

      const nextPage = selectedGuruIndex !== null && isEditModalOpen
        ? currentPage
        : Math.max(1, Math.ceil(updatedList.length / PAGE_SIZE));
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Error saving guru:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Gagal menyimpan data',
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGuru = async (index: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
      return;
    }

    try {
      const updated = guruList.filter((_, i) => i !== index);
      setGuruList(updated);

      const updatedFormData = {
        ...formData,
        profil_guru: {
          ...formData.profil_guru,
          detail: updated,
        },
      };
      updateFormData('profil_guru', updatedFormData.profil_guru);

      // Save to database
      const response = await fetch('/api/sekolah/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus data');
      }

      toast({
        title: "Berhasil",
        description: "Data guru berhasil dihapus",
      });

      const newTotalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
      setCurrentPage(prev => Math.min(prev, newTotalPages));
    } catch (err) {
      console.error("Error deleting guru:", err);
      toast({
        title: "Error",
        description: 'Gagal menghapus data',
        variant: "error",
      });
    }
  };

  const updateNewGuru = (field: string, value: any) => {
    if (field.startsWith('tugas_tambahan.')) {
      const tugasField = field.split('.')[1];
      setNewGuru(prev => ({
        ...prev,
        tugas_tambahan: {
          ...prev.tugas_tambahan,
          [tugasField]: value,
        },
      }));
    } else {
      setNewGuru(prev => ({ ...prev, [field]: value }));
    }
  };

  // Calculate statistics
  const stats = {
    jenis_kelamin: {
      laki_laki: guruList.filter(g => g.jenis_kelamin === 'Laki-laki').length,
      perempuan: guruList.filter(g => g.jenis_kelamin === 'Perempuan').length,
    },
    status: {
      pns: guruList.filter(g => g.status === 'PNS').length,
      pppk: guruList.filter(g => g.status === 'PPPK').length,
      pppk_paruh_waktu: guruList.filter(g => g.status === 'PPPK paruh waktu').length,
      guru_tamu: guruList.filter(g => g.status === 'Guru Tamu').length,
      gty: guruList.filter(g => g.status === 'GTY').length,
      gtt: guruList.filter(g => g.status === 'GTT').length,
    },
    pendidikan: {
      sma: guruList.filter(g => g.pendidikan === 'SMA/ sederajat').length,
      d1: guruList.filter(g => g.pendidikan === 'D1').length,
      d2: guruList.filter(g => g.pendidikan === 'D2').length,
      d3: guruList.filter(g => g.pendidikan === 'D3').length,
      s1: guruList.filter(g => g.pendidikan === 'S1/D4').length,
      s2: guruList.filter(g => g.pendidikan === 'S2').length,
      s3: guruList.filter(g => g.pendidikan === 'S3').length,
    },
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 text-center md:text-center">Statistik Profil Guru</CardTitle>
          <CardDescription className="text-slate-600 text-center md:text-center">Ringkasan data guru berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-white/80">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 w-[30%]">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 w-[50%]">Sub Kategori</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 w-[20%]">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/50">
                <tr>
                  <td rowSpan={2} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Jenis Kelamin</td>
                  <td className="px-6 py-3 text-sm text-slate-700">Laki-laki</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.jenis_kelamin.laki_laki}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Perempuan</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.jenis_kelamin.perempuan}</td>
                </tr>
                <tr>
                  <td rowSpan={6} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Status Kepegawaian</td>
                  <td className="px-6 py-3 text-sm text-slate-700">PNS</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.pns}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">PPPK</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.pppk}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">PPPK paruh waktu</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.pppk_paruh_waktu}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Guru Tamu</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.guru_tamu}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">GTY</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.gty}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">GTT</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.gtt}</td>
                </tr>
                <tr>
                  <td rowSpan={7} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Pendidikan</td>
                  <td className="px-6 py-3 text-sm text-slate-700">SMA/ sederajat</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.pendidikan.sma}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">D1</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.pendidikan.d1}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">D2</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.pendidikan.d2}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">D3</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.pendidikan.d3}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">S1/D4</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.pendidikan.s1}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">S2</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.pendidikan.s2}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">S3</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.pendidikan.s3}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* List View */}
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Daftar Profil Guru</CardTitle>
            <CardDescription className="text-slate-600">Daftar lengkap data guru</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIP, atau mata pelajaran"
                className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-600 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
            <Button
              onClick={openAddModal}
              className="w-full rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300 sm:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Tambah Guru
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {guruList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-4">
                <User className="size-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-slate-600 mb-2">Belum ada data guru</p>
              <p className="text-xs text-slate-500 text-center max-w-md">
                Klik tombol "Tambah Guru" di atas untuk menambahkan data guru baru
              </p>
            </div>
          ) : filteredGuruList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
                <Search className="size-6 text-slate-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-2 text-center">Tidak ditemukan data guru dengan kata kunci "{searchQuery}"</p>
              <p className="text-xs text-slate-500 text-center max-w-md">Periksa kembali ejaan atau gunakan kata kunci lain.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedGuruList
                  .map((guru, indexInPage) => {
                    const overallIndex = (currentPage - 1) * PAGE_SIZE + indexInPage;
                    return (
                      <Card key={overallIndex} className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-sm">
                                {overallIndex + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-base font-bold text-slate-900 truncate">{guru.nama || 'Nama Guru'}</p>
                                <p className="text-xs text-slate-600 truncate">{guru.nip || 'NIP: -'}</p>
                                <p className="text-xs text-slate-500 truncate">{guru.mata_pelajaran || 'Mata Pelajaran: -'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 sm:gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewModal(overallIndex)}
                                className="h-9 w-9 rounded-full border border-green-100 bg-green-50 text-green-600 shadow-sm transition hover:bg-green-100 hover:text-green-700 sm:h-8 sm:w-8 sm:border-0 sm:bg-transparent sm:shadow-none"
                              >
                                <Eye className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setNewGuru({ ...guru });
                                  openEditModal(overallIndex);
                                }}
                                className="h-9 w-9 rounded-full border border-blue-100 bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100 hover:text-blue-700 sm:h-8 sm:w-8 sm:border-0 sm:bg-transparent sm:shadow-none"
                              >
                                <Edit className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteGuru(overallIndex)}
                                className="h-9 w-9 rounded-full border border-red-100 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 hover:text-red-700 sm:h-8 sm:w-8 sm:border-0 sm:bg-transparent sm:shadow-none"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>

              {filteredGuruList.length > PAGE_SIZE && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    Menampilkan {showingFrom} - {showingTo} dari {filteredGuruList.length} guru
                    {filteredGuruList.length !== guruList.length && (
                      <span className="ml-1 text-[11px] text-slate-400">(total {guruList.length} guru)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronLeft className="mr-1 size-4" />
                      Sebelumnya
                    </Button>
                    <span className="text-xs font-semibold text-slate-600">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Berikutnya
                      <ChevronRight className="ml-1 size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedGuruIndex(null);
          setNewGuru(createEmptyGuru());
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {isEditModalOpen ? 'Edit Data Guru' : 'Tambah Guru Baru'}
            </DialogTitle>
            <DialogDescription>
              {isEditModalOpen ? 'Perbarui data guru yang sudah ada' : 'Isi data guru baru di bawah ini'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nama Guru */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Nama Guru *</label>
              <input
                type="text"
                value={newGuru.nama || ''}
                onChange={(e) => updateNewGuru('nama', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                placeholder="Masukkan nama guru"
              />
            </div>

            {/* Row 1: NIP, Tanggal Lahir, Jenis Kelamin */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">NIP</label>
                <input
                  type="text"
                  value={newGuru.nip || ''}
                  onChange={(e) => updateNewGuru('nip', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Nomor Induk Pegawai"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Tanggal Lahir</label>
                <input
                  type="date"
                  value={newGuru.tanggal_lahir || ''}
                  onChange={(e) => updateNewGuru('tanggal_lahir', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Jenis Kelamin</label>
                <select
                  value={newGuru.jenis_kelamin || ''}
                  onChange={(e) => updateNewGuru('jenis_kelamin', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            {/* Row 2: Status, Pendidikan, Jurusan */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Status Kepegawaian</label>
                <select
                  value={newGuru.status || ''}
                  onChange={(e) => updateNewGuru('status', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Pilih Status</option>
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="PPPK paruh waktu">PPPK paruh waktu</option>
                  <option value="Guru Tamu">Guru Tamu</option>
                  <option value="GTY">GTY</option>
                  <option value="GTT">GTT</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Pendidikan</label>
                <select
                  value={newGuru.pendidikan || ''}
                  onChange={(e) => updateNewGuru('pendidikan', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Pilih Pendidikan</option>
                  <option value="SMA/ sederajat">SMA/ sederajat</option>
                  <option value="D1">D1</option>
                  <option value="D2">D2</option>
                  <option value="D3">D3</option>
                  <option value="S1/D4">S1/D4</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Jurusan</label>
                <input
                  type="text"
                  value={newGuru.jurusan || ''}
                  onChange={(e) => updateNewGuru('jurusan', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Jurusan pendidikan"
                />
              </div>
            </div>

            {/* Row 3: Mata Pelajaran, Jumlah Jam */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Mata Pelajaran</label>
                <input
                  type="text"
                  value={newGuru.mata_pelajaran || ''}
                  onChange={(e) => updateNewGuru('mata_pelajaran', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Mata pelajaran yang diampu"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Jumlah Jam</label>
                <input
                  type="number"
                  value={newGuru.jumlah_jam || ''}
                  onChange={(e) => updateNewGuru('jumlah_jam', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Jumlah jam mengajar"
                />
              </div>
            </div>

            {/* Tugas Tambahan */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <label className="text-sm font-semibold text-slate-900">Tugas Tambahan</label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-green-50 hover:border-green-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={newGuru.tugas_tambahan?.waka || false}
                    onChange={(e) => updateNewGuru('tugas_tambahan.waka', e.target.checked)}
                    className="size-5 rounded border-slate-300 text-green-600 focus:ring-green-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700">Waka</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-green-50 hover:border-green-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={newGuru.tugas_tambahan?.kepala_lab || false}
                    onChange={(e) => updateNewGuru('tugas_tambahan.kepala_lab', e.target.checked)}
                    className="size-5 rounded border-slate-300 text-green-600 focus:ring-green-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700">Kepala Lab/Perpus/Lainnya</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-green-50 hover:border-green-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={newGuru.tugas_tambahan?.wali_kelas || false}
                    onChange={(e) => updateNewGuru('tugas_tambahan.wali_kelas', e.target.checked)}
                    className="size-5 rounded border-slate-300 text-green-600 focus:ring-green-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700">Wali Kelas</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-green-50 hover:border-green-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={newGuru.tugas_tambahan?.guru_wali || false}
                    onChange={(e) => updateNewGuru('tugas_tambahan.guru_wali', e.target.checked)}
                    className="size-5 rounded border-slate-300 text-green-600 focus:ring-green-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700">Guru Wali</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-green-50 hover:border-green-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={newGuru.tugas_tambahan?.ekstrakurikuler || false}
                    onChange={(e) => updateNewGuru('tugas_tambahan.ekstrakurikuler', e.target.checked)}
                    className="size-5 rounded border-slate-300 text-green-600 focus:ring-green-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700">Ekstrakurikuler</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-green-50 hover:border-green-300 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={newGuru.tugas_tambahan?.lainnya || false}
                    onChange={(e) => updateNewGuru('tugas_tambahan.lainnya', e.target.checked)}
                    className="size-5 rounded border-slate-300 text-green-600 focus:ring-green-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700">Lainnya</span>
                </label>
              </div>
            </div>

            {/* Tanggal Purna Tugas */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Tanggal Purna Tugas</label>
              <input
                type="date"
                value={newGuru.tanggal_purna_tugas || ''}
                onChange={(e) => updateNewGuru('tanggal_purna_tugas', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedGuruIndex(null);
              }}
              disabled={isSaving}
              className="w-full rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 sm:w-auto"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveGuru}
              disabled={isSaving || !newGuru.nama}
              className="w-full rounded-full border-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Detail Data Guru</DialogTitle>
            <DialogDescription>Informasi lengkap data guru</DialogDescription>
          </DialogHeader>

          {selectedGuruIndex !== null && guruList[selectedGuruIndex] && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nama</label>
                  <p className="text-sm font-medium text-slate-900">{guruList[selectedGuruIndex].nama || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">NIP</label>
                  <p className="text-sm font-medium text-slate-900">{guruList[selectedGuruIndex].nip || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tanggal Lahir</label>
                  <p className="text-sm font-medium text-slate-900">{guruList[selectedGuruIndex].tanggal_lahir || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Jenis Kelamin</label>
                  <p className="text-sm font-medium text-slate-900">{guruList[selectedGuruIndex].jenis_kelamin || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status Kepegawaian</label>
                  <p className="text-sm font-medium text-slate-900">{guruList[selectedGuruIndex].status || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Pendidikan</label>
                  <p className="text-sm font-medium text-slate-900">{guruList[selectedGuruIndex].pendidikan || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Jurusan</label>
                  <p className="text-sm font-medium text-slate-900">{guruList[selectedGuruIndex].jurusan || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Mata Pelajaran</label>
                  <p className="text-sm font-medium text-slate-900">{guruList[selectedGuruIndex].mata_pelajaran || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Jumlah Jam</label>
                  <p className="text-sm font-medium text-slate-900">{guruList[selectedGuruIndex].jumlah_jam || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tanggal Purna Tugas</label>
                  <p className="text-sm font-medium text-slate-900">{guruList[selectedGuruIndex].tanggal_purna_tugas || '-'}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tugas Tambahan</label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {guruList[selectedGuruIndex].tugas_tambahan?.waka && (
                    <Badge className="w-fit bg-green-100 text-green-700 border-green-300">Waka</Badge>
                  )}
                  {guruList[selectedGuruIndex].tugas_tambahan?.kepala_lab && (
                    <Badge className="w-fit bg-green-100 text-green-700 border-green-300">Kepala Lab/Perpus/Lainnya</Badge>
                  )}
                  {guruList[selectedGuruIndex].tugas_tambahan?.wali_kelas && (
                    <Badge className="w-fit bg-green-100 text-green-700 border-green-300">Wali Kelas</Badge>
                  )}
                  {guruList[selectedGuruIndex].tugas_tambahan?.guru_wali && (
                    <Badge className="w-fit bg-green-100 text-green-700 border-green-300">Guru Wali</Badge>
                  )}
                  {guruList[selectedGuruIndex].tugas_tambahan?.ekstrakurikuler && (
                    <Badge className="w-fit bg-green-100 text-green-700 border-green-300">Ekstrakurikuler</Badge>
                  )}
                  {guruList[selectedGuruIndex].tugas_tambahan?.lainnya && (
                    <Badge className="w-fit bg-green-100 text-green-700 border-green-300">Lainnya</Badge>
                  )}
                  {!guruList[selectedGuruIndex].tugas_tambahan?.waka &&
                    !guruList[selectedGuruIndex].tugas_tambahan?.kepala_lab &&
                    !guruList[selectedGuruIndex].tugas_tambahan?.wali_kelas &&
                    !guruList[selectedGuruIndex].tugas_tambahan?.guru_wali &&
                    !guruList[selectedGuruIndex].tugas_tambahan?.ekstrakurikuler &&
                    !guruList[selectedGuruIndex].tugas_tambahan?.lainnya && (
                      <p className="text-sm text-slate-500">Tidak ada tugas tambahan</p>
                    )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
              className="w-full rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 sm:w-auto"
            >
              Tutup
            </Button>
            {selectedGuruIndex !== null && (
              <Button
                onClick={() => {
                  setNewGuru({ ...guruList[selectedGuruIndex] });
                  setIsViewModalOpen(false);
                  openEditModal(selectedGuruIndex);
                }}
                className="w-full rounded-full border-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 hover:shadow-lg sm:w-auto"
              >
                <Edit className="size-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-0 bg-white/90 shadow-xl shadow-green-100/40">
        <CardHeader className="space-y-2">
          <CardTitle className="flex flex-wrap items-center gap-2 text-lg font-bold text-slate-900">
            <FileSpreadsheet className="size-5 text-green-600" />
            Import Cepat Data Guru
          </CardTitle>
          <CardDescription className="text-slate-600">
            Unduh template Excel resmi, isi data guru sesuai kolom yang disediakan, lalu unggah kembali untuk menambahkan banyak guru sekaligus.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleDownloadTemplate}
                className="rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 hover:shadow-lg"
              >
                <Download className="mr-2 size-4" />
                Unduh Template Excel
              </Button>
              <Button
                type="button"
                onClick={handleOpenFileDialog}
                disabled={isImporting}
                className="rounded-full border border-emerald-100 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 size-4" />
                    Upload Data Guru
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImportGuru}
              />
            </div>
            {importSummary && (
              <p className="text-sm font-semibold text-emerald-700">
                {importSummary}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
            <p className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
              <FileSpreadsheet className="size-4 text-emerald-600" />
              Panduan singkat pengisian
            </p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Unduh template, lalu buka menggunakan Microsoft Excel, WPS Office, atau Google Sheets.</li>
              <li>Isi setiap kolom sesuai contoh. Gunakan pilihan seperti "PNS", "PPPK", "GTT" pada kolom status.</li>
              <li>Tulis tanggal dengan format <span className="font-semibold text-slate-900">YYYY-MM-DD</span> (contoh: 2024-01-15).</li>
              <li>Pada kolom tugas tambahan, pisahkan dengan koma. Contoh: <span className="font-semibold text-slate-900">waka, wali_kelas</span>.</li>
              <li>Simpan file lalu unggah kembali menggunakan tombol "Upload Data Guru".</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type TenagaForm = {
  nama: string;
  nip: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  status: string;
  pendidikan: string;
  tugas: string;
  tanggal_purna_tugas: string;
};

const createEmptyTenaga = (): TenagaForm => ({
  nama: '',
  nip: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  status: '',
  pendidikan: '',
  tugas: '',
  tanggal_purna_tugas: '',
});

function ProfilTenagaKependidikanTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  const { toast } = useToast();
  const [tenagaList, setTenagaList] = useState<any[]>(formData.profil_tenaga_kependidikan?.detail || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTenagaIndex, setSelectedTenagaIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTenaga, setNewTenaga] = useState<TenagaForm>(createEmptyTenaga());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const PAGE_SIZE = 6;

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredTenagaList = normalizedSearch
    ? tenagaList.filter(tenaga => {
      const combined = [tenaga?.nama, tenaga?.nip, tenaga?.tugas, tenaga?.status, tenaga?.pendidikan]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return combined.includes(normalizedSearch);
    })
    : tenagaList;

  const TEMPLATE_HEADERS = [
    "Nama",
    "NIP",
    "Tanggal Lahir (YYYY-MM-DD)",
    "Jenis Kelamin (Laki-laki/Perempuan)",
    "Status Kepegawaian",
    "Pendidikan",
    "Tugas",
    "Tanggal Purna Tugas (YYYY-MM-DD)",
  ] as const;

  const totalPages = Math.max(1, Math.ceil(filteredTenagaList.length / PAGE_SIZE));
  const paginatedTenagaList = filteredTenagaList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const showingFrom = filteredTenagaList.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(currentPage * PAGE_SIZE, filteredTenagaList.length);

  useEffect(() => {
    if (formData.profil_tenaga_kependidikan?.detail) {
      setTenagaList(formData.profil_tenaga_kependidikan.detail);
      setCurrentPage(1);
    }
  }, [formData.profil_tenaga_kependidikan]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDownloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([Array.from(TEMPLATE_HEADERS)]);

    const exampleRow = [{
      Nama: "Rina Setyawati",
      NIP: "199012312022012001",
      "Tanggal Lahir (YYYY-MM-DD)": "1990-12-31",
      "Jenis Kelamin (Laki-laki/Perempuan)": "Perempuan",
      "Status Kepegawaian": "PNS",
      Pendidikan: "S1/D4",
      Tugas: "Staf Administrasi",
      "Tanggal Purna Tugas (YYYY-MM-DD)": "",
    }];

    XLSX.utils.sheet_add_json(worksheet, exampleRow, { origin: "A2", skipHeader: true });
    worksheet["!cols"] = TEMPLATE_HEADERS.map(() => ({ wch: 30 }));

    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Tenaga");
    XLSX.writeFile(workbook, "Template-Data-Tenaga-Kependidikan.xlsx");
  };

  const normalizeDateValue = (value: any) => {
    if (!value) return "";
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    if (typeof value === "number") {
      return XLSX.SSF.format("yyyy-mm-dd", value as number);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return "";
      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
      }
      return trimmed;
    }
    return "";
  };

  const handleImportTenaga = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportSummary(null);

    try {
      setIsImporting(true);
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

      if (workbook.SheetNames.length === 0) {
        throw new Error("File tidak memiliki data");
      }

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(firstSheet, {
        defval: "",
        raw: false,
      });

      if (rows.length === 0) {
        throw new Error("Tidak ada baris data yang ditemukan dalam file");
      }

      const mapped = rows
        .map(row => {
          const nama = String(row["Nama"] || "").trim();
          if (!nama) return null;

          const nip = String(row["NIP"] || "").trim();
          const tanggalLahir = normalizeDateValue(row["Tanggal Lahir (YYYY-MM-DD)"]);
          const jenisKelamin = String(row["Jenis Kelamin (Laki-laki/Perempuan)"] || "").trim();
          const statusKepegawaian = String(row["Status Kepegawaian"] || "").trim();
          const pendidikan = String(row["Pendidikan"] || "").trim();
          const tugas = String(row["Tugas"] || "").trim();
          const tanggalPurna = normalizeDateValue(row["Tanggal Purna Tugas (YYYY-MM-DD)"]);

          return {
            nama,
            nip,
            tanggal_lahir: tanggalLahir,
            jenis_kelamin: jenisKelamin,
            status: statusKepegawaian,
            pendidikan,
            tugas,
            tanggal_purna_tugas: tanggalPurna,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

      if (mapped.length === 0) {
        throw new Error("Tidak ada data tenaga kependidikan valid yang bisa diimpor. Pastikan kolom Nama terisi.");
      }

      const mergedList = [...tenagaList, ...mapped];
      setTenagaList(mergedList);

      const updatedFormData = {
        ...formData,
        profil_tenaga_kependidikan: {
          ...formData.profil_tenaga_kependidikan,
          detail: mergedList,
        },
      };

      updateFormData('profil_tenaga_kependidikan', updatedFormData.profil_tenaga_kependidikan);

      const response = await fetch('/api/sekolah/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan hasil impor');
      }

      setCurrentPage(Math.max(1, Math.ceil(mergedList.length / PAGE_SIZE)));
      setImportSummary(`${mapped.length} data tenaga kependidikan berhasil ditambahkan dari file ${file.name}`);

      toast({
        title: "Berhasil",
        description: `${mapped.length} data tenaga kependidikan berhasil diimpor`,
      });
    } catch (err) {
      console.error('Error importing tenaga:', err);
      toast({
        title: "Gagal mengimpor",
        description: err instanceof Error ? err.message : 'Terjadi kesalahan saat membaca file',
        variant: "error",
      });
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openAddModal = () => {
    setNewTenaga(createEmptyTenaga());
    setIsAddModalOpen(true);
  };

  const openViewModal = (index: number) => {
    setSelectedTenagaIndex(index);
    setIsViewModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setSelectedTenagaIndex(index);
    setNewTenaga({ ...tenagaList[index] });
    setIsEditModalOpen(true);
  };

  const handleSaveTenaga = async () => {
    try {
      setIsSaving(true);

      let updatedList: any[];
      if (selectedTenagaIndex !== null && isEditModalOpen) {
        // Edit existing tenaga
        updatedList = tenagaList.map((tenaga, i) =>
          i === selectedTenagaIndex ? newTenaga : tenaga
        );
      } else {
        // Add new tenaga
        updatedList = [...tenagaList, newTenaga];
      }

      setTenagaList(updatedList);

      // Update formData
      const updatedFormData = {
        ...formData,
        profil_tenaga_kependidikan: {
          ...formData.profil_tenaga_kependidikan,
          detail: updatedList,
        },
      };
      updateFormData('profil_tenaga_kependidikan', updatedFormData.profil_tenaga_kependidikan);

      // Save to database
      const response = await fetch('/api/sekolah/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan data');
      }

      const result = await response.json();

      toast({
        title: "Berhasil",
        description: selectedTenagaIndex !== null ? "Data tenaga kependidikan berhasil diperbarui" : "Data tenaga kependidikan berhasil ditambahkan",
      });

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedTenagaIndex(null);
      setNewTenaga(createEmptyTenaga());

      const nextPage = selectedTenagaIndex !== null && isEditModalOpen
        ? currentPage
        : Math.max(1, Math.ceil(updatedList.length / PAGE_SIZE));
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Error saving tenaga:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Gagal menyimpan data',
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTenaga = async (index: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data tenaga kependidikan ini?')) {
      return;
    }

    try {
      const updated = tenagaList.filter((_, i) => i !== index);
      setTenagaList(updated);

      const updatedFormData = {
        ...formData,
        profil_tenaga_kependidikan: {
          ...formData.profil_tenaga_kependidikan,
          detail: updated,
        },
      };
      updateFormData('profil_tenaga_kependidikan', updatedFormData.profil_tenaga_kependidikan);

      // Save to database
      const response = await fetch('/api/sekolah/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus data');
      }

      toast({
        title: "Berhasil",
        description: "Data tenaga kependidikan berhasil dihapus",
      });

      const newTotalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
      setCurrentPage(prev => Math.min(prev, newTotalPages));
    } catch (err) {
      console.error("Error deleting tenaga:", err);
      toast({
        title: "Error",
        description: 'Gagal menghapus data',
        variant: "error",
      });
    }
  };

  const updateNewTenaga = (field: string, value: any) => {
    setNewTenaga(prev => ({ ...prev, [field]: value }));
  };

  // Calculate statistics
  const stats = {
    jenis_kelamin: {
      laki_laki: tenagaList.filter(t => t.jenis_kelamin === 'Laki-laki').length,
      perempuan: tenagaList.filter(t => t.jenis_kelamin === 'Perempuan').length,
    },
    status: {
      pns: tenagaList.filter(t => t.status === 'PNS').length,
      pppk: tenagaList.filter(t => t.status === 'PPPK').length,
      pppk_paruh_waktu: tenagaList.filter(t => t.status === 'PPPK paruh waktu').length,
      guru_tamu: tenagaList.filter(t => t.status === 'Guru Tamu').length,
      gty: tenagaList.filter(t => t.status === 'GTY').length,
      gtt: tenagaList.filter(t => t.status === 'GTT').length,
    },
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 text-center md:text-center">Statistik Tenaga Kependidikan</CardTitle>
          <CardDescription className="text-slate-600 text-center md:text-center">Ringkasan data tenaga kependidikan berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-white/80">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 w-[30%]">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 w-[50%]">Sub Kategori</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 w-[20%]">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/50">
                <tr>
                  <td rowSpan={2} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Jenis Kelamin</td>
                  <td className="px-6 py-3 text-sm text-slate-700">Laki-laki</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.jenis_kelamin.laki_laki}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Perempuan</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.jenis_kelamin.perempuan}</td>
                </tr>
                <tr>
                  <td rowSpan={6} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Status Kepegawaian</td>
                  <td className="px-6 py-3 text-sm text-slate-700">PNS</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.pns}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">PPPK</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.pppk}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">PPPK paruh waktu</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.pppk_paruh_waktu}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Guru Tamu</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.guru_tamu}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">GTY</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.gty}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">GTT</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.gtt}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* List View */}
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Daftar Profil Tenaga Kependidikan</CardTitle>
            <CardDescription className="text-slate-600">Daftar lengkap data tenaga kependidikan</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIP, atau tugas"
                className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-600 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
            <Button
              onClick={openAddModal}
              className="w-full rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300 sm:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Tambah Tenaga
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tenagaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-4">
                <Briefcase className="size-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-slate-600 mb-2">Belum ada data tenaga kependidikan</p>
              <p className="text-xs text-slate-500 text-center max-w-md">
                Klik tombol "Tambah Tenaga" di atas untuk menambahkan data tenaga kependidikan baru
              </p>
            </div>
          ) : filteredTenagaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
                <Search className="size-6 text-slate-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-2 text-center">Tidak ditemukan data tenaga kependidikan dengan kata kunci "{searchQuery}"</p>
              <p className="text-xs text-slate-500 text-center max-w-md">Coba gunakan kata kunci lain atau periksa kembali ejaan Anda.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedTenagaList.map((tenaga, indexInPage) => {
                  const overallIndex = (currentPage - 1) * PAGE_SIZE + indexInPage;
                  return (
                    <Card key={overallIndex} className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-sm">
                              {overallIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-bold text-slate-900 truncate">{tenaga.nama || 'Nama Tenaga Kependidikan'}</p>
                              <p className="text-xs text-slate-600 truncate">{tenaga.nip || 'NIP: -'}</p>
                              <p className="text-xs text-slate-500 truncate">{tenaga.tugas || 'Tugas: -'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 sm:gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewModal(overallIndex)}
                              className="h-9 w-9 rounded-full border border-green-100 bg-green-50 text-green-600 shadow-sm transition hover:bg-green-100 hover:text-green-700 sm:h-8 sm:w-8 sm:border-0 sm:bg-transparent sm:shadow-none"
                            >
                              <Eye className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setNewTenaga({ ...tenaga });
                                openEditModal(overallIndex);
                              }}
                              className="h-9 w-9 rounded-full border border-blue-100 bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100 hover:text-blue-700 sm:h-8 sm:w-8 sm:border-0 sm:bg-transparent sm:shadow-none"
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTenaga(overallIndex)}
                              className="h-9 w-9 rounded-full border border-red-100 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 hover:text-red-700 sm:h-8 sm:w-8 sm:border-0 sm:bg-transparent sm:shadow-none"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredTenagaList.length > PAGE_SIZE && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    Menampilkan {showingFrom} - {showingTo} dari {filteredTenagaList.length} tenaga kependidikan
                    {filteredTenagaList.length !== tenagaList.length && (
                      <span className="ml-1 text-[11px] text-slate-400">(total {tenagaList.length} tenaga)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronLeft className="mr-1 size-4" />
                      Sebelumnya
                    </Button>
                    <span className="text-xs font-semibold text-slate-600">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Berikutnya
                      <ChevronRight className="ml-1 size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedTenagaIndex(null);
          setNewTenaga(createEmptyTenaga());
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {isEditModalOpen ? 'Edit Data Tenaga Kependidikan' : 'Tambah Tenaga Kependidikan Baru'}
            </DialogTitle>
            <DialogDescription>
              {isEditModalOpen ? 'Perbarui data tenaga kependidikan yang sudah ada' : 'Isi data tenaga kependidikan baru di bawah ini'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nama Tenaga Kependidikan */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Nama Tenaga Kependidikan *</label>
              <input
                type="text"
                value={newTenaga.nama || ''}
                onChange={(e) => updateNewTenaga('nama', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                placeholder="Masukkan nama tenaga kependidikan"
              />
            </div>

            {/* Row 1: NIP, Tanggal Lahir, Jenis Kelamin */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">NIP</label>
                <input
                  type="text"
                  value={newTenaga.nip || ''}
                  onChange={(e) => updateNewTenaga('nip', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Nomor Induk Pegawai"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Tanggal Lahir</label>
                <input
                  type="date"
                  value={newTenaga.tanggal_lahir || ''}
                  onChange={(e) => updateNewTenaga('tanggal_lahir', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Jenis Kelamin</label>
                <select
                  value={newTenaga.jenis_kelamin || ''}
                  onChange={(e) => updateNewTenaga('jenis_kelamin', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            {/* Row 2: Status, Pendidikan, Tugas */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Status Kepegawaian</label>
                <select
                  value={newTenaga.status || ''}
                  onChange={(e) => updateNewTenaga('status', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Pilih Status</option>
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="PPPK paruh waktu">PPPK paruh waktu</option>
                  <option value="Guru Tamu">Guru Tamu</option>
                  <option value="GTY">GTY</option>
                  <option value="GTT">GTT</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Pendidikan</label>
                <input
                  type="text"
                  value={newTenaga.pendidikan || ''}
                  onChange={(e) => updateNewTenaga('pendidikan', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Tingkat pendidikan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Tugas</label>
                <input
                  type="text"
                  value={newTenaga.tugas || ''}
                  onChange={(e) => updateNewTenaga('tugas', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Tugas/jabatan"
                />
              </div>
            </div>

            {/* Tanggal Purna Tugas */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Tanggal Purna Tugas</label>
              <input
                type="date"
                value={newTenaga.tanggal_purna_tugas || ''}
                onChange={(e) => updateNewTenaga('tanggal_purna_tugas', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedTenagaIndex(null);
              }}
              disabled={isSaving}
              className="w-full rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 sm:w-auto"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveTenaga}
              disabled={isSaving || !newTenaga.nama}
              className="w-full rounded-full border-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Detail Data Tenaga Kependidikan</DialogTitle>
            <DialogDescription>Informasi lengkap data tenaga kependidikan</DialogDescription>
          </DialogHeader>

          {selectedTenagaIndex !== null && tenagaList[selectedTenagaIndex] && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nama</label>
                  <p className="text-sm font-medium text-slate-900">{tenagaList[selectedTenagaIndex].nama || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">NIP</label>
                  <p className="text-sm font-medium text-slate-900">{tenagaList[selectedTenagaIndex].nip || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tanggal Lahir</label>
                  <p className="text-sm font-medium text-slate-900">{tenagaList[selectedTenagaIndex].tanggal_lahir || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Jenis Kelamin</label>
                  <p className="text-sm font-medium text-slate-900">{tenagaList[selectedTenagaIndex].jenis_kelamin || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status Kepegawaian</label>
                  <p className="text-sm font-medium text-slate-900">{tenagaList[selectedTenagaIndex].status || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Pendidikan</label>
                  <p className="text-sm font-medium text-slate-900">{tenagaList[selectedTenagaIndex].pendidikan || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tugas</label>
                  <p className="text-sm font-medium text-slate-900">{tenagaList[selectedTenagaIndex].tugas || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tanggal Purna Tugas</label>
                  <p className="text-sm font-medium text-slate-900">{tenagaList[selectedTenagaIndex].tanggal_purna_tugas || '-'}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
              className="w-full rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 sm:w-auto"
            >
              Tutup
            </Button>
            {selectedTenagaIndex !== null && (
              <Button
                onClick={() => {
                  setNewTenaga({ ...tenagaList[selectedTenagaIndex] });
                  setIsViewModalOpen(false);
                  openEditModal(selectedTenagaIndex);
                }}
                className="w-full rounded-full border-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 hover:shadow-lg sm:w-auto"
              >
                <Edit className="size-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-0 bg-white/90 shadow-xl shadow-green-100/40">
        <CardHeader className="space-y-2">
          <CardTitle className="flex flex-wrap items-center gap-2 text-lg font-bold text-slate-900">
            <FileSpreadsheet className="size-5 text-green-600" />
            Import Cepat Tenaga Kependidikan
          </CardTitle>
          <CardDescription className="text-slate-600">
            Gunakan template Excel untuk menambahkan banyak tenaga kependidikan sekaligus secara rapi dan konsisten.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleDownloadTemplate}
                className="rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 hover:shadow-lg"
              >
                <Download className="mr-2 size-4" />
                Unduh Template Excel
              </Button>
              <Button
                type="button"
                onClick={handleOpenFileDialog}
                disabled={isImporting}
                className="rounded-full border border-emerald-100 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 size-4" />
                    Upload Data Tenaga
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImportTenaga}
              />
            </div>
            {importSummary && (
              <p className="text-sm font-semibold text-emerald-700">
                {importSummary}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
            <p className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
              <FileSpreadsheet className="size-4 text-emerald-600" />
              Panduan pengisian cepat
            </p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Unduh template dan buka dengan Excel, WPS Office, atau Google Sheets.</li>
              <li>Isi setiap kolom sesuai contoh. Gunakan pilihan seperti "PNS", "PPPK", "GTT" pada kolom status.</li>
              <li>Tulis tanggal dengan format <span className="font-semibold text-slate-900">YYYY-MM-DD</span> (contoh: 2024-01-15).</li>
              <li>Pada kolom tugas tambahan, pisahkan dengan koma. Contoh: <span className="font-semibold text-slate-900">waka, wali_kelas</span>.</li>
              <li>Simpan file lalu unggah kembali menggunakan tombol "Upload Data Tenaga" di atas.</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type SiswaForm = {
  nama: string;
  nis: string;
  nisn: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  kelas: string;
  status: string;
  alamat: string;
  nama_orang_tua: string;
  no_telepon: string;
};

const createEmptySiswa = (): SiswaForm => ({
  nama: '',
  nis: '',
  nisn: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  kelas: '',
  status: '',
  alamat: '',
  nama_orang_tua: '',
  no_telepon: '',
});

type NumericValue = number | null;

type JumlahSiswaRow = {
  id: string;
  kelas: string;
  jumlah_rombel: NumericValue;
  laki_laki: NumericValue;
  perempuan: NumericValue;
  abk_laki: NumericValue;
  abk_perempuan: NumericValue;
};

type JumlahSiswaSummary = {
  total_rombel: number;
  total_laki_laki: number;
  total_perempuan: number;
  total_siswa: number;
  total_abk_laki: number;
  total_abk_perempuan: number;
  total_abk: number;
};

type EkonomiOrangTuaRow = {
  id: string;
  kelas: string;
  p1: NumericValue;
  p2: NumericValue;
  p3: NumericValue;
  lebih_p3: NumericValue;
};

type PekerjaanOrangTuaRow = {
  id: string;
  jenis: string;
  jumlah: NumericValue;
};

type ProfilLulusanRow = {
  id: string;
  tahun: string;
  ptn_snbp: NumericValue;
  ptn_snbt: NumericValue;
  ptn_um: NumericValue;
  uin: NumericValue;
  pts: NumericValue;
  kedinasan_akmil: NumericValue;
  kedinasan_akpol: NumericValue;
  kedinasan_stan: NumericValue;
  kedinasan_stpdn: NumericValue;
  kedinasan_sttd: NumericValue;
  kedinasan_stis: NumericValue;
  kedinasan_lainnya: NumericValue;
  bekerja: NumericValue;
  belum_bekerja: NumericValue;
};

const generateRowId = () => (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
  ? crypto.randomUUID()
  : Math.random().toString(36).slice(2, 10));

const toNumericValue = (value: any): NumericValue => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const createJumlahSiswaRow = (kelas = ""): JumlahSiswaRow => ({
  id: generateRowId(),
  kelas,
  jumlah_rombel: null,
  laki_laki: null,
  perempuan: null,
  abk_laki: null,
  abk_perempuan: null,
});

const defaultJumlahSiswaRows = () => ["X", "XI", "XII"].map(createJumlahSiswaRow);

const createEkonomiRow = (kelas = ""): EkonomiOrangTuaRow => ({
  id: generateRowId(),
  kelas,
  p1: null,
  p2: null,
  p3: null,
  lebih_p3: null,
});

const defaultEkonomiRows = () => ["X", "XI", "XII"].map(createEkonomiRow);

const defaultPekerjaanRows = (): PekerjaanOrangTuaRow[] => [
  { id: generateRowId(), jenis: "ASN", jumlah: null },
  { id: generateRowId(), jenis: "TNI/POLRI", jumlah: null },
  { id: generateRowId(), jenis: "Swasta", jumlah: null },
  { id: generateRowId(), jenis: "Petani", jumlah: null },
  { id: generateRowId(), jenis: "Nelayan", jumlah: null },
  { id: generateRowId(), jenis: "Buruh Tani", jumlah: null },
  { id: generateRowId(), jenis: "Wirausaha", jumlah: null },
  { id: generateRowId(), jenis: "Lainnya", jumlah: null },
];

const createProfilLulusanRow = (tahun = ""): ProfilLulusanRow => ({
  id: generateRowId(),
  tahun,
  ptn_snbp: null,
  ptn_snbt: null,
  ptn_um: null,
  uin: null,
  pts: null,
  kedinasan_akmil: null,
  kedinasan_akpol: null,
  kedinasan_stan: null,
  kedinasan_stpdn: null,
  kedinasan_sttd: null,
  kedinasan_stis: null,
  kedinasan_lainnya: null,
  bekerja: null,
  belum_bekerja: null,
});

const defaultProfilLulusanRows = () => {
  const currentYear = new Date().getFullYear();
  return [createProfilLulusanRow(String(currentYear)), createProfilLulusanRow(String(currentYear + 1))];
};

const normalizeJumlahSiswaRows = (rows: any[]): JumlahSiswaRow[] => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return defaultJumlahSiswaRows();
  }

  return rows.map((row: any) => ({
    id: row?.id ?? generateRowId(),
    kelas: row?.kelas ?? "",
    jumlah_rombel: toNumericValue(row?.jumlah_rombel ?? row?.rombel ?? row?.jumlahRombel),
    laki_laki: toNumericValue(
      row?.laki_laki ?? row?.laki_laki ?? row?.jumlah_laki ?? row?.jumlahLaki ?? row?.laki
    ),
    perempuan: toNumericValue(
      row?.perempuan ?? row?.jumlah_perempuan ?? row?.jumlahPerempuan ?? row?.p ?? row?.perempuan_siswa
    ),
    abk_laki: toNumericValue(
      row?.abk_laki ?? row?.abkLaki ?? row?.abk_lk ?? row?.abk_lk_laki ?? row?.abk?.laki_laki
    ),
    abk_perempuan: toNumericValue(
      row?.abk_perempuan ?? row?.abkPerempuan ?? row?.abk_pr ?? row?.abk?.perempuan
    ),
  }));
};

const computeJumlahSiswaSummary = (rows: JumlahSiswaRow[]): JumlahSiswaSummary => {
  return rows.reduce(
    (acc, row) => {
      const rombel = row.jumlah_rombel ?? 0;
      const laki = row.laki_laki ?? 0;
      const perempuan = row.perempuan ?? 0;
      const abkLaki = row.abk_laki ?? 0;
      const abkPerempuan = row.abk_perempuan ?? 0;

      acc.total_rombel += rombel;
      acc.total_laki_laki += laki;
      acc.total_perempuan += perempuan;
      acc.total_siswa += laki + perempuan;
      acc.total_abk_laki += abkLaki;
      acc.total_abk_perempuan += abkPerempuan;
      acc.total_abk += abkLaki + abkPerempuan;

      return acc;
    },
    {
      total_rombel: 0,
      total_laki_laki: 0,
      total_perempuan: 0,
      total_siswa: 0,
      total_abk_laki: 0,
      total_abk_perempuan: 0,
      total_abk: 0,
    },
  );
};

const normalizeEkonomiRows = (rows: any[]): EkonomiOrangTuaRow[] => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return defaultEkonomiRows();
  }

  return rows.map((row: any) => ({
    id: row?.id ?? generateRowId(),
    kelas: row?.kelas ?? "",
    p1: toNumericValue(row?.p1 ?? row?.P1),
    p2: toNumericValue(row?.p2 ?? row?.P2),
    p3: toNumericValue(row?.p3 ?? row?.P3),
    lebih_p3: toNumericValue(row?.lebih_p3 ?? row?.lebihP3 ?? row?.diatas_p3 ?? row?.diatasP3),
  }));
};

const normalizePekerjaanRows = (rows: any[]): PekerjaanOrangTuaRow[] => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return defaultPekerjaanRows();
  }

  return rows.map((row: any) => ({
    id: row?.id ?? generateRowId(),
    jenis: row?.jenis ?? row?.nama ?? "",
    jumlah: toNumericValue(row?.jumlah ?? row?.total ?? row?.value),
  }));
};

const normalizeProfilLulusanRows = (rows: any[]): ProfilLulusanRow[] => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return defaultProfilLulusanRows();
  }

  return rows.map((row: any) => ({
    id: row?.id ?? generateRowId(),
    tahun: row?.tahun ?? "",
    ptn_snbp: toNumericValue(row?.ptn_snbp ?? row?.snbp),
    ptn_snbt: toNumericValue(row?.ptn_snbt ?? row?.snbt),
    ptn_um: toNumericValue(row?.ptn_um ?? row?.um),
    uin: toNumericValue(row?.uin),
    pts: toNumericValue(row?.pts),
    kedinasan_akmil: toNumericValue(row?.kedinasan_akmil ?? row?.akmil),
    kedinasan_akpol: toNumericValue(row?.kedinasan_akpol ?? row?.akpol),
    kedinasan_stan: toNumericValue(row?.kedinasan_stan ?? row?.stan),
    kedinasan_stpdn: toNumericValue(row?.kedinasan_stpdn ?? row?.stpdn),
    kedinasan_sttd: toNumericValue(row?.kedinasan_sttd ?? row?.sttd),
    kedinasan_stis: toNumericValue(row?.kedinasan_stis ?? row?.stis),
    kedinasan_lainnya: toNumericValue(row?.kedinasan_lainnya ?? row?.kedinasanLainnya),
    bekerja: toNumericValue(row?.bekerja),
    belum_bekerja: toNumericValue(
      row?.belum_bekerja ?? row?.belumBekerja ?? row?.belum_bekerja_melanjutkan ?? row?.belum
    ),
  }));
};

const formatNumber = (value: NumericValue, options: Intl.NumberFormatOptions = {}) => {
  if (value === null || value === undefined) {
    return "-";
  }
  return new Intl.NumberFormat("id-ID", options).format(value);
};

function ProfilSiswaTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  const { toast } = useToast();
  const [siswaList, setSiswaList] = useState<any[]>(formData.profil_siswa?.detail || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSiswaIndex, setSelectedSiswaIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [newSiswa, setNewSiswa] = useState<SiswaForm>(createEmptySiswa());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [jumlahSiswaRows, setJumlahSiswaRows] = useState<JumlahSiswaRow[]>(defaultJumlahSiswaRows());
  const [ekonomiRows, setEkonomiRows] = useState<EkonomiOrangTuaRow[]>(defaultEkonomiRows());
  const [pekerjaanRows, setPekerjaanRows] = useState<PekerjaanOrangTuaRow[]>(defaultPekerjaanRows());
  const [profilLulusanRows, setProfilLulusanRows] = useState<ProfilLulusanRow[]>(defaultProfilLulusanRows());
  const [isSavingJumlahSiswa, setIsSavingJumlahSiswa] = useState(false);
  const [isSavingEkonomi, setIsSavingEkonomi] = useState(false);
  const [isSavingPekerjaan, setIsSavingPekerjaan] = useState(false);
  const [isSavingProfilLulusan, setIsSavingProfilLulusan] = useState(false);
  const [showFormJumlahSiswa, setShowFormJumlahSiswa] = useState(false);
  const [showFormEkonomi, setShowFormEkonomi] = useState(false);
  const [showFormPekerjaan, setShowFormPekerjaan] = useState(false);
  const [showFormProfilLulusan, setShowFormProfilLulusan] = useState(false);
  const PAGE_SIZE = 6;

  const jumlahSiswaSummary = computeJumlahSiswaSummary(jumlahSiswaRows);

  // Load data when form is opened
  useEffect(() => {
    if (showFormJumlahSiswa && formData.profil_siswa?.jumlah_siswa?.per_kelas?.length > 0) {
      const rows = normalizeJumlahSiswaRows(formData.profil_siswa.jumlah_siswa.per_kelas);
      setJumlahSiswaRows(rows.length > 0 ? rows : defaultJumlahSiswaRows());
    } else if (!showFormJumlahSiswa) {
      setJumlahSiswaRows(defaultJumlahSiswaRows());
    }
  }, [showFormJumlahSiswa, formData.profil_siswa?.jumlah_siswa]);

  useEffect(() => {
    if (showFormEkonomi && formData.profil_siswa?.ekonomi_orang_tua?.per_kelas?.length > 0) {
      const rows = normalizeEkonomiRows(formData.profil_siswa.ekonomi_orang_tua.per_kelas);
      setEkonomiRows(rows.length > 0 ? rows : defaultEkonomiRows());
    } else if (!showFormEkonomi) {
      setEkonomiRows(defaultEkonomiRows());
    }
  }, [showFormEkonomi, formData.profil_siswa?.ekonomi_orang_tua]);

  useEffect(() => {
    if (showFormPekerjaan && formData.profil_siswa?.pekerjaan_orang_tua?.length > 0) {
      const rows = normalizePekerjaanRows(formData.profil_siswa.pekerjaan_orang_tua);
      setPekerjaanRows(rows.length > 0 ? rows : defaultPekerjaanRows());
    } else if (!showFormPekerjaan) {
      setPekerjaanRows(defaultPekerjaanRows());
    }
  }, [showFormPekerjaan, formData.profil_siswa?.pekerjaan_orang_tua]);

  useEffect(() => {
    if (showFormProfilLulusan && formData.profil_siswa?.profil_lulusan?.per_tahun?.length > 0) {
      const rows = normalizeProfilLulusanRows(formData.profil_siswa.profil_lulusan.per_tahun);
      setProfilLulusanRows(rows.length > 0 ? rows : defaultProfilLulusanRows());
    } else if (!showFormProfilLulusan) {
      setProfilLulusanRows(defaultProfilLulusanRows());
    }
  }, [showFormProfilLulusan, formData.profil_siswa?.profil_lulusan]);

  const updateJumlahSiswaRow = (rowId: string, field: keyof JumlahSiswaRow, value: string) => {
    setJumlahSiswaRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
            ...row,
            [field]: field === "kelas" ? value : toNumericValue(value),
          }
          : row,
      ),
    );
  };

  const updateEkonomiRow = (rowId: string, field: keyof EkonomiOrangTuaRow, value: string) => {
    setEkonomiRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
            ...row,
            [field]: field === "kelas" ? value : toNumericValue(value),
          }
          : row,
      ),
    );
  };

  const updatePekerjaanRow = (rowId: string, field: keyof PekerjaanOrangTuaRow, value: string) => {
    setPekerjaanRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
            ...row,
            [field]: field === "jenis" ? value : toNumericValue(value),
          }
          : row,
      ),
    );
  };

  const updateProfilLulusanRow = (rowId: string, field: keyof ProfilLulusanRow, value: string) => {
    setProfilLulusanRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
            ...row,
            [field]: field === "tahun" ? value : toNumericValue(value),
          }
          : row,
      ),
    );
  };

  const persistProfilSiswa = async (payload: Record<string, any>, successMessage: string) => {
    const response = await fetch("/api/sekolah/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profil_siswa: payload }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Gagal menyimpan data profil siswa");
    }

    toast({
      title: "Berhasil",
      description: successMessage,
    });
  };

  async function handleJumlahSiswaSave() {
    const sanitizedRows = jumlahSiswaRows.map((row) => {
      const kelas = row.kelas?.trim() || "";
      const laki = row.laki_laki ?? 0;
      const perempuan = row.perempuan ?? 0;
      const abkLaki = row.abk_laki ?? 0;
      const abkPerempuan = row.abk_perempuan ?? 0;

      return {
        kelas,
        jumlah_rombel: row.jumlah_rombel,
        laki_laki: row.laki_laki,
        perempuan: row.perempuan,
        jumlah: laki + perempuan,
        abk_laki: row.abk_laki,
        abk_perempuan: row.abk_perempuan,
        abk_jumlah: abkLaki + abkPerempuan,
      };
    });

    const updatedProfilSiswa = {
      ...(formData.profil_siswa || {}),
      jumlah_siswa: {
        per_kelas: sanitizedRows,
        total: {
          jumlah_rombel: jumlahSiswaSummary.total_rombel,
          laki_laki: jumlahSiswaSummary.total_laki_laki,
          perempuan: jumlahSiswaSummary.total_perempuan,
          jumlah: jumlahSiswaSummary.total_siswa,
          abk_laki: jumlahSiswaSummary.total_abk_laki,
          abk_perempuan: jumlahSiswaSummary.total_abk_perempuan,
          abk_jumlah: jumlahSiswaSummary.total_abk,
        },
      },
    };

    setIsSavingJumlahSiswa(true);
    updateFormData("profil_siswa", updatedProfilSiswa);

    try {
      await persistProfilSiswa(updatedProfilSiswa, "Data jumlah siswa berhasil disimpan");
    } catch (err) {
      console.error("Error saving jumlah siswa:", err);
      toast({
        title: "Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data",
        variant: "error",
      });
    } finally {
      setIsSavingJumlahSiswa(false);
    }
  }

  async function handleEkonomiSave() {
    const sanitizedRows = ekonomiRows.map((row) => ({
      kelas: row.kelas?.trim() || "",
      p1: row.p1,
      p2: row.p2,
      p3: row.p3,
      lebih_p3: row.lebih_p3,
    }));

    const updatedProfilSiswa = {
      ...(formData.profil_siswa || {}),
      ekonomi_orang_tua: {
        per_kelas: sanitizedRows,
      },
    };

    setIsSavingEkonomi(true);
    updateFormData("profil_siswa", updatedProfilSiswa);

    try {
      await persistProfilSiswa(updatedProfilSiswa, "Data ekonomi orang tua berhasil disimpan");
    } catch (err) {
      console.error("Error saving ekonomi orang tua:", err);
      toast({
        title: "Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data",
        variant: "error",
      });
    } finally {
      setIsSavingEkonomi(false);
    }
  }

  async function handlePekerjaanSave() {
    const sanitizedRows = pekerjaanRows
      .map((row) => ({
        jenis: row.jenis?.trim() || "",
        jumlah: row.jumlah,
      }))
      .filter((row) => row.jenis);

    const updatedProfilSiswa = {
      ...(formData.profil_siswa || {}),
      pekerjaan_orang_tua: {
        detail: sanitizedRows,
      },
    };

    setIsSavingPekerjaan(true);
    updateFormData("profil_siswa", updatedProfilSiswa);

    try {
      await persistProfilSiswa(updatedProfilSiswa, "Data pekerjaan orang tua berhasil disimpan");
    } catch (err) {
      console.error("Error saving pekerjaan orang tua:", err);
      toast({
        title: "Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data",
        variant: "error",
      });
    } finally {
      setIsSavingPekerjaan(false);
    }
  }

  async function handleProfilLulusanSave() {
    const sanitizedRows = profilLulusanRows
      .map((row) => ({
        tahun: row.tahun?.trim() || "",
        ptn_snbp: row.ptn_snbp,
        ptn_snbt: row.ptn_snbt,
        ptn_um: row.ptn_um,
        uin: row.uin,
        pts: row.pts,
        kedinasan_akmil: row.kedinasan_akmil,
        kedinasan_akpol: row.kedinasan_akpol,
        kedinasan_stan: row.kedinasan_stan,
        kedinasan_stpdn: row.kedinasan_stpdn,
        kedinasan_sttd: row.kedinasan_sttd,
        kedinasan_stis: row.kedinasan_stis,
        kedinasan_lainnya: row.kedinasan_lainnya,
        bekerja: row.bekerja,
        belum_bekerja: row.belum_bekerja,
      }))
      .filter((row) => row.tahun);

    const updatedProfilSiswa = {
      ...(formData.profil_siswa || {}),
      profil_lulusan: {
        per_tahun: sanitizedRows,
      },
    };

    setIsSavingProfilLulusan(true);
    updateFormData("profil_siswa", updatedProfilSiswa);

    try {
      await persistProfilSiswa(updatedProfilSiswa, "Data profil lulusan berhasil disimpan");
    } catch (err) {
      console.error("Error saving profil lulusan:", err);
      toast({
        title: "Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data",
        variant: "error",
      });
    } finally {
      setIsSavingProfilLulusan(false);
    }
  }

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredSiswaList = normalizedSearch
    ? siswaList.filter(siswa => {
      const combined = [
        siswa?.nama,
        siswa?.nis,
        siswa?.nisn,
        siswa?.kelas,
        siswa?.status,
        siswa?.nama_orang_tua,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return combined.includes(normalizedSearch);
    })
    : siswaList;

  const TEMPLATE_HEADERS = [
    "Nama",
    "NIS",
    "NISN",
    "Tanggal Lahir (YYYY-MM-DD)",
    "Jenis Kelamin (Laki-laki/Perempuan)",
    "Kelas",
    "Status",
    "Alamat",
    "Nama Orang Tua/Wali",
    "Nomor Telepon",
  ] as const;

  const totalPages = Math.max(1, Math.ceil(filteredSiswaList.length / PAGE_SIZE));
  const paginatedSiswaList = filteredSiswaList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const showingFrom = filteredSiswaList.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(currentPage * PAGE_SIZE, filteredSiswaList.length);

  useEffect(() => {
    if (formData.profil_siswa?.detail) {
      setSiswaList(formData.profil_siswa.detail);
      setCurrentPage(1);
    }

    const profil = formData.profil_siswa || {};

    const jumlahRows = normalizeJumlahSiswaRows(profil.jumlah_siswa?.per_kelas);
    setJumlahSiswaRows(jumlahRows);

    const ekonomiData = normalizeEkonomiRows(profil.ekonomi_orang_tua?.per_kelas);
    setEkonomiRows(ekonomiData);

    const pekerjaanData = normalizePekerjaanRows(
      profil.pekerjaan_orang_tua?.detail ?? profil.pekerjaan_orang_tua
    );
    setPekerjaanRows(pekerjaanData);

    const profilLulusanData = normalizeProfilLulusanRows(
      profil.profil_lulusan?.per_tahun ?? profil.profil_lulusan
    );
    setProfilLulusanRows(profilLulusanData);
  }, [formData.profil_siswa]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDownloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([Array.from(TEMPLATE_HEADERS)]);

    const exampleRow = [{
      Nama: "Ahmad Rahman",
      NIS: "11223344",
      NISN: "0045678910",
      "Tanggal Lahir (YYYY-MM-DD)": "2008-03-15",
      "Jenis Kelamin (Laki-laki/Perempuan)": "Laki-laki",
      "Kelas": "XI IPA 2",
      "Status": "Aktif",
      "Alamat": "Jl. Melati No. 10",
      "Nama Orang Tua/Wali": "Budi Rahman",
      "Nomor Telepon": "081234567890",
    }];

    XLSX.utils.sheet_add_json(worksheet, exampleRow, { origin: "A2", skipHeader: true });
    worksheet["!cols"] = TEMPLATE_HEADERS.map(() => ({ wch: 28 }));
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Siswa");
    XLSX.writeFile(workbook, "Template-Data-Siswa.xlsx");
  };

  const normalizeDateValue = (value: any) => {
    if (!value) return "";
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    if (typeof value === "number") {
      return XLSX.SSF.format("yyyy-mm-dd", value as number);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return "";
      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
      }
      return trimmed;
    }
    return "";
  };

  const handleImportSiswa = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportSummary(null);

    try {
      setIsImporting(true);
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

      if (workbook.SheetNames.length === 0) {
        throw new Error("File tidak memiliki data");
      }

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(firstSheet, {
        defval: "",
        raw: false,
      });

      if (rows.length === 0) {
        throw new Error("Tidak ada baris data yang ditemukan dalam file");
      }

      const mapped = rows
        .map(row => {
          const nama = String(row["Nama"] || "").trim();
          if (!nama) return null;

          const nis = String(row["NIS"] || "").trim();
          const nisn = String(row["NISN"] || "").trim();
          const tanggalLahir = normalizeDateValue(row["Tanggal Lahir (YYYY-MM-DD)"]);
          const jenisKelamin = String(row["Jenis Kelamin (Laki-laki/Perempuan)"] || "").trim();
          const kelas = String(row["Kelas"] || "").trim();
          const status = String(row["Status"] || "").trim();
          const alamat = String(row["Alamat"] || "").trim();
          const namaOrangTua = String(row["Nama Orang Tua/Wali"] || "").trim();
          const nomorTelepon = String(row["Nomor Telepon"] || "").trim();

          return {
            nama,
            nis,
            nisn,
            tanggal_lahir: tanggalLahir,
            jenis_kelamin: jenisKelamin,
            kelas,
            status,
            alamat,
            nama_orang_tua: namaOrangTua,
            no_telepon: nomorTelepon,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

      if (mapped.length === 0) {
        throw new Error("Tidak ada data siswa valid yang bisa diimpor. Pastikan kolom Nama terisi.");
      }

      const mergedList = [...siswaList, ...mapped];
      setSiswaList(mergedList);

      const updatedFormData = {
        ...formData,
        profil_siswa: {
          ...formData.profil_siswa,
          detail: mergedList,
        },
      };

      updateFormData('profil_siswa', updatedFormData.profil_siswa);

      const response = await fetch('/api/sekolah/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan hasil impor');
      }

      setCurrentPage(Math.max(1, Math.ceil(mergedList.length / PAGE_SIZE)));
      setImportSummary(`${mapped.length} data siswa berhasil ditambahkan dari file ${file.name}`);

      toast({
        title: "Berhasil",
        description: `${mapped.length} data siswa berhasil diimpor`,
      });
    } catch (err) {
      console.error('Error importing siswa:', err);
      toast({
        title: "Gagal mengimpor",
        description: err instanceof Error ? err.message : 'Terjadi kesalahan saat membaca file',
        variant: "error",
      });
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openAddModal = () => {
    setNewSiswa(createEmptySiswa());
    setIsAddModalOpen(true);
  };

  const openViewModal = (index: number) => {
    setSelectedSiswaIndex(index);
    setIsViewModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setSelectedSiswaIndex(index);
    setNewSiswa({ ...siswaList[index] });
    setIsEditModalOpen(true);
  };

  const handleSaveSiswa = async () => {
    try {
      setIsSaving(true);

      let updatedList: any[];
      if (selectedSiswaIndex !== null && isEditModalOpen) {
        // Edit existing siswa
        updatedList = siswaList.map((siswa, i) =>
          i === selectedSiswaIndex ? newSiswa : siswa
        );
      } else {
        // Add new siswa
        updatedList = [...siswaList, newSiswa];
      }

      setSiswaList(updatedList);

      // Update formData
      const updatedFormData = {
        ...formData,
        profil_siswa: {
          ...formData.profil_siswa,
          detail: updatedList,
        },
      };
      updateFormData('profil_siswa', updatedFormData.profil_siswa);

      // Save to database
      const response = await fetch('/api/sekolah/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan data');
      }

      const result = await response.json();

      toast({
        title: "Berhasil",
        description: selectedSiswaIndex !== null ? "Data siswa berhasil diperbarui" : "Data siswa berhasil ditambahkan",
      });

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedSiswaIndex(null);
      setNewSiswa(createEmptySiswa());

      const nextPage = selectedSiswaIndex !== null && isEditModalOpen
        ? currentPage
        : Math.max(1, Math.ceil(updatedList.length / PAGE_SIZE));
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Error saving siswa:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Gagal menyimpan data',
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSiswa = async (index: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      return;
    }

    try {
      const updated = siswaList.filter((_, i) => i !== index);
      setSiswaList(updated);

      const updatedFormData = {
        ...formData,
        profil_siswa: {
          ...formData.profil_siswa,
          detail: updated,
        },
      };
      updateFormData('profil_siswa', updatedFormData.profil_siswa);

      // Save to database
      const response = await fetch('/api/sekolah/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus data');
      }

      toast({
        title: "Berhasil",
        description: "Data siswa berhasil dihapus",
      });

      const newTotalPages = Math.max(1, Math.ceil(updated.length / PAGE_SIZE));
      setCurrentPage(prev => Math.min(prev, newTotalPages));
    } catch (err) {
      console.error("Error deleting siswa:", err);
      toast({
        title: "Error",
        description: 'Gagal menghapus data',
        variant: "error",
      });
    }
  };

  const updateNewSiswa = (field: string, value: any) => {
    setNewSiswa(prev => ({ ...prev, [field]: value }));
  };

  // Calculate statistics
  const stats = {
    jenis_kelamin: {
      laki_laki: siswaList.filter(s => s.jenis_kelamin === 'Laki-laki').length,
      perempuan: siswaList.filter(s => s.jenis_kelamin === 'Perempuan').length,
    },
    status: {
      aktif: siswaList.filter(s => s.status === 'Aktif').length,
      lulus: siswaList.filter(s => s.status === 'Lulus').length,
      pindah: siswaList.filter(s => s.status === 'Pindah').length,
      drop_out: siswaList.filter(s => s.status === 'Drop Out').length,
    },
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 text-center md:text-center">Statistik Profil Siswa</CardTitle>
          <CardDescription className="text-slate-600 text-center md:text-center">Ringkasan data siswa berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-white/80">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 w-[30%]">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 w-[50%]">Sub Kategori</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 w-[20%]">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/50">
                <tr>
                  <td rowSpan={2} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Jenis Kelamin</td>
                  <td className="px-6 py-3 text-sm text-slate-700">Laki-laki</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.jenis_kelamin.laki_laki}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Perempuan</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.jenis_kelamin.perempuan}</td>
                </tr>
                <tr>
                  <td rowSpan={4} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Status</td>
                  <td className="px-6 py-3 text-sm text-slate-700">Aktif</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.aktif}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Lulus</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.lulus}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Pindah</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.pindah}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Drop Out</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{stats.status.drop_out}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Jumlah Siswa Section */}
      <Card className="border-0 bg-white shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Jumlah Siswa per Kelas</CardTitle>
            <CardDescription className="text-slate-600">
              Isi jumlah siswa dan siswa berkebutuhan khusus per kelas secara berkala
            </CardDescription>
          </div>
          {!showFormJumlahSiswa && (
            <Button
              type="button"
              onClick={() => setShowFormJumlahSiswa(true)}
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-4 md:px-5 py-2.5 md:py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg"
            >
              <Plus className="mr-2 size-4" />
              {formData.profil_siswa?.jumlah_siswa?.per_kelas?.length > 0 ? "Edit Data" : "Tambah Data"}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!showFormJumlahSiswa ? (
            formData.profil_siswa?.jumlah_siswa?.per_kelas?.length > 0 ? (
              <div className="space-y-4">
                {/* Mobile Card View */}
                <div className="block md:hidden space-y-3">
                  {formData.profil_siswa.jumlah_siswa.per_kelas.map((row: any, index: number) => {
                    const total = (row.laki_laki ?? 0) + (row.perempuan ?? 0);
                    const abkTotal = (row.abk_laki ?? 0) + (row.abk_perempuan ?? 0);
                    return (
                      <div key={index} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                        <div className="font-semibold text-base text-slate-900 mb-3 pb-2 border-b border-slate-200">
                          {row.kelas || "-"}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-slate-500 text-xs mb-1">Jumlah Rombel</div>
                            <div className="font-medium text-slate-900">{formatNumber(row.jumlah_rombel)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs mb-1">Laki-laki</div>
                            <div className="font-medium text-slate-900">{formatNumber(row.laki_laki)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs mb-1">Perempuan</div>
                            <div className="font-medium text-slate-900">{formatNumber(row.perempuan)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs mb-1">Jumlah</div>
                            <div className="font-semibold text-slate-900">{formatNumber(total)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs mb-1">ABK Laki-laki</div>
                            <div className="font-medium text-slate-900">{formatNumber(row.abk_laki)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs mb-1">ABK Perempuan</div>
                            <div className="font-medium text-slate-900">{formatNumber(row.abk_perempuan)}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-slate-500 text-xs mb-1">ABK Jumlah</div>
                            <div className="font-semibold text-slate-900">{formatNumber(abkTotal)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {formData.profil_siswa.jumlah_siswa.total && (
                    <div className="bg-slate-50 rounded-lg border-2 border-slate-300 p-4 shadow-sm">
                      <div className="font-bold text-base text-slate-900 mb-3 pb-2 border-b-2 border-slate-300">
                        Total
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-slate-600 text-xs mb-1">Jumlah Rombel</div>
                          <div className="font-bold text-slate-900">{formatNumber(formData.profil_siswa.jumlah_siswa.total.jumlah_rombel)}</div>
                        </div>
                        <div>
                          <div className="text-slate-600 text-xs mb-1">Laki-laki</div>
                          <div className="font-bold text-slate-900">{formatNumber(formData.profil_siswa.jumlah_siswa.total.laki_laki)}</div>
                        </div>
                        <div>
                          <div className="text-slate-600 text-xs mb-1">Perempuan</div>
                          <div className="font-bold text-slate-900">{formatNumber(formData.profil_siswa.jumlah_siswa.total.perempuan)}</div>
                        </div>
                        <div>
                          <div className="text-slate-600 text-xs mb-1">Jumlah</div>
                          <div className="font-bold text-slate-900">{formatNumber(formData.profil_siswa.jumlah_siswa.total.jumlah)}</div>
                        </div>
                        <div>
                          <div className="text-slate-600 text-xs mb-1">ABK Laki-laki</div>
                          <div className="font-bold text-slate-900">{formatNumber(formData.profil_siswa.jumlah_siswa.total.abk_laki)}</div>
                        </div>
                        <div>
                          <div className="text-slate-600 text-xs mb-1">ABK Perempuan</div>
                          <div className="font-bold text-slate-900">{formatNumber(formData.profil_siswa.jumlah_siswa.total.abk_perempuan)}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-slate-600 text-xs mb-1">ABK Jumlah</div>
                          <div className="font-bold text-slate-900">{formatNumber(formData.profil_siswa.jumlah_siswa.total.abk_jumlah)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse min-w-[720px]">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Kelas</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Jumlah Rombel</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Laki-laki</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Perempuan</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Jumlah</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">ABK Laki-laki</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">ABK Perempuan</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">ABK Jumlah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.profil_siswa.jumlah_siswa.per_kelas.map((row: any, index: number) => {
                        const total = (row.laki_laki ?? 0) + (row.perempuan ?? 0);
                        const abkTotal = (row.abk_laki ?? 0) + (row.abk_perempuan ?? 0);
                        return (
                          <tr key={index} className="bg-white">
                            <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.kelas || "-"}</td>
                            <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.jumlah_rombel)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.laki_laki)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.perempuan)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700 text-center font-semibold">{formatNumber(total)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.abk_laki)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.abk_perempuan)}</td>
                            <td className="px-4 py-3 text-sm text-slate-700 text-center font-semibold">{formatNumber(abkTotal)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {formData.profil_siswa.jumlah_siswa.total && (
                      <tfoot>
                        <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                          <td className="px-4 py-3 text-sm text-slate-900">Total</td>
                          <td className="px-4 py-3 text-sm text-center text-slate-900">
                            {formatNumber(formData.profil_siswa.jumlah_siswa.total.jumlah_rombel)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-slate-900">
                            {formatNumber(formData.profil_siswa.jumlah_siswa.total.laki_laki)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-slate-900">
                            {formatNumber(formData.profil_siswa.jumlah_siswa.total.perempuan)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-slate-900">
                            {formatNumber(formData.profil_siswa.jumlah_siswa.total.jumlah)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-slate-900">
                            {formatNumber(formData.profil_siswa.jumlah_siswa.total.abk_laki)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-slate-900">
                            {formatNumber(formData.profil_siswa.jumlah_siswa.total.abk_perempuan)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-slate-900">
                            {formatNumber(formData.profil_siswa.jumlah_siswa.total.abk_jumlah)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-4">
                  <GraduationCap className="size-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-2">Belum ada data</p>
                <p className="text-xs text-slate-500 text-center max-w-md mb-4">
                  Klik tombol "Tambah Data" di atas untuk menambahkan data jumlah siswa per kelas
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFormJumlahSiswa(false)}
                  className="rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                >
                  <X className="mr-2 size-4" />
                  Tutup Form
                </Button>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  onClick={() =>
                    setJumlahSiswaRows((prev) => [...prev, createJumlahSiswaRow("")])
                  }
                  variant="outline"
                  className="rounded-full border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                >
                  <Plus className="mr-2 size-4" />
                  Tambah Kelas
                </Button>
                <Button
                  onClick={async () => {
                    await handleJumlahSiswaSave();
                    setShowFormJumlahSiswa(false);
                  }}
                  disabled={isSavingJumlahSiswa}
                  className="rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingJumlahSiswa ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      Simpan Data
                    </>
                  )}
                </Button>
              </div>
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <table className="w-full border-collapse min-w-[720px]">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-slate-50">
                      <th className="px-2 md:px-4 py-3 text-left text-xs font-bold text-slate-900">Kelas</th>
                      <th className="px-2 md:px-4 py-3 text-center text-xs font-bold text-slate-900">Jumlah Rombel</th>
                      <th className="px-2 md:px-4 py-3 text-center text-xs font-bold text-slate-900">Laki-laki</th>
                      <th className="px-2 md:px-4 py-3 text-center text-xs font-bold text-slate-900">Perempuan</th>
                      <th className="px-2 md:px-4 py-3 text-center text-xs font-bold text-slate-900">Jumlah</th>
                      <th className="px-2 md:px-4 py-3 text-center text-xs font-bold text-slate-900">ABK Laki-laki</th>
                      <th className="px-2 md:px-4 py-3 text-center text-xs font-bold text-slate-900">ABK Perempuan</th>
                      <th className="px-2 md:px-4 py-3 text-center text-xs font-bold text-slate-900">ABK Jumlah</th>
                      <th className="px-2 md:px-4 py-3 text-center text-xs font-bold text-slate-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jumlahSiswaRows.map((row) => {
                      const total = (row.laki_laki ?? 0) + (row.perempuan ?? 0);
                      const abkTotal = (row.abk_laki ?? 0) + (row.abk_perempuan ?? 0);

                      return (
                        <tr key={row.id} className="bg-white">
                          <td className="px-2 md:px-4 py-3 text-sm">
                            <input
                              type="text"
                              value={row.kelas}
                              onChange={(e) => updateJumlahSiswaRow(row.id, "kelas", e.target.value)}
                              placeholder="Contoh: X IPA 1"
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 md:px-3 py-2.5 md:py-2 text-sm md:text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 md:px-4 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.jumlah_rombel ?? ""}
                              onChange={(e) => updateJumlahSiswaRow(row.id, "jumlah_rombel", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 md:px-3 py-2.5 md:py-2 text-sm md:text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 md:px-4 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.laki_laki ?? ""}
                              onChange={(e) => updateJumlahSiswaRow(row.id, "laki_laki", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 md:px-3 py-2.5 md:py-2 text-sm md:text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 md:px-4 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.perempuan ?? ""}
                              onChange={(e) => updateJumlahSiswaRow(row.id, "perempuan", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 md:px-3 py-2.5 md:py-2 text-sm md:text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 md:px-4 py-3 text-sm text-center font-semibold text-slate-900">
                            {formatNumber(total)}
                          </td>
                          <td className="px-2 md:px-4 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.abk_laki ?? ""}
                              onChange={(e) => updateJumlahSiswaRow(row.id, "abk_laki", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 md:px-3 py-2.5 md:py-2 text-sm md:text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 md:px-4 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.abk_perempuan ?? ""}
                              onChange={(e) => updateJumlahSiswaRow(row.id, "abk_perempuan", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-2 md:px-3 py-2.5 md:py-2 text-sm md:text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 md:px-4 py-3 text-sm text-center font-semibold text-slate-900">
                            {formatNumber(abkTotal)}
                          </td>
                          <td className="px-2 md:px-4 py-3 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setJumlahSiswaRows((prev) =>
                                  prev.length > 1 ? prev.filter((item) => item.id !== row.id) : prev,
                                )
                              }
                              className="h-8 w-8 md:h-9 md:w-9 rounded-full border border-red-100 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 hover:text-red-700"
                            >
                              <Trash2 className="size-3 md:size-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                      <td className="px-4 py-3 text-sm text-slate-900">Total</td>
                      <td className="px-4 py-3 text-sm text-center text-slate-900">
                        {formatNumber(jumlahSiswaSummary.total_rombel)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-slate-900">
                        {formatNumber(jumlahSiswaSummary.total_laki_laki)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-slate-900">
                        {formatNumber(jumlahSiswaSummary.total_perempuan)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-slate-900">
                        {formatNumber(jumlahSiswaSummary.total_siswa)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-slate-900">
                        {formatNumber(jumlahSiswaSummary.total_abk_laki)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-slate-900">
                        {formatNumber(jumlahSiswaSummary.total_abk_perempuan)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-slate-900">
                        {formatNumber(jumlahSiswaSummary.total_abk)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Catatan: ABK (Anak Berkebutuhan Khusus) mencakup siswa dengan kebutuhan layanan pendidikan khusus.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ekonomi Orang Tua Section */}
      <Card className="border-0 bg-white shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Ekonomi Orang Tua</CardTitle>
            <CardDescription className="text-slate-600">
              Catat distribusi tingkat ekonomi orang tua siswa per kelas (P1 paling rendah)
            </CardDescription>
          </div>
          {!showFormEkonomi && (
            <Button
              type="button"
              onClick={() => setShowFormEkonomi(true)}
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-4 md:px-5 py-2.5 md:py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg"
            >
              <Plus className="mr-2 size-4" />
              {formData.profil_siswa?.ekonomi_orang_tua?.per_kelas?.length > 0 ? "Edit Data" : "Tambah Data"}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!showFormEkonomi ? (
            formData.profil_siswa?.ekonomi_orang_tua?.per_kelas?.length > 0 ? (
              <div className="space-y-4">
                {/* Mobile Card View */}
                <div className="block md:hidden space-y-3">
                  {formData.profil_siswa.ekonomi_orang_tua.per_kelas.map((row: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                      <div className="font-semibold text-base text-slate-900 mb-3 pb-2 border-b border-slate-200">
                        {row.kelas || "-"}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs mb-1">P1</div>
                          <div className="font-medium text-slate-900">{formatNumber(row.p1)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs mb-1">P2</div>
                          <div className="font-medium text-slate-900">{formatNumber(row.p2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs mb-1">P3</div>
                          <div className="font-medium text-slate-900">{formatNumber(row.p3)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs mb-1">&gt; P3</div>
                          <div className="font-medium text-slate-900">{formatNumber(row.lebih_p3)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse min-w-[560px]">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Kelas</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">P1</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">P2</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">P3</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">&gt; P3</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.profil_siswa.ekonomi_orang_tua.per_kelas.map((row: any, index: number) => (
                        <tr key={index} className="bg-white">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.kelas || "-"}</td>
                          <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.p1)}</td>
                          <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.p2)}</td>
                          <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.p3)}</td>
                          <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.lebih_p3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-4">
                  <Briefcase className="size-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-2">Belum ada data</p>
                <p className="text-xs text-slate-500 text-center max-w-md mb-4">
                  Klik tombol "Tambah Data" di atas untuk menambahkan data ekonomi orang tua
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFormEkonomi(false)}
                  className="rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                >
                  <X className="mr-2 size-4" />
                  Tutup Form
                </Button>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  onClick={() => setEkonomiRows((prev) => [...prev, createEkonomiRow("")])}
                  variant="outline"
                  className="rounded-full border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                >
                  <Plus className="mr-2 size-4" />
                  Tambah Kelas
                </Button>
                <Button
                  onClick={async () => {
                    await handleEkonomiSave();
                    setShowFormEkonomi(false);
                  }}
                  disabled={isSavingEkonomi}
                  className="rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingEkonomi ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      Simpan Data
                    </>
                  )}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[560px]">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Kelas</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">P1</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">P2</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">P3</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">&gt; P3</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ekonomiRows.map((row) => (
                      <tr key={row.id} className="bg-white">
                        <td className="px-4 py-3 text-sm">
                          <input
                            type="text"
                            value={row.kelas}
                            onChange={(e) => updateEkonomiRow(row.id, "kelas", e.target.value)}
                            placeholder="Contoh: X IPA 1"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <input
                            type="number"
                            min={0}
                            value={row.p1 ?? ""}
                            onChange={(e) => updateEkonomiRow(row.id, "p1", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <input
                            type="number"
                            min={0}
                            value={row.p2 ?? ""}
                            onChange={(e) => updateEkonomiRow(row.id, "p2", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <input
                            type="number"
                            min={0}
                            value={row.p3 ?? ""}
                            onChange={(e) => updateEkonomiRow(row.id, "p3", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <input
                            type="number"
                            min={0}
                            value={row.lebih_p3 ?? ""}
                            onChange={(e) => updateEkonomiRow(row.id, "lebih_p3", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setEkonomiRows((prev) =>
                                prev.length > 1 ? prev.filter((item) => item.id !== row.id) : prev,
                              )
                            }
                            className="h-9 w-9 rounded-full border border-red-100 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 hover:text-red-700"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pekerjaan Orang Tua Section */}
      <Card className="border-0 bg-white shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Pekerjaan Orang Tua</CardTitle>
            <CardDescription className="text-slate-600">
              Data jenis pekerjaan orang tua siswa untuk identifikasi kebutuhan dukungan
            </CardDescription>
          </div>
          {!showFormPekerjaan && (
            <Button
              type="button"
              onClick={() => setShowFormPekerjaan(true)}
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-4 md:px-5 py-2.5 md:py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg"
            >
              <Plus className="mr-2 size-4" />
              {((formData.profil_siswa?.pekerjaan_orang_tua?.detail ?? formData.profil_siswa?.pekerjaan_orang_tua)?.length || 0) > 0 ? "Edit Data" : "Tambah Data"}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!showFormPekerjaan ? (
            ((formData.profil_siswa?.pekerjaan_orang_tua?.detail ?? formData.profil_siswa?.pekerjaan_orang_tua)?.length || 0) > 0 ? (
              <div className="space-y-4">
                {/* Mobile Card View */}
                <div className="block md:hidden space-y-3">
                  {(formData.profil_siswa.pekerjaan_orang_tua.detail ?? formData.profil_siswa.pekerjaan_orang_tua).map((row: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-base text-slate-900">{row.jenis || "-"}</div>
                        <div className="text-right">
                          <div className="text-slate-500 text-xs mb-1">Jumlah</div>
                          <div className="font-bold text-lg text-slate-900">{formatNumber(row.jumlah)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse min-w-[420px]">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Jenis Pekerjaan</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Jumlah Orang Tua</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(formData.profil_siswa.pekerjaan_orang_tua.detail ?? formData.profil_siswa.pekerjaan_orang_tua).map((row: any, index: number) => (
                        <tr key={index} className="bg-white">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.jenis || "-"}</td>
                          <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.jumlah)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-4">
                  <User className="size-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-2">Belum ada data</p>
                <p className="text-xs text-slate-500 text-center max-w-md mb-4">
                  Klik tombol "Tambah Data" di atas untuk menambahkan data pekerjaan orang tua
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFormPekerjaan(false)}
                  className="rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                >
                  <X className="mr-2 size-4" />
                  Tutup Form
                </Button>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  onClick={() =>
                    setPekerjaanRows((prev) => [...prev, { id: generateRowId(), jenis: "", jumlah: null }])
                  }
                  variant="outline"
                  className="rounded-full border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                >
                  <Plus className="mr-2 size-4" />
                  Tambah Jenis Pekerjaan
                </Button>
                <Button
                  onClick={async () => {
                    await handlePekerjaanSave();
                    setShowFormPekerjaan(false);
                  }}
                  disabled={isSavingPekerjaan}
                  className="rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingPekerjaan ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      Simpan Data
                    </>
                  )}
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[420px]">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Jenis Pekerjaan</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Jumlah Orang Tua</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pekerjaanRows.map((row) => (
                      <tr key={row.id} className="bg-white">
                        <td className="px-4 py-3 text-sm">
                          <input
                            type="text"
                            value={row.jenis}
                            onChange={(e) => updatePekerjaanRow(row.id, "jenis", e.target.value)}
                            placeholder="Contoh: Wirausaha"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <input
                            type="number"
                            min={0}
                            value={row.jumlah ?? ""}
                            onChange={(e) => updatePekerjaanRow(row.id, "jumlah", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setPekerjaanRows((prev) =>
                                prev.length > 1 ? prev.filter((item) => item.id !== row.id) : prev,
                              )
                            }
                            className="h-9 w-9 rounded-full border border-red-100 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 hover:text-red-700"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profil Lulusan Section */}
      <Card className="border-0 bg-white shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Profil Lulusan</CardTitle>
            <CardDescription className="text-slate-600">
              Catat kelanjutan studi dan penempatan lulusan per tahun lulusan
            </CardDescription>
          </div>
          {!showFormProfilLulusan && (
            <Button
              type="button"
              onClick={() => setShowFormProfilLulusan(true)}
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-4 md:px-5 py-2.5 md:py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg"
            >
              <Plus className="mr-2 size-4" />
              {formData.profil_siswa?.profil_lulusan?.per_tahun?.length > 0 ? "Edit Data" : "Tambah Data"}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!showFormProfilLulusan ? (
            formData.profil_siswa?.profil_lulusan?.per_tahun?.length > 0 ? (
              <div className="space-y-4">
                {/* Mobile Card View */}
                <div className="block md:hidden space-y-4">
                  {formData.profil_siswa.profil_lulusan.per_tahun.map((row: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                      <div className="font-bold text-lg text-slate-900 mb-4 pb-2 border-b-2 border-slate-300">
                        Tahun {row.tahun || "-"}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="font-semibold text-sm text-slate-700 mb-2">PTN</div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <div className="text-slate-500 mb-1">SNBP</div>
                              <div className="font-medium text-slate-900">{formatNumber(row.ptn_snbp)}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 mb-1">SNBT</div>
                              <div className="font-medium text-slate-900">{formatNumber(row.ptn_snbt)}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 mb-1">UM</div>
                              <div className="font-medium text-slate-900">{formatNumber(row.ptn_um)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="font-semibold text-sm text-slate-700 mb-2">UIN</div>
                            <div className="font-medium text-base text-slate-900">{formatNumber(row.uin_jumlah)}</div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-700 mb-2">PTS</div>
                            <div className="font-medium text-base text-slate-900">{formatNumber(row.pts_jumlah)}</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-slate-700 mb-2">Kedinasan</div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <div className="text-slate-500 mb-1">Akmil</div>
                              <div className="font-medium text-slate-900">{formatNumber(row.kedinasan_akmil)}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 mb-1">Akpol</div>
                              <div className="font-medium text-slate-900">{formatNumber(row.kedinasan_akpol)}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 mb-1">STAN</div>
                              <div className="font-medium text-slate-900">{formatNumber(row.kedinasan_stan)}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 mb-1">STPDN</div>
                              <div className="font-medium text-slate-900">{formatNumber(row.kedinasan_stpdn)}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 mb-1">STTD</div>
                              <div className="font-medium text-slate-900">{formatNumber(row.kedinasan_sttd)}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 mb-1">STIS</div>
                              <div className="font-medium text-slate-900">{formatNumber(row.kedinasan_stis)}</div>
                            </div>
                            <div className="col-span-3">
                              <div className="text-slate-500 mb-1">Lainnya</div>
                              <div className="font-medium text-slate-900">{formatNumber(row.kedinasan_lainnya)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                          <div>
                            <div className="font-semibold text-sm text-slate-700 mb-2">Bekerja</div>
                            <div className="font-bold text-lg text-slate-900">{formatNumber(row.bekerja)}</div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-700 mb-2">Belum Bekerja/Melanjutkan</div>
                            <div className="font-bold text-lg text-slate-900">{formatNumber(row.belum_bekerja)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse min-w-[960px]">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th rowSpan={2} className="px-4 py-3 text-left text-xs font-bold text-slate-900 align-middle border-r border-slate-200 min-w-[100px]">
                          Tahun
                        </th>
                        <th colSpan={3} className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                          PTN
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                          UIN
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                          PTS
                        </th>
                        <th colSpan={7} className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                          Kedinasan
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                          Bekerja
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">
                          Belum Bekerja/Melanjutkan
                        </th>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">SNBP</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">SNBT</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200">
                          UM
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200">
                          Jumlah
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200">
                          Jumlah
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Akmil</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Akpol</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">STAN</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">STPDN</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">STTD</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">STIS</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200">
                          Lainnya
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200">
                          Jumlah
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">
                          Jumlah
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.profil_siswa.profil_lulusan.per_tahun.map((row: any, index: number) => (
                        <tr key={index} className="bg-white">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900 border-r border-slate-200 min-w-[100px]">{row.tahun || "-"}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center">{formatNumber(row.ptn_snbp)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center">{formatNumber(row.ptn_snbt)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center border-r border-slate-200">{formatNumber(row.ptn_um)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center border-r border-slate-200">{formatNumber(row.uin_jumlah)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center border-r border-slate-200">{formatNumber(row.pts_jumlah)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_akmil)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_akpol)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_stan)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_stpdn)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_sttd)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_stis)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center border-r border-slate-200">{formatNumber(row.kedinasan_lainnya)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center border-r border-slate-200">{formatNumber(row.bekerja)}</td>
                          <td className="px-2 py-3 text-sm text-slate-700 text-center">{formatNumber(row.belum_bekerja)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-4">
                  <Award className="size-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-2">Belum ada data</p>
                <p className="text-xs text-slate-500 text-center max-w-md mb-4">
                  Klik tombol "Tambah Data" di atas untuk menambahkan data profil lulusan
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFormProfilLulusan(false)}
                  className="rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                >
                  <X className="mr-2 size-4" />
                  Tutup Form
                </Button>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  onClick={() =>
                    setProfilLulusanRows((prev) => [...prev, createProfilLulusanRow("")])
                  }
                  variant="outline"
                  className="rounded-full border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                >
                  <Plus className="mr-2 size-4" />
                  Tambah Tahun
                </Button>
                <Button
                  onClick={async () => {
                    await handleProfilLulusanSave();
                    setShowFormProfilLulusan(false);
                  }}
                  disabled={isSavingProfilLulusan}
                  className="rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingProfilLulusan ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      Simpan Data
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-4">
                {/* Mobile Card View for Form */}
                <div className="block md:hidden space-y-4">
                  {profilLulusanRows.map((row) => (
                    <div key={row.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setProfilLulusanRows((prev) =>
                            prev.length > 1 ? prev.filter((item) => item.id !== row.id) : prev,
                          )
                        }
                        className="absolute top-2 right-2 h-8 w-8 rounded-full border border-red-100 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 hover:text-red-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>

                      <div className="mb-4 pr-10">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Lulusan</label>
                        <input
                          type="text"
                          value={row.tahun}
                          onChange={(e) => updateProfilLulusanRow(row.id, "tahun", e.target.value)}
                          placeholder="Contoh: 2024"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <label className="block text-sm font-bold text-slate-800 mb-2">PTN</label>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">SNBP</label>
                              <input
                                type="number" min={0} value={row.ptn_snbp ?? ""}
                                onChange={(e) => updateProfilLulusanRow(row.id, "ptn_snbp", e.target.value)}
                                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">SNBT</label>
                              <input
                                type="number" min={0} value={row.ptn_snbt ?? ""}
                                onChange={(e) => updateProfilLulusanRow(row.id, "ptn_snbt", e.target.value)}
                                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">UM</label>
                              <input
                                type="number" min={0} value={row.ptn_um ?? ""}
                                onChange={(e) => updateProfilLulusanRow(row.id, "ptn_um", e.target.value)}
                                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <label className="block text-sm font-bold text-slate-800 mb-2">UIN</label>
                            <input
                              type="number" min={0} value={row.uin ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "uin", e.target.value)}
                              className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                            />
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <label className="block text-sm font-bold text-slate-800 mb-2">PTS</label>
                            <input
                              type="number" min={0} value={row.pts ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "pts", e.target.value)}
                              className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                            />
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <label className="block text-sm font-bold text-slate-800 mb-2">Kedinasan</label>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">Akmil</label>
                              <input
                                type="number" min={0} value={row.kedinasan_akmil ?? ""}
                                onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_akmil", e.target.value)}
                                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">Akpol</label>
                              <input
                                type="number" min={0} value={row.kedinasan_akpol ?? ""}
                                onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_akpol", e.target.value)}
                                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">STAN</label>
                              <input
                                type="number" min={0} value={row.kedinasan_stan ?? ""}
                                onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_stan", e.target.value)}
                                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">STPDN</label>
                              <input
                                type="number" min={0} value={row.kedinasan_stpdn ?? ""}
                                onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_stpdn", e.target.value)}
                                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">STTD</label>
                              <input
                                type="number" min={0} value={row.kedinasan_sttd ?? ""}
                                onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_sttd", e.target.value)}
                                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">STIS</label>
                              <input
                                type="number" min={0} value={row.kedinasan_stis ?? ""}
                                onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_stis", e.target.value)}
                                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                              />
                            </div>
                            <div className="col-span-3">
                              <label className="block text-xs text-slate-500 mb-1">Lainnya</label>
                              <input
                                type="number" min={0} value={row.kedinasan_lainnya ?? ""}
                                onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_lainnya", e.target.value)}
                                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="block text-sm font-bold text-slate-800 mb-2">Bekerja</label>
                            <input
                              type="number" min={0} value={row.bekerja ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "bekerja", e.target.value)}
                              className="w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1">Belum Bekerja / Lanjut</label>
                            <input
                              type="number" min={0} value={row.belum_bekerja ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "belum_bekerja", e.target.value)}
                              className="w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse min-w-[960px]">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th rowSpan={2} className="px-4 py-3 text-left text-xs font-bold text-slate-900 align-middle border-r border-slate-200 min-w-[100px]">
                          Tahun
                        </th>
                        <th colSpan={3} className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                          PTN
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                          UIN
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                          PTS
                        </th>
                        <th colSpan={7} className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                          Kedinasan
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                          Bekerja
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">
                          Belum Bekerja/Melanjutkan
                        </th>
                        <th rowSpan={2} className="px-4 py-3 text-center text-xs font-bold text-slate-900 align-middle">
                          Aksi
                        </th>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">SNBP</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">SNBT</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200">
                          UM
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200">
                          Jumlah
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200">
                          Jumlah
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Akmil</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Akpol</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">STAN</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">STPDN</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">STTD</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">STIS</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200">
                          Lainnya
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200">
                          Jumlah
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">
                          Jumlah
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {profilLulusanRows.map((row) => (
                        <tr key={row.id} className="bg-white">
                          <td className="px-4 py-3 text-sm">
                            <input
                              type="text"
                              value={row.tahun}
                              onChange={(e) => updateProfilLulusanRow(row.id, "tahun", e.target.value)}
                              placeholder="Contoh: 2024"
                              className="w-full min-w-[80px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.ptn_snbp ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "ptn_snbp", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.ptn_snbt ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "ptn_snbt", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center border-r border-slate-200">
                            <input
                              type="number"
                              min={0}
                              value={row.ptn_um ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "ptn_um", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center border-r border-slate-200">
                            <input
                              type="number"
                              min={0}
                              value={row.uin ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "uin", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center border-r border-slate-200">
                            <input
                              type="number"
                              min={0}
                              value={row.pts ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "pts", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.kedinasan_akmil ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_akmil", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.kedinasan_akpol ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_akpol", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.kedinasan_stan ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_stan", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.kedinasan_stpdn ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_stpdn", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.kedinasan_sttd ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_sttd", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.kedinasan_stis ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_stis", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center border-r border-slate-200">
                            <input
                              type="number"
                              min={0}
                              value={row.kedinasan_lainnya ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "kedinasan_lainnya", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center border-r border-slate-200">
                            <input
                              type="number"
                              min={0}
                              value={row.bekerja ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "bekerja", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-2 py-3 text-sm text-center">
                            <input
                              type="number"
                              min={0}
                              value={row.belum_bekerja ?? ""}
                              onChange={(e) => updateProfilLulusanRow(row.id, "belum_bekerja", e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setProfilLulusanRows((prev) =>
                                  prev.length > 1 ? prev.filter((item) => item.id !== row.id) : prev,
                                )
                              }
                              className="h-9 w-9 rounded-full border border-red-100 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 hover:text-red-700"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* List View */}
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Daftar Profil Siswa</CardTitle>
            <CardDescription className="text-slate-600">Daftar lengkap data siswa</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIS, NISN, atau kelas"
                className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-600 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
            <Button
              onClick={openAddModal}
              className="w-full rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300 sm:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Tambah Siswa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {siswaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-4">
                <GraduationCap className="size-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-slate-600 mb-2">Belum ada data siswa</p>
              <p className="text-xs text-slate-500 text-center max-w-md">
                Klik tombol "Tambah Siswa" di atas untuk menambahkan data siswa baru
              </p>
            </div>
          ) : filteredSiswaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
                <Search className="size-6 text-slate-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-2 text-center">Tidak ditemukan data siswa dengan kata kunci "{searchQuery}"</p>
              <p className="text-xs text-slate-500 text-center max-w-md">Silakan periksa kembali kata kunci atau gunakan istilah lain.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedSiswaList.map((siswa, indexInPage) => {
                  const overallIndex = (currentPage - 1) * PAGE_SIZE + indexInPage;
                  return (
                    <Card key={overallIndex} className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-sm">
                              {overallIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-bold text-slate-900 truncate">{siswa.nama || 'Nama Siswa'}</p>
                              <p className="text-xs text-slate-600 truncate">{siswa.nis || 'NIS: -'}</p>
                              <p className="text-xs text-slate-500 truncate">{siswa.kelas || 'Kelas: -'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 sm:gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewModal(overallIndex)}
                              className="h-9 w-9 rounded-full border border-green-100 bg-green-50 text-green-600 shadow-sm transition hover:bg-green-100 hover:text-green-700 sm:h-8 sm:w-8 sm:border-0 sm:bg-transparent sm:shadow-none"
                            >
                              <Eye className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setNewSiswa({ ...siswa });
                                openEditModal(overallIndex);
                              }}
                              className="h-9 w-9 rounded-full border border-blue-100 bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100 hover:text-blue-700 sm:h-8 sm:w-8 sm:border-0 sm:bg-transparent sm:shadow-none"
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSiswa(overallIndex)}
                              className="h-9 w-9 rounded-full border border-red-100 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 hover:text-red-700 sm:h-8 sm:w-8 sm:border-0 sm:bg-transparent sm:shadow-none"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredSiswaList.length > PAGE_SIZE && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    Menampilkan {showingFrom} - {showingTo} dari {filteredSiswaList.length} siswa
                    {filteredSiswaList.length !== siswaList.length && (
                      <span className="ml-1 text-[11px] text-slate-400">(total {siswaList.length} siswa)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronLeft className="mr-1 size-4" />
                      Sebelumnya
                    </Button>
                    <span className="text-xs font-semibold text-slate-600">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Berikutnya
                      <ChevronRight className="ml-1 size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedSiswaIndex(null);
          setNewSiswa(createEmptySiswa());
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {isEditModalOpen ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
            </DialogTitle>
            <DialogDescription>
              {isEditModalOpen ? 'Perbarui data siswa yang sudah ada' : 'Isi data siswa baru di bawah ini'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nama Siswa */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Nama Siswa *</label>
              <input
                type="text"
                value={newSiswa.nama || ''}
                onChange={(e) => updateNewSiswa('nama', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                placeholder="Masukkan nama siswa"
              />
            </div>

            {/* Row 1: NIS, NISN, Tanggal Lahir */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">NIS</label>
                <input
                  type="text"
                  value={newSiswa.nis || ''}
                  onChange={(e) => updateNewSiswa('nis', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Nomor Induk Siswa"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">NISN</label>
                <input
                  type="text"
                  value={newSiswa.nisn || ''}
                  onChange={(e) => updateNewSiswa('nisn', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Nomor Induk Siswa Nasional"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Tanggal Lahir</label>
                <input
                  type="date"
                  value={newSiswa.tanggal_lahir || ''}
                  onChange={(e) => updateNewSiswa('tanggal_lahir', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Row 2: Jenis Kelamin, Kelas, Status */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Jenis Kelamin</label>
                <select
                  value={newSiswa.jenis_kelamin || ''}
                  onChange={(e) => updateNewSiswa('jenis_kelamin', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Kelas</label>
                <input
                  type="text"
                  value={newSiswa.kelas || ''}
                  onChange={(e) => updateNewSiswa('kelas', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Contoh: X IPA 1, XI IPS 2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Status</label>
                <select
                  value={newSiswa.status || ''}
                  onChange={(e) => updateNewSiswa('status', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Pilih Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Lulus">Lulus</option>
                  <option value="Pindah">Pindah</option>
                  <option value="Drop Out">Drop Out</option>
                </select>
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Alamat</label>
              <textarea
                value={newSiswa.alamat || ''}
                onChange={(e) => updateNewSiswa('alamat', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 min-h-[80px]"
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            {/* Row 3: Nama Orang Tua, No. Telepon */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Nama Orang Tua/Wali</label>
                <input
                  type="text"
                  value={newSiswa.nama_orang_tua || ''}
                  onChange={(e) => updateNewSiswa('nama_orang_tua', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Nama orang tua atau wali"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">No. Telepon</label>
                <input
                  type="text"
                  value={newSiswa.no_telepon || ''}
                  onChange={(e) => updateNewSiswa('no_telepon', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  placeholder="Nomor telepon orang tua/wali"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedSiswaIndex(null);
              }}
              disabled={isSaving}
              className="w-full rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 sm:w-auto"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveSiswa}
              disabled={isSaving || !newSiswa.nama}
              className="w-full rounded-full border-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Detail Data Siswa</DialogTitle>
            <DialogDescription>Informasi lengkap data siswa</DialogDescription>
          </DialogHeader>

          {selectedSiswaIndex !== null && siswaList[selectedSiswaIndex] && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nama</label>
                  <p className="text-sm font-medium text-slate-900">{siswaList[selectedSiswaIndex].nama || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">NIS</label>
                  <p className="text-sm font-medium text-slate-900">{siswaList[selectedSiswaIndex].nis || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">NISN</label>
                  <p className="text-sm font-medium text-slate-900">{siswaList[selectedSiswaIndex].nisn || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tanggal Lahir</label>
                  <p className="text-sm font-medium text-slate-900">{siswaList[selectedSiswaIndex].tanggal_lahir || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Jenis Kelamin</label>
                  <p className="text-sm font-medium text-slate-900">{siswaList[selectedSiswaIndex].jenis_kelamin || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Kelas</label>
                  <p className="text-sm font-medium text-slate-900">{siswaList[selectedSiswaIndex].kelas || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</label>
                  <p className="text-sm font-medium text-slate-900">{siswaList[selectedSiswaIndex].status || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nama Orang Tua/Wali</label>
                  <p className="text-sm font-medium text-slate-900">{siswaList[selectedSiswaIndex].nama_orang_tua || '-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">No. Telepon</label>
                  <p className="text-sm font-medium text-slate-900">{siswaList[selectedSiswaIndex].no_telepon || '-'}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Alamat</label>
                  <p className="text-sm font-medium text-slate-900">{siswaList[selectedSiswaIndex].alamat || '-'}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
              className="w-full rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 sm:w-auto"
            >
              Tutup
            </Button>
            {selectedSiswaIndex !== null && (
              <Button
                onClick={() => {
                  setNewSiswa({ ...siswaList[selectedSiswaIndex] });
                  setIsViewModalOpen(false);
                  openEditModal(selectedSiswaIndex);
                }}
                className="w-full rounded-full border-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 hover:shadow-lg sm:w-auto"
              >
                <Edit className="size-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-0 bg-white/90 shadow-xl shadow-green-100/40">
        <CardHeader className="space-y-2">
          <CardTitle className="flex flex-wrap items-center gap-2 text-lg font-bold text-slate-900">
            <FileSpreadsheet className="size-5 text-green-600" />
            Import Cepat Data Siswa
          </CardTitle>
          <CardDescription className="text-slate-600">
            Unduh template Excel, isi data siswa secara massal, lalu unggah kembali untuk mempercepat pengisian.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleDownloadTemplate}
                className="rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 hover:shadow-lg"
              >
                <Download className="mr-2 size-4" />
                Unduh Template Excel
              </Button>
              <Button
                type="button"
                onClick={handleOpenFileDialog}
                disabled={isImporting}
                className="rounded-full border border-emerald-100 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 size-4" />
                    Upload Data Siswa
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImportSiswa}
              />
            </div>
            {importSummary && (
              <p className="text-sm font-semibold text-emerald-700">
                {importSummary}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
            <p className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
              <FileSpreadsheet className="size-4 text-emerald-600" />
              Panduan singkat pengisian
            </p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Unduh template dan isi kolom sesuai contoh yang tersedia.</li>
              <li>Gunakan format tanggal <span className="font-semibold text-slate-900">YYYY-MM-DD</span> agar sistem membaca dengan benar.</li>
              <li>Pilih status siswa seperti "Aktif", "Lulus", "Pindah", atau "Drop Out".</li>
              <li>Pastikan kolom NIS dan NISN hanya berisi angka tanpa spasi.</li>
              <li>Simpan file dan unggah melalui tombol "Upload Data Siswa" di atas.</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BrandingSekolahTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  const { toast } = useToast();

  const brandingOptions = [
    { id: "integritas", label: "Sekolah Berintegritas" },
    { id: "adiwiyata", label: "Sekolah Adiwiyata" },
    { id: "sadar-bencana", label: "Sekolah Sadar Bencana" },
    { id: "ramah-anak", label: "Sekolah Ramah Anak" },
    { id: "riset", label: "Sekolah Riset" },
    { id: "lifeskill", label: "Sekolah Lifeskill" },
    { id: "berkarakter", label: "Sekolah Berkarakter" },
    { id: "penghafal-quran", label: "Sekolah Penghafal Al Qur'an" },
    { id: "sehat", label: "Sekolah Sehat" },
    { id: "olahraga", label: "Sekolah Olah Raga" },
    { id: "leadership", label: "Sekolah Leadership" },
  ];

  const createDefaultBranding = () =>
    brandingOptions.map((option) => ({
      id: option.id,
      nama: option.label,
      status: false,
    }));

  const [brandingList, setBrandingList] = useState<any[]>(createDefaultBranding());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (formData.branding_sekolah?.detail) {
      const existing = Array.isArray(formData.branding_sekolah.detail) ? formData.branding_sekolah.detail : [];
      const merged = brandingOptions.map((option) => {
        const found = existing.find(
          (item: any) => item.id === option.id || item.nama === option.label,
        );
        return {
          id: option.id,
          nama: option.label,
          status: found ? Boolean(found.status ?? found.ada ?? found.value ?? found.ya) : false,
        };
      });
      setBrandingList(merged);
    } else {
      setBrandingList(createDefaultBranding());
    }
  }, [formData.branding_sekolah]);

  const toggleBranding = (id: string) => {
    setBrandingList((prev) =>
      prev.map((item: any) =>
        item.id === id ? { ...item, status: !item.status } : item,
      ),
    );
  };

  const handleSaveBranding = async () => {
    try {
      setIsSaving(true);

      updateFormData("branding_sekolah", {
        detail: brandingList,
      });

      const response = await fetch("/api/sekolah/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branding_sekolah: {
            detail: brandingList,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan branding sekolah");
      }

      toast({
        title: "Berhasil",
        description: "Data branding sekolah berhasil disimpan",
      });
    } catch (err) {
      console.error("Error saving branding sekolah:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal menyimpan data",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const totalAktif = brandingList.filter((item) => item.status).length;

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Branding Sekolah</CardTitle>
            <CardDescription className="text-slate-600">
              Pilih branding yang telah diterapkan di sekolah Anda
            </CardDescription>
          </div>
          <Badge className="rounded-full bg-white/80 text-green-700 border border-green-200 px-4 py-2 font-semibold">
            {totalAktif} Branding Aktif
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {brandingList.map((branding) => (
              <div
                key={branding.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm transition",
                  branding.status
                    ? "border-green-300 bg-white"
                    : "border-slate-200 bg-white/80 hover:border-green-200",
                )}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">{branding.nama}</span>
                  <span className="text-xs text-slate-500">
                    Tandai jika branding ini sudah berjalan di sekolah
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleBranding(branding.id)}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition",
                    branding.status
                      ? "bg-green-600 text-white shadow-md shadow-green-200/60 hover:bg-green-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  {branding.status ? "Ya" : "Tidak"}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveBranding}
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Simpan Branding
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KokurikulerTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  const { toast } = useToast();

  const kegiatanOptions = [
    { id: "7-kebiasaan", nama: "7 Kebiasaan Anak Indonesia Hebat" },
    { id: "projek-kolaboratif", nama: "Projek Kolaboratif Antar Mapel" },
    { id: "budaya-sekolah", nama: "Penguatan Budaya Sekolah" },
  ];
  const kelasList = ["X", "XI", "XII"];

  const createDefaultKokurikuler = () =>
    kegiatanOptions.map((item) => ({
      id: item.id,
      nama: item.nama,
      kelas: kelasList.reduce(
        (acc, kelas) => ({
          ...acc,
          [kelas]: false,
        }),
        {} as Record<string, boolean>,
      ),
    }));

  const [kokurikulerData, setKokurikulerData] = useState<any[]>(createDefaultKokurikuler());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (formData.kokurikuler?.detail) {
      const existing = Array.isArray(formData.kokurikuler.detail) ? formData.kokurikuler.detail : [];
      const merged = kegiatanOptions.map((item) => {
        const found = existing.find(
          (detail: any) => detail.id === item.id || detail.nama === item.nama,
        );
        const kelasData = kelasList.reduce(
          (acc, kelas) => ({
            ...acc,
            [kelas]: found ? Boolean(found.kelas?.[kelas]) : false,
          }),
          {} as Record<string, boolean>,
        );
        return {
          id: item.id,
          nama: item.nama,
          kelas: kelasData,
        };
      });
      setKokurikulerData(merged);
    } else {
      setKokurikulerData(createDefaultKokurikuler());
    }
  }, [formData.kokurikuler]);

  const toggleKelas = (kegiatanId: string, kelas: string) => {
    setKokurikulerData((prev) =>
      prev.map((item: any) => {
        if (item.id === kegiatanId) {
          return {
            ...item,
            kelas: {
              ...item.kelas,
              [kelas]: !item.kelas[kelas],
            },
          };
        }
        return item;
      }),
    );
  };

  const handleSaveKokurikuler = async () => {
    try {
      setIsSaving(true);

      const payload = {
        kokurikuler: {
          detail: kokurikulerData,
        },
      };

      updateFormData("kokurikuler", payload.kokurikuler);

      const response = await fetch("/api/sekolah/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan data kokurikuler");
      }

      toast({
        title: "Berhasil",
        description: "Data kokurikuler berhasil disimpan",
      });
    } catch (err) {
      console.error("Error saving kokurikuler:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal menyimpan data",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const totalAktif = kokurikulerData.reduce(
    (count, item) =>
      count +
      Object.values(item.kelas || {}).filter((value) => Boolean(value)).length,
    0,
  );

  const getToggleClasses = (isActive: boolean, extra?: string) =>
    cn(
      "flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition",
      isActive
        ? "bg-green-600 text-white shadow-md shadow-green-200/60 hover:bg-green-700"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200",
      extra,
    );

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Kokurikuler</CardTitle>
            <CardDescription className="text-slate-600">
              Tandai penyelenggaraan kegiatan kokurikuler di setiap tingkat kelas
            </CardDescription>
          </div>
          <Badge className="rounded-full bg-white/80 text-green-700 border border-green-200 px-4 py-2 font-semibold">
            {totalAktif} Kegiatan Aktif
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {kokurikulerData.map((kegiatan) => (
              <div
                key={kegiatan.id}
                className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{kegiatan.nama}</p>
                    <p className="text-xs text-slate-500">
                      Pilih kelas yang menjalankan kegiatan ini
                    </p>
                  </div>
                  <Badge className="rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 text-xs font-semibold">
                    {
                      Object.values(kegiatan.kelas || {}).filter(Boolean)
                        .length
                    }{" "}
                    kelas
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {kelasList.map((kelas) => (
                    <button
                      key={kelas}
                      type="button"
                      onClick={() => toggleKelas(kegiatan.id, kelas)}
                      className={getToggleClasses(Boolean(kegiatan.kelas?.[kelas]), "w-full")}
                    >
                      Kelas {kelas} • {kegiatan.kelas?.[kelas] ? "Ya" : "Tidak"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-white/80">
                  <th className="px-4 py-4 text-left text-sm font-bold text-slate-900">Jenis Kokurikuler</th>
                  {kelasList.map((kelas) => (
                    <th
                      key={kelas}
                      className="px-4 py-4 text-center text-sm font-bold text-slate-900"
                    >
                      Kelas {kelas}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/70">
                {kokurikulerData.map((kegiatan) => (
                  <tr key={kegiatan.id}>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {kegiatan.nama}
                    </td>
                    {kelasList.map((kelas) => (
                      <td key={kelas} className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleKelas(kegiatan.id, kelas)}
                          className={getToggleClasses(Boolean(kegiatan.kelas?.[kelas]), "mx-auto w-20")}
                        >
                          {kegiatan.kelas?.[kelas] ? "Ya" : "Tidak"}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveKokurikuler}
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Simpan Kokurikuler
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EkstrakurikulerTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  const { toast } = useToast();

  const ekstrakurikulerOptions = [
    "Pramuka",
    "Paskibra",
    "PKS",
    "Kesehatan Sekolah (UKS)",
    "Leadership",
    "Teater",
    "Kerawitan",
    "Paduan suara",
    "Band",
    "Seni Tari tradisional",
    "Seni Lukis",
    "Ketoprak",
    "Seni Pedalangan (Wayang)",
    "Wayang Orang",
    "Fotografi",
    "Perfilman",
    "Tari Modern (dance)",
    "Pencak Silat",
    "Taekwondo",
    "Karate",
    "Yudho",
    "Kempo",
    "Tinju",
    "Sepak Bola",
    "Bola Voley",
    "Tenis Meja",
    "Tenis Lapangan",
  ];

  const createDefaultEkstrakurikuler = () =>
    ekstrakurikulerOptions.map((nama, index) => ({
      id: `ekstra-${index}`,
      nama,
      ada: false,
      sifat: "",
      jumlah_peserta: "",
    }));

  const [ekstraData, setEkstraData] = useState<any[]>(createDefaultEkstrakurikuler());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (formData.ekstrakurikuler?.detail) {
      const existing = Array.isArray(formData.ekstrakurikuler.detail)
        ? formData.ekstrakurikuler.detail
        : [];

      const base = ekstrakurikulerOptions.map((nama, index) => {
        const optionId = `ekstra-${index}`;
        const found = existing.find(
          (item: any) => item.id === optionId || item.nama === nama,
        );

        return {
          id: found?.id || optionId,
          nama,
          ada: found
            ? Boolean(
              found.ada ??
              found.keberadaan ??
              (typeof found.status === "string"
                ? found.status.toLowerCase() === "ada"
                : found.status),
            )
            : false,
          sifat: found?.sifat || found?.kategori || "",
          jumlah_peserta: found?.jumlah_peserta ?? found?.jumlah ?? "",
        };
      });

      // Include custom activities that may have been added previously
      const customItems = existing.filter(
        (item: any) => !ekstrakurikulerOptions.includes(item.nama),
      );

      const merged = [...base, ...customItems];
      setEkstraData(merged);
    } else {
      setEkstraData(createDefaultEkstrakurikuler());
    }
  }, [formData.ekstrakurikuler]);

  const updateEkstra = (id: string, field: string, value: any) => {
    setEkstraData((prev) =>
      prev.map((item: any) =>
        item.id === id
          ? {
            ...item,
            [field]: value,
          }
          : item,
      ),
    );
  };

  const handleSaveEkstrakurikuler = async () => {
    try {
      setIsSaving(true);

      const payload = {
        ekstrakurikuler: {
          detail: ekstraData,
        },
      };

      updateFormData("ekstrakurikuler", payload.ekstrakurikuler);

      const response = await fetch("/api/sekolah/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan data ekstrakurikuler");
      }

      toast({
        title: "Berhasil",
        description: "Data ekstrakurikuler berhasil disimpan",
      });
    } catch (err) {
      console.error("Error saving ekstrakurikuler:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal menyimpan data",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const totalAda = ekstraData.filter((item) => Boolean(item.ada)).length;

  const getChipClass = (isActive: boolean, extra?: string) =>
    cn(
      "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition",
      isActive
        ? "bg-green-600 text-white shadow-md shadow-green-200/60 hover:bg-green-700"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200",
      extra,
    );

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Ekstrakurikuler</CardTitle>
            <CardDescription className="text-slate-600">
              Kelola ketersediaan, sifat, dan jumlah peserta kegiatan ekstrakurikuler
            </CardDescription>
          </div>
          <Badge className="rounded-full bg-white/80 text-green-700 border border-green-200 px-4 py-2 font-semibold">
            {totalAda} Kegiatan Tersedia
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {ekstraData.map((item, index) => (
              <div key={item.id || `${item.nama}-${index}`} className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.nama}</p>
                    <p className="text-xs text-slate-500">
                      Atur keberadaan, sifat, dan jumlah peserta kegiatan ini
                    </p>
                  </div>
                  <Badge className="rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 text-xs font-semibold">
                    #{index + 1}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateEkstra(item.id, "ada", !item.ada)}
                    className={getChipClass(Boolean(item.ada), "col-span-2")}
                  >
                    {item.ada ? "Ada" : "Tidak Ada"}
                  </button>
                  <label className="col-span-2 text-xs font-semibold text-slate-700">
                    Sifat
                  </label>
                  <select
                    value={item.sifat || ""}
                    onChange={(e) => updateEkstra(item.id, "sifat", e.target.value)}
                    className="col-span-2 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">Pilih</option>
                    <option value="Wajib">Wajib</option>
                    <option value="Pilihan">Pilihan</option>
                  </select>
                  <label className="col-span-2 text-xs font-semibold text-slate-700 mt-1">
                    Jumlah Peserta
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={item.jumlah_peserta ?? ""}
                    onChange={(e) => updateEkstra(item.id, "jumlah_peserta", e.target.value)}
                    className="col-span-2 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse min-w-[820px]">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-white/80">
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-900">
                    No.
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-900">
                    Jenis Ekstrakurikuler
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-900">
                    Keberadaan
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-900">
                    Sifat
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-900">
                    Jumlah Peserta
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/70">
                {ekstraData.map((item, index) => (
                  <tr key={item.id || `${item.nama}-${index}`}>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.nama}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => updateEkstra(item.id, "ada", !item.ada)}
                          className={getChipClass(Boolean(item.ada))}
                        >
                          {item.ada ? "Ada" : "Tidak"}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <select
                        value={item.sifat || ""}
                        onChange={(e) => updateEkstra(item.id, "sifat", e.target.value)}
                        className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                      >
                        <option value="">Pilih</option>
                        <option value="Wajib">Wajib</option>
                        <option value="Pilihan">Pilihan</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <input
                        type="number"
                        min={0}
                        value={item.jumlah_peserta ?? ""}
                        onChange={(e) => updateEkstra(item.id, "jumlah_peserta", e.target.value)}
                        className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                        placeholder="0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveEkstrakurikuler}
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Simpan Ekstrakurikuler
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RaporPendidikanTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  const { toast } = useToast();

  const indikatorList = [
    { id: "A.1", indikator: "Kemampuan Literasi" },
    { id: "A.2", indikator: "Kemampuan Numerasi" },
    { id: "A.3", indikator: "Karakter" },
    { id: "C.3", indikator: "Pengalaman Pelatihan PTK" },
    { id: "D.1", indikator: "Kualitas Pembelajaran" },
    { id: "D.2", indikator: "Refleksi dan perbaikan pembelajaran oleh guru" },
    { id: "D.3", indikator: "Kepemimpinan instruksional" },
    { id: "D.4", indikator: "Iklim keamanan satuan pendidikan" },
    { id: "D.6", indikator: "Iklim Kesetaraan Gender" },
    { id: "D.8", indikator: "Iklim Kebinekaan" },
    { id: "D.10", indikator: "Iklim Inklusivitas" },
    { id: "E.1", indikator: "Partisipasi warga satuan pendidikan" },
    { id: "E.2", indikator: "Proporsi pemanfaatan sumber daya sekolah untuk peningkatan mutu" },
    { id: "E.3", indikator: "Pemanfaatan TIK untuk pengelolaan anggaran" },
    { id: "E.5", indikator: "Program dan kebijakan satuan pendidikan" },
  ];

  const capaianOptions = ["Baik", "Sedang", "Kurang"];

  const createDefaultRapor = () =>
    indikatorList.map((item) => ({
      id: item.id,
      indikator: item.indikator,
      capaian: "",
      skor: "",
      catatan: "",
    }));

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([currentYear]);

  // Store all rapor data by year: { [year]: RaporItem[] }
  const [raporDataByYear, setRaporDataByYear] = useState<Record<number, any[]>>({
    [currentYear]: createDefaultRapor()
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isAddYearOpen, setIsAddYearOpen] = useState(false);
  const [newYearInput, setNewYearInput] = useState<string>("");

  useEffect(() => {
    if (formData.rapor_pendidikan?.detail) {
      const detail = formData.rapor_pendidikan.detail;

      // Check if data is using new format (array of objects with 'tahun')
      const isNewFormat = Array.isArray(detail) && detail.length > 0 && 'tahun' in detail[0];

      if (isNewFormat) {
        const years: number[] = [];
        const dataMap: Record<number, any[]> = {};

        detail.forEach((item: any) => {
          const year = Number(item.tahun);
          if (!years.includes(year)) {
            years.push(year);
          }

          // Reconstruct rapor items for this year
          // The item.data should contain the array of indicators
          if (item.data && Array.isArray(item.data)) {
            dataMap[year] = mergeWithDefault(item.data);
          } else {
            dataMap[year] = createDefaultRapor();
          }
        });

        years.sort((a, b) => b - a); // Sort descending
        setAvailableYears(years);
        setRaporDataByYear(dataMap);
        if (years.length > 0 && !years.includes(selectedYear)) {
          setSelectedYear(years[0]);
        }
      } else {
        // Legacy format: detail is just the array of indicators for arguably the "current" year or unknown year
        // We migrate it to the current year
        const merged = mergeWithDefault(Array.isArray(detail) ? detail : []);
        setAvailableYears([currentYear]);
        setRaporDataByYear({ [currentYear]: merged });
        setSelectedYear(currentYear);
      }
    } else {
      // No data, init with default
      setAvailableYears([currentYear]);
      setRaporDataByYear({ [currentYear]: createDefaultRapor() });
      setSelectedYear(currentYear);
    }
  }, [formData.rapor_pendidikan]);

  const mergeWithDefault = (existingItems: any[]) => {
    const merged = indikatorList.map((indikator) => {
      const found = existingItems.find(
        (item: any) => item.id === indikator.id || item.indikator === indikator.indikator,
      );

      return {
        id: indikator.id,
        indikator: indikator.indikator,
        capaian: found?.capaian || found?.hasil_capaian || "",
        skor: found?.skor ?? found?.skor_tahun_ini ?? "",
        catatan: found?.catatan || "",
      };
    });

    // include custom indikator if any
    const customItems = existingItems.filter(
      (item: any) =>
        !indikatorList.some(
          (indikator) => indikator.id === item.id || indikator.indikator === item.indikator,
        ),
    );

    return [...merged, ...customItems];
  }

  const updateRapor = (id: string, field: string, value: any) => {
    setRaporDataByYear((prev) => {
      const currentData = prev[selectedYear] || createDefaultRapor();
      const updatedData = currentData.map((item: any) =>
        item.id === id
          ? {
            ...item,
            [field]: value,
          }
          : item,
      );

      return {
        ...prev,
        [selectedYear]: updatedData
      };
    });
  };

  const handleAddYear = () => {
    const year = parseInt(newYearInput);
    if (isNaN(year) || year < 2000 || year > 2100) {
      toast({
        title: "Error",
        description: "Tahun tidak valid",
        variant: "error",
      });
      return;
    }

    if (availableYears.includes(year)) {
      toast({
        title: "Info",
        description: "Tahun sudah ada",
      });
      setSelectedYear(year);
      setIsAddYearOpen(false);
      return;
    }

    const newYears = [...availableYears, year].sort((a, b) => b - a);
    setAvailableYears(newYears);
    setRaporDataByYear(prev => ({
      ...prev,
      [year]: createDefaultRapor()
    }));
    setSelectedYear(year);
    setIsAddYearOpen(false);
    setNewYearInput("");

    toast({
      title: "Berhasil",
      description: `Tahun ${year} berhasil ditambahkan`,
    });
  };

  const handleSaveRapor = async () => {
    try {
      setIsSaving(true);

      // Convert map back to array format for storage
      // structure: [{ tahun: 2024, data: [...] }, { tahun: 2023, data: [...] }]
      const detailPayload = availableYears.map(year => ({
        tahun: year,
        data: raporDataByYear[year] || createDefaultRapor()
      }));

      const payload = {
        rapor_pendidikan: {
          detail: detailPayload,
        },
      };

      updateFormData("rapor_pendidikan", payload.rapor_pendidikan);

      const response = await fetch("/api/sekolah/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan rapor pendidikan");
      }

      toast({
        title: "Berhasil",
        description: "Data rapor pendidikan berhasil disimpan",
      });
    } catch (err) {
      console.error("Error saving rapor pendidikan:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal menyimpan data",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const currentRaporData = raporDataByYear[selectedYear] || createDefaultRapor();

  const capaianSummary = capaianOptions.map((status) => ({
    status,
    jumlah: currentRaporData.filter((item) => item.capaian === status).length,
  }));

  const getCapaianClass = (status: string, isActive: boolean) => {
    const base = "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition";
    if (!isActive)
      return cn(base, "bg-slate-100 text-slate-600");

    switch (status) {
      case "Baik":
        return cn(base, "bg-emerald-600 text-white shadow-md shadow-emerald-200/60");
      case "Sedang":
        return cn(base, "bg-amber-500 text-white shadow-md shadow-amber-200/60");
      case "Kurang":
        return cn(base, "bg-rose-500 text-white shadow-md shadow-rose-200/60");
      default:
        return cn(base, "bg-green-600 text-white");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Laporan Rapor Pendidikan</CardTitle>
              <CardDescription className="text-slate-600">
                Isi capaian dan skor indikator rapor pendidikan
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {capaianSummary.map((item) => (
                <Badge
                  key={item.status}
                  className="rounded-full bg-white/80 text-green-700 border border-green-200 px-3 py-1 text-xs font-semibold"
                >
                  {item.status}: {item.jumlah}
                </Badge>
              ))}
            </div>
          </div>

          {/* Year Selection */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-green-100/50">
            <span className="text-sm font-semibold text-slate-700 mr-2">Tahun Rapor:</span>
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  selectedYear === year
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : "bg-white text-slate-600 hover:bg-green-50 border border-transparent hover:border-green-100"
                )}
              >
                {year}
              </button>
            ))}

            <Dialog open={isAddYearOpen} onOpenChange={setIsAddYearOpen}>
              <button
                onClick={() => setIsAddYearOpen(true)}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <Plus className="size-3.5" />
                Tambah Tahun
              </button>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">Tambah Tahun Rapor</DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Masukkan tahun untuk membuat laporan rapor pendidikan baru.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 py-4">
                  <div className="grid flex-1 gap-2">
                    <label htmlFor="year" className="sr-only">
                      Tahun
                    </label>
                    <input
                      id="year"
                      type="number"
                      placeholder="Contoh: 2023"
                      value={newYearInput}
                      onChange={(e) => setNewYearInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddYearOpen(false)}
                    className="w-full rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 sm:w-auto"
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddYear}
                    disabled={!newYearInput}
                    className="w-full rounded-full border-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg sm:w-auto"
                  >
                    Tambah
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {currentRaporData.map((item) => (
              <div key={item.id} className="space-y-3 rounded-2xl border border-white bg-white/90 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">Indikator {item.id}</p>
                    <p className="text-sm font-semibold text-slate-900">{item.indikator}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {capaianOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateRapor(item.id, "capaian", status)}
                      className={getCapaianClass(status, item.capaian === status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Skor Tahun Ini</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={item.skor ?? ""}
                    onChange={(e) => updateRapor(item.id, "skor", e.target.value)}
                    className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Catatan (Opsional)</label>
                  <textarea
                    value={item.catatan || ""}
                    onChange={(e) => updateRapor(item.id, "catatan", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    rows={3}
                    placeholder="Tambahkan catatan jika diperlukan"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-white/80">
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-900">
                    No
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-900">
                    Indikator Utama
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-900">
                    Hasil Capaian
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-900">
                    Skor Tahun Ini
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-900">
                    Catatan (Opsional)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/70">
                {currentRaporData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-800">{item.indikator}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <select
                        value={item.capaian || ""}
                        onChange={(e) => updateRapor(item.id, "capaian", e.target.value)}
                        className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                      >
                        <option value="">Pilih capaian</option>
                        {capaianOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={item.skor ?? ""}
                        onChange={(e) => updateRapor(item.id, "skor", e.target.value)}
                        className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <textarea
                        value={item.catatan || ""}
                        onChange={(e) => updateRapor(item.id, "catatan", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                        rows={2}
                        placeholder="Tambahkan catatan jika diperlukan"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveRapor}
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Simpan Rapor Pendidikan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

