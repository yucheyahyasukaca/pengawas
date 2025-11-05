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
    // If getCurrentUser returns null, it might be because session is still being set
    // Let client-side components handle the redirect
    const currentUser = await getCurrentUser();

    console.log("Pengawas layout: Current user", {
      hasUser: !!currentUser,
      role: currentUser?.role,
      statusApproval: currentUser?.status_approval,
      hasNama: !!currentUser?.nama
    });

    // If no user found, still render layout
    // Client-side components will handle redirect to login if needed
    // This ensures sidebar, header, and footer are always visible
    if (!currentUser) {
      console.log("Pengawas layout: No user found, but rendering layout (client will handle redirect)");
      return <PengawasLayout>{children}</PengawasLayout>;
    }

    // Check if user is pengawas (regardless of approval status)
    if (currentUser.role !== 'pengawas') {
      console.log("Pengawas layout: User is not pengawas, showing unauthorized");
      return <PengawasUnauthorized />;
    }

    // Always render layout for pengawas users
    // The layout will always show, and client-side components (PengawasProfileCheck) 
    // will handle redirects for users who need to complete their profile or are pending approval
    // This ensures sidebar, header, and footer are always visible
    console.log("Pengawas layout: Rendering layout for pengawas user", {
      statusApproval: currentUser.status_approval,
      hasNama: !!currentUser.nama
    });
    return <PengawasLayout>{children}</PengawasLayout>;
  } catch (error) {
    console.error("Layout error:", error);
    // On error, still render layout - let client handle redirect
    // This ensures UI components are always available
    return <PengawasLayout>{children}</PengawasLayout>;
  }
}

