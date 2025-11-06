"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

export default function PengaturanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-sm text-slate-600 mt-1">
          Preferensi tampilan dan integrasi sistem
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
              <User className="size-5 text-indigo-600" />
              Profil Pengguna
            </CardTitle>
            <CardDescription className="text-slate-700">
              Kelola informasi profil dan identitas pengawas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-indigo-100 bg-white p-4 text-center">
              <p className="text-sm text-slate-600 mb-4">
                Pengaturan profil akan dikembangkan lebih lanjut
              </p>
              <Button
                variant="outline"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
              >
                Edit Profil
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
              <Bell className="size-5 text-indigo-600" />
              Notifikasi
            </CardTitle>
            <CardDescription className="text-slate-700">
              Atur preferensi notifikasi dan pengingat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-indigo-100 bg-white p-4 text-center">
              <p className="text-sm text-slate-600 mb-4">
                Pengaturan notifikasi akan dikembangkan lebih lanjut
              </p>
              <Button
                variant="outline"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
              >
                Kelola Notifikasi
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
              <Shield className="size-5 text-indigo-600" />
              Keamanan
            </CardTitle>
            <CardDescription className="text-slate-700">
              Kelola keamanan akun dan kata sandi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-indigo-100 bg-white p-4 text-center">
              <p className="text-sm text-slate-600 mb-4">
                Pengaturan keamanan akan dikembangkan lebih lanjut
              </p>
              <Button
                variant="outline"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
              >
                Ubah Kata Sandi
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-indigo-200 bg-white shadow-md shadow-indigo-100/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
              <Palette className="size-5 text-indigo-600" />
              Tampilan
            </CardTitle>
            <CardDescription className="text-slate-700">
              Preferensi tema dan tampilan aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-indigo-100 bg-white p-4 text-center">
              <p className="text-sm text-slate-600 mb-4">
                Pengaturan tampilan akan dikembangkan lebih lanjut
              </p>
              <Button
                variant="outline"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
              >
                Ubah Tema
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

