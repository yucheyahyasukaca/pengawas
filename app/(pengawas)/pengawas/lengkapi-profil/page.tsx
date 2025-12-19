"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, FileText, MapPin, School, Save, AlertCircle, Search, X, Loader2, Check } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LengkapiProfilPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Form state
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [wilayahTugas, setWilayahTugas] = useState("");
  const [sekolahBinaan, setSekolahBinaan] = useState<string[]>([]);
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/auth/login");
        return;
      }

      // Fetch user data from API route that bypasses RLS
      const response = await fetch('/api/auth/get-current-user');

      if (!response.ok) {
        console.error("LengkapiProfilPage: Error fetching user data from API");
        // If API fails, allow profile completion
        setIsChecking(false);
        return;
      }

      const data = await response.json();
      const userData = data.user;

      if (!userData) {
        console.log("LengkapiProfilPage: No user data, allowing profile completion");
        setIsChecking(false);
        return;
      }

      // Check role
      if (userData.role !== 'pengawas') {
        router.push("/pengawas");
        return;
      }

      // Check status approval
      const statusApproval = userData.status_approval || 'pending';
      if (statusApproval === 'pending' || statusApproval === 'rejected') {
        router.push("/pengawas/pending-approval");
        return;
      }

      // Jika profil sudah lengkap (ada nama) dan bukan mode edit, redirect ke dashboard
      if (userData.nama && !isEditMode) {
        router.push("/pengawas");
        return;
      }

      // Load existing data jika ada
      setNama(userData.nama || "");
      setNip(userData.nip || "");

      if (userData.metadata) {
        const metadata = userData.metadata as Record<string, any>;
        setWilayahTugas(metadata.wilayah_tugas || "");
        setSekolahBinaan(metadata.sekolah_binaan || []);
      }

      setIsChecking(false);
    } catch (err) {
      console.error("Check user error:", err);
      setIsChecking(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowDropdown(true);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/sekolah/list?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.sekolah);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Error searching sekolah:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleSelectSekolah = (sekolahNama: string) => {
    if (!sekolahBinaan.includes(sekolahNama)) {
      setSekolahBinaan([...sekolahBinaan, sekolahNama]);
    }
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleRemoveSekolah = (index: number) => {
    setSekolahBinaan(sekolahBinaan.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!nama.trim()) {
      setError("Nama lengkap harus diisi");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError("Session tidak valid. Silakan login kembali.");
        setIsLoading(false);
        router.push("/auth/login");
        return;
      }

      // Update via API to bypass RLS
      const response = await fetch('/api/auth/update-profil-pengawas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: nama.trim(),
          nip: nip.trim(),
          wilayah_tugas: wilayahTugas.trim(),
          sekolah_binaan: sekolahBinaan,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengupdate profil");
      }

      // Success - check status approval sebelum redirect
      const { data: checkData } = await supabase
        .from('users')
        .select('status_approval')
        .eq('id', session.user.id)
        .single();

      const statusApproval = checkData?.status_approval || 'pending';

      if (statusApproval === 'pending' || statusApproval === 'rejected') {
        router.push("/pengawas/pending-approval");
      } else {
        router.push("/pengawas");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat update profil");
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gradient-to-br from-white via-indigo-50/90 to-blue-50/80 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lengkapi Profil Pengawas</h1>
            <p className="text-sm text-slate-600 mt-1">
              Lengkapi data profil Anda untuk melanjutkan ke dashboard
            </p>
          </div>
        </div>

        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
              <User className="size-5 text-indigo-500" />
              Data Profil
            </CardTitle>
            <CardDescription className="text-slate-600">
              Isi informasi berikut dengan lengkap dan benar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="nama" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User className="size-4 text-indigo-500" />
                  Nama Lengkap dengan Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  id="nama"
                  type="text"
                  placeholder="Contoh: Dr. Ahmad Fauzi, M.Pd"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nip" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FileText className="size-4 text-indigo-500" />
                  NIP
                </label>
                <input
                  id="nip"
                  type="text"
                  placeholder="Contoh: 196512151988031001"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="wilayahTugas" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MapPin className="size-4 text-indigo-500" />
                  Wilayah Tugas
                </label>
                <input
                  id="wilayahTugas"
                  type="text"
                  placeholder="Contoh: Kota Semarang"
                  value={wilayahTugas}
                  onChange={(e) => setWilayahTugas(e.target.value)}
                  className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <School className="size-4 text-indigo-500" />
                  Sekolah Binaan
                </label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Ketik nama sekolah..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      className="w-full rounded-lg border border-indigo-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      disabled={isLoading}
                    />
                  </div>

                  {showDropdown && searchQuery.length >= 2 && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                      {isSearching ? (
                        <div className="flex items-center justify-center p-4 text-slate-500">
                          <Loader2 className="size-4 animate-spin mr-2" />
                          <span className="text-sm">Mencari...</span>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="py-1">
                          {searchResults.map((sekolah) => (
                            <button
                              key={sekolah.id}
                              type="button"
                              onClick={() => handleSelectSekolah(sekolah.nama_sekolah)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 flex items-center justify-between group"
                            >
                              <div>
                                <div className="font-medium text-slate-900">{sekolah.nama_sekolah}</div>
                                <div className="text-xs text-slate-500">NPSN: {sekolah.npsn}</div>
                              </div>
                              {sekolahBinaan.includes(sekolah.nama_sekolah) && (
                                <Check className="size-4 text-indigo-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-slate-500">
                          Tidak ditemukan sekolah dengan nama "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}

                  {showDropdown && searchQuery.length > 0 && searchQuery.length < 2 && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg p-3 text-sm text-slate-500">
                      Ketik minimal 2 karakter untuk mencari
                    </div>
                  )}

                  {/* Backdrop to close dropdown */}
                  {showDropdown && (
                    <div
                      className="fixed inset-0 z-0"
                      onClick={() => setShowDropdown(false)}
                      style={{ pointerEvents: 'auto', background: 'transparent' }}
                    />
                  )}
                </div>
                {sekolahBinaan.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {sekolahBinaan.map((sekolah, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2"
                      >
                        <span className="text-sm text-slate-700">{sekolah}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSekolah(index)}
                          className="text-xs text-red-600 hover:text-red-700"
                          disabled={isLoading}
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <Save className="size-4 mr-2" />
                      Simpan Profil
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                  onClick={() => router.push("/pengawas")}
                  disabled={isLoading}
                >
                  Lewati
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

