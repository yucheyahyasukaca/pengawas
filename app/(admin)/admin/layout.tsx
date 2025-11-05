import type { ReactNode } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminUnauthorized } from "@/components/admin/admin-unauthorized";
import { getAdminUser } from "@/lib/auth-utils";

type AdminRouteLayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: "Panel Admin",
  description: "Kelola agenda, berita, dan fitur SIP Kepengawasan.",
};

// Mark layout as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export default async function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  const adminUser = await getAdminUser();

  // Log for debugging in production
  if (process.env.NODE_ENV === 'production') {
    console.log('AdminRouteLayout:', {
      hasAdminUser: !!adminUser,
      adminUserEmail: adminUser?.email,
      adminUserRole: adminUser?.role,
    });
  }

  if (!adminUser) {
    console.warn('AdminRouteLayout: No admin user found, showing unauthorized');
    return <AdminUnauthorized />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}


