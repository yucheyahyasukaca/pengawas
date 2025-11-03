"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Menu, 
  Home, 
  Building2, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Newspaper,
  LogIn,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import jatengLogo from "@/public/jateng.png";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

// Icon mapping for navigation items
const navigationIcons: Record<string, typeof Home> = {
  "/": Home,
  "/profil-mkps": Building2,
  "/karya-pengawas": BookOpen,
  "#regulasi": FileText,
  "#forum": MessageSquare,
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const headerBackgroundClass =
    "bg-[#371314] text-white";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent shadow-md backdrop-blur supports-[backdrop-filter]:bg-[#371314]/90",
        headerBackgroundClass,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#beranda" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/5 p-1 shadow-lg">
            <Image
              src={jatengLogo}
              alt="Logo MKPS Jawa Tengah"
              width={36}
              height={36}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight text-white">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
              MKPS SMA &amp; SLB
            </span>
            <span className="text-base font-bold sm:text-lg">
              {siteConfig.shortName}
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {siteConfig.navigation.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/berita">Berita</Link>
            </Button>
            <Button
              className="border-0 focus-visible:border-0 bg-white text-[#3F0607] shadow-lg shadow-black/20 hover:bg-white/90"
              asChild
            >
              <Link href="/auth/login">Masuk</Link>
            </Button>
          </div>
        </div>

        {mounted && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10 hover:text-white"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              className={cn(
                "h-full overflow-y-auto bg-gradient-to-b from-[#371314] via-[#4a1a1c] to-[#371314]",
                "border-0 shadow-2xl",
                "p-0"
              )}
            >
              {/* Accessibility: Required SheetTitle for screen readers */}
              <SheetHeader className="sr-only">
                <SheetTitle>Navigasi SIP-Kepengawasan Jateng</SheetTitle>
              </SheetHeader>

              {/* Header with logo and close button */}
              <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-[#371314] to-[#4a1a1c] px-6 py-5 backdrop-blur-sm border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1.5 shadow-lg backdrop-blur-sm">
                    <Image
                      src={jatengLogo}
                      alt="Logo MKPS Jawa Tengah"
                      width={32}
                      height={32}
                      className="h-full w-full object-contain"
                      priority
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                      Navigasi
                    </span>
                    <span className="text-sm font-bold text-white leading-tight">
                      SIP-Kepengawasan Jateng
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-10 w-10 rounded-xl text-white hover:bg-white/20 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              {/* Navigation Items */}
              <div className="px-4 py-6 space-y-2">
                {siteConfig.navigation.map((item) => {
                  const Icon = navigationIcons[item.href] || Home;
                  const isActive = pathname === item.href || 
                    (item.href === "/" && pathname === "/");
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center gap-4 rounded-xl px-4 py-3.5",
                        "text-base font-medium transition-all duration-200",
                        "min-h-[56px] touch-manipulation",
                        isActive
                          ? "bg-white/15 text-white shadow-lg shadow-black/10"
                          : "text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-white/80 group-hover:bg-white/15 group-hover:text-white"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <div className="h-2 w-2 rounded-full bg-white/80" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Separator */}
              <div className="px-4 py-2">
                <Separator className="bg-white/20" />
              </div>

              {/* Additional Actions */}
              <div className="px-4 py-4 space-y-3">
                <Link
                  href="/berita"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-4 rounded-xl px-4 py-3.5 min-h-[56px] touch-manipulation text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/80 group-hover:bg-white/15 group-hover:text-white transition-all duration-200">
                    <Newspaper className="h-5 w-5" />
                  </div>
                  <span className="flex-1 text-base font-medium">Berita</span>
                </Link>

                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-4 rounded-xl px-4 py-3.5 min-h-[56px] touch-manipulation bg-white text-[#3F0607] hover:bg-white/90 shadow-lg shadow-black/20 transition-all duration-200 font-semibold"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3F0607]/10 text-[#3F0607]">
                    <LogIn className="h-5 w-5" />
                  </div>
                  <span className="flex-1 text-base">Masuk ke Portal</span>
                </Link>
              </div>

              {/* Footer spacing */}
              <div className="h-6" />
            </SheetContent>
          </Sheet>
        )}
        {!mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10 hover:text-white"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
      </div>
    </header>
  );
}
