import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlignLeft, ClipboardCheck, Edit3, Globe, Plus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const newsData = [
  {
    id: "BRT-001",
    title: "Sinergi MKPS dan Komite Sekolah untuk Penguatan Literasi",
    author: "Admin MKPS",
    status: "Tayang",
    date: "31 Oktober 2025",
    channel: "Portal Publik",
  },
  {
    id: "BRT-002",
    title: "Pendampingan Implementasi Kurikulum Merdeka di SLB",
    author: "Eka Suryani",
    status: "Draft",
    date: "29 Oktober 2025",
    channel: "Rilis Internal",
  },
  {
    id: "BRT-003",
    title: "Best Practice Penguatan Numerasi di SMA",
    author: "Rudi Hartono",
    status: "Terjadwal",
    date: "28 Oktober 2025",
    channel: "Portal Publik",
  },
  {
    id: "BRT-004",
    title: "Pelatihan Dashboard Pengawasan Berbasis Data",
    author: "Admin MKPS",
    status: "Butuh Review",
    date: "26 Oktober 2025",
    channel: "Portal Publik",
  },
];

export default function NewsManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">Manajemen Berita</CardTitle>
            <CardDescription className="text-slate-600">
              Publikasikan informasi strategis dan dokumentasikan capaian kepengawasan.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              asChild
            >
              <Link href="/admin/berita/lini-massa">
                <Globe className="size-4" />
                Lihat Portal
              </Link>
            </Button>
            <Button
              size="sm"
              variant="default"
              className="gap-2 rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
              asChild
            >
              <Link href="/admin/berita/tulis">
                <Plus className="size-4" />
                Tulis Berita
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Filter:</span>
            <Button
              variant="default"
              size="sm"
              className="rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
            >
              Semua Status
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Tayang
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Draft
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Terjadwal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Butuh Review
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto gap-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Upload className="size-4" />
              Impor dari Dokumen
            </Button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-md shadow-rose-100/70 md:block">
            <table className="w-full border-collapse text-left text-sm text-slate-700">
              <thead className="bg-gradient-to-r from-rose-50 via-white to-amber-50 text-xs font-semibold uppercase tracking-wide text-slate-700">
                <tr>
                  <th className="px-5 py-3 font-semibold">Judul</th>
                  <th className="px-5 py-3 font-semibold">Penulis</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Terbit</th>
                  <th className="px-5 py-3 font-semibold">Channel</th>
                  <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100">
                {newsData.map((news) => (
                  <tr key={news.id} className="hover:bg-rose-50/70">
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-900">
                          {news.title}
                        </span>
                        <span className="text-xs text-slate-600">{news.id}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{news.author}</td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full border-0 px-3 font-semibold shadow-sm",
                          news.status === "Tayang"
                            ? "bg-emerald-200 text-emerald-800"
                            : news.status === "Draft"
                              ? "bg-amber-200 text-amber-800"
                              : news.status === "Terjadwal"
                                ? "bg-sky-200 text-sky-800"
                                : "bg-rose-100 text-rose-600",
                        )}
                      >
                        {news.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{news.date}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{news.channel}</td>
                    <td className="px-5 py-4 text-right text-xs">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-semibold text-slate-700 hover:bg-slate-50"
                          asChild
                        >
                          <Link href={`/admin/berita/${news.id.toLowerCase()}`}>
                            Buka
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                          asChild
                        >
                          <Link href={`/admin/berita/${news.id.toLowerCase()}/edit`}>
                            Ubah
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="flex flex-col gap-3 md:hidden">
            {newsData.map((news) => (
              <div
                key={news.id}
                className="rounded-2xl border border-rose-200 bg-white p-4 shadow-md shadow-rose-100/70"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold leading-tight text-slate-900">
                      {news.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{news.id}</span>
                      <span>•</span>
                      <span>{news.channel}</span>
                      <span>•</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full border-0 px-2.5 text-xs font-semibold shadow-sm",
                          news.status === "Tayang"
                            ? "bg-emerald-200 text-emerald-800"
                            : news.status === "Draft"
                              ? "bg-amber-200 text-amber-800"
                              : news.status === "Terjadwal"
                                ? "bg-sky-200 text-sky-800"
                                : "bg-rose-100 text-rose-600",
                        )}
                      >
                        {news.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 border-t border-rose-100 pt-3">
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 text-xs font-semibold text-slate-500 sm:w-20">
                        Penulis:
                      </span>
                      <span className="flex-1 text-sm text-slate-700 break-words">{news.author}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 text-xs font-semibold text-slate-500 sm:w-20">
                        Terbit:
                      </span>
                      <span className="flex-1 text-sm text-slate-700">{news.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-rose-100 pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 rounded-full border-0 bg-slate-100 px-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                      asChild
                    >
                      <Link href={`/admin/berita/${news.id.toLowerCase()}`}>
                        Buka
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full border-0 bg-slate-100 px-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
                      asChild
                    >
                      <Link href={`/admin/berita/${news.id.toLowerCase()}/edit`}>
                        Ubah
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-3 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <p>Menampilkan 1-4 dari 18 berita.</p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
            >
              Sebelumnya
            </Button>
            <Button
              variant="default"
              size="sm"
              className="rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
            >
              Berikutnya
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <ClipboardCheck className="size-5" />
              Checklist Editorial
            </CardTitle>
            <CardDescription className="text-slate-600">
              Pastikan setiap berita melewati proses validasi dan publikasi yang konsisten.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-600">
            <p>• Konfirmasi fakta dan sumber data sebelum rilis.</p>
            <p>• Cantumkan dokumentasi foto/video untuk memperkuat berita.</p>
            <p>• Tandai isu prioritas dengan label khusus untuk monitoring.</p>
          </CardContent>
        </Card>

        <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Draft Perlu Review</CardTitle>
            <CardDescription className="text-slate-600">Koordinasikan proses review lintas tim agar berita lebih tajam.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
              <p className="font-semibold text-slate-900">Pendampingan Implementasi Kurikulum Merdeka</p>
              <p className="text-xs text-slate-600">Perlu infografik pendukung dan rujukan regulasi terbaru.</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 gap-2 font-semibold text-slate-700 hover:bg-slate-50"
                asChild
              >
                <Link href="/admin/berita/BRT-002/edit">
                  <Edit3 className="size-4" />
                  Review Draft
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
              <p className="font-semibold text-slate-900">Pelatihan Dashboard Pengawasan Berbasis Data</p>
              <p className="text-xs text-slate-600">Tambahkan kutipan peserta dan data capaian.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              asChild
            >
              <Link href="/admin/berita/review-queue">
                <AlignLeft className="size-4" />
                Lihat Semua Review
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


