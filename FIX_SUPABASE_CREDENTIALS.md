# 🔧 Fix: Invalid Authentication Credentials - Supabase Service Role Key

## ❌ Masalah yang Ditemukan

Dari debug endpoint `/api/debug/auth`, masalahnya jelas:

```json
{
  "database": {
    "connection": {
      "canConnect": false,
      "error": "Invalid authentication credentials"
    }
  }
}
```

**Root Cause:**
- ✅ Cookies tersimpan dengan benar
- ✅ Session terdeteksi (user login berhasil)
- ❌ **SUPABASE_SERVICE_ROLE_KEY salah atau tidak valid**
- ❌ Database connection gagal karena invalid credentials

## 🔍 Analisis

Dari debug response:
- **Supabase URL:** `https://supabase2.garuda-21.co`
- **Cookies:** Ada 2 cookies dengan project ID berbeda:
  - `sb-sxthkpnnxnzxpszcnoak-auth-token`
  - `sb-supabase2-auth-token`

**Ini menunjukkan:**
1. Ada 2 Supabase projects berbeda (localhost vs production)
2. `SUPABASE_SERVICE_ROLE_KEY` di production tidak sesuai dengan project yang benar
3. Service role key mungkin dari project yang salah

## ✅ Solusi

### Step 1: Verifikasi Supabase Project di Production

1. Buka Supabase Dashboard: `https://supabase2.garuda-21.co` (atau URL yang benar)
2. Go to **Settings** → **API**
3. Cek:
   - **Project URL** (harus sama dengan `NEXT_PUBLIC_SUPABASE_URL`)
   - **Service Role Key** (ini yang harus digunakan)

### Step 2: Update Service Role Key di Cloud Server

**Di cloud server:**

```bash
# 1. Edit file .env
nano .env
# atau
vi .env

# 2. Update SUPABASE_SERVICE_ROLE_KEY dengan value yang benar dari Supabase Dashboard
# Harus dimulai dengan "eyJ" (JWT format)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Save dan exit

# 4. Verifikasi
cat .env | grep SUPABASE_SERVICE_ROLE_KEY
```

### Step 3: Update docker-compose.yml

Pastikan `docker-compose.yml` membaca dari `.env`:

```yaml
services:
  pengawas:
    environment:
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
```

### Step 4: Rebuild Container

```bash
# Rebuild dengan environment variables baru
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verifikasi environment variables di container
docker exec -it app-pengawas env | grep SUPABASE
```

### Step 5: Test Connection

```bash
# Test debug endpoint lagi
curl https://pengawas.garuda-21.com/api/debug/auth | jq

# Expected response:
# "database": {
#   "connection": {
#     "canConnect": true,
#     "error": null
#   }
# }
```

## 🔍 Verifikasi Service Role Key

**Cara mendapatkan Service Role Key yang benar:**

1. **Buka Supabase Dashboard**
   - URL: `https://supabase2.garuda-21.co` (atau URL project Anda)
   - Login dengan credentials yang benar

2. **Go to Settings → API**
   - Scroll ke **Service Role Key** section
   - Click **Reveal** untuk melihat key
   - Copy key (harus dimulai dengan `eyJ`)

3. **Verifikasi Key Format**
   - Service Role Key harus JWT format (dimulai dengan `eyJ`)
   - Panjang biasanya ~200+ karakter
   - **JANGAN** gunakan `anon` key atau `public` key

4. **Test Key di Supabase Dashboard**
   - Go to **Database** → **Tables**
   - Pastikan bisa akses tables
   - Jika bisa, key benar

## 🚨 Important Notes

### 1. Service Role Key vs Anon Key

- **Service Role Key:** 
  - Bypass RLS (Row Level Security)
  - Digunakan untuk server-side operations
  - **JANGAN** expose ke client-side
  
- **Anon Key:**
  - Respect RLS
  - Digunakan untuk client-side operations
  - Bisa di-expose (sudah public)

### 2. Key Format

**Service Role Key (Correct):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dGhrcG5ueG56eHBzemNub2FrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODk2ODAwMCwiZXhwIjoyMDE0NTQ0MDAwfQ...
```

**Anon Key (Wrong for admin client):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dGhrcG5ueG56eHBzemNub2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg5NjgwMDAsImV4cCI6MjAxNDU0NDAwMH0...
```

**Perbedaan:** Role di JWT payload:
- Service Role: `"role": "service_role"`
- Anon: `"role": "anon"`

### 3. Multiple Supabase Projects

Jika ada 2 Supabase projects:
- **Localhost:** Project A (URL: `https://xxx.supabase.co`)
- **Production:** Project B (URL: `https://supabase2.garuda-21.co`)

**Pastikan:**
- Production menggunakan credentials dari Project B
- Service Role Key dari Project B (bukan Project A)

## 📋 Checklist

- [ ] Buka Supabase Dashboard untuk project production
- [ ] Go to Settings → API
- [ ] Copy Service Role Key yang benar
- [ ] Update `.env` file di cloud server
- [ ] Verifikasi key format (dimulai dengan `eyJ`)
- [ ] Update `docker-compose.yml` jika perlu
- [ ] Rebuild container dengan `--no-cache`
- [ ] Verifikasi environment variables di container
- [ ] Test debug endpoint (`/api/debug/auth`)
- [ ] Verifikasi `database.connection.canConnect: true`
- [ ] Test login sebagai admin

## 🎯 Expected Result

Setelah fix:
```json
{
  "database": {
    "connection": {
      "canConnect": true,
      "error": null,
      "hasData": true
    },
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

## 🔧 Quick Fix Commands

```bash
# 1. Edit .env file
nano /app/.env

# 2. Update SUPABASE_SERVICE_ROLE_KEY dengan key yang benar
# (Copy dari Supabase Dashboard → Settings → API → Service Role Key)

# 3. Save dan exit

# 4. Rebuild container
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 5. Verifikasi
docker exec -it app-pengawas env | grep SUPABASE_SERVICE_ROLE_KEY

# 6. Test debug endpoint
curl https://pengawas.garuda-21.com/api/debug/auth | jq '.database.connection'
```

---

**Last Updated:** 2025-01-27
**Status:** 🔧 Fix Ready - Update Service Role Key

