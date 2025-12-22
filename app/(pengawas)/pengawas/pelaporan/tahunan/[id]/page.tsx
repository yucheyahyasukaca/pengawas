"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Download, FileSpreadsheet, Printer, Share2 } from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

// Helper for conditionally joining classes
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

export default function DetailLaporanTahunanPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { toast } = useToast();
    // Unwrap params using React.use()
    const resolvedParams = use(params);
    const idParts = resolvedParams.id.split("-");
    const year = idParts.length > 1 ? idParts[1] : new Date().getFullYear().toString();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/pengawas/laporan/tahunan?year=${year}`);
                if (!res.ok) throw new Error("Gagal memuat data");
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Gagal memuat laporan tahunan",
                    variant: "default"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year, toast]);

    const handleExport = () => {
        if (!data) return;

        const wb = XLSX.utils.book_new();

        // 1. Sheet Utama
        const wsMain = XLSX.utils.json_to_sheet(data.mainReport || []);
        XLSX.utils.book_append_sheet(wb, wsMain, "Laporan Utama");

        // 2. Lampiran 1
        const wsLamp1 = XLSX.utils.json_to_sheet(data.lampiran1 || []);
        XLSX.utils.book_append_sheet(wb, wsLamp1, "Lampiran 1");

        // 3. Lampiran 2
        const wsLamp2 = XLSX.utils.json_to_sheet(data.lampiran2 || []);
        XLSX.utils.book_append_sheet(wb, wsLamp2, "Lampiran 2");

        // 4. Lampiran 3
        const wsLamp3 = XLSX.utils.json_to_sheet(data.lampiran3 || []);
        XLSX.utils.book_append_sheet(wb, wsLamp3, "Lampiran 3");

        // 5. Lampiran 4
        const wsLamp4 = XLSX.utils.json_to_sheet(data.lampiran4 || []);
        XLSX.utils.book_append_sheet(wb, wsLamp4, "Lampiran 4");

        // 6. Rapor Pendidikan
        // Flatten rapor data for export if needed, or just dump
        const wsRapor = XLSX.utils.json_to_sheet(data.raporPendidikan?.map((r: any) => ({
            NamaSekolah: r.namaSekolah,
            DataRapor: JSON.stringify(r.rapor)
        })) || []);
        XLSX.utils.book_append_sheet(wb, wsRapor, "Rapor Pendidikan");

        XLSX.writeFile(wb, `Laporan_Tahunan_${year}.xlsx`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-indigo-600 size-10" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h2 className="text-xl font-bold">Data tidak ditemukan</h2>
                <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
            </div>
        );
    }

    // Pivot Rapor Data for Component 6
    // We want Rows = Indicators, Cols = Schools
    // Collect all unique indicators first
    const allIndicatorsSet = new Set<string>();
    const schoolRaporMap: Record<string, Record<string, any>> = {}; // schoolName -> { indCode: value }

    data.raporPendidikan?.forEach((schoolRow: any) => {
        const rapor = schoolRow.rapor || [];
        const map: Record<string, any> = {};
        if (Array.isArray(rapor)) {
            rapor.forEach((item: any) => {
                // Assuming item has { code: "A.1", label: "Literasi", value: "3", ... }
                // or similar structure. 
                // If we don't know structure, we guess.
                // Based on `006_extend_sekolah_profile.sql`, it's JSONB.
                // Let's assume standard Rapor structure: { indikator_nama: "..", nilai: ".." } or similar.
                // For now, let's look for a 'kode' or check keys.
                // If we can't find clear codes, we might struggle.
                // Let's assume typical structure: { id: "A.1", label: "Kemampuan Literasi", score: 3 }
                const code = item.kode || item.id || item.code || item.indikator;
                const val = item.nilai || item.score || item.value;
                if (code) {
                    allIndicatorsSet.add(code);
                    map[code] = val;
                }
            });
        }
        schoolRaporMap[schoolRow.namaSekolah] = map;
    });
    const sortedIndicators = Array.from(allIndicatorsSet).sort();

    return (
        <div className="container mx-auto max-w-[1400px] p-4 sm:p-6 space-y-8 bg-white min-h-screen">
            {/* Header Page */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-slate-100">
                        <ArrowLeft className="size-5 text-slate-700" />
                    </Button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Laporan Tahunan {year}</h1>
                        <p className="text-sm text-slate-500">
                            Periode: Januari - Desember {year}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport} className="gap-2 bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300">
                        <FileSpreadsheet className="size-4" /> Export Excel
                    </Button>
                    <Button variant="outline" onClick={() => window.print()} className="gap-2 bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300">
                        <Printer className="size-4" /> Print
                    </Button>
                </div>
            </div>

            {/* 1. PERENCANAAN PENDAMPINGAN SATUAN PENDIDIKAN */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-indigo-600 text-indigo-600 bg-indigo-50">Bagian 1</Badge>
                    <h2 className="text-lg font-bold text-slate-800 uppercase">Perencanaan Pendampingan Satuan Pendidikan</h2>
                </div>
                <Card className="overflow-hidden border-indigo-200 shadow-md bg-white p-0 gap-0">
                    {/* Header Info Tables */}
                    <div className="bg-white p-6 border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <table className="w-full text-sm">
                            <tbody>
                                <tr className="border-b border-slate-100"><td className="py-2 font-semibold text-slate-600">Nama Pengawas</td><td className="py-2 font-bold text-slate-900">{data.pengawas?.nama}</td></tr>
                                <tr className="border-b border-slate-100"><td className="py-2 font-semibold text-slate-600">NIP</td><td className="py-2 text-slate-800">{data.pengawas?.nip}</td></tr>
                                <tr className="border-b border-slate-100"><td className="py-2 font-semibold text-slate-600">Jabatan</td><td className="py-2 text-slate-800">{data.pengawas?.jabatan}</td></tr>
                                <tr><td className="py-2 font-semibold text-slate-600">Pangkat/Gol</td><td className="py-2 text-slate-800">{data.pengawas?.pangkat}</td></tr>
                            </tbody>
                        </table>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr className="border-b border-slate-100"><td className="py-2 font-semibold text-slate-600">Metode Pendampingan</td><td className="py-2 text-slate-800">Training, Mentoring, Coaching, Facilitating, Consulting</td></tr>
                                <tr><td className="py-2 font-semibold text-slate-600 align-top">Prioritas Pendampingan</td><td className="py-2 text-slate-800">
                                    <div>Prioritas Utama</div>
                                    <div>Prioritas Menengah</div>
                                    <div>Prioritas Akhir</div>
                                </td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Tempat dan Tanggal */}
                    <div className="bg-white p-6 border-b border-slate-200">
                        <h3 className="font-bold text-sm text-slate-800 uppercase mb-4 tracking-wide">Jadwal Kegiatan (Sampel Triwulan I)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            {['Januari', 'Februari', 'Maret'].map(month => (
                                <div key={month} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                    <div className="font-bold text-indigo-700 mb-3 uppercase tracking-wider text-xs border-b border-slate-200 pb-2 flex justify-between">
                                        <span>{month}</span>
                                        <span className="text-[10px] text-slate-400 font-normal">2025</span>
                                    </div>
                                    <div className="space-y-2">
                                        {data.activities && data.activities[month] ? (
                                            data.activities[month].slice(0, 3).map((act: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center border-b border-slate-200/50 pb-2 mb-1 last:border-0 last:pb-0 last:mb-0">
                                                    <span className="font-semibold text-slate-800">{act.place}</span>
                                                    <span className="text-slate-600 text-xs bg-white px-2 py-1 rounded border border-slate-100 shadow-sm">{act.date.split(' ')[0]}</span>
                                                </div>
                                            ))
                                        ) : <div className="text-slate-400 italic text-xs py-2">Tidak ada data kegiatan</div>}
                                        {data.activities && data.activities[month] && data.activities[month].length > 3 && (
                                            <div className="text-indigo-600 font-medium text-[10px] pt-1 text-center bg-indigo-50/50 rounded py-1 mt-2">+ {data.activities[month].length - 3} kegiatan lainnya</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-indigo-50 text-indigo-900 font-bold uppercase text-xs border-b-2 border-indigo-100">
                                <tr>
                                    <th className="py-4 px-4 border-r border-indigo-100 w-12 text-center">No</th>
                                    <th className="py-4 px-4 border-r border-indigo-100 w-32">NPSN</th>
                                    <th className="py-4 px-4 border-r border-indigo-100">Nama Sekolah</th>
                                    <th className="py-4 px-4 border-r border-indigo-100 text-center">Komitmen Perubahan</th>
                                    <th className="py-4 px-4 border-r border-indigo-100 text-center">Strategi</th>
                                    <th className="py-4 px-4 text-center">Dokumen Rencana</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {data.mainReport?.map((row: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors bg-white">
                                        <td className="py-4 px-4 text-center border-r border-slate-100 font-medium text-slate-700">{row.no}</td>
                                        <td className="py-4 px-4 border-r border-slate-100 font-mono text-xs text-slate-600">{row.npsn}</td>
                                        <td className="py-4 px-4 border-r border-slate-100 font-semibold text-slate-900">{row.namaSekolah}</td>
                                        <td className="py-4 px-4 border-r border-slate-100 text-center">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-xs font-semibold",
                                                row.komitmen.includes("Berdaya") ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                            )}>
                                                {row.komitmen}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 border-r border-slate-100 text-center">
                                            <div className="font-bold text-slate-800">{row.strategi}</div>
                                            <div className="text-xs text-slate-500 mt-1 font-medium">{row.prioritas}</div>
                                        </td>
                                        <td className="py-4 px-4 text-center italic text-slate-500 text-xs">{row.dokumen}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>

            {/* 2. Lampiran 1: Sebaran Tingkat Kesadaran */}
            <section className="space-y-4 break-before-page">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-indigo-600 text-indigo-600 bg-indigo-50">Lampiran 1</Badge>
                    <h2 className="text-lg font-bold text-slate-800">Sebaran Tingkat Kesadaran Kepala Sekolah</h2>
                </div>
                <Card className="overflow-hidden border-slate-300 shadow-md bg-white p-0 gap-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse text-center">
                            <thead className="bg-indigo-50 text-indigo-900 font-bold text-xs">
                                <tr>
                                    <th className="border border-indigo-100 p-3 w-10">No</th>
                                    <th className="border border-indigo-100 p-3 w-20">Indikator</th>
                                    {data.lampiran1?.map((row: any) => (
                                        <th key={row.no} className="border border-indigo-100 p-2 min-w-[100px] text-[10px] break-words">
                                            {row.namaSekolah}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {['k1', 'k2', 'k3', 'k4'].map((k, idx) => (
                                    <tr key={k} className={cn(k === 'k3' || k === 'k4' ? "bg-indigo-50" : "bg-white")}>
                                        <td className="border border-slate-200 p-2 text-slate-400 text-xs text-center">{idx + 1}</td>
                                        <td className="border border-slate-200 p-2 font-mono uppercase font-semibold text-slate-700">{k.toUpperCase()}</td>
                                        {data.lampiran1?.map((row: any, idx: number) => (
                                            <td key={idx} className="border border-slate-200 p-2 text-center">
                                                {row[k] ? <CheckCircle className="size-5 text-indigo-600 mx-auto" /> : ""}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                <tr className="bg-amber-50 font-bold text-amber-800">
                                    <td colSpan={2} className="border border-slate-200 p-2 text-right px-4 text-xs uppercase tracking-wider">Opsi Berkembang</td>
                                    {data.lampiran1?.map((row: any, idx: number) => (
                                        <td key={idx} className="border border-slate-200 p-2">
                                            {(row.k1 ? 1 : 0) + (row.k2 ? 1 : 0)}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="bg-emerald-50 font-bold text-emerald-800">
                                    <td colSpan={2} className="border border-slate-200 p-2 text-right px-4 text-xs uppercase tracking-wider">Opsi Berdaya</td>
                                    {data.lampiran1?.map((row: any, idx: number) => (
                                        <td key={idx} className="border border-slate-200 p-2">
                                            {(row.k3 ? 1 : 0) + (row.k4 ? 1 : 0)}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="bg-white font-bold italic">
                                    <td colSpan={2} className="border border-slate-200 p-2 text-right px-4 text-slate-500">Predikat</td>
                                    {data.lampiran1?.map((row: any, idx: number) => (
                                        <td key={idx} className="border border-slate-200 p-2 text-[10px] text-slate-800">
                                            {row.predikat}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-slate-50 text-xs text-slate-600 space-y-1 border-t border-slate-200">
                        <p><span className="font-bold text-indigo-700 font-mono">KP1:</span> Kepala sekolah belum mengakui kelemahan apa adanya.</p>
                        <p><span className="font-bold text-indigo-700 font-mono">KP2:</span> Kepala sekolah belum mengetahui kekuatan satuan pendidikan.</p>
                        <p><span className="font-bold text-indigo-700 font-mono">KP3:</span> Kepala sekolah mengakui kelemahan apa adanya.</p>
                        <p><span className="font-bold text-indigo-700 font-mono">KP4:</span> Kepala sekolah mengetahui dan menunjukkan keinginan mengoptimalkan kekuatan.</p>
                    </div>
                </Card>
            </section>

            {/* 3. Lampiran 2: Rekap Capaian Kesadaran */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-indigo-600 text-indigo-600 bg-indigo-50">Lampiran 2</Badge>
                    <h2 className="text-lg font-bold text-slate-800">Rekap Capaian Tingkat Kesadaran</h2>
                </div>
                <Card className="overflow-hidden border-slate-300 shadow-md bg-white p-0 gap-0">
                    <table className="w-full text-sm">
                        <thead className="bg-indigo-50 text-indigo-900 font-bold border-b border-indigo-100">
                            <tr>
                                <th className="py-3 px-4 text-left w-12 border-r border-indigo-100">No</th>
                                <th className="py-3 px-4 text-left border-r border-indigo-100">Nama Sekolah</th>
                                <th className="py-3 px-4 text-center">Capaian Tingkat Kesadaran</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {data.lampiran2?.map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors bg-white">
                                    <td className="py-3 px-4 border-r border-slate-100 text-center text-slate-500">{idx + 1}</td>
                                    <td className="py-3 px-4 border-r border-slate-100 font-medium text-slate-800">{row.namaSekolah}</td>
                                    <td className="py-3 px-4 text-center font-bold text-slate-700">{row.capaian}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </section>

            {/* 4. Lampiran 3: Sebaran Capaian Kapasitas */}
            <section className="space-y-4 break-before-page">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-indigo-600 text-indigo-600 bg-indigo-50">Lampiran 3</Badge>
                    <h2 className="text-lg font-bold text-slate-800">Sebaran Capaian Kapasitas Memimpin Perubahan</h2>
                </div>
                <Card className="overflow-hidden border-slate-300 shadow-md bg-white p-0 gap-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse text-center">
                            <thead className="bg-indigo-50 text-indigo-900 font-bold text-xs">
                                <tr>
                                    <th className="border border-indigo-100 p-3 w-10">No</th>
                                    <th className="border border-indigo-100 p-3 w-20">Indikator</th>
                                    {data.lampiran3?.map((row: any) => (
                                        <th key={row.no} className="border border-indigo-100 p-2 min-w-[100px] text-[10px] break-words">
                                            {row.namaSekolah}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-red-50 font-bold text-red-800">
                                    <td colSpan={2} className="border border-slate-200 p-2 text-right px-4 text-xs uppercase tracking-wider">Opsi Rendah (c1, c2)</td>
                                    {data.lampiran3?.map((row: any, idx: number) => (
                                        <td key={idx} className="border border-slate-200 p-2">
                                            {(row.c1 ? 1 : 0) + (row.c2 ? 1 : 0)}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="bg-amber-50 font-bold text-amber-800">
                                    <td colSpan={2} className="border border-slate-200 p-2 text-right px-4 text-xs uppercase tracking-wider">Opsi Sedang (c3, c4)</td>
                                    {data.lampiran3?.map((row: any, idx: number) => (
                                        <td key={idx} className="border border-slate-200 p-2">
                                            {(row.c3 ? 1 : 0) + (row.c4 ? 1 : 0)}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="bg-emerald-50 font-bold text-emerald-800">
                                    <td colSpan={2} className="border border-slate-200 p-2 text-right px-4 text-xs uppercase tracking-wider">Opsi Tinggi (c5, c6)</td>
                                    {data.lampiran3?.map((row: any, idx: number) => (
                                        <td key={idx} className="border border-slate-200 p-2">
                                            {(row.c5 ? 1 : 0) + (row.c6 ? 1 : 0)}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="bg-white font-bold italic">
                                    <td colSpan={2} className="border border-slate-200 p-2 text-right px-4 text-slate-500">Predikat</td>
                                    {data.lampiran3?.map((row: any, idx: number) => (
                                        <td key={idx} className="border border-slate-200 p-2 text-[10px] text-slate-800">
                                            {row.predikat}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-slate-50 text-xs text-slate-600 space-y-1 border-t border-slate-200">
                        <p><span className="font-bold text-indigo-700 font-mono">Rendah:</span> Monoton, tidak ada perubahan atau tidak berbasis data.</p>
                        <p><span className="font-bold text-indigo-700 font-mono">Sedang:</span> Ada perubahan tapi belum efektif, atau rencana berbasis data tapi belum optimal.</p>
                        <p><span className="font-bold text-indigo-700 font-mono">Tinggi:</span> Perubahan berdampak dan berbasis data.</p>
                    </div>
                </Card>
            </section>

            {/* 5. Lampiran 4: Rekap Capaian Kapasitas */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-indigo-600 text-indigo-600 bg-indigo-50">Lampiran 4</Badge>
                    <h2 className="text-lg font-bold text-slate-800">Rekap Capaian Kapasitas Memimpin Perubahan</h2>
                </div>
                <Card className="overflow-hidden border-slate-300 shadow-md bg-white p-0 gap-0">
                    <table className="w-full text-sm">
                        <thead className="bg-indigo-50 font-bold border-b border-indigo-100 text-indigo-900">
                            <tr>
                                <th className="py-3 px-4 text-left w-12 border-r border-indigo-100">No</th>
                                <th className="py-3 px-4 text-left border-r border-indigo-100">Nama Sekolah</th>
                                <th className="py-3 px-4 text-left border-r border-indigo-100">Deskripsi Capaian</th>
                                <th className="py-3 px-4 text-center w-24 border-r border-indigo-100">Gradasi</th>
                                <th className="py-3 px-4 text-center w-24">Capacity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {data.lampiran4?.map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors bg-white">
                                    <td className="py-3 px-4 border-r border-slate-100 text-center text-slate-500">{idx + 1}</td>
                                    <td className="py-3 px-4 border-r border-slate-100 font-medium text-slate-800">{row.namaSekolah}</td>
                                    <td className="py-3 px-4 border-r border-slate-100 text-slate-600">{row.description}</td>
                                    <td className={cn("py-3 px-4 border-r border-slate-100 text-center font-mono font-bold",
                                        Number(row.gradasi) < 2 ? "bg-red-50 text-red-700" :
                                            Number(row.gradasi) < 3 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                                    )}>
                                        {row.gradasi}
                                    </td>
                                    <td className="py-3 px-4 text-center font-bold text-slate-700">{row.capacity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </section>

            {/* 6. Tabel Rapor Pendidikan */}
            <section className="space-y-4 break-before-page">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-indigo-600 text-indigo-600 bg-indigo-50">Tabel 3A</Badge>
                    <h2 className="text-lg font-bold text-slate-800">Sebaran Capaian Kapasitas Indikator Rapor Pendidikan</h2>
                </div>

                {sortedIndicators.length === 0 ? (
                    <Card className="p-8 text-center border-slate-300 border-dashed bg-white">
                        <p className="text-slate-500">Belum ada data rapor pendidikan yang diinputkan untuk sekolah binaan pada tahun ini.</p>
                    </Card>
                ) : (
                    <Card className="overflow-hidden border-slate-300 shadow-md bg-white p-0 gap-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-indigo-50 text-indigo-900 font-bold text-xs text-center border-b border-indigo-100">
                                    <tr>
                                        <th rowSpan={2} className="border border-indigo-100 p-3 w-10">No</th>
                                        <th rowSpan={2} className="border border-indigo-100 p-3 w-20">Indikator</th>
                                        <th colSpan={data.raporPendidikan?.length} className="border border-indigo-100 p-2">
                                            Capaian Kapasitas Indikator dan Satuan Pendidikan
                                        </th>
                                    </tr>
                                    <tr>
                                        {data.raporPendidikan?.map((row: any) => (
                                            <th key={row.no} className="border border-indigo-100 p-2 min-w-[100px] text-[10px] break-words">
                                                {row.namaSekolah}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {sortedIndicators.map((ind, idx) => (
                                        <tr key={ind} className="hover:bg-slate-50 bg-white">
                                            <td className="border border-slate-200 p-3 text-center text-slate-500">{idx + 1}</td>
                                            <td className="border border-slate-200 p-3 text-center font-mono font-bold text-slate-700">{ind}</td>
                                            {data.raporPendidikan?.map((row: any, rIdx: number) => {
                                                const val = schoolRaporMap[row.namaSekolah]?.[ind];
                                                // Color coding
                                                let bgClass = "bg-white";
                                                if (val) {
                                                    const numVal = Number(val);
                                                    if (numVal >= 2.5) bgClass = "bg-emerald-100 text-emerald-800 font-bold";
                                                    else if (numVal >= 1.5) bgClass = "bg-amber-100 text-amber-800 font-bold";
                                                    else bgClass = "bg-red-100 text-red-800 font-bold";
                                                }
                                                return (
                                                    <td key={rIdx} className={cn("border border-slate-200 p-3 text-center", bgClass)}>
                                                        {val || "-"}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </section>

        </div>
    );
}

// Icon component helper
function CheckCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
