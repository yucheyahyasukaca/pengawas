import type { ReactNode } from "react";
import { PengawasLayout } from "@/components/pengawas/pengawas-layout";
import { PengawasUnauthorized } from "@/components/pengawas/pengawas-unauthorized";
import { getCurrentUser } from "@/lib/auth-utils";

type PengawasRouteLayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: "Panel Pengawas",
  description: "Kelola data sekolah binaan, perencanaan, pelaksanaan, dan pelaporan kepengawasan.",
};

// Mark layout as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export default async function PengawasRouteLayout({ children }: PengawasRouteLayoutProps) {
  try {
    // Get current user (tidak hanya approved pengawas)
    const currentUser = await getCurrentUser();

    console.log("Pengawas layout: Current user", {
      hasUser: !!currentUser,
      role: currentUser?.role,
      statusApproval: currentUser?.status_approval,
      hasNama: !!currentUser?.nama
    });

    // Check if user is pengawas (regardless of approval status)
    if (!currentUser || currentUser.role !== 'pengawas') {
      console.log("Pengawas layout: User is not pengawas, showing unauthorized");
      return <PengawasUnauthorized />;
    }

    // For approved pengawas with complete profile, wrap with full layout
    // For pending/rejected or incomplete profile, render without layout
    // Client-side components will handle redirects to appropriate pages
    if (currentUser.status_approval === 'approved' && currentUser.nama) {
      console.log("Pengawas layout: User is approved, showing full layout");
      return <PengawasLayout>{children}</PengawasLayout>;
    }

    // For pending/rejected or incomplete profile, render without layout
    // These pages (pending-approval, lengkapi-profil) have their own full-screen layout
    // This allows access to pending-approval and lengkapi-profil pages
    console.log("Pengawas layout: User is pending/incomplete, rendering children without layout");
    return <>{children}</>;
  } catch (error) {
    console.error("Layout error:", error);
    return <PengawasUnauthorized />;
  }
}

