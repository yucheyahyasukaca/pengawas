-- ============================================
-- Query untuk memeriksa data profil_guru di database
-- ============================================
-- Jalankan query ini di Supabase SQL Editor untuk memeriksa struktur data

-- 1. Cek apakah kolom profil_guru ada dan tipe datanya
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'sekolah' 
  AND column_name = 'profil_guru';

-- 2. Cek data profil_guru untuk sekolah tertentu (ganti ID dengan ID sekolah Anda)
-- ID sekolah dari URL: efb9cda1-256a-40a1-903e-197723dc0a91
SELECT 
  id,
  nama_sekolah,
  profil_guru,
  jsonb_typeof(profil_guru) as profil_guru_type,
  CASE 
    WHEN profil_guru IS NULL THEN 'NULL'
    WHEN profil_guru = '{}'::jsonb THEN 'Empty object {}'
    WHEN profil_guru = '[]'::jsonb THEN 'Empty array []'
    WHEN jsonb_typeof(profil_guru) = 'object' THEN 
      'Object with keys: ' || array_to_string(ARRAY(SELECT jsonb_object_keys(profil_guru)), ', ')
    ELSE 'Other type'
  END as profil_guru_status
FROM sekolah
WHERE id = 'efb9cda1-256a-40a1-903e-197723dc0a91';

-- 3. Cek struktur detail di dalam profil_guru (jika ada)
SELECT 
  id,
  nama_sekolah,
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

-- 4. Lihat contoh data guru pertama (jika ada)
SELECT 
  id,
  nama_sekolah,
  profil_guru->'detail'->0 as first_guru,
  jsonb_pretty(profil_guru->'detail'->0) as first_guru_pretty
FROM sekolah
WHERE id = 'efb9cda1-256a-40a1-903e-197723dc0a91'
  AND profil_guru->'detail' IS NOT NULL
  AND jsonb_array_length(profil_guru->'detail') > 0;

-- 5. Hitung jumlah guru per sekolah (untuk semua sekolah)
SELECT 
  id,
  nama_sekolah,
  CASE 
    WHEN profil_guru IS NULL THEN 0
    WHEN profil_guru->'detail' IS NULL THEN 0
    WHEN jsonb_typeof(profil_guru->'detail') != 'array' THEN 0
    ELSE jsonb_array_length(profil_guru->'detail')
  END as jumlah_guru
FROM sekolah
ORDER BY jumlah_guru DESC;

-- 6. Cek semua sekolah yang memiliki data guru
SELECT 
  id,
  nama_sekolah,
  jsonb_array_length(profil_guru->'detail') as jumlah_guru
FROM sekolah
WHERE profil_guru IS NOT NULL
  AND profil_guru->'detail' IS NOT NULL
  AND jsonb_typeof(profil_guru->'detail') = 'array'
  AND jsonb_array_length(profil_guru->'detail') > 0
ORDER BY jumlah_guru DESC;

