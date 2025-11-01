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
      <Card className="border border-white/70 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-800">Manajemen Berita</CardTitle>
            <CardDescription className="text-slate-600">
              Publikasikan informasi strategis dan dokumentasikan capaian kepengawasan.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-sky-100 bg-white/90 text-sky-600 hover:border-sky-200 hover:bg-sky-50"
              asChild
            >
              <Link href="/admin/berita/lini-massa">
                <Globe className="size-4" />
                Lihat Portal
              </Link>
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-gradient-to-r from-sky-600 to-emerald-500 text-white font-semibold shadow-md hover:from-sky-700 hover:to-emerald-600"
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
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-sky-300 bg-white px-4 text-sky-700 font-semibold hover:border-sky-400 hover:bg-sky-50"
            >
              Semua Status
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 font-semibold text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Tayang
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 font-semibold text-amber-600 hover:bg-amber-50 hover:text-amber-700"
            >
              Draft
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              Terjadwal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              Butuh Review
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto gap-2 font-semibold text-sky-700 hover:bg-sky-50"
            >
              <Upload className="size-4" />
              Impor dari Dokumen
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/70 bg-white/95 shadow-sm">
            <table className="w-full border-collapse text-left text-sm text-slate-700">
              <thead className="bg-gradient-to-r from-sky-50 to-emerald-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Judul</th>
                  <th className="px-5 py-3 font-semibold">Penulis</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Terbit</th>
                  <th className="px-5 py-3 font-semibold">Channel</th>
                  <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100">
                {newsData.map((news) => (
                  <tr key={news.id} className="hover:bg-sky-50/70">
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-800">
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
                          "rounded-full px-3 font-semibold",
                          news.status === "Tayang"
                            ? "border-0 bg-emerald-100 text-emerald-700"
                            : news.status === "Draft"
                              ? "border-amber-300 text-amber-700"
                              : news.status === "Terjadwal"
                                ? "border-0 bg-sky-100 text-sky-700"
                                : "border-rose-300 text-rose-600",
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
                          className="font-semibold text-sky-700 hover:bg-sky-50"
                          asChild
                        >
                          <Link href={`/admin/berita/${news.id.toLowerCase()}`}>
                            Buka
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-sky-200 text-slate-700 font-semibold hover:border-sky-300 hover:bg-sky-50"
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
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p>Menampilkan 1-4 dari 18 berita.</p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="border-sky-200 text-slate-700 font-semibold hover:border-sky-300 hover:bg-sky-50"
            >
              Sebelumnya
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-sky-600 to-emerald-500 text-white font-semibold shadow-md hover:from-sky-700 hover:to-emerald-600"
            >
              Berikutnya
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-dashed border-emerald-300 bg-emerald-50/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-emerald-700">
              <ClipboardCheck className="size-5" />
              Checklist Editorial
            </CardTitle>
            <CardDescription className="text-emerald-800">
              Pastikan setiap berita melewati proses validasi dan publikasi yang konsisten.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-xs text-emerald-800">
            <p>• Konfirmasi fakta dan sumber data sebelum rilis.</p>
            <p>• Cantumkan dokumentasi foto/video untuk memperkuat berita.</p>
            <p>• Tandai isu prioritas dengan label khusus untuk monitoring.</p>
          </CardContent>
        </Card>

        <Card className="border border-white/70 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">Draft Perlu Review</CardTitle>
            <CardDescription className="text-slate-600">Koordinasikan proses review lintas tim agar berita lebih tajam.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-3">
              <p className="font-semibold text-slate-800">Pendampingan Implementasi Kurikulum Merdeka</p>
              <p className="text-xs text-slate-600">Perlu infografik pendukung dan rujukan regulasi terbaru.</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 gap-2 font-semibold text-sky-700 hover:bg-sky-50"
                asChild
              >
                <Link href="/admin/berita/BRT-002/edit">
                  <Edit3 className="size-4" />
                  Review Draft
                </Link>
              </Button>
            </div>
            <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-3">
              <p className="font-semibold text-slate-700">Pelatihan Dashboard Pengawasan Berbasis Data</p>
              <p className="text-xs text-slate-600">Tambahkan kutipan peserta dan data capaian.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="gap-2 border-sky-200 text-sky-700 font-semibold hover:border-sky-300 hover:bg-sky-50"
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


