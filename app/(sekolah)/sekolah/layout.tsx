import type { ReactNode } from "react";
import { SekolahLayout } from "@/components/sekolah/sekolah-layout";
import { SekolahUnauthorized } from "@/components/sekolah/sekolah-unauthorized";
import { getSekolahUser } from "@/lib/auth-utils";

type SekolahRouteLayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: "Panel Sekolah",
  description: "Kelola data profil sekolah dan informasi sekolah binaan.",
};

// Mark layout as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export default async function SekolahRouteLayout({ children }: SekolahRouteLayoutProps) {
  try {
    const currentUser = await getSekolahUser();

    console.log("Sekolah layout: Current user", {
      hasUser: !!currentUser,
      role: currentUser?.role,
      statusApproval: currentUser?.status_approval,
    });

    if (!currentUser) {
      console.log("Sekolah layout: No user found, showing unauthorized");
      return <SekolahUnauthorized />;
    }

    if (currentUser.role !== 'sekolah') {
      console.log("Sekolah layout: User is not sekolah, showing unauthorized");
      return <SekolahUnauthorized />;
    }

    // Check approval status - redirect to pending approval if not approved
    if (currentUser.status_approval !== 'approved') {
      console.log("Sekolah layout: User not approved, redirecting to pending-approval");
      // Note: We can't redirect in server component, so we'll let client handle it
      // The pending-approval page will check and show appropriate message
    }

    console.log("Sekolah layout: Rendering layout for sekolah user");
    return <SekolahLayout>{children}</SekolahLayout>;
  } catch (error) {
    console.error("Layout error:", error);
    return <SekolahLayout>{children}</SekolahLayout>;
  }
}

