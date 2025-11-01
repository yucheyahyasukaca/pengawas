export function AdminFooter() {
  return (
    <footer className="border-t border-sky-100 bg-white/90 px-6 py-4 text-xs text-slate-600 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-slate-600">
        <p className="font-semibold text-slate-700">
          &copy; {new Date().getFullYear()} MKPS SMA & SLB Provinsi Jawa Tengah. Hak cipta dilindungi.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-sky-100 px-2 py-1 text-[11px] font-semibold text-sky-700 shadow-sm">
            Versi 1.0.0
          </span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="text-slate-600">
            Dashboard ringan & scalable untuk pengelolaan kepengawasan.
          </span>
        </div>
      </div>
    </footer>
  );
}


