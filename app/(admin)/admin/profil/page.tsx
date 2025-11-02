"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Building2,
  Globe,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "sambutan" | "visi-misi" | "struktur" | "pengurus" | "program";

export default function ProfileManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>("sambutan");
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "sambutan", label: "Sambutan", icon: Globe },
    { id: "visi-misi", label: "Visi & Misi", icon: Building2 },
    { id: "struktur", label: "Struktur Organisasi", icon: Building2 },
    { id: "pengurus", label: "Daftar Pengurus", icon: Building2 },
    { id: "program", label: "Program Kerja", icon: Building2 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Manajemen Profil MKPS
            </CardTitle>
            <CardDescription className="text-slate-600">
              Kelola konten halaman profil MKPS di landing page. Perubahan akan langsung terlihat di halaman publik.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-0 bg-slate-100 px-4 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              asChild
            >
              <Link href="/profil-mkps" target="_blank">
                <Globe className="size-4" />
                Lihat Halaman
              </Link>
            </Button>
            <Button
              size="sm"
              variant="default"
              className="gap-2 rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
            >
              <Save className="size-4" />
              Simpan Semua
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardContent className="p-0">
          {/* Mobile Dropdown Tabs */}
          <div className="border-b border-gradient-to-r from-transparent via-rose-100 to-transparent bg-gradient-to-br from-rose-50/30 via-white to-violet-50/20 p-4 md:hidden">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-md">
                  <Globe className="size-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wide text-rose-700">
                    Bagian Profil
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Pilih kategori yang ingin dikelola
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                  className="group flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border border-rose-200/50 bg-gradient-to-br from-white via-rose-50/30 to-violet-50/20 pl-4 pr-2 py-3 text-sm font-semibold text-slate-800 shadow-md shadow-rose-100/50 transition-all hover:border-rose-300 hover:shadow-lg hover:shadow-rose-200/50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
                >
                  <span className="flex items-center gap-3">
                    {tabs.find(t => t.id === activeTab) && (
                      <>
                        {(() => {
                          const Icon = tabs.find(t => t.id === activeTab)!.icon;
                          return (
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-sm">
                              <Icon className="size-4" />
                            </div>
                          );
                        })()}
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-slate-900">{tabs.find(t => t.id === activeTab)?.label}</span>
                          <span className="text-xs text-slate-500">Bagian profil aktif</span>
                        </div>
                      </>
                    )}
                  </span>
                  <div className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-400 px-3 py-1.5 shadow-md transition-all group-hover:from-rose-500 group-hover:to-pink-500">
                    <ChevronDown
                      className={cn(
                        "size-4 text-white transition-all duration-300",
                        isTabDropdownOpen && "rotate-180"
                      )}
                    />
                  </div>
                </button>
                
                {isTabDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm transition-opacity"
                      onClick={() => setIsTabDropdownOpen(false)}
                    />
                    <div className="absolute z-20 mt-3 w-full overflow-hidden rounded-2xl border border-rose-200/50 bg-white/95 backdrop-blur-xl p-2 shadow-2xl shadow-rose-200/30 ring-1 ring-rose-100/50">
                      <div className="grid grid-cols-1 gap-1.5">
                        {tabs.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => {
                                setActiveTab(tab.id);
                                setIsTabDropdownOpen(false);
                              }}
                              className={cn(
                                "group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl px-4 py-3 text-left transition-all",
                                isActive
                                  ? "bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 text-rose-700 shadow-sm"
                                  : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-rose-50/30 hover:shadow-sm"
                              )}
                            >
                              <span className="flex items-center gap-3">
                                <div className={cn(
                                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm transition-all",
                                  isActive
                                    ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white"
                                    : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-rose-100 group-hover:to-pink-100 group-hover:text-rose-600"
                                )}>
                                  <Icon className="size-4" />
                                </div>
                                <div className="flex flex-col items-start">
                                  <span className={cn(
                                    "text-sm font-semibold",
                                    isActive ? "text-rose-700" : "text-slate-900"
                                  )}>
                                    {tab.label}
                                  </span>
                                  {isActive && (
                                    <span className="text-xs text-rose-600 font-medium">Saat ini aktif</span>
                                  )}
                                </div>
                              </span>
                              {isActive && (
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 shadow-sm">
                                  <Check className="size-3 text-white" />
                                </div>
                              )}
                              {/* Decorative gradient overlay */}
                              {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-violet-500/5 pointer-events-none" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden border-b border-rose-100 p-4 md:flex md:flex-wrap md:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-rose-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  )}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === "sambutan" && <SambutanSection />}
      {activeTab === "visi-misi" && <VisiMisiSection />}
      {activeTab === "struktur" && <StrukturSection />}
      {activeTab === "pengurus" && <PengurusSection />}
      {activeTab === "program" && <ProgramSection />}
    </div>
  );
}

function SambutanSection() {
  const [activeSambutanTab, setActiveSambutanTab] = useState<"kepala-dinas" | "ketua">("kepala-dinas");
  const [sambutanKepalaDinas, setSambutanKepalaDinas] = useState(
    "Dengan rasa syukur dan kebanggaan, saya menyampaikan apresiasi yang setinggi-tingginya kepada seluruh anggota MKPS SMA & SLB Provinsi Jawa Tengah yang telah berkomitmen untuk meningkatkan mutu pendidikan melalui supervisi dan pendampingan yang profesional.\n\nMKPS sebagai organisasi profesi pengawas memiliki peran strategis dalam mewujudkan pendidikan berkualitas di Provinsi Jawa Tengah. Melalui kolaborasi yang sinergis, kita dapat mengembangkan ekosistem kepengawasan yang berbasis data, transparan, dan berorientasi pada peningkatan mutu pembelajaran.\n\nSaya berharap MKPS dapat terus menjadi garda terdepan dalam inovasi kepengawasan, memberikan pendampingan yang bermakna bagi sekolah binaan, dan berkontribusi aktif dalam mewujudkan visi pendidikan Jawa Tengah yang maju, unggul, dan berkarakter.",
  );

  const [sambutanKetua, setSambutanKetua] = useState(
    "Assalamu'alaikum warahmatullahi wabarakatuh. Puji syukur kehadirat Allah SWT yang telah memberikan kesempatan kepada kami untuk mengemban amanah sebagai Ketua MKPS SMA & SLB Provinsi Jawa Tengah.\n\nMKPS hadir sebagai wadah profesional pengawas untuk berkolaborasi, berbagi praktik baik, dan mengembangkan kompetensi kepengawasan. Melalui platform SIP-Kepengawasan Jateng, kami berkomitmen untuk mendigitalisasi seluruh siklus kepengawasan, mulai dari perencanaan, pelaksanaan, hingga pelaporan.\n\nKami mengajak seluruh anggota MKPS untuk aktif berpartisipasi dalam setiap program dan kegiatan organisasi. Mari kita bersama-sama menguatkan ekosistem kepengawasan melalui inovasi, kolaborasi, dan komitmen terhadap peningkatan mutu pendidikan di Provinsi Jawa Tengah.\n\nTerima kasih atas kepercayaan dan dukungan dari semua pihak. Semoga organisasi ini dapat memberikan kontribusi maksimal bagi kemajuan pendidikan di Jawa Tengah.",
  );

  return (
    <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-slate-50/50 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSambutanTab("kepala-dinas")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
              activeSambutanTab === "kepala-dinas"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100",
            )}
          >
            Sambutan Kepala Dinas
          </button>
          <button
            onClick={() => setActiveSambutanTab("ketua")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
              activeSambutanTab === "ketua"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100",
            )}
          >
            Sambutan Ketua MKPS
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <CardContent className="space-y-4 p-6">
        {activeSambutanTab === "kepala-dinas" ? (
          <>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 mb-2">
                Sambutan Kepala Dinas
              </CardTitle>
              <CardDescription className="text-slate-600">
                Konten sambutan Kepala Dinas Pendidikan Provinsi Jawa Tengah
              </CardDescription>
            </div>
            <RichTextEditor
              content={sambutanKepalaDinas}
              onChange={setSambutanKepalaDinas}
              placeholder="Masukkan sambutan Kepala Dinas..."
              minHeight="400px"
            />
            <Button
              size="sm"
              className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 sm:w-auto"
            >
              <Save className="mr-2 size-4" />
              Simpan Sambutan Kepala Dinas
            </Button>
          </>
        ) : (
          <>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 mb-2">
                Sambutan Ketua MKPS
              </CardTitle>
              <CardDescription className="text-slate-600">
                Konten sambutan Ketua MKPS SMA & SLB Provinsi Jawa Tengah
              </CardDescription>
            </div>
            <RichTextEditor
              content={sambutanKetua}
              onChange={setSambutanKetua}
              placeholder="Masukkan sambutan Ketua MKPS..."
              minHeight="400px"
            />
            <Button
              size="sm"
              className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 sm:w-auto"
            >
              <Save className="mr-2 size-4" />
              Simpan Sambutan Ketua MKPS
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function VisiMisiSection() {
  const [activeVisiMisiTab, setActiveVisiMisiTab] = useState<"visi" | "misi" | "tujuan">("visi");
  const [visi, setVisi] = useState(
    "Menjadi organisasi profesi pengawas yang unggul, inovatif, dan berkomitmen terhadap peningkatan mutu pendidikan di Provinsi Jawa Tengah melalui supervisi dan pendampingan yang profesional, berbasis data, dan berkelanjutan.",
  );
  const [misi, setMisi] = useState(
    "<ul><li>Mengembangkan kompetensi profesional pengawas melalui program peningkatan kapasitas yang berkelanjutan.</li><li>Meningkatkan kualitas supervisi akademik dan manajerial melalui pendekatan berbasis data dan kolaboratif.</li><li>Memperkuat pendampingan kepala sekolah dalam pengelolaan sekolah yang efektif dan efisien.</li><li>Mendorong inovasi dan praktik baik dalam kepengawasan melalui diseminasi dan kolaborasi lintas wilayah.</li></ul>",
  );
  const [tujuan, setTujuan] = useState(
    "<ul><li>Meningkatkan mutu pendidikan melalui supervisi dan pendampingan yang efektif.</li><li>Membangun ekosistem kepengawasan yang kolaboratif dan berbasis data.</li><li>Mengembangkan profesionalisme pengawas melalui pengembangan kompetensi berkelanjutan.</li><li>Mendorong inovasi dalam praktik kepengawasan untuk meningkatkan efektivitas kerja.</li></ul>",
  );

  return (
    <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 bg-slate-50/50 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveVisiMisiTab("visi")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
              activeVisiMisiTab === "visi"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100",
            )}
          >
            Visi
          </button>
          <button
            onClick={() => setActiveVisiMisiTab("misi")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
              activeVisiMisiTab === "misi"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100",
            )}
          >
            Misi
          </button>
          <button
            onClick={() => setActiveVisiMisiTab("tujuan")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
              activeVisiMisiTab === "tujuan"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100",
            )}
          >
            Tujuan
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <CardContent className="space-y-4 p-6">
        {activeVisiMisiTab === "visi" ? (
          <>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 mb-2">
                Visi
              </CardTitle>
              <CardDescription className="text-slate-600">
                Visi organisasi MKPS
              </CardDescription>
            </div>
            <RichTextEditor
              content={visi}
              onChange={setVisi}
              placeholder="Masukkan visi organisasi..."
              minHeight="400px"
            />
            <Button
              size="sm"
              className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 sm:w-auto"
            >
              <Save className="mr-2 size-4" />
              Simpan Visi
            </Button>
          </>
        ) : activeVisiMisiTab === "misi" ? (
          <>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 mb-2">
                Misi
              </CardTitle>
              <CardDescription className="text-slate-600">
                Daftar misi organisasi (gunakan bullet point atau numbering list untuk daftar)
              </CardDescription>
            </div>
            <RichTextEditor
              content={misi}
              onChange={setMisi}
              placeholder="Masukkan misi organisasi... (gunakan bullet point atau numbering list untuk daftar)"
              minHeight="400px"
            />
            <Button
              size="sm"
              className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 sm:w-auto"
            >
              <Save className="mr-2 size-4" />
              Simpan Misi
            </Button>
          </>
        ) : (
          <>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 mb-2">
                Tujuan
              </CardTitle>
              <CardDescription className="text-slate-600">
                Daftar tujuan organisasi (gunakan bullet point atau numbering list untuk daftar)
              </CardDescription>
            </div>
            <RichTextEditor
              content={tujuan}
              onChange={setTujuan}
              placeholder="Masukkan tujuan organisasi... (gunakan bullet point atau numbering list untuk daftar)"
              minHeight="400px"
            />
            <Button
              size="sm"
              className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 sm:w-auto"
            >
              <Save className="mr-2 size-4" />
              Simpan Tujuan
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function StrukturSection() {
  const [struktur, setStruktur] = useState({
    ketua: {
      nama: "Ketua MKPS",
      jabatan: "Ketua MKPS SMA & SLB Provinsi Jawa Tengah",
    },
    wakilKetua: {
      nama: "Wakil Ketua",
      jabatan: "Wakil Ketua MKPS",
    },
    sekretaris: {
      nama: "Sekretaris",
      jabatan: "Sekretaris MKPS",
    },
    bendahara: {
      nama: "Bendahara",
      jabatan: "Bendahara MKPS",
    },
    bidang: [
      {
        nama: "Bidang Supervisi Akademik",
        kepala: "Kepala Bidang",
        anggota: ["Anggota 1", "Anggota 2", "Anggota 3"],
      },
      {
        nama: "Bidang Supervisi Manajerial",
        kepala: "Kepala Bidang",
        anggota: ["Anggota 1", "Anggota 2", "Anggota 3"],
      },
      {
        nama: "Bidang Pendampingan",
        kepala: "Kepala Bidang",
        anggota: ["Anggota 1", "Anggota 2", "Anggota 3"],
      },
    ],
  });

  return (
    <div className="space-y-6">
      {/* Pengurus Harian */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Pengurus Harian
          </CardTitle>
          <CardDescription className="text-slate-600">
            Atur informasi pengurus harian MKPS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(struktur).filter(([key]) => key !== "bidang").map(([key, value]: [string, any]) => (
              <div key={key} className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {value.jabatan}
                </label>
                <input
                  type="text"
                  value={value.nama}
                  onChange={(e) =>
                    setStruktur({
                      ...struktur,
                      [key]: { ...value, nama: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  placeholder="Nama pengurus..."
                />
                <input
                  type="text"
                  value={value.jabatan}
                  onChange={(e) =>
                    setStruktur({
                      ...struktur,
                      [key]: { ...value, jabatan: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  placeholder="Jabatan..."
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bidang-bidang */}
      <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Bidang Kerja
          </CardTitle>
          <CardDescription className="text-slate-600">
            Kelola bidang kerja dan anggotanya
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {struktur.bidang.map((bidang, index) => (
            <Card key={index} className="border border-rose-100 bg-rose-50/50">
              <CardContent className="p-4 space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Nama Bidang
                    </label>
                    <input
                      type="text"
                      value={bidang.nama}
                      onChange={(e) => {
                        const newBidang = [...struktur.bidang];
                        newBidang[index].nama = e.target.value;
                        setStruktur({ ...struktur, bidang: newBidang });
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Kepala Bidang
                    </label>
                    <input
                      type="text"
                      value={bidang.kepala}
                      onChange={(e) => {
                        const newBidang = [...struktur.bidang];
                        newBidang[index].kepala = e.target.value;
                        setStruktur({ ...struktur, bidang: newBidang });
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Anggota
                  </label>
                  <div className="mt-2 space-y-2">
                    {bidang.anggota.map((anggota, anggotaIndex) => (
                      <div key={anggotaIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={anggota}
                          onChange={(e) => {
                            const newBidang = [...struktur.bidang];
                            newBidang[index].anggota[anggotaIndex] = e.target.value;
                            setStruktur({ ...struktur, bidang: newBidang });
                          }}
                          className="flex-1 rounded-xl border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                          placeholder={`Anggota ${anggotaIndex + 1}...`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newBidang = [...struktur.bidang];
                            newBidang[index].anggota = newBidang[index].anggota.filter(
                              (_, i) => i !== anggotaIndex,
                            );
                            setStruktur({ ...struktur, bidang: newBidang });
                          }}
                          className="shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newBidang = [...struktur.bidang];
                        newBidang[index].anggota.push("");
                        setStruktur({ ...struktur, bidang: newBidang });
                      }}
                      className="w-full rounded-full border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      <Plus className="mr-2 size-3" />
                      Tambah Anggota
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            size="sm"
            className="w-full rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700"
          >
            <Save className="mr-2 size-4" />
            Simpan Struktur Organisasi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PengurusSection() {
  const [pengurus, setPengurus] = useState([
    { nama: "Dr. Ahmad Hidayat, M.Pd.", jabatan: "Ketua MKPS", wilayah: "Wilayah Cabdin Semarang" },
    { nama: "Dra. Siti Rahayu, M.M.", jabatan: "Wakil Ketua", wilayah: "Wilayah Cabdin Surakarta" },
    { nama: "Bambang Setyawan, S.Pd., M.M.", jabatan: "Sekretaris", wilayah: "Wilayah Cabdin Pekalongan" },
    { nama: "Drs. Agus Prasetyo, M.Pd.", jabatan: "Bendahara", wilayah: "Wilayah Cabdin Pati" },
    { nama: "Dr. Retno Widyastuti, M.Pd.", jabatan: "Kepala Bidang Supervisi Akademik", wilayah: "Wilayah Cabdin Semarang" },
    { nama: "Drs. Slamet Riyadi, M.M.", jabatan: "Kepala Bidang Supervisi Manajerial", wilayah: "Wilayah Cabdin Surakarta" },
    { nama: "Dra. Endang Sulistyaningsih, M.Pd.", jabatan: "Kepala Bidang Pendampingan", wilayah: "Wilayah Cabdin Pekalongan" },
  ]);

  const addPengurus = () => {
    setPengurus([...pengurus, { nama: "", jabatan: "", wilayah: "" }]);
  };

  const updatePengurus = (index: number, field: string, value: string) => {
    const newPengurus = [...pengurus];
    newPengurus[index] = { ...newPengurus[index], [field]: value };
    setPengurus(newPengurus);
  };

  const removePengurus = (index: number) => {
    setPengurus(pengurus.filter((_, i) => i !== index));
  };

  return (
    <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">
          Daftar Pengurus MKPS
        </CardTitle>
        <CardDescription className="text-slate-600">
          Kelola daftar pengurus organisasi MKPS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Desktop Table View */}
        <div className="hidden overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-md shadow-rose-100/70 md:block">
          <table className="w-full border-collapse text-left text-sm text-slate-700">
            <thead className="bg-gradient-to-r from-rose-50 via-white to-amber-50 text-xs font-semibold uppercase tracking-wide text-slate-700">
              <tr>
                <th className="px-5 py-3 font-semibold">Nama</th>
                <th className="px-5 py-3 font-semibold">Jabatan</th>
                <th className="px-5 py-3 font-semibold">Wilayah</th>
                <th className="px-5 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-100">
              {pengurus.map((item, index) => (
                <tr key={index} className="hover:bg-rose-50/70">
                  <td className="px-5 py-4">
                    <input
                      type="text"
                      value={item.nama}
                      onChange={(e) => updatePengurus(index, "nama", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                      placeholder="Nama pengurus..."
                    />
                  </td>
                  <td className="px-5 py-4">
                    <input
                      type="text"
                      value={item.jabatan}
                      onChange={(e) => updatePengurus(index, "jabatan", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                      placeholder="Jabatan..."
                    />
                  </td>
                  <td className="px-5 py-4">
                    <input
                      type="text"
                      value={item.wilayah}
                      onChange={(e) => updatePengurus(index, "wilayah", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                      placeholder="Wilayah..."
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePengurus(index)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="flex flex-col gap-3 md:hidden">
          {pengurus.map((item, index) => (
            <Card key={index} className="border border-rose-100 bg-rose-50/50">
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Nama
                  </label>
                  <input
                    type="text"
                    value={item.nama}
                    onChange={(e) => updatePengurus(index, "nama", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                    placeholder="Nama pengurus..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    value={item.jabatan}
                    onChange={(e) => updatePengurus(index, "jabatan", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                    placeholder="Jabatan..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Wilayah
                  </label>
                  <input
                    type="text"
                    value={item.wilayah}
                    onChange={(e) => updatePengurus(index, "wilayah", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                    placeholder="Wilayah..."
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePengurus(index)}
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-2 size-4" />
                  Hapus Pengurus
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={addPengurus}
            className="flex-1 rounded-full border-slate-300 bg-white px-4 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Plus className="mr-2 size-4" />
            Tambah Pengurus
          </Button>
          <Button
            size="sm"
            className="flex-1 rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700"
          >
            <Save className="mr-2 size-4" />
            Simpan Daftar Pengurus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgramSection() {
  const [programKerja, setProgramKerja] = useState([
    {
      kategori: "Perencanaan",
      program: [
        "Penyusunan Rencana Kerja Tahunan (RKT) MKPS",
        "Koordinasi perencanaan supervisi lintas wilayah",
        "Pengembangan indikator kinerja kepengawasan",
      ],
    },
    {
      kategori: "Pelaksanaan",
      program: [
        "Workshop peningkatan kompetensi pengawas",
        "Supervisi akademik dan manajerial terintegrasi",
        "Pendampingan kepala sekolah berbasis data",
        "Koordinasi lintas wilayah dan kabupaten/kota",
      ],
    },
    {
      kategori: "Evaluasi & Pelaporan",
      program: [
        "Evaluasi kinerja pengawas semesteran",
        "Pelaporan hasil supervisi triwulanan",
        "Sinkronisasi data dan laporan tahunan",
        "Review dan perbaikan sistem kepengawasan",
      ],
    },
    {
      kategori: "Pengembangan",
      program: [
        "Pengembangan aplikasi SIP-Kepengawasan",
        "Pelatihan literasi digital untuk pengawas",
        "Riset dan pengembangan metode supervisi",
        "Diseminasi praktik baik kepengawasan",
      ],
    },
  ]);

  const addKategori = () => {
    setProgramKerja([...programKerja, { kategori: "", program: [""] }]);
  };

  const updateKategori = (index: number, field: string, value: string) => {
    const newProgram = [...programKerja];
    newProgram[index] = { ...newProgram[index], [field]: value };
    setProgramKerja(newProgram);
  };

  const addProgram = (kategoriIndex: number) => {
    const newProgram = [...programKerja];
    newProgram[kategoriIndex].program.push("");
    setProgramKerja(newProgram);
  };

  const updateProgram = (kategoriIndex: number, programIndex: number, value: string) => {
    const newProgram = [...programKerja];
    newProgram[kategoriIndex].program[programIndex] = value;
    setProgramKerja(newProgram);
  };

  const removeProgram = (kategoriIndex: number, programIndex: number) => {
    const newProgram = [...programKerja];
    newProgram[kategoriIndex].program = newProgram[kategoriIndex].program.filter(
      (_, i) => i !== programIndex,
    );
    setProgramKerja(newProgram);
  };

  const removeKategori = (index: number) => {
    setProgramKerja(programKerja.filter((_, i) => i !== index));
  };

  return (
    <Card className="border border-rose-200 bg-white shadow-md shadow-rose-100/70">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">
          Program Kerja Tahunan MKPS
        </CardTitle>
        <CardDescription className="text-slate-600">
          Kelola program kerja organisasi per kategori
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {programKerja.map((kategori, kategoriIndex) => (
          <Card key={kategoriIndex} className="border border-rose-100 bg-rose-50/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <input
                  type="text"
                  value={kategori.kategori}
                  onChange={(e) => updateKategori(kategoriIndex, "kategori", e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  placeholder="Nama kategori..."
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeKategori(kategoriIndex)}
                  className="shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {kategori.program.map((program, programIndex) => (
                  <div key={programIndex} className="flex gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-200 text-xs font-semibold text-rose-700">
                      {programIndex + 1}
                    </span>
                    <input
                      type="text"
                      value={program}
                      onChange={(e) => updateProgram(kategoriIndex, programIndex, e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-sm transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
                      placeholder={`Program ${programIndex + 1}...`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProgram(kategoriIndex, programIndex)}
                      className="shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addProgram(kategoriIndex)}
                  className="w-full rounded-full border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <Plus className="mr-2 size-3" />
                  Tambah Program
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={addKategori}
            className="flex-1 rounded-full border-slate-300 bg-white px-4 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Plus className="mr-2 size-4" />
            Tambah Kategori
          </Button>
          <Button
            size="sm"
            className="flex-1 rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700"
          >
            <Save className="mr-2 size-4" />
            Simpan Program Kerja
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

