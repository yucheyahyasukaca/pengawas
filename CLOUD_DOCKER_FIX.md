# 🔧 Fix Docker Build Error di Cloud Server

## ❌ Error yang Terjadi

```
failed to solve: process "/bin/sh -c if [ -f package-lock.json ]; then npm ci --no-audit --prefer-offline; else npm install --no-audit; fi" did not complete successfully: exit code: 1
```

## 🔍 Penyebab

1. **package-lock.json tidak sync** dengan `package.json` setelah update Zod dari 4.1.12 ke 3.23.8
2. **Dockerfile di cloud** mungkin menggunakan `--prefer-offline` yang menyebabkan masalah jika cache tidak ada
3. **Node.js version** mungkin tidak sesuai

## ✅ Solusi yang Sudah Dilakukan

### 1. Update package-lock.json
✅ **Sudah diperbaiki** - `package-lock.json` sudah di-update dengan Zod versi yang benar (3.23.8)

### 2. Dockerfile Baru
✅ **Sudah dibuat** - Dockerfile baru dengan:
- Node.js 20 Alpine
- Multi-stage build untuk optimasi
- Menghapus `--prefer-offline` flag yang bermasalah
- Proper environment variables handling

### 3. next.config.ts
✅ **Sudah diupdate** - Menambahkan `output: 'standalone'` untuk Docker build yang optimal

## 🚀 Langkah Deploy ke Cloud Server

### 1. Commit dan Push Perubahan

```bash
# Di local
git add package-lock.json Dockerfile docker-compose.yml next.config.ts .dockerignore
git commit -m "Fix Docker build: update Zod version and Dockerfile"
git push origin main
```

### 2. Di Cloud Server - Pull Perubahan

```bash
# SSH ke cloud server
cd /app  # atau path project Anda
git pull origin main
```

### 3. Pastikan Environment Variables

```bash
# Di cloud server, pastikan file .env ada
cat .env

# Harus berisi:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
```

### 4. Rebuild Docker Image

```bash
# Stop container yang sedang berjalan
docker-compose down

# Hapus image lama (optional, untuk clean build)
docker rmi app-pengawas 2>/dev/null || true

# Rebuild tanpa cache
docker-compose build --no-cache

# Atau jika menggunakan Dockerfile langsung
docker build --no-cache -t pengawas .
```

### 5. Start Container

```bash
# Start dengan docker-compose
docker-compose up -d

# Atau jika menggunakan docker langsung
docker run -d \
  --name app-pengawas \
  -p 3000:3000 \
  --env-file .env \
  pengawas
```

### 6. Cek Logs

```bash
# Cek apakah build berhasil
docker-compose logs -f pengawas

# Atau
docker logs -f app-pengawas
```

## 🔍 Troubleshooting

### Error: package-lock.json tidak ditemukan

**Solusi:**
```bash
# Di cloud server
ls -la package-lock.json

# Jika tidak ada, pull dari git
git checkout package-lock.json
```

### Error: npm ci masih gagal

**Solusi:**
```bash
# 1. Hapus node_modules dan package-lock.json di local
rm -rf node_modules package-lock.json

# 2. Install ulang
npm install

# 3. Commit dan push
git add package-lock.json
git commit -m "Regenerate package-lock.json"
git push

# 4. Di cloud server, pull dan rebuild
git pull
docker-compose build --no-cache
```

### Error: Environment variables tidak tersedia

**Solusi:**
Pastikan file `.env` ada di directory yang sama dengan `docker-compose.yml`:
```bash
# Di cloud server
ls -la .env
cat .env
```

### Error: Build timeout atau memory error

**Solusi:**
Tingkatkan memory limit di docker-compose.yml:
```yaml
services:
  pengawas:
    build:
      context: .
      dockerfile: Dockerfile
      # Tambahkan ini
      shm_size: '1gb'
    # ...
```

## 📋 Checklist

Sebelum deploy, pastikan:

- [ ] `package-lock.json` sudah di-commit dan up-to-date
- [ ] Dockerfile baru sudah di-push ke repository
- [ ] `next.config.ts` sudah memiliki `output: 'standalone'`
- [ ] File `.env` ada di cloud server dengan semua variabel terisi
- [ ] Docker image lama sudah dihapus (optional)
- [ ] Rebuild menggunakan `--no-cache` untuk clean build

## 🎯 Perubahan yang Dibuat

1. ✅ **package.json** - Update Zod dari 4.1.12 ke 3.23.8
2. ✅ **package-lock.json** - Regenerate dengan dependencies yang benar
3. ✅ **Dockerfile** - Dockerfile baru dengan Node.js 20 dan optimasi
4. ✅ **next.config.ts** - Tambah `output: 'standalone'`
5. ✅ **docker-compose.yml** - Konfigurasi untuk build args
6. ✅ **.dockerignore** - Optimasi build context

## 📝 Catatan Penting

1. **Selalu commit package-lock.json** setelah update dependencies
2. **Gunakan `--no-cache`** saat rebuild untuk menghindari cache issues
3. **Pastikan .env file ada** di cloud server sebelum build
4. **Cek logs** setelah build untuk memastikan tidak ada error

---

**Last Updated:** 2025-01-27

