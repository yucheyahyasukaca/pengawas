import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json(
                { error: "Token dan password baru wajib diisi" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Password minimal 6 karakter" },
                { status: 400 }
            );
        }

        const secret = process.env.NEXTAUTH_SECRET || "default_jwt_secret_please_change_this_for_production";

        // 1. Verifikasi JWT token
        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (err: any) {
            if (err.name === "TokenExpiredError") {
                return NextResponse.json(
                    { error: "Tautan reset password telah kedaluwarsa. Silakan minta tautan baru." },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { error: "Token reset password tidak valid atau rusak." },
                { status: 400 }
            );
        }

        // 2. Pastikan intent token adalah reset password
        if (decoded.intent !== "reset-password" || !decoded.userId) {
            return NextResponse.json(
                { error: "Format token tidak valid" },
                { status: 400 }
            );
        }

        // 3. Update password via Supabase Admin Client 
        const adminClient = createSupabaseAdminClient();
        const { data, error } = await adminClient.auth.admin.updateUserById(
            decoded.userId,
            { password: newPassword }
        );

        if (error) {
            console.error("Gagal update password di Auth:", error);
            return NextResponse.json(
                { error: "Gagal menyimpan password baru. Akun mungkin tidak valid." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Password berhasil diperbarui." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Reset password API error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan sistem saat mencoba menyetel ulang password" },
            { status: 500 }
        );
    }
}
