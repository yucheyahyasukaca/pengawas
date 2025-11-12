# Debug: Data Guru Tidak Muncul di Halaman Pengawas

## Masalah
Data guru yang diinput oleh sekolah tidak muncul di halaman pengawas (`/pengawas/manajemen-data/sekolah/[id]`).

## Langkah Debugging

### 1. Periksa Console Browser
Buka browser console (F12) dan lihat log yang muncul. Anda akan melihat:
- `=== Frontend: Full API Response ===` - Data yang diterima dari API
- `=== PROFIL GURU TAB DEBUG ===` - Data yang diproses di komponen ProfilGuruTab

**Yang perlu diperhatikan:**
- Apakah `profil_guru` null atau undefined?
- Apakah `profil_guru.detail` ada?
- Apakah `profil_guru.detail` adalah array?
- Berapa panjang array `profil_guru.detail`?

### 2. Periksa Console Server (Terminal)
Lihat log di terminal tempat server Next.js berjalan. Anda akan melihat:
- `=== API Response Debug ===` - Data yang dikembalikan dari database

**Yang perlu diperhatikan:**
- Apakah `profil_guru` null atau undefined?
- Apakah struktur data sesuai dengan yang diharapkan?

### 3. Periksa Database dengan SQL Query
Jalankan query SQL di Supabase SQL Editor menggunakan file `check_profil_guru.sql`.

**Query penting untuk memeriksa:**
```sql
-- Cek data profil_guru untuk sekolah tertentu
SELECT 
  id,
  nama_sekolah,
  profil_guru,
  jsonb_typeof(profil_guru) as profil_guru_type,
  profil_guru->'detail' as detail_array,
  jsonb_typeof(profil_guru->'detail') as detail_type,
  CASE 
    WHEN profil_guru->'detail' IS NULL THEN 'detail key tidak ada'
    WHEN jsonb_typeof(profil_guru->'detail') = 'array' THEN 
      'Array dengan ' || jsonb_array_length(profil_guru->'detail') || ' elemen'
    ELSE 'Bukan array'
  END as detail_status
FROM sekolah
WHERE id = 'efb9cda1-256a-40a1-903e-197723dc0a91';
```

### 4. Kemungkinan Masalah dan Solusi

#### Masalah 1: `profil_guru` adalah NULL
**Gejala:** Di console terlihat `profil_guru is null: true`

**Solusi:**
- Pastikan sekolah sudah menginput data guru melalui halaman profil sekolah
- Periksa apakah data benar-benar tersimpan di database

#### Masalah 2: `profil_guru` adalah object kosong `{}`
**Gejala:** `profil_guru` ada tapi tidak ada key `detail`

**Solusi:**
- Data mungkin belum diinput dengan benar
- Periksa apakah sekolah sudah menyimpan data dengan struktur yang benar:
  ```json
  {
    "detail": [
      {
        "nama": "Nama Guru",
        "nip": "123456789",
        ...
      }
    ]
  }
  ```

#### Masalah 3: `profil_guru.detail` bukan array
**Gejala:** `profil_guru.detail` ada tapi bukan array

**Solusi:**
- Struktur data mungkin salah
- Periksa struktur data di database dan pastikan `detail` adalah array

#### Masalah 4: `profil_guru.detail` adalah array kosong `[]`
**Gejala:** Array ada tapi panjangnya 0

**Solusi:**
- Data belum diinput oleh sekolah
- Minta sekolah untuk menginput data guru

### 5. Perbaikan Manual di Database (Jika Diperlukan)

Jika data ada tapi strukturnya salah, Anda bisa memperbaikinya dengan query SQL:

```sql
-- Contoh: Memperbaiki struktur profil_guru
-- Pastikan struktur adalah: { "detail": [...] }

UPDATE sekolah
SET profil_guru = jsonb_build_object(
  'detail', 
  COALESCE(
    CASE 
      WHEN profil_guru->'detail' IS NOT NULL 
        AND jsonb_typeof(profil_guru->'detail') = 'array' 
      THEN profil_guru->'detail'
      ELSE '[]'::jsonb
    END,
    '[]'::jsonb
  )
)
WHERE id = 'efb9cda1-256a-40a1-903e-197723dc0a91'
  AND (
    profil_guru IS NULL 
    OR profil_guru = '{}'::jsonb
    OR profil_guru->'detail' IS NULL
    OR jsonb_typeof(profil_guru->'detail') != 'array'
  );
```

### 6. Struktur Data yang Benar

Data `profil_guru` harus memiliki struktur seperti ini:

```json
{
  "detail": [
    {
      "nama": "Nama Guru",
      "nip": "123456789",
      "tanggal_lahir": "1985-01-01",
      "jenis_kelamin": "Laki-laki",
      "status": "PNS",
      "status_kepegawaian": "PNS",
      "pendidikan": "S1/D4",
      "jurusan": "Pendidikan Matematika",
      "mata_pelajaran": "Matematika",
      "jumlah_jam": 24,
      "waka": false,
      "kepala_lab": false,
      "wali_kelas": true,
      "guru_wali": false,
      "ekstrakurikuler": false,
      "lainnya": "",
      "tanggal_purna_tugas": null
    }
  ]
}
```

### 7. Verifikasi Data dari Halaman Sekolah

1. Login sebagai sekolah
2. Buka halaman profil sekolah (`/sekolah/profil`)
3. Pilih tab "Profil Guru"
4. Pastikan ada data guru yang sudah diinput
5. Klik "Simpan" jika belum disimpan
6. Refresh halaman pengawas

## Informasi yang Diperlukan untuk Debugging

Jika masalah masih terjadi, siapkan informasi berikut:

1. **Console Browser Logs** - Copy semua log yang muncul di console browser
2. **Server Logs** - Copy semua log yang muncul di terminal server
3. **Hasil SQL Query** - Jalankan query di `check_profil_guru.sql` dan copy hasilnya
4. **ID Sekolah** - ID sekolah yang bermasalah (dari URL)
5. **Screenshot** - Screenshot halaman yang menunjukkan masalah

## Catatan

- Pastikan server Next.js sudah di-restart setelah perubahan kode
- Clear cache browser jika diperlukan
- Periksa apakah ada error di Network tab di browser DevTools

