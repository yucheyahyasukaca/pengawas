-- ============================================
-- FIX: ENUM Already Exists Error
-- ============================================
-- Script ini memperbaiki error "type user_role already exists"
-- ============================================
-- Jika ENUM sudah ada, script ini tidak akan error
-- ============================================

-- Buat ENUM untuk role (jika belum ada)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'pengawas', 'korwas_cabdin', 'sekolah');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tambah kolom status_approval (jika belum ada)
DO $$ BEGIN
  ALTER TABLE public.users 
  ADD COLUMN status_approval TEXT DEFAULT 'approved' 
  CHECK (status_approval IN ('pending', 'approved', 'rejected'));
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- Set default status untuk pengawas yang sudah ada
UPDATE public.users 
SET status_approval = 'approved' 
WHERE role = 'pengawas' AND (status_approval IS NULL OR status_approval = '');

-- Set default status untuk role lain
UPDATE public.users 
SET status_approval = 'approved' 
WHERE role IN ('admin', 'korwas_cabdin', 'sekolah') AND (status_approval IS NULL OR status_approval = '');

-- Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_status_approval ON public.users(status_approval) WHERE role = 'pengawas';
CREATE INDEX IF NOT EXISTS idx_users_pending_approval ON public.users(role, status_approval) WHERE role = 'pengawas' AND status_approval = 'pending';

-- ============================================
-- SCRIPT SELESAI!
-- ============================================
-- Script ini bisa dijalankan berulang kali tanpa error
-- ============================================

