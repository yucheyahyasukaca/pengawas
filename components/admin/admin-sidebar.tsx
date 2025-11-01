"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type AdminNavSection, adminNavigation } from "@/config/admin";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type AdminSidebarProps = {
  sections?: AdminNavSection[];
  onNavigate?: () => void;
};

export function AdminSidebar({ sections = adminNavigation, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="relative flex h-full w-72 flex-col gap-6 overflow-hidden rounded-3xl border border-rose-100 bg-white/95 px-4 py-6 text-slate-700 shadow-[0_18px_36px_rgba(244,63,94,0.12)] backdrop-blur lg:rounded-none lg:border-r lg:border-rose-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.25),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-48 w-48 rounded-full bg-[rgba(251,191,36,0.2)] blur-3xl" />

      <div className="relative flex items-center gap-3 px-2">
        <img
          src="/jateng.png"
          alt="Logo Jateng"
          className="h-12 w-12 rounded-xl object-cover shadow-[0_12px_28px_rgba(244,63,94,0.25)]"
        />
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-500">
            Panel Admin
          </span>
          <span className="text-base font-semibold leading-tight text-slate-900">
            SIP Kepengawasan
          </span>
          <span className="text-xs font-medium text-rose-400">MKPS Jawa Tengah</span>
        </div>
      </div>

      <nav className="relative flex-1 overflow-y-auto pb-8 pt-2">
        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-400">
                {section.title}
              </p>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300",
                        isActive
                          ? "border-transparent bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 text-white shadow-lg"
                          : "border-rose-100/60 bg-white/80 text-slate-600 hover:border-rose-200 hover:bg-rose-50/80 hover:text-slate-800"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-xl border text-xs font-semibold transition-all",
                          isActive
                            ? "border-white/30 bg-white/20 text-white"
                            : "border-rose-200 bg-rose-50 text-rose-500 group-hover:border-rose-300",
                        )}
                      >
                        <item.icon className="size-4" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span
                          className={cn(
                            "truncate font-semibold",
                            isActive ? "text-white" : "text-slate-700",
                          )}
                        >
                          {item.title}
                        </span>
                        {item.description ? (
                          <span
                            className={cn(
                              "text-[11px]",
                              isActive ? "text-white/85" : "text-slate-500",
                            )}
                          >
                            {item.description}
                          </span>
                        ) : null}
                      </div>
                      {item.badge ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            "border-rose-200 bg-rose-50 text-rose-600",
                            isActive && "border-white/70 bg-white/20 text-white",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="relative rounded-2xl border border-dashed border-rose-200/60 bg-gradient-to-br from-rose-50 via-white to-rose-50 p-4 text-xs text-slate-600 shadow-inner">
        <p className="font-semibold text-rose-600">Tips Skalabilitas</p>
        <p className="mt-1 leading-relaxed text-slate-600">
          Kembangkan fitur bertahap dan monitor performa untuk menjaga dashboard tetap ringan.
        </p>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-rose-500 shadow-sm">
          <span className="size-2 rounded-full bg-rose-400" />
          Mode Modern
        </span>
      </div>
    </aside>
  );
}


