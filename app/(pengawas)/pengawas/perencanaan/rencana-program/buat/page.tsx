"use client";

import { StepIndicator } from "@/components/rencana/step-indicator";
import { ArrowRight, CheckCircle2, ChevronRight, FileText, Layout, Target, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default function BuatRencanaProgramPage() {
  const router = useRouter();

  // Define steps with their status/icons
  // For now, we manually manage status or just link them.
  // In future, we can check completion status from DB draft.
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const response = await fetch("/api/pengawas/rencana-program/draft");
        if (response.ok) {
          const { draft } = await response.json();
          if (draft && draft.form_data) {
            const completed = [];
            // Check Step 1 Completion (4 questions)
            const answers = draft.form_data.selectedAnswers || {};
            if (Object.keys(answers).length >= 4) {
              completed.push(1);
            }
            // Step 2, 3, 4 checks (simplified: if next step data exists, previous is done, or rely on explicit 'step' field if available)
            // But draft might not have 'step' field saved reliably if we didn't force it.
            // Let's assume:
            // Step 2 (Analysis) is done if Step 1 is done (auto).
            if (completed.includes(1)) completed.push(2);

            // Step 3 (Strategy) is done if marked in draft (we added step:3 save)
            if (draft.form_data.step >= 3) completed.push(3);

            // Step 4 (Method) is done if selectedMethod exists
            // Step 4 (Method) is done if selectedMethod exists or selectedMethods array has items
            if (draft.form_data.selectedMethod || (draft.form_data.selectedMethods && draft.form_data.selectedMethods.length > 0)) completed.push(4);

            setCompletedSteps(completed);
          }
        }
      } catch (error) {
        console.error("Failed to check progress", error);
      }
    };
    checkProgress();
  }, []);

  const steps = [
    {
      id: 1,
      title: "Melakukan wawancara untuk memetakan komitmen",
      description: "Identifikasi tingkat kesadaran refleksi dan kapasitas kepemimpinan perubahan.",
      icon: Users,
      href: "/pengawas/perencanaan/rencana-program/buat/wawancara",
      color: "indigo",
      active: true
    },
    {
      id: 2,
      title: "Analisis komitmen perubahan",
      description: "Tentukan prioritas perubahan dan strategi pendampingan berdasarkan hasil wawancara.",
      icon: Layout,
      href: "/pengawas/perencanaan/rencana-program/buat/analisis",
      color: "slate",
      active: completedSteps.includes(1)
    },
    {
      id: 3,
      title: "Menentukan Strategi Pendampingan",
      description: "Pilih strategi pendampingan yang sesuai dengan profil sekolah.",
      icon: Target,
      href: "/pengawas/perencanaan/rencana-program/buat/strategi",
      color: "slate",
      active: completedSteps.includes(1)
    },
    {
      id: 4,
      title: "Menentukan Metode Pendampingan",
      description: "Rancang metode pendampingan yang efektif untuk sekolah binaan.",
      icon: Zap,
      href: "/pengawas/perencanaan/rencana-program/buat/metode",
      color: "slate",
      active: completedSteps.includes(3) || completedSteps.includes(1) // unlock if step 1 done for easier testing
    },
    {
      id: 5,
      title: "Merancang Lembar Perencanaan Pendampingan",
      description: "Finalisasi rencana program dan jadwal kegiatan pendampingan.",
      icon: FileText,
      href: "/pengawas/perencanaan/rencana-program/buat/dokumen", // Placeholder
      color: "slate",
      active: completedSteps.includes(4)
    }
  ];

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Buat Rencana Program
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Ikuti 5 langkah berikut untuk menyusun rencana program pendampingan yang komprehensif dan berdampak.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.active;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <div
              key={step.id}
              onClick={() => {
                if (isActive || isCompleted) router.push(step.href);
              }}
              className={cn(
                "group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
                isCompleted
                  ? "border-emerald-200 shadow-sm hover:shadow-md cursor-pointer ring-1 ring-emerald-50/50"
                  : isActive
                    ? "border-indigo-100 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer ring-1 ring-indigo-50"
                    : "border-slate-100 opacity-60 cursor-not-allowed grayscale"
              )}
            >
              {/* Active/Completed Indicator Strip */}
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1.5",
                isCompleted ? "bg-emerald-500" : isActive ? "bg-indigo-500" : "bg-slate-200"
              )} />

              <div className="p-6 sm:p-8 flex items-start gap-6">
                {/* Step Number & Icon */}
                <div className="shrink-0">
                  <div className={cn(
                    "relative z-10 flex items-center justify-center size-14 rounded-2xl shadow-sm transition-colors duration-300",
                    isCompleted ? "bg-emerald-50 text-emerald-600" : isActive ? "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    <Icon className="size-7" />
                    <div className={cn(
                      "absolute -top-2 -right-2 size-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white",
                      isCompleted ? "bg-emerald-600 text-white" : isActive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                    )}>
                      {isCompleted ? <CheckCircle2 className="size-3.5" /> : step.id}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={cn(
                      "text-xl font-bold transition-colors",
                      isCompleted ? "text-slate-900" : isActive ? "text-slate-900 group-hover:text-indigo-700" : "text-slate-500"
                    )}>
                      {step.title}
                    </h3>
                    {isCompleted && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                        Selesai
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow Action */}
                <div className={cn(
                  "self-center shrink-0 p-2 rounded-full transition-all duration-300",
                  isCompleted
                    ? "bg-emerald-50 text-emerald-600"
                    : isActive
                      ? "bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:translate-x-1"
                      : "invisible"
                )}>
                  {isCompleted ? <CheckCircle2 className="size-6" /> : <ChevronRight className="size-6" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
