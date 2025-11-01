import Image from "next/image";
import Link from "next/link";

import jatengLogo from "@/public/jateng.png";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-br from-[#1C0B0C] via-[#311112] to-[#1A0707] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/5 p-1.5 shadow-lg shadow-black/30">
              <Image
                src={jatengLogo}
                alt="Logo MKPS Jawa Tengah"
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
                Sistem Informasi & Pengelolaan Kepengawasan
              </p>
              <p className="text-lg font-bold text-white">
                {siteConfig.name}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xl text-sm text-white/70">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Tautan Utama
          </h3>
          <Separator className="w-12 bg-white/20" />
          <ul className="space-y-2 text-sm text-white/70">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/auth/login"
                className="transition-colors hover:text-white"
              >
                Portal Pengawas
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Kontak & Sosial
          </h3>
          <Separator className="w-12 bg-white/20" />
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <span className="text-white">Email:</span> {siteConfig.contact.email}
            </li>
            <li>
              <span className="text-white">Telepon:</span> {siteConfig.contact.phone}
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 text-sm text-white/70">
            {siteConfig.socialLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#120506] py-6">
        <p className="mx-auto max-w-7xl px-4 text-sm text-white/60 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} MKPS SMA & SLB Provinsi Jawa Tengah. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}

