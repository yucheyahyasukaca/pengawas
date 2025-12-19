"use client";

import { StepAnalisis } from "@/components/rencana/wizard/step-analisis";
import { useParams } from "next/navigation";

export default function EditAnalisisPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

    return (
        <StepAnalisis
            baseUrl={`/pengawas/perencanaan/rencana-program/${id}/edit`}
            mode="edit"
            id={id}
        />
    );
}
