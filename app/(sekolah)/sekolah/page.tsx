"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle,
  ArrowRight,
  Bug,
  Building2, 
  CheckCircle2,
  FileText, 
  Loader2,
  School,
  Settings, 
  User, 
} from "lucide-react";
import Link from "next/link";
import { sekolahQuickActions } from "@/config/sekolah";
import { cn } from "@/lib/utils";

export default function SekolahDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [sekolahData, setSekolahData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load user data
      const userResponse = await fetch('/api/auth/get-current-user');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        const currentUser = userData.user;
        
        // Check approval status - redirect if not approved
        if (currentUser && currentUser.role === 'sekolah') {
          if (currentUser.status_approval !== 'approved') {
            router.replace('/sekolah/pending-approval');
            return;
          }
        }
        
        setUser(currentUser);
        
        // Load sekolah data if user has sekolah_id in metadata
        if (currentUser?.metadata?.sekolah_id) {
          const sekolahResponse = await fetch(`/api/sekolah/profile?sekolah_id=${currentUser.metadata.sekolah_id}`);
          if (sekolahResponse.ok) {
            const sekolahData = await sekolahResponse.json();
            setSekolahData(sekolahData);
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-green-600" />
        <p className="text-sm text-slate-600">Memuat dashboard...</p>
      </div>
    );
  }

  const completionStatus = sekolahData ? getCompletionStatus(sekolahData) : null;
  const progressValue = completionStatus?.progress ?? 0;
  const isComplete = progressValue === 100;
  const displayName = user?.nama || user?.email?.split("@")[0] || "Sekolah";
  const remainingSections = completionStatus ? Math.max(completionStatus.total - completionStatus.completed, 0) : 0;
  const primaryProgressColor = isComplete ? "#34d399" : "#fbbf24";
  const progressAngle = Math.min(progressValue, 100) * 3.6;
  const progressCircleStyle = {
    background: `conic-gradient(${primaryProgressColor} 0deg ${progressAngle}deg, rgba(255,255,255,0.25) ${progressAngle}deg 360deg)`,
  };
  const highlightPills = [
    {
      label: "Bagian lengkap",
      value: completionStatus ? `${completionStatus.completed}/${completionStatus.total}` : "-",
    },
    {
      label: "Bagian tersisa",
      value: completionStatus ? `${remainingSections}` : "-",
    },
    {
      label: "Status supervisi",
      value: isComplete ? "Siap Supervisi" : "Belum Siap",
    },
  ];
  const quickActions = sekolahQuickActions ?? [];

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
        <div className="relative z-10 flex flex-col gap-8 px-6 py-8 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Panel Sekolah</p>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Selamat datang, {displayName}!
              </h1>
              <p className="text-sm sm:text-base text-white/80">
                Kelola data profil sekolah dan pastikan kesiapan supervisi dari pengawas.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              {highlightPills.map((pill) => (
                <div
                  key={pill.label}
                  className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-sm"
                >
                  <span className="font-semibold text-white">{pill.value}</span>
                  <span className="ml-2 text-white/70">{pill.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-full bg-white px-6 py-2 text-emerald-600 shadow-lg shadow-emerald-900/20 transition hover:bg-white/90"
              >
                <Link href="/sekolah/profil">Lengkapi Profil</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 px-6 py-2 text-white hover:bg-white/15"
              >
                <Link href="/sekolah/pengaturan">Kelola Pengaturan</Link>
              </Button>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-4">
            <div className="relative flex size-40 items-center justify-center">
              <div className="absolute inset-0 rounded-full" style={progressCircleStyle} />
              <div className="absolute inset-[10px] rounded-full bg-white/15 backdrop-blur-sm" />
              <div className="relative flex size-full items-center justify-center">
                <span className="text-4xl font-semibold">{progressValue}%</span>
              </div>
            </div>
            <p className="text-center text-xs text-white/80">
              {isComplete ? "Data siap untuk supervisi" : `${remainingSections} bagian lagi perlu dilengkapi`}
            </p>
          </div>
        </div>
        <div className="absolute -left-16 -top-16 size-40 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -right-12 bottom-0 size-48 rounded-full bg-emerald-400/30 blur-3xl" />
      </section>

      {quickActions.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-800">Aksi cepat</h2>
            <span className="text-xs text-slate-500">Pilih fitur yang sering digunakan</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex min-w-[220px] items-center justify-between rounded-2xl border border-emerald-100 bg-white/80 px-5 py-4 shadow-sm backdrop-blur transition hover:-translate-y-[2px] hover:border-emerald-200 hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600">
                    {action.title}
                  </p>
                  {action.description && (
                    <p className="mt-1 text-xs text-slate-500">{action.description}</p>
                  )}
                </div>
                <ArrowRight className="size-4 text-emerald-500 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-800">Ringkasan Data Sekolah</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isComplete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {progressValue}% lengkap
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status Supervisi
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {isComplete ? "Siap dilaksanakan" : "Belum siap"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {isComplete
                  ? "Pengawas dapat menjadwalkan supervisi kapan saja."
                  : "Lengkapi seluruh data agar pengawas dapat melakukan supervisi."}
              </p>
              {!isComplete && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-700">
                  Pengawas belum dapat melakukan supervisi. Lengkapi {remainingSections} bagian lagi.
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Akses Data Pengawas
              </p>
              <p
                className={cn(
                  "mt-2 text-base font-semibold",
                  isComplete ? "text-emerald-600" : "text-rose-600",
                )}
              >
                {isComplete ? "Aktif" : "Tidak Aktif"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {isComplete
                  ? "Data sekolah siap ditinjau dan dianalisis oleh pengawas."
                  : "Akses pengawas akan aktif otomatis setelah data lengkap 100%."}
              </p>
              <div className="mt-4">
                <Link href="/sekolah/profil">
                  <Button
                    className="w-full rounded-full border-0 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:translate-y-[-1px] hover:from-emerald-600 hover:via-emerald-600 hover:to-teal-700 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-200"
                  >
                    Perbarui Data Profil
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {!isComplete && completionStatus && (
            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Bagian yang perlu dilengkapi
              </p>
              <div className="flex flex-wrap gap-2">
                {completionStatus.incomplete.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur space-y-4">
          <h2 className="text-base font-semibold text-slate-800">Informasi Penting</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Data yang Anda lengkapi akan tampil langsung pada portal pengawas. Gunakan panel ini untuk
            memastikan seluruh informasi sekolah selalu diperbarui dan siap diverifikasi.
          </p>
          <ul className="space-y-2 text-xs text-slate-500">
            <li>• Profil guru, tenaga kependidikan, dan siswa menjadi dasar supervisi.</li>
            <li>• Branding, kokurikuler, dan ekstrakurikuler mendukung penilaian karakter.</li>
            <li>• Rapor pendidikan membantu pengawas menyiapkan rencana pendampingan.</li>
          </ul>
          <Link href="/sekolah/profil">
            <Button className="w-full rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-md hover:from-green-700 hover:via-emerald-700 hover:to-teal-700">
              Kelola Profil Sekolah
            </Button>
          </Link>
        </div>
      </section>

      <Card className="rounded-3xl border border-emerald-100 bg-white/80 shadow-sm backdrop-blur">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white shadow-md">
                <Bug className="size-4" />
              </span>
              Laporkan Bug di Panel Sekolah
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-600">
              Jika menemukan kendala saat mengisi data, laporkan agar tim kami dapat segera membantu.
            </CardDescription>
          </div>
          <Button
            asChild
            className="w-full rounded-full border-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-5 py-2 font-semibold text-white shadow-md transition hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 hover:shadow-lg sm:w-auto"
          >
            <Link href="https://forms.gle/6L4u5n59M9qKbdDz5" target="_blank" rel="noopener noreferrer">
              Kirim Bug Report
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function getCompletionStatus(data: any) {
  const hasIdentitas = [
    "kepala_sekolah",
    "status_akreditasi",
    "jalan",
    "desa",
    "kecamatan",
    "nomor_telepon",
    "email_sekolah",
  ].every((field) => Boolean(data?.[field]));

  const profilGuru = Array.isArray(data?.profil_guru?.detail)
    ? data.profil_guru.detail.length > 0
    : false;

  const profilTenaga = Array.isArray(data?.profil_tenaga_kependidikan?.detail)
    ? data.profil_tenaga_kependidikan.detail.length > 0
    : false;

  const profilSiswa = Array.isArray(data?.profil_siswa?.detail)
    ? data.profil_siswa.detail.length > 0
    : false;

  const branding = Array.isArray(data?.branding_sekolah?.detail)
    ? data.branding_sekolah.detail.some((item: any) => Boolean(item?.status))
    : false;

  const kokurikuler = Array.isArray(data?.kokurikuler?.detail)
    ? data.kokurikuler.detail.some(
        (item: any) =>
          item?.kelas && Object.values(item.kelas).some((value) => Boolean(value)),
      )
    : false;

  const ekstrakurikuler = Array.isArray(data?.ekstrakurikuler?.detail)
    ? data.ekstrakurikuler.detail.some((item: any) => Boolean(item?.ada))
    : false;

  const rapor = Array.isArray(data?.rapor_pendidikan?.detail)
    ? data.rapor_pendidikan.detail.length > 0 &&
      data.rapor_pendidikan.detail.every(
        (item: any) => Boolean(item?.capaian) && item?.skor !== undefined && item?.skor !== "",
      )
    : false;

  const sections = [
    { label: "Identitas Sekolah", complete: hasIdentitas },
    { label: "Profil Guru", complete: profilGuru },
    { label: "Profil Tenaga Kependidikan", complete: profilTenaga },
    { label: "Profil Siswa", complete: profilSiswa },
    { label: "Branding Sekolah", complete: branding },
    { label: "Kokurikuler", complete: kokurikuler },
    { label: "Ekstrakurikuler", complete: ekstrakurikuler },
    { label: "Laporan Rapor Pendidikan", complete: rapor },
  ];

  const completedCount = sections.filter((section) => section.complete).length;
  const progress = Math.round((completedCount / sections.length) * 100);
  const incomplete = sections.filter((section) => !section.complete).map((section) => section.label);

  return {
    progress,
    incomplete,
    completed: completedCount,
    total: sections.length,
  };
}

