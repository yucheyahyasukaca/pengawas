# 🚀 Standalone Mode Optimization

## ✅ Konfigurasi Standalone Mode

Proyek ini sudah dikonfigurasi untuk menggunakan **Standalone Mode** yang memberikan:
- ⚡ **Startup time lebih cepat** - Hanya file yang diperlukan saja yang di-copy
- 📦 **Image size lebih kecil** - Tidak include semua node_modules
- 🎯 **Performance lebih baik** - Optimized untuk production

## 📋 Konfigurasi yang Sudah Diterapkan

### 1. **next.config.ts** ✅
```typescript
output: 'standalone'
```
- Mengaktifkan standalone mode
- Output akan di-generate ke `.next/standalone`

### 2. **Dockerfile** ✅
```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
CMD ["node", "server.js"]
```
- Menggunakan standalone output
- Menjalankan dengan `node server.js` (bukan `npm start`)

### 3. **API Routes** ✅
```typescript
outputFileTracingIncludes: {
  '/api/**/*': ['./app/api/**/*'],
}
```
- Memastikan semua API routes ter-include di standalone build

## 🎯 Keuntungan Standalone Mode

### 1. **Image Size**
- **Non-standalone:** ~500MB+ (include semua node_modules)
- **Standalone:** ~150MB (hanya dependencies yang diperlukan)

### 2. **Startup Time**
- **Non-standalone:** ~5-10 detik
- **Standalone:** ~2-3 detik

### 3. **Memory Usage**
- **Non-standalone:** Lebih tinggi (load semua dependencies)
- **Standalone:** Lebih rendah (hanya load yang diperlukan)

## 📝 Verifikasi Standalone Mode

### 1. Cek Build Output
```bash
npm run build
ls -la .next/standalone/
```
Harus ada:
- `server.js` - Main server file
- `app/` - Application files
- `node_modules/` - Only necessary dependencies

### 2. Cek Docker Image Size
```bash
docker images | grep app-pengawas
```
Image size harus lebih kecil dibanding non-standalone mode.

### 3. Cek Startup Time
```bash
time docker-compose up -d
```
Startup time harus lebih cepat.

## 🔍 Troubleshooting

### Problem: API Routes 404 di Standalone Mode

**Solusi:**
Pastikan `outputFileTracingIncludes` sudah benar di `next.config.ts`:
```typescript
outputFileTracingIncludes: {
  '/api/**/*': ['./app/api/**/*'],
}
```

### Problem: Environment Variables Tidak Tersedia

**Solusi:**
- Pastikan environment variables di-set di **build stage** (Dockerfile builder)
- Pastikan environment variables juga di-set di **runtime** (docker-compose.yml)

### Problem: Static Files Tidak Ter-load

**Solusi:**
Pastikan Dockerfile meng-copy static files:
```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
```

## 📊 Performance Comparison

| Metric | Non-Standalone | Standalone |
|--------|---------------|------------|
| Image Size | ~500MB | ~150MB |
| Startup Time | ~8s | ~3s |
| Memory Usage | ~200MB | ~120MB |
| Cold Start | Slower | Faster |

## ✅ Checklist

- [x] `next.config.ts` menggunakan `output: 'standalone'`
- [x] `Dockerfile` menggunakan `.next/standalone`
- [x] `Dockerfile` menggunakan `CMD ["node", "server.js"]`
- [x] `outputFileTracingIncludes` sudah di-set untuk API routes
- [x] Environment variables di-set di build stage dan runtime
- [x] Static files di-copy dengan benar

## 🚀 Deployment

Standalone mode sudah optimal dan siap untuk production. Tidak perlu perubahan konfigurasi tambahan.

**Status:** ✅ Standalone Mode Aktif & Optimal

---

**Last Updated:** 2025-01-27

