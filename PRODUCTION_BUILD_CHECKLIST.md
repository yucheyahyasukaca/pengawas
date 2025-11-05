# ✅ Production Build Checklist

Build berhasil di localhost, tapi gagal di production server? Ikuti checklist ini.

## 🔍 Langkah Diagnosa

### 1. Pastikan Environment Variables Terkonfigurasi

**Cek di production server:**
```bash
# Di production server, pastikan environment variables ada
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
echo $SUPABASE_SERVICE_ROLE_KEY
```

**Jika menggunakan file .env:**
```bash
# Pastikan file .env ada
cat .env

# Atau .env.production
cat .env.production
```

**Jika menggunakan Docker:**
```bash
# Pastikan .env file ada di root project
docker-compose config
```

### 2. Cek Node.js Version

**Di production server:**
```bash
node --version  # Harus >= 20.0.0
npm --version   # Harus >= 10.0.0
```

**Jika version berbeda:**
```bash
# Update Node.js (contoh menggunakan nvm)
nvm install 20
nvm use 20
```

### 3. Clean Install Dependencies

**Di production server:**
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install

# Atau gunakan npm ci untuk install yang konsisten
npm ci
```

### 4. Test Build di Production Server

**Jalankan build command:**
```bash
npm run build
```

**Jika masih error, cek error message:**
- Error tentang environment variables? → Pastikan .env file ada
- Error tentang dependencies? → Pastikan package-lock.json up-to-date
- Error tentang TypeScript? → Pastikan tsconfig.json benar
- Error tentang memory? → Tambahkan memory limit: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`

### 5. Cek File yang Diperlukan

**Pastikan file ini ada di production:**
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `next.config.ts`
- ✅ `tsconfig.json`
- ✅ `postcss.config.mjs`
- ✅ `.env` atau `.env.production`
- ✅ Folder `app/`
- ✅ Folder `lib/`
- ✅ Folder `components/`

**File yang TIDAK perlu di production:**
- ❌ `node_modules/` (akan diinstall ulang)
- ❌ `.next/` (akan di-build ulang)
- ❌ `.env.local` (gunakan `.env` atau `.env.production`)

## 🚀 Build Command untuk Production

### Standar Build
```bash
npm run build
```

### Build dengan Memory Limit (jika out of memory)
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Build dengan Debug Info
```bash
NODE_OPTIONS=--max-old-space-size=4096 DEBUG=* npm run build
```

## 🔧 Troubleshooting Berdasarkan Error

### Error: "Missing Supabase environment variables"

**Solusi:**
1. Pastikan file `.env` atau `.env.production` ada
2. Pastikan semua variabel terisi:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
   ```
3. Restart build process

### Error: "Cannot find module" atau "Module not found"

**Solusi:**
1. Pastikan `package-lock.json` up-to-date:
   ```bash
   npm install
   git add package-lock.json
   git commit -m "Update package-lock.json"
   ```
2. Di production, hapus dan install ulang:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Error: "Out of memory" atau "JavaScript heap out of memory"

**Solusi:**
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Error: TypeScript compilation errors

**Solusi:**
1. Cek error di localhost dulu:
   ```bash
   npm run build
   ```
2. Pastikan semua TypeScript errors sudah diperbaiki
3. Commit dan push perubahan

### Error: Build timeout

**Solusi:**
1. Build di localhost dulu untuk memastikan tidak ada error
2. Jika menggunakan CI/CD, tambahkan timeout:
   ```yaml
   # Contoh untuk GitHub Actions
   timeout-minutes: 30
   ```

## 📋 Checklist Sebelum Deploy

- [ ] Build berhasil di localhost (`npm run build`)
- [ ] Environment variables sudah dikonfigurasi di production
- [ ] Node.js version >= 20.0.0 di production
- [ ] `package-lock.json` sudah di-commit dan up-to-date
- [ ] Semua dependencies terinstall (`npm install` atau `npm ci`)
- [ ] File `.env` atau `.env.production` ada di production
- [ ] Tidak ada TypeScript errors
- [ ] Tidak ada linting errors (optional: `npm run lint`)

## 🆘 Masih Error?

Jika masih ada error setelah mengikuti checklist ini:

1. **Copy error message lengkap** dari production server
2. **Bandingkan dengan localhost:**
   - Apakah Node.js version sama?
   - Apakah environment variables sama?
   - Apakah package-lock.json sama?
3. **Cek log detail:**
   ```bash
   npm run build 2>&1 | tee build.log
   ```
4. **Test build dengan environment production:**
   ```bash
   NODE_ENV=production npm run build
   ```

## 📝 Catatan Penting

1. **Environment Variables:**
   - `NEXT_PUBLIC_*` variables harus tersedia saat **build time**
   - Variables tanpa prefix hanya tersedia di **runtime** (server-side)

2. **Package Lock:**
   - Selalu commit `package-lock.json`
   - Gunakan `npm ci` di production untuk install yang konsisten

3. **Build Output:**
   - Build menghasilkan folder `.next/`
   - Jangan commit folder `.next/` (sudah di .gitignore)

4. **Production vs Development:**
   - Development: `npm run dev`
   - Production: `npm run build` → `npm start`

---

**Last Updated:** 2025-01-27

