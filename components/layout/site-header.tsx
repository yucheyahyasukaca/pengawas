"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const headerBackgroundClass =
    "bg-[#371314] text-white";

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

        {isMounted ? (
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
                "pt-6",
                headerBackgroundClass,
                "shadow-none border-b border-transparent bg-[#371314]",
              )}
            >
              <SheetHeader>
                <SheetTitle className="text-left text-base font-semibold text-white">
                  Navigasi SIP-Kepengawasan Jateng
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 space-y-4">
                {siteConfig.navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-base font-medium text-white/90 transition-colors hover:bg-white/10",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Separator className="my-4 bg-white/20" />
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link href="/berita" onClick={() => setOpen(false)}>
                    Berita
                  </Link>
                </Button>
                <Button
                  className="border-0 focus-visible:border-0 justify-start bg-white text-[#3F0607] hover:bg-white/90"
                  asChild
                >
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    Masuk ke Portal
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white"
            disabled
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
      </div>
    </header>
  );
}
