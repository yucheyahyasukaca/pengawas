"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { AdminFooter } from "./admin-footer";

type AdminLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-white via-sky-50/90 to-emerald-50/80",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(16,185,129,0.14),_transparent_45%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col lg:max-w-none lg:flex-row">
        <div className="hidden shrink-0 lg:block lg:w-72 lg:sticky lg:top-0 lg:self-start">
          <AdminSidebar />
        </div>

        <div className="flex min-h-screen flex-1 flex-col border-l border-white/60 bg-white/95 backdrop-blur lg:rounded-l-[2rem] lg:border-l lg:shadow-xl">
          <AdminHeader />
          <div className="flex-1 overflow-y-auto">
            <main className="px-4 pb-12 pt-6 sm:px-6 lg:px-0">
              <div className="mx-auto flex w-full flex-col gap-6 lg:max-w-none lg:px-6">
                {children}
              </div>
            </main>
          </div>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}


