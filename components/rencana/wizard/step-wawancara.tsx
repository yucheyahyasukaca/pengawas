"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Check, ChevronDown, Target, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

// Reuse the interview data structure
const interviewData = [
    {
        id: "cat1",
        title: "Mengidentifikasi Tingkat Kesadaran (Kepala Sekolah) Melakukan Refleksi",
        questions: [
            { id: "q1_1", text: "Apa kelemahan dan kekuatan Satuan Pendidikan Anda?" },
            { id: "q1_2", text: "Bagaimana Anda mengantisipasi kelemahan dan kekuatan tersebut?" }
        ],
        options: [
            { id: "k1", text: "(Kepala Sekolah) belum mengakui kelemahan apa adanya dan menjelaskan dampaknya pada kualitas pembelajaran.", conclusion: "Berkembang", color: "blue" },
            { id: "k2", text: "(Kepala Sekolah) belum mengetahui dan menunjukkan keinginan mengoptimalkan kekuatan Satuan Pendidikan.", conclusion: "Berkembang", color: "blue" },
            { id: "k3", text: "(Kepala Sekolah) mengakui kelemahan apa adanya dan menjelaskan dampaknya pada kualitas pembelajaran.", conclusion: "Berdaya", color: "emerald" },
            { id: "k4", text: "(Kepala Sekolah) mengetahui dan menunjukkan keinginan mengoptimalkan kekuatan Satuan Pendidikan.", conclusion: "Berdaya", color: "emerald" }
        ]
    },
    {
        id: "cat2",
        title: "Mengidentifikasi Tingkat Kapasitas (Kepala Sekolah) Memimpin Perubahan",
        questions: [
            { id: "q2_1", text: "Bagaimana Anda menyusun program kerja dan anggaran Satuan Pendidikan?" },
            { id: "q2_2", text: "Apa perbedaan program/kegiatan Satuan Pendidikan tahun lalu dengan tahun sebelumnya?" }
        ],
        options: [
            { id: "c1", text: "(Kepala Sekolah) tidak melakukan perubahan program/kegiatan apapun dalam 3 tahun terakhir (monoton).", conclusion: "Rendah", color: "rose" },
            { id: "c2", text: "(Kepala Sekolah) belum mampu menjelaskan perubahan berdasarkan perencanaan berbasis data.", conclusion: "Rendah", color: "rose" },
            { id: "c3", text: "(Kepala Sekolah) melakukan perubahan kegiatan/program dalam 3 tahun terakhir tapi belum efektif.", conclusion: "Sedang", color: "amber" },
            { id: "c4", text: "(Kepala Sekolah) mampu menjelaskan perubahan berdasarkan perencanaan berbasis data.", conclusion: "Sedang", color: "amber" },
            { id: "c5", text: "(Kepala Sekolah) melakukan perubahan kegiatan/program dalam 3 tahun terakhir yang berdampak.", conclusion: "Tinggi", color: "emerald" },
            { id: "c6", text: "(Kepala Sekolah) mampu menjelaskan dan mencoba perubahan berdasarkan perencanaan berbasis data.", conclusion: "Tinggi", color: "emerald" }
        ]
    }
];

interface StepWawancaraProps {
    baseUrl: string;
    mode: "create" | "edit";
    id?: string;
}

export function StepWawancara({ baseUrl, mode, id }: StepWawancaraProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [draftId, setDraftId] = useState<string | null>(mode === 'edit' && id ? id : null);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [fullDraftData, setFullDraftData] = useState<any>({});
    const [sekolahIds, setSekolahIds] = useState<string[]>([]);

    // Debounce for auto-save
    const debouncedAnswers = useDebounce(selectedAnswers, 2000);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Try from session storage first (for new drafts)
                let sessionIds: string[] = [];
                if (typeof window !== 'undefined') {
                    const stored = sessionStorage.getItem("rencana_program_selected_sekolah");
                    if (stored) sessionIds = JSON.parse(stored);
                }

                let url = "/api/pengawas/rencana-program/draft";
                if (mode === "edit" && id) {
                    url = `/api/pengawas/rencana-program/${id}`;
                }

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    // Normalize
                    const record = mode === 'edit' ? data.rencanaProgram : data.draft;

                    if (record) {
                        if (mode === 'create') setDraftId(record.id);
                        setFullDraftData(record.form_data || {});
                        if (record.form_data && record.form_data.selectedAnswers) {
                            setSelectedAnswers(record.form_data.selectedAnswers);
                        }

                        // Sekolah IDs
                        let recordSekolahIds = record.sekolah_ids;
                        if (typeof recordSekolahIds === "string") {
                            try {
                                recordSekolahIds = JSON.parse(recordSekolahIds);
                            } catch (e) {
                                recordSekolahIds = [];
                            }
                        }

                        if (Array.isArray(recordSekolahIds) && recordSekolahIds.length > 0) {
                            setSekolahIds(recordSekolahIds);
                        } else if (mode === 'create' && sessionIds.length > 0) {
                            setSekolahIds(sessionIds);
                        }
                    } else if (mode === 'create' && sessionIds.length > 0) {
                        setSekolahIds(sessionIds);
                    }
                } else if (mode === 'create' && sessionIds.length > 0) {
                    setSekolahIds(sessionIds);
                }
            } catch (error) {
                console.error("Failed to load data:", error);
                // Fallback to session storage only for create
                if (mode === 'create' && typeof window !== 'undefined') {
                    const stored = sessionStorage.getItem("rencana_program_selected_sekolah");
                    if (stored) setSekolahIds(JSON.parse(stored));
                }
            }
        };
        loadData();
    }, [mode, id]);

    const handleAnswerSelect = (questionId: string, optionId: string) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const pSave = async (answers: Record<string, string>, isManual: boolean) => {
        setSaveStatus("saving");
        try {
            const payload = {
                id: draftId, // In edit mode, this is real ID.
                formData: {
                    ...fullDraftData,
                    selectedAnswers: answers,
                    step: 1
                },
                sekolah_ids: sekolahIds
            };

            let url = "/api/pengawas/rencana-program/draft";
            if (mode === "edit" && id) {
                url = `/api/pengawas/rencana-program/${id}`;
            }

            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                const record = mode === 'edit' ? data.rencanaProgram : data.draft;

                if (mode === 'create' && record) setDraftId(record.id);
                if (record) setFullDraftData(record.form_data || {});

                // Update sekolahIds if server returned them
                if (record && record.sekolah_ids) {
                    let sIds = record.sekolah_ids;
                    if (typeof sIds === 'string') {
                        try { sIds = JSON.parse(sIds) } catch (e) { }
                    }
                    if (Array.isArray(sIds)) setSekolahIds(sIds);
                }

                setSaveStatus("saved");
                if (isManual) {
                    toast({ title: "Berhasil Disimpan", description: "Wawancara tersimpan." });
                }
            } else {
                setSaveStatus("error");
            }
        } catch (error) {
            setSaveStatus("error");
        }
    };

    useEffect(() => {
        if (Object.keys(debouncedAnswers).length > 0) {
            pSave(debouncedAnswers, false);
        }
    }, [debouncedAnswers]);

    return (
        <div className="container mx-auto max-w-4xl py-6 px-4 sm:px-6 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" className="rounded-full border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-sm" onClick={() => router.push(baseUrl)}>
                    <ArrowLeft className="size-5 mr-2" /> Kembali
                </Button>
                <h1 className="text-2xl font-bold text-slate-900">1. Melakukan Wawancara</h1>
            </div>

            <div className="space-y-6">
                {interviewData.map((category) => (
                    <Card key={category.id} className="border-slate-200 shadow-sm bg-white">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 rounded-t-xl">
                            <h3 className="text-base font-bold text-white uppercase tracking-wide">{category.title}</h3>
                        </div>
                        <div className="p-4 sm:p-6 space-y-6">
                            {category.questions.map((q) => {
                                const selectedOptId = selectedAnswers[q.id];
                                const selectedOpt = category.options.find(o => o.id === selectedOptId);
                                const isOpen = openDropdown === q.id;

                                return (
                                    <div key={q.id} className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 bg-indigo-100 rounded-lg shrink-0">
                                                <Target className="size-4 text-indigo-600" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-800">{q.text}</p>
                                        </div>
                                        <div className="relative pl-0 sm:pl-10">
                                            <button
                                                type="button"
                                                onClick={() => setOpenDropdown(isOpen ? null : q.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-3.5 rounded-xl border text-sm transition-all min-h-[48px] h-auto",
                                                    isOpen ? "border-indigo-500 ring-4 ring-indigo-500/10 text-indigo-900 bg-white" : selectedOpt ? "border-indigo-200 bg-indigo-50/30 text-indigo-900" : "border-slate-200 bg-slate-50 hover:bg-white text-slate-600"
                                                )}
                                            >
                                                <span className="flex-1 text-left whitespace-normal">{selectedOpt ? selectedOpt.text : "Pilih jawaban..."}</span>
                                                <ChevronDown className={cn("size-4 ml-2 transition-transform", isOpen && "rotate-180")} />
                                            </button>
                                            {isOpen && (
                                                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                                    <div className="max-h-[300px] overflow-y-auto py-1">
                                                        {category.options.map((opt) => (
                                                            <button
                                                                key={opt.id}
                                                                type="button"
                                                                onClick={() => { handleAnswerSelect(q.id, opt.id); setOpenDropdown(null); }}
                                                                className={cn("w-full text-left p-3.5 text-sm hover:bg-indigo-50 border-l-4 border-transparent flex gap-3 text-slate-700 hover:text-slate-900", selectedAnswers[q.id] === opt.id && "bg-indigo-50 border-indigo-500 font-medium text-indigo-900")}
                                                            >
                                                                {selectedAnswers[q.id] === opt.id && <Check className="size-4 text-indigo-600 shrink-0" />}
                                                                {opt.text}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <div className={cn("flex items-center gap-2 text-sm text-slate-500 transition-opacity", saveStatus === "idle" ? "opacity-0" : "opacity-100")}>
                    {saveStatus === "saving" && <Loader2 className="size-3 animate-spin" />}
                    {saveStatus === "saved" && <Check className="size-3" />}
                    <span>{saveStatus === "saving" ? "Menyimpan..." : saveStatus === "saved" ? "Tersimpan" : "Gagal menyimpan"}</span>
                </div>
                <Button onClick={() => pSave(selectedAnswers, true)} disabled={saveStatus === "saving"} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                    <Save className="size-4 mr-2" /> Simpan
                </Button>
            </div>
        </div>
    );
}
