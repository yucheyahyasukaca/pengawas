import type { ReactNode } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";

type AdminRouteLayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: "Panel Admin",
  description: "Kelola agenda, berita, dan fitur SIP Kepengawasan.",
};

export default function AdminRouteLayout({ children }: AdminRouteLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}


