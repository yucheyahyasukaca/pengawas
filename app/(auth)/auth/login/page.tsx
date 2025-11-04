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
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validasi client-side
    if (!email || !password) {
      setError("Email dan password harus diisi");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email.trim(), // Jangan lowercase, Supabase Auth case-sensitive
          password: password 
        }),
      });

      // Parse response
      let data;
      try {
        data = await response.json();
        console.log("Login page: Response data", { 
          success: data.success, 
          role: data.role, 
          redirectTo: data.redirectTo,
          hasSession: !!data.session
        });
      } catch (parseError) {
        console.error("Parse response error:", parseError);
        setError("Terjadi kesalahan saat memproses respons dari server");
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        // Pesan error yang lebih user-friendly
        let errorMessage = data.error || "Gagal masuk";
        
        if (errorMessage.includes("Invalid login credentials") || errorMessage.includes("Email atau kata sandi salah")) {
          errorMessage = "Email atau kata sandi salah. Pastikan akun sudah terdaftar di sistem. Jika belum memiliki akun, hubungi admin MKPS.";
        }
        
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Set session di client-side menggunakan Supabase browser client
      if (data.session) {
        const supabase = createSupabaseBrowserClient();
        
        // Set session di browser client
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        if (sessionError) {
          console.error("Set session error:", sessionError);
          setError("Gagal membuat session. Silakan coba lagi.");
          setIsLoading(false);
          return;
        }
      }

      // Redirect berdasarkan role dari response
      if (data.redirectTo) {
        console.log("Login page: Redirecting to:", data.redirectTo);
        // Use window.location for full page reload to ensure session is properly set
        window.location.href = data.redirectTo;
      } else {
        // Fallback redirect berdasarkan role
        let fallbackPath = "/dashboard";
        switch (data.role) {
          case "admin":
            fallbackPath = "/admin";
            break;
          case "pengawas":
            // Default untuk pengawas adalah pending-approval jika tidak ada redirectTo
            fallbackPath = "/pengawas/pending-approval";
            break;
          case "korwas_cabdin":
            fallbackPath = "/korwas-cabdin";
            break;
          case "sekolah":
            fallbackPath = "/sekolah";
            break;
          default:
            fallbackPath = "/dashboard";
        }
        console.log("Login page: Fallback redirecting to:", fallbackPath);
        window.location.href = fallbackPath;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(241,176,183,0.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(181,55,64,0.2),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(58,12,14,0.6),transparent_50%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/90 p-2 shadow-lg shadow-black/30">
                <Image
                  src="/jateng.png"
                  alt="Logo Provinsi Jawa Tengah"
                  width={56}
                  height={56}
                  priority
                />
              </span>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-white/70">
                  SIP-Kepengawasan
                </p>
                <p className="text-lg font-semibold text-white">{siteConfig.name}</p>
              </div>
            </div>

            <div className="mt-10 space-y-4 text-balance text-white">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                Portal Pengawas Jawa Tengah
              </h1>
              <p className="text-base text-white/80 sm:text-lg">
                Kelola agenda supervisi, unggah laporan, dan kolaborasi dengan sesama pengawas dalam satu sistem terpadu.
              </p>
            </div>

            <dl className="mt-10 grid gap-4 text-sm text-white/85 sm:grid-cols-2">
              {["Monitoring Binaan", "Pelaporan Otomatis", "Analitik Real-time", "Kolaborasi Regional"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 shadow-inner shadow-black/10"
                  >
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                      ✓
                    </div>
                    <dt className="font-medium text-white/90">{item}</dt>
                  </div>
                ),
              )}
            </dl>
          </div>

          <p className="mt-10 text-xs text-white/60">
            Dukungan 24/7 via Admin MKPS · Terhubung dengan Cabdin seluruh Jawa Tengah
          </p>
        </div>

        <Card className="border-white/10 bg-black/60 text-white shadow-lg shadow-black/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Masuk ke Akun Anda</CardTitle>
            <CardDescription className="text-sm text-white/70">
              Gunakan kredensial yang terdaftar atau hubungi admin MKPS untuk aktivasi akun baru.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="block w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/50 focus:bg-white/15 focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white/80" htmlFor="password">
                    Kata Sandi
                  </label>
                  <Link
                    href="#"
                    className="text-sm font-medium text-[#F7CDD0] transition hover:text-white"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="block w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/50 focus:bg-white/15 focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Masukkan kata sandi"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-white/30 bg-white/10 text-[#F7CDD0] focus:ring-1 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor="remember" className="text-sm text-white/75">
                  Ingat saya pada perangkat ini
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full rounded-xl bg-[#F7CDD0] py-6 text-base font-semibold text-[#4A1B1C] shadow-lg shadow-black/30 transition hover:bg-[#f4bbc4] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memproses..." : "Masuk Sekarang"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="mt-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-[0.35em] text-white/50">
                ATAU
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid gap-3 text-sm text-white/80">
              <Link
                href="/auth/register/pengawas"
                className="flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-4 py-3 font-medium transition hover:border-white/40 hover:bg-white/10"
              >
                Daftar sebagai Pengawas Baru
              </Link>
            </div>
            <p className="text-center text-xs text-white/60">
              Dengan masuk, Anda menyetujui kebijakan privasi dan tata kelola data {siteConfig.shortName}.
            </p>
            <Button
              variant="ghost"
              className="mt-2 w-full rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white hover:border-white/30 hover:bg-white/15"
              asChild
            >
              <Link href="/">← Kembali ke Beranda</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


