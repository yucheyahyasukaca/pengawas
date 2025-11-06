"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";

export default function PengaturanPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkApprovalStatus();
  }, []);

  const checkApprovalStatus = async () => {
    try {
      const userResponse = await fetch('/api/auth/get-current-user');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        const currentUser = userData.user;
        
        // Check approval status - redirect if not approved
        if (currentUser && currentUser.role === 'sekolah') {
          if (currentUser.status_approval !== 'approved') {
            router.replace('/sekolah/pending-approval');
            return;
          }
        }
      }
    } catch (err) {
      console.error("Error checking approval:", err);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 animate-spin text-green-600" />
        <p className="text-sm text-slate-600">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola preferensi dan pengaturan akun sekolah
          </p>
        </div>
      </div>

      <Card className="border border-green-200 bg-white shadow-md shadow-green-100/70">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="size-5 text-green-600" />
            Pengaturan Akun
          </CardTitle>
          <CardDescription className="text-slate-600">
            Kelola pengaturan akun sekolah Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Fitur pengaturan akan tersedia segera.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

