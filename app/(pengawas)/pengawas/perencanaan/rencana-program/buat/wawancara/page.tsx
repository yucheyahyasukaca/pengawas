"use client";

import { StepWawancara } from "@/components/rencana/wizard/step-wawancara";

export default function WawancaraPage() {
    return (
        <StepWawancara
            baseUrl="/pengawas/perencanaan/rencana-program/buat"
            mode="create"
        />
    );
}
