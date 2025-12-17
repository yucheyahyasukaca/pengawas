"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Leaf, TrendingUp, Zap, Radio, BarChart3, LineChart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Matrix Data Logic
const REFLECTION_LEVELS = {
    BERKEMBANG: "Berkembang",
    BERDAYA: "Berdaya"
};

const CAPACITY_LEVELS = {
    RENDAH: "Rendah",
    SEDANG: "Sedang",
    TINGGI: "Tinggi"
};

const STRATEGIES = {

    PENYEMAI: { title: "Penyemai Perubahan", description: "Strategi difokuskan pada menumbuhkan kesadaran dan keyakinan akan pentingnya perubahan.", icon: Leaf, color: "rose", gradient: "from-rose-500 to-pink-600", bg: "bg-rose-50", border: "border-rose-200" },
    PENGUATAN: { title: "Penguatan Perubahan", description: "Strategi difokuskan pada penguatan kompetensi teknis dan manajerial dalam memimpin perubahan.", icon: TrendingUp, color: "amber", gradient: "from-amber-400 to-yellow-500", bg: "bg-amber-50", border: "border-amber-200" },
    PEMICU: { title: "Pemicu Perubahan", description: "Strategi difokuskan pada mendorong inisiatif perubahan yang lebih luas dan berdampak.", icon: Zap, color: "teal", gradient: "from-teal-400 to-emerald-500", bg: "bg-teal-50", border: "border-teal-200" },
    SEGERA: { title: "Perubahan Segera", description: "Fokus pada intervensi cepat untuk mengatasi hambatan mendasar dalam perubahan.", icon: Radio, color: "orange", gradient: "from-orange-400 to-amber-500", bg: "bg-orange-50", border: "border-orange-200" },
    BERANGSUR: { title: "Perubahan Berangsur", description: "Pendampingan dilakukan secara bertahap untuk memastikan keberlanjutan perubahan.", icon: BarChart3, color: "lime", gradient: "from-lime-400 to-green-500", bg: "bg-lime-50", border: "border-lime-200" },
    BERKELANJUTAN: { title: "Perubahan Berkelanjutan", description: "Fokus pada menjaga momentum dan memperluas dampak perubahan yang sudah terjadi.", icon: LineChart, color: "sky", gradient: "from-sky-400 to-blue-500", bg: "bg-sky-50", border: "border-sky-200" }
};

const getStrategy = (reflection: string, capacity: string) => {
    if (reflection === REFLECTION_LEVELS.BERKEMBANG) {
        if (capacity === CAPACITY_LEVELS.RENDAH) return STRATEGIES.PENYEMAI;
        if (capacity === CAPACITY_LEVELS.SEDANG) return STRATEGIES.PENGUATAN;
        return STRATEGIES.PEMICU;
    } else {
        if (capacity === CAPACITY_LEVELS.RENDAH) return STRATEGIES.SEGERA;
        if (capacity === CAPACITY_LEVELS.SEDANG) return STRATEGIES.BERANGSUR;
        return STRATEGIES.BERKELANJUTAN;
    }
};

// Helper to determine levels from answers
const calculateLevels = (answers: Record<string, string>) => {
    const rScores = [];
    if (answers["q1_1"]) rScores.push(["k1", "k2"].includes(answers["q1_1"]) ? 1 : 2);
    if (answers["q1_2"]) rScores.push(["k1", "k2"].includes(answers["q1_2"]) ? 1 : 2);

    const rAvg = rScores.length > 0 ? rScores.reduce((a, b) => a + b, 0) / rScores.length : 1;
    const reflectionLevel = rAvg >= 1.5 ? REFLECTION_LEVELS.BERDAYA : REFLECTION_LEVELS.BERKEMBANG;

    const cScores = [];
    const getCScore = (ans: string) => {
        if (["c1", "c2"].includes(ans)) return 1;
        if (["c3", "c4"].includes(ans)) return 2;
        if (["c5", "c6"].includes(ans)) return 3;
        return 1;
    };
    if (answers["q2_1"]) cScores.push(getCScore(answers["q2_1"]));
    if (answers["q2_2"]) cScores.push(getCScore(answers["q2_2"]));

    const cAvg = cScores.length > 0 ? cScores.reduce((a, b) => a + b, 0) / cScores.length : 1;
    let capacityLevel = CAPACITY_LEVELS.RENDAH;
    if (cAvg >= 1.5 && cAvg < 2.5) capacityLevel = CAPACITY_LEVELS.SEDANG;
    if (cAvg >= 2.5) capacityLevel = CAPACITY_LEVELS.TINGGI;

    return { reflectionLevel, capacityLevel };
};

export default function AnalisisPage() {
    const router = useRouter();
    const [result, setResult] = useState<{ reflection: string, capacity: string, strategy: any } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDraft = async () => {
            try {
                const response = await fetch("/api/pengawas/rencana-program/draft");
                if (response.ok) {
                    const { draft } = await response.json();
                    if (draft && draft.form_data && draft.form_data.selectedAnswers) {
                        const { reflectionLevel, capacityLevel } = calculateLevels(draft.form_data.selectedAnswers);
                        const strategy = getStrategy(reflectionLevel, capacityLevel);
                        setResult({ reflection: reflectionLevel, capacity: capacityLevel, strategy });
                    }
                }
            } catch (error) {
                console.error("Error fetching draft", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDraft();
    }, []);

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
                    <Button className="rounded-full px-6" onClick={() => router.push("/pengawas/perencanaan/rencana-program/buat/wawancara")}>
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
                <Button variant="ghost" className="rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 -ml-3" onClick={() => router.push("/pengawas/perencanaan/rencana-program/buat")}>
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
                                <Button onClick={() => router.push("/pengawas/perencanaan/rencana-program/buat")} size="lg" className={cn("rounded-2xl px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-white border-white/20 border-t bg-gradient-to-r", result.strategy.gradient)}>
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
