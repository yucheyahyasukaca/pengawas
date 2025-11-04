# Setup Auto-Confirm Email di Supabase

## 📋 Tujuan

Memastikan akun langsung aktif tanpa perlu konfirmasi email, sehingga user bisa langsung login setelah registrasi.

## 🚀 Cara Setup

### **Cara 1: Via Supabase Dashboard (Recommended)**

1. Buka **Supabase Dashboard** → Project Anda
2. Pergi ke **Authentication** → **Settings** (atau **URL Configuration**)
3. Scroll ke bagian **Email Auth**
4. Cari setting **"Enable email confirmations"**
5. **Nonaktifkan** (turn off) email confirmations
6. Klik **Save**

**Catatan:** Setelah setting ini dinonaktifkan, semua user baru akan otomatis terkonfirmasi tanpa perlu klik link di email.

### **Cara 2: Via API (Sudah Diimplementasi)**

Registrasi pengawas sudah menggunakan Admin API dengan `email_confirm: true`, sehingga akun langsung aktif.

**File:** `app/api/auth/register/pengawas/route.ts`

```typescript
await adminClient.auth.admin.createUser({
  email,
  password,
  email_confirm: true, // Auto-confirm email
});
```

## ✅ Verifikasi

Setelah setup:

1. **Test registrasi** pengawas baru
2. **Coba login** langsung dengan email dan password yang baru dibuat
3. **Pastikan** tidak ada error "Email not confirmed" atau "Check your email"

## 🔧 Troubleshooting

### ❌ Masih perlu konfirmasi email

**Penyebab:** Setting di Supabase Dashboard masih aktif

**Solusi:**
1. Pastikan **"Enable email confirmations"** sudah dinonaktifkan
2. Atau pastikan registrasi menggunakan Admin API dengan `email_confirm: true`

### ❌ Error "Invalid API key"

**Penyebab:** `SUPABASE_SERVICE_ROLE_KEY` tidak ada atau salah

**Solusi:**
1. Pastikan `.env.local` sudah ada `SUPABASE_SERVICE_ROLE_KEY`
2. Restart development server setelah update `.env.local`

## 📝 Catatan Penting

1. **Service Role Key** diperlukan untuk auto-confirm email
2. **Jangan expose** `SUPABASE_SERVICE_ROLE_KEY` ke client-side
3. Setelah disable email confirmation di dashboard, semua user baru otomatis terkonfirmasi
4. User yang sudah terdaftar sebelum disable email confirmation tetap perlu konfirmasi (jika belum)

## 🎯 Rekomendasi

**Untuk Development:**
- Disable email confirmation di Supabase Dashboard
- Gunakan Admin API untuk create user dengan `email_confirm: true`

**Untuk Production:**
- Pertimbangkan untuk tetap enable email confirmation untuk keamanan
- Atau gunakan whitelist domain untuk auto-confirm

