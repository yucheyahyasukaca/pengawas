export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-indigo-50/90 to-blue-50/80">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">404</h1>
        <p className="mt-2 text-slate-600">Halaman tidak ditemukan</p>
        <p className="mt-1 text-sm text-slate-500">Pengawas route not found</p>
      </div>
    </div>
  );
}

