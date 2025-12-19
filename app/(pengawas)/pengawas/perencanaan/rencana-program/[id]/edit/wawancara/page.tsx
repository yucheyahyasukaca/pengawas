"use client";

import { StepWawancara } from "@/components/rencana/wizard/step-wawancara";
import { useParams } from "next/navigation";

export default function EditWawancaraPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

    return (
        <StepWawancara
            baseUrl={`/pengawas/perencanaan/rencana-program/${id}/edit`}
            mode="edit"
            id={id}
        />
    );
}
