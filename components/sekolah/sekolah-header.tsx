"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  sekolahNavigation,
  type SekolahNavItem,
} from "@/config/sekolah";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SekolahSidebar } from "./sekolah-sidebar";
import { Menu, Bell, Search, ChevronDown, LogOut } from "lucide-react";

type SekolahHeaderProps = {
  className?: string;
};

function useActiveNavItem(pathname: string): SekolahNavItem | undefined {
  const items = useMemo(
    () => sekolahNavigation.flatMap((section) => section.items),
    [],
  );

  return useMemo(() => {
    return (
      items.find((item) => pathname === item.href) ??
      items.find((item) => item.href !== "/sekolah" && pathname.startsWith(`${item.href}/`)) ??
      items.find((item) => item.href === "/sekolah")
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
    ? [{ label: "Dashboard", href: "/sekolah" }]
    : crumbs;
}

export function SekolahHeader({ className }: SekolahHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const signOutButtonRef = useRef<HTMLButtonElement>(null);
  const activeItem = useActiveNavItem(pathname);
  const breadcrumbs = formatBreadcrumb(pathname);

  useEffect(() => {
    setIsMounted(true);
    // Load user data
    fetch('/api/auth/get-current-user')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserEmail(data.user.email || "");
          setUserName(data.user.nama || data.user.email?.split('@')[0] || "Sekolah");
        }
      })
      .catch(() => {});
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as HTMLElement;
      
      if (signOutButtonRef.current && signOutButtonRef.current.contains(target)) {
        return;
      }
      
      const buttonElement = target.closest('button');
      if (buttonElement && buttonElement.textContent?.trim().includes('Keluar')) {
        return;
      }
      
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
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

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "SK";

  return (
    <header
      className={cn(
        "supports-[backdrop-filter]:bg-white/90 sticky top-0 z-40 border-b border-green-100 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur",
        className,
      )}
    >
      {/* Mobile Layout */}
      <div className="relative flex items-center gap-3 md:hidden">
        {isMounted && (
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
              >
                <Menu className="size-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col gap-0 p-0 border-r border-slate-200 bg-white">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigasi Panel Sekolah</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col overflow-hidden">
                <SekolahSidebar onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        )}
        {!isMounted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
          >
            <Menu className="size-5" />
            <span className="sr-only">Menu</span>
          </Button>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <h1 className="truncate text-base font-bold text-green-900">
            {activeItem?.title ?? "Panel Sekolah"}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg text-green-600 hover:bg-green-50"
          >
            <Bell className="size-5" />
            <span className="sr-only">Notifikasi</span>
          </Button>
          
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="h-9 rounded-full border-0 bg-green-50 p-0.5 hover:bg-green-100"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 via-green-400 to-emerald-400 text-xs font-bold text-white">
                {initials}
              </div>
            </Button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-green-100 bg-white shadow-lg">
                <div className="p-1">
                  <div className="px-3 py-2 border-b border-green-50">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 via-green-400 to-emerald-400 text-xs font-bold text-white">
                        {initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-800">{userName}</span>
                        <span className="text-[11px] text-slate-600">{userEmail}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    ref={signOutButtonRef}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setUserMenuOpen(false);
                      handleSignOut();
                    }}
                    disabled={isSigningOut}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-green-50 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="size-4" />
                    <span>{isSigningOut ? "Keluar..." : "Keluar"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="relative hidden md:flex items-center gap-4">
        {isMounted && (
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden border-0 bg-slate-100 text-green-600 shadow-sm transition hover:bg-slate-200 hover:text-green-700"
              >
                <Menu className="size-5" />
                <span className="sr-only">Buka navigasi</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col gap-0 p-0 border-r border-slate-200 bg-white">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigasi Panel Sekolah</SheetTitle>
              </SheetHeader>
              <div className="flex h-full flex-col overflow-hidden">
                <SekolahSidebar onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        )}
        {!isMounted && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden border-0 bg-slate-100 text-green-600 shadow-sm transition hover:bg-slate-200 hover:text-green-700"
          >
            <Menu className="size-5" />
            <span className="sr-only">Buka navigasi</span>
          </Button>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <nav className="text-xs font-semibold text-green-500">
            <ol className="flex flex-wrap items-center gap-1">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={crumb.href} className="flex items-center gap-1 text-green-500">
                    {index > 0 ? <span className="text-green-300">/</span> : null}
                    {isLast ? (
                      <span className="font-semibold text-green-700">{crumb.label}</span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="transition-colors text-green-500 hover:text-green-700"
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
            <h1 className="truncate text-lg font-bold leading-tight tracking-tight text-green-900 sm:text-xl">
              {activeItem?.title ?? "Panel Sekolah"}
            </h1>
            <span className="hidden shrink-0 items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-600 sm:flex">
              Sekolah
            </span>
          </div>
          {activeItem?.description ? (
            <p className="line-clamp-2 text-xs text-slate-600 sm:text-sm">
              {activeItem.description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 items-center gap-2">
          <div className="relative ml-auto w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-green-400" />
            <input
              type="search"
              placeholder="Cari data sekolah, kegiatan, atau laporan…"
              className="w-full rounded-full border border-green-100 bg-white/85 pl-10 pr-4 text-sm text-slate-700 shadow-inner transition placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200"
            />
          </div>
        </div>

        {/* User menu for desktop */}
        <div className="shrink-0 relative" ref={userMenuRef}>
          <Button
            variant="outline"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="items-center gap-2 rounded-full border-0 bg-white pl-2 pr-3 text-slate-700 shadow-md transition hover:bg-green-50"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 via-green-400 to-emerald-400 text-sm font-semibold text-white shadow-lg">
              {initials}
            </div>
            <div className="hidden flex-col items-start lg:flex">
              <span className="text-xs font-semibold leading-none text-slate-800">
                {userName}
              </span>
              <span className="text-[11px] text-slate-700">{userEmail}</span>
            </div>
            <ChevronDown className={cn("size-4 transition-transform", userMenuOpen && "rotate-180")} />
          </Button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border border-green-100 bg-white shadow-lg shadow-black/5">
              <div className="p-1">
                <div className="px-3 py-2 border-b border-green-50">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 via-green-400 to-emerald-400 text-sm font-semibold text-white shadow-lg">
                      {initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800">
                        {userName}
                      </span>
                      <span className="text-[11px] text-slate-600">{userEmail}</span>
                    </div>
                  </div>
                </div>
                <button
                  ref={(el) => {
                    if (!signOutButtonRef.current) {
                      signOutButtonRef.current = el;
                    }
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUserMenuOpen(false);
                    handleSignOut();
                  }}
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
    </header>
  );
}

