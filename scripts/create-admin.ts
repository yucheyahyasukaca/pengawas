/**
 * Script untuk membuat akun admin MKPS
 * 
 * Cara menggunakan:
 * 1. Pastikan file .env.local sudah terisi dengan kredensial Supabase
 * 2. Jalankan: npx tsx scripts/create-admin.ts
 * 
 * Atau gunakan endpoint POST /api/auth/create-admin dengan body:
 * {
 *   "email": "mkps@garuda-21.com",
 *   "password": "mkps123"
 * }
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diisi di .env.local");
  process.exit(1);
}

const adminEmail = "mkps@garuda-21.com";
const adminPassword = "mkps123";

async function createAdmin() {
  try {
    console.log("🔄 Membuat akun admin...");
    console.log(`Email: ${adminEmail}`);
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes("already registered")) {
        console.log("✅ Akun admin sudah ada di sistem");
        return;
      }
      throw error;
    }

    if (data.user) {
      console.log("✅ Akun admin berhasil dibuat!");
      console.log(`   Email: ${data.user.email}`);
      console.log(`   ID: ${data.user.id}`);
      console.log("\n📝 Kredensial login:");
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    
    if (error.message.includes("already registered")) {
      console.log("\n💡 Akun sudah ada. Jika lupa password, reset melalui Supabase Dashboard.");
    } else {
      console.log("\n💡 Pastikan:");
      console.log("   1. SUPABASE_SERVICE_ROLE_KEY benar di .env.local");
      console.log("   2. Service role key memiliki permission untuk create user");
    }
    process.exit(1);
  }
}

createAdmin();

