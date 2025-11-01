import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  FileSpreadsheet,
  LayoutDashboard,
  Newspaper,
  Settings,
  Users,
  Building2,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
};

export type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
};

export const adminNavigation: AdminNavSection[] = [
  {
    title: "Utama",
    items: [
      {
        title: "Dasbor",
        href: "/admin",
        icon: LayoutDashboard,
        description:
          "Gambaran umum aktivitas, statistik, dan status terbaru",
      },
    ],
  },
  {
    title: "Konten",
    items: [
      {
        title: "Agenda",
        href: "/admin/agenda",
        icon: CalendarClock,
        description: "Kelola agenda kegiatan dan jadwal penting",
        badge: "baru",
      },
      {
        title: "Berita",
        href: "/admin/berita",
        icon: Newspaper,
        description: "Manajemen publikasi berita dan informasi",
      },
      {
        title: "Profil",
        href: "/admin/profil",
        icon: Building2,
        description: "Kelola profil MKPS di landing page",
      },
    ],
  },
  {
    title: "Kolaborasi",
    items: [
      {
        title: "Pengguna",
        href: "/admin/pengguna",
        icon: Users,
        description: "Atur peran dan hak akses kolaborator",
      },
      {
        title: "Pelaporan",
        href: "/admin/pelaporan",
        icon: FileSpreadsheet,
        description: "Analisis pelaporan pengawasan dan tindak lanjut",
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        title: "Pengaturan",
        href: "/admin/pengaturan",
        icon: Settings,
        description: "Preferensi tampilan dan integrasi sistem",
      },
    ],
  },
];

export const adminQuickActions = [
  {
    title: "Agenda Baru",
    description: "Rencanakan kegiatan pengawasan atau pendampingan",
    href: "/admin/agenda/buat",
  },
  {
    title: "Terbitkan Berita",
    description: "Bagikan update terbaru dan informasi penting",
    href: "/admin/berita/tulis",
  },
  {
    title: "Undang Pengawas",
    description: "Kirim undangan kolaborasi untuk tim pengawas",
    href: "/admin/pengguna#undang",
  },
];


