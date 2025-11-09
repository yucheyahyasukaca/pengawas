"use client";

import { useEffect, useState } from "react";
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
  Save,
  Plus,
  Trash2,
  Eye,
  Edit,
  X,
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

export default function SekolahProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sekolah, setSekolah] = useState<SekolahProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("identitas");
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<SekolahProfile>>({});

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

  useEffect(() => {
    checkApprovalAndLoad();
  }, []);

  const checkApprovalAndLoad = async () => {
    try {
      setIsLoading(true);
      
      // First check user approval status
      const userResponse = await fetch('/api/auth/get-current-user');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        const currentUser = userData.user;
        
        // Check approval status - redirect if not approved
        if (currentUser && currentUser.role === 'sekolah') {
          if (currentUser.status_approval !== 'approved') {
            router.replace('/sekolah/pending-approval');
            return;
          }
        }
      }
      
      // Load sekolah profile
      await loadSekolahProfile();
    } catch (err) {
      console.error("Error checking approval:", err);
      setIsLoading(false);
    }
  };

  const loadSekolahProfile = async () => {
    try {
      setError(null);

      const response = await fetch('/api/sekolah/profile');
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Sekolah tidak ditemukan. Hubungi admin untuk menghubungkan akun Anda dengan sekolah.');
        } else {
          throw new Error('Gagal memuat data sekolah');
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setSekolah(data);
      setFormData(data);
    } catch (err) {
      console.error("Error loading sekolah profile:", err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
    } finally {
      setIsLoading(false);
    }
  };

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
      setSekolah(result.data);
      
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

  if (error || !sekolah) {
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
                  {error || 'Sekolah tidak ditemukan'}
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
  updateFormData 
}: { 
  sekolah: SekolahProfile; 
  formData: Partial<SekolahProfile>;
  updateFormData: (field: string, value: any) => void;
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
      </CardContent>
    </Card>
  );
}

// Profil Guru Tab Component
function ProfilGuruTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  const { toast } = useToast();
  const [guruList, setGuruList] = useState<any[]>(formData.profil_guru?.detail || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGuruIndex, setSelectedGuruIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newGuru, setNewGuru] = useState<any>({
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
  
  useEffect(() => {
    if (formData.profil_guru?.detail) {
      setGuruList(formData.profil_guru.detail);
    }
  }, [formData.profil_guru]);

  const openAddModal = () => {
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
          <Button
            onClick={openAddModal}
            className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus className="size-4 mr-2" />
            Tambah Guru
          </Button>
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
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {guruList.map((guru, index) => (
                <Card key={index} className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-slate-900 truncate">{guru.nama || 'Nama Guru'}</p>
                          <p className="text-xs text-slate-600 truncate">{guru.nip || 'NIP: -'}</p>
                          <p className="text-xs text-slate-500 truncate">{guru.mata_pelajaran || 'Mata Pelajaran: -'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(index)}
                          className="text-green-600 hover:bg-green-50 hover:text-green-700 h-8 w-8 p-0"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setNewGuru({ ...guru });
                            openEditModal(index);
                          }}
                          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 h-8 w-8 p-0"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGuru(index)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedGuruIndex(null);
              }}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveGuru}
              disabled={isSaving || !newGuru.nama}
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
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
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <Edit className="size-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfilTenagaKependidikanTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  const { toast } = useToast();
  const [tenagaList, setTenagaList] = useState<any[]>(formData.profil_tenaga_kependidikan?.detail || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTenagaIndex, setSelectedTenagaIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newTenaga, setNewTenaga] = useState<any>({
    nama: '',
    nip: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    status: '',
    pendidikan: '',
    tugas: '',
    tanggal_purna_tugas: '',
  });
  
  useEffect(() => {
    if (formData.profil_tenaga_kependidikan?.detail) {
      setTenagaList(formData.profil_tenaga_kependidikan.detail);
    }
  }, [formData.profil_tenaga_kependidikan]);

  const openAddModal = () => {
    setNewTenaga({
      nama: '',
      nip: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      status: '',
      pendidikan: '',
      tugas: '',
      tanggal_purna_tugas: '',
    });
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
      setNewTenaga({
        nama: '',
        nip: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        status: '',
        pendidikan: '',
        tugas: '',
        tanggal_purna_tugas: '',
      });
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
          <Button
            onClick={openAddModal}
            className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus className="size-4 mr-2" />
            Tambah Tenaga
          </Button>
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
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tenagaList.map((tenaga, index) => (
                <Card key={index} className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-slate-900 truncate">{tenaga.nama || 'Nama Tenaga Kependidikan'}</p>
                          <p className="text-xs text-slate-600 truncate">{tenaga.nip || 'NIP: -'}</p>
                          <p className="text-xs text-slate-500 truncate">{tenaga.tugas || 'Tugas: -'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(index)}
                          className="text-green-600 hover:bg-green-50 hover:text-green-700 h-8 w-8 p-0"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setNewTenaga({ ...tenaga });
                            openEditModal(index);
                          }}
                          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 h-8 w-8 p-0"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTenaga(index)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedTenagaIndex(null);
          setNewTenaga({
            nama: '',
            nip: '',
            tanggal_lahir: '',
            jenis_kelamin: '',
            status: '',
            pendidikan: '',
            tugas: '',
            tanggal_purna_tugas: '',
          });
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedTenagaIndex(null);
              }}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveTenaga}
              disabled={isSaving || !newTenaga.nama}
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
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
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <Edit className="size-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfilSiswaTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  const { toast } = useToast();
  const [siswaList, setSiswaList] = useState<any[]>(formData.profil_siswa?.detail || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSiswaIndex, setSelectedSiswaIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newSiswa, setNewSiswa] = useState<any>({
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
  
  useEffect(() => {
    if (formData.profil_siswa?.detail) {
      setSiswaList(formData.profil_siswa.detail);
    }
  }, [formData.profil_siswa]);

  const openAddModal = () => {
    setNewSiswa({
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
      setNewSiswa({
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

      {/* List View */}
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Daftar Profil Siswa</CardTitle>
            <CardDescription className="text-slate-600">Daftar lengkap data siswa</CardDescription>
          </div>
          <Button
            onClick={openAddModal}
            className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus className="size-4 mr-2" />
            Tambah Siswa
          </Button>
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
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {siswaList.map((siswa, index) => (
                <Card key={index} className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-slate-900 truncate">{siswa.nama || 'Nama Siswa'}</p>
                          <p className="text-xs text-slate-600 truncate">{siswa.nis || 'NIS: -'}</p>
                          <p className="text-xs text-slate-500 truncate">{siswa.kelas || 'Kelas: -'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(index)}
                          className="text-green-600 hover:bg-green-50 hover:text-green-700 h-8 w-8 p-0"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setNewSiswa({ ...siswa });
                            openEditModal(index);
                          }}
                          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 h-8 w-8 p-0"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSiswa(index)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedSiswaIndex(null);
          setNewSiswa({
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedSiswaIndex(null);
              }}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveSiswa}
              disabled={isSaving || !newSiswa.nama}
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
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
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <Edit className="size-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

  const [raporData, setRaporData] = useState<any[]>(createDefaultRapor());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (formData.rapor_pendidikan?.detail) {
      const existing = Array.isArray(formData.rapor_pendidikan.detail)
        ? formData.rapor_pendidikan.detail
        : [];

      const merged = indikatorList.map((indikator) => {
        const found = existing.find(
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
      const customItems = existing.filter(
        (item: any) =>
          !indikatorList.some(
            (indikator) => indikator.id === item.id || indikator.indikator === item.indikator,
          ),
      );

      setRaporData([...merged, ...customItems]);
    } else {
      setRaporData(createDefaultRapor());
    }
  }, [formData.rapor_pendidikan]);

  const updateRapor = (id: string, field: string, value: any) => {
    setRaporData((prev) =>
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

  const handleSaveRapor = async () => {
    try {
      setIsSaving(true);

      const payload = {
        rapor_pendidikan: {
          detail: raporData,
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

  const capaianSummary = capaianOptions.map((status) => ({
    status,
    jumlah: raporData.filter((item) => item.capaian === status).length,
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Laporan Rapor Pendidikan</CardTitle>
            <CardDescription className="text-slate-600">
              Isi capaian dan skor indikator rapor pendidikan terbaru
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
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {raporData.map((item) => (
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
                {raporData.map((item) => (
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

