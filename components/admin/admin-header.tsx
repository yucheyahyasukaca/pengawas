"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { Menu, Bell, Search, ChevronDown, LogOut } from "lucide-react";

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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const activeItem = useActiveNavItem(pathname);
  const breadcrumbs = formatBreadcrumb(pathname);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/auth/login");
      } else {
        const data = await response.json();
        console.error("Sign out error:", data.error);
        setIsSigningOut(false);
      }
    } catch (err) {
      console.error("Sign out exception:", err);
      setIsSigningOut(false);
    }
  };

  return (
    <header
      className={cn(
        "supports-[backdrop-filter]:bg-white/80 sticky top-0 z-40 flex flex-col gap-4 border-b border-rose-100 bg-white/70 px-4 py-3 shadow-[0_12px_30px_rgba(244,63,94,0.08)] backdrop-blur",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 h-24 rounded-full bg-gradient-to-r from-rose-200/40 via-transparent to-amber-200/40 blur-2xl" />
      <div className="pointer-events-none absolute right-10 top-4 h-24 w-24 rounded-full bg-rose-100/40 blur-3xl" />

      <div className="relative flex items-center gap-2 sm:gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden border-0 bg-slate-100 text-rose-600 shadow-sm transition hover:bg-slate-200 hover:text-rose-700"
            >
              <Menu className="size-5" />
              <span className="sr-only">Buka navigasi</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col gap-0 p-0 border-r border-slate-200 bg-white">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigasi Panel Admin</SheetTitle>
            </SheetHeader>
            <div className="flex h-full flex-col overflow-hidden">
              <AdminSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <nav className="text-xs font-semibold text-rose-500">
            <ol className="flex flex-wrap items-center gap-1">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={crumb.href} className="flex items-center gap-1 text-rose-500">
                    {index > 0 ? <span className="text-rose-300">/</span> : null}
                    {isLast ? (
                      <span className="font-semibold text-rose-700">{crumb.label}</span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="transition-colors text-rose-500 hover:text-rose-700"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h1 className="truncate text-lg font-bold leading-tight tracking-tight text-rose-900 sm:text-xl">
              {activeItem?.title ?? "Panel Admin"}
            </h1>
            <span className="hidden shrink-0 items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-600 sm:flex">
              Admin MKPS
            </span>
          </div>
          {activeItem?.description ? (
            <p className="line-clamp-2 text-xs text-slate-600 sm:text-sm">
              {activeItem.description}
            </p>
          ) : null}
        </div>

        <div className="hidden flex-1 items-center gap-2 md:flex">
          <div className="relative ml-auto w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-rose-400" />
            <input
              type="search"
              placeholder="Cari agenda, berita, atau pengguna…"
              className="w-full rounded-full border border-rose-100 bg-white/85 pl-10 pr-4 text-sm text-slate-700 shadow-inner transition placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
            />
          </div>
        </div>

        {/* User menu for desktop */}
        <div className="hidden shrink-0 sm:block relative" ref={userMenuRef}>
          <Button
            variant="outline"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="items-center gap-2 rounded-full border-0 bg-white pl-2 pr-3 text-slate-700 shadow-md transition hover:bg-rose-50"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-rose-400 to-amber-400 text-sm font-semibold text-white shadow-lg">
              MK
            </div>
            <div className="hidden flex-col items-start lg:flex">
              <span className="text-xs font-semibold leading-none text-slate-800">
                Admin MKPS
              </span>
              <span className="text-[11px] text-slate-700">mkps@garuda-21.com</span>
            </div>
            <ChevronDown className={cn("size-4 transition-transform", userMenuOpen && "rotate-180")} />
          </Button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border border-rose-100 bg-white shadow-lg shadow-black/5">
              <div className="p-1">
                <div className="px-3 py-2 border-b border-rose-50">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-rose-400 to-amber-400 text-sm font-semibold text-white shadow-lg">
                      MK
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800">
                        Admin MKPS
                      </span>
                      <span className="text-[11px] text-slate-600">mkps@garuda-21.com</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="size-4" />
                  <span>{isSigningOut ? "Keluar..." : "Keluar"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative mt-1 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-rose-400" />
            <input
              type="search"
              placeholder="Cari agenda atau berita…"
              className="w-full rounded-full border border-rose-100 bg-white/90 pl-10 pr-4 text-sm text-slate-700 shadow-inner transition placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
            />
          </div>
        </div>

        {/* Mobile toolbar: Bell + User menu */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="border-0 bg-slate-100 text-rose-600 shadow-sm transition hover:bg-slate-200 hover:text-rose-700"
          >
            <Bell className="size-5" />
            <span className="sr-only">Notifikasi</span>
          </Button>
          
          {/* Mobile user menu */}
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="outline"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="items-center gap-1 rounded-full border-0 bg-white pl-1 pr-2 text-slate-700 shadow-md transition hover:bg-rose-50"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-rose-400 to-amber-400 text-sm font-semibold text-white shadow-lg">
                MK
              </div>
              <ChevronDown className={cn("size-4 transition-transform", userMenuOpen && "rotate-180")} />
            </Button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border border-rose-100 bg-white shadow-lg shadow-black/5">
                <div className="p-1">
                  <div className="px-3 py-2 border-b border-rose-50">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-rose-400 to-amber-400 text-sm font-semibold text-white shadow-lg">
                        MK
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-800">
                          Admin MKPS
                        </span>
                        <span className="text-[11px] text-slate-600">mkps@garuda-21.com</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="size-4" />
                    <span>{isSigningOut ? "Keluar..." : "Keluar"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex flex-wrap items-center gap-2 md:justify-end">
          {adminQuickActions.map((action) => (
            <Button
              key={action.href}
              variant="default"
              size="sm"
              className="rounded-full border-0 bg-rose-600 px-4 font-semibold text-white shadow-md transition hover:bg-rose-700 hover:text-white"
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


