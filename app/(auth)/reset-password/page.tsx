import { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

export const metadata: Metadata = {
    title: "Setel Ulang Password | SIP MKPS",
    description: "Buat password baru akun Anda",
};

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Setel Ulang Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Pastikan password baru Anda kuat dan belum pernah dipakai sebelumnya.
                    </p>
                </div>
                <Suspense fallback={<div className="text-center text-sm text-gray-600">Loading form...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
