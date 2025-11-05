"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle, AlertCircle, Mail, User, FileText, MapPin, School, Save, ChevronDown, Search, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Daftar KCD Wilayah
const KCD_WILAYAH_OPTIONS = Array.from({ length: 13 }, (_, i) => `KCD Wilayah ${i + 1}`);

interface UserData {
  id: string;
  email: string;
  nama: string | null;
  nip: string | null;
  role: string;
  status_approval: string;
  metadata: Record<string, any> | null;
}

export default function PendingApprovalPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'rejected' | 'approved' | 'loading'>('loading');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [kcdWilayah, setKcdWilayah] = useState("");
  const [sekolahBinaan, setSekolahBinaan] = useState<Array<{id: string; nama: string; npsn: string}>>([]);
  
  // KCD Wilayah combobox state
  const [kcdWilayahInput, setKcdWilayahInput] = useState("");
  const [isKcdDropdownOpen, setIsKcdDropdownOpen] = useState(false);
  
  // Sekolah Binaan combobox state
  const [sekolahList, setSekolahList] = useState<Array<{id: string; nama_sekolah: string; npsn: string; status: string; jenjang: string; kabupaten_kota: string}>>([]);
  const [isSekolahDropdownOpen, setIsSekolahDropdownOpen] = useState(false);
  const [isLoadingSekolah, setIsLoadingSekolah] = useState(false);
  const [sekolahSearchQuery, setSekolahSearchQuery] = useState("");
  const [isSekolahListLoaded, setIsSekolahListLoaded] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      console.log("PendingApprovalPage: Checking status...");
      const supabase = createSupabaseBrowserClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      console.log("PendingApprovalPage: Auth check", { hasUser: !!user, error: authError?.message });

      if (authError || !user) {
        console.log("PendingApprovalPage: No user, redirecting to login");
        router.push("/auth/login");
        return;
      }

      // Fetch user data from API route that bypasses RLS
      const response = await fetch('/api/auth/get-current-user');
      
      if (!response.ok) {
        console.error("PendingApprovalPage: Error fetching user data from API");
        // If API fails, assume pending status
        setStatus('pending');
        return;
      }

      const data = await response.json();
      const fetchedUserData = data.user;

      if (!fetchedUserData) {
        console.log("PendingApprovalPage: No user data, using default pending status");
        setStatus('pending');
        return;
      }

      if (fetchedUserData.role !== 'pengawas') {
        router.push("/pengawas");
        return;
      }

      const approvalStatus = fetchedUserData.status_approval || 'pending';
      
      if (approvalStatus === 'approved') {
        router.push("/pengawas");
        return;
      }

      setUserData(fetchedUserData);
      setStatus(approvalStatus as 'pending' | 'rejected');

      // Check if profile data is complete
      const isProfileComplete = checkProfileComplete(fetchedUserData);
      setShowForm(!isProfileComplete);

      // Load existing data if available
      if (!isProfileComplete) {
        setNama(fetchedUserData.nama || "");
        setNip(fetchedUserData.nip || "");
        const metadata = fetchedUserData.metadata as Record<string, any> | null;
        const wilayahTugas = metadata?.wilayah_tugas || "";
        setKcdWilayah(wilayahTugas);
        setKcdWilayahInput(wilayahTugas);
        // Convert existing sekolah binaan (string array) to object array
        const existingSekolah = metadata?.sekolah_binaan || [];
        if (Array.isArray(existingSekolah) && existingSekolah.length > 0) {
          // If it's already object array, use it; otherwise convert string to object
          const convertedSekolah = existingSekolah.map((s: any) => {
            if (typeof s === 'string') {
              return { id: '', nama: s, npsn: '' };
            }
            return { id: s.id || '', nama: s.nama || s.nama_sekolah || '', npsn: s.npsn || '' };
          });
          setSekolahBinaan(convertedSekolah);
        }
      }
      
      // Load sekolah list if not already loaded
      if (!isSekolahListLoaded) {
        loadSekolahList();
      }
    } catch (err) {
      console.error("Check status error:", err);
      setStatus('loading');
    }
  };

  const checkProfileComplete = (data: UserData): boolean => {
    // Check if all required fields are filled
    const hasNama = data.nama && data.nama.trim().length > 0;
    const hasNip = data.nip && data.nip.trim().length > 0;
    const metadata = data.metadata as Record<string, any> | null;
    const hasKcdWilayah = metadata?.wilayah_tugas && metadata.wilayah_tugas.trim().length > 0;
    const hasSekolahBinaan = metadata?.sekolah_binaan && 
      Array.isArray(metadata.sekolah_binaan) && 
      metadata.sekolah_binaan.length > 0;

    return hasNama && hasNip && hasKcdWilayah && hasSekolahBinaan;
  };

  // Load sekolah list from API (only once, then filter client-side)
  const loadSekolahList = async () => {
    if (isSekolahListLoaded) return; // Already loaded, no need to reload
    
    try {
      setIsLoadingSekolah(true);
      const response = await fetch('/api/sekolah/list');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Gagal memuat data sekolah' }));
        console.error("Error loading sekolah list:", errorData.error || 'Gagal memuat data sekolah');
        setSekolahList([]);
        return;
      }
      
      const data = await response.json();
      if (data.success && data.sekolah) {
        setSekolahList(data.sekolah);
        setIsSekolahListLoaded(true);
      } else {
        console.error("Error loading sekolah list: Invalid response format");
        setSekolahList([]);
      }
    } catch (err) {
      console.error("Error loading sekolah list:", err);
      setSekolahList([]);
    } finally {
      setIsLoadingSekolah(false);
    }
  };

  // Filter sekolah options based on search (client-side filtering - much faster)
  const filteredSekolahOptions = useMemo(() => {
    return sekolahList.filter(sekolah => {
      const isSelected = sekolahBinaan.some(s => s.id === sekolah.id || s.nama === sekolah.nama_sekolah);
      if (isSelected) return false; // Don't show already selected schools
      
      if (!sekolahSearchQuery.trim()) return true;
      
      const query = sekolahSearchQuery.toLowerCase();
      return (
        sekolah.nama_sekolah.toLowerCase().includes(query) ||
        sekolah.npsn.toLowerCase().includes(query) ||
        sekolah.kabupaten_kota.toLowerCase().includes(query)
      );
    });
  }, [sekolahList, sekolahBinaan, sekolahSearchQuery]);

  const handleSekolahSearchChange = (value: string) => {
    setSekolahSearchQuery(value);
    setIsSekolahDropdownOpen(true);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // No need to debounce client-side filtering - it's instant!
    // Just ensure data is loaded if not already loaded
    if (!isSekolahListLoaded && !isLoadingSekolah) {
      loadSekolahList();
    }
  };

  const handleSelectSekolah = (sekolah: {id: string; nama_sekolah: string; npsn: string}) => {
    // Check if already selected
    const isSelected = sekolahBinaan.some(s => s.id === sekolah.id || s.nama === sekolah.nama_sekolah);
    if (isSelected) return;
    
    setSekolahBinaan([...sekolahBinaan, {
      id: sekolah.id,
      nama: sekolah.nama_sekolah,
      npsn: sekolah.npsn
    }]);
    setSekolahSearchQuery("");
    setIsSekolahDropdownOpen(false);
  };

  const handleRemoveSekolah = (id: string) => {
    setSekolahBinaan(sekolahBinaan.filter(s => s.id !== id));
  };

  // Filter KCD Wilayah options based on input
  const filteredKcdOptions = kcdWilayahInput.trim()
    ? KCD_WILAYAH_OPTIONS.filter(option =>
        option.toLowerCase().includes(kcdWilayahInput.toLowerCase())
      )
    : KCD_WILAYAH_OPTIONS;

  const handleKcdWilayahSelect = (option: string) => {
    setKcdWilayah(option);
    setKcdWilayahInput(option);
    setIsKcdDropdownOpen(false);
  };

  const handleKcdWilayahInputChange = (value: string) => {
    setKcdWilayahInput(value);
    setKcdWilayah(value);
    setIsKcdDropdownOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validasi
    if (!nama.trim()) {
      setError("Nama lengkap dengan gelar harus diisi");
      setIsLoading(false);
      return;
    }

    if (!nip.trim()) {
      setError("NIP harus diisi");
      setIsLoading(false);
      return;
    }

    if (!kcdWilayah.trim()) {
      setError("KCD Wilayah harus diisi");
      setIsLoading(false);
      return;
    }

    if (sekolahBinaan.length === 0) {
      setError("Minimal harus ada 1 sekolah binaan");
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

      // Update profil via API - convert sekolah binaan to array of names for compatibility
      const sekolahBinaanNames = sekolahBinaan.map(s => s.nama);
      
      const response = await fetch('/api/auth/update-profil-pengawas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: nama.trim(),
          nip: nip.trim(),
          wilayah_tugas: kcdWilayah.trim(),
          sekolah_binaan: sekolahBinaanNames,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal menyimpan data profil");
        setIsLoading(false);
        return;
      }

      // Success - reload status
      await checkStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data");
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(241,176,183,0.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(181,55,64,0.2),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(58,12,14,0.6),transparent_50%)]" />
        <div className="relative z-10 text-center">
          <div className="inline-flex size-12 animate-spin items-center justify-center rounded-full border-4 border-[#F1B0B7]/30 border-t-[#B53740]">
            <div className="size-8 rounded-full bg-[#F1B0B7]/20" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-700">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show form if profile data is incomplete
  if (showForm && status === 'pending') {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Background gradients - same as login page */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(241,176,183,0.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(181,55,64,0.2),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(58,12,14,0.6),transparent_50%)]" />
        
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <Card className="border border-white/20 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur-xl sm:bg-white/90">
            <CardHeader className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B53740]/10 via-[#F1B0B7]/20 to-[#B53740]/10 backdrop-blur-sm shadow-lg shadow-[#B53740]/10">
                  <User className="size-8 text-[#B53740]" />
                </div>
                <div className="flex-1 space-y-2">
                  <CardTitle className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                    Lengkapi Data Profil
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-slate-600 sm:text-base">
                    Silakan lengkapi data profil Anda untuk melanjutkan proses pendaftaran
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitForm} className="space-y-6">
                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200/50 bg-red-50/80 p-4 text-sm text-red-800 backdrop-blur-sm shadow-sm">
                    <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-600" />
                    <span className="flex-1 leading-relaxed">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="nama" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <User className="size-4 text-[#B53740]" />
                    Nama Lengkap dengan Gelar <span className="text-[#B53740]">*</span>
                  </label>
                  <input
                    id="nama"
                    type="text"
                    placeholder="Contoh: Dr. Ahmad Fauzi, M.Pd"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="nip" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="size-4 text-[#B53740]" />
                    NIP <span className="text-[#B53740]">*</span>
                  </label>
                  <input
                    id="nip"
                    type="text"
                    placeholder="Contoh: 196512151988031001"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="kcdWilayah" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="size-4 text-[#B53740]" />
                    KCD Wilayah <span className="text-[#B53740]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="kcdWilayah"
                      type="text"
                      placeholder="Ketik atau pilih KCD Wilayah..."
                      value={kcdWilayahInput}
                      onChange={(e) => handleKcdWilayahInputChange(e.target.value)}
                      onFocus={() => setIsKcdDropdownOpen(true)}
                      onBlur={() => {
                        // Delay closing to allow click on dropdown items
                        setTimeout(() => setIsKcdDropdownOpen(false), 200);
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                      disabled={isLoading}
                    />
                    <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    
                    {/* Dropdown Options */}
                    {isKcdDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                        {filteredKcdOptions.length > 0 ? (
                          <div className="py-1">
                            {filteredKcdOptions.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => handleKcdWilayahSelect(option)}
                                onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from firing
                                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-[#F1B0B7]/10 hover:text-[#B53740] focus:bg-[#F1B0B7]/10 focus:text-[#B53740] focus:outline-none"
                                disabled={isLoading}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-sm text-slate-500">
                            Tidak ditemukan. Pilih dari: {KCD_WILAYAH_OPTIONS.join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!kcdWilayahInput && (
                    <p className="text-xs text-slate-500">Pilih KCD Wilayah I sampai XIII</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <School className="size-4 text-[#B53740]" />
                    Sekolah Binaan <span className="text-[#B53740]">*</span>
                  </label>
                  
                  {/* Selected Schools */}
                  {sekolahBinaan.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {sekolahBinaan.map((sekolah) => (
                        <div
                          key={sekolah.id || sekolah.nama}
                          className="group flex items-center gap-2 rounded-xl border border-[#F1B0B7]/30 bg-gradient-to-r from-[#F1B0B7]/10 to-[#F1B0B7]/5 px-3 py-2 shadow-sm transition-all hover:from-[#F1B0B7]/20 hover:to-[#F1B0B7]/10"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900">{sekolah.nama}</div>
                            {sekolah.npsn && (
                              <div className="text-xs text-slate-500 mt-0.5">NPSN: {sekolah.npsn}</div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSekolah(sekolah.id || sekolah.nama)}
                            className="flex shrink-0 items-center justify-center size-6 rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            disabled={isLoading}
                            title="Hapus"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Searchable Dropdown */}
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Ketik untuk mencari sekolah (NPSN, nama sekolah, atau kabupaten)..."
                        value={sekolahSearchQuery}
                        onChange={(e) => handleSekolahSearchChange(e.target.value)}
                        onFocus={() => {
                          setIsSekolahDropdownOpen(true);
                          if (!isSekolahListLoaded && !isLoadingSekolah) {
                            loadSekolahList();
                          }
                        }}
                        onBlur={() => {
                          // Delay closing to allow click on dropdown items
                          setTimeout(() => setIsSekolahDropdownOpen(false), 200);
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-[#B53740] focus:outline-none focus:ring-2 focus:ring-[#B53740]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || isLoadingSekolah}
                      />
                      <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    
                    {/* Dropdown Options */}
                    {isSekolahDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                        {isLoadingSekolah && !isSekolahListLoaded ? (
                          <div className="px-4 py-3 text-sm text-slate-500 text-center">
                            <div className="inline-flex size-4 animate-spin items-center justify-center rounded-full border-2 border-slate-200 border-t-[#B53740]"></div>
                            <span className="ml-2">Memuat data sekolah...</span>
                          </div>
                        ) : filteredSekolahOptions.length > 0 ? (
                          <div className="py-1">
                            {filteredSekolahOptions.map((sekolah) => (
                              <button
                                key={sekolah.id}
                                type="button"
                                onClick={() => handleSelectSekolah(sekolah)}
                                onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from firing
                                className="w-full px-4 py-3 text-left transition-colors hover:bg-[#F1B0B7]/10 focus:bg-[#F1B0B7]/10 focus:outline-none"
                                disabled={isLoading}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-900">{sekolah.nama_sekolah}</div>
                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                      <span className="font-mono">NPSN: {sekolah.npsn}</span>
                                      <span className="text-slate-300">•</span>
                                      <span>{sekolah.kabupaten_kota}</span>
                                      <span className="text-slate-300">•</span>
                                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{sekolah.jenjang}</span>
                                      <span className="text-slate-300">•</span>
                                      <span className={sekolah.status === 'Negeri' ? 'text-blue-600' : 'text-purple-600'}>
                                        {sekolah.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-3 text-sm text-slate-500 text-center">
                            {sekolahSearchQuery.trim() 
                              ? "Tidak ada sekolah yang ditemukan" 
                              : "Ketik untuk mencari sekolah..."}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {sekolahBinaan.length === 0 && (
                    <p className="text-xs text-slate-500">Minimal harus ada 1 sekolah binaan</p>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-6">
                  <Button
                    type="submit"
                    className="w-full rounded-xl border-0 bg-gradient-to-r from-[#B53740] to-[#8B2A31] px-6 py-3 font-semibold text-white shadow-lg shadow-[#B53740]/25 transition-all hover:from-[#8B2A31] hover:to-[#6B1F24] hover:shadow-xl hover:shadow-[#B53740]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Menyimpan...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="size-4" />
                        Simpan dan Lanjutkan
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show pending approval page if profile is complete
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      {/* Background gradients - same as login page */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(241,176,183,0.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(181,55,64,0.2),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(58,12,14,0.6),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="border border-white/20 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur-xl sm:bg-white/90">
          <CardHeader className="space-y-6 text-center">
            {status === 'pending' ? (
              <>
                <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F1B0B7]/20 via-[#F1B0B7]/10 to-[#B53740]/10 backdrop-blur-sm shadow-lg shadow-[#F1B0B7]/20">
                  <Clock className="size-10 text-[#B53740] animate-pulse" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                    Menunggu Persetujuan Admin
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-slate-600 sm:text-base">
                    Pendaftaran Anda sedang dalam proses review oleh admin
                  </CardDescription>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100/50 via-red-50/30 to-red-100/50 backdrop-blur-sm shadow-lg shadow-red-100/20">
                  <XCircle className="size-10 text-red-600" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                    Pendaftaran Ditolak
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-slate-600 sm:text-base">
                    Pendaftaran Anda tidak disetujui oleh admin
                  </CardDescription>
                </div>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {status === 'pending' ? (
              <>
                <div className="rounded-xl border border-[#F1B0B7]/30 bg-gradient-to-br from-[#F1B0B7]/10 via-[#F1B0B7]/5 to-transparent p-5 shadow-sm backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F1B0B7]/20">
                      <AlertCircle className="size-5 text-[#B53740]" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Status: Menunggu Persetujuan
                      </p>
                      <p className="text-sm leading-relaxed text-slate-600">
                        Admin akan memeriksa data pendaftaran Anda. Setelah disetujui, Anda akan dapat mengakses dashboard pengawas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-xl border border-slate-200/50 bg-slate-50/50 p-5 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Langkah selanjutnya:
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#F1B0B7]/20">
                        <CheckCircle2 className="size-3 text-[#B53740]" />
                      </div>
                      <span className="leading-relaxed">Data profil Anda sudah lengkap</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#F1B0B7]/20">
                        <CheckCircle2 className="size-3 text-[#B53740]" />
                      </div>
                      <span className="leading-relaxed">Tunggu admin memproses pendaftaran Anda</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#F1B0B7]/20">
                        <CheckCircle2 className="size-3 text-[#B53740]" />
                      </div>
                      <span className="leading-relaxed">Anda akan menerima notifikasi setelah status berubah</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    onClick={checkStatus}
                    className="w-full rounded-xl border-0 bg-gradient-to-r from-[#B53740] to-[#8B2A31] px-6 py-3 font-semibold text-white shadow-lg shadow-[#B53740]/25 transition-all hover:from-[#8B2A31] hover:to-[#6B1F24] hover:shadow-xl hover:shadow-[#B53740]/30"
                  >
                    Refresh Status
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
                    asChild
                  >
                    <Link href="/auth/login">
                      Kembali ke Login
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-red-200/50 bg-gradient-to-br from-red-50/80 via-red-50/50 to-transparent p-5 shadow-sm backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100/50">
                      <AlertCircle className="size-5 text-red-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Pendaftaran Tidak Disetujui
                      </p>
                      <p className="text-sm leading-relaxed text-slate-600">
                        Jika Anda merasa ini adalah kesalahan, silakan hubungi admin untuk informasi lebih lanjut.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
                    asChild
                  >
                    <Link href="mailto:mkps@garuda-21.com" className="flex items-center justify-center gap-2">
                      <Mail className="size-4" />
                      Hubungi Admin
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
                    asChild
                  >
                    <Link href="/auth/login">
                      Kembali ke Login
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

