import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

// Note: Tidak menggunakan edge runtime karena admin client memerlukan Node.js runtime
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
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // Trim email dan password
    email = email.trim();
    password = password.trim();

    // Validasi format email
    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Validasi env variables
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseServiceRoleKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
      return NextResponse.json(
        { error: "Konfigurasi server tidak lengkap" },
        { status: 500 }
      );
    }

    // Gunakan Admin Client untuk auto-confirm email
    const adminClient = createSupabaseAdminClient();
    
    // Signup user baru dengan auto-confirm email
    console.log("Attempting signup for:", email);
    
    const { data: signupData, error: signupError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email - langsung aktif tanpa konfirmasi
    });
    
    if (signupError) {
      console.error("Signup error:", signupError);
      
      let errorMessage = signupError.message;
      
      if (signupError.message.includes("already registered") || signupError.message.includes("already exists")) {
        errorMessage = "Email ini sudah terdaftar. Silakan login atau gunakan email lain.";
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          code: signupError.code,
        },
        { status: 400 }
      );
    }

    if (!signupData.user) {
      return NextResponse.json(
        { error: "Gagal membuat akun: Tidak ada data user yang dibuat" },
        { status: 400 }
      );
    }

    // Tunggu sebentar untuk memastikan trigger sudah berjalan
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update role menjadi 'pengawas' dan set status approval menjadi 'pending'
    // Gunakan admin client untuk update karena bisa bypass RLS
    // Note: Supabase akan otomatis handle casting ke tipe ENUM di database
    const { error: updateError } = await adminClient
      .from('users')
      .update({ 
        role: 'pengawas', // TypeScript hanya perlu string value, Supabase handle casting ke ENUM
        status_approval: 'pending'
      })
      .eq('id', signupData.user.id);

    if (updateError) {
      console.error("Update role error:", updateError);
      // Tidak gagalkan signup, tapi log error
      // User bisa update role nanti atau via admin
    }

    // Return success
    // Catatan: Karena menggunakan admin.createUser dengan email_confirm: true,
    // akun sudah langsung aktif dan bisa login tanpa konfirmasi email
    return NextResponse.json(
      { 
        success: true,
        message: "Registrasi berhasil! Akun Anda sudah aktif. Silakan login untuk melanjutkan.",
        user: {
          id: signupData.user.id,
          email: signupData.user.email,
        },
        emailConfirmed: true, // Akun sudah langsung terkonfirmasi
        redirectTo: "/auth/login"
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Signup exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}

