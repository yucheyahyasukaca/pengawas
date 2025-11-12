"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Activity,
  FileText,
  ChevronDown,
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const toNumber = (value: any): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return new Intl.NumberFormat("id-ID").format(value);
};

const sumNumbers = (values: Array<number | null | undefined>) =>
  values.reduce((acc, val) => (acc ?? 0) + (val ?? 0), 0);

interface Sekolah {
  id: string | number;
  nama: string;
  npsn: string;
  jenjang: string;
  alamat: string;
  kabupaten: string;
  cabangDinas: string;
  status: string;
  profil_siswa?: any;
}

type TabType = 
  | "identitas" 
  | "profil-guru" 
  | "profil-tenaga-kependidikan" 
  | "profil-siswa" 
  | "branding" 
  | "kokurikuler" 
  | "ekstrakurikuler" 
  | "rapor-pendidikan";

export default function SekolahProfilePage() {
  const params = useParams();
  const router = useRouter();
  const sekolahId = params.id as string;
  
  const [sekolah, setSekolah] = useState<Sekolah | null>(null);
  const [sekolahProfile, setSekolahProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("identitas");
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);

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
    loadSekolahDetail();
  }, [sekolahId]);

  const loadSekolahDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSekolahProfile(null);

      // Validate sekolahId from URL params
      if (!sekolahId || sekolahId === '' || sekolahId === 'undefined') {
        setError('ID sekolah tidak ditemukan di URL');
        setIsLoading(false);
        return;
      }

      const userResponse = await fetch('/api/auth/get-current-user');
      
      if (!userResponse.ok) {
        throw new Error('Gagal memuat data pengawas');
      }

      const userData = await userResponse.json();
      const pengawas = userData.user;

      if (!pengawas || pengawas.role !== 'pengawas') {
        throw new Error('Data pengawas tidak ditemukan');
      }

      const sekolahBinaanNames = Array.isArray(pengawas.metadata?.sekolah_binaan) 
        ? pengawas.metadata.sekolah_binaan 
        : [];

      if (sekolahBinaanNames.length === 0) {
        setError('Tidak ada sekolah binaan');
        setIsLoading(false);
        return;
      }

      const sekolahResponse = await fetch('/api/sekolah/list');
      
      if (!sekolahResponse.ok) {
        throw new Error('Gagal memuat data sekolah');
      }

      const sekolahData = await sekolahResponse.json();
      const allSekolah = sekolahData.sekolah || [];

      const foundSekolah = allSekolah.find((s: any) => 
        s.id === sekolahId || s.id?.toString() === sekolahId
      );

      if (!foundSekolah) {
        const filteredSekolah = allSekolah
          .filter((s: any) => sekolahBinaanNames.includes(s.nama_sekolah))
          .find((s: any) => 
            s.id === sekolahId || 
            s.id?.toString() === sekolahId ||
            s.nama_sekolah?.toLowerCase().includes(sekolahId.toLowerCase())
          );

        if (!filteredSekolah) {
          setError('Sekolah tidak ditemukan atau tidak termasuk sekolah binaan Anda');
          setIsLoading(false);
          return;
        }

        setSekolah({
          id: filteredSekolah.id,
          nama: filteredSekolah.nama_sekolah,
          npsn: filteredSekolah.npsn || '-',
          jenjang: filteredSekolah.jenjang || '-',
          alamat: filteredSekolah.alamat ? filteredSekolah.alamat.trim() : '',
          kabupaten: filteredSekolah.kabupaten_kota || '-',
          cabangDinas: `KCD Wilayah ${filteredSekolah.kcd_wilayah || '-'}`,
          status: filteredSekolah.status || 'Aktif',
        });
        
        // Only fetch profile if ID is valid
        if (filteredSekolah.id) {
          await fetchSekolahProfile(filteredSekolah.id);
        } else {
          throw new Error('ID sekolah tidak valid');
        }
      } else {
        if (!sekolahBinaanNames.includes(foundSekolah.nama_sekolah)) {
          setError('Sekolah ini tidak termasuk sekolah binaan Anda');
          setIsLoading(false);
          return;
        }

        setSekolah({
          id: foundSekolah.id,
          nama: foundSekolah.nama_sekolah,
          npsn: foundSekolah.npsn || '-',
          jenjang: foundSekolah.jenjang || '-',
          alamat: foundSekolah.alamat ? foundSekolah.alamat.trim() : '',
          kabupaten: foundSekolah.kabupaten_kota || '-',
          cabangDinas: `KCD Wilayah ${foundSekolah.kcd_wilayah || '-'}`,
          status: foundSekolah.status || 'Aktif',
        });
        
        // Only fetch profile if ID is valid
        if (foundSekolah.id) {
          await fetchSekolahProfile(foundSekolah.id);
        } else {
          throw new Error('ID sekolah tidak valid');
        }
      }
    } catch (err) {
      console.error("Error loading sekolah detail:", err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSekolahProfile = async (id: string | number) => {
    try {
      // Validate ID before making the request
      if (!id || id === '' || id === null || id === undefined) {
        throw new Error('ID sekolah wajib diisi');
      }

      const response = await fetch(`/api/pengawas/sekolah/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Profil sekolah tidak ditemukan');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Gagal memuat profil sekolah');
      }

      const result = await response.json();
      console.log("=== Frontend: Full API Response ===");
      console.log("Full API Response:", result);
      console.log("Sekolah Profile Data:", result.data);
      console.log("Profil Guru:", result.data?.profil_guru);
      console.log("Profil Guru Type:", typeof result.data?.profil_guru);
      console.log("Profil Guru is null:", result.data?.profil_guru === null);
      console.log("Profil Guru is undefined:", result.data?.profil_guru === undefined);
      
      if (result.data?.profil_guru) {
        console.log("Profil Guru Keys:", Object.keys(result.data.profil_guru));
        console.log("Profil Guru Detail:", result.data.profil_guru.detail);
        console.log("Profil Guru Detail Type:", typeof result.data.profil_guru.detail);
        console.log("Profil Guru Detail isArray:", Array.isArray(result.data.profil_guru.detail));
        if (Array.isArray(result.data.profil_guru.detail)) {
          console.log("Profil Guru Detail Length:", result.data.profil_guru.detail.length);
        }
      } else {
        console.warn("⚠️ Frontend: profil_guru is NULL or UNDEFINED!");
      }
      console.log("=== End Frontend API Response ===");
      
      setSekolahProfile(result.data);
    } catch (err) {
      console.error("Error fetching sekolah profile:", err);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
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
            className="rounded-full border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 shadow-sm"
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
                  Sekolah mungkin tidak termasuk dalam daftar sekolah binaan Anda
                </p>
              </div>
              <Button
                onClick={() => router.push('/pengawas/manajemen-data/sekolah')}
                variant="outline"
                className="w-full rounded-full border-red-200 text-red-600 hover:bg-red-50"
              >
                Lihat Semua Sekolah
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="rounded-full border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 shadow-sm"
        >
          <ArrowLeft className="size-4 mr-2" />
          Kembali
        </Button>
      </div>

      {/* School Header Card */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader className="bg-gradient-to-br from-indigo-50 via-indigo-100/30 to-blue-50 px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                <School className="size-8 sm:size-10" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  {sekolah.nama}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base font-medium text-slate-700">
                  NPSN: {sekolah.npsn} • {sekolah.jenjang}
                </CardDescription>
              </div>
            </div>
            <Badge className="rounded-full border-2 border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 w-fit">
              {sekolah.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardContent className="p-0">
          {/* Mobile Dropdown Tabs */}
          <div className="border-b border-slate-200 bg-white p-4 md:hidden">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                className="flex w-full items-center justify-between gap-4 rounded-full border-0 bg-slate-100 pl-4 pr-2 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
              >
                <span className="flex-1 text-left">{tabs.find(t => t.id === activeTab)?.label}</span>
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-white/80 px-2.5 py-1.5 mr-2 shadow-sm transition-all hover:bg-white">
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-indigo-600 transition-all duration-200",
                      isTabDropdownOpen && "rotate-180 text-indigo-700"
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
                              ? "bg-indigo-50 text-indigo-700"
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
                      ? "bg-indigo-600 text-white shadow-md"
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
          <IdentitasSekolahTab sekolah={sekolah} sekolahProfile={sekolahProfile} />
        )}
        {activeTab === "profil-guru" && (
          <ProfilGuruTab profilData={sekolahProfile?.profil_guru} />
        )}
        {activeTab === "profil-tenaga-kependidikan" && (
          <ProfilTenagaKependidikanTab profilData={sekolahProfile?.profil_tenaga_kependidikan} />
        )}
        {activeTab === "profil-siswa" && (
          <ProfilSiswaTab profilData={sekolahProfile?.profil_siswa} />
        )}
        {activeTab === "branding" && <BrandingSekolahTab profilData={sekolahProfile?.branding_sekolah} />}
        {activeTab === "kokurikuler" && <KokurikulerTab profilData={sekolahProfile?.kokurikuler} />}
        {activeTab === "ekstrakurikuler" && <EkstrakurikulerTab profilData={sekolahProfile?.ekstrakurikuler} />}
        {activeTab === "rapor-pendidikan" && <RaporPendidikanTab profilData={sekolahProfile?.rapor_pendidikan} />}
      </div>
    </div>
  );
}

// Identitas Sekolah Tab
function IdentitasSekolahTab({ sekolah, sekolahProfile }: { sekolah: Sekolah; sekolahProfile?: any }) {
  // Debug logging untuk identitas sekolah
  useEffect(() => {
    console.log("=== IDENTITAS SEKOLAH TAB DEBUG ===");
    console.log("Sekolah Profile:", sekolahProfile);
    console.log("Kepala Sekolah:", sekolahProfile?.kepala_sekolah);
    console.log("Status Akreditasi:", sekolahProfile?.status_akreditasi);
    console.log("Jalan:", sekolahProfile?.jalan);
    console.log("Desa:", sekolahProfile?.desa);
    console.log("Kecamatan:", sekolahProfile?.kecamatan);
    console.log("Nomor Telepon:", sekolahProfile?.nomor_telepon);
    console.log("WhatsApp:", sekolahProfile?.whatsapp);
    console.log("Email:", sekolahProfile?.email_sekolah);
    console.log("Website:", sekolahProfile?.website);
    console.log("Facebook:", sekolahProfile?.facebook);
    console.log("Instagram:", sekolahProfile?.instagram);
    console.log("TikTok:", sekolahProfile?.tiktok);
    console.log("Twitter:", sekolahProfile?.twitter);
    console.log("=== END IDENTITAS SEKOLAH DEBUG ===");
  }, [sekolahProfile]);

  return (
    <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Identitas Sekolah</CardTitle>
        <CardDescription className="text-slate-600">Informasi lengkap identitas sekolah</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Nama Sekolah</label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {sekolahProfile?.nama_sekolah || sekolah.nama || "-"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">NPSN</label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {sekolahProfile?.npsn || sekolah.npsn || "-"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Jenjang</label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {sekolahProfile?.jenjang || sekolah.jenjang || "-"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Nama Kepala Sekolah</label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {sekolahProfile?.kepala_sekolah || "-"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Status Akreditasi</label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {sekolahProfile?.status_akreditasi || "-"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900">Alamat Sekolah</label>
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600">Jalan</label>
                <div className="mt-1 text-sm text-slate-700">{sekolahProfile?.jalan || "-"}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Desa</label>
                <div className="mt-1 text-sm text-slate-700">{sekolahProfile?.desa || "-"}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Kecamatan</label>
                <div className="mt-1 text-sm text-slate-700">{sekolahProfile?.kecamatan || "-"}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Kabupaten/Kota</label>
                <div className="mt-1 text-sm text-slate-700">{sekolahProfile?.kabupaten_kota || sekolah.kabupaten || "-"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Nomor Telepon</label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {sekolahProfile?.nomor_telepon || "-"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">WhatsApp</label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {sekolahProfile?.whatsapp || "-"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">Email</label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {sekolahProfile?.email_sekolah || "-"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-900">Media Sosial</label>
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600">Website</label>
                <div className="mt-1 text-sm text-slate-700">
                  {sekolahProfile?.website ? (
                    <a 
                      href={sekolahProfile.website.startsWith('http') ? sekolahProfile.website : `https://${sekolahProfile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      {sekolahProfile.website}
                    </a>
                  ) : "-"}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Facebook</label>
                <div className="mt-1 text-sm text-slate-700">{sekolahProfile?.facebook || "-"}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Instagram</label>
                <div className="mt-1 text-sm text-slate-700">
                  {sekolahProfile?.instagram ? (
                    <a 
                      href={`https://instagram.com/${sekolahProfile.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      @{sekolahProfile.instagram.replace('@', '')}
                    </a>
                  ) : "-"}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">TikTok</label>
                <div className="mt-1 text-sm text-slate-700">
                  {sekolahProfile?.tiktok ? (
                    <a 
                      href={`https://tiktok.com/@${sekolahProfile.tiktok.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      @{sekolahProfile.tiktok.replace('@', '')}
                    </a>
                  ) : "-"}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Twitter (X)</label>
                <div className="mt-1 text-sm text-slate-700">
                  {sekolahProfile?.twitter ? (
                    <a 
                      href={`https://twitter.com/${sekolahProfile.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      @{sekolahProfile.twitter.replace('@', '')}
                    </a>
                  ) : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Profil Guru Tab
function ProfilGuruTab({ profilData }: { profilData?: any }) {
  // Debug: log data structure - use useEffect to ensure it runs
  useEffect(() => {
    console.log("=== PROFIL GURU TAB DEBUG ===");
    console.log("Profil Guru Tab - profilData:", profilData);
    console.log("Profil Guru Tab - typeof:", typeof profilData);
    console.log("Profil Guru Tab - isArray:", Array.isArray(profilData));
    
    if (profilData) {
      console.log("Profil Guru Data keys:", Object.keys(profilData));
      console.log("Profil Guru Data detail:", profilData.detail);
      console.log("Profil Guru Data data:", profilData.data);
      console.log("Profil Guru Data stringified:", JSON.stringify(profilData, null, 2));
    } else {
      console.warn("ProfilData is null/undefined!");
    }
  }, [profilData]);

  // Extract statistics from profilData - support multiple data structures
  let jenisKelamin = profilData?.jenis_kelamin || profilData?.statistik?.jenis_kelamin || {};
  let statusKepegawaian = profilData?.status_kepegawaian || profilData?.statistik?.status_kepegawaian || {};
  let pendidikan = profilData?.pendidikan || profilData?.statistik?.pendidikan || {};

  // Extract detail guru list - support multiple formats
  // Based on sekolah profil page, structure is: profil_guru.detail = array of guru
  let detailGuru: any[] = [];
  
  if (!profilData) {
    console.warn("Profil Guru Data is null/undefined");
  } else if (Array.isArray(profilData)) {
    // If profilData itself is an array
    detailGuru = profilData;
    console.log("ProfilData is array, length:", profilData.length);
  } else if (Array.isArray(profilData?.detail)) {
    // Standard structure: profil_guru.detail = array
    detailGuru = profilData.detail;
    console.log("Found detail array (standard structure), length:", profilData.detail.length);
  } else if (Array.isArray(profilData?.data)) {
    detailGuru = profilData.data;
    console.log("Found data array, length:", profilData.data.length);
  } else if (profilData && typeof profilData === 'object') {
    // Try to find any array property
    const arrayKeys = Object.keys(profilData).filter(key => Array.isArray(profilData[key]));
    if (arrayKeys.length > 0) {
      console.log("Found array keys:", arrayKeys);
      // Prefer 'detail' if it exists
      if (arrayKeys.includes('detail')) {
        detailGuru = profilData.detail;
        console.log("Using 'detail' array, length:", detailGuru.length);
      } else {
        detailGuru = profilData[arrayKeys[0]];
        console.log("Using first array key:", arrayKeys[0], "length:", detailGuru.length);
      }
    } else {
      // If no array found, check if it's a single object that should be in an array
      if (profilData.nama || profilData.Nama) {
        console.log("Found single guru object, converting to array");
        detailGuru = [profilData];
      }
    }
  }
  
  console.log("Final Detail Guru extracted:", detailGuru);
  console.log("Final Detail Guru length:", detailGuru.length);
  console.log("First guru sample:", detailGuru[0]);

  // Calculate statistics from detail array if statistics are not available
  if (detailGuru.length > 0 && (!jenisKelamin.laki_laki && !jenisKelamin.perempuan)) {
    console.log("Calculating statistics from detail array");
    jenisKelamin = {
      laki_laki: detailGuru.filter((g: any) => (g.jenis_kelamin || g.jenisKelamin || '').toLowerCase() === 'laki-laki' || (g.jenis_kelamin || g.jenisKelamin || '').toLowerCase() === 'laki laki').length,
      perempuan: detailGuru.filter((g: any) => (g.jenis_kelamin || g.jenisKelamin || '').toLowerCase() === 'perempuan').length,
    };
    
    statusKepegawaian = {
      pns: detailGuru.filter((g: any) => (g.status_kepegawaian || g.statusKepegawaian || g.status || '').toLowerCase().includes('pns')).length,
      pppk: detailGuru.filter((g: any) => (g.status_kepegawaian || g.statusKepegawaian || g.status || '').toLowerCase().includes('pppk')).length,
      pppk_paruh_waktu: detailGuru.filter((g: any) => (g.status_kepegawaian || g.statusKepegawaian || g.status || '').toLowerCase().includes('pppk paruh waktu') || (g.status_kepegawaian || g.statusKepegawaian || g.status || '').toLowerCase().includes('pppk paruh')).length,
      guru_tamu: detailGuru.filter((g: any) => (g.status_kepegawaian || g.statusKepegawaian || g.status || '').toLowerCase().includes('guru tamu')).length,
      gty: detailGuru.filter((g: any) => (g.status_kepegawaian || g.statusKepegawaian || g.status || '').toLowerCase().includes('gty')).length,
      gtt: detailGuru.filter((g: any) => (g.status_kepegawaian || g.statusKepegawaian || g.status || '').toLowerCase().includes('gtt')).length,
    };
    
    pendidikan = {
      sma: detailGuru.filter((g: any) => (g.pendidikan || '').toLowerCase().includes('sma')).length,
      d1: detailGuru.filter((g: any) => (g.pendidikan || '').toLowerCase().includes('d1')).length,
      d2: detailGuru.filter((g: any) => (g.pendidikan || '').toLowerCase().includes('d2')).length,
      d3: detailGuru.filter((g: any) => (g.pendidikan || '').toLowerCase().includes('d3')).length,
      s1: detailGuru.filter((g: any) => (g.pendidikan || '').toLowerCase().includes('s1') || (g.pendidikan || '').toLowerCase().includes('s1/d4')).length,
      s2: detailGuru.filter((g: any) => (g.pendidikan || '').toLowerCase().includes('s2')).length,
      s3: detailGuru.filter((g: any) => (g.pendidikan || '').toLowerCase().includes('s3')).length,
    };
    
    console.log("Calculated statistics:", { jenisKelamin, statusKepegawaian, pendidikan });
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 text-center md:text-center">Statistik Profil Guru</CardTitle>
          <CardDescription className="text-slate-600 text-center md:text-center">Ringkasan data guru berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 w-[30%]">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 w-[50%]">Sub Kategori</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 w-[20%]">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td rowSpan={2} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Jenis Kelamin</td>
                  <td className="px-6 py-3 text-sm text-slate-700">Laki-laki</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(jenisKelamin.laki_laki ?? jenisKelamin.laki))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Perempuan</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(jenisKelamin.perempuan))}</td>
                </tr>
                <tr>
                  <td rowSpan={6} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Status Kepegawaian</td>
                  <td className="px-6 py-3 text-sm text-slate-700">PNS</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.pns))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">PPPK</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.pppk))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">PPPK paruh waktu</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.pppk_paruh_waktu ?? statusKepegawaian.pppkParuhWaktu))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Guru Tamu</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.guru_tamu ?? statusKepegawaian.guruTamu))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">GTY</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.gty))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">GTT</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.gtt))}</td>
                </tr>
                <tr>
                  <td rowSpan={7} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Pendidikan</td>
                  <td className="px-6 py-3 text-sm text-slate-700">SMA/ sederajat</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(pendidikan.sma ?? pendidikan.sma_sederajat))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">D1</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(pendidikan.d1))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">D2</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(pendidikan.d2))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">D3</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(pendidikan.d3))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">S1/D4</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(pendidikan.s1 ?? pendidikan.s1_d4 ?? pendidikan.s1D4))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">S2</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(pendidikan.s2))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">S3</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(pendidikan.s3))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Table */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Detail Profil Guru</CardTitle>
          <CardDescription className="text-slate-600">Daftar lengkap data guru</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">No</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">NIP</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Tanggal Lahir</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Jenis Kelamin</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Pendidikan</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Jurusan</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Mata Pelajaran</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Jumlah Jam</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-900" colSpan={6}>Tugas Tambahan</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Tanggal Purna Tugas</th>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th colSpan={10}></th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Waka</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Kepala lab/Perpus/lainnya</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Wali Kelas</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Guru Wali</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Ekstrakurikuler</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Lainnya</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detailGuru.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-8 text-center text-sm text-slate-500">
                      Belum ada data guru yang diinput oleh sekolah.
                    </td>
                  </tr>
                ) : (
                  detailGuru.map((guru: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{guru.nama || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{guru.nip || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{guru.tanggal_lahir || guru.tanggalLahir || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{guru.jenis_kelamin || guru.jenisKelamin || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{guru.status || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{guru.pendidikan || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{guru.jurusan || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{guru.mata_pelajaran || guru.mataPelajaran || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(toNumber(guru.jumlah_jam ?? guru.jumlahJam))}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{guru.waka ? "✓" : "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{(guru.kepala_lab ?? guru.kepalaLab) ? "✓" : "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{guru.wali_kelas ?? guru.waliKelas ? "✓" : "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{guru.guru_wali ?? guru.guruWali ? "✓" : "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{guru.ekstrakurikuler ? "✓" : "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{guru.lainnya || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{(guru.tanggal_purna_tugas ?? guru.tanggalPurnaTugas) || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Profil Tenaga Kependidikan Tab
function ProfilTenagaKependidikanTab({ profilData }: { profilData?: any }) {
  // Debug: log data structure
  useEffect(() => {
    console.log("=== PROFIL TENAGA KEPENDIDIKAN TAB DEBUG ===");
    console.log("Profil Tenaga Kependidikan Tab - profilData:", profilData);
    console.log("Profil Tenaga Kependidikan Tab - typeof:", typeof profilData);
    console.log("Profil Tenaga Kependidikan Tab - isArray:", Array.isArray(profilData));
    
    if (profilData) {
      console.log("Profil Tenaga Kependidikan Data keys:", Object.keys(profilData));
      console.log("Profil Tenaga Kependidikan Data detail:", profilData.detail);
      console.log("Profil Tenaga Kependidikan Data data:", profilData.data);
      console.log("Profil Tenaga Kependidikan Data stringified:", JSON.stringify(profilData, null, 2));
    } else {
      console.warn("ProfilData is null/undefined!");
    }
  }, [profilData]);

  // Extract statistics from profilData - support multiple data structures
  let jenisKelamin = profilData?.jenis_kelamin || profilData?.statistik?.jenis_kelamin || {};
  let statusKepegawaian = profilData?.status_kepegawaian || profilData?.statistik?.status_kepegawaian || {};

  // Extract detail tenaga list - support multiple formats
  let detailTenaga: any[] = [];
  
  if (!profilData) {
    console.warn("Profil Tenaga Kependidikan Data is null/undefined");
  } else if (Array.isArray(profilData)) {
    // If profilData itself is an array
    detailTenaga = profilData;
    console.log("ProfilData is array, length:", profilData.length);
  } else if (Array.isArray(profilData?.detail)) {
    // Standard structure: profil_tenaga_kependidikan.detail = array
    detailTenaga = profilData.detail;
    console.log("Found detail array (standard structure), length:", profilData.detail.length);
  } else if (Array.isArray(profilData?.data)) {
    detailTenaga = profilData.data;
    console.log("Found data array, length:", profilData.data.length);
  } else if (profilData && typeof profilData === 'object') {
    // Try to find any array property
    const arrayKeys = Object.keys(profilData).filter(key => Array.isArray(profilData[key]));
    if (arrayKeys.length > 0) {
      console.log("Found array keys:", arrayKeys);
      // Prefer 'detail' if it exists
      if (arrayKeys.includes('detail')) {
        detailTenaga = profilData.detail;
        console.log("Using 'detail' array, length:", detailTenaga.length);
      } else {
        detailTenaga = profilData[arrayKeys[0]];
        console.log("Using first array key:", arrayKeys[0], "length:", detailTenaga.length);
      }
    } else {
      // If no array found, check if it's a single object that should be in an array
      if (profilData.nama || profilData.Nama) {
        console.log("Found single tenaga object, converting to array");
        detailTenaga = [profilData];
      }
    }
  }
  
  console.log("Final Detail Tenaga extracted:", detailTenaga);
  console.log("Final Detail Tenaga length:", detailTenaga.length);
  console.log("First tenaga sample:", detailTenaga[0]);

  // Calculate statistics from detail array if statistics are not available
  if (detailTenaga.length > 0 && (!jenisKelamin.laki_laki && !jenisKelamin.perempuan)) {
    console.log("Calculating statistics from detail array");
    jenisKelamin = {
      laki_laki: detailTenaga.filter((t: any) => (t.jenis_kelamin || t.jenisKelamin || '').toLowerCase() === 'laki-laki' || (t.jenis_kelamin || t.jenisKelamin || '').toLowerCase() === 'laki laki').length,
      perempuan: detailTenaga.filter((t: any) => (t.jenis_kelamin || t.jenisKelamin || '').toLowerCase() === 'perempuan').length,
    };
    
    statusKepegawaian = {
      pns: detailTenaga.filter((t: any) => (t.status_kepegawaian || t.statusKepegawaian || t.status || '').toLowerCase().includes('pns')).length,
      pppk: detailTenaga.filter((t: any) => (t.status_kepegawaian || t.statusKepegawaian || t.status || '').toLowerCase().includes('pppk')).length,
      pppk_paruh_waktu: detailTenaga.filter((t: any) => (t.status_kepegawaian || t.statusKepegawaian || t.status || '').toLowerCase().includes('pppk paruh waktu') || (t.status_kepegawaian || t.statusKepegawaian || t.status || '').toLowerCase().includes('pppk paruh')).length,
      guru_tamu: detailTenaga.filter((t: any) => (t.status_kepegawaian || t.statusKepegawaian || t.status || '').toLowerCase().includes('guru tamu')).length,
      gty: detailTenaga.filter((t: any) => (t.status_kepegawaian || t.statusKepegawaian || t.status || '').toLowerCase().includes('gty')).length,
      gtt: detailTenaga.filter((t: any) => (t.status_kepegawaian || t.statusKepegawaian || t.status || '').toLowerCase().includes('gtt')).length,
    };
    
    console.log("Calculated statistics:", { jenisKelamin, statusKepegawaian });
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 text-center md:text-center">Statistik Tenaga Kependidikan</CardTitle>
          <CardDescription className="text-slate-600 text-center md:text-center">Ringkasan data tenaga kependidikan berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 w-[30%]">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 w-[50%]">Sub Kategori</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 w-[20%]">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td rowSpan={2} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Jenis Kelamin</td>
                  <td className="px-6 py-3 text-sm text-slate-700">Laki-laki</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(jenisKelamin.laki_laki ?? jenisKelamin.laki))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Perempuan</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(jenisKelamin.perempuan))}</td>
                </tr>
                <tr>
                  <td rowSpan={6} className="px-6 py-4 text-sm font-semibold text-slate-900 align-top border-r border-slate-100">Status Kepegawaian</td>
                  <td className="px-6 py-3 text-sm text-slate-700">PNS</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.pns))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">PPPK</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.pppk))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">PPPK paruh waktu</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.pppk_paruh_waktu ?? statusKepegawaian.pppkParuhWaktu))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">Guru Tamu</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.guru_tamu ?? statusKepegawaian.guruTamu))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">GTY</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.gty))}</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-slate-700">GTT</td>
                  <td className="px-6 py-3 text-sm text-slate-700 text-center font-medium">{formatNumber(toNumber(statusKepegawaian.gtt))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Table */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Detail Profil Tenaga Kependidikan</CardTitle>
          <CardDescription className="text-slate-600">Daftar lengkap data tenaga kependidikan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">No</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">NIP</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Tanggal Lahir</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Jenis Kelamin</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Pendidikan</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Tugas</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Tanggal Purna Tugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {detailTenaga.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-500">
                      Belum ada data tenaga kependidikan yang diinput oleh sekolah.
                    </td>
                  </tr>
                ) : (
                  detailTenaga.map((tenaga: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{tenaga.nama || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{tenaga.nip || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{tenaga.tanggal_lahir || tenaga.tanggalLahir || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{tenaga.jenis_kelamin || tenaga.jenisKelamin || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{tenaga.status || tenaga.status_kepegawaian || tenaga.statusKepegawaian || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{tenaga.pendidikan || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{tenaga.tugas || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{(tenaga.tanggal_purna_tugas ?? tenaga.tanggalPurnaTugas) || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Profil Siswa Tab
interface JumlahSiswaRow {
  kelas: string;
  jumlah_rombel?: number | null;
  laki_laki?: number | null;
  perempuan?: number | null;
  jumlah?: number | null;
  abk_laki?: number | null;
  abk_perempuan?: number | null;
  abk_jumlah?: number | null;
}

interface EkonomiRow {
  kelas: string;
  p1?: number | null;
  p2?: number | null;
  p3?: number | null;
  lebih_p3?: number | null;
}

interface PekerjaanRow {
  jenis: string;
  jumlah?: number | null;
}

interface ProfilLulusanRow {
  tahun: string;
  ptn_snbp?: number | null;
  ptn_snbt?: number | null;
  ptn_um?: number | null;
  uin?: number | null;
  pts?: number | null;
  kedinasan_akmil?: number | null;
  kedinasan_akpol?: number | null;
  kedinasan_stan?: number | null;
  kedinasan_stpdn?: number | null;
  kedinasan_sttd?: number | null;
  kedinasan_stis?: number | null;
  kedinasan_lainnya?: number | null;
  bekerja?: number | null;
  belum_bekerja?: number | null;
}

function ProfilSiswaTab({ profilData }: { profilData?: any }) {
  const jumlahSiswaRows: JumlahSiswaRow[] = Array.isArray(profilData?.jumlah_siswa?.per_kelas)
    ? profilData.jumlah_siswa.per_kelas.map((row: any) => {
        const laki = toNumber(row?.laki_laki ?? row?.jumlah_laki ?? row?.laki);
        const perempuan = toNumber(row?.perempuan ?? row?.jumlah_perempuan ?? row?.perempuan);
        const jumlah = toNumber(row?.jumlah) ?? sumNumbers([laki, perempuan]);
        const abkLaki = toNumber(row?.abk_laki ?? row?.abkLaki ?? row?.abk?.laki_laki);
        const abkPerempuan = toNumber(row?.abk_perempuan ?? row?.abkPerempuan ?? row?.abk?.perempuan);
        const abkJumlah = toNumber(row?.abk_jumlah) ?? sumNumbers([abkLaki, abkPerempuan]);

        return {
          kelas: row?.kelas ?? "-",
          jumlah_rombel: toNumber(row?.jumlah_rombel ?? row?.rombel),
          laki_laki: laki,
          perempuan,
          jumlah,
          abk_laki: abkLaki,
          abk_perempuan: abkPerempuan,
          abk_jumlah: abkJumlah,
        };
      })
    : [];

  const jumlahSiswaSummary =
    jumlahSiswaRows.length > 0
      ? {
          jumlah_rombel: sumNumbers(jumlahSiswaRows.map((row) => row.jumlah_rombel)),
          laki_laki: sumNumbers(jumlahSiswaRows.map((row) => row.laki_laki)),
          perempuan: sumNumbers(jumlahSiswaRows.map((row) => row.perempuan)),
          jumlah: sumNumbers(jumlahSiswaRows.map((row) => row.jumlah)),
          abk_laki: sumNumbers(jumlahSiswaRows.map((row) => row.abk_laki)),
          abk_perempuan: sumNumbers(jumlahSiswaRows.map((row) => row.abk_perempuan)),
          abk_jumlah: sumNumbers(jumlahSiswaRows.map((row) => row.abk_jumlah)),
        }
      : null;

  const ekonomiRows: EkonomiRow[] = Array.isArray(profilData?.ekonomi_orang_tua?.per_kelas)
    ? profilData.ekonomi_orang_tua.per_kelas.map((row: any) => ({
        kelas: row?.kelas ?? "-",
        p1: toNumber(row?.p1 ?? row?.P1),
        p2: toNumber(row?.p2 ?? row?.P2),
        p3: toNumber(row?.p3 ?? row?.P3),
        lebih_p3: toNumber(row?.lebih_p3 ?? row?.lebihP3 ?? row?.diatas_p3),
      }))
    : [];

  const pekerjaanRows: PekerjaanRow[] = Array.isArray(profilData?.pekerjaan_orang_tua?.detail ?? profilData?.pekerjaan_orang_tua)
    ? (profilData.pekerjaan_orang_tua.detail ?? profilData.pekerjaan_orang_tua).map((row: any) => ({
        jenis: row?.jenis ?? row?.nama ?? "-",
        jumlah: toNumber(row?.jumlah ?? row?.total ?? row?.value),
      }))
    : [];

  const profilLulusanRows: ProfilLulusanRow[] = Array.isArray(profilData?.profil_lulusan?.per_tahun ?? profilData?.profil_lulusan)
    ? (profilData.profil_lulusan?.per_tahun ?? profilData.profil_lulusan).map((row: any) => ({
        tahun: row?.tahun ?? "-",
        ptn_snbp: toNumber(row?.ptn_snbp ?? row?.snbp),
        ptn_snbt: toNumber(row?.ptn_snbt ?? row?.snbt),
        ptn_um: toNumber(row?.ptn_um ?? row?.um),
        uin: toNumber(row?.uin),
        pts: toNumber(row?.pts),
        kedinasan_akmil: toNumber(row?.kedinasan_akmil ?? row?.akmil),
        kedinasan_akpol: toNumber(row?.kedinasan_akpol ?? row?.akpol),
        kedinasan_stan: toNumber(row?.kedinasan_stan ?? row?.stan),
        kedinasan_stpdn: toNumber(row?.kedinasan_stpdn ?? row?.stpdn),
        kedinasan_sttd: toNumber(row?.kedinasan_sttd ?? row?.sttd),
        kedinasan_stis: toNumber(row?.kedinasan_stis ?? row?.stis),
        kedinasan_lainnya: toNumber(row?.kedinasan_lainnya ?? row?.kedinasanLainnya),
        bekerja: toNumber(row?.bekerja),
        belum_bekerja: toNumber(row?.belum_bekerja ?? row?.belum_bekerja_melanjutkan ?? row?.belum),
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Jumlah Siswa */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Jumlah Siswa</CardTitle>
          <CardDescription className="text-slate-600">
            Data jumlah siswa per kelas dan siswa berkebutuhan khusus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th rowSpan={2} className="px-4 py-3 text-left text-xs font-bold text-slate-900 border-r border-slate-200">
                    Kelas
                  </th>
                  <th rowSpan={2} className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                    Jumlah Rombel
                  </th>
                  <th colSpan={3} className="px-4 py-3 text-center text-xs font-bold text-slate-900 border-r border-slate-200">
                    Jumlah Siswa
                  </th>
                  <th colSpan={3} className="px-4 py-3 text-center text-xs font-bold text-slate-900">
                    Siswa Berkebutuhan Khusus
                  </th>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Laki-laki</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Perempuan</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200">
                    Jumlah
                  </th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Laki-laki</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Perempuan</th>
                  <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jumlahSiswaRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                      Belum ada data jumlah siswa yang diinput oleh sekolah.
                    </td>
                  </tr>
                ) : (
                  jumlahSiswaRows.map((row, index) => (
                    <tr key={`${row.kelas}-${index}`}>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.kelas}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">
                        {formatNumber(row.jumlah_rombel)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.laki_laki)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.perempuan)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center border-r border-slate-200">
                        {formatNumber(row.jumlah)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.abk_laki)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.abk_perempuan)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.abk_jumlah)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {jumlahSiswaSummary && (
                <tfoot>
                  <tr className="bg-slate-50 font-semibold">
                    <td className="px-4 py-3 text-sm text-slate-900">Total</td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      {formatNumber(jumlahSiswaSummary.jumlah_rombel)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      {formatNumber(jumlahSiswaSummary.laki_laki)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      {formatNumber(jumlahSiswaSummary.perempuan)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center border-r border-slate-200">
                      {formatNumber(jumlahSiswaSummary.jumlah)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      {formatNumber(jumlahSiswaSummary.abk_laki)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      {formatNumber(jumlahSiswaSummary.abk_perempuan)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      {formatNumber(jumlahSiswaSummary.abk_jumlah)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ekonomi Orang Tua */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Ekonomi Orang Tua</CardTitle>
          <CardDescription className="text-slate-600">
            Data tingkat ekonomi orang tua siswa per kelas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[400px]">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Kelas</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">P1</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">P2</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">P3</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">&gt;P3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ekonomiRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                      Belum ada data ekonomi orang tua yang diinput oleh sekolah.
                    </td>
                  </tr>
                ) : (
                  ekonomiRows.map((row, index) => (
                    <tr key={`${row.kelas}-${index}`}>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.kelas}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.p1)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.p2)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.p3)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.lebih_p3)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pekerjaan Orang Tua */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Pekerjaan Orang Tua</CardTitle>
          <CardDescription className="text-slate-600">Data jenis pekerjaan orang tua siswa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[300px]">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Jenis Pekerjaan</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pekerjaanRows.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-500">
                      Belum ada data pekerjaan orang tua yang diinput oleh sekolah.
                    </td>
                  </tr>
                ) : (
                  pekerjaanRows.map((row, index) => (
                    <tr key={`${row.jenis}-${index}`}>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.jenis}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.jumlah)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Profil Lulusan */}
      <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Profil Lulusan</CardTitle>
          <CardDescription className="text-slate-600">
            Data kelulusan dan kelanjutan studi/tujuan siswa per tahun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th rowSpan={2} className="px-4 py-3 text-left text-xs font-bold text-slate-900 border-r border-slate-200">
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
                    Lain-lain
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
                {profilLulusanRows.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-8 text-center text-sm text-slate-500">
                      Belum ada data profil lulusan yang diinput oleh sekolah.
                    </td>
                  </tr>
                ) : (
                  profilLulusanRows.map((row, index) => (
                    <tr key={`${row.tahun}-${index}`}>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 border-r border-slate-200">
                        {row.tahun}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.ptn_snbp)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.ptn_snbt)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center border-r border-slate-200">
                        {formatNumber(row.ptn_um)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center border-r border-slate-200">
                        {formatNumber(row.uin)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center border-r border-slate-200">
                        {formatNumber(row.pts)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_akmil)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_akpol)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_stan)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_stpdn)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_sttd)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">{formatNumber(row.kedinasan_stis)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center border-r border-slate-200">
                        {formatNumber(row.kedinasan_lainnya)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center border-r border-slate-200">
                        {formatNumber(row.bekerja)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">
                        {formatNumber(row.belum_bekerja)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Branding Sekolah Tab
function BrandingSekolahTab({ profilData }: { profilData?: any }) {
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

  // Extract branding data from profilData
  let brandingList: any[] = [];
  
  if (profilData?.detail && Array.isArray(profilData.detail)) {
    // Merge with options to ensure all branding options are shown
    brandingList = brandingOptions.map((option) => {
      const found = profilData.detail.find(
        (item: any) => item.id === option.id || item.nama === option.label
      );
      return {
        id: option.id,
        nama: option.label,
        status: found ? Boolean(found.status ?? found.ada ?? found.value ?? found.ya) : false,
      };
    });
  } else {
    // Default: all false
    brandingList = brandingOptions.map((option) => ({
      id: option.id,
      nama: option.label,
      status: false,
    }));
  }

  return (
    <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900 text-center md:text-center">Branding Sekolah</CardTitle>
        <CardDescription className="text-slate-600 text-center md:text-center">Daftar branding yang diterapkan di sekolah</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full max-w-2xl mx-auto border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 w-[75%]">Nama Branding</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 w-[25%]">Ya/ Tidak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {brandingList.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-sm text-slate-500">
                    Belum ada data branding sekolah yang diinput.
                  </td>
                </tr>
              ) : (
                brandingList.map((branding) => (
                  <tr key={branding.id || branding.nama}>
                    <td className="px-6 py-3 text-sm text-slate-700">{branding.nama}</td>
                    <td className="px-6 py-3 text-center">
                      {branding.status ? (
                        <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700 border border-green-200">
                          Ya
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 border border-slate-200">
                          Tidak
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Kokurikuler Tab
function KokurikulerTab({ profilData }: { profilData?: any }) {
  const kegiatanOptions = [
    { id: "7-kebiasaan", nama: "7 Kebiasaan Anak Indonesia Hebat" },
    { id: "projek-kolaboratif", nama: "Projek Kolaboratif Antar Mapel" },
    { id: "penguatan-budaya", nama: "Penguatan Budaya Sekolah" },
  ];

  const kelasList = ["X", "XI", "XII", "XIII"];

  // Extract kokurikuler data from profilData
  let kokurikulerData: any[] = [];
  
  if (profilData?.detail && Array.isArray(profilData.detail)) {
    // Merge with options to ensure all kegiatan are shown
    kokurikulerData = kegiatanOptions.map((option) => {
      const found = profilData.detail.find(
        (item: any) => item.id === option.id || item.nama === option.nama
      );
      return {
        id: option.id,
        nama: option.nama,
        kelas: found?.kelas || { X: false, XI: false, XII: false, XIII: false },
      };
    });
  } else {
    // Default: all false
    kokurikulerData = kegiatanOptions.map((option) => ({
      id: option.id,
      nama: option.nama,
      kelas: { X: false, XI: false, XII: false, XIII: false },
    }));
  }

  return (
    <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Kokurikuler</CardTitle>
        <CardDescription className="text-slate-600">Daftar kegiatan kokurikuler per kelas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Jenis Kokurikuler</th>
                {kelasList.map((kelas) => (
                  <th key={kelas} className="px-4 py-3 text-center text-sm font-bold text-slate-900">
                    {kelas}
                  </th>
                ))}
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th></th>
                {kelasList.map((kelas) => (
                  <th key={kelas} className="px-2 py-2 text-center text-xs font-semibold text-slate-700">
                    Ya/Tidak
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kokurikulerData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                    Belum ada data kokurikuler yang diinput oleh sekolah.
                  </td>
                </tr>
              ) : (
                kokurikulerData.map((kokurikuler) => (
                  <tr key={kokurikuler.id || kokurikuler.nama}>
                    <td className="px-4 py-3 text-sm text-slate-700">{kokurikuler.nama}</td>
                    {kelasList.map((kelas) => (
                      <td key={kelas} className="px-4 py-3 text-sm text-slate-700 text-center">
                        {kokurikuler.kelas?.[kelas] ? "Ya" : "Tidak"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Ekstrakurikuler Tab
function EkstrakurikulerTab({ profilData }: { profilData?: any }) {
  const ekstrakurikulerOptions = [
    "Pramuka", "Paskibra", "PKS", "Kesehatan Sekolah (UKS)", "Leadership",
    "Teater", "Kerawitan", "Paduan suara", "Band", "Seni Tari tradisional",
    "Seni Lukis", "Ketoprak", "Seni Pedalangan (Wayang)", "Wayang Orang",
    "Fotografi", "Perfilman", "Tari Modern (dance)", "Pencak Silat",
    "Taekwondo", "Karate", "Yudho", "Kempo", "Tinju", "Sepak Bola",
    "Bola Voley", "Tenis Meja", "Tenis Lapangan",
  ];

  // Extract ekstrakurikuler data from profilData
  let ekstraData: any[] = [];
  
  if (profilData?.detail && Array.isArray(profilData.detail)) {
    // Merge with options to ensure all ekstrakurikuler are shown
    const existingMap = new Map(profilData.detail.map((item: any) => [item.nama, item]));
    
    ekstraData = ekstrakurikulerOptions.map((nama, index) => {
      const found = existingMap.get(nama);
      return found || {
        id: `ekstra-${index + 1}`,
        nama,
        ada: false,
        sifat: "",
        jumlah_peserta: null,
      };
    });
    
    // Add any custom ekstrakurikuler that aren't in the default list
    profilData.detail.forEach((item: any) => {
      if (!ekstrakurikulerOptions.includes(item.nama)) {
        ekstraData.push(item);
      }
    });
  } else {
    // Default: all false
    ekstraData = ekstrakurikulerOptions.map((nama, index) => ({
      id: `ekstra-${index + 1}`,
      nama,
      ada: false,
      sifat: "",
      jumlah_peserta: null,
    }));
  }

  return (
    <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Ekstrakurikuler</CardTitle>
        <CardDescription className="text-slate-600">Daftar kegiatan ekstrakurikuler yang tersedia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">No.</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Jenis Ekstrakurikuler</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Keberadaan</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Sifat</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Jumlah Peserta</th>
              </tr>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th></th>
                <th></th>
                <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Ada/ Tidak</th>
                <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700">Wajib/Pilihan</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ekstraData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                    Belum ada data ekstrakurikuler yang diinput oleh sekolah.
                  </td>
                </tr>
              ) : (
                ekstraData.map((ekstra, index) => (
                  <tr key={ekstra.id || ekstra.nama || index}>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{ekstra.nama || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      {ekstra.ada ? "Ada" : "Tidak"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      {ekstra.sifat || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">
                      {ekstra.jumlah_peserta != null ? formatNumber(toNumber(ekstra.jumlah_peserta)) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Rapor Pendidikan Tab
function RaporPendidikanTab({ profilData }: { profilData?: any }) {
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

  // Extract rapor data from profilData
  let raporData: any[] = [];
  
  if (profilData?.detail && Array.isArray(profilData.detail)) {
    // Merge with indikator list to ensure all indikators are shown
    const existingMap = new Map(profilData.detail.map((item: any) => [item.id, item]));
    
    raporData = indikatorList.map((indikator) => {
      const found = existingMap.get(indikator.id);
      return found || {
        id: indikator.id,
        indikator: indikator.indikator,
        capaian: "",
        skor: null,
        skor_tahun_lalu: null,
        catatan: "",
      };
    });
    
    // Add any custom indikators that aren't in the default list
    profilData.detail.forEach((item: any) => {
      if (!indikatorList.some(ind => ind.id === item.id)) {
        raporData.push(item);
      }
    });
  } else {
    // Default: all empty
    raporData = indikatorList.map((indikator) => ({
      id: indikator.id,
      indikator: indikator.indikator,
      capaian: "",
      skor: null,
      skor_tahun_lalu: null,
      catatan: "",
    }));
  }

  // Calculate perubahan (difference between current and previous year)
  const calculatePerubahan = (skor: number | null, skorTahunLalu: number | null) => {
    if (skor == null || skorTahunLalu == null) return null;
    return skor - skorTahunLalu;
  };

  const getKeterangan = (perubahan: number | null) => {
    if (perubahan == null) return "-";
    if (perubahan > 0) return "Naik";
    if (perubahan < 0) return "Turun";
    return "Tetap";
  };

  return (
    <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">Laporan Rapor Pendidikan</CardTitle>
        <CardDescription className="text-slate-600">Data indikator capaian rapor pendidikan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">No</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-900">Indikator Utama</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Hasil Capaian<br/>(Baik/Sedang/Kurang)</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Skor Tahun Ini</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Skor Tahun Lalu</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Perubahan</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-slate-900">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {raporData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                    Belum ada data rapor pendidikan yang diinput oleh sekolah.
                  </td>
                </tr>
              ) : (
                raporData.map((item) => {
                  const skor = toNumber(item.skor ?? item.skor_tahun_ini);
                  const skorTahunLalu = toNumber(item.skor_tahun_lalu);
                  const perubahan = calculatePerubahan(skor, skorTahunLalu);
                  const keterangan = getKeterangan(perubahan);
                  
                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{item.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{item.indikator || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">
                        {item.capaian || item.hasil_capaian || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">
                        {skor != null ? formatNumber(skor) : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">
                        {skorTahunLalu != null ? formatNumber(skorTahunLalu) : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">
                        {perubahan != null ? (perubahan > 0 ? "+" : "") + formatNumber(perubahan) : "-"}
                      </td>
                      <td className={`px-4 py-3 text-sm text-slate-700 text-center ${
                        keterangan === "Naik" ? "bg-green-50" : 
                        keterangan === "Turun" ? "bg-red-50" : 
                        keterangan === "Tetap" ? "bg-yellow-50" : ""
                      }`}>
                        {keterangan}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
