# 🔧 Fix: Cloud Server Tidak Bisa Akses Database & Admin Tidak Bisa Login

## ❌ Masalah yang Terjadi

1. **404 Error untuk `/api/auth/get-current-user`**
2. **Admin tidak bisa login**
3. **Database tidak bisa diakses**
4. **Error loading pengawas data**

## 🔍 Root Cause Analysis

Berdasarkan error console yang muncul, masalah utama adalah:

1. **API Routes mengembalikan 404** - Route handler tidak ditemukan di production
2. **Environment Variables tidak tersedia di runtime** - Meskipun sudah di-set di docker-compose, mungkin tidak ter-load dengan benar
3. **Standalone build mungkin tidak include API routes dengan benar**

## ✅ Solusi yang Sudah Diterapkan

### 1. Perbaikan Dockerfile ✅
- Menghapus environment variables yang di-set ke empty string di runner stage
- Memastikan environment variables di-set hanya di builder stage untuk build time
- Runtime environment variables akan di-set via docker-compose.yml

### 2. Perbaikan next.config.ts ✅
- Memastikan `outputFileTracingIncludes` sudah benar untuk include API routes
- Konfigurasi standalone mode sudah optimal

### 3. Perbaikan API Route `/api/auth/get-current-user` ✅
- Menambahkan pengecekan environment variables di awal
- Menambahkan logging yang lebih detail untuk debugging
- Menambahkan fallback mechanism yang lebih baik

### 4. Health Check Endpoint ✅
- Menambahkan `/api/health` untuk diagnostic server configuration

## 🚀 Langkah-langkah Deployment ke Cloud Server

### Step 1: Pastikan File .env Ada di Cloud Server

```bash
# SSH ke cloud server
cd /app  # atau path project Anda

# Pastikan file .env ada
ls -la .env

# Cek isi file .env
cat .env
```

File `.env` harus berisi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

**PENTING:** Pastikan semua nilai tidak kosong dan sesuai dengan credentials Supabase Anda.

### Step 2: Pull Perubahan Terbaru

```bash
# Di cloud server
cd /app
git pull origin main  # atau branch yang digunakan
```

### Step 3: Rebuild Docker Image

```bash
# Stop container yang sedang berjalan
docker-compose down

# Rebuild tanpa cache untuk memastikan build bersih
docker-compose build --no-cache

# Jika build berhasil, start container
docker-compose up -d
```

### Step 4: Verifikasi Environment Variables di Container

```bash
# Masuk ke container
docker exec -it app-pengawas sh

# Cek environment variables
env | grep SUPABASE

# Atau test dengan Node.js
node -e "console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20)); console.log('Has Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); console.log('Has Service Key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);"

# Keluar dari container
exit
```

### Step 5: Test Health Check Endpoint

```bash
# Test dari server
curl http://localhost:3000/api/health

# Atau dari browser
# Buka: https://your-domain.com/api/health
```

Response yang diharapkan:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T...",
  "environment": {
    "hasSupabaseUrl": true,
    "hasSupabaseKey": true,
    "hasServiceRoleKey": true,
    "nodeEnv": "production",
    "supabaseUrlPrefix": "https://..."
  },
  "message": "Server is configured correctly"
}
```

Jika status `unhealthy`, cek environment variables yang missing.

### Step 6: Test API Route get-current-user

```bash
# Test dari server (akan return 401 jika tidak authenticated, tapi tidak 404)
curl http://localhost:3000/api/auth/get-current-user

# Response yang diharapkan:
# - 401 jika tidak authenticated (OK - berarti route bekerja)
# - 500 jika environment variables missing
# - 404 jika route tidak ditemukan (MASALAH - perlu rebuild)
```

### Step 7: Cek Logs Container

```bash
# Cek logs untuk error
docker-compose logs -f pengawas

# Cari error terkait environment variables
docker-compose logs pengawas | grep -i "supabase\|missing\|error"

# Cari error terkait API routes
docker-compose logs pengawas | grep -i "api\|route\|404"
```

## 🔍 Troubleshooting Detail

### Problem 1: API Routes Masih 404

**Gejala:**
- `/api/auth/get-current-user` mengembalikan 404
- `/api/health` mengembalikan 404

**Penyebab:**
- Build standalone tidak include API routes
- Server.js tidak routing dengan benar

**Solusi:**
```bash
# 1. Pastikan next.config.ts sudah di-update
cat next.config.ts | grep outputFileTracingIncludes

# 2. Rebuild dengan --no-cache
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 3. Verifikasi file API route ada di container
docker exec -it app-pengawas sh
ls -la app/api/auth/get-current-user/route.js
# Jika tidak ada, berarti build tidak include API routes
```

### Problem 2: Environment Variables Tidak Tersedia

**Gejala:**
- `/api/health` mengembalikan status `unhealthy`
- Logs menunjukkan "Missing Supabase environment variables"

**Penyebab:**
- File `.env` tidak ada atau tidak terbaca
- `docker-compose.yml` tidak membaca `.env` dengan benar
- Environment variables tidak di-set di runtime

**Solusi:**
```bash
# 1. Pastikan file .env ada di directory yang sama dengan docker-compose.yml
ls -la .env

# 2. Cek isi .env
cat .env

# 3. Pastikan docker-compose.yml menggunakan ${VARIABLE_NAME}
cat docker-compose.yml | grep NEXT_PUBLIC_SUPABASE

# 4. Restart container setelah update .env
docker-compose down
docker-compose up -d

# 5. Verifikasi di container
docker exec -it app-pengawas env | grep SUPABASE
```

### Problem 3: Admin Tidak Bisa Login

**Gejala:**
- Form login tidak bisa submit
- Error "Gagal memuat data pengawas"
- Console menunjukkan 404 untuk `/api/auth/login`

**Penyebab:**
- API route `/api/auth/login` tidak ditemukan (404)
- Environment variables tidak tersedia di runtime
- Supabase credentials salah

**Solusi:**
```bash
# 1. Test API route login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Jika 404, berarti route tidak ada - perlu rebuild
# Jika 500, berarti environment variables missing
# Jika 400, berarti credentials salah (route bekerja)

# 2. Cek logs untuk detail error
docker-compose logs pengawas | grep -i "login\|error"

# 3. Verifikasi credentials Supabase
# Buka Supabase Dashboard dan cek:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

### Problem 4: Database Tidak Bisa Diakses

**Gejala:**
- Error saat query database
- "Failed to fetch user data"
- Supabase connection errors

**Penyebab:**
- Environment variables tidak tersedia
- Supabase credentials salah
- Network issue ke Supabase

**Solusi:**
```bash
# 1. Test koneksi ke Supabase dari container
docker exec -it app-pengawas sh
curl -I https://YOUR-PROJECT.supabase.co
# Jika tidak bisa connect, ada network issue

# 2. Verifikasi credentials
# Test dengan curl langsung ke Supabase API
curl -H "apikey: YOUR_ANON_KEY" https://YOUR-PROJECT.supabase.co/rest/v1/

# 3. Cek Supabase Dashboard
# Pastikan project masih aktif dan tidak paused
```

## 📋 Checklist Sebelum Deploy

- [ ] File `.env` ada di cloud server dengan semua variabel terisi
- [ ] `docker-compose.yml` sudah benar (menggunakan `${VARIABLE_NAME}`)
- [ ] `next.config.ts` sudah di-update dengan `outputFileTracingIncludes`
- [ ] `Dockerfile` sudah di-update (tidak set env vars ke empty string)
- [ ] API routes sudah di-update dengan error handling yang lebih baik
- [ ] Build berhasil tanpa error (`npm run build` di local untuk test)
- [ ] Rebuild dengan `--no-cache` untuk clean build
- [ ] Test `/api/health` mengembalikan status `healthy`
- [ ] Test `/api/auth/get-current-user` tidak 404 (bisa 401 jika tidak authenticated)
- [ ] Test login dengan credentials yang benar

## 🎯 Quick Fix Commands

Jika semua langkah di atas sudah dilakukan tapi masih error:

```bash
# 1. Stop semua container
docker-compose down

# 2. Hapus image lama (optional)
docker rmi app-pengawas 2>/dev/null || true

# 3. Pull perubahan terbaru
git pull origin main

# 4. Rebuild dari awal
docker-compose build --no-cache

# 5. Start container
docker-compose up -d

# 6. Cek logs
docker-compose logs -f pengawas

# 7. Test health check
curl http://localhost:3000/api/health
```

## 📝 Catatan Penting

1. **NEXT_PUBLIC_* Variables:**
   - Harus di-set di **build time** (builder stage di Dockerfile)
   - Juga harus di-set di **runtime** (docker-compose.yml environment section)
   - Nilai di runtime akan override nilai di build time untuk server-side code

2. **Standalone Mode:**
   - Environment variables di-embed ke JavaScript bundle di build time
   - Pastikan environment variables sudah benar saat build
   - Rebuild diperlukan jika environment variables berubah

3. **Docker Compose:**
   - Pastikan file `.env` ada di directory yang sama dengan `docker-compose.yml`
   - Docker Compose akan otomatis membaca `.env` file
   - Gunakan `${VARIABLE_NAME}` di docker-compose.yml untuk membaca dari .env

## 🆘 Jika Masih Error

Jika setelah mengikuti semua langkah di atas masih error:

1. **Cek logs detail:**
   ```bash
   docker-compose logs pengawas 2>&1 | tee logs.txt
   ```

2. **Test dari dalam container:**
   ```bash
   docker exec -it app-pengawas sh
   curl http://localhost:3000/api/health
   env | grep SUPABASE
   ```

3. **Verifikasi build:**
   ```bash
   # Di local, test build
   npm run build
   ls -la .next/standalone/app/api/auth/get-current-user/
   ```

4. **Hubungi support atau buat issue** dengan informasi:
   - Output dari `/api/health`
   - Output dari `docker-compose logs`
   - Output dari `env | grep SUPABASE` di container

---

**Last Updated:** 2025-01-27
**Versi:** 1.0

