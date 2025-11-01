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
    <aside className="relative flex h-full w-full max-w-[280px] flex-col overflow-hidden border-0 bg-white text-slate-700 lg:w-72 lg:overflow-visible lg:rounded-none lg:border-r lg:border-rose-100 lg:shadow-[0_18px_36px_rgba(244,63,94,0.12)] lg:max-h-screen lg:sticky lg:top-0 lg:self-start">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 hidden lg:block bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.25),_transparent_70%)]" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-48 w-48 rounded-full hidden lg:block bg-[rgba(251,191,36,0.2)] blur-3xl" />

      {/* Header */}
      <div className="relative z-10 shrink-0 border-b border-slate-200 px-3 pt-4 pb-3 bg-white lg:border-rose-100/50 lg:px-4 lg:pt-6 lg:pb-4 lg:bg-white/95 lg:backdrop-blur-sm">
        <div className="flex items-center gap-2.5 lg:gap-3 lg:px-2">
          <img
            src="/jateng.png"
            alt="Logo Jateng"
            className="h-10 w-10 rounded-lg object-cover shadow-[0_12px_28px_rgba(244,63,94,0.25)] lg:h-12 lg:w-12 lg:rounded-xl"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-500 lg:text-[11px] lg:tracking-[0.3em]">
              Panel Admin
            </span>
            <span className="text-sm font-semibold leading-tight truncate text-slate-900 lg:text-base">
              SIP Kepengawasan
            </span>
            <span className="text-[10px] font-medium truncate text-rose-400 lg:text-xs">MKPS Jawa Tengah</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3 lg:flex-initial lg:gap-4 lg:px-4 lg:py-4 lg:overflow-visible">
        <div className="flex flex-col gap-4 lg:gap-6">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-1.5 lg:gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500 lg:text-[11px] lg:tracking-[0.28em] lg:text-rose-400">
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
                        "group flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 lg:gap-2.5 lg:rounded-xl lg:px-2.5 lg:text-sm",
                        isActive
                          ? "border-rose-300 bg-rose-100 text-rose-700 shadow-md"
                          : "border-rose-100/60 bg-white/80 text-slate-600 hover:border-rose-200 hover:bg-rose-50/80 hover:text-slate-800"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold transition-all lg:size-7",
                          isActive
                            ? "border-rose-300 bg-rose-200 text-rose-700"
                            : "border-rose-200 bg-rose-50 text-rose-500 group-hover:border-rose-300",
                        )}
                      >
                        <item.icon className="size-3 lg:size-3.5" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span
                          className={cn(
                            "truncate font-semibold text-xs",
                            isActive ? "text-rose-700" : "text-slate-700",
                            "lg:text-[13px]"
                          )}
                        >
                          {item.title}
                        </span>
                        {item.description ? (
                          <span
                            className={cn(
                              "truncate text-[9px] leading-tight",
                              isActive ? "text-rose-600" : "text-slate-500",
                              "lg:text-[10px]"
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
                            "shrink-0 border-rose-200 bg-rose-50 text-rose-600 text-[9px] lg:text-[10px]",
                            isActive && "border-rose-300 bg-rose-200 text-rose-700",
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

      {/* Footer Help Button */}
      <div className="relative z-10 shrink-0 border-t border-slate-200 bg-white px-3 py-2.5 lg:border-rose-100 lg:px-4 lg:py-3 lg:bg-gradient-to-r lg:from-rose-50 lg:via-white lg:to-rose-50 lg:backdrop-blur-sm">
        <Link
          href="mailto:admin@sip-mkps.id"
          className="group flex w-full items-center gap-2 rounded-lg bg-gradient-to-br from-rose-500 via-rose-400 to-pink-500 p-2.5 text-left shadow-lg transition hover:shadow-xl hover:scale-[1.02] lg:gap-2.5 lg:rounded-xl lg:p-3"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm text-white shadow-sm ring-1 ring-white/30 lg:size-9">
            <span className="text-sm lg:text-base">💬</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[11px] font-bold text-white lg:text-xs">Butuh Bantuan?</span>
            <span className="text-[9px] font-medium text-white/90 leading-tight lg:text-[10px]">
              Kontak Admin MKPS
            </span>
          </div>
          <span className="shrink-0 text-white/80 transition-transform group-hover:translate-x-1 group-hover:text-white text-[10px] font-bold lg:text-xs">
            →
          </span>
        </Link>
      </div>
    </aside>
  );
}


