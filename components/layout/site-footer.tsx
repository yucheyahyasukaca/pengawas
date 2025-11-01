import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-gradient-to-br from-muted/30 via-white to-secondary/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
              <span className="text-lg font-semibold">SIP</span>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Sistem Informasi & Pengelolaan Kepengawasan
              </p>
              <p className="text-lg font-bold text-foreground">
                {siteConfig.name}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Tautan Utama
          </h3>
          <Separator className="w-12" />
          <ul className="space-y-2 text-sm text-muted-foreground">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/auth/login"
                className="transition-colors hover:text-primary"
              >
                Portal Pengawas
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Kontak & Sosial
          </h3>
          <Separator className="w-12" />
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Email: {siteConfig.contact.email}</li>
            <li>Telepon: {siteConfig.contact.phone}</li>
          </ul>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {siteConfig.socialLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t bg-background py-6">
        <p className="mx-auto max-w-7xl px-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} MKPS SMA & SLB Provinsi Jawa Tengah. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}

