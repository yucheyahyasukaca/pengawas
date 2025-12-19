"use client";

import { WizardHub } from "@/components/rencana/wizard/wizard-hub";
import { useParams } from "next/navigation";

export default function EditRencanaProgramPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  return (
    <WizardHub
      baseUrl={`/pengawas/perencanaan/rencana-program/${id}/edit`}
      mode="edit"
      id={id}
    />
  );
}
