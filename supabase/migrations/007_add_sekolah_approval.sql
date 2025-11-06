-- ============================================
-- Migration: Add Sekolah Approval System
-- ============================================
-- Menambahkan sistem approval untuk pendaftaran sekolah
-- ============================================

-- 1. Update status_approval untuk sekolah (default pending)
-- Kolom status_approval sudah ada dari migration sebelumnya
-- Pastikan sekolah baru memiliki status 'pending'

-- 2. Set default status untuk sekolah yang sudah ada menjadi 'approved'
UPDATE public.users 
SET status_approval = 'approved' 
WHERE role = 'sekolah' AND (status_approval IS NULL OR status_approval = '');

-- 3. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_sekolah_status_approval ON public.users(status_approval) WHERE role = 'sekolah';
CREATE INDEX IF NOT EXISTS idx_users_sekolah_pending_approval ON public.users(role, status_approval) WHERE role = 'sekolah' AND status_approval = 'pending';

-- 4. Buat function untuk approve sekolah
CREATE OR REPLACE FUNCTION public.approve_sekolah(sekolah_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users
  SET status_approval = 'approved',
      updated_at = NOW()
  WHERE id = sekolah_user_id 
    AND role = 'sekolah'
    AND status_approval = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Buat function untuk reject sekolah
CREATE OR REPLACE FUNCTION public.reject_sekolah(sekolah_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.users
  SET status_approval = 'rejected',
      updated_at = NOW()
  WHERE id = sekolah_user_id 
    AND role = 'sekolah'
    AND status_approval = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant permissions
GRANT EXECUTE ON FUNCTION public.approve_sekolah(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_sekolah(UUID) TO authenticated;

-- 7. Update RLS policies untuk sekolah
-- Sekolah dengan status pending/rejected tidak bisa akses dashboard
-- Policy sudah ada di migration sebelumnya, hanya perlu memastikan status_approval check

