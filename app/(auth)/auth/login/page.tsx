import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Masuk",
  description:
    "Masuk ke portal SIP-Kepengawasan Jawa Tengah dan kelola aktivitas kepengawasan Anda secara terpadu.",
};

export default function LoginPage() {
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
            <form className="space-y-5" action="#" method="post">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80" htmlFor="email">
                  Email Pengawas
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/50 focus:bg-white/15 focus:ring-2 focus:ring-white/30"
                  placeholder="nama.pengawas@jatengprov.go.id"
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
                  className="block w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/50 focus:bg-white/15 focus:ring-2 focus:ring-white/30"
                  placeholder="Masukkan kata sandi"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 bg-white/10 text-[#F7CDD0] focus:ring-1 focus:ring-white/40"
                />
                <label htmlFor="remember" className="text-sm text-white/75">
                  Ingat saya pada perangkat ini
                </label>
              </div>

              <Button type="submit" className="w-full rounded-xl bg-[#F7CDD0] py-6 text-base font-semibold text-[#4A1B1C] shadow-lg shadow-black/30 transition hover:bg-[#f4bbc4]">
                Masuk Sekarang
              </Button>
            </form>
          </CardContent>
          <CardFooter className="mt-2 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
            >
              ← Kembali ke Beranda
            </Link>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-[0.35em] text-white/50">
                ATAU
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid gap-3 text-sm text-white/80">
              <Link
                href="/auth/register"
                className="flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-4 py-3 font-medium transition hover:border-white/40 hover:bg-white/10"
              >
                Daftar sebagai Pengawas Baru
              </Link>
              <Link
                href="/auth/admin"
                className="flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-4 py-3 font-medium transition hover:border-white/40 hover:bg-white/10"
              >
                Masuk sebagai Admin MKPS
              </Link>
            </div>
            <p className="text-center text-xs text-white/60">
              Dengan masuk, Anda menyetujui kebijakan privasi dan tata kelola data {siteConfig.shortName}.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


