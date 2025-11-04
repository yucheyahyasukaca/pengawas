# Instruksi Setup Supabase untuk Role-Based Authentication

## 📋 Ringkasan

Sistem ini menggunakan 4 role:
- **admin** → Dashboard `/admin`
- **pengawas** → Dashboard `/pengawas`
- **korwas_cabdin** → Dashboard `/korwas-cabdin` (TODO: belum dibuat)
- **sekolah** → Dashboard `/sekolah` (TODO: belum dibuat)

## 🚀 Langkah-langkah Setup

### Langkah 1: Jalankan SQL Script di Supabase

1. Buka **Supabase Dashboard** → https://supabase.com/dashboard
2. Pilih project Anda
3. Klik menu **SQL Editor** di sidebar kiri
4. Buka file `supabase/QUICK_SETUP.sql` atau copy script di bawah ini
5. **Copy seluruh isi script** dan paste ke SQL Editor
6. Klik tombol **Run** (atau tekan `Ctrl+Enter` / `Cmd+Enter`)

```sql
-- Script lengkap ada di file: supabase/QUICK_SETUP.sql
```

**✅ Setelah script berhasil dijalankan, Anda akan melihat:**
- ✅ Tabel `public.users` dibuat
- ✅ ENUM `user_role` dibuat
- ✅ Trigger dan function dibuat
- ✅ RLS policies dibuat

### Langkah 2: Buat User di Supabase Auth

Ada 2 cara untuk membuat user:

#### **Cara 1: Via Supabase Dashboard (Recommended)**

1. Buka **Authentication** → **Users**
2. Klik tombol **Add User** → **Create new user**
3. Isi form:
   - **Email**: contoh `admin@example.com`
   - **Password**: buat password yang kuat
   - Centang **Auto Confirm User** (penting!)
4. Klik **Create User**

**Catatan:** User baru akan otomatis masuk ke tabel `public.users` dengan role default `sekolah` (berkat trigger yang sudah dibuat)

#### **Cara 2: Via Supabase Auth API**

Gunakan Supabase Auth API untuk membuat user programmatically (untuk development/testing).

### Langkah 3: Set Role User

Setelah user dibuat, update role-nya di tabel `public.users`:

1. Buka **SQL Editor** lagi
2. Jalankan query berikut (sesuaikan email dan role):

```sql
-- Set role sebagai ADMIN
UPDATE public.users 
SET role = 'admin'::user_role,
    nama = 'Admin MKPS'
WHERE email = 'mkps@garuda-21.com';

-- Set role sebagai PENGAWAS
UPDATE public.users 
SET role = 'pengawas'::user_role,
    nama = 'Nama Pengawas',
    nip = '196512151988031001'
WHERE email = 'pengawas@example.com';

-- Set role sebagai KORWAS CABDIN
UPDATE public.users 
SET role = 'korwas_cabdin'::user_role,
    nama = 'Nama Korwas'
WHERE email = 'korwas@example.com';

-- Set role sebagai SEKOLAH
UPDATE public.users 
SET role = 'sekolah'::user_role,
    nama = 'Nama Sekolah'
WHERE email = 'sekolah@example.com';
```

### Langkah 4: Verifikasi Setup

Jalankan query berikut untuk memastikan semua berjalan dengan baik:

```sql
-- Cek semua users dan role-nya
SELECT 
  u.id,
  u.email,
  u.role,
  u.nama,
  u.nip,
  u.created_at
FROM public.users u
ORDER BY u.created_at DESC;
```

**Expected Output:**
```
id                                  | email              | role          | nama         | nip
------------------------------------+--------------------+---------------+--------------+----------
uuid-here                           | admin@example.com  | admin         | Admin MKPS   | NULL
uuid-here                           | pengawas@example  | pengawas      | Nama Pengawas| 196512...
```

### Langkah 5: Test Login

1. Buka aplikasi Anda
2. Pergi ke halaman login
3. Login dengan email dan password yang sudah dibuat
4. **Verifikasi redirect:**
   - Admin → `/admin`
   - Pengawas → `/pengawas`
   - Korwas Cabdin → `/korwas-cabdin`
   - Sekolah → `/sekolah`

## 🔧 Troubleshooting

### ❌ User tidak muncul di `public.users`

**Penyebab:** Trigger belum berjalan atau user dibuat sebelum trigger dibuat

**Solusi:**
```sql
-- Insert manual user yang sudah ada di auth.users
INSERT INTO public.users (id, email, role)
SELECT id, email, 'sekolah'::user_role
FROM auth.users
WHERE email = 'user@example.com'
ON CONFLICT (id) DO NOTHING;
```

### ❌ Role tidak terdeteksi saat login

**Penyebab:** User belum di-set role atau RLS block access

**Solusi:**
1. Pastikan user sudah di-set role:
   ```sql
   SELECT id, email, role FROM public.users WHERE email = 'your-email@example.com';
   ```
2. Jika role `NULL` atau `sekolah`, update:
   ```sql
   UPDATE public.users 
   SET role = 'admin'::user_role 
   WHERE email = 'your-email@example.com';
   ```

### ❌ Error "relation users does not exist"

**Penyebab:** Script SQL belum dijalankan atau ada error saat menjalankan

**Solusi:**
1. Cek apakah tabel sudah dibuat:
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'users';
   ```
2. Jika tidak ada, jalankan script SQL lagi

### ❌ Error "permission denied"

**Penyebab:** RLS policies terlalu ketat atau user belum login

**Solusi:**
1. Pastikan user sudah login (ada session)
2. Cek policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'users';
   ```

## 📝 Contoh Queries Berguna

### Cek semua users dengan role
```sql
SELECT 
  u.email,
  u.role,
  u.nama,
  u.created_at
FROM public.users u
ORDER BY u.role, u.created_at DESC;
```

### Update role multiple users
```sql
-- Update role untuk semua user dengan domain tertentu
UPDATE public.users 
SET role = 'pengawas'::user_role
WHERE email LIKE '%@mkps.jateng.go.id';
```

### Update metadata user
```sql
-- Update metadata untuk pengawas
UPDATE public.users 
SET metadata = jsonb_build_object(
  'wilayah_tugas', 'Kota Semarang',
  'jumlah_sekolah_binaan', 8,
  'cabang_dinas', 'Cabang Dinas Pendidikan Wilayah I'
)
WHERE email = 'pengawas@example.com';
```

### Hapus user (jika perlu)
```sql
-- Hapus dari public.users (akan cascade delete dari auth.users jika ada FK)
DELETE FROM public.users WHERE email = 'user@example.com';

-- Atau hapus dari auth.users (akan cascade ke public.users)
-- Lakukan via Supabase Dashboard: Authentication → Users → Delete
```

## 🎯 Next Steps

Setelah setup selesai:

1. ✅ Buat user untuk setiap role (admin, pengawas, korwas_cabdin, sekolah)
2. ✅ Test login dengan setiap role
3. ✅ Verifikasi redirect path sesuai role
4. ✅ Buat dashboard untuk `korwas_cabdin` dan `sekolah` (jika diperlukan)
5. ✅ Update metadata user sesuai kebutuhan

## 📚 Referensi

- File SQL lengkap: `supabase/QUICK_SETUP.sql`
- File migration detail: `supabase/migrations/001_create_roles_and_users.sql`
- Dokumentasi setup: `supabase/README_SETUP.md`

## ⚠️ Catatan Penting

1. **Jangan hapus trigger** `on_auth_user_created` - ini penting untuk auto-sync user baru
2. **RLS sudah aktif** - pastikan user sudah login untuk mengakses data
3. **Default role adalah `sekolah`** - user baru akan otomatis mendapat role ini
4. **Hanya admin yang bisa update role** - untuk keamanan, hanya admin bisa mengubah role user lain

