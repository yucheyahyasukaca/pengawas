"use client";

import { StepMetode } from "@/components/rencana/wizard/step-metode";
import { useParams } from "next/navigation";

export default function EditMetodePage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

    return (
        <StepMetode
            baseUrl={`/pengawas/perencanaan/rencana-program/${id}/edit`}
            mode="edit"
            id={id}
        />
    );
}
