"use client";

import { WizardHub } from "@/components/rencana/wizard/wizard-hub";

export default function BuatRencanaProgramPage() {
  return (
    <WizardHub
      baseUrl="/pengawas/perencanaan/rencana-program/buat"
      mode="create"
    />
  );
}
