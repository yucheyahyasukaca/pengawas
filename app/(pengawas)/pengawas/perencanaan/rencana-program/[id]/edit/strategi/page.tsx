"use client";

import { StepStrategi } from "@/components/rencana/wizard/step-strategi";
import { useParams } from "next/navigation";

export default function EditStrategiPage() {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

    return (
        <StepStrategi
            baseUrl={`/pengawas/perencanaan/rencana-program/${id}/edit`}
            mode="edit"
            id={id}
        />
    );
}
