"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function SekolahProfileCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldBlock, setShouldBlock] = useState(false);

  useEffect(() => {
    checkApprovalStatus();
  }, [pathname]);

  const checkApprovalStatus = async () => {
    try {
      setIsChecking(true);
      const response = await fetch('/api/auth/get-current-user');
      
      if (!response.ok) {
        setIsChecking(false);
        return;
      }

      const data = await response.json();
      const user = data.user;

      if (!user || user.role !== 'sekolah') {
        setIsChecking(false);
        return;
      }

      const isPendingApprovalPage = pathname === '/sekolah/pending-approval';
      const isApproved = user.status_approval === 'approved';

      // If not approved and trying to access other pages, block and redirect
      if (!isApproved && !isPendingApprovalPage) {
        setShouldBlock(true);
        router.replace('/sekolah/pending-approval');
        return;
      }

      // If approved and on pending-approval page, redirect to dashboard
      if (isApproved && isPendingApprovalPage) {
        router.replace('/sekolah');
        return;
      }

      setShouldBlock(false);
      setIsChecking(false);
    } catch (error) {
      console.error("Error checking approval status:", error);
      setIsChecking(false);
    }
  };

  // Block rendering if not approved and not on pending-approval page
  if (shouldBlock || (isChecking && pathname !== '/sekolah/pending-approval')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center">
          <p className="text-sm text-slate-600">Memeriksa status...</p>
        </div>
      </div>
    );
  }

  return null;
}

