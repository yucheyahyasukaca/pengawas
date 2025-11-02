"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAdmin() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Login dengan kredensial mockup admin MKPS
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "mkps@garuda-21.com",
      password: "mkps123",
    });

    if (error) {
      console.error("Login error:", error);
      return { error: error.message };
    }

    if (data.user && data.session) {
      // Redirect ke dashboard admin setelah login berhasil
      redirect("/admin");
    }

    return { error: "Gagal masuk: Tidak ada session yang dibuat" };
  } catch (err) {
    console.error("Login exception:", err);
    return { error: err instanceof Error ? err.message : "Terjadi kesalahan saat login" };
  }
}

