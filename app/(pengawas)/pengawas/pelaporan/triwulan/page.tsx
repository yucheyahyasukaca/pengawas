"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Filter, FileSpreadsheet, RefreshCcw } from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";

const QUARTERS = [
  { id: "1", label: "Triwulan I (Januari - Maret)" },
  { id: "2", label: "Triwulan II (April - Juni)" },
  { id: "3", label: "Triwulan III (Juli - September)" },
  { id: "4", label: "Triwulan IV (Oktober - Desember)" },
];

export default function LaporanTriwulanPage() {
  const { toast } = useToast();
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [quarter, setQuarter] = useState<string>("1"); // Default Q1
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const month = new Date().getMonth();
    const currentQ = Math.floor(month / 3) + 1;
    setQuarter(currentQ.toString());
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pengawas/laporan/triwulan?year=${year}&quarter=${quarter}`);
      if (!res.ok) throw new Error("Gagal memuat data");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Gagal memuat laporan triwulan",
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/pengawas/laporan/triwulan?year=${year}&quarter=${quarter}`);
        if (!res.ok) throw new Error("Gagal memuat data");
        const json = await res.json();
        if (!ignore) setData(json);
      } catch (error) {
        console.error(error);
        if (!ignore) {
          toast({
            title: "Error",
            description: "Gagal memuat laporan triwulan",
            variant: "error"
          });
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();

    return () => { ignore = true; };
  }, [year, quarter]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleExport = () => {
    if (!data) return;

    const wb = XLSX.utils.book_new();

    // Helper to join items with newline
    const joinItems = (items: any[], key: string) => items.map(i => i[key]).join("\n");

    const headerInfo = [
      ["PERENCANAAN PENDAMPINGAN SATUAN PENDIDIKAN"],
      [`PERIODE : ${QUARTERS.find(q => q.id === quarter)?.label} ${year}`],
      [],
      ["Nama Pengawas", data.pengawas?.nama],
      ["NIP", `'${data.pengawas?.nip}`],
      ["Jabatan", data.pengawas?.jabatan],
      ["Pangkat/Gol", data.pengawas?.pangkat],
      [],
      ["Strategi Pendampingan", data.summary?.strategi.join(", ")],
      ["Metode Pendampingan", data.summary?.metode.join(", ")],
      ["Prioritas Pendampingan", data.summary?.prioritas.join(", ")],
      [],
      // Activity Section
      ["TEMPAT DAN TANGGAL", data.activities?.month1?.label, data.activities?.month2?.label, data.activities?.month3?.label],
      ["Tempat", joinItems(data.activities?.month1?.items || [], 'place'), joinItems(data.activities?.month2?.items || [], 'place'), joinItems(data.activities?.month3?.items || [], 'place')],
      ["Tanggal Kegiatan", joinItems(data.activities?.month1?.items || [], 'date'), joinItems(data.activities?.month2?.items || [], 'date'), joinItems(data.activities?.month3?.items || [], 'date')],
      [],
      ["NO", "NPSN", "NAMA SEKOLAH", "KOMITMEN PERUBAHAN", "PENENTUAN STRATEGI", "DOKUMEN RENCANA"]
    ];

    const bodyRows = data.rows.map((row: any, idx: number) => [
      idx + 1,
      row.npsn,
      row.namaSekolah,
      row.komitmen,
      row.strategi,
      row.dokumen
    ]);

    const finalData = [...headerInfo, ...bodyRows];
    const ws = XLSX.utils.aoa_to_sheet(finalData);

    ws['!cols'] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 30 },
      { wch: 20 },
      { wch: 30 },
      { wch: 30 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Laporan Triwulan");
    XLSX.writeFile(wb, `Laporan_Triwulan_${year}_Q${quarter}.xlsx`);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600 size-10" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-[1400px] p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Pelaporan Triwulan</h1>
          <p className="text-slate-500">Rekapitulasi rencana pendampingan satuan pendidikan.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-10 w-[100px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none"
            >
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              className="h-10 w-[240px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none"
            >
              {QUARTERS.map(q => (
                <option key={q.id} value={q.id}>{q.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            size="icon"
            className="shrink-0 bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCcw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button onClick={handleExport} className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm gap-2 font-medium">
            <FileSpreadsheet className="size-4" /> Export Excel
          </Button>
        </div>
      </div>

      {!data || data.rows.length === 0 ? (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            {loading ? (
              <>
                <Loader2 className="animate-spin text-indigo-600 size-10 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">Sedang memuat data...</h3>
                <p className="text-slate-500 max-w-sm mt-1">
                  Mohon tunggu sebentar.
                </p>
              </>
            ) : (
              <>
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <Filter className="size-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Belum ada data</h3>
                <p className="text-slate-500 max-w-sm mt-1">
                  Tidak ditemukan rencana program terbit untuk periode ini.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Header Info Card */}
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden text-slate-900">
            <div className="bg-slate-900 text-white px-6 py-4 text-center">
              <h2 className="text-lg font-bold uppercase tracking-wide">
                PERENCANAAN PENDAMPINGAN SATUAN PENDIDIKAN
              </h2>
              <p className="text-blue-200 text-sm mt-1 uppercase opacity-90">
                {QUARTERS.find(q => q.id === quarter)?.label.toUpperCase()} {year}
              </p>
            </div>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 space-y-4 border-b md:border-b-0 md:border-r border-slate-200">
                  <InfoRow label="Nama Pengawas" value={data.pengawas?.nama} />
                  <InfoRow label="NIP" value={data.pengawas?.nip} />
                  <InfoRow label="Pangkat / Gol" value={data.pengawas?.pangkat || "-"} />
                  <InfoRow label="Jabatan" value={data.pengawas?.jabatan} />
                </div>
                <div className="p-6 space-y-4 bg-slate-50">
                  <InfoRow label="Strategi Pendampingan" value={data.summary.strategi.join(", ") || "-"} />
                  <InfoRow label="Metode Pendampingan" value={data.summary.metode.join(", ") || "-"} />
                  <InfoRow label="Prioritas" value={data.summary.prioritas.join(", ") || "-"} />
                </div>
              </div>

              {/* Activities / Tempat & Tanggal Section */}
              <div className="border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  <div className="p-4 bg-slate-100 font-semibold text-slate-700 flex items-center justify-center text-center">
                    TEMPAT DAN TANGGAL
                  </div>
                  <ActivityColumn
                    label={data.activities?.month1?.label || "BULAN I"}
                    items={data.activities?.month1?.items}
                  />
                  <ActivityColumn
                    label={data.activities?.month2?.label || "BULAN II"}
                    items={data.activities?.month2?.items}
                  />
                  <ActivityColumn
                    label={data.activities?.month3?.label || "BULAN III"}
                    items={data.activities?.month3?.items}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="py-4 px-6 font-semibold text-slate-700 w-16 text-center">NO.</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 w-32">NPSN</th>
                  <th className="py-4 px-6 font-semibold text-slate-700">NAMA SEKOLAH</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 w-48">KOMITMEN PERUBAHAN</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 w-64">PENENTUAN STRATEGI</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 w-64">DOKUMEN RENCANA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.rows.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-center text-slate-500 font-medium">{idx + 1}</td>
                    <td className="py-4 px-6 text-slate-600 font-mono">{row.npsn}</td>
                    <td className="py-4 px-6 font-medium text-slate-900">{row.namaSekolah}</td>
                    <td className="py-4 px-6 text-slate-700 bg-yellow-50/30">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {row.komitmen}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-700">{row.strategi}</td>
                    <td className="py-4 px-6 text-slate-500 italic">{row.dokumen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {data.rows.map((row: any, idx: number) => (
              <Card key={idx} className="bg-white border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center size-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-xs text-slate-500">{row.npsn}</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                    {row.komitmen}
                  </span>
                </div>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{row.namaSekolah}</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Strategi</p>
                      <p className="text-slate-700">{row.strategi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Dokumen</p>
                      <p className="text-slate-600 italic text-sm">{row.dokumen}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-1">
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      <span className="text-sm text-slate-900 font-semibold sm:col-span-2 md:col-span-1 xl:col-span-2">{value}</span>
    </div>
  );
}

function ActivityColumn({ label, items }: { label: string, items: any[] }) {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase text-center">
        {label}
      </div>
      <div className="p-4 space-y-4 flex-1 bg-slate-50/50">
        <div className="space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Tempat</p>
          {items && items.length > 0 ? (
            items.map((item, idx) => (
              <p key={idx} className="text-sm text-slate-900">{item.place}</p>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">-</p>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Tanggal Kegiatan</p>
          {items && items.length > 0 ? (
            items.map((item, idx) => (
              <p key={idx} className="text-sm text-slate-900">{item.date}</p>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">-</p>
          )}
        </div>
      </div>
    </div>
  );
}
