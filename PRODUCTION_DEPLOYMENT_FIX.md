# 🚨 Fix: 404 Error dan Admin Tidak Bisa Login di Production

## ❌ Masalah yang Terjadi

1. **404 Error untuk `/api/auth/get-current-user`**
2. **Admin tidak bisa login**
3. **Error loading pengawas data**

## 🔍 Root Cause

Masalah utama adalah **environment variables tidak tersedia di runtime** meskipun sudah di-set saat build time. Di Next.js standalone mode, environment variables harus tersedia di runtime, bukan hanya saat build.

## ✅ Solusi Lengkap

### 1. Pastikan Environment Variables di Runtime

**Di docker-compose.yml:**
```yaml
services:
  pengawas:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
        - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
        - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    environment:
      # PENTING: Set environment variables di runtime juga
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    # ... rest of config
```

### 2. Verifikasi File .env di Cloud Server

**Pastikan file `.env` ada dan berisi:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

### 3. Rebuild dan Restart Container

```bash
# Di cloud server
cd /app

# Stop container
docker-compose down

# Rebuild tanpa cache (PENTING!)
docker-compose build --no-cache

# Start container
docker-compose up -d

# Cek logs
docker-compose logs -f pengawas
```

### 4. Verifikasi Environment Variables di Container

```bash
# Masuk ke container
docker exec -it app-pengawas sh

# Cek environment variables
env | grep SUPABASE

# Atau test dari dalam container
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

### 5. Test API Route

```bash
# Test dari server
curl http://localhost:3000/api/auth/get-current-user

# Atau dari browser
# Buka: https://pengawas.garuda-21.com/api/auth/get-current-user
```

## 🔧 Troubleshooting Step by Step

### Step 1: Cek File .env

```bash
# Di cloud server
cd /app
cat .env

# Pastikan semua variabel terisi (tidak kosong)
```

### Step 2: Cek docker-compose.yml

```bash
# Pastikan docker-compose.yml sudah benar
cat docker-compose.yml

# Verifikasi environment variables ada di section 'environment'
```

### Step 3: Cek Build Output

```bash
# Rebuild dan lihat output
docker-compose build --no-cache 2>&1 | tee build.log

# Cek apakah ada error tentang environment variables
grep -i "error\|missing\|undefined" build.log
```

### Step 4: Cek Container Logs

```bash
# Cek logs setelah start
docker-compose logs -f pengawas

# Cari error tentang environment variables
docker-compose logs pengawas | grep -i "supabase\|missing\|error"
```

### Step 5: Test API Route dari Container

```bash
# Masuk ke container
docker exec -it app-pengawas sh

# Test API route
curl http://localhost:3000/api/auth/get-current-user

# Jika error, cek environment variables
env | grep SUPABASE
```

## 🎯 Quick Fix Checklist

- [ ] File `.env` ada di `/app` dengan semua variabel terisi
- [ ] `docker-compose.yml` memiliki environment variables di section `environment`
- [ ] Rebuild dengan `--no-cache`: `docker-compose build --no-cache`
- [ ] Restart container: `docker-compose up -d`
- [ ] Verifikasi env vars di container: `docker exec -it app-pengawas env | grep SUPABASE`
- [ ] Test API route: `curl http://localhost:3000/api/auth/get-current-user`

## 🆘 Jika Masih Error

### Error: API route masih 404

**Kemungkinan penyebab:**
1. Build belum di-rebuild setelah update `next.config.ts`
2. File API route tidak ter-copy ke standalone build

**Solusi:**
```bash
# Rebuild dari awal
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Error: Environment variables tidak tersedia

**Kemungkinan penyebab:**
1. File `.env` tidak ada atau tidak terbaca
2. `docker-compose.yml` tidak meng-set environment variables

**Solusi:**
1. Pastikan file `.env` ada: `ls -la .env`
2. Pastikan `docker-compose.yml` memiliki:
   ```yaml
   environment:
     - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
     - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
     - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
   ```

### Error: Admin tidak bisa login

**Kemungkinan penyebab:**
1. API route `/api/auth/login` tidak bisa diakses (404)
2. Environment variables tidak tersedia di runtime
3. Supabase credentials salah

**Solusi:**
1. Test API route: `curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test","password":"test"}'`
2. Cek environment variables: `docker exec -it app-pengawas env | grep SUPABASE`
3. Verifikasi credentials di Supabase Dashboard

## 📝 Catatan Penting

1. **Environment Variables di Next.js:**
   - `NEXT_PUBLIC_*` harus tersedia di **build time** dan **runtime**
   - Variables tanpa prefix hanya tersedia di **runtime**
   - Di Docker, set di `docker-compose.yml` section `environment`

2. **Standalone Mode:**
   - Environment variables harus tersedia saat container running
   - Build-time variables tidak cukup, harus di-set juga di runtime

3. **Docker Compose:**
   - Gunakan `${VARIABLE_NAME}` untuk membaca dari `.env` file
   - Pastikan file `.env` ada di directory yang sama dengan `docker-compose.yml`

---

**Last Updated:** 2025-01-27

