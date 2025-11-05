# 🔄 Alternative: Non-Standalone Mode untuk Docker

Jika standalone mode masih bermasalah dengan API routes, gunakan non-standalone mode sebagai alternatif.

## 📋 Perbedaan Standalone vs Non-Standalone

### Standalone Mode
- ✅ **Pros:** Image lebih kecil, lebih cepat
- ❌ **Cons:** API routes mungkin tidak ter-include dengan benar, lebih kompleks

### Non-Standalone Mode
- ✅ **Pros:** Semua file ter-include, lebih mudah debug, API routes pasti bekerja
- ❌ **Cons:** Image lebih besar, lebih lambat startup

## 🚀 Cara Menggunakan Non-Standalone Mode

### Option 1: Menggunakan File Alternatif (Recommended)

**1. Backup file yang ada:**
```bash
# Di cloud server
cd /app
cp Dockerfile Dockerfile.standalone.backup
cp docker-compose.yml docker-compose.standalone.yml.backup
cp next.config.ts next.config.standalone.ts.backup
```

**2. Gunakan file alternatif:**
```bash
# Copy file alternatif
cp Dockerfile.non-standalone Dockerfile
cp docker-compose.non-standalone.yml docker-compose.yml
cp next.config.non-standalone.ts next.config.ts
```

**3. Build dan start:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Option 2: Langsung Edit File yang Ada

**1. Edit `next.config.ts`:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Comment out atau hapus baris ini:
  // output: 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
```

**2. Edit `Dockerfile`:**
Ganti bagian akhir dengan:
```dockerfile
# Production image (non-standalone mode)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Environment variables will be set at runtime via docker-compose
ENV NEXT_PUBLIC_SUPABASE_URL=""
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=""
ENV SUPABASE_SERVICE_ROLE_KEY=""

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use npm start instead of node server.js
CMD ["npm", "start"]
```

**3. Build dan start:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Perubahan yang Dibutuhkan

### 1. next.config.ts
- ❌ Hapus atau comment: `output: 'standalone'`
- ❌ Hapus: `outputFileTracingIncludes`

### 2. Dockerfile
- ❌ Hapus: `COPY --from=builder /app/.next/standalone ./`
- ✅ Tambah: `COPY --from=builder /app/.next ./.next`
- ✅ Tambah: `COPY --from=builder /app/node_modules ./node_modules`
- ✅ Tambah: `COPY --from=builder /app/package.json ./package.json`
- ✅ Ganti: `CMD ["node", "server.js"]` → `CMD ["npm", "start"]`

### 3. docker-compose.yml
- Tidak perlu diubah, tetap sama

## ✅ Verifikasi

Setelah deploy, test:

```bash
# Test API route
curl http://localhost:3000/api/auth/get-current-user

# Test halaman
curl http://localhost:3000/

# Cek logs
docker-compose logs -f pengawas
```

## 🔍 Perbandingan

| Aspek | Standalone | Non-Standalone |
|-------|-----------|----------------|
| Image Size | ~150MB | ~400MB |
| Startup Time | Fast | Slower |
| API Routes | Mungkin bermasalah | ✅ Pasti bekerja |
| Debugging | Sulit | Mudah |
| Complexity | Tinggi | Rendah |

## 🎯 Rekomendasi

**Gunakan Non-Standalone jika:**
- ✅ Standalone mode masih bermasalah dengan API routes
- ✅ Butuh image yang lebih stabil
- ✅ Image size bukan prioritas utama
- ✅ Butuh debugging yang lebih mudah

**Gunakan Standalone jika:**
- ✅ Image size adalah prioritas
- ✅ Startup time penting
- ✅ API routes sudah bekerja dengan baik

## 🔄 Kembali ke Standalone Mode

Jika ingin kembali ke standalone mode:

```bash
# Restore backup files
cp Dockerfile.standalone.backup Dockerfile
cp docker-compose.standalone.yml.backup docker-compose.yml
cp next.config.standalone.ts.backup next.config.ts

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📚 File yang Dibutuhkan

File alternatif sudah disediakan:
- ✅ `Dockerfile.non-standalone` - Dockerfile untuk non-standalone
- ✅ `docker-compose.non-standalone.yml` - Docker compose untuk non-standalone
- ✅ `next.config.non-standalone.ts` - Next.js config untuk non-standalone

## 🆘 Troubleshooting

### Error: npm start tidak ditemukan

**Solusi:**
Pastikan `package.json` memiliki script `start`:
```json
{
  "scripts": {
    "start": "next start"
  }
}
```

### Error: Module not found

**Solusi:**
Pastikan semua file ter-copy dengan benar:
```dockerfile
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
```

### Image terlalu besar

**Solusi:**
Ini normal untuk non-standalone mode. Jika size penting, coba perbaiki standalone mode atau gunakan multi-stage build yang lebih optimal.

---

**Last Updated:** 2025-01-27

