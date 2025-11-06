import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Activity,
  FileText,
  Settings,
} from "lucide-react";

export type SekolahNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
};

export type SekolahNavSection = {
  title: string;
  items: SekolahNavItem[];
};

export const sekolahNavigation: SekolahNavSection[] = [
  {
    title: "Utama",
    items: [
      {
        title: "Dashboard",
        href: "/sekolah",
        icon: LayoutDashboard,
        description: "Ringkasan data sekolah dan aktivitas terbaru",
      },
    ],
  },
  {
    title: "Profil Sekolah",
    items: [
      {
        title: "Profil Sekolah",
        href: "/sekolah/profil",
        icon: Building2,
        description: "Kelola data identitas dan profil sekolah",
      },
    ],
  },
  {
    title: "Data Sekolah",
    items: [
      {
        title: "Identitas Sekolah",
        href: "/sekolah/profil#identitas",
        icon: Building2,
        description: "Data identitas sekolah",
      },
      {
        title: "Profil Guru",
        href: "/sekolah/profil#profil-guru",
        icon: User,
        description: "Data profil guru",
      },
      {
        title: "Profil Tenaga Kependidikan",
        href: "/sekolah/profil#profil-tenaga-kependidikan",
        icon: Briefcase,
        description: "Data tenaga kependidikan",
      },
      {
        title: "Profil Siswa",
        href: "/sekolah/profil#profil-siswa",
        icon: GraduationCap,
        description: "Data profil siswa",
      },
      {
        title: "Branding Sekolah",
        href: "/sekolah/profil#branding",
        icon: Award,
        description: "Branding yang diterapkan",
      },
      {
        title: "Kokurikuler",
        href: "/sekolah/profil#kokurikuler",
        icon: BookOpen,
        description: "Kegiatan kokurikuler",
      },
      {
        title: "Ekstrakurikuler",
        href: "/sekolah/profil#ekstrakurikuler",
        icon: Activity,
        description: "Kegiatan ekstrakurikuler",
      },
      {
        title: "Laporan Rapor Pendidikan",
        href: "/sekolah/profil#rapor-pendidikan",
        icon: FileText,
        description: "Laporan rapor pendidikan",
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        title: "Pengaturan",
        href: "/sekolah/pengaturan",
        icon: Settings,
        description: "Preferensi tampilan dan integrasi sistem",
      },
    ],
  },
];

export const sekolahQuickActions = [
  {
    title: "Lengkapi Profil",
    description: "Isi data profil sekolah Anda",
    href: "/sekolah/profil",
  },
];

