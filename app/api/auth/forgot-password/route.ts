import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import jwt from "jsonwebtoken";

const sesClient = new SESClient({
    region: process.env.AWS_REGION || "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
        }

        // 1. Cek apakah email terdaftar di database kita
        const adminClient = createSupabaseAdminClient();

        // Karena auth.users punya Supabase tidak bisa di-query biasa,
        // kita cek referensi data pengguna yang sinkron di public.users kita 
        // atau gunakan RPC auth.admin.getUserByEmail jika diizinkan. 
        // Di aplikasi ini, kita asumsikan 'users' table adalah sumber kebenaran data profil.
        const { data: userData, error: userError } = await adminClient
            .from("users")
            .select("id, role, nama")
            .eq("email", email.trim().toLowerCase())
            .single();

        if (userError || !userData) {
            // Return 200/sukses walau email tidak ada untuk mencegah data probing
            return NextResponse.json(
                { success: true, message: "Jika email valid, tautan telah dikirim." },
                { status: 200 }
            );
        }

        // 2. Generate token JWT stateless untuk reset password
        const secret = process.env.NEXTAUTH_SECRET || "default_jwt_secret_please_change_this_for_production";

        // Token berisi ID target, expire dalam 1 jam
        const token = jwt.sign(
            { userId: userData.id, email: email, intent: "reset-password" },
            secret,
            { expiresIn: "1h" }
        );

        // 3. Konfigurasi baseUrl untuk tautan
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
        const resetLink = `${baseUrl}/reset-password?token=${token}`;

        // 4. Kirim Email melalui AWS SES
        const senderEmail = process.env.AWS_SES_SENDER_EMAIL || "no-reply@sip-mkps.id";

        const sendEmailCommand = new SendEmailCommand({
            Source: senderEmail,
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Subject: {
                    Data: "Setel Ulang Password Akun SIP MKPS",
                    Charset: "UTF-8",
                },
                Body: {
                    Html: {
                        Data: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>Halo ${userData.nama || "Pengguna"},</h2>
                <p>Kami menerima permintaan untuk menyetel ulang password Anda di Sistem Informasi Pengawas (SIP MKPS).</p>
                <p>Silakan klik tombol di bawah ini untuk membuat password baru:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Setel Ulang Password</a>
                <p>Tautan ini hanya berlaku selama <strong>1 jam</strong>. Jika Anda tidak merasa melakukan permintaan ini, Anda bisa mengabaikan pesan ini. Akun Anda tetap aman.</p>
                <br>
                <p>Salam,<br>Tim SIP MKPS</p>
              </div>
            `,
                        Charset: "UTF-8",
                    },
                    Text: {
                        Data: `Halo ${userData.nama || "Pengguna"},\n\nKami menerima permintaan reset password. Buka tautan berikut untuk menyetel ulang: \n\n${resetLink}\n\nTautan ini valid selama 1 jam.`,
                        Charset: "UTF-8",
                    },
                },
            },
        });

        await sesClient.send(sendEmailCommand);

        return NextResponse.json(
            { success: true, message: "Tautan reset telah dikirim." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Forgot password API error:", error);
        return NextResponse.json(
            { error: "Gagal mengirim email reset password" },
            { status: 500 }
        );
    }
}
