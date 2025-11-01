 use client;

import Link from next/link;
import { Menu } from lucide-react;
import { useState } from react;

import { siteConfig } from @/config/site;
import { cn } from @/lib/utils;
import { Button } from @/components/ui/button;
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from @/components/ui/navigation-menu;
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from @/components/ui/sheet;
import { Separator } from @/components/ui/separator;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className=sticky top-0 z-50 w-full border-b border-transparent bg-gradient-to-r from-primary/90 via-primary/95 to-primary/90 text-primary-foreground shadow-md backdrop-blur supports-[backdrop-filter]:bg-primary/85>
      <div className=mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8>
        <Link href=#beranda className=flex items-center gap-2>
          <div className=flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground shadow-lg ring-1 ring-primary/40>
            <span className=text-lg font-semibold>S</span>
          </div>
          <div className=flex flex-col leading-tight text-primary-foreground>
            <span className=text-xs font-semibold uppercase tracking-wide text-primary-foreground/70>
              MKPS SMA & SLB
            </span>
            <span className=text-base font-bold sm:text-lg>
              {siteConfig.shortName}
            </span>
          </div>
        </Link>

        <div className=hidden items-center gap-8 lg:flex>
          <NavigationMenu>
            <NavigationMenuList>
              {siteConfig.navigation.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    className=text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className=flex items-center gap-3>
            <Button
              variant=ghost
              className=text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground
              asChild
            >
              <Link href=#forum>Forum</Link>
            </Button>
            <Button
              className=bg-primary-foreground text-primary shadow-lg shadow-black/20 hover:bg-primary-foreground/90
              asChild
            >
              <Link href=/auth/login>Masuk</Link>
            </Button>
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant=ghost
              size=icon
              className=lg:hidden text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground
            >
              <Menu className=h-5 w-5 />
              <span className=sr-only>Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side=top className=pt-6>
            <SheetHeader>
              <SheetTitle className=text-left text-base font-semibold text-primary>
                Navigasi SIP-Kepengawasan Jateng
              </SheetTitle>
            </SheetHeader>
            <nav className=mt-4 space-y-4>
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    block rounded-md px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-muted,
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Separator className=my-4 />
            <div className=flex flex-col gap-2>
              <Button
                variant=ghost
                className=justify-start text-primary hover:bg-primary/10 hover:text-primary
                asChild
              >
                <Link href=#forum onClick={() => setOpen(false)}>
                  Forum Diskusi
                </Link>
              </Button>
              <Button
                className=justify-start bg-primary text-primary-foreground hover:bg-primary/90
                asChild
              >
                <Link href=/auth/login onClick={() => setOpen(false)}>
                  Masuk ke Portal
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
