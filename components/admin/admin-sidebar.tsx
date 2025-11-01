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
    <aside className="flex h-full w-72 flex-col gap-6 rounded-3xl border border-white/60 bg-white/95 px-4 py-6 text-slate-700 shadow-[0_10px_30px_rgba(15,118,110,0.08)] lg:rounded-none lg:border-r lg:border-white/60">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-sm font-semibold text-white shadow-lg">
          MK
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Panel Admin
          </span>
          <span className="text-base font-semibold leading-tight text-slate-700">
            SIP Kepengawasan
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto pb-8 pt-2">
        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
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
                        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
                        isActive
                          ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg"
                          : "text-slate-600 hover:bg-sky-50 hover:text-slate-800"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
                          isActive ? "text-white" : "text-sky-500",
                        )}
                      />
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
                              isActive ? "text-white/85" : "text-slate-600",
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
                            "border-sky-200 bg-sky-50 text-sky-700",
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

      <div className="rounded-2xl border border-dashed border-sky-200/70 bg-sky-50/80 p-4 text-xs text-slate-600">
        <p className="font-semibold text-slate-700">Tips Skalabilitas</p>
        <p className="mt-1 leading-relaxed text-slate-600">
          Kembangkan fitur bertahap dan monitor performa untuk menjaga dashboard tetap ringan.
        </p>
      </div>
    </aside>
  );
}


