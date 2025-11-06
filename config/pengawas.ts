import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Database,
  FileText,
  Calendar,
  School,
  User,
  FileSpreadsheet,
  Upload,
  Filter,
  ClipboardList,
  BookOpen,
  CheckSquare,
  FileCheck,
  Users,
  GraduationCap,
  Award,
  Target,
  Activity,
  FileBarChart,
  Download,
  PenTool,
  Settings,
} from "lucide-react";

export type PengawasNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
};

export type PengawasNavSection = {
  title: string;
  items: PengawasNavItem[];
};

export const pengawasNavigation: PengawasNavSection[] = [
  {
    title: "Utama",
    items: [
      {
        title: "Dashboard",
        href: "/pengawas",
        icon: LayoutDashboard,
        description: "Ringkasan data sekolah binaan, status pelaporan, dan jadwal kegiatan",
      },
    ],
  },
  {
    title: "Manajemen Data",
    items: [
      {
        title: "Data Pengawas",
        href: "/pengawas/manajemen-data/pengawas",
        icon: User,
        description: "Nama, NIP, wilayah tugas, jumlah sekolah binaan",
      },
      {
        title: "Data Sekolah Binaan",
        href: "/pengawas/manajemen-data/sekolah",
        icon: School,
        description: "Nama sekolah, NPSN, jenis, alamat, status binaan",
      },
      {
        title: "Approval Sekolah",
        href: "/pengawas/manajemen-data/approval-sekolah",
        icon: CheckSquare,
        description: "Review dan setujui pendaftaran sekolah binaan",
        badge: "new",
      },
    ],
  },
  {
    title: "Perencanaan & Pelaksanaan",
    items: [
      {
        title: "Rencana Program Kepengawasan",
        href: "/pengawas/perencanaan/rencana-program",
        icon: ClipboardList,
        description: "Input dan unduh laporan rencana program kepengawasan",
      },
      {
        title: "Rencana Pendampingan RKS",
        href: "/pengawas/perencanaan/rencana-pendampingan",
        icon: Target,
        description: "Menyusun rencana pendampingan RKS berbasis data",
      },
      {
        title: "Pendampingan & Supervisi",
        href: "/pengawas/pelaksanaan",
        icon: Activity,
        description: "Entri data pendampingan dan supervisi berbagai jenis",
      },
      {
        title: "Pengembangan Diri",
        href: "/pengawas/pengembangan-diri",
        icon: GraduationCap,
        description: "Upload laporan pengembangan diri dan sertifikat",
      },
    ],
  },
  {
    title: "Pelaporan",
    items: [
      {
        title: "Laporan Triwulan",
        href: "/pengawas/pelaporan/triwulan",
        icon: FileBarChart,
        description: "Laporan Triwulan 1, 2, 3, 4 dengan format resmi",
      },
      {
        title: "Laporan Tahunan",
        href: "/pengawas/pelaporan/tahunan",
        icon: FileCheck,
        description: "Laporan tahunan otomatis merekap seluruh kegiatan",
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        title: "Pengaturan",
        href: "/pengawas/pengaturan",
        icon: Settings,
        description: "Preferensi tampilan dan integrasi sistem",
      },
    ],
  },
];

export const pengawasQuickActions = [
  {
    title: "Input Rencana Program",
    description: "Buat rencana program kepengawasan baru",
    href: "/pengawas/perencanaan/rencana-program/buat",
  },
  {
    title: "Entri Supervisi",
    description: "Catat hasil supervisi atau pendampingan",
    href: "/pengawas/pelaksanaan/buat",
  },
  {
    title: "Upload Pengembangan Diri",
    description: "Tambah laporan pengembangan diri",
    href: "/pengawas/pengembangan-diri/buat",
  },
];

