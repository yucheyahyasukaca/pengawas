# 🔧 Troubleshooting Build Production

Dokumen ini menjelaskan masalah umum yang terjadi saat build di production server dan solusinya.

## 📋 Masalah yang Ditemukan

### 1. ❌ Environment Variables Tidak Tersedia saat Build Time

**Masalah:**
- Build gagal karena environment variables tidak tersedia saat build time
- Kode menggunakan non-null assertion (`!`) yang bisa menyebabkan runtime error
- Environment variables tidak dikonfigurasi dengan benar di production server

**Solusi:**
✅ **Sudah diperbaiki** - Menambahkan validasi environment variables di semua file Supabase client:
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`

### 2. ❌ Versi Zod Tidak Valid

**Masalah:**
- `package.json` menggunakan `zod: "^4.1.12"` yang tidak ada
- Versi terbaru Zod adalah 3.x (3.23.8)

**Solusi:**
✅ **Sudah diperbaiki** - Update ke `zod: "^3.23.8"`

### 3. ⚠️ Perbedaan Environment Variables

**Masalah:**
- Environment variables di localhost (`.env.local`) berbeda dengan production
- Production server tidak memiliki file `.env.local` atau environment variables tidak dikonfigurasi

**Solusi:**
1. Pastikan semua environment variables dikonfigurasi di production server:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_PUBLIC_ANON_KEY"
   SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
   ```

2. **Untuk Vercel/Netlify:**
   - Buka dashboard → Settings → Environment Variables
   - Tambahkan semua variabel yang diperlukan
   - Pastikan untuk Production, Preview, dan Development

3. **Untuk Server Manual (Docker/VPS):**
   - Buat file `.env.production` atau `.env.local`
   - Atau export sebagai environment variables:
     ```bash
     export NEXT_PUBLIC_SUPABASE_URL="..."
     export NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
     export SUPABASE_SERVICE_ROLE_KEY="..."
     ```

### 4. ⚠️ Node.js Version Mismatch

**Masalah:**
- Versi Node.js di production berbeda dengan localhost
- Next.js 16 membutuhkan Node.js 18.18+ atau 20 LTS

**Solusi:**
1. Pastikan production server menggunakan Node.js 20 LTS:
   ```bash
   node --version  # Harus >= 20.0.0
   ```

2. Jika menggunakan Vercel/Netlify, pastikan engine version di `package.json`:
   ```json
   {
     "engines": {
       "node": ">=20.0.0"
     }
   }
   ```

### 5. ⚠️ Tailwind CSS v4 Compatibility

**Masalah:**
- Proyek menggunakan Tailwind CSS v4 (beta) yang mungkin memiliki masalah kompatibilitas
- Build mungkin gagal jika PostCSS tidak dikonfigurasi dengan benar

**Solusi:**
1. Pastikan `postcss.config.mjs` sudah benar
2. Pastikan `@tailwindcss/postcss` terinstall
3. Jika masih bermasalah, pertimbangkan downgrade ke Tailwind CSS v3

### 6. ⚠️ Dependencies Tidak Terinstall

**Masalah:**
- `node_modules` tidak terinstall dengan benar di production
- Lock file (`package-lock.json`) tidak di-commit atau berbeda

**Solusi:**
1. Pastikan `package-lock.json` di-commit ke repository
2. Di production server, jalankan:
   ```bash
   npm ci  # Menggunakan lock file untuk install yang konsisten
   ```
   atau
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 7. ⚠️ Build Script Issues

**Masalah:**
- Build script mungkin tidak sesuai dengan environment production
- TypeScript errors yang tidak terdeteksi di development

**Solusi:**
1. Jalankan build secara lokal untuk mengecek error:
   ```bash
   npm run build
   ```

2. Jika ada TypeScript errors, perbaiki sebelum deploy

3. Pastikan build script di `package.json`:
   ```json
   {
     "scripts": {
       "build": "next build",
       "start": "next start"
     }
   }
   ```

## 🚀 Checklist Deployment Production

Sebelum deploy ke production, pastikan:

- [ ] Semua environment variables dikonfigurasi di production server
- [ ] Node.js version >= 20.0.0
- [ ] `npm ci` atau `npm install` berhasil tanpa error
- [ ] `npm run build` berhasil di localhost
- [ ] TypeScript compilation tidak ada error
- [ ] `package-lock.json` sudah di-commit
- [ ] Versi dependencies konsisten (cek `package-lock.json`)

## 🔍 Debugging Steps

Jika build masih gagal, ikuti langkah-langkah berikut:

### 1. Cek Error Log

```bash
npm run build 2>&1 | tee build.log
```

Atau di production server, cek log error dari platform deployment (Vercel/Netlify/etc).

### 2. Cek Environment Variables

Buat file test untuk memverifikasi environment variables:

```typescript
// app/test-env/page.tsx (temporary)
export default function TestEnv() {
  return (
    <div>
      <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}</p>
      <p>ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}</p>
      <p>SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌'}</p>
    </div>
  );
}
```

### 3. Cek Dependencies

```bash
npm list --depth=0
```

Pastikan semua dependencies terinstall dengan benar.

### 4. Clean Build

```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## 📝 Catatan Penting

1. **Environment Variables:**
   - `NEXT_PUBLIC_*` variables harus tersedia saat build time
   - Variables tanpa prefix hanya tersedia di server-side
   - Jangan commit `.env.local` ke repository

2. **Build Time vs Runtime:**
   - Build time: saat `npm run build` dijalankan
   - Runtime: saat aplikasi berjalan (`npm start` atau `npm run dev`)
   - Environment variables harus tersedia di build time untuk `NEXT_PUBLIC_*`

3. **Platform-Specific:**
   - **Vercel:** Environment variables dikonfigurasi di dashboard
   - **Netlify:** Environment variables dikonfigurasi di Site settings
   - **Docker:** Gunakan `-e` flag atau `.env` file
   - **VPS/Manual:** Export sebagai system environment variables

## 🆘 Masalah Lainnya?

Jika masalah masih terjadi setelah mengikuti panduan ini:

1. Cek log error yang spesifik
2. Bandingkan konfigurasi localhost dengan production
3. Pastikan semua dependencies terupdate
4. Cek dokumentasi Next.js untuk masalah build yang dikenal

## ✅ Perbaikan yang Sudah Dilakukan

1. ✅ Validasi environment variables di semua Supabase clients
2. ✅ Perbaikan versi Zod dari 4.1.12 ke 3.23.8
3. ✅ Penambahan error messages yang lebih informatif
4. ✅ Dokumentasi troubleshooting lengkap

---

**Last Updated:** 2025-01-27

