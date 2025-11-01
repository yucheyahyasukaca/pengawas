"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  adminNavigation,
  adminQuickActions,
  type AdminNavItem,
} from "@/config/admin";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminSidebar } from "./admin-sidebar";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";

type AdminHeaderProps = {
  className?: string;
};

function useActiveNavItem(pathname: string): AdminNavItem | undefined {
  const items = useMemo(
    () => adminNavigation.flatMap((section) => section.items),
    [],
  );

  return useMemo(() => {
    return (
      items.find((item) => pathname === item.href) ??
      items.find((item) => item.href !== "/admin" && pathname.startsWith(`${item.href}/`)) ??
      items.find((item) => item.href === "/admin")
    );
  }, [items, pathname]);
}

function formatBreadcrumb(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    return {
      label: segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      href,
    };
  });

  return crumbs.length === 0
    ? [{ label: "Dasbor", href: "/admin" }]
    : crumbs;
}

export function AdminHeader({ className }: AdminHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeItem = useActiveNavItem(pathname);
  const breadcrumbs = formatBreadcrumb(pathname);

  return (
    <header
      className={cn(
        "supports-[backdrop-filter]:bg-white/80 sticky inset-x-0 top-0 z-40 flex flex-col gap-4 border-b border-sky-100 bg-white/70 px-4 py-3 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden border-slate-200 bg-white text-sky-600 hover:border-slate-300 hover:bg-sky-50"
            >
              <Menu className="size-5" />
              <span className="sr-only">Buka navigasi</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigasi Panel Admin</SheetTitle>
            </SheetHeader>
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 flex-col gap-1">
          <nav className="text-xs font-semibold text-slate-500">
            <ol className="flex flex-wrap items-center gap-1">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={crumb.href} className="flex items-center gap-1 text-slate-500">
                    {index > 0 ? <span className="text-slate-400">/</span> : null}
                    {isLast ? (
                      <span className="font-semibold text-slate-700">{crumb.label}</span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="transition-colors text-slate-600 hover:text-slate-800"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900">
              {activeItem?.title ?? "Panel Admin"}
            </h1>
            <span className="hidden items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700 sm:flex">
              Admin MKPS
            </span>
          </div>
          {activeItem?.description ? (
            <p className="text-sm text-slate-600">
              {activeItem.description}
            </p>
          ) : null}
        </div>

        <div className="hidden flex-1 items-center gap-2 md:flex">
          <div className="relative ml-auto w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sky-400" />
            <input
              type="search"
              placeholder="Cari agenda, berita, atau pengguna…"
              className="w-full rounded-lg border border-sky-100 bg-white/80 pl-9 pr-3 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden border-sky-100 bg-white/80 text-sky-600 hover:bg-sky-50"
          >
            <Search className="size-5" />
            <span className="sr-only">Cari</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-sky-500 hover:bg-sky-50 hover:text-sky-600"
          >
            <Bell className="size-5" />
            <span className="sr-only">Notifikasi</span>
          </Button>
          <Button
            variant="outline"
            className="hidden items-center gap-2 rounded-full border-sky-100 bg-white/80 pl-2 pr-3 text-slate-600 hover:bg-sky-50 sm:flex"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-sm font-semibold text-white shadow-md">
              MK
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold leading-none text-slate-700">
                Admin MKPS
              </span>
              <span className="text-[11px] text-slate-600">admin@sip-mkps.id</span>
            </div>
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sky-400" />
            <input
              type="search"
              placeholder="Cari agenda atau berita…"
              className="w-full rounded-lg border border-sky-100 bg-white/90 pl-9 pr-3 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {adminQuickActions.map((action) => (
            <Button
              key={action.href}
              variant="default"
              size="sm"
              className="!border-0 bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-500 font-semibold text-white shadow-lg hover:from-sky-700 hover:via-sky-600 hover:to-emerald-600 focus-visible:ring-sky-300"
              asChild
            >
              <Link href={action.href}>{action.title}</Link>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}


