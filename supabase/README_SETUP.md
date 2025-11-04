# Setup Supabase untuk Role-Based Authentication

## Langkah-langkah Setup

### 1. Jalankan SQL Script di Supabase

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Pergi ke **SQL Editor**
4. Copy seluruh isi file `supabase/migrations/001_create_roles_and_users.sql`
5. Paste ke SQL Editor
6. Klik **Run** untuk menjalankan script

### 2. Buat User di Supabase Auth

Setelah script berhasil dijalankan, buat user melalui salah satu cara berikut:

#### Cara 1: Via Supabase Dashboard
1. Buka **Authentication** > **Users**
2. Klik **Add User** > **Create new user**
3. Isi email dan password
4. Set email sebagai verified (centang **Auto Confirm User**)

#### Cara 2: Via SQL (untuk testing)
```sql
-- Insert user ke auth.users (gunakan dengan hati-hati)
-- Catatan: Password akan di-hash oleh Supabase Auth
-- Cara yang lebih aman adalah melalui Supabase Dashboard atau Auth API
```

### 3. Set Role User

Setelah user dibuat, update role di tabel `public.users`:

```sql
-- Set role sebagai admin
UPDATE public.users 
SET role = 'admin'::user_role 
WHERE email = 'mkps@garuda-21.com';

-- Set role sebagai pengawas
UPDATE public.users 
SET role = 'pengawas'::user_role 
WHERE email = 'pengawas@example.com';

-- Set role sebagai korwas cabdin
UPDATE public.users 
SET role = 'korwas_cabdin'::user_role 
WHERE email = 'korwas@example.com';

-- Set role sebagai sekolah
UPDATE public.users 
SET role = 'sekolah'::user_role 
WHERE email = 'sekolah@example.com';
```

### 4. Verifikasi Setup

Jalankan query berikut untuk memastikan setup berhasil:

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

-- Cek apakah trigger bekerja dengan baik
-- (User baru yang dibuat di auth.users akan otomatis masuk ke public.users)
```

## Role dan Redirect Path

| Role | Redirect Path | Dashboard |
|------|--------------|-----------|
| `admin` | `/admin` | Dashboard Admin |
| `pengawas` | `/pengawas` | Dashboard Pengawas |
| `korwas_cabdin` | `/korwas-cabdin` | Dashboard Korwas Cabdin (TODO) |
| `sekolah` | `/sekolah` | Dashboard Sekolah (TODO) |

## Metadata JSONB

Kolom `metadata` dapat digunakan untuk menyimpan data tambahan berdasarkan role:

### Untuk Pengawas:
```json
{
  "wilayah_tugas": "Kota Semarang",
  "jumlah_sekolah_binaan": 8,
  "cabang_dinas": "Cabang Dinas Pendidikan Wilayah I"
}
```

### Untuk Sekolah:
```json
{
  "npsn": "20325123",
  "alamat": "Jl. Raya Semarang - Salatiga KM 15",
  "kabupaten": "Kota Semarang",
  "jenis": "Negeri"
}
```

### Untuk Korwas Cabdin:
```json
{
  "cabang_dinas": "Cabang Dinas Pendidikan Wilayah I",
  "wilayah": "Kota Semarang, Kabupaten Semarang",
  "jumlah_pengawas": 15
}
```

## Troubleshooting

### User tidak muncul di public.users
- Pastikan trigger `on_auth_user_created` sudah dibuat
- Cek apakah user sudah dibuat di `auth.users`
- Jika user sudah ada, insert manual:
  ```sql
  INSERT INTO public.users (id, email, role)
  SELECT id, email, 'sekolah'::user_role
  FROM auth.users
  WHERE email = 'user@example.com'
  ON CONFLICT (id) DO NOTHING;
  ```

### Role tidak terdeteksi saat login
- Pastikan user sudah di-set role di tabel `public.users`
- Cek apakah RLS policies sudah aktif
- Pastikan user sudah login dan memiliki session yang valid

### Error "relation users does not exist"
- Pastikan script SQL sudah dijalankan dengan benar
- Cek apakah tabel `public.users` sudah dibuat
- Pastikan Anda menggunakan schema `public`

## Security Notes

1. **RLS (Row Level Security)** sudah diaktifkan untuk tabel `users`
2. Users hanya dapat melihat dan mengupdate data mereka sendiri
3. Admin dapat melihat dan mengupdate semua users
4. Function `get_user_role()` dan `get_user_with_role()` menggunakan `SECURITY DEFINER` untuk keamanan

## Next Steps

Setelah setup selesai:
1. Buat user untuk setiap role
2. Test login dengan setiap role
3. Verifikasi redirect path sesuai role
4. Buat dashboard untuk role `korwas_cabdin` dan `sekolah` jika diperlukan

