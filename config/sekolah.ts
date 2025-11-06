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
  Sparkles,
  UserCheck,
  Heart,
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
    title: "Supervisi Sekolah",
    items: [
      {
        title: "7 Kebiasaan Hebat",
        href: "/sekolah/supervisi/7-kebiasaan-hebat",
        icon: Sparkles,
        description: "7 Kebiasaan Hebat",
      },
      {
        title: "8 Profil Lulusan",
        href: "/sekolah/supervisi/8-profil-lulusan",
        icon: UserCheck,
        description: "8 Profil Lulusan",
      },
      {
        title: "Penguatan Karakter",
        href: "/sekolah/supervisi/penguatan-karakter",
        icon: Heart,
        description: "Penguatan Karakter",
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

