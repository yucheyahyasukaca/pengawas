"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { DokumenPrintView } from "@/components/rencana/dokumen-print-view";
import { cn } from "@/lib/utils";
import { calculateLevels, getStrategy, METHOD_OPTIONS } from "@/lib/rencana-utils";
import { useToast } from "@/hooks/use-toast";

interface StepDokumenProps {
    baseUrl: string;
    mode: "create" | "edit";
    id?: string;
}

interface School {
    id: string;
    nama: string;
    npsn: string;
}

export function StepDokumen({ baseUrl, mode, id }: StepDokumenProps) {
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
                let url = "/api/pengawas/rencana-program/draft";
                if (mode === "edit" && id) {
                    url = `/api/pengawas/rencana-program/${id}`;
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to load data");
                const data = await response.json();
                const record = mode === 'edit' ? data.rencanaProgram : data.draft;

                setDraftData(record);

                if (record) {
                    // 1. Calculate Analysis
                    if (record.form_data?.selectedAnswers) {
                        const { reflectionLevel, capacityLevel } = calculateLevels(record.form_data.selectedAnswers);
                        const strategy = getStrategy(reflectionLevel, capacityLevel);
                        setAnalysisResult(strategy);
                    }

                    // 2. Get Method Detail
                    if (record.form_data?.selectedMethods && Array.isArray(record.form_data.selectedMethods)) {
                        const methods = record.form_data.selectedMethods
                            .map((mid: string) => METHOD_OPTIONS.find(m => m.id === mid))
                            .filter(Boolean);
                        setSelectedMethodDetails(methods);
                    } else if (record.form_data?.selectedMethod) {
                        const method = METHOD_OPTIONS.find(m => m.id === record.form_data.selectedMethod);
                        if (method) setSelectedMethodDetails([method]);
                    }

                    // 3. Fetch Schools
                    let sekolahIds = record.sekolah_ids;
                    if (typeof sekolahIds === "string") {
                        try { sekolahIds = JSON.parse(sekolahIds); } catch (e) { sekolahIds = []; }
                    }

                    if (Array.isArray(sekolahIds) && sekolahIds.length > 0) {
                        try {
                            const schoolsRes = await fetch(`/api/sekolah/list?ids=${sekolahIds.join(',')}`);
                            if (schoolsRes.ok) {
                                const { sekolah } = await schoolsRes.json();
                                const mappedSchools = (sekolah || []).map((s: any) => ({
                                    id: s.id,
                                    nama: s.nama_sekolah,
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
    }, [mode, id]);

    const handlePublish = async () => {
        if (!draftData?.id) return;
        setIsPublishing(true);
        try {
            // Logic: if edit mode, we are updating existing record.
            // If create mode (draft), we update draft to 'Terbit'.

            // NOTE: In original code, update to 'Terbit' might imply finishing the creation flow.
            // For Edit mode, if it's already 'Terbit', we just save (which is done by steps)
            // But this action is explicitly "Terbitkan" (Publish).
            // If already published, maybe this button should say "Simpan & Selesai" or similar?
            // User request was "Tombol edit bisa edit data".
            // If I am editing a "Terbit" document, I probably just want to save changes.
            // But if I am editing a "Draft", I might want to Publish.

            const isAlreadyPublished = draftData.status === 'Terbit';

            // We use the ID endpoint.
            const updateUrl = `/api/pengawas/rencana-program/${draftData.id}`;

            const response = await fetch(updateUrl, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "Terbit", // Ensure it is set to Terbit
                    // We might need to send full formData again depending on backend, 
                    // but typically backend merges or we assume steps saved data already.
                    // The API `/api/pengawas/rencana-program/[id]` PUT updates fields provided.
                }),
            });

            if (response.ok) {
                toast({
                    title: isAlreadyPublished ? "Perubahan Disimpan" : "Berhasil Diterbitkan!",
                    description: isAlreadyPublished ? "Rencana program berhasil diperbarui." : "Rencana program Anda telah resmi diterbitkan.",
                    className: "bg-emerald-50 border-emerald-200 text-emerald-800"
                });

                setTimeout(() => {
                    router.push("/pengawas/perencanaan/rencana-program");
                }, 1000);
            } else {
                throw new Error("Gagal menerbitkan");
            }
        } catch (error) {
            console.error("Error publishing:", error);
            toast({
                title: "Gagal Menyimpan",
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
                <Button onClick={() => router.push(baseUrl)}>
                    Kembali ke Awal
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="print:hidden">
                <div className="container mx-auto max-w-[1400px] py-4 px-4 sm:px-6">
                    <Button
                        variant="ghost"
                        className="-ml-3 text-slate-600 hover:text-slate-900"
                        onClick={() => router.push(baseUrl)}
                    >
                        <ArrowLeft className="size-4 mr-2" /> Kembali ke Hub
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
                                <Loader2 className="size-4 animate-spin" /> {draftData.status === 'Terbit' ? 'Menyimpan...' : 'Menerbitkan...'}
                            </>
                        ) : (
                            <>
                                <Send className="size-4" /> {draftData.status === 'Terbit' ? 'Simpan Perubahan' : 'Terbitkan'}
                            </>
                        )}
                    </Button>
                }
            />
        </div>
    );
}
