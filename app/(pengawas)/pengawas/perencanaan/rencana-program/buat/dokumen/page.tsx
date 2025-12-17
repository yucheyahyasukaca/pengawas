
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { DokumenPrintView } from "@/components/rencana/dokumen-print-view";
import { cn } from "@/lib/utils";
import { calculateLevels, getStrategy, METHOD_OPTIONS } from "@/lib/rencana-utils";
import { useToast } from "@/hooks/use-toast";

interface School {
    id: string;
    nama: string;
    npsn: string;
}

export default function DokumenPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [draftData, setDraftData] = useState<any>(null);
    const [schools, setSchools] = useState<School[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);

    // Derived state
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [selectedMethodDetails, setSelectedMethodDetails] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Draft
                const draftRes = await fetch("/api/pengawas/rencana-program/draft");
                if (!draftRes.ok) throw new Error("Failed to load draft");
                const { draft } = await draftRes.json();
                setDraftData(draft);

                if (draft) {
                    // 1. Calculate Analysis (Step 2 Logic)
                    if (draft.form_data?.selectedAnswers) {
                        const { reflectionLevel, capacityLevel } = calculateLevels(draft.form_data.selectedAnswers);
                        const strategy = getStrategy(reflectionLevel, capacityLevel);
                        setAnalysisResult(strategy);
                    }

                    // 2. Get Method Detail (Step 4 Logic) - Handle Multiple
                    if (draft.form_data?.selectedMethods && Array.isArray(draft.form_data.selectedMethods)) {
                        const methods = draft.form_data.selectedMethods
                            .map((id: string) => METHOD_OPTIONS.find(m => m.id === id))
                            .filter(Boolean);
                        setSelectedMethodDetails(methods);
                    } else if (draft.form_data?.selectedMethod) {
                        const method = METHOD_OPTIONS.find(m => m.id === draft.form_data.selectedMethod);
                        if (method) setSelectedMethodDetails([method]);
                    }

                    // 3. Fetch Schools
                    let sekolahIds = draft.sekolah_ids;
                    if (typeof sekolahIds === "string") {
                        try {
                            sekolahIds = JSON.parse(sekolahIds);
                        } catch (e) {
                            sekolahIds = [];
                        }
                    }

                    if (Array.isArray(sekolahIds) && sekolahIds.length > 0) {
                        try {
                            const schoolsRes = await fetch(`/api/sekolah/list?ids=${sekolahIds.join(',')}`);
                            if (schoolsRes.ok) {
                                const { sekolah } = await schoolsRes.json();
                                // Map API response (nama_sekolah) to component interface (nama)
                                const mappedSchools = (sekolah || []).map((s: any) => ({
                                    id: s.id,
                                    nama: s.nama_sekolah, // Map from DB column
                                    npsn: s.npsn
                                }));
                                setSchools(mappedSchools);
                            }
                        } catch (e) {
                            console.error("Failed to fetch schools", e);
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading document data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handlePublish = async () => {
        if (!draftData?.id) return;
        setIsPublishing(true);
        try {
            const response = await fetch(`/api/pengawas/rencana-program/${draftData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "Terbit",
                }),
            });

            if (response.ok) {
                toast({
                    title: "Berhasil Diterbitkan!",
                    description: "Rencana program Anda telah resmi diterbitkan.",
                    className: "bg-emerald-50 border-emerald-200 text-emerald-800"
                });
                // Redirect after short delay
                setTimeout(() => {
                    router.push("/pengawas/perencanaan/rencana-program");
                }, 1000);
            } else {
                throw new Error("Gagal menerbitkan");
            }
        } catch (error) {
            console.error("Error publishing:", error);
            toast({
                title: "Gagal Menerbitkan",
                description: "Terjadi kesalahan. Silakan coba lagi.",
                variant: "error"
            });
        } finally {
            setIsPublishing(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl py-20 flex justify-center">
                <Loader2 className="animate-spin text-indigo-600 size-10" />
            </div>
        );
    }

    if (!draftData || !analysisResult) {
        return (
            <div className="container mx-auto max-w-4xl py-20 text-center">
                <p className="text-slate-500 mb-4">Data perencanaan belum lengkap.</p>
                <Button onClick={() => router.push("/pengawas/perencanaan/rencana-program/buat")}>
                    Kembali ke Beranda
                </Button>
            </div>
        );
    }

    // Colors mapping helper moved to DokumenPrintView


    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header/Nav for Step 5 */}
            <div className="print:hidden">
                {/* Back button logic specific to Step 5 */}
                <div className="container mx-auto max-w-[1400px] py-4 px-4 sm:px-6">
                    <Button
                        variant="ghost"
                        className="-ml-3 text-slate-600 hover:text-slate-900"
                        onClick={() => router.push("/pengawas/perencanaan/rencana-program/buat")}
                    >
                        <ArrowLeft className="size-4 mr-2" /> Kembali ke Draft
                    </Button>
                </div>
            </div>

            <DokumenPrintView
                analysisResult={analysisResult}
                selectedMethodDetails={selectedMethodDetails}
                schools={schools}
                actionButtons={
                    <Button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200"
                    >
                        {isPublishing ? (
                            <>
                                <Loader2 className="size-4 animate-spin" /> Menerbitkan...
                            </>
                        ) : (
                            <>
                                <Send className="size-4" /> Terbitkan
                            </>
                        )}
                    </Button>
                }
            />
        </div>
    );
}
