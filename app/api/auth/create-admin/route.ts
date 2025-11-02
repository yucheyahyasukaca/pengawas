import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";


/**
 * Route handler untuk membuat akun admin (hanya untuk development/setup awal)
 * PERINGATAN: Route ini seharusnya di-protect atau dihapus setelah akun admin dibuat
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // Validasi password minimal 6 karakter (sesuai requirement Supabase)
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    const adminClient = createSupabaseAdminClient();
    
    // Buat user baru dengan admin client
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email untuk development
    });

    if (error) {
      console.error("Create admin error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (data.user) {
      return NextResponse.json(
        { 
          success: true,
          message: `Akun admin berhasil dibuat dengan email: ${email}`,
          user: {
            id: data.user.id,
            email: data.user.email,
          }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Gagal membuat akun admin" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Create admin exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat membuat akun" },
      { status: 500 }
    );
  }
}

