# 🔧 Fix 404 Error untuk API Routes di Production

## ❌ Error yang Terjadi

```
GET /api/auth/get-current-user: 404 Not Found
GET /pengawas/manajemen-kl-XXX: 404 Not Found
Error loading pengawas data: Error: Gagal memuat data pengawas
```

## 🔍 Penyebab

1. **Next.js Standalone Mode** - API routes mungkin tidak ter-copy dengan benar ke standalone build
2. **Routing Issue** - Path routing tidak sesuai dengan struktur file
3. **Build Configuration** - Konfigurasi Next.js standalone tidak optimal

## ✅ Solusi yang Sudah Dilakukan

### 1. Update next.config.ts
✅ **Sudah diperbaiki** - Menambahkan `outputFileTracingIncludes` (root level, bukan di experimental) untuk memastikan API routes ter-include dalam standalone build

**Catatan:** Di Next.js 16, `outputFileTracingIncludes` sudah dipindahkan dari `experimental` ke root level config.

### 2. Verifikasi Dockerfile
✅ Dockerfile sudah benar - menggunakan `.next/standalone` yang sudah include API routes

## 🔧 Troubleshooting Langkah per Langkah

### 1. Cek Struktur File di Production

Di cloud server, pastikan file API route ada:

```bash
# SSH ke cloud server
cd /app

# Cek apakah file API route ada
ls -la app/api/auth/get-current-user/route.ts

# Jika menggunakan Docker, cek di dalam container
docker exec -it app-pengawas sh
ls -la .next/standalone/server.js
```

### 2. Rebuild Docker Image

Jika file ada tapi masih 404, rebuild image:

```bash
# Di cloud server
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Cek logs
docker-compose logs -f pengawas
```

### 3. Verifikasi Build Output

Pastikan build berhasil dan tidak ada error:

```bash
# Di local, test build
npm run build

# Cek apakah .next/standalone/server.js ada
ls -la .next/standalone/

# Cek apakah API routes ter-include
find .next/standalone -name "route.js" | grep api
```

### 4. Alternative: Non-Standalone Mode

Jika standalone mode masih bermasalah, bisa menggunakan non-standalone:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // output: 'standalone', // Comment out ini
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};
```

Dan update Dockerfile:

```dockerfile
# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy semua file yang diperlukan
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
```

## 🚀 Quick Fix untuk Production

### Option 1: Rebuild dengan Konfigurasi Baru

```bash
# 1. Pull perubahan terbaru
git pull origin main

# 2. Rebuild tanpa cache
docker-compose down
docker-compose build --no-cache

# 3. Start container
docker-compose up -d

# 4. Cek logs
docker-compose logs -f pengawas
```

### Option 2: Non-Standalone Mode (Jika Standalone Masih Bermasalah)

1. Update `next.config.ts` - comment out `output: 'standalone'`
2. Update `Dockerfile` - gunakan non-standalone approach
3. Rebuild dan redeploy

## 📝 Checklist

Sebelum deploy, pastikan:

- [ ] `next.config.ts` sudah di-update dengan `experimental.outputFileTracingIncludes`
- [ ] Build berhasil tanpa error (`npm run build`)
- [ ] File API route ada di `app/api/auth/get-current-user/route.ts`
- [ ] Dockerfile menggunakan struktur yang benar
- [ ] Environment variables sudah dikonfigurasi dengan benar

## 🎯 Testing

Setelah deploy, test API route:

```bash
# Test dari server
curl http://localhost:3000/api/auth/get-current-user

# Atau dari browser
# Buka: https://pengawas.garuda-21.com/api/auth/get-current-user
```

## 🆘 Masalah Lainnya?

Jika masih error setelah mengikuti langkah-langkah di atas:

1. **Cek logs detail:**
   ```bash
   docker-compose logs -f pengawas 2>&1 | grep -i error
   ```

2. **Test API route secara langsung:**
   ```bash
   # Di dalam container
   docker exec -it app-pengawas sh
   curl http://localhost:3000/api/auth/get-current-user
   ```

3. **Cek apakah server.js ada:**
   ```bash
   docker exec -it app-pengawas ls -la server.js
   ```

4. **Verifikasi build:**
   ```bash
   # Di local
   npm run build
   ls -la .next/standalone/
   ```

---

**Last Updated:** 2025-01-27

