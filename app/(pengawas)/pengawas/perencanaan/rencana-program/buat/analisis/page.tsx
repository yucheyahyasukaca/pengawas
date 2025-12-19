"use client";

import { StepAnalisis } from "@/components/rencana/wizard/step-analisis";

export default function AnalisisPage() {
    return (
        <StepAnalisis
            baseUrl="/pengawas/perencanaan/rencana-program/buat"
            mode="create"
        />
    );
}
