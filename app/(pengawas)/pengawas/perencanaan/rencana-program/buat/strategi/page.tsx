"use client";

import { StepStrategi } from "@/components/rencana/wizard/step-strategi";

export default function StrategiPage() {
    return (
        <StepStrategi
            baseUrl="/pengawas/perencanaan/rencana-program/buat"
            mode="create"
        />
    );
}
