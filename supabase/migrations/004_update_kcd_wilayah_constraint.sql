-- ============================================
-- Migration: Update KCD Wilayah Constraint to 1-13
-- ============================================
-- Update constraint untuk memperbolehkan KCD Wilayah 13
-- ============================================

-- Drop constraint lama jika ada
ALTER TABLE public.sekolah DROP CONSTRAINT IF EXISTS sekolah_kcd_wilayah_check;

-- Tambahkan constraint baru dengan range 1-13
ALTER TABLE public.sekolah 
ADD CONSTRAINT sekolah_kcd_wilayah_check 
CHECK (kcd_wilayah >= 1 AND kcd_wilayah <= 13);

