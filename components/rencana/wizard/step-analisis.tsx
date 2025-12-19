"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateLevels, getStrategy } from "@/lib/rencana-utils";

interface StepAnalisisProps {
    baseUrl: string;
    mode: "create" | "edit";
    id?: string;
}

export function StepAnalisis({ baseUrl, mode, id }: StepAnalisisProps) {
    const router = useRouter();
    const [result, setResult] = useState<{ reflection: string, capacity: string, strategy: any } | null>(null);
    const [loading, setLoading] = useState(true);

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

                    if (record && record.form_data && record.form_data.selectedAnswers) {
                        const { reflectionLevel, capacityLevel } = calculateLevels(record.form_data.selectedAnswers);
                        const strategy = getStrategy(reflectionLevel, capacityLevel);
                        setResult({ reflection: reflectionLevel, capacity: capacityLevel, strategy });
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

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl py-20 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent shadow-lg"></div>
                <p className="text-slate-500 font-medium animate-pulse">Memuat hasil analisis...</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="container mx-auto max-w-4xl py-20 text-center text-slate-500">
                <div className="bg-slate-50 rounded-3xl p-10 border border-slate-200 inline-block">
                    <p className="mb-4 text-lg font-medium">Belum ada data wawancara.</p>
                    <Button className="rounded-full px-6" onClick={() => router.push(`${baseUrl}/wawancara`)}>
                        Ke Tahap Wawancara
                    </Button>
                </div>
            </div>
        );
    }

    const StrategyIcon = result.strategy.icon;

    return (
        <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 space-y-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 -ml-3" onClick={() => router.push(baseUrl)}>
                    <ArrowLeft className="size-5 mr-2" /> Kembali
                </Button>
            </div>

            <div className="space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Analisis Komitmen Perubahan
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Berikut adalah pemetaan posisi Satuan Pendidikan Anda berdasarkan hasil wawancara.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Input Factors (Left Side - 4 Cols) */}
                    <Card className="lg:col-span-4 p-0 border-0 shadow-lg bg-white overflow-hidden rounded-3xl flex flex-col">
                        <div className="bg-slate-900 p-6 sm:p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Faktor Analisis</h3>
                                <h2 className="text-2xl font-bold">Input Data</h2>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-6 flex-1 bg-slate-50/50">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kesadaran Refleksi</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                                    <span className="font-bold text-slate-800 text-lg">{result.reflection}</span>
                                    {result.reflection === "Berdaya" ? (
                                        <CheckCircle2 className="text-emerald-500 size-6" />
                                    ) : (
                                        <div className="h-2 w-2 rounded-full bg-amber-400 ring-4 ring-amber-100" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kapasitas Memimpin</label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                                    <span className="font-bold text-slate-800 text-lg">{result.capacity}</span>
                                    <div className={cn("h-1.5 w-16 rounded-full overflow-hidden bg-slate-100")}>
                                        <div className={cn("h-full",
                                            result.capacity === "Tinggi" ? "bg-emerald-500 w-full" :
                                                result.capacity === "Sedang" ? "bg-amber-500 w-2/3" :
                                                    "bg-rose-500 w-1/3"
                                        )} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Result Card (Right Side - 8 Cols) */}
                    <Card className={cn("lg:col-span-8 border-0 shadow-xl rounded-3xl overflow-hidden relative group", result.strategy.bg)}>
                        {/* Decorative Background Gradients */}
                        <div className={cn("absolute top-0 right-0 w-96 h-96 opacity-20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3",
                            result.strategy.color === "rose" ? "bg-rose-400" :
                                result.strategy.color === "emerald" ? "bg-emerald-400" :
                                    "bg-indigo-400"
                        )}></div>

                        <div className="relative z-10 p-8 sm:p-12 flex flex-col h-full justify-center items-center text-center space-y-6">
                            <div className={cn("size-20 rounded-3xl shadow-lg flex items-center justify-center transform transition-transform group-hover:scale-110 duration-500 bg-gradient-to-br text-white", result.strategy.gradient)}>
                                <StrategyIcon className="size-10" />
                            </div>

                            <div className="space-y-2 max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-white/50 text-xs font-bold uppercase tracking-wider text-slate-600 shadow-sm">
                                    <Sparkles className="size-3 text-amber-500" /> Rekomendasi Strategi
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                    {result.strategy.title}
                                </h1>
                            </div>

                            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium max-w-2xl text-balance">
                                {result.strategy.description}
                            </p>

                            <div className="pt-8">
                                <Button onClick={() => router.push(`${baseUrl}/strategi`)} size="lg" className={cn("rounded-2xl px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-white border-white/20 border-t bg-gradient-to-r", result.strategy.gradient)}>
                                    Lanjut ke Tahap Berikutnya <ArrowRight className="ml-3 size-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
