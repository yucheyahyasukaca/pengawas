"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, School, Edit } from "lucide-react";

const dataPengawas = [
  {
    id: "peng-001",
    nama: "Dr. Ahmad Fauzi, M.Pd",
    nip: "196512151988031001",
    wilayah: "Kota Semarang",
    jumlahSekolah: 8,
    status: "Aktif",
  },
  {
    id: "peng-002",
    nama: "Drs. Budi Santoso, M.M",
    nip: "196803201990031002",
    wilayah: "Kabupaten Semarang",
    jumlahSekolah: 6,
    status: "Aktif",
  },
  {
    id: "peng-003",
    nama: "Siti Rahayu, S.Pd., M.Pd",
    nip: "197012251992032003",
    wilayah: "Kota Salatiga",
    jumlahSekolah: 5,
    status: "Aktif",
  },
];

export default function DataPengawasPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Pengawas</h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola data pengawas, NIP, wilayah tugas, dan jumlah sekolah binaan
          </p>
        </div>
        <Button className="rounded-full border-0 bg-indigo-600 px-6 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:text-white">
          <Edit className="size-4 mr-2" />
          Edit Profil
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dataPengawas.map((pengawas) => (
          <Card
            key={pengawas.id}
            className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70 transition hover:shadow-lg hover:shadow-indigo-200"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 text-white shadow-md">
                    <User className="size-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {pengawas.nama}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      NIP: {pengawas.nip}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="rounded-full border-0 bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {pengawas.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="size-4 text-indigo-500" />
                <span className="font-medium">Wilayah Tugas:</span>
                <span>{pengawas.wilayah}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <School className="size-4 text-indigo-500" />
                <span className="font-medium">Jumlah Sekolah Binaan:</span>
                <span className="font-bold text-indigo-600">{pengawas.jumlahSekolah}</span>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
              >
                Lihat Detail
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

