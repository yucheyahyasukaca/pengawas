"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Users,
  ClipboardList,
  GraduationCap,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const pelaporanModules = [
  {
    id: "rencana-program-kepengawasan",
    title: "Rencana Program Kepengawasan",
    icon: FileText,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    borderColor: "border-blue-200/60",
    hoverBorder: "hover:border-blue-300",
    hoverBg: "hover:bg-blue-50/40",
    textColor: "text-blue-700",
    shadow: "shadow-blue-100/50",
    description: "Input rencana dan unduh laporan PDF",
    features: ["Input rencana program", "Unduh laporan PDF"],
    href: "/admin/pelaporan/rencana-program-kepengawasan",
  },
  {
    id: "rencana-pendampingan-kepsek",
    title: "Rencana Pendampingan Kepala Sekolah",
    icon: Users,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    borderColor: "border-emerald-200/60",
    hoverBorder: "hover:border-emerald-300",
    hoverBg: "hover:bg-emerald-50/40",
    textColor: "text-emerald-700",
    shadow: "shadow-emerald-100/50",
    description: "Rencana RKS berbasis data dan prioritas masalah",
    features: ["RKS berbasis data", "Prioritas masalah", "Rapor Pendidikan"],
    href: "/admin/pelaporan/rencana-pendampingan-kepsek",
  },
  {
    id: "pelaksanaan-pendampingan-supervisi",
    title: "Pelaksanaan Pendampingan & Supervisi",
    icon: ClipboardList,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    borderColor: "border-purple-200/60",
    hoverBorder: "hover:border-purple-300",
    hoverBg: "hover:bg-purple-50/40",
    textColor: "text-purple-700",
    shadow: "shadow-purple-100/50",
    description: "Entri data, upload bukti, dan rekap otomatis",
    features: ["Entri data pendampingan", "Upload bukti", "Rekap otomatis"],
    href: "/admin/pelaporan/pelaksanaan-pendampingan-supervisi",
  },
  {
    id: "pelaksanaan-pengembangan-diri",
    title: "Pelaksanaan Pengembangan Diri",
    icon: GraduationCap,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    borderColor: "border-amber-200/60",
    hoverBorder: "hover:border-amber-300",
    hoverBg: "hover:bg-amber-50/40",
    textColor: "text-amber-700",
    shadow: "shadow-amber-100/50",
    description: "Upload laporan dan sertifikat pengembangan diri",
    features: ["Upload laporan", "Sertifikat", "Unduh otomatis"],
    href: "/admin/pelaporan/pelaksanaan-pengembangan-diri",
  },
  {
    id: "pelaporan-triwulan-tahunan",
    title: "Pelaporan Triwulan & Tahunan",
    icon: Calendar,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    borderColor: "border-pink-200/60",
    hoverBorder: "hover:border-pink-300",
    hoverBg: "hover:bg-pink-50/40",
    textColor: "text-pink-700",
    shadow: "shadow-pink-100/50",
    description: "Laporan triwulan dan tahunan dengan ekspor PDF",
    features: ["Laporan triwulan", "Laporan tahunan", "Ekspor PDF"],
    href: "/admin/pelaporan/triwulan-tahunan",
  },
];

export default function PelaporanPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md">
              <Sparkles className="size-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Modul Perencanaan & Pelaporan
            </h1>
          </div>
          <p className="text-xs text-slate-500 sm:text-sm ml-10">
            Pilih modul untuk membuat perencanaan dan laporan dengan mudah dan cepat
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pelaporanModules.map((module) => (
          <Link
            key={module.id}
            href={module.href}
            className="group block"
          >
            <Card
              className={cn(
                "relative h-full overflow-hidden bg-white/80 backdrop-blur-sm",
                "border-2 rounded-2xl transition-all duration-300 ease-out",
                "hover:-translate-y-1.5 hover:shadow-xl",
                "hover:bg-white",
                module.borderColor,
                module.hoverBorder,
                module.shadow,
                "cursor-pointer"
              )}
            >
              {/* Subtle gradient overlay on hover */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none rounded-2xl",
                  module.iconBg
                )}
              />

              <CardHeader className="pb-3.5 relative z-10">
                <div className="flex items-start gap-3.5">
                  {/* Icon with enhanced styling */}
                  <div
                    className={cn(
                      "flex size-14 shrink-0 items-center justify-center rounded-2xl",
                      "transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
                      "shadow-md",
                      module.iconBg
                    )}
                  >
                    <module.icon className={cn("size-7", module.iconColor)} />
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <CardTitle className="text-sm font-bold leading-tight text-slate-800 line-clamp-2 sm:text-base mb-1">
                      {module.title}
                    </CardTitle>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">
                      {module.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="shrink-0 pt-0.5">
                    <ChevronRight className={cn(
                      "size-5 text-slate-300 transition-all duration-300",
                      "group-hover:translate-x-1 group-hover:text-slate-500",
                      module.iconColor.replace('text-', 'group-hover:')
                    )} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 pb-4 relative z-10">
                {/* Features Tags - Enhanced */}
                <div className="flex flex-wrap gap-2">
                  {module.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium",
                        "border transition-all duration-200",
                        "group-hover:scale-105",
                        module.iconBg,
                        module.borderColor.replace('/60', ''),
                        module.textColor,
                        "shadow-sm"
                      )}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </CardContent>

              {/* Bottom accent line */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300",
                  "opacity-0 group-hover:opacity-100",
                  module.iconBg,
                  "shadow-sm"
                )}
              />

              {/* Decorative corner accent */}
              <div
                className={cn(
                  "absolute top-0 right-0 size-20 rounded-bl-full opacity-5 transition-opacity duration-300 group-hover:opacity-10 pointer-events-none",
                  module.iconBg
                )}
              />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}