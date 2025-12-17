
import { cn } from "@/lib/utils";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface School {
    id: string;
    nama: string;
    npsn: string;
}

interface DokumenPrintViewProps {
    analysisResult: any;
    selectedMethodDetails: any[];
    schools: School[];
    onPrint?: () => void;
    actionButtons?: React.ReactNode;
}

export function DokumenPrintView({
    analysisResult,
    selectedMethodDetails,
    schools,
    onPrint,
    actionButtons
}: DokumenPrintViewProps) {
    if (!analysisResult) return null;

    // Colors mapping for priorities
    const getPriorityColor = (priority: string) => {
        if (priority === "Prioritas Utama") return "bg-rose-400 text-white border-rose-500";
        if (priority === "Prioritas Menengah") return "bg-amber-300 text-amber-900 border-amber-400";
        if (priority === "Prioritas Akhir") return "bg-emerald-400 text-white border-emerald-500";
        return "bg-slate-100 text-slate-800";
    };

    const getRowColor = (priority: string) => {
        if (priority === "Prioritas Utama") return "bg-rose-50";
        if (priority === "Prioritas Menengah") return "bg-amber-50";
        if (priority === "Prioritas Akhir") return "bg-emerald-50";
        return "bg-white";
    };

    return (
        <div className="min-h-screen bg-slate-50/50 print:bg-white pb-20">
            {/* Navigation & Header - Hidden on Print */}
            <div className="print:hidden">
                <div className="container mx-auto max-w-[1400px] py-8 px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                        <div>
                            {/* Header content usually handled by parent page, but we can put title here if needed */}
                            <h1 className="text-3xl font-bold text-slate-900">Dokumen Rencana Pendampingan</h1>
                            <p className="text-slate-500 mt-1">
                                Tinjau dan unduh dokumen perencanaan yang telah disusun.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={onPrint || (() => window.print())}
                                className="gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                            >
                                <Printer className="size-4" /> Cetak / PDF
                            </Button>
                            {actionButtons}
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Preview Area */}
            <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 print:p-0 print:max-w-none">
                <div className="bg-white shadow-xl shadow-slate-200/50 print:shadow-none rounded-none print:rounded-none overflow-hidden border border-slate-200 print:border-none">

                    {/* Document Header Title */}
                    <div className="bg-sky-800 text-white text-center py-2 print:py-1 border-t border-sky-700">
                        <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider">
                            Rencana Pendampingan Satuan Pendidikan
                        </h3>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-sky-900 text-white text-xs sm:text-sm uppercase tracking-wider">
                                    <th className="p-4 border border-sky-700 w-[10%]">Prioritas</th>
                                    <th className="p-4 border border-sky-700 w-[15%]">Nama Satuan Pendidikan</th>
                                    <th className="p-4 border border-sky-700 w-[12%]">Pilihan Strategi</th>
                                    <th className="p-4 border border-sky-700 w-[10%]">Pilihan Metode</th>
                                    <th className="p-4 border border-sky-700 w-[28%]">Deskripsi / Pertimbangan Kebutuhan</th>
                                    <th className="p-4 border border-sky-700 w-[25%]">Target</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className={getRowColor(analysisResult.priority)}>
                                    {/* Prioritas */}
                                    <td className={cn(
                                        "p-4 border border-white/20 text-center font-bold align-middle shadow-sm leading-tight",
                                        getPriorityColor(analysisResult.priority)
                                    )}>
                                        <span className="drop-shadow-sm uppercase tracking-wide text-xs sm:text-sm">
                                            {analysisResult.priority}
                                        </span>
                                    </td>

                                    {/* Nama Sekolah */}
                                    <td className="p-4 border border-slate-300 font-semibold text-slate-800 align-middle">
                                        <div className="flex flex-col gap-2">
                                            {schools.length > 0 ? schools.map(s => (
                                                <div key={s.id} className="pb-1 border-b border-slate-200/50 last:border-0 last:pb-0">
                                                    {s.nama}
                                                </div>
                                            )) : (
                                                <span className="text-slate-400 italic">Belum ada sekolah dipilih</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Pilihan Strategi */}
                                    <td className="p-4 border border-slate-300 text-center font-bold text-slate-800 align-middle bg-white/30">
                                        {analysisResult.title}
                                    </td>

                                    {/* Pilihan Metode */}
                                    <td className="p-4 border border-slate-300 text-center font-medium text-slate-700 align-middle">
                                        <div className="flex flex-col gap-2">
                                            {selectedMethodDetails.length > 0 ? selectedMethodDetails.map((m, idx) => (
                                                <span key={idx} className="block pb-1 border-b border-slate-300 last:border-0 last:pb-0">
                                                    {m.label || m.title}
                                                </span>
                                            )) : "-"}
                                        </div>
                                    </td>

                                    {/* Deskripsi */}
                                    <td className="p-4 border border-slate-300 align-top">
                                        <ul className="list-disc pl-4 space-y-2 text-slate-700 text-sm leading-relaxed">
                                            {analysisResult.kebutuhan && (
                                                <li>{analysisResult.kebutuhan}</li>
                                            )}
                                            {analysisResult.description && (
                                                <li>{analysisResult.description} (Refleksi Kapasitas)</li>
                                            )}
                                            {selectedMethodDetails.map((m, idx) => (
                                                m.luaran && <li key={`luaran-${idx}`}>Luaran {m.title}: {m.luaran}</li>
                                            ))}
                                        </ul>
                                    </td>

                                    {/* Target */}
                                    <td className="p-4 border border-slate-300 align-top">
                                        <ul className="list-disc pl-4 space-y-2 text-slate-700 text-sm leading-relaxed">
                                            {selectedMethodDetails.map((m, idx) => (
                                                m.luaran && (
                                                    <li key={`target-${idx}`}>
                                                        Target {m.title}: {m.luaran.split('. ')[0]}.
                                                    </li>
                                                )
                                            ))}
                                            <li>
                                                Sebagian kegiatan yang disusun dalam Rencana Kerja Tahunan (RKT) berhasil terlaksana.
                                            </li>
                                            <li>
                                                Terjadi peningkatan pada kapasitas memimpin perubahan, dari {
                                                    analysisResult.sasaran.toLowerCase().includes('kapasitas rendah') ? 'rendah' : 'sedang'
                                                } menjadi {
                                                    analysisResult.sasaran.toLowerCase().includes('kapasitas rendah') ? 'sedang' : 'tinggi'
                                                }.
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Print Footer Note */}
                <div className="mt-4 text-center hidden print:block text-xs text-slate-400">
                    Dicetak pada {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0.5cm;
                    }
                    body {
                        background: white;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}
