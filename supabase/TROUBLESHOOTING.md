# Troubleshooting: Error "Failed to create user"

## ❌ Masalah

Saat membuat user baru di Supabase Auth Dashboard, muncul error:
```
Failed to create user: API error happened while trying to communicate with the server.
```

## 🔍 Penyebab

Error ini terjadi karena **RLS (Row Level Security)** memblokir INSERT dari trigger `handle_new_user()` ke tabel `public.users`.

Ketika user baru dibuat di `auth.users`, trigger `on_auth_user_created` mencoba INSERT ke `public.users`, tapi RLS policies yang ada tidak mengizinkan INSERT tanpa auth check.

## ✅ Solusi

### Langkah 1: Jalankan Fix Script

Jalankan script berikut di Supabase SQL Editor:

```sql
-- File: supabase/FIX_TRIGGER_ERROR.sql
-- Copy seluruh isi file dan jalankan di SQL Editor
```

Atau jalankan query ini:

```sql
-- 1. Update function dengan error handling yang lebih baik
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.email, ''),
      'sekolah'::user_role
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error inserting user to public.users: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Buat policy khusus untuk INSERT via trigger
DROP POLICY IF EXISTS "Allow trigger to insert users" ON public.users;

CREATE POLICY "Allow trigger to insert users"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- 3. Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
```

### Langkah 2: Test Create User

1. Buka **Authentication** → **Users**
2. Klik **Add User** → **Create new user**
3. Isi email dan password
4. Centang **Auto Confirm User**
5. Klik **Create User**

**✅ Seharusnya sekarang berhasil!**

### Langkah 3: Verifikasi

Jalankan query ini untuk memastikan user sudah masuk ke `public.users`:

```sql
SELECT id, email, role, created_at 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5;
```

## 🔧 Alternatif Solusi (Jika masih error)

### Solusi 1: Nonaktifkan RLS sementara (untuk testing)

```sql
-- HATI-HATI: Hanya untuk testing!
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Test create user
-- Setelah berhasil, aktifkan kembali RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Pastikan policy untuk INSERT sudah ada
CREATE POLICY "Allow trigger to insert users"
  ON public.users
  FOR INSERT
  WITH CHECK (true);
```

### Solusi 2: Manual insert user (workaround)

Jika trigger masih error, insert manual user ke `public.users`:

```sql
-- 1. Buat user di Supabase Auth Dashboard
-- 2. Setelah user dibuat, ambil ID dari auth.users
SELECT id, email FROM auth.users WHERE email = 'user@example.com';

-- 3. Insert manual ke public.users
INSERT INTO public.users (id, email, role)
VALUES (
  'user-id-dari-query-di-atas',
  'user@example.com',
  'sekolah'::user_role
)
ON CONFLICT (id) DO NOTHING;
```

## 📝 Catatan Penting

1. **Policy "Allow trigger to insert users"** sangat penting - tanpa ini, trigger akan gagal
2. Function `handle_new_user()` harus menggunakan `SECURITY DEFINER` dan `SET search_path = public`
3. Grant `EXECUTE` permission ke `service_role` penting untuk trigger
4. Error handling di function memastikan jika ada error, user tetap bisa dibuat di `auth.users`

## 🐛 Debugging

Jika masih error, cek log Supabase:

1. Buka **Logs** → **Postgres Logs**
2. Cari error terkait `handle_new_user` atau `public.users`
3. Error message akan menunjukkan penyebab spesifik

Atau jalankan query ini untuk test trigger:

```sql
-- Test function secara langsung (jika ada user di auth.users)
SELECT public.handle_new_user() 
FROM auth.users 
WHERE email = 'test@example.com' 
LIMIT 1;
```

## ✅ Checklist

- [ ] Function `handle_new_user()` sudah menggunakan `SECURITY DEFINER`
- [ ] Policy "Allow trigger to insert users" sudah dibuat
- [ ] Grant `EXECUTE` ke `service_role` sudah diberikan
- [ ] Trigger `on_auth_user_created` sudah aktif
- [ ] Test create user berhasil
- [ ] User muncul di tabel `public.users`

