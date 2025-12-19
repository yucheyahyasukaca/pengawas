"use client";

import { StepDokumen } from "@/components/rencana/wizard/step-dokumen";
import { useParams } from "next/navigation";

export default function EditDokumenPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

    return (
        <StepDokumen
            baseUrl={`/pengawas/perencanaan/rencana-program/${id}/edit`}
            mode="edit"
            id={id}
        />
    );
}
