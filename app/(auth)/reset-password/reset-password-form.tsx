"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            toast({
                title: "Token tidak valid",
                description: "Tautan reset password tidak valid atau telah kedaluwarsa.",
                variant: "error",
            });
            // Berikan waktu sejenak agar user bisa membaca toast jika diperlukan
            setTimeout(() => {
                // Uncomment ini bila anda ingin redirect ke home kalau gak ada token
                // router.push("/"); 
            }, 3000);
        }
    }, [token, toast, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Password tidak cocok",
                description: "Pastikan password konfirmasi sama persis.",
                variant: "error",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Password terlalu pendek",
                description: "Password minimal 6 karakter.",
                variant: "error",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gagal mengatur ulang password");
            }

            setIsSuccess(true);
            toast({
                title: "Password Berhasil Diubah",
                description: "Silakan login menggunakan password baru Anda.",
            });

            // Redirect otomatis ke halaman login
            setTimeout(() => {
                router.push("/");
            }, 5000);

        } catch (error) {
            toast({
                title: "Gagal menyetel ulang",
                description: error instanceof Error ? error.message : "Terjadi kesalahan",
                variant: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Tautan Tidak Valid</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Tautan setel ulang password Anda tidak valid. Silakan memintanya kembali dari awal.
                    </p>
                </div>
                <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Minta Tautan Baru
                </Link>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Sukses Disetel Ulang!</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Password Anda berhasil diperbarui. Anda akan segera diarahkan ke halaman utama.
                    </p>
                </div>
                <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Lanjut ke Login Sekarang
                </Link>
            </div>
        );
    }

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="password">Password Baru</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1"
                        placeholder="Min. 6 Karakter"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                    <Input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mt-1"
                        placeholder="Tulis Ulang Password"
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-4 mt-6">
                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading || !password || !confirmPassword}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyetel...
                        </>
                    ) : (
                        "Simpan Password Baru"
                    )}
                </Button>
            </div>
        </form>
    );
}
