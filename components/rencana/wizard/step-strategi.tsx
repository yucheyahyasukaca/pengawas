"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, ArrowRight } from "lucide-react";
import { STRATEGIES, calculateLevels, getStrategy } from "@/lib/rencana-utils";

interface StepStrategiProps {
    baseUrl: string;
    mode: "create" | "edit";
    id?: string;
}

export function StepStrategi({ baseUrl, mode, id }: StepStrategiProps) {
    const router = useRouter();
    const [strategyName, setStrategyName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [draftData, setDraftData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = "/api/pengawas/rencana-program/draft";
                if (mode === "edit" && id) {
                    url = `/api/pengawas/rencana-program/${id}`;
                }

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    const record = mode === 'edit' ? data.rencanaProgram : data.draft;

                    setDraftData(record);
                    if (record && record.form_data) {
                        // Priority 1: Use saved strategy name if available
                        if (record.form_data.strategy) {
                            setStrategyName(record.form_data.strategy);
                        }
                        // Priority 2: Derive from answers
                        else if (record.form_data.selectedAnswers) {
                            const { reflectionLevel, capacityLevel } = calculateLevels(record.form_data.selectedAnswers);
                            const strat = getStrategy(reflectionLevel, capacityLevel);
                            setStrategyName(strat.title);
                        }
                        // Priority 3: Fallback (should not happen if flow followed)
                        else {
                            setStrategyName("Penyemai Perubahan");
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [mode, id]);

    const handleNext = async () => {
        try {
            const currentFormData = draftData?.form_data || {};

            // Recover schools from session if missing (mostly for create mode fallback)
            let schoolsToSave = draftData?.sekolah_ids;

            // Normalize sekolah_ids
            if (typeof schoolsToSave === "string") {
                try { schoolsToSave = JSON.parse(schoolsToSave); } catch (e) { schoolsToSave = []; }
            }
            if (!Array.isArray(schoolsToSave)) schoolsToSave = [];

            if (mode === 'create' && schoolsToSave.length === 0 && typeof window !== 'undefined') {
                const stored = sessionStorage.getItem("rencana_program_selected_sekolah");
                if (stored) {
                    try { schoolsToSave = JSON.parse(stored); } catch (e) { }
                }
            }

            const payload = {
                id: draftData?.id,
                formData: {
                    ...currentFormData,
                    step: 3 // Mark step 3 as done
                },
                sekolah_ids: schoolsToSave
            };

            let url = "/api/pengawas/rencana-program/draft";
            if (mode === "edit" && id) {
                url = `/api/pengawas/rencana-program/${id}`;
            }

            await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            router.push(`${baseUrl}/metode`);

        } catch (error) {
            console.error("Error saving Step 3", error);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl py-20 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Default strategy if none found
    const currentStrategyName = strategyName || "Penyemai Perubahan";

    // Find detail in STRATEGIES (values are objects)
    const strategyEntry = Object.values(STRATEGIES).find(s => s.title === currentStrategyName) || STRATEGIES.PENYEMAI;

    return (
        <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 space-y-10">
            <div className="flex items-center gap-4">
                <Button variant="outline" className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-100 shadow-sm -ml-3 font-medium" onClick={() => router.push(baseUrl)}>
                    <ArrowLeft className="size-5 mr-2" /> Kembali
                </Button>
                <div className="h-6 w-px bg-slate-300" />
                <h1 className="text-xl font-bold text-slate-900">Menentukan Strategi Pendampingan</h1>
            </div>

            {/* Strategy Details Card */}
            <div className="bg-white border border-indigo-100 rounded-3xl shadow-lg shadow-indigo-50/50 overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                    <div>
                        <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wider mb-1">Strategi Pendampingan Terpilih</p>
                        <h2 className="text-2xl font-bold">{strategyEntry.title}</h2>
                    </div>
                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
                        <Target className="size-6 text-white" />
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Deskripsi</label>
                        <p className="text-slate-700 font-medium">{strategyEntry.description}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Tujuan</label>
                        <p className="text-slate-700 font-medium">{strategyEntry.kebutuhan}</p>
                        {/* Note: Mapping 'kebutuhan' to 'Tujuan' or similar based on context, previously it was purpose */}
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Sasaran</label>
                        <p className="text-slate-700 font-medium">{strategyEntry.sasaran}</p>
                    </div>
                    {/* STRATEGIES constant in lib doesn't have Process/Scope/Output fields that were in the page file constants. 
                        I will stick to available fields or hardcode defaults if strictly needed, 
                        but effectively the user sees what's in STRATEGIES. 
                        Let's use what we have in STRATEGIES. */}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleNext} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 shadow-lg shadow-indigo-200">
                    Lanjut ke Metode Pendampingan <ArrowRight className="ml-2 size-4" />
                </Button>
            </div>
        </div>
    );
}
