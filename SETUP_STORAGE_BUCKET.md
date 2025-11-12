# Setup Storage Bucket untuk Forum

Error "Bucket not found" berarti storage bucket `forum-attachments` belum dibuat di Supabase.

## Cara Membuat Bucket (Via Supabase Dashboard)

### Langkah 1: Buka Storage di Supabase Dashboard

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Klik menu **Storage** di sidebar kiri

### Langkah 2: Buat Bucket Baru

1. Klik tombol **"New bucket"** atau **"Create bucket"**
2. Isi form dengan detail berikut:
   - **Name**: `forum-attachments` (harus sama persis, case-sensitive)
   - **Public bucket**: ✅ **YES** (centang ini agar gambar bisa diakses publik)
   - **File size limit**: `5` (dalam MB)
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`
3. Klik **"Create bucket"** atau **"Save"**

### Langkah 3: Setup Storage Policies

Setelah bucket dibuat, Anda perlu membuat policies agar pengawas bisa upload file:

#### Policy 1: Pengawas dapat upload file

1. Klik bucket `forum-attachments` yang baru dibuat
2. Klik tab **"Policies"**
3. Klik **"New Policy"**
4. Pilih **"Create a policy from scratch"** atau **"For full customization"**
5. Isi form:
   - **Policy name**: `Pengawas can upload files`
   - **Allowed operation**: Pilih **INSERT**
   - **Policy definition**: Copy-paste SQL berikut (gunakan format WITH CHECK):

```sql
(bucket_id = 'forum-attachments' AND EXISTS (
  SELECT 1 FROM public.users
  WHERE users.id = auth.uid()
  AND users.role = 'pengawas'
  AND users.status_approval = 'approved'
))
```

   **ATAU** jika menggunakan format yang lebih sederhana:

```sql
EXISTS (
  SELECT 1 FROM public.users
  WHERE users.id = auth.uid()
  AND users.role = 'pengawas'
  AND users.status_approval = 'approved'
)
```

   **Catatan**: Jika error masih muncul, coba gunakan format ini (tanpa EXISTS di awal):

```sql
(bucket_id = 'forum-attachments' AND 
 (SELECT role FROM public.users WHERE id = auth.uid()) = 'pengawas' AND
 (SELECT status_approval FROM public.users WHERE id = auth.uid()) = 'approved')
```

6. Klik **"Review"** lalu **"Save policy"**

#### Policy 2: Siapa saja dapat melihat file (karena bucket public)

1. Klik **"New Policy"** lagi
2. Isi form:
   - **Policy name**: `Anyone can view files`
   - **Allowed operation**: Pilih **SELECT**
   - **Policy definition**: 
     - Jika bucket sudah public, bisa dikosongkan
     - Atau gunakan: `bucket_id = 'forum-attachments'`
3. Klik **"Review"** lalu **"Save policy"**

### Langkah 4: Verifikasi

Setelah bucket dan policies dibuat:

1. Refresh halaman forum di aplikasi
2. Coba upload gambar di form buat topik
3. Jika berhasil, gambar akan muncul di preview

## Alternatif: Membuat Bucket via SQL (Advanced)

Jika Anda lebih suka menggunakan SQL, Anda bisa menjalankan query berikut di SQL Editor:

```sql
-- Catatan: Membuat bucket via SQL memerlukan extension yang mungkin tidak tersedia
-- Cara terbaik adalah melalui Dashboard seperti di atas

-- Jika ingin mencoba via SQL, pastikan extension storage sudah diaktifkan
-- CREATE EXTENSION IF NOT EXISTS storage;
```

**Rekomendasi**: Gunakan Dashboard karena lebih mudah dan visual.

## Troubleshooting

### Error: "Bucket not found"
- Pastikan nama bucket adalah `forum-attachments` (exact match, case-sensitive)
- Pastikan bucket sudah dibuat dan aktif
- Refresh halaman aplikasi setelah membuat bucket

### Error: "Permission denied" saat upload
- Pastikan Policy 1 (INSERT) sudah dibuat dengan kondisi yang benar
- Pastikan user yang login adalah pengawas dengan status approval "approved"
- Cek di tabel `users` apakah role dan status_approval sudah benar

### Error: "File tidak bisa diakses" setelah upload
- Pastikan bucket adalah **Public bucket** (bukan private)
- Pastikan Policy 2 (SELECT) sudah dibuat
- Cek URL file di browser, pastikan bisa diakses

### Gambar tidak muncul setelah upload
- Cek console browser untuk error
- Pastikan URL file valid
- Pastikan bucket public dan policy SELECT sudah dibuat

## Catatan Penting

1. **Nama bucket harus exact**: `forum-attachments` (huruf kecil, dengan tanda hubung)
2. **Bucket harus public**: Agar gambar bisa diakses tanpa authentication
3. **File size limit**: Maksimal 5MB per file
4. **MIME types**: Hanya gambar yang diizinkan (JPEG, PNG, GIF, WebP)

Setelah bucket dibuat, semua fitur upload gambar akan berfungsi dengan baik!

