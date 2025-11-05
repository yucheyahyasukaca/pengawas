# 🔧 Fix: Admin Tidak Bisa Login di Production (Localhost OK)

## ❌ Masalah yang Terjadi

1. **Admin bisa login di localhost** ✅
2. **Admin tidak bisa login di cloud server** ❌
3. **Error "Akses Terbatas"** muncul setelah login
4. **React error #418** (Minified React error)

## 🔍 Root Cause Analysis

### Masalah Cookie di Production

1. **Secure Flag**: Di production (HTTPS), cookies harus menggunakan `secure: true`, tapi di development (HTTP) bisa `secure: false`
2. **SameSite**: Perlu di-set dengan benar untuk cross-site requests
3. **Path**: Cookie path harus di-set dengan benar
4. **Timing**: Di production, cookies perlu waktu lebih lama untuk di-set

### Masalah Session Management

1. **Session tidak tersimpan**: Cookies tidak tersimpan dengan benar di production
2. **Session tidak terdeteksi**: Server-side tidak bisa membaca cookies yang di-set client-side
3. **Hydration mismatch**: React error #418 biasanya terjadi karena state berbeda antara server dan client

## ✅ Solusi yang Diterapkan

### 1. Perbaikan Cookie Settings ✅

**File:** `lib/supabase/server.ts`

- Menambahkan deteksi production/development
- Set `secure: true` di production (HTTPS)
- Set `secure: false` di development (HTTP)
- Memastikan `sameSite: 'lax'` untuk production
- Memastikan `path: '/'` untuk cookie
- Error handling yang lebih baik

### 2. Perbaikan Session Timing ✅

**File:** `app/(auth)/auth/login/page.tsx`

- Menambahkan delay lebih lama di production (1000ms vs 500ms)
- Memastikan cookies tersimpan sebelum redirect

### 3. Error Handling ✅

- Menambahkan logging yang lebih baik
- Menambahkan error handling untuk cookie errors

## 🚀 Langkah Deploy ke Cloud Server

### Step 1: Pull Perubahan Terbaru

```bash
# SSH ke cloud server
cd /app
git pull origin main
```

### Step 2: Rebuild Container

```bash
# Rebuild dengan --no-cache untuk memastikan perubahan diterapkan
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Step 3: Verifikasi Environment Variables

```bash
# Masuk ke container
docker exec -it app-pengawas sh

# Cek environment variables
env | grep SUPABASE
env | grep NODE_ENV

# Pastikan NODE_ENV=production
exit
```

### Step 4: Clear Browser Cookies

**PENTING:** Setelah deploy, clear cookies browser untuk memastikan cookie baru di-set dengan benar:

1. Buka browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear all cookies untuk domain
4. Atau gunakan incognito/private window

### Step 5: Test Login

```bash
# Test dari server
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mkps@garuda-21.com","password":"mkps123"}' \
  -v

# Cek response headers untuk Set-Cookie
```

## 🔍 Troubleshooting

### Problem 1: Masih "Akses Terbatas" Setelah Login

**Kemungkinan penyebab:**
- Cookies tidak tersimpan dengan benar
- Session tidak terdeteksi di server-side
- Environment variables tidak tersedia

**Solusi:**
```bash
# 1. Cek cookies di browser DevTools
# Application/Storage → Cookies
# Pastikan cookies ada dengan:
# - secure: true (jika HTTPS)
# - sameSite: lax
# - path: /

# 2. Cek environment variables
docker exec -it app-pengawas env | grep SUPABASE

# 3. Cek logs untuk error
docker-compose logs pengawas | grep -i "cookie\|session\|error"

# 4. Clear cookies dan coba lagi
```

### Problem 2: React Error #418

**Kemungkinan penyebab:**
- Hydration mismatch antara server dan client
- Cookie state berbeda antara server-side render dan client-side render

**Solusi:**
1. Clear browser cache dan cookies
2. Hard refresh (Ctrl+Shift+R atau Cmd+Shift+R)
3. Test di incognito/private window
4. Cek console untuk detail error

### Problem 3: Cookies Tidak Tersimpan

**Kemungkinan penyebab:**
- Domain cookie tidak match
- Path cookie tidak match
- Secure flag tidak sesuai dengan protocol (HTTPS vs HTTP)

**Solusi:**
```bash
# 1. Cek apakah domain di-set dengan benar
# Cookie domain harus match dengan domain website

# 2. Cek apakah secure flag sesuai
# HTTPS → secure: true
# HTTP → secure: false

# 3. Test dengan curl untuk melihat Set-Cookie header
curl -X POST https://pengawas.garuda-21.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mkps@garuda-21.com","password":"mkps123"}' \
  -v
```

### Problem 4: Session Tidak Terdeteksi

**Kemungkinan penyebab:**
- Cookies tidak terkirim ke server
- Server tidak bisa membaca cookies
- Cookies expired atau invalid

**Solusi:**
```bash
# 1. Cek apakah cookies dikirim ke server
# Di browser DevTools → Network tab
# Cek request headers untuk Cookie header

# 2. Test API route get-current-user
curl http://localhost:3000/api/auth/get-current-user \
  -H "Cookie: sb-xxxx-auth-token=..." \
  -v

# 3. Cek logs untuk error
docker-compose logs pengawas | grep -i "get-current-user\|cookie"
```

## 📋 Checklist

- [ ] Pull perubahan terbaru dari git
- [ ] Rebuild container dengan `--no-cache`
- [ ] Verifikasi `NODE_ENV=production` di container
- [ ] Verifikasi environment variables tersedia
- [ ] Clear browser cookies sebelum test
- [ ] Test login dengan credentials admin
- [ ] Cek cookies di browser DevTools
- [ ] Verifikasi cookies memiliki `secure: true` (jika HTTPS)
- [ ] Test access ke `/admin` setelah login
- [ ] Cek logs untuk error

## 🎯 Expected Result

Setelah perbaikan:
- ✅ Admin bisa login di production
- ✅ Cookies tersimpan dengan benar (`secure: true`, `sameSite: 'lax'`)
- ✅ Session terdeteksi di server-side
- ✅ Tidak ada error "Akses Terbatas" setelah login
- ✅ Bisa mengakses `/admin` setelah login

## 🔧 Additional Notes

### Cookie Settings Summary

**Development (HTTP):**
- `secure: false`
- `sameSite: 'lax'`
- `path: '/'`

**Production (HTTPS):**
- `secure: true` ✅
- `sameSite: 'lax'` ✅
- `path: '/'` ✅

### Browser Compatibility

- Chrome/Edge: ✅ Mendukung `secure: true` dengan HTTPS
- Firefox: ✅ Mendukung `secure: true` dengan HTTPS
- Safari: ✅ Mendukung `secure: true` dengan HTTPS

### Security Notes

1. **Secure Flag**: Wajib `true` di production untuk HTTPS
2. **SameSite**: `'lax'` adalah balance yang baik antara security dan functionality
3. **HTTPOnly**: Supabase SSR mengatur ini otomatis
4. **Path**: `'/'` memastikan cookie tersedia di semua path

---

**Last Updated:** 2025-01-27
**Status:** ✅ Fix Ready

