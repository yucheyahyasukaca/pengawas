"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateLevels, getStrategy, METHOD_OPTIONS, STRATEGIES } from "@/lib/rencana-utils";
import { cn } from "@/lib/utils";

interface RencanaRecap {
    id: string;
    periode: string;
    status: string;
    sekolah: {
        id: string;
        nama: string;
        npsn: string;
    }[];
    form_data: any;
    // Computed fields
    strategy?: any;
    priority?: string;
    methods?: any[];
    outputs?: string[];
}

export default function RencanaProgramRecapPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<RencanaRecap[]>([]);
    const [periode, setPeriode] = useState("");

    useEffect(() => {
        const p = params?.periode;
        if (!p) return;

        const fetchRecap = async () => {
            try {
                const res = await fetch(`/api/pengawas/rencana-program/rekap/${p}`);
                if (!res.ok) throw new Error("Gagal memuat data");

                const result = await res.json();
                setPeriode(decodeURIComponent(result.periode || String(p)));

                // Process data
                const processed = (result.documents || []).map((doc: any) => {
                    let strategy = null;
                    let priority = "Prioritas Akhir"; // Default

                    // 1. Determine Strategy & Priority
                    if (doc.form_data?.selectedAnswers) {
                        const { reflectionLevel, capacityLevel } = calculateLevels(doc.form_data.selectedAnswers);
                        strategy = getStrategy(reflectionLevel, capacityLevel);
                        if (strategy) {
                            priority = strategy.priority;
                        }
                    }

                    // 2. Get Methods & Outputs
                    let methods = [];
                    if (doc.form_data?.selectedMethods && Array.isArray(doc.form_data.selectedMethods)) {
                        methods = doc.form_data.selectedMethods
                            .map((mid: string) => METHOD_OPTIONS.find(m => m.id === mid))
                            .filter(Boolean);
                    } else if (doc.form_data?.selectedMethod) {
                        const m = METHOD_OPTIONS.find(m => m.id === doc.form_data.selectedMethod);
                        if (m) methods.push(m);
                    }

                    const outputs = methods.map((m: any) => m.luaran);

                    return {
                        ...doc,
                        strategy,
                        priority,
                        methods,
                        outputs
                    };
                });

                // Sort by Priority: Utama -> Menengah -> Akhir
                const priorityOrder: Record<string, number> = {
                    "Prioritas Utama": 1,
                    "Prioritas Menengah": 2,
                    "Prioritas Akhir": 3
                };

                processed.sort((a: any, b: any) => {
                    const pA = priorityOrder[a.priority] || 4;
                    const pB = priorityOrder[b.priority] || 4;
                    return pA - pB;
                });

                setData(processed);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecap();
    }, [params?.periode]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="size-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 print:p-0 print:bg-white">
            {/* Header Controls */}
            <div className="max-w-[1400px] mx-auto mb-6 flex justify-between items-center print:hidden">
                <Button variant="outline" className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-100 shadow-sm font-medium" onClick={() => router.back()}>
                    <ArrowLeft className="size-4 mr-2" /> Kembali
                </Button>
                <Button onClick={handlePrint} className="bg-indigo-600 text-white hover:bg-indigo-700">
                    <Printer className="size-4 mr-2" /> Cetak PDF
                </Button>
            </div>

            {/* Document Content */}
            <div className="max-w-[1400px] mx-auto bg-white p-8 shadow-sm print:shadow-none print:p-0">
                {/* Title / Header */}
                <div className="mb-0">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#005a8f] text-white print:bg-[#005a8f] print:text-white">
                                <th colSpan={6} className="py-4 px-4 text-center font-bold text-lg border border-[#005a8f]">
                                    RENCANA PENDAMPINGAN SATUAN PENDIDIKAN
                                </th>
                            </tr>
                            <tr className="bg-[#004872] text-white print:bg-[#004872] print:text-white">
                                <th className="py-3 px-2 text-center text-sm font-bold border border-white w-[120px]">
                                    PRIORITAS
                                </th>
                                <th className="py-3 px-2 text-center text-sm font-bold border border-white w-[200px]">
                                    NAMA SATUAN PENDIDIKAN
                                </th>
                                <th className="py-3 px-2 text-center text-sm font-bold border border-white w-[150px]">
                                    PILIHAN STRATEGI
                                </th>
                                <th className="py-3 px-2 text-center text-sm font-bold border border-white w-[150px]">
                                    PILIHAN METODE
                                </th>
                                <th className="py-3 px-2 text-center text-sm font-bold border border-white">
                                    DESKRIPSI / PERTIMBANGAN KEBUTUHAN
                                </th>
                                <th className="py-3 px-2 text-center text-sm font-bold border border-white w-[250px]">
                                    TARGET
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => {
                                // Determine row color based on priority
                                // Determine row color based on priority
                                let bgClass = "bg-white";
                                let textClass = "text-slate-900";
                                let contentBgClass = "bg-white";

                                if (item.priority === "Prioritas Utama") {
                                    bgClass = "bg-[#ff6b6b]"; // Red/Pinkish
                                    textClass = "text-white font-bold";
                                    contentBgClass = "bg-[#fff1f2]"; // Light Pink
                                } else if (item.priority === "Prioritas Menengah") {
                                    bgClass = "bg-[#fcd34d]"; // Yellow/Amber
                                    textClass = "text-slate-900 font-bold";
                                    contentBgClass = "bg-[#fffbeb]"; // Light Yellow
                                } else if (item.priority === "Prioritas Akhir") {
                                    bgClass = "bg-[#10b981]"; // Green/Emerald
                                    textClass = "text-white font-bold";
                                    contentBgClass = "bg-[#ecfdf5]"; // Light Green
                                }

                                return (
                                    <tr key={item.id} className="text-sm">
                                        {/* Prioritas Cell */}
                                        <td className={cn("p-4 text-center border border-slate-200 align-top", bgClass, textClass)}>
                                            {item.priority?.toUpperCase()}
                                        </td>

                                        {/* Sekolah Cell */}
                                        <td className={cn("p-4 border border-slate-200 align-top font-medium text-slate-900", contentBgClass)}>
                                            {item.sekolah.length > 0 ? (
                                                <ul className="list-none space-y-1">
                                                    {item.sekolah.map(s => (
                                                        <li key={s.id}>{s.nama}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-slate-500 italic">Belum ada sekolah</span>
                                            )}
                                        </td>

                                        {/* Strategi Cell */}
                                        <td className={cn("p-4 text-center border border-slate-200 align-top font-medium text-slate-900", contentBgClass)}>
                                            {item.strategy?.title || "-"}
                                        </td>

                                        {/* Metode Cell */}
                                        <td className={cn("p-4 text-center border border-slate-200 align-top text-slate-900", contentBgClass)}>
                                            {item.methods && item.methods.length > 0 ? (
                                                <ul className="list-none space-y-1">
                                                    {item.methods.map((m: any) => (
                                                        <li key={m.id}>{m.label || m.title}</li>
                                                    ))}
                                                </ul>
                                            ) : "-"}
                                        </td>

                                        {/* Deskripsi Cell */}
                                        <td className={cn("p-4 border border-slate-200 align-top text-slate-900", contentBgClass)}>
                                            <ul className="list-disc ml-4 space-y-2">
                                                {item.strategy?.kebutuhan && (
                                                    <li>{item.strategy.kebutuhan}</li>
                                                )}
                                                {item.strategy?.description && (
                                                    <li>{item.strategy.description} (Refleksi Kapasitas)</li>
                                                )}
                                            </ul>
                                        </td>

                                        {/* Target Cell */}
                                        <td className={cn("p-4 border border-slate-200 align-top text-slate-900", contentBgClass)}>
                                            {item.outputs && item.outputs.length > 0 ? (
                                                <ul className="list-disc ml-4 space-y-2">
                                                    {item.outputs.map((out, idx) => (
                                                        <li key={idx}>Target {item.methods?.[idx]?.title}: {out}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-slate-500">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500 italic border border-slate-200">
                                        Tidak ada dokumen rencana program untuk periode ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
