"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export function AdminUnauthorized() {
  // Generate random positions for particles with lazy initialization
  const [particles, setParticles] = useState<Array<{ left: number; top: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 5 + Math.random() * 5,
      }))
    );
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-blue-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1000ms" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-rose-200/10 via-pink-200/10 to-orange-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "500ms" }} />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 -z-10">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-violet-400/30 to-blue-400/30 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 backdrop-blur-xl relative overflow-hidden">
        {/* Decorative gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 opacity-50 blur-xl -z-10" />

        <CardContent className="p-8 sm:p-10 space-y-8">
          {/* Icon with animation */}
          <div className="flex items-center justify-center">
            <div className="relative group">
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />

              {/* Middle ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse" style={{ animationDelay: "300ms" }} />

              {/* Icon container */}
              <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 p-6 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <ShieldAlert className="size-12 text-white animate-bounce-slow" />
              </div>

              {/* Lock icon badge */}
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-full shadow-lg border-4 border-white">
                <Lock className="size-4 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Akses Terbatas
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
                <div className="w-2 h-2 bg-violet-500 rounded-full" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Panel admin hanya dapat diakses oleh pengguna yang telah masuk dengan kredensial yang sesuai.
              Silakan masuk terlebih dahulu untuk melanjutkan.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl font-semibold py-6 text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              <Link href="/auth/login">
                <div className="flex items-center justify-center gap-2">
                  <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Ke Halaman Masuk</span>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full border-2 border-violet-200 bg-white/50 hover:bg-violet-50 hover:border-violet-300 font-medium py-6 text-base transition-all duration-300"
            >
              <Link href="/">
                Kembali ke Beranda
              </Link>
            </Button>
          </div>

          {/* Footer info */}
          <div className="pt-6 border-t border-gradient-to-r from-transparent via-violet-200 to-transparent">
            <p className="text-xs text-center text-slate-500 leading-relaxed">
              Bukan admin? Hubungi administrator sistem untuk mendapatkan akses
            </p>
          </div>
        </CardContent>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-tl-full" />
      </Card>
    </div>
  );
}

