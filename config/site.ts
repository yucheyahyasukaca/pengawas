export const siteConfig = {
  name: "SIP-Kepengawasan Jateng",
  shortName: "SIP Kepengawasan",
  description:
    "Sistem informasi terintegrasi untuk mendukung pengawasan SMA & SLB Provinsi Jawa Tengah yang berbasis data dan kolaboratif.",
  tagline: "Digitalisasi Pengawasan untuk Pendidikan yang Berdampak dan Berbasis Data",
  contact: {
    email: "mkps@sip-kepengawasanjateng.id",
    phone: "+62-24-0000-0000",
  },
  socialLinks: [
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
  ],
  navigation: [
    { href: "#beranda", label: "Beranda" },
    { href: "/profil-mkps", label: "Profil MKPS" },
    { href: "#karya", label: "Karya Pengawas" },
    { href: "#regulasi", label: "Regulasi" },
    { href: "#forum", label: "Forum" },
  ],
};

export type SiteConfig = typeof siteConfig;

