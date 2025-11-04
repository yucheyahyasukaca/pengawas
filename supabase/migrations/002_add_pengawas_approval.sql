-- ============================================
-- Migration: Add Pengawas Approval System
-- ============================================
-- Menambahkan sistem approval untuk pendaftaran pengawas
-- ============================================

-- 1. Tambah kolom status_approval ke tabel users
DO $$ BEGIN
  ALTER TABLE public.users 
  ADD COLUMN status_approval TEXT DEFAULT 'pending' 
  CHECK (status_approval IN ('pending', 'approved', 'rejected'));
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- 2. Set default status untuk pengawas yang sudah ada
UPDATE public.users 
SET status_approval = 'approved' 
WHERE role = 'pengawas' AND status_approval IS NULL;

-- 3. Set default status untuk role lain
UPDATE public.users 
SET status_approval = 'approved' 
WHERE role IN ('admin', 'korwas_cabdin', 'sekolah') AND status_approval IS NULL;

-- 4. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_status_approval ON public.users(status_approval) WHERE role = 'pengawas';
CREATE INDEX IF NOT EXISTS idx_users_pending_approval ON public.users(role, status_approval) WHERE role = 'pengawas' AND status_approval = 'pending';

-- 5. Buat function untuk approve pengawas
CREATE OR REPLACE FUNCTION public.approve_pengawas(pengawas_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users
  SET status_approval = 'approved',
      updated_at = NOW()
  WHERE id = pengawas_id 
    AND role = 'pengawas'
    AND status_approval = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Buat function untuk reject pengawas
CREATE OR REPLACE FUNCTION public.reject_pengawas(pengawas_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users
  SET status_approval = 'rejected',
      updated_at = NOW()
  WHERE id = pengawas_id 
    AND role = 'pengawas'
    AND status_approval = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant permissions
GRANT EXECUTE ON FUNCTION public.approve_pengawas(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_pengawas(UUID) TO authenticated;

-- ============================================
-- CATATAN:
-- ============================================
-- Status approval:
-- - 'pending': Menunggu persetujuan admin
-- - 'approved': Sudah disetujui, bisa akses dashboard
-- - 'rejected': Ditolak oleh admin
-- ============================================

