# 🔧 Fix: Dynamic Routes 404 di Production (Localhost OK)

## ❌ Masalah

- Route `/pengawas/manajemen-data/sekolah/skl-003` berfungsi di **localhost**
- Route yang sama mengembalikan **404** di **cloud server production**
- Ini adalah masalah konfigurasi **standalone build** untuk dynamic routes

## 🔍 Root Cause

Di Next.js standalone mode, dynamic routes (`[id]`, `[slug]`, dll) perlu:
1. Di-include secara eksplisit di `outputFileTracingIncludes`
2. Mark sebagai `dynamic = 'force-dynamic'` di server component (jika ada)
3. Route handler harus ter-include di standalone build

## ✅ Solusi yang Diterapkan

### 1. Update `next.config.ts` ✅

Menambahkan dynamic routes ke `outputFileTracingIncludes`:

```typescript
outputFileTracingIncludes: {
  '/api/**/*': ['./app/api/**/*'],
  // Include dynamic routes for sekolah
  '/pengawas/manajemen-data/sekolah/*': ['./app/(pengawas)/pengawas/manajemen-data/sekolah/**/*'],
},
```

Ini memastikan Next.js meng-include semua file di folder `sekolah/[id]` ke standalone build.

### 2. Pastikan Layout Dynamic ✅

Layout pengawas sudah menggunakan `export const dynamic = 'force-dynamic'` yang benar.

## 🚀 Langkah Deploy

### 1. Pull Perubahan Terbaru

```bash
cd /app
git pull origin main
```

### 2. Rebuild dengan --no-cache

**PENTING:** Rebuild **WAJIB** dengan `--no-cache` untuk memastikan konfigurasi baru diterapkan:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 3. Verifikasi Build

```bash
# Cek logs untuk memastikan tidak ada error
docker-compose logs -f pengawas

# Cek apakah route file ada di container
docker exec -it app-pengawas sh
ls -la app/(pengawas)/pengawas/manajemen-data/sekolah/[id]/
exit
```

### 4. Test Route

```bash
# Test dari server
curl http://localhost:3000/pengawas/manajemen-data/sekolah/skl-003

# Atau dari browser
# Buka: https://pengawas.garuda-21.com/pengawas/manajemen-data/sekolah/skl-003
```

## 🔍 Troubleshooting

### Problem: Route Masih 404 Setelah Rebuild

**Kemungkinan penyebab:**
1. Build tidak menggunakan `--no-cache` (masih pakai cache lama)
2. File tidak ter-copy ke standalone build

**Solusi:**
```bash
# 1. Hapus semua cache dan image
docker-compose down
docker rmi app-pengawas 2>/dev/null || true
docker system prune -f

# 2. Rebuild dari awal
docker-compose build --no-cache

# 3. Start container
docker-compose up -d

# 4. Verifikasi file ada
docker exec -it app-pengawas find . -path "*/sekolah/[id]/*" -name "page.js"
```

### Problem: Route Ter-include Tapi Masih 404

**Kemungkinan penyebab:**
- Routing di production berbeda dengan localhost
- Middleware atau proxy server memblokir route

**Solusi:**
1. Cek apakah ada middleware yang memblokir route
2. Cek konfigurasi reverse proxy (nginx, cloudflare, dll)
3. Test langsung dari dalam container:
   ```bash
   docker exec -it app-pengawas sh
   curl http://localhost:3000/pengawas/manajemen-data/sekolah/skl-003
   ```

### Problem: Dynamic Route Tidak Ter-include

**Solusi:**
Pastikan pattern di `outputFileTracingIncludes` benar:
```typescript
// ✅ BENAR - menggunakan wildcard
'/pengawas/manajemen-data/sekolah/*': ['./app/(pengawas)/pengawas/manajemen-data/sekolah/**/*'],

// ❌ SALAH - tidak menggunakan wildcard
'/pengawas/manajemen-data/sekolah': ['./app/(pengawas)/pengawas/manajemen-data/sekolah'],
```

## 📝 Catatan Penting

1. **Dynamic Routes di Standalone:**
   - Harus di-include secara eksplisit di `outputFileTracingIncludes`
   - Gunakan pattern dengan wildcard `*` untuk dynamic segments
   - Gunakan `**/*` untuk include semua subfolder

2. **Rebuild:**
   - **SELALU** gunakan `--no-cache` setelah update `next.config.ts`
   - Next.js cache bisa menyimpan konfigurasi lama

3. **Pattern Matching:**
   - Pattern di `outputFileTracingIncludes` harus match dengan route path
   - Gunakan `**/*` untuk include nested files

## ✅ Checklist

- [x] `next.config.ts` sudah di-update dengan `outputFileTracingIncludes` untuk dynamic routes
- [x] Route file sudah ada di `app/(pengawas)/pengawas/manajemen-data/sekolah/[id]/page.tsx`
- [ ] Rebuild dengan `--no-cache` di cloud server
- [ ] Test route setelah rebuild
- [ ] Verifikasi file ter-include di standalone build

## 🎯 Expected Result

Setelah rebuild:
- Route `/pengawas/manajemen-data/sekolah/skl-003` harus return 200 (bukan 404)
- Route `/pengawas/manajemen-data/sekolah/{any-id}` harus bekerja
- Detail sekolah harus ditampilkan dengan benar

---

**Last Updated:** 2025-01-27
**Status:** ✅ Fix Ready

