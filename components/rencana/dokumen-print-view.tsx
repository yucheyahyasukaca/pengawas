
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

                    {/* Desktop View (Table) */}
                    <div className="hidden md:block overflow-x-auto">
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

                    {/* Mobile View (Card) */}
                    {/* Mobile View (Card) */}
                    <div className="md:hidden">
                        <div className="rounded-xl shadow-md border border-slate-200 bg-white overflow-hidden">
                            <div className={cn("px-5 py-4 flex items-center justify-between", getPriorityColor(analysisResult.priority))}>
                                <span className="font-bold text-sm tracking-wide uppercase opacity-90">Prioritas</span>
                                <span className="font-bold text-sm bg-white/20 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/10">
                                    {analysisResult.priority.replace("Prioritas ", "")}
                                </span>
                            </div>

                            <div className="p-5 space-y-6">
                                {/* Sekolah */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Satuan Pendidikan</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {schools.length > 0 ? schools.map(s => (
                                            <span key={s.id} className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-sm font-semibold text-indigo-700">
                                                <div className="size-2 rounded-full bg-indigo-400" />
                                                {s.nama}
                                            </span>
                                        )) : (
                                            <span className="text-slate-400 italic text-sm">Belum ada sekolah</span>
                                        )}
                                    </div>
                                </div>

                                {/* Strategi & Metode Grid */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Strategi Pendampingan</h4>
                                        <p className="font-bold text-slate-800 leading-tight">{analysisResult.title}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Metode</h4>
                                        <div className="flex flex-col gap-2">
                                            {selectedMethodDetails.length > 0 ? selectedMethodDetails.map((m, idx) => (
                                                <div key={idx} className="flex items-center gap-2 font-medium text-slate-800">
                                                    <div className="size-1.5 rounded-full bg-slate-400" />
                                                    {m.label || m.title}
                                                </div>
                                            )) : "-"}
                                        </div>
                                    </div>
                                </div>

                                {/* Deskripsi */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Deskripsi / Pertimbangan</h4>
                                    <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 text-sm text-slate-700 leading-relaxed">
                                        <ul className="list-disc pl-4 space-y-2">
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
                                    </div>
                                </div>

                                {/* Target */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Target Capaian</h4>
                                        <div className="h-px flex-1 bg-slate-100" />
                                    </div>
                                    <ul className="space-y-3 text-sm text-slate-700">
                                        {selectedMethodDetails.map((m, idx) => (
                                            m.luaran && (
                                                <li key={`target-${idx}`} className="flex gap-3">
                                                    <div className="shrink-0 size-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="pt-0.5">
                                                        Target <span className="font-semibold text-slate-900">{m.title}</span>: {m.luaran.split('. ')[0]}.
                                                    </span>
                                                </li>
                                            )
                                        ))}
                                        <li className="flex gap-3">
                                            <div className="shrink-0 size-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">
                                                RKT
                                            </div>
                                            <span className="pt-0.5">Sebagian kegiatan RKT berhasil terlaksana.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="shrink-0 size-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                                <div className="size-2 bg-current rounded-full" />
                                            </div>
                                            <span className="pt-0.5">
                                                Peningkatan kapasitas: <span className="font-semibold text-slate-900">{analysisResult.sasaran.toLowerCase().includes('kapasitas rendah') ? 'Rendah' : 'Sedang'}</span> ➔ <span className="font-semibold text-slate-900">{analysisResult.sasaran.toLowerCase().includes('kapasitas rendah') ? 'Sedang' : 'Tinggi'}</span>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
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
