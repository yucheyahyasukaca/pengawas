"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculateLevels, getStrategy, METHOD_OPTIONS } from "@/lib/rencana-utils";
import { DokumenPrintView } from "@/components/rencana/dokumen-print-view";

interface School {
  id: string;
  nama: string;
  npsn: string;
}

export default function ViewRencanaProgramPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rencanaProgram, setRencanaProgram] = useState<any>(null);
  const [schools, setSchools] = useState<School[]>([]);

  // Derived state
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedMethodDetails, setSelectedMethodDetails] = useState<any[]>([]);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    const fetchData = async () => {
      try {
        // 1. Fetch Rencana Program
        const response = await fetch(`/api/pengawas/rencana-program/${id}`);
        if (!response.ok) throw new Error("Gagal memuat dokumen");
        const { rencanaProgram: data } = await response.json();

        if (!data) throw new Error("Dokumen tidak ditemukan");
        setRencanaProgram(data);

        // 2. Calculate Analysis (Step 2 Logic)
        const formData = data.form_data || {};
        if (formData.selectedAnswers) {
          const { reflectionLevel, capacityLevel } = calculateLevels(formData.selectedAnswers);
          const strategy = getStrategy(reflectionLevel, capacityLevel);
          setAnalysisResult(strategy);
        }

        // 3. Get Method Detail (Step 4 Logic) - Handle Multiple
        if (formData.selectedMethods && Array.isArray(formData.selectedMethods)) {
          const methods = formData.selectedMethods
            .map((mid: string) => METHOD_OPTIONS.find(m => m.id === mid))
            .filter(Boolean);
          setSelectedMethodDetails(methods);
        } else if (formData.selectedMethod) {
          const method = METHOD_OPTIONS.find(m => m.id === formData.selectedMethod);
          if (method) setSelectedMethodDetails([method]);
        }

        // 4. Fetch Schools
        // Note: The API returns `sekolah_ids` which might be string or array
        let sekolahIds = data.sekolah_ids;
        if (typeof sekolahIds === "string") {
          try {
            sekolahIds = JSON.parse(sekolahIds);
          } catch (e) {
            sekolahIds = [];
          }
        }

        if (Array.isArray(sekolahIds) && sekolahIds.length > 0) {
          try {
            const schoolsRes = await fetch(`/api/sekolah/list?ids=${sekolahIds.join(',')}`);
            if (schoolsRes.ok) {
              const { sekolah } = await schoolsRes.json();
              const mappedSchools = (sekolah || []).map((s: any) => ({
                id: s.id,
                nama: s.nama_sekolah,
                npsn: s.npsn
              }));
              setSchools(mappedSchools);
            }
          } catch (e) {
            console.error("Failed to fetch schools", e);
          }
        }

      } catch (error) {
        console.error("Error loading view data", error);
        toast({
          title: "Error",
          description: "Gagal memuat dokumen",
          variant: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id, toast]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-20 flex justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!rencanaProgram || !analysisResult) {
    return (
      <div className="container mx-auto max-w-4xl py-20 flex flex-col items-center gap-4 text-center">
        <p className="text-slate-500">Dokumen tidak ditemukan atau data belum lengkap.</p>
        <Button onClick={() => router.push("/pengawas/perencanaan/rencana-program")}>
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header/Nav for View Page */}
      <div className="print:hidden">
        <div className="container mx-auto max-w-[1400px] py-4 px-4 sm:px-6">
          <Button
            variant="ghost"
            className="-ml-3 text-slate-600 hover:text-slate-900"
            onClick={() => router.push("/pengawas/perencanaan/rencana-program")}
          >
            <ArrowLeft className="size-4 mr-2" /> Kembali ke Dashboard
          </Button>
        </div>
      </div>

      <DokumenPrintView
        analysisResult={analysisResult}
        selectedMethodDetails={selectedMethodDetails}
        schools={schools}
      // No action buttons for View Mode unless we want 'Export PDF' redundant with Print
      />
    </div>
  );
}

