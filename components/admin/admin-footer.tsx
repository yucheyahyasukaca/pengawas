import Link from "next/link";

export function AdminFooter() {
  return (
    <footer className="sticky bottom-0 z-30 border-t border-rose-100 bg-white/80 px-4 py-2.5 text-slate-600 backdrop-blur md:bg-gradient-to-r md:from-rose-50/95 md:via-white/95 md:to-amber-50/95 md:px-6 md:py-3 md:supports-[backdrop-filter]:bg-gradient-to-r md:supports-[backdrop-filter]:from-rose-50/90 md:supports-[backdrop-filter]:via-white/90 md:supports-[backdrop-filter]:to-amber-50/90">
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent md:inset-x-6" />
      {/* Mobile: Just version and hosted */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2 text-[10px] text-slate-500 md:hidden">
        <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-600">
          v1.0.0
        </span>
        <span className="text-rose-200">•</span>
        <span className="text-slate-500">
          Hosted at{" "}
          <Link
            href="https://garuda-21.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-rose-600 hover:text-rose-700 transition-colors"
          >
            GARUDA-21.com
          </Link>
        </span>
      </div>
      {/* Desktop: Full info */}
      <div className="mx-auto hidden w-full max-w-6xl md:flex flex-row items-center justify-between text-[11px] text-slate-600">
        <p className="font-medium text-rose-700">
          &copy; {new Date().getFullYear()} MKPS SMA & SLB Provinsi Jawa Tengah. Hak cipta dilindungi.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-medium text-rose-600 ring-1 ring-rose-100">
            Versi 1.0.0
          </span>
          <span className="text-rose-200">•</span>
          <span className="text-slate-600">
            Hosted at{" "}
            <Link
              href="https://garuda-21.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-rose-600 hover:text-rose-700 underline-offset-2 hover:underline transition-colors"
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


