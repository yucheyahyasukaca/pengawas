import Link from "next/link";

export function AdminFooter() {
  return (
    <footer className="relative border-t border-rose-100 bg-gradient-to-r from-rose-50 via-white to-amber-50 px-6 py-4 text-xs text-slate-600 backdrop-blur">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-slate-600">
        <p className="font-semibold text-rose-700">
          &copy; {new Date().getFullYear()} MKPS SMA & SLB Provinsi Jawa Tengah. Hak cipta dilindungi.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-rose-600 shadow-sm ring-1 ring-rose-100">
            Versi 1.0.0
          </span>
          <span className="hidden sm:inline text-rose-200">•</span>
          <span className="text-slate-600">
            Hosted at{" "}
            <Link
              href="https://garuda-21.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rose-600 hover:text-rose-700 underline-offset-2 hover:underline transition-colors"
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


