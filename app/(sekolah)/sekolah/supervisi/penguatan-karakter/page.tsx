"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Construction } from "lucide-react";

export default function PenguatanKarakterPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="rounded-full border-0 bg-gradient-to-r from-green-50 via-emerald-50/80 to-teal-50/60 text-green-700 hover:from-green-100 hover:via-emerald-100/90 hover:to-teal-100/70 hover:text-green-800 shadow-md shadow-green-200/30 hover:shadow-lg hover:shadow-green-300/40 transition-all duration-300 group"
        >
          <ArrowLeft className="size-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Button>
      </div>

      {/* Content */}
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50/80 to-teal-50/60 shadow-lg shadow-green-100/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
              <Heart className="size-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">Penguatan Karakter</CardTitle>
              <CardDescription className="text-slate-600">Halaman ini sedang dalam proses pengembangan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-6">
              <Construction className="size-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Halaman Sedang Dikembangkan</h3>
            <p className="text-slate-600 text-center max-w-md">
              Halaman ini sedang dalam proses pengembangan. Kami akan segera meluncurkan fitur ini dalam waktu dekat.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

