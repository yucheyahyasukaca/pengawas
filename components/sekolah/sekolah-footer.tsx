"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";

export function SekolahFooter() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="sticky bottom-0 z-30 border-t border-green-100 bg-white/80 px-4 py-2.5 text-slate-600 backdrop-blur md:bg-gradient-to-r md:from-green-50/95 md:via-white/95 md:to-emerald-50/95 md:px-6 md:py-3 md:supports-[backdrop-filter]:bg-gradient-to-r md:supports-[backdrop-filter]:from-green-50/90 md:supports-[backdrop-filter]:via-white/90 md:supports-[backdrop-filter]:to-emerald-50/90">
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent md:inset-x-6" />
      {/* Mobile: Just version and hosted */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2 text-[10px] text-slate-500 md:hidden">
        <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-600">
          v{siteConfig.version}
        </span>
        <span className="text-green-200">•</span>
        <span className="text-slate-500">
          Hosted at{" "}
          <Link
            href="https://garuda-21.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-green-600 hover:text-green-700 transition-colors"
          >
            GARUDA-21.com
          </Link>
        </span>
      </div>
      {/* Desktop: Full info */}
      <div className="mx-auto hidden w-full max-w-6xl md:flex flex-row items-center justify-between text-[11px] text-slate-600">
        <p className="font-medium text-green-700">
          &copy; {currentYear || new Date().getFullYear()} MKPS SMA & SLB Provinsi Jawa Tengah. Hak cipta dilindungi.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-medium text-green-600 ring-1 ring-green-100">
            Versi {siteConfig.version}
          </span>
          <span className="text-green-200">•</span>
          <span className="text-slate-600">
            Hosted at{" "}
            <Link
              href="https://garuda-21.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-green-600 hover:text-green-700 underline-offset-2 hover:underline transition-colors"
            >
              GARUDA-21.com
            </Link>{" "}
            Cloud Server
          </span>
        </div>
      </div>
    </footer>
  );
}

