"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
            className="rounded-full border-green-200 bg-white text-green-700 hover:bg-green-50 hover:text-green-900 shadow-sm"
          >
            <ArrowLeft className="size-4 mr-2" />
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
          className="rounded-full border-green-200 bg-white text-green-700 hover:bg-green-50 hover:text-green-900 shadow-sm"
        >
          <ArrowLeft className="size-4 mr-2" />
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

// Placeholder components for other tabs - will be implemented later
function ProfilGuruTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  return (
    <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Profil Guru</CardTitle>
        <CardDescription className="text-slate-600">Data profil guru akan tersedia segera</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">Fitur ini sedang dalam pengembangan.</p>
      </CardContent>
    </Card>
  );
}

function ProfilTenagaKependidikanTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  return (
    <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Profil Tenaga Kependidikan</CardTitle>
        <CardDescription className="text-slate-600">Data tenaga kependidikan akan tersedia segera</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">Fitur ini sedang dalam pengembangan.</p>
      </CardContent>
    </Card>
  );
}

function ProfilSiswaTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  return (
    <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Profil Siswa</CardTitle>
        <CardDescription className="text-slate-600">Data profil siswa akan tersedia segera</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">Fitur ini sedang dalam pengembangan.</p>
      </CardContent>
    </Card>
  );
}

function BrandingSekolahTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  return (
    <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Branding Sekolah</CardTitle>
        <CardDescription className="text-slate-600">Data branding sekolah akan tersedia segera</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">Fitur ini sedang dalam pengembangan.</p>
      </CardContent>
    </Card>
  );
}

function KokurikulerTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  return (
    <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Kokurikuler</CardTitle>
        <CardDescription className="text-slate-600">Data kokurikuler akan tersedia segera</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">Fitur ini sedang dalam pengembangan.</p>
      </CardContent>
    </Card>
  );
}

function EkstrakurikulerTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  return (
    <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Ekstrakurikuler</CardTitle>
        <CardDescription className="text-slate-600">Data ekstrakurikuler akan tersedia segera</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">Fitur ini sedang dalam pengembangan.</p>
      </CardContent>
    </Card>
  );
}

function RaporPendidikanTab({ formData, updateFormData }: { formData: Partial<SekolahProfile>; updateFormData: (field: string, value: any) => void }) {
  return (
    <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Laporan Rapor Pendidikan</CardTitle>
        <CardDescription className="text-slate-600">Data rapor pendidikan akan tersedia segera</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">Fitur ini sedang dalam pengembangan.</p>
      </CardContent>
    </Card>
  );
}

