import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";


export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Sign out user
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (err) {
    console.error("Sign out exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan saat sign out" },
      { status: 500 }
    );
  }
}

