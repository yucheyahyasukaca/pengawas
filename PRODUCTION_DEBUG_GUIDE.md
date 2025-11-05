# 🔍 Debug Guide: Admin Login Issue (Localhost OK, Production Failed)

## ❌ Masalah

- ✅ Admin bisa login di **localhost**
- ❌ Admin **tidak bisa login** di **production**
- ❌ Error "Akses Terbatas" muncul setelah login

## 🔍 Root Cause Analysis

Perbedaan utama antara localhost dan production:

### 1. **Environment Variables**
- Localhost: Environment variables dari `.env.local`
- Production: Environment variables dari Docker container atau environment variables

### 2. **Cookie Settings**
- Localhost: HTTP → `secure: false`
- Production: HTTPS → `secure: true` (WAJIB)

### 3. **Database Connection**
- Localhost: Koneksi langsung ke Supabase
- Production: Koneksi melalui network yang mungkin berbeda

### 4. **Session Storage**
- Localhost: Cookies tersimpan di browser localhost
- Production: Cookies harus tersimpan dengan domain production

## 🛠️ Debug Steps

### Step 1: Cek Debug Endpoint

Setelah deploy, akses endpoint debug:

```bash
# Di browser atau curl
curl https://pengawas.garuda-21.com/api/debug/auth

# Atau buka di browser (setelah login)
https://pengawas.garuda-21.com/api/debug/auth
```

**Response akan menunjukkan:**
- Environment variables tersedia atau tidak
- Cookies tersimpan atau tidak
- Session terdeteksi atau tidak
- Database connection bekerja atau tidak
- getCurrentUser() return apa
- getAdminUser() return apa

### Step 2: Analisis Response Debug

**Jika cookies tidak ada:**
```json
{
  "cookies": {
    "totalAuthCookies": 0,
    "authCookieNames": []
  }
}
```
→ **Masalah:** Cookies tidak tersimpan
→ **Solusi:** Cek cookie settings, clear cookies, coba lagi

**Jika session tidak terdeteksi:**
```json
{
  "auth": {
    "hasUser": false,
    "hasError": true,
    "errorMessage": "..."
  }
}
```
→ **Masalah:** Session tidak terdeteksi di server
→ **Solusi:** Cek cookies, verifikasi secure flag

**Jika user tidak ditemukan di database:**
```json
{
  "database": {
    "currentUser": {
      "exists": false
    }
}
```
→ **Masalah:** User tidak ada di database atau query gagal
→ **Solusi:** Cek database, verifikasi user ada dengan role='admin'

**Jika adminUser tidak ditemukan:**
```json
{
  "database": {
    "adminUser": {
      "exists": false
    },
    "currentUser": {
      "exists": true,
      "role": "pengawas" // Bukan 'admin'
    }
}
```
→ **Masalah:** Role user bukan 'admin'
→ **Solusi:** Update role di database ke 'admin'

### Step 3: Cek Logs Container

```bash
# Cek logs untuk error detail
docker-compose logs pengawas | grep -i "getCurrentUser\|getAdminUser\|error\|cookie"

# Atau cek semua logs
docker-compose logs -f pengawas
```

**Cari log:**
- `getCurrentUser:` - Apakah user terdeteksi?
- `getAdminUser:` - Apakah role 'admin'?
- `AdminRouteLayout:` - Apakah admin user ditemukan?
- Error messages terkait cookies atau database

### Step 4: Cek Cookies di Browser

**Di browser DevTools (F12):**
1. Go to **Application/Storage** tab
2. Click **Cookies** → Domain Anda
3. Cari cookies dengan nama `sb-*` atau `auth`

**Harus ada:**
- `sb-xxxx-auth-token` (atau nama serupa)
- `secure: true` (jika HTTPS)
- `sameSite: lax`
- `path: /`

**Jika cookies tidak ada:**
→ Cookies tidak tersimpan
→ Clear cookies dan coba login lagi

**Jika cookies ada tapi `secure: false` di HTTPS:**
→ Cookie settings salah
→ Rebuild container dengan fix terbaru

### Step 5: Test Login Flow

```bash
# Test login API
curl -X POST https://pengawas.garuda-21.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mkps@garuda-21.com","password":"mkps123"}' \
  -v

# Cek response:
# - Status code: 200 (success) atau 400/500 (error)
# - Response body: Apakah ada session?
# - Set-Cookie headers: Apakah cookies di-set?
```

### Step 6: Verifikasi Database

**Cek apakah user ada di database dengan role='admin':**

```sql
-- Di Supabase SQL Editor
SELECT id, email, role, status_approval 
FROM users 
WHERE email = 'mkps@garuda-21.com';
```

**Harus return:**
- `role = 'admin'`
- User ada di table `users`

**Jika tidak ada:**
→ Buat user admin:
```sql
-- Update role ke admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'mkps@garuda-21.com';
```

## 📋 Checklist Debug

- [ ] Akses `/api/debug/auth` dan lihat response
- [ ] Cek cookies di browser DevTools
- [ ] Cek logs container untuk error
- [ ] Test login API dengan curl
- [ ] Verifikasi user ada di database dengan role='admin'
- [ ] Cek environment variables di container
- [ ] Cek cookies secure flag (harus true di HTTPS)
- [ ] Cek sameSite cookie (harus 'lax')
- [ ] Clear cookies dan coba login lagi

## 🎯 Common Issues & Solutions

### Issue 1: Cookies Tidak Tersimpan

**Gejala:**
- Debug endpoint: `totalAuthCookies: 0`
- Browser DevTools: Tidak ada cookies

**Solusi:**
1. Clear cookies browser
2. Rebuild container dengan fix terbaru
3. Cek cookie settings di `lib/supabase/server.ts`
4. Pastikan `secure: true` di production (HTTPS)

### Issue 2: Session Tidak Terdeteksi

**Gejala:**
- Debug endpoint: `auth.hasUser: false`
- Logs: `getCurrentUser: hasUser: false`

**Solusi:**
1. Cek cookies di browser
2. Verifikasi cookies memiliki `secure: true` (jika HTTPS)
3. Cek cookie domain (harus match dengan domain website)
4. Clear cookies dan login lagi

### Issue 3: User Tidak Ditemukan di Database

**Gejala:**
- Debug endpoint: `database.currentUser.exists: false`
- Logs: Error query database

**Solusi:**
1. Cek database connection (debug endpoint akan menunjukkan)
2. Verifikasi user ada di table `users`
3. Cek SUPABASE_SERVICE_ROLE_KEY tersedia
4. Test query langsung ke database

### Issue 4: Role Bukan 'admin'

**Gejala:**
- Debug endpoint: `database.currentUser.role: 'pengawas'` (bukan 'admin')
- Logs: `getAdminUser: User found but not admin`

**Solusi:**
1. Update role di database:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'mkps@garuda-21.com';
   ```
2. Clear cookies dan login lagi
3. Verifikasi di debug endpoint

### Issue 5: Environment Variables Tidak Tersedia

**Gejala:**
- Debug endpoint: `environment.hasServiceRoleKey: false`
- Logs: Error missing environment variables

**Solusi:**
1. Cek `.env` file di cloud server
2. Cek `docker-compose.yml` environment section
3. Rebuild container dengan environment variables yang benar
4. Verifikasi di container: `docker exec -it app-pengawas env | grep SUPABASE`

## 🔧 Quick Fix Commands

```bash
# 1. Cek debug endpoint
curl https://pengawas.garuda-21.com/api/debug/auth | jq

# 2. Cek logs
docker-compose logs pengawas | grep -i "getAdminUser\|getCurrentUser" | tail -20

# 3. Cek environment variables
docker exec -it app-pengawas env | grep SUPABASE

# 4. Test login
curl -X POST https://pengawas.garuda-21.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mkps@garuda-21.com","password":"mkps123"}' \
  -v | jq

# 5. Rebuild dengan fix terbaru
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Expected Debug Response

**Jika semua OK:**
```json
{
  "environment": {
    "hasSupabaseUrl": true,
    "hasSupabaseKey": true,
    "hasServiceRoleKey": true
  },
  "cookies": {
    "totalAuthCookies": 2,
    "authCookieNames": ["sb-xxxx-auth-token", "sb-xxxx-auth-token-code-verifier"]
  },
  "auth": {
    "hasUser": true,
    "userEmail": "mkps@garuda-21.com"
  },
  "database": {
    "currentUser": {
      "exists": true,
      "email": "mkps@garuda-21.com",
      "role": "admin"
    },
    "adminUser": {
      "exists": true,
      "email": "mkps@garuda-21.com",
      "role": "admin"
    }
  }
}
```

---

**Last Updated:** 2025-01-27
**Status:** 🔍 Debug Tools Ready

