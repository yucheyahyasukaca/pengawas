import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, sekolah_id } = body;

    // Validasi
    if (!email || !password || !sekolah_id) {
      return NextResponse.json(
        { error: "Email, password, dan sekolah harus diisi" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Use admin client to create user
    const adminClient = createSupabaseAdminClient();

    console.log("Attempting signup for sekolah:", email);
    
    const { data: signupData, error: signupError } = await adminClient.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true, // Auto-confirm email
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

    // Update role menjadi 'sekolah' dan set status approval menjadi 'pending'
    // Link sekolah_id ke metadata
    const { error: updateError } = await adminClient
      .from('users')
      .update({ 
        role: 'sekolah',
        status_approval: 'pending',
        metadata: {
          sekolah_id: sekolah_id
        }
      })
      .eq('id', signupData.user.id);

    if (updateError) {
      console.error("Update role error:", updateError);
      // Tidak gagalkan signup, tapi log error
    }

    // Update email_sekolah di tabel sekolah untuk linking
    const { error: sekolahUpdateError } = await adminClient
      .from('sekolah')
      .update({
        email_sekolah: email.trim()
      })
      .eq('id', sekolah_id);

    if (sekolahUpdateError) {
      console.error("Update sekolah email error:", sekolahUpdateError);
      // Tidak gagalkan signup, tapi log error
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Registrasi berhasil. Akun Anda sedang menunggu persetujuan dari admin atau pengawas sekolah.",
        user: {
          id: signupData.user.id,
          email: signupData.user.email,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in register sekolah:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}

