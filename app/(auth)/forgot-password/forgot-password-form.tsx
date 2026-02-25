"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Terjadi kesalahan sistem");
            }

            setIsSuccess(true);
            toast({
                title: "Tautan terkirim",
                description: "Silakan periksa kotak masuk email Anda untuk instruksi selanjutnya.",
            });
        } catch (error) {
            toast({
                title: "Gagal mengirim tautan",
                description: error instanceof Error ? error.message : "Terjadi kesalahan",
                variant: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Periksa Email Anda</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Kami telah mengirimkan tautan reset password ke <span className="font-semibold text-gray-900">{email}</span>.
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Tautan ini akan kedaluwarsa dalam 1 jam.
                    </p>
                </div>
                <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Kembali ke halaman Login
                </Link>
            </div>
        );
    }

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="email" className="sr-only">
                        Alamat Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        placeholder="Alamat Email Anda"
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-4 mt-6">
                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading || !email}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mengirim...
                        </>
                    ) : (
                        "Kirim Tautan Reset"
                    )}
                </Button>
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Login
                    </Link>
                </div>
            </div>
        </form>
    );
}
