"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Target, UserCheck, Users, Search, BookOpen, CheckCircle2, Sparkles, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// --- constants from Image 2 (Method Options) ---
const METHOD_OPTIONS = [
    {
        id: "training",
        title: "Training",
        icon: BookOpen,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        gradient: "from-blue-500 to-cyan-500",
        tujuan: "Mengajarkan suatu strategi atau teknik kepada seseorang yang relevan dengan pekerjaan.",
        lingkup: "Komunitas Belajar",
        luaran: [
            "Praktik penerapan hasil pelatihan.",
            "Cenderung lebih standar mengacu pada kurikulum atau tujuan pelatihan."
        ],
        dibutuhkan_oleh: "Anggota komunitas belajar yang akan menangani posisi atau pekerjaan baru atau akan mempelajari suatu strategi atau teknik baru.",
        lebih_tepat_bila: [
            "Jumlah orang yang banyak dan waktu terbatas.",
            "Menyediakan contoh yang bisa dipelajari dan diadopsi."
        ]
    },
    {
        id: "mentoring",
        title: "Mentoring",
        icon: UserCheck,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-100",
        gradient: "from-indigo-500 to-purple-500",
        tujuan: "Memberikan saran dan contoh untuk dipelajari oleh seseorang untuk meningkatkan kinerjanya",
        lingkup: "Individu atau kelompok",
        luaran: [
            "Praktik penerapan hasil mentoring.",
            "Cenderung lebih mengikuti kekayaan pengalaman mentor."
        ],
        dibutuhkan_oleh: "Orang yang akan menangani posisi atau pekerjaan baru atau akan mempelajari suatu strategi atau teknik baru.",
        lebih_tepat_bila: [
            "Waktu relatif terbatas untuk pengembangan.",
            "Menyediakan contoh yang bisa dipelajari dan diadopsi."
        ]
    },
    {
        id: "coaching",
        title: "Coaching",
        icon: Target,
        color: "text-pink-600",
        bg: "bg-pink-50",
        border: "border-pink-100",
        gradient: "from-pink-500 to-rose-500",
        tujuan: "Memberdayakan seseorang untuk meningkatkan kinerja dengan mengungkap potensi dirinya",
        lingkup: "Individu atau kelompok.",
        luaran: [
            "Praktik atau perspektif baru hasil kesadaran atau inspirasi yang didapatkan dari coaching.",
            "Cenderung lebih kontekstualisasi berdasarkan kapasitas peserta."
        ],
        dibutuhkan_oleh: "Orang yang ingin meningkatkan kinerjanya berdasarkan hasil refleksi pengalamannya yang relevan.",
        lebih_tepat_bila: [
            "Ada potensi atau praktik baik yang bisa dikembangkan seseorang.",
            "Bertujuan membuat seseorang menjadi berdaya melakukan perubahan."
        ]
    },
    {
        id: "facilitating",
        title: "Facilitating",
        icon: Users,
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-100",
        gradient: "from-orange-500 to-amber-500",
        tujuan: "Membantu sekelompok orang dalam mengambil keputusan kelompok atau organisasi",
        lingkup: "Kelompok atau organisasi.",
        luaran: [
            "Keputusan tentang strategi, kebijakan, atau program hasil proses fasilitasi kelompok.",
            "Cenderung lebih kontekstualisasi sesuai potensi kelompok atau organisasi dan kondisi lingkungan."
        ],
        dibutuhkan_oleh: "Kelompok orang yang ingin mengambil keputusan yang berdampak besar atau pengembangan yang melibatkan sejumlah aspek/pihak.",
        lebih_tepat_bila: [
            "Bertujuan memberdayakan kelompok atau organisasi melakukan perubahan.",
            "Butuh inovasi atau diferensiasi praktik sesuai konteks kelompok atau organisasi"
        ]
    },
    {
        id: "consulting",
        title: "Consulting",
        icon: Search,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        gradient: "from-emerald-500 to-teal-500",
        tujuan: "Memberikan rekomendasi berdasarkan hasil analisis untuk pengembangan organisasi",
        lingkup: "Organisasi",
        luaran: [
            "Keputusan tentang strategi, kebijakan, atau program hasil proses konsultasi organisasi.",
            "Cenderung lebih kontekstualisasi sesuai potensi organisasi dan kondisi lingkungan."
        ],
        dibutuhkan_oleh: [
            "Organisasi yang ingin melakukan perubahan atau pengembangan dalam lingkup organisasi.",
            "Sangat dibutuhkan terutama oleh organisasi yang terpuruk."
        ],
        lebih_tepat_bila: [
            "Bertujuan membantu organisasi bangkit dari kondisi terpuruk atau melakukan perubahan besar.",
            "Mengombinasikan dengan pilihan metode yang lain"
        ]
    }
];

export default function MetodePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [draftData, setDraftData] = useState<any>(null); // Store full draft

    useEffect(() => {
        const fetchDraft = async () => {
            try {
                const response = await fetch("/api/pengawas/rencana-program/draft");
                if (response.ok) {
                    const { draft } = await response.json();
                    setDraftData(draft); // Save full draft for update
                    if (draft && draft.form_data) {
                        // Handle backward compatibility or new array format
                        if (Array.isArray(draft.form_data.selectedMethods)) {
                            setSelectedMethods(draft.form_data.selectedMethods);
                        } else if (draft.form_data.selectedMethod) {
                            setSelectedMethods([draft.form_data.selectedMethod]);
                        }
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
            // Prepare payload
            const currentFormData = draftData?.form_data || {};
            // Recover schools from session if missing in draft
            let schoolsToSave = draftData?.sekolah_ids;

            // Normalize sekolah_ids if it comes as string
            if (typeof schoolsToSave === "string") {
                try {
                    schoolsToSave = JSON.parse(schoolsToSave);
                } catch (e) {
                    schoolsToSave = [];
                }
            }
            if (!Array.isArray(schoolsToSave)) schoolsToSave = [];

            if (schoolsToSave.length === 0 && typeof window !== 'undefined') {
                const stored = sessionStorage.getItem("rencana_program_selected_sekolah");
                if (stored) {
                    try {
                        schoolsToSave = JSON.parse(stored);
                    } catch (e) {
                        console.error("Failed to parse stored schools", e);
                    }
                }
            }

            const payload = {
                id: draftData?.id, // Pass ID if it exists
                formData: {
                    ...currentFormData,
                    selectedMethods, // Save as array
                    step: 4 // Mark step
                },
                sekolah_ids: schoolsToSave
            };

            const response = await fetch("/api/pengawas/rencana-program/draft", {
                method: "PUT", // changed from POST
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast({
                    title: "Berhasil!",
                    description: "Metode pendampingan telah tersimpan.",
                    className: "bg-emerald-50 border-emerald-200 text-emerald-800"
                });

                // Delay slightly to show success state
                setTimeout(() => {
                    router.push("/pengawas/perencanaan/rencana-program/buat");
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
                        onClick={() => router.push("/pengawas/perencanaan/rencana-program/buat/strategi")}
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
                            return (
                                <button
                                    key={method.id}
                                    onClick={() => toggleMethod(method.id)}
                                    className={cn(
                                        "group relative w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 ease-out overflow-hidden hover:scale-[1.02]",
                                        isSelected
                                            ? `border-transparent ring-2 ring-offset-2 ring-${method.color.split('-')[1]}-400 bg-white shadow-xl`
                                            : "border-white bg-white shadow-sm hover:border-slate-200 hover:shadow-md"
                                    )}
                                >
                                    {isSelected && (
                                        <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-r", method.gradient)}></div>
                                    )}
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={cn(
                                            "p-3 rounded-xl transition-colors duration-300",
                                            isSelected ? `bg-gradient-to-br ${method.gradient} text-white shadow-lg` : `${method.bg} ${method.color}`
                                        )}>
                                            <Icon className="size-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className={cn("block font-bold text-base transition-colors truncate", isSelected ? "text-slate-900" : "text-slate-700")}>
                                                {method.title}
                                            </span>
                                            <span className={cn("text-xs transition-colors truncate block", isSelected ? "text-slate-600" : "text-slate-400 group-hover:text-slate-500")}>
                                                {method.lingkup}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <div className="ml-auto shrink-0 pl-2">
                                                <CheckCircle2 className={cn("size-6", method.color)} />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Main Content: Info Card */}
                    <div className="w-full lg:w-2/3">
                        {methodDetail ? (
                            <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-500">
                                {/* Beautiful Gradient Blobs */}
                                <div className={cn("absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl opacity-20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none", methodDetail.gradient)}></div>
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-100 to-white opacity-50 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

                                <div className="relative z-10 p-8 sm:p-10 space-y-8">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-white shadow-sm border border-slate-100", methodDetail.color)}>
                                                <Sparkles className="size-3" />
                                                Detail Metode
                                            </div>
                                            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                                {methodDetail.title}
                                            </h2>
                                        </div>
                                        <div className={cn("hidden sm:flex p-4 rounded-2xl bg-gradient-to-br shadow-lg text-white transform rotate-3", methodDetail.gradient)}>
                                            <methodDetail.icon className="size-10" />
                                        </div>
                                    </div>

                                    {/* Content Grid */}
                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                                <Target className="size-4" /> Tujuan Utama
                                            </label>
                                            <p className="text-xl font-medium leading-relaxed text-slate-800">
                                                {methodDetail.tujuan}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
                                                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                                    <Users className="size-4" /> Sasaran
                                                </label>
                                                {Array.isArray(methodDetail.dibutuhkan_oleh) ? (
                                                    <ul className="space-y-2">
                                                        {methodDetail.dibutuhkan_oleh.map((item, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                                                <span className={cn("mt-1.5 size-1.5 rounded-full shrink-0", methodDetail.bg.replace('bg-', 'bg-text-').replace('50', '400'))}></span>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : <p className="text-sm text-slate-600 font-medium">{methodDetail.dibutuhkan_oleh}</p>}
                                            </div>

                                            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
                                                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                                    <Star className="size-4" /> Kriteria Tepat
                                                </label>
                                                <ul className="space-y-2">
                                                    {methodDetail.lebih_tepat_bila.map((item, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                                            <CheckCircle2 className={cn("size-4 shrink-0 mt-0.5", methodDetail.color)} />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-white/40 rounded-2xl p-6 border border-white/50 border-dashed">
                                            <div className="flex items-center gap-2 mb-2">
                                                <BookOpen className="size-4 text-slate-400" />
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Luaran yang Diharapkan</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {methodDetail.luaran.map((item, idx) => (
                                                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                                                        {item}
                                                    </span>
                                                ))}
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
                                                methodDetail.gradient
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
