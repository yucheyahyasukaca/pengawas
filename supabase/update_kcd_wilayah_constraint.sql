-- ============================================
-- Script: Update KCD Wilayah Constraint to 1-13
-- ============================================
-- Jalankan script ini di Supabase SQL Editor
-- untuk mengupdate constraint KCD Wilayah dari 1-12 menjadi 1-13
-- ============================================

-- Drop semua constraint yang terkait dengan kcd_wilayah
DO $$
DECLARE
  constraint_rec RECORD;
BEGIN
  -- Cari dan hapus semua constraint CHECK untuk kolom kcd_wilayah
  FOR constraint_rec IN
    SELECT conname, conrelid
    FROM pg_constraint
    WHERE conrelid = 'public.sekolah'::regclass
      AND contype = 'c'  -- CHECK constraint
      AND pg_get_constraintdef(oid) LIKE '%kcd_wilayah%'
  LOOP
    EXECUTE format('ALTER TABLE public.sekolah DROP CONSTRAINT IF EXISTS %I', constraint_rec.conname);
    RAISE NOTICE 'Dropped constraint: %', constraint_rec.conname;
  END LOOP;
END $$;

-- Tambahkan constraint baru dengan range 1-13
ALTER TABLE public.sekolah 
ADD CONSTRAINT sekolah_kcd_wilayah_check 
CHECK (kcd_wilayah >= 1 AND kcd_wilayah <= 13);

-- Verifikasi constraint sudah terupdate
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.sekolah'::regclass
  AND conname = 'sekolah_kcd_wilayah_check';

