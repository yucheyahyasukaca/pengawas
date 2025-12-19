"use client";

import { StepMetode } from "@/components/rencana/wizard/step-metode";

export default function MetodePage() {
    return (
        <StepMetode
            baseUrl="/pengawas/perencanaan/rencana-program/buat"
            mode="create"
        />
    );
}
