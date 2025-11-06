"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff, School, Search, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SekolahOption {
  id: string;
  nama_sekolah: string;
  npsn: string;
  jenjang: string;
  kabupaten_kota: string;
}

export default function RegisterSekolahPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedSekolah, setSelectedSekolah] = useState<SekolahOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Sekolah selection state
  const [sekolahList, setSekolahList] = useState<SekolahOption[]>([]);
  const [isSekolahDropdownOpen, setIsSekolahDropdownOpen] = useState(false);
  const [isLoadingSekolah, setIsLoadingSekolah] = useState(false);
  const [sekolahSearchQuery, setSekolahSearchQuery] = useState("");
  const sekolahDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSekolahList();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (sekolahDropdownRef.current && !sekolahDropdownRef.current.contains(event.target as Node)) {
        setIsSekolahDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadSekolahList = async () => {
    try {
      setIsLoadingSekolah(true);
      // Use public endpoint that doesn't require authentication
      const response = await fetch('/api/sekolah/public-list');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Gagal memuat daftar sekolah' }));
        throw new Error(errorData.error || 'Gagal memuat daftar sekolah');
      }

      const data = await response.json();
      setSekolahList(data.sekolah || []);
    } catch (err) {
      console.error("Error loading sekolah list:", err);
      setError(err instanceof Error ? err.message : 'Gagal memuat daftar sekolah');
    } finally {
      setIsLoadingSekolah(false);
    }
  };

  const filteredSekolah = sekolahList.filter(sekolah => {
    const searchLower = sekolahSearchQuery.toLowerCase();
    return (
      sekolah.nama_sekolah.toLowerCase().includes(searchLower) ||
      sekolah.npsn.toLowerCase().includes(searchLower) ||
      sekolah.kabupaten_kota.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    // Validasi client-side
    if (!email || !password || !confirmPassword) {
      setError("Semua field harus diisi");
      setIsLoading(false);
      return;
    }

    if (!selectedSekolah) {
      setError("Pilih sekolah terlebih dahulu");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Format email tidak valid");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register/sekolah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email.trim(),
          password: password,
          sekolah_id: selectedSekolah.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal melakukan registrasi");
        setIsLoading(false);
        return;
      }

      // Success
      setSuccess(true);
      setIsLoading(false);

      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat registrasi");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.2),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.6),transparent_50%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-4">
              <Image
                src="/jateng.png"
                alt="Logo Jateng"
                width={64}
                height={64}
                className="h-14 w-14 rounded-xl object-cover shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">{siteConfig.name}</h1>
                <p className="text-sm text-white/80">Sistem Informasi Kepengawasan</p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Daftar sebagai Sekolah
              </h2>
              <p className="text-white/80">
                Bergabunglah dengan sistem untuk mengelola data profil sekolah Anda dan berkolaborasi dengan pengawas sekolah.
              </p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle2 className="size-5 text-green-400" />
              <span>Kelola data profil sekolah</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle2 className="size-5 text-green-400" />
              <span>Berbagi data dengan pengawas sekolah</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle2 className="size-5 text-green-400" />
              <span>Akses dashboard sekolah lengkap</span>
            </div>
          </div>
        </div>

        <Card className="border-0 bg-white/95 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <School className="size-5" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Registrasi Sekolah</CardTitle>
            </div>
            <CardDescription className="text-slate-600">
              Buat akun baru untuk mengakses dashboard sekolah
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4 py-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="size-8 text-green-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Registrasi Berhasil!
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Akun Anda sedang menunggu persetujuan dari admin atau pengawas sekolah. 
                      Anda akan dapat login setelah akun disetujui.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Mengarahkan ke halaman login...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="sekolah" className="text-sm font-medium text-slate-700">
                    Pilih Sekolah <span className="text-red-500">*</span>
                  </label>
                  <div className="relative" ref={sekolahDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsSekolahDropdownOpen(!isSekolahDropdownOpen)}
                      className={cn(
                        "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-left text-sm text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20",
                        !selectedSekolah && "text-slate-400"
                      )}
                      disabled={isLoadingSekolah || isLoading}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn("truncate", !selectedSekolah && "text-slate-400")}>
                          {selectedSekolah 
                            ? `${selectedSekolah.nama_sekolah} (${selectedSekolah.npsn})`
                            : "Pilih sekolah dari daftar..."
                          }
                        </span>
                        <ChevronDown className={cn(
                          "size-4 text-slate-400 transition-transform",
                          isSekolahDropdownOpen && "rotate-180"
                        )} />
                      </div>
                    </button>

                    {isSekolahDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                        <div className="p-2">
                          <div className="relative mb-2">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Cari sekolah..."
                              value={sekolahSearchQuery}
                              onChange={(e) => setSekolahSearchQuery(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {isLoadingSekolah ? (
                              <div className="p-4 text-center text-sm text-slate-500">
                                Memuat daftar sekolah...
                              </div>
                            ) : filteredSekolah.length === 0 ? (
                              <div className="p-4 text-center text-sm text-slate-500">
                                Tidak ada sekolah ditemukan
                              </div>
                            ) : (
                              filteredSekolah.map((sekolah) => (
                                <button
                                  key={sekolah.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedSekolah(sekolah);
                                    setIsSekolahDropdownOpen(false);
                                    setSekolahSearchQuery("");
                                  }}
                                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition"
                                >
                                  <div className="font-medium">{sekolah.nama_sekolah}</div>
                                  <div className="text-xs text-slate-500">
                                    NPSN: {sekolah.npsn} • {sekolah.jenjang} • {sekolah.kabupaten_kota}
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedSekolah && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                      <School className="size-4" />
                      <span className="flex-1">{selectedSekolah.nama_sekolah}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedSekolah(null)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="nama@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      disabled={isLoading}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      disabled={isLoading}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-green-700 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Mendaftarkan..." : "Daftar sebagai Sekolah"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-center text-sm text-slate-700">
              Sudah punya akun?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-green-600 hover:text-green-700 hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
            <p className="text-center text-xs text-slate-600">
              Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang berlaku
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

