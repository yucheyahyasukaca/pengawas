"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Target, UserCheck, Users, Search, BookOpen, CheckCircle2, Sparkles, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { METHOD_OPTIONS } from "@/lib/rencana-utils";

interface StepMetodeProps {
    baseUrl: string;
    mode: "create" | "edit";
    id?: string;
}

export function StepMetode({ baseUrl, mode, id }: StepMetodeProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [draftData, setDraftData] = useState<any>(null); // Store full draft

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
                        if (Array.isArray(record.form_data.selectedMethods)) {
                            setSelectedMethods(record.form_data.selectedMethods);
                        } else if (record.form_data.selectedMethod) {
                            setSelectedMethods([record.form_data.selectedMethod]);
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

    const toggleMethod = (id: string) => {
        setSelectedMethods(prev =>
            prev.includes(id)
                ? prev.filter(m => m !== id)
                : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (selectedMethods.length === 0) return;
        setIsSaving(true);
        try {
            const currentFormData = draftData?.form_data || {};
            // Recover schools from session if missing in draft (create mode fallback)
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
                    selectedMethods, // Save as array
                    step: 4 // Mark step
                },
                sekolah_ids: schoolsToSave
            };

            let url = "/api/pengawas/rencana-program/draft";
            if (mode === "edit" && id) {
                url = `/api/pengawas/rencana-program/${id}`;
            }

            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // If create mode, the status might still be "Draft", so we just proceed.
                toast({
                    title: "Berhasil!",
                    description: "Metode pendampingan telah tersimpan.",
                    className: "bg-emerald-50 border-emerald-200 text-emerald-800"
                });

                // Delay slightly
                setTimeout(() => {
                    router.push(`${baseUrl}/dokumen`);
                }, 800);
            } else {
                throw new Error("Gagal menyimpan");
            }
        } catch (error) {
            console.error("Error saving method", error);
            toast({
                title: "Gagal Menyimpan",
                description: "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
                variant: "error"
            });
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl py-20 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Use the last selected method for detail view, or null
    const lastSelectedId = selectedMethods.length > 0 ? selectedMethods[selectedMethods.length - 1] : null;
    const methodDetail = lastSelectedId ? METHOD_OPTIONS.find(m => m.id === lastSelectedId) : null;

    // Supplement missing fields from METHOD_OPTIONS imported from lib with dummy styling if missing, 
    // or just assume they are part of the UI data structure.
    // The lib/rencana-utils.ts version of METHOD_OPTIONS seems to have FEWER fields than the page version.
    // I should merge or adapt.
    // Let's redefine the extended options locally for UI purposes if the lib one is minimal,
    // OR ideally update lib. But for now to avoid breaking other things, I will extend locally using the ID.

    const EXTENDED_OPTIONS = [
        {
            id: "training",
            bg: "bg-blue-50", color: "text-blue-600", gradient: "from-blue-500 to-cyan-500",
            lingkup: "Komunitas Belajar",
            tujuan: "Mengajarkan suatu strategi atau teknik kepada seseorang yang relevan dengan pekerjaan.",
            dibutuhkan_oleh: "Anggota komunitas belajar yang akan menangani posisi atau pekerjaan baru.",
            lebih_tepat_bila: ["Jumlah orang banyak.", "Waktu terbatas."]
        },
        {
            id: "mentoring", bg: "bg-indigo-50", color: "text-indigo-600", gradient: "from-indigo-500 to-purple-500",
            lingkup: "Individu/Kelompok",
            tujuan: "Memberikan saran dan contoh untuk dipelajari.",
            dibutuhkan_oleh: "Orang yang akan mempelajari strategi baru.",
            lebih_tepat_bila: ["Waktu relatif terbatas.", "Menyediakan contoh."]
        },
        {
            id: "coaching", bg: "bg-pink-50", color: "text-pink-600", gradient: "from-pink-500 to-rose-500",
            lingkup: "Individu",
            tujuan: "Memberdayakan seseorang untuk meningkatkan kinerja.",
            dibutuhkan_oleh: "Orang yang ingin meningkatkan kinerja.",
            lebih_tepat_bila: ["Ada potensi yang bisa dikembangkan.", "Ingin berdaya."]
        },
        {
            id: "facilitating", bg: "bg-orange-50", color: "text-orange-600", gradient: "from-orange-500 to-amber-500",
            lingkup: "Kelompok",
            tujuan: "Membantu kelompok mengambil keputusan.",
            dibutuhkan_oleh: "Kelompok yang ingin mengambil keputusan berdampak.",
            lebih_tepat_bila: ["Memberdayakan kelompok.", "Butuh inovasi."]
        },
        {
            id: "consulting", bg: "bg-emerald-50", color: "text-emerald-600", gradient: "from-emerald-500 to-teal-500",
            lingkup: "Organisasi",
            tujuan: "Memberikan rekomendasi pengembangan.",
            dibutuhkan_oleh: ["Organisasi yang ingin berubah.", "Organisasi terpuruk."],
            lebih_tepat_bila: ["Membantu bangkit.", "Perubahan besar."]
        }
    ];

    const extendedDetail = methodDetail ? { ...methodDetail, ...EXTENDED_OPTIONS.find(e => e.id === methodDetail.id) } : null;

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="container mx-auto max-w-6xl py-8 px-4 sm:px-6 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
                    <div className="space-y-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-indigo-600 font-semibold uppercase tracking-wider mb-2">
                            <div className="h-px w-8 bg-indigo-300"></div>
                            Langkah 4
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Metode Pendampingan
                        </h1>
                        <p className="text-lg text-slate-500 max-w-xl">
                            Pilih satu atau lebih pendekatan yang paling efektif.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-full border-slate-300 text-slate-600 hover:bg-white hover:text-indigo-600 transition-all hover:shadow-md"
                        onClick={() => router.push(`${baseUrl}/strategi`)}
                    >
                        <ArrowLeft className="size-4 mr-2" /> Kembali
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar: Selection Grid */}
                    <div className="w-full lg:w-1/3 grid grid-cols-2 lg:grid-cols-1 gap-4">
                        {METHOD_OPTIONS.map((method) => {
                            const Icon = method.icon;
                            const isSelected = selectedMethods.includes(method.id);
                            // Get visual props from extended
                            const vis = EXTENDED_OPTIONS.find(e => e.id === method.id) || { bg: "bg-slate-50", color: "text-slate-600", gradient: "" };

                            return (
                                <button
                                    key={method.id}
                                    onClick={() => toggleMethod(method.id)}
                                    className={cn(
                                        "group relative w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 ease-out overflow-hidden hover:scale-[1.02]",
                                        isSelected
                                            ? `border-transparent ring-2 ring-offset-2 ring-${vis.color.split('-')[1]}-400 bg-white shadow-xl`
                                            : "border-white bg-white shadow-sm hover:border-slate-200 hover:shadow-md"
                                    )}
                                >
                                    {isSelected && (
                                        <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-r", vis.gradient)}></div>
                                    )}
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={cn(
                                            "p-3 rounded-xl transition-colors duration-300",
                                            isSelected ? `bg-gradient-to-br ${vis.gradient} text-white shadow-lg` : `${vis.bg} ${vis.color}`
                                        )}>
                                            <Icon className="size-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className={cn("block font-bold text-base transition-colors truncate", isSelected ? "text-slate-900" : "text-slate-700")}>
                                                {method.title}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <div className="ml-auto shrink-0 pl-2">
                                                <CheckCircle2 className={cn("size-6", vis.color)} />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Main Content: Info Card */}
                    <div className="w-full lg:w-2/3">
                        {extendedDetail ? (
                            <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-500">
                                {/* Decorative Gradient */}
                                <div className={cn("absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl opacity-20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none", extendedDetail.gradient)}></div>

                                <div className="relative z-10 p-8 sm:p-10 space-y-8">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-white shadow-sm border border-slate-100", extendedDetail.color)}>
                                                <Sparkles className="size-3" />
                                                Detail Metode
                                            </div>
                                            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                                {extendedDetail.title}
                                            </h2>
                                        </div>
                                        <div className={cn("hidden sm:flex p-4 rounded-2xl bg-gradient-to-br shadow-lg text-white transform rotate-3", extendedDetail.gradient)}>
                                            <extendedDetail.icon className="size-10" />
                                        </div>
                                    </div>

                                    {/* Content Grid */}
                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-sm">
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                                <Target className="size-4" /> Tujuan Utama
                                            </label>
                                            <p className="text-xl font-medium leading-relaxed text-slate-800">
                                                {extendedDetail.tujuan}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
                                                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                                    <Users className="size-4" /> Sasaran
                                                </label>
                                                <p className="text-sm text-slate-600 font-medium">{String(extendedDetail.dibutuhkan_oleh)}</p>
                                            </div>

                                            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
                                                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                                    <Star className="size-4" /> Kriteria Tepat
                                                </label>
                                                <ul className="space-y-2">
                                                    {Array.isArray(extendedDetail.lebih_tepat_bila) && extendedDetail.lebih_tepat_bila.map((item: string, idx: number) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                                            <CheckCircle2 className={cn("size-4 shrink-0 mt-0.5", extendedDetail.color)} />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="pt-8 flex justify-end border-t border-slate-100">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            size="lg"
                                            className={cn(
                                                "rounded-xl px-10 py-6 text-lg font-semibold shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl text-white bg-gradient-to-r disabled:opacity-70 disabled:cursor-not-allowed",
                                                extendedDetail.gradient
                                            )}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="mr-2 size-5 animate-spin" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    Simpan Pilihan <ArrowRight className="ml-2 size-5" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50">
                                <div className="p-6 bg-white rounded-full shadow-sm mb-6">
                                    <Sparkles className="size-12 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada metode dipilih</h3>
                                <p className="text-slate-500 max-w-sm">
                                    Silakan pilih salah satu metode pendampingan di sebelah kiri untuk melihat detailnya.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
