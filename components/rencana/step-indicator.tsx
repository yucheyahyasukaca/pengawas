"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
    currentStep: number;
    onStepClick: (step: number) => void;
    completedSteps: number[];
}

const steps = [
    {
        id: 1,
        title: "Melakukan wawancara untuk memetakan komitmen",
    },
    {
        id: 2,
        title: "Analisis komitmen perubahan",
    },
    {
        id: 3,
        title: "Menentukan Strategi Pendampingan",
    },
    {
        id: 4,
        title: "Menentukan Metode Pendampingan",
    },
    {
        id: 5,
        title: "Merancang Lembar Perencanaan Pendampingan",
    },
];

export function StepIndicator({ currentStep, onStepClick, completedSteps }: StepIndicatorProps) {
    return (
        <div className="w-full max-w-6xl mx-auto mb-10 px-4">
            <div className="flex flex-wrap justify-center gap-6">
                {steps.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = completedSteps.includes(step.id);

                    return (
                        <div
                            key={step.id}
                            onClick={() => onStepClick(step.id)}
                            className={cn(
                                "relative flex flex-col items-center justify-center p-6 min-h-[140px] text-center cursor-pointer transition-all duration-300 rounded-sm group w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(30%-1.5rem)]",
                                // Styles based on state
                                isCompleted
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 border-2 border-emerald-500 transform scale-105"
                                    : isActive
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 border-2 border-indigo-600 transform scale-105"
                                        : "bg-white text-slate-700 border-2 border-dashed border-slate-300 hover:border-emerald-300 hover:bg-emerald-50/50"
                            )}
                        >
                            {/* Number Badge */}
                            <div
                                className={cn(
                                    "absolute -top-4 size-10 rounded-full flex items-center justify-center text-lg font-bold border-4 transition-all z-10",
                                    isCompleted
                                        ? "bg-white text-emerald-600 border-emerald-500 ring-2 ring-white"
                                        : isActive
                                            ? "bg-white text-indigo-600 border-indigo-600 ring-2 ring-indigo-200"
                                            : "bg-slate-900 text-white border-white ring-2 ring-transparent group-hover:scale-110"
                                )}
                            >
                                {isCompleted && !isActive ? <Check className="size-5" /> : step.id}
                            </div>

                            {/* Title */}
                            <h3 className={cn(
                                "text-lg font-medium leading-tight select-none mt-2",
                                isActive || isCompleted ? "text-white" : "text-slate-700"
                            )}>
                                {step.title}
                            </h3>
                        </div>
                    );
                })}
            </div>

            {/* Mobile view text */}
            <div className="md:hidden flex justify-center mt-4 text-sm font-medium text-slate-600">
                Langkah {currentStep} dari {steps.length}
            </div>
        </div>
    );
}
