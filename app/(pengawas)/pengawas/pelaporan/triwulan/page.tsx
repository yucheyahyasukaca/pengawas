"use client";

import { JadwalPelaksanaanTable } from "@/components/pengawas/JadwalPelaksanaanTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function LaporanTriwulanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Laporan Triwulan</h1>
        <p className="text-sm text-slate-600 mt-1">
          Laporan pelaksanaan pendampingan dan supervisi per triwulan
        </p>
      </div>

      <JadwalPelaksanaanTable />
    </div>
  );
}
