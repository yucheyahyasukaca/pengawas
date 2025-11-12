# Fix Storage Policy Syntax Error

Jika Anda mendapat error syntax saat membuat storage policy, gunakan salah satu format berikut:

## Error yang Terjadi

```
ERROR: 42601: syntax error at or near "EXISTS"
```

Ini terjadi karena Supabase Storage policies menggunakan format yang sedikit berbeda.

## Solusi: Gunakan Format yang Benar

### Policy 1: INSERT (Upload) - Pilih salah satu format

#### Format 1: Dengan bucket_id check (Recommended)
```sql
(bucket_id = 'forum-attachments' AND EXISTS (
  SELECT 1 FROM public.users
  WHERE users.id = auth.uid()
  AND users.role = 'pengawas'
  AND users.status_approval = 'approved'
))
```

#### Format 2: Tanpa EXISTS (Alternatif)
```sql
(bucket_id = 'forum-attachments' AND 
 (SELECT role FROM public.users WHERE id = auth.uid()) = 'pengawas' AND
 (SELECT status_approval FROM public.users WHERE id = auth.uid()) = 'approved')
```

#### Format 3: Paling Sederhana (Jika masih error)
```sql
EXISTS (
  SELECT 1 FROM public.users
  WHERE users.id = auth.uid()
  AND users.role = 'pengawas'
  AND users.status_approval = 'approved'
)
```

### Policy 2: SELECT (View) - Untuk bucket public

```sql
bucket_id = 'forum-attachments'
```

ATAU kosongkan saja (karena bucket sudah public).

## Cara Membuat Policy di Supabase Dashboard

1. Buka Supabase Dashboard → Storage → `forum-attachments` bucket
2. Klik tab **"Policies"**
3. Klik **"New Policy"**
4. Pilih **"For full customization"** atau **"Create a policy from scratch"**
5. Isi form:
   - **Policy name**: `Pengawas can upload files`
   - **Allowed operation**: **INSERT**
   - **Policy definition**: Copy-paste salah satu format di atas (mulai dari Format 1, jika error coba Format 2, dst)
6. Klik **"Review"** → **"Save policy"**

## Tips

- Jika Format 1 error, coba Format 2
- Jika Format 2 error, coba Format 3
- Pastikan tidak ada typo atau karakter tambahan
- Pastikan bucket name `forum-attachments` sudah benar
- Setelah policy dibuat, test dengan upload gambar

## Verifikasi Policy

Setelah policy dibuat, cek di tab Policies apakah policy sudah muncul dengan status "Active".

Jika masih error, screenshot error message dan coba format lain.

