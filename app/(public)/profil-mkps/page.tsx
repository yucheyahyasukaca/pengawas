import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const strukturOrganisasi = {
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
};

const daftarPengurus = [
  { nama: "Dr. Ahmad Hidayat, M.Pd.", jabatan: "Ketua MKPS", wilayah: "Wilayah Cabdin Semarang" },
  { nama: "Dra. Siti Rahayu, M.M.", jabatan: "Wakil Ketua", wilayah: "Wilayah Cabdin Surakarta" },
  { nama: "Bambang Setyawan, S.Pd., M.M.", jabatan: "Sekretaris", wilayah: "Wilayah Cabdin Pekalongan" },
  { nama: "Drs. Agus Prasetyo, M.Pd.", jabatan: "Bendahara", wilayah: "Wilayah Cabdin Pati" },
  { nama: "Dr. Retno Widyastuti, M.Pd.", jabatan: "Kepala Bidang Supervisi Akademik", wilayah: "Wilayah Cabdin Semarang" },
  { nama: "Drs. Slamet Riyadi, M.M.", jabatan: "Kepala Bidang Supervisi Manajerial", wilayah: "Wilayah Cabdin Surakarta" },
  { nama: "Dra. Endang Sulistyaningsih, M.Pd.", jabatan: "Kepala Bidang Pendampingan", wilayah: "Wilayah Cabdin Pekalongan" },
];

const programKerja = [
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
];

export default function ProfilMKPSPage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#371314] via-[#4A1B1C] to-[#2A0A0B] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 rounded-full border-white/30 bg-white/10 text-white">
              Profil Organisasi
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Profil MKPS
              <span className="mt-2 block text-[#F1B0B7]">
                SMA & SLB Provinsi Jawa Tengah
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-white/85 sm:text-xl">
              Menguatkan ekosistem kepengawasan melalui kolaborasi, inovasi, dan komitmen terhadap peningkatan mutu pendidikan.
            </p>
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Dinas */}
      <section className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 backdrop-blur">
            <CardHeader>
              <Badge className="mb-4 w-max rounded-full border-white/30 bg-white/10 text-white">
                Sambutan
              </Badge>
              <CardTitle className="text-2xl font-semibold text-[#F7CDD0] sm:text-3xl">
                Sambutan Kepala Dinas Pendidikan Provinsi Jawa Tengah
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed text-white/90 sm:text-lg">
              <p>
                Dengan rasa syukur dan kebanggaan, saya menyampaikan apresiasi yang setinggi-tingginya kepada seluruh anggota MKPS SMA & SLB Provinsi Jawa Tengah yang telah berkomitmen untuk meningkatkan mutu pendidikan melalui supervisi dan pendampingan yang profesional.
              </p>
              <p>
                MKPS sebagai organisasi profesi pengawas memiliki peran strategis dalam mewujudkan pendidikan berkualitas di Provinsi Jawa Tengah. Melalui kolaborasi yang sinergis, kita dapat mengembangkan ekosistem kepengawasan yang berbasis data, transparan, dan berorientasi pada peningkatan mutu pembelajaran.
              </p>
              <p>
                Saya berharap MKPS dapat terus menjadi garda terdepan dalam inovasi kepengawasan, memberikan pendampingan yang bermakna bagi sekolah binaan, dan berkontribusi aktif dalam mewujudkan visi pendidikan Jawa Tengah yang maju, unggul, dan berkarakter.
              </p>
              <div className="mt-6 flex flex-col items-end space-y-2">
                <p className="font-semibold text-[#F7CDD0]">Kepala Dinas Pendidikan</p>
                <p className="text-sm text-white/70">Provinsi Jawa Tengah</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sambutan Ketua MKPS */}
      <section className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 backdrop-blur">
            <CardHeader>
              <Badge className="mb-4 w-max rounded-full border-white/30 bg-white/10 text-white">
                Sambutan
              </Badge>
              <CardTitle className="text-2xl font-semibold text-[#F7CDD0] sm:text-3xl">
                Sambutan Ketua MKPS SMA & SLB Provinsi Jawa Tengah
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed text-white/90 sm:text-lg">
              <p>
                Assalamu&apos;alaikum warahmatullahi wabarakatuh. Puji syukur kehadirat Allah SWT yang telah memberikan kesempatan kepada kami untuk mengemban amanah sebagai Ketua MKPS SMA & SLB Provinsi Jawa Tengah.
              </p>
              <p>
                MKPS hadir sebagai wadah profesional pengawas untuk berkolaborasi, berbagi praktik baik, dan mengembangkan kompetensi kepengawasan. Melalui platform SIP-Kepengawasan Jateng, kami berkomitmen untuk mendigitalisasi seluruh siklus kepengawasan, mulai dari perencanaan, pelaksanaan, hingga pelaporan.
              </p>
              <p>
                Kami mengajak seluruh anggota MKPS untuk aktif berpartisipasi dalam setiap program dan kegiatan organisasi. Mari kita bersama-sama menguatkan ekosistem kepengawasan melalui inovasi, kolaborasi, dan komitmen terhadap peningkatan mutu pendidikan di Provinsi Jawa Tengah.
              </p>
              <p>
                Terima kasih atas kepercayaan dan dukungan dari semua pihak. Semoga organisasi ini dapat memberikan kontribusi maksimal bagi kemajuan pendidikan di Jawa Tengah.
              </p>
              <div className="mt-6 flex flex-col items-end space-y-2">
                <p className="font-semibold text-[#F7CDD0]">Ketua MKPS</p>
                <p className="text-sm text-white/70">SMA & SLB Provinsi Jawa Tengah</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Visi, Misi, Tujuan */}
      <section className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 rounded-full border-white/30 bg-white/10 text-white">
              Visi, Misi & Tujuan
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Arah dan Komitmen Organisasi
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Visi */}
            <Card className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#F7CDD0]">
                  Visi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-white/90">
                  Menjadi organisasi profesi pengawas yang unggul, inovatif, dan berkomitmen terhadap peningkatan mutu pendidikan di Provinsi Jawa Tengah melalui supervisi dan pendampingan yang profesional, berbasis data, dan berkelanjutan.
                </p>
              </CardContent>
            </Card>

            {/* Misi */}
            <Card className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#F7CDD0]">
                  Misi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm leading-relaxed text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#F7CDD0]">•</span>
                    <span>Mengembangkan kompetensi profesional pengawas melalui program peningkatan kapasitas yang berkelanjutan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#F7CDD0]">•</span>
                    <span>Meningkatkan kualitas supervisi akademik dan manajerial melalui pendekatan berbasis data dan kolaboratif.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#F7CDD0]">•</span>
                    <span>Memperkuat pendampingan kepala sekolah dalam pengelolaan sekolah yang efektif dan efisien.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#F7CDD0]">•</span>
                    <span>Mendorong inovasi dan praktik baik dalam kepengawasan melalui diseminasi dan kolaborasi lintas wilayah.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Tujuan */}
            <Card className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#F7CDD0]">
                  Tujuan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm leading-relaxed text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#F7CDD0]">•</span>
                    <span>Meningkatkan mutu pendidikan melalui supervisi dan pendampingan yang efektif.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#F7CDD0]">•</span>
                    <span>Membangun ekosistem kepengawasan yang kolaboratif dan berbasis data.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#F7CDD0]">•</span>
                    <span>Mengembangkan profesionalisme pengawas melalui pengembangan kompetensi berkelanjutan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-[#F7CDD0]">•</span>
                    <span>Mendorong inovasi dalam praktik kepengawasan untuk meningkatkan efektivitas kerja.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 rounded-full border-white/30 bg-white/10 text-white">
              Organisasi
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Struktur Organisasi MKPS
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-white/75">
              Organisasi MKPS dipimpin oleh pengurus harian dan didukung oleh beberapa bidang kerja strategis.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Ketua */}
            <Card className="border border-white/20 bg-gradient-to-br from-[#401416] via-[#592022] to-[#2B0D0E] text-white shadow-lg shadow-black/30">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#F7CDD0]">
                  {strukturOrganisasi.ketua.jabatan}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {strukturOrganisasi.ketua.nama}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Wakil Ketua */}
            <Card className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  {strukturOrganisasi.wakilKetua.jabatan}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {strukturOrganisasi.wakilKetua.nama}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Sekretaris */}
            <Card className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  {strukturOrganisasi.sekretaris.jabatan}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {strukturOrganisasi.sekretaris.nama}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Bendahara */}
            <Card className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  {strukturOrganisasi.bendahara.jabatan}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {strukturOrganisasi.bendahara.nama}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Bidang-bidang */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {strukturOrganisasi.bidang.map((bidang, index) => (
              <Card
                key={index}
                className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">
                    {bidang.nama}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {bidang.kepala}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-white/80">
                    {bidang.anggota.map((anggota, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-[#F7CDD0]">•</span>
                        <span>{anggota}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Daftar Pengurus */}
      <section className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 rounded-full border-white/30 bg-white/10 text-white">
              Pengurus
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Daftar Pengurus MKPS
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-white/75">
              Tim pengurus yang mengemban amanah untuk memajukan organisasi dan meningkatkan mutu kepengawasan.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {daftarPengurus.map((pengurus, index) => (
              <Card
                key={index}
                className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">
                    {pengurus.nama}
                  </CardTitle>
                  <CardDescription className="text-[#F7CDD0]">
                    {pengurus.jabatan}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/70">{pengurus.wilayah}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Kerja Tahunan */}
      <section className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 rounded-full border-white/30 bg-white/10 text-white">
              Program Kerja
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Program Kerja Tahunan MKPS
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-white/75">
              Rencana strategis dan program kerja yang dijalankan untuk mencapai visi dan misi organisasi.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {programKerja.map((kategori, index) => (
              <Card
                key={index}
                className="border border-white/15 bg-white/5 text-white shadow-lg shadow-black/30 transition-all hover:border-white/30 hover:bg-white/10"
              >
                <CardHeader>
                  <Badge className="mb-2 w-max rounded-full border-white/30 bg-white/10 text-white">
                    {kategori.kategori}
                  </Badge>
                  <CardTitle className="text-xl font-semibold text-[#F7CDD0]">
                    Program Bidang {kategori.kategori}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {kategori.program.map((program, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F7CDD0]/20 text-xs font-semibold text-[#F7CDD0]">
                          {idx + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-white/90">
                          {program}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Bergabung dengan MKPS
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/75">
            Mari bersama-sama menguatkan ekosistem kepengawasan melalui kolaborasi dan inovasi.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="w-full bg-white text-[#371314] shadow-lg shadow-black/30 hover:bg-white/90 sm:w-auto"
              asChild
            >
              <Link href="/auth/login">Masuk ke Portal</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white/40 text-white hover:bg-white/10 sm:w-auto"
              asChild
            >
              <Link href="#beranda">Kembali ke Beranda</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

