-- ============================================
-- QUICK SETUP SQL - Copy & Paste ke Supabase SQL Editor
-- ============================================
-- Script ini lengkap dan siap dijalankan langsung di Supabase
-- ============================================

-- 1. Buat ENUM untuk role (jika belum ada)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'pengawas', 'korwas_cabdin', 'sekolah');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Buat tabel users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'sekolah',
  nama TEXT,
  nip TEXT,
  status_approval TEXT DEFAULT 'approved' CHECK (status_approval IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 2a. Tambah kolom status_approval jika belum ada (untuk table yang sudah ada)
DO $$ BEGIN
  ALTER TABLE public.users ADD COLUMN status_approval TEXT DEFAULT 'approved' CHECK (status_approval IN ('pending', 'approved', 'rejected'));
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- 2b. Set default status untuk pengawas yang sudah ada
UPDATE public.users 
SET status_approval = 'approved' 
WHERE role = 'pengawas' AND (status_approval IS NULL OR status_approval = '');

-- 2c. Set default status untuk role lain
UPDATE public.users 
SET status_approval = 'approved' 
WHERE role IN ('admin', 'korwas_cabdin', 'sekolah') AND (status_approval IS NULL OR status_approval = '');

-- 3. Buat index
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_nip ON public.users(nip) WHERE nip IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_status_approval ON public.users(status_approval) WHERE role = 'pengawas';
CREATE INDEX IF NOT EXISTS idx_users_pending_approval ON public.users(role, status_approval) WHERE role = 'pengawas' AND status_approval = 'pending';

-- 4. Function untuk update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger untuk auto-update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Function untuk sync user dari auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert dengan error handling
  BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.email, ''),
      'sekolah'::user_role
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
  EXCEPTION WHEN OTHERS THEN
    -- Log error tapi jangan gagalkan insert ke auth.users
    RAISE WARNING 'Error inserting user to public.users: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger untuk auto-create user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 9. Drop existing policies if exist
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin can update all users" ON public.users;
DROP POLICY IF EXISTS "Pengawas can view other pengawas" ON public.users;
DROP POLICY IF EXISTS "Allow trigger to insert users" ON public.users;

-- 10. Buat policy khusus untuk INSERT via trigger (PENTING!)
CREATE POLICY "Allow trigger to insert users"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- 11. Buat policies untuk SELECT dan UPDATE
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update all users"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Pengawas can view other pengawas"
  ON public.users
  FOR SELECT
  USING (
    role = 'pengawas' OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'pengawas', 'korwas_cabdin')
    )
  );

-- 12. Helper functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS user_role AS $$
DECLARE
  user_role_value user_role;
BEGIN
  SELECT role INTO user_role_value
  FROM public.users
  WHERE id = user_id;
  
  RETURN COALESCE(user_role_value, 'sekolah'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop function jika sudah ada (karena return type berbeda)
DROP FUNCTION IF EXISTS public.get_user_with_role();

CREATE OR REPLACE FUNCTION public.get_user_with_role()
RETURNS TABLE (
  id UUID,
  email TEXT,
  role user_role,
  nama TEXT,
  nip TEXT,
  status_approval TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.role,
    u.nama,
    u.nip,
    u.status_approval,
    u.created_at,
    u.updated_at,
    u.metadata
  FROM public.users u
  WHERE u.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Grant permissions
-- 14. Function untuk approve/reject pengawas
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

-- 15. Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_with_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_pengawas(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_pengawas(UUID) TO authenticated;

-- ============================================
-- SETUP SELESAI!
-- ============================================
-- Langkah selanjutnya:
-- 1. Buat user di Supabase Auth Dashboard
-- 2. Update role user dengan query di bawah ini
-- ============================================

-- CONTOH: Update role untuk user yang sudah ada
-- UPDATE public.users SET role = 'admin'::user_role WHERE email = 'mkps@garuda-21.com';
-- UPDATE public.users SET role = 'pengawas'::user_role WHERE email = 'pengawas@example.com';
-- UPDATE public.users SET role = 'korwas_cabdin'::user_role WHERE email = 'korwas@example.com';
-- UPDATE public.users SET role = 'sekolah'::user_role WHERE email = 'sekolah@example.com';

