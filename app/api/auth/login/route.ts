export const runtime = 'edge';

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";


// List email admin yang diizinkan untuk login sebagai admin
const ADMIN_EMAILS = [
  "mkps@garuda-21.com",
  "admin@sip-mkps.id",
  // Tambahkan email admin lainnya di sini
];

function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.some(adminEmail => 
    email.toLowerCase() === adminEmail.toLowerCase()
  );
}

export async function POST(request: Request) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return NextResponse.json(
        { error: "Format request tidak valid. Pastikan mengirim JSON dengan email dan password." },
        { status: 400 }
      );
    }

    let { email, password } = body;

    // Validasi input
    if (!email || !password) {
      console.error("Missing credentials:", { email: !!email, password: !!password });
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // Trim email dan password untuk menghilangkan whitespace
    email = email.trim();
    password = password.trim();

    // Validasi format email sederhana
    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Validasi env variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables:", {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
      });
      return NextResponse.json(
        { error: "Konfigurasi server tidak lengkap. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diisi di .env.local" },
        { status: 500 }
      );
    }

    // Buat Supabase client tanpa SSR untuk route handler
    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          persistSession: false,
        },
      }
    );
    
    // Login dengan email dan password (sudah di-trim)
    console.log("Attempting login for:", email);
    console.log("Email length:", email.length);
    console.log("Password length:", password.length);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log("Login result:", { 
      hasUser: !!data?.user, 
      hasSession: !!data?.session, 
      hasError: !!error,
      errorCode: error?.code,
      errorMessage: error?.message,
      userEmail: data?.user?.email
    });

    if (error) {
      console.error("Login error details:", {
        message: error.message,
        code: error.code,
        status: error.status,
      });
      
      // Pesan error yang lebih informatif
      let errorMessage = error.message;
      
      if (error.code === 'invalid_credentials' || error.message === "Invalid login credentials") {
        errorMessage = `Email atau kata sandi salah. Pastikan:
- Email: ${email}
- Akun sudah terdaftar dan di-confirm di Supabase
- Password benar (case-sensitive)`;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          code: error.code,
        },
        { status: 400 }
      );
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: "Gagal masuk: Tidak ada session yang dibuat" },
        { status: 400 }
      );
    }

    // Deteksi role berdasarkan email
    const isAdmin = isAdminEmail(data.user.email || "");
    
    // Return session tokens untuk client-side handling
    return NextResponse.json(
      { 
        success: true, 
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
        role: isAdmin ? "admin" : "pengawas",
        redirectTo: isAdmin ? "/admin" : "/dashboard"
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  }
}
