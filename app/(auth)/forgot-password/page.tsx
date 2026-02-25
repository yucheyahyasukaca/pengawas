import { Metadata } from "next";
import ForgotPasswordForm from "./forgot-password-form";

export const metadata: Metadata = {
    title: "Lupa Password | SIP MKPS",
    description: "Reset password akun Anda",
};

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Lupa Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Masukkan email Anda untuk menerima tautan reset password.
                    </p>
                </div>
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
