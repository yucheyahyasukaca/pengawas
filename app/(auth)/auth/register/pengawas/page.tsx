"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function RegisterPengawasPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const response = await fetch("/api/auth/register/pengawas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email.trim(),
          password: password,
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.2),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.6),transparent_50%)]" />

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
                Daftar sebagai Pengawas
              </h2>
              <p className="text-white/80">
                Bergabunglah dengan komunitas pengawas sekolah untuk mengelola dan memantau sekolah binaan Anda.
              </p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle2 className="size-5 text-indigo-400" />
              <span>Kelola data sekolah binaan</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle2 className="size-5 text-indigo-400" />
              <span>Input rencana dan pelaporan kepengawasan</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle2 className="size-5 text-indigo-400" />
              <span>Akses dashboard dan statistik lengkap</span>
            </div>
          </div>
        </div>

        <Card className="border-0 bg-white/95 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
                <UserPlus className="size-5" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Registrasi Pengawas</CardTitle>
            </div>
            <CardDescription className="text-slate-600">
              Buat akun baru untuk mengakses dashboard pengawas
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
                      Akun Anda sudah aktif dan siap digunakan. Anda dapat langsung login untuk melanjutkan.
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
                      className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                      className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                      className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                  className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Mendaftarkan..." : "Daftar sebagai Pengawas"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-center text-sm text-slate-700">
              Sudah punya akun?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
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

