"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";

interface RencanaPendampingan {
    id: string;
    tanggal: string;
    sekolah_id: string;
    sekolah_nama: string;
    indikator_utama: string;
    akar_masalah: string;
    kegiatan_benahi: string;
    penjelasan_implementasi: string[];
    apakah_kegiatan: boolean;
    dokumentasi: string[];
    jumlah_jam: number;
}

interface UserProfile {
    nama: string;
    nip: string;
    jabatan: string;
    pangkat_golongan: string;
    wilayah_tugas: string;
}


const INDIKATOR_UTAMA = [
    { code: "A.1", label: "Kemampuan Literasi" },
    { code: "A.2", label: "Kemampuan Numerasi" },
    { code: "A.3", label: "Karakter" },
    { code: "C.3", label: "Pengalaman Pelatihan PTK" },
    { code: "D.1", label: "Kualitas Pembelajaran" },
    { code: "D.2", label: "Refleksi dan perbaikan pembelajaran oleh guru" },
    { code: "D.3", label: "Kepemimpinan instruksional" },
    { code: "D.4", label: "Iklim keamanan satuan pendidikan" },
    { code: "D.6", label: "Iklim Kesetaraan Gender" },
    { code: "D.8", label: "Iklim Kebinekaan" },
    { code: "D.10", label: "Iklim Inklusivitas" },
    { code: "E.1", label: "Partisipasi warga satuan pendidikan" },
    { code: "E.2", label: "Proporsi pemanfaatan sumber daya sekolah untuk peningkatan mutu" },
    { code: "E.3", label: "Pemanfaatan TIK untuk pengelolaan anggaran" },
    { code: "E.5", label: "Program dan kebijakan satuan pendidikan" },
];

const getIndikatorLabel = (code: string) => {
    const item = INDIKATOR_UTAMA.find((i) => i.code === code);
    return item ? item.label : code;
};

export function JadwalPelaksanaanTable() {
    const [rencanaList, setRencanaList] = useState<RencanaPendampingan[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedQuarter, setSelectedQuarter] = useState<string>(Math.ceil((new Date().getMonth() + 1) / 3).toString());

    // Edit State
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentRencana, setCurrentRencana] = useState<RencanaPendampingan | null>(null);
    const [editForm, setEditForm] = useState<{
        id: string;
        jumlah_jam: number;
        indikator_utama: string;
        akar_masalah: string;
        kegiatan_benahi: string;
        penjelasan_implementasi: string;
    }>({
        id: "",
        jumlah_jam: 2,
        indikator_utama: "",
        akar_masalah: "",
        kegiatan_benahi: "",
        penjelasan_implementasi: "",
    });

    const handleEdit = (rencana: RencanaPendampingan) => {
        setCurrentRencana(rencana);
        setEditForm({
            id: rencana.id,
            jumlah_jam: rencana.jumlah_jam || 2,
            indikator_utama: rencana.indikator_utama || "",
            akar_masalah: rencana.akar_masalah || "",
            kegiatan_benahi: rencana.kegiatan_benahi || "",
            penjelasan_implementasi: rencana.penjelasan_implementasi?.join("\n") || "",
        });
        setIsEditDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editForm.id) return;

        try {
            setIsSaving(true);
            const response = await fetch("/api/pengawas/rencana-pendampingan", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: editForm.id,
                    jumlah_jam: Number(editForm.jumlah_jam),
                    indikator_utama: editForm.indikator_utama,
                    akar_masalah: editForm.akar_masalah,
                    kegiatan_benahi: editForm.kegiatan_benahi,
                    penjelasan_implementasi: editForm.penjelasan_implementasi.split("\n").filter(item => item.trim() !== ""),
                    // Include other required fields from currentRencana to avoid validation errors if backend requires them
                    tanggal: currentRencana?.tanggal,
                    sekolah_id: currentRencana?.sekolah_id,
                    apakah_kegiatan: currentRencana?.apakah_kegiatan,
                    dokumentasi: currentRencana?.dokumentasi,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    toast({
                        title: "Berhasil",
                        description: "Data rencana pendampingan berhasil diperbarui.",
                        duration: 3000,
                    });

                    // Update local state
                    setRencanaList((prev) =>
                        prev.map((item) =>
                            item.id === editForm.id
                                ? {
                                    ...item,
                                    jumlah_jam: Number(editForm.jumlah_jam),
                                    indikator_utama: editForm.indikator_utama,
                                    akar_masalah: editForm.akar_masalah,
                                    kegiatan_benahi: editForm.kegiatan_benahi,
                                    penjelasan_implementasi: editForm.penjelasan_implementasi.split("\n").filter(item => item.trim() !== "")
                                }
                                : item
                        )
                    );
                    setIsEditDialogOpen(false);
                } else {
                    throw new Error(data.error || "Gagal menyimpan data");
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Gagal menyimpan data");
            }
        } catch (error: any) {
            toast({
                title: "Gagal",
                description: error.message || "Terjadi kesalahan saat menyimpan data.",
                duration: 3000,
            });
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch User Profile
                const userRes = await fetch("/api/auth/get-current-user");
                if (userRes.ok) {
                    const userData = await userRes.json();
                    if (userData.user) {
                        const metadata = userData.user.metadata || {};
                        setUserProfile({
                            nama: userData.user.nama || "-",
                            nip: userData.user.nip || "-",
                            jabatan: userData.user.jabatan || "Pengawas Ahli Madya",
                            pangkat_golongan: userData.user.pangkat_golongan || "Pembina Utama Muda/ IV c",
                            wilayah_tugas: metadata.wilayah_tugas || "Cabang Dinas Pendidikan Wil. III",
                        });
                    }
                }

                // Fetch Rencana Pendampingan
                const rencanaRes = await fetch("/api/pengawas/rencana-pendampingan");
                if (rencanaRes.ok) {
                    const rencanaData = await rencanaRes.json();
                    if (rencanaData.success && Array.isArray(rencanaData.rencanaPendampingan)) {
                        setRencanaList(rencanaData.rencanaPendampingan);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const { toast } = useToast();

    const handleExportExcel = () => {
        if (filteredRencanaList.length === 0) {
            toast({
                title: "Tidak ada data",
                description: "Silakan pilih tahun dan triwulan yang memiliki data.",
            });
            return;
        }

        // 1. Title & Identity Section
        const titleRow = ["PELAKSANAAN PROGRAM PENDAMPINGAN"];
        const emptyRow = [""];
        const identityRows = [
            ["Nama Pengawas", ":", userProfile?.nama || "-"],
            ["NIP", ":", userProfile?.nip || "-"],
            ["Pangkat/ Golongan", ":", userProfile?.pangkat_golongan || "-"],
            ["Jabatan", ":", userProfile?.jabatan || "-"],
            ["Wilayah", ":", userProfile?.wilayah_tugas || "-"],
            ["Triwulan", ":", selectedQuarter],
        ];

        // 2. Table Header
        const tableHeader = [
            "No",
            "Hari/Tanggal",
            "Tempat/Sekolah",
            "Indikator Utama",
            "Akar Masalah",
            "Kegiatan Benahi",
            "Penjelasan Implementasi",
            "Jumlah Jam (JP)"
        ];

        // 3. Table Data
        const tableData = filteredRencanaList.map((rencana, index) => {
            const date = new Date(rencana.tanggal);
            const formattedDate = format(date, "EEEE, dd MMMM yyyy", { locale: id });

            return [
                index + 1,
                formattedDate,
                rencana.sekolah_nama,
                getIndikatorLabel(rencana.indikator_utama) || "-",
                rencana.akar_masalah || "-",
                rencana.kegiatan_benahi || "-",
                rencana.penjelasan_implementasi?.join("; ") || "-",
                rencana.jumlah_jam || 2
            ];
        });

        // 4. Combine all rows
        const finalData = [
            titleRow,
            emptyRow,
            ...identityRows,
            emptyRow,
            tableHeader,
            ...tableData
        ];

        // 5. Create Worksheet
        const worksheet = utils.aoa_to_sheet(finalData);

        // 6. Column Widths
        // Calculate max width for sensitive columns
        const maxSchoolWidth = tableData.reduce((w, r) => Math.max(w, (r[2] as string).length), 15);
        const maxImplWidth = tableData.reduce((w, r) => Math.max(w, (r[6] as string).length), 20);

        worksheet["!cols"] = [
            { wch: 5 },  // No
            { wch: 25 }, // Hari/Tanggal
            { wch: Math.min(maxSchoolWidth + 5, 40) }, // Sekolah
            { wch: 15 }, // Indikator
            { wch: 20 }, // Akar Masalah
            { wch: 20 }, // Kegiatan
            { wch: Math.min(maxImplWidth + 5, 50) }, // Penjelasan
            { wch: 10 }  // JP
        ];

        // 7. Create Workbook & Export
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Laporan Triwulan");

        const filename = `Laporan_Triwulan_${selectedQuarter}_Tahun_${selectedYear}.xlsx`;
        writeFile(workbook, filename);

        toast({
            title: "Download Berhasil",
            description: `File ${filename} berhasil diunduh.`,
            duration: 3000,
        });
    };

    if (isLoading) {
        return (
            <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
                <CardContent className="flex items-center justify-center py-10">
                    <Loader2 className="size-8 animate-spin text-indigo-600" />
                    <span className="ml-2 text-slate-600">Memuat data pelaksanaan...</span>
                </CardContent>
            </Card>
        );
    }

    // Filter Logic
    const filteredRencanaList = rencanaList.filter((rencana) => {
        const date = new Date(rencana.tanggal);
        const year = date.getFullYear().toString();
        const month = date.getMonth() + 1;
        const quarter = Math.ceil(month / 3).toString();

        return year === selectedYear && quarter === selectedQuarter;
    });

    // Generate Year Options (e.g., current year - 1 to current year + 1)
    const currentYearInt = new Date().getFullYear();
    const yearOptions = [currentYearInt - 1, currentYearInt, currentYearInt + 1].map(String);

    return (
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 print:shadow-none print:border-0">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
                <div>
                    <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
                        <FileText className="size-5 text-indigo-600" />
                        Jadwal Pelaksanaan Pendampingan
                    </CardTitle>
                    <CardDescription className="text-slate-700">
                        Filter berdasarkan Tahun dan Triwulan
                    </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[100px] border-slate-300 bg-white text-slate-900 focus:ring-indigo-500">
                            <SelectValue placeholder="Tahun" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {yearOptions.map((year) => (
                                <SelectItem key={year} value={year} className="text-slate-700 focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                        <SelectTrigger className="w-[120px] border-slate-300 bg-white text-slate-900 focus:ring-indigo-500">
                            <SelectValue placeholder="Triwulan" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="1" className="text-slate-700 focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">Triwulan 1</SelectItem>
                            <SelectItem value="2" className="text-slate-700 focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">Triwulan 2</SelectItem>
                            <SelectItem value="3" className="text-slate-700 focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">Triwulan 3</SelectItem>
                            <SelectItem value="4" className="text-slate-700 focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">Triwulan 4</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleExportExcel} className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20">
                        <FileSpreadsheet className="size-4" />
                        Export Excel
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0 sm:p-6 print:p-0">
                <div className="w-full overflow-x-auto print:overflow-visible">
                    <div className="bg-white p-4 sm:p-8 min-w-[800px] print:min-w-0">
                        {/* Header Section mimicking the print layout */}
                        <div className="mb-8 text-center print:mb-4">
                            <h2 className="text-lg font-bold uppercase text-black">PELAKSANAAN PROGRAM PENDAMPINGAN</h2>
                        </div>

                        <div className="grid grid-cols-[160px_10px_1fr] gap-y-1 mb-6 text-sm text-black print:mb-4">
                            <div>Nama Pengawas</div>
                            <div>:</div>
                            <div className="font-medium">{userProfile?.nama}</div>

                            <div>NIP</div>
                            <div>:</div>
                            <div>{userProfile?.nip}</div>

                            <div>Pangkat/ Golongan</div>
                            <div>:</div>
                            <div>{userProfile?.pangkat_golongan}</div>

                            <div>Jabatan</div>
                            <div>:</div>
                            <div>{userProfile?.jabatan}</div>

                            <div>Wilayah</div>
                            <div>:</div>
                            <div>{userProfile?.wilayah_tugas}</div>

                            <div>Triwulan</div>
                            <div>:</div>
                            <div>{selectedQuarter}</div>
                        </div>

                        <div className="border border-black">
                            <Table className="w-full border-collapse">
                                <TableHeader>
                                    <TableRow className="border-b border-black hover:bg-transparent">
                                        <TableHead className="w-[50px] border-r border-black text-center font-bold text-black bg-gray-100 p-2 h-auto align-middle">No.</TableHead>
                                        <TableHead className="w-[120px] border-r border-black text-center font-bold text-black bg-gray-100 p-2 h-auto align-middle">Hari/<br />Tanggal</TableHead>
                                        <TableHead className="w-[150px] border-r border-black text-center font-bold text-black bg-gray-100 p-2 h-auto align-middle">Tempat/<br />Sekolah</TableHead>
                                        <TableHead className="border-r border-black text-center font-bold text-black bg-gray-100 p-2 h-auto align-middle">Indikator<br />Utama</TableHead>
                                        <TableHead className="border-r border-black text-center font-bold text-black bg-gray-100 p-2 h-auto align-middle">Akar Masalah</TableHead>
                                        <TableHead className="border-r border-black text-center font-bold text-black bg-gray-100 p-2 h-auto align-middle">Kegiatan /<br />Kegiatan<br />Benahi</TableHead>
                                        <TableHead className="border-r border-black text-center font-bold text-black bg-gray-100 p-2 h-auto align-middle">Penjelasan<br />Kegiatan/<br />Implementasi</TableHead>
                                        <TableHead className="w-[80px] text-center font-bold text-black bg-gray-100 p-2 h-auto align-middle">Jumlah Jam<br />(JP)</TableHead>
                                        <TableHead className="w-[80px] text-center font-bold text-black bg-gray-100 p-2 h-auto align-middle print:hidden">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRencanaList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-slate-500 border-r border-black">
                                                Belum ada rencana pendampingan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredRencanaList.map((rencana, index) => {
                                            const date = new Date(rencana.tanggal);
                                            const formattedDate = format(date, "EEEE, dd MMMM yyyy", { locale: id });
                                            // Split date for layout: "Senin," on one line, "09 Februari" on next, "2026" on next
                                            const dayName = format(date, "EEEE,", { locale: id });
                                            const dateMonth = format(date, "dd MMMM", { locale: id });
                                            const yearStr = format(date, "yyyy", { locale: id });

                                            return (
                                                <TableRow key={rencana.id} className="border-b border-black hover:bg-transparent">
                                                    <TableCell className="border-r border-black text-center align-top p-2 text-black">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="border-r border-black align-top p-2 text-black text-center">
                                                        <div>{dayName}</div>
                                                        <div>{dateMonth}</div>
                                                        <div>{yearStr}</div>
                                                    </TableCell>
                                                    <TableCell className="border-r border-black align-top p-2 text-black">
                                                        {rencana.sekolah_nama}
                                                    </TableCell>
                                                    <TableCell className="border-r border-black align-top p-2 text-black">
                                                        {getIndikatorLabel(rencana.indikator_utama) || "-"}
                                                    </TableCell>
                                                    <TableCell className="border-r border-black align-top p-2 text-black">
                                                        {rencana.akar_masalah || "-"}
                                                    </TableCell>
                                                    <TableCell className="border-r border-black align-top p-2 text-black">
                                                        {rencana.kegiatan_benahi || "-"}
                                                    </TableCell>
                                                    <TableCell className="border-r border-black align-top p-2 text-black">
                                                        {rencana.penjelasan_implementasi && rencana.penjelasan_implementasi.length > 0 ? (
                                                            <ul className="list-disc pl-4 space-y-1">
                                                                {rencana.penjelasan_implementasi.map((item, idx) => (
                                                                    <li key={idx}>{item}</li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="align-top p-2 text-black text-center">
                                                        {rencana.jumlah_jam || 2} JP
                                                    </TableCell>
                                                    <TableCell className="align-top p-2 text-center print:hidden">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                                                            onClick={() => handleEdit(rencana)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </CardContent>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900">Edit Rencana Pendampingan</DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Sesuaikan data rencana pendampingan dan jumlah jam pelaksanaan.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="jumlah_jam" className="text-left sm:text-right text-slate-700 font-medium">
                                Jumlah Jam (JP)
                            </Label>
                            <div className="sm:col-span-3">
                                <Input
                                    id="jumlah_jam"
                                    type="number"
                                    min={1}
                                    value={editForm.jumlah_jam}
                                    onChange={(e) => setEditForm({ ...editForm, jumlah_jam: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-white border-slate-300 text-slate-900 focus-visible:ring-indigo-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Masukkan estimasi jumlah jam pelajaran (JP).</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="indikator" className="text-left sm:text-right text-slate-700 font-medium">
                                Indikator Utama
                            </Label>
                            <div className="sm:col-span-3">
                                <Select
                                    value={editForm.indikator_utama}
                                    onValueChange={(value) => setEditForm({ ...editForm, indikator_utama: value })}
                                >
                                    <SelectTrigger className="w-full bg-white border-slate-300 text-slate-900 focus:ring-indigo-500">
                                        <SelectValue placeholder="Pilih Indikator" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white max-h-[200px]">
                                        {INDIKATOR_UTAMA.map((item) => (
                                            <SelectItem key={item.code} value={item.code} className="text-slate-700 focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
                                                {item.code} - {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="akar_masalah" className="text-left sm:text-right text-slate-700 font-medium">
                                Akar Masalah
                            </Label>
                            <Textarea
                                id="akar_masalah"
                                value={editForm.akar_masalah}
                                onChange={(e) => setEditForm({ ...editForm, akar_masalah: e.target.value })}
                                className="sm:col-span-3 bg-white border-slate-300 text-slate-900 focus-visible:ring-indigo-500"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="kegiatan_benahi" className="text-left sm:text-right text-slate-700 font-medium">
                                Kegiatan Benahi
                            </Label>
                            <Textarea
                                id="kegiatan_benahi"
                                value={editForm.kegiatan_benahi}
                                onChange={(e) => setEditForm({ ...editForm, kegiatan_benahi: e.target.value })}
                                className="sm:col-span-3 bg-white border-slate-300 text-slate-900 focus-visible:ring-indigo-500"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                            <Label htmlFor="implementasi" className="text-left sm:text-right text-slate-700 font-medium">
                                Penjelasan Implementasi
                            </Label>
                            <div className="sm:col-span-3">
                                <Textarea
                                    id="implementasi"
                                    value={editForm.penjelasan_implementasi}
                                    onChange={(e) => setEditForm({ ...editForm, penjelasan_implementasi: e.target.value })}
                                    className="bg-white border-slate-300 text-slate-900 focus-visible:ring-indigo-500"
                                    rows={5}
                                />
                                <p className="text-xs text-slate-500 mt-1">Gunakan baris baru untuk memisahkan poin-poin penjelasan.</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={isSaving}
                            className="w-full sm:w-auto rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:text-slate-900 transition-all"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full sm:w-auto rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan Perubahan"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card >
    );
}
