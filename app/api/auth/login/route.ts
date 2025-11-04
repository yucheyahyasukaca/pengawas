import { createClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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

    // Ambil role, nama, dan status approval dari database
    // Gunakan admin client untuk bypass RLS karena ada masalah dengan policy
    let userData = null;
    let userError = null;
    
    try {
      const adminClient = createSupabaseAdminClient();
      const userId = data.user.id; // Store user ID to avoid conflict
      const { data: userDataResult, error: userErrorResult } = await adminClient
        .from('users')
        .select('role, nama, nip, status_approval')
        .eq('id', userId)
        .single();
      
      userData = userDataResult;
      userError = userErrorResult;
    } catch (err) {
      console.error("Error using admin client:", err);
      userError = err as Error;
    }

    console.log("Login route: User data query", { 
      hasUserData: !!userData, 
      userError: userError?.message,
      role: userData?.role,
      statusApproval: userData?.status_approval,
      hasNama: !!userData?.nama
    });

    // Default role jika tidak ditemukan
    let userRole = 'sekolah';
    let redirectTo = '/dashboard';

    if (userError) {
      console.error("Login route: Error fetching user data:", userError);
      // Jika error, tetap coba cek email untuk fallback
      if (isAdminEmail(data.user.email || "")) {
        userRole = 'admin';
        redirectTo = '/admin';
      }
    } else if (userData && userData.role) {
      userRole = userData.role;
      
      // Tentukan redirect path berdasarkan role
      switch (userRole) {
        case 'admin':
          redirectTo = '/admin';
          break;
        case 'pengawas':
          // Check status approval
          const statusApproval = userData.status_approval || 'pending';
          console.log("Login route: Pengawas status", { statusApproval, hasNama: !!userData.nama });
          
          if (statusApproval === 'pending' || statusApproval === 'rejected') {
            redirectTo = '/pengawas/pending-approval';
            console.log("Login route: Redirecting to pending-approval");
          } else if (!userData.nama) {
            // Jika profil belum lengkap (tidak ada nama), redirect ke lengkapi-profil
            redirectTo = '/pengawas/lengkapi-profil';
            console.log("Login route: Redirecting to lengkapi-profil");
          } else {
            redirectTo = '/pengawas';
            console.log("Login route: Redirecting to pengawas dashboard");
          }
          break;
        case 'korwas_cabdin':
          redirectTo = '/korwas-cabdin'; // TODO: Buat dashboard untuk korwas cabdin
          break;
        case 'sekolah':
          redirectTo = '/sekolah'; // TODO: Buat dashboard untuk sekolah
          break;
        default:
          redirectTo = '/dashboard';
      }
    } else if (isAdminEmail(data.user.email || "")) {
      // Fallback: jika user belum ada di public.users tapi email admin
      userRole = 'admin';
      redirectTo = '/admin';
    }
    
    console.log("Login route: Final redirect", { userRole, redirectTo });
    
    // Return session tokens untuk client-side handling
    return NextResponse.json(
      { 
        success: true, 
        user: {
          id: data.user.id,
          email: data.user.email,
          nama: userData?.nama || null,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
        role: userRole,
        redirectTo: redirectTo
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
