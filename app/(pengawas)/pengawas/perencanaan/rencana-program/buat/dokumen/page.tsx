"use client";

import { StepDokumen } from "@/components/rencana/wizard/step-dokumen";

export default function DokumenPage() {
    return (
        <StepDokumen
            baseUrl="/pengawas/perencanaan/rencana-program/buat"
            mode="create"
        />
    );
}
