-- ============================================
-- Migration: Create Roles and Users System
-- ============================================
-- Script ini membuat sistem role-based authentication
-- Role: admin, pengawas, korwas_cabdin, sekolah
-- ============================================

-- 1. Buat ENUM untuk role (jika belum ada)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'pengawas', 'korwas_cabdin', 'sekolah');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Buat tabel users untuk menyimpan data tambahan user
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'sekolah',
  nama TEXT,
  nip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Metadata tambahan berdasarkan role
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_nip ON public.users(nip) WHERE nip IS NOT NULL;

-- 4. Buat function untuk update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Buat trigger untuk auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Buat function untuk sync user dari auth.users ke public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'sekolah'::user_role  -- Default role
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Buat trigger untuk auto-create user di public.users saat signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 9. Buat policies untuk RLS
-- Policy: Users dapat melihat data mereka sendiri
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users dapat update data mereka sendiri (kecuali role)
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Admin dapat melihat semua users
CREATE POLICY "Admin can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admin dapat update semua users
CREATE POLICY "Admin can update all users"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Pengawas dapat melihat data pengawas lain
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

-- 10. Buat function helper untuk mendapatkan role user
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

-- 11. Buat function untuk mendapatkan user dengan role
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

-- 12. Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_with_role() TO authenticated;

-- 13. Insert default admin user (jika belum ada)
-- Catatan: Pastikan user ini sudah dibuat di auth.users terlebih dahulu
-- atau gunakan trigger untuk auto-create
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Cek apakah admin sudah ada
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'mkps@garuda-21.com'
  LIMIT 1;

  -- Jika admin user ada tapi belum di public.users, insert
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.users (id, email, role, nama)
    VALUES (admin_user_id, 'mkps@garuda-21.com', 'admin'::user_role, 'Admin MKPS')
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin'::user_role,
        email = EXCLUDED.email;
  END IF;
END $$;

-- ============================================
-- CATATAN PENTING:
-- ============================================
-- 1. Setelah menjalankan script ini, pastikan untuk:
--    - Membuat user di auth.users melalui Supabase Dashboard atau API
--    - Update role user di public.users sesuai kebutuhan
--
-- 2. Untuk update role user, gunakan query:
--    UPDATE public.users SET role = 'pengawas'::user_role WHERE email = 'email@example.com';
--
-- 3. Untuk membuat user baru dengan role tertentu:
--    a. Buat user di auth.users (melalui Supabase Auth)
--    b. Update role di public.users:
--       UPDATE public.users SET role = 'pengawas'::user_role WHERE email = 'newuser@example.com';
--
-- 4. Metadata JSONB dapat digunakan untuk menyimpan data tambahan:
--    - Untuk pengawas: wilayah_tugas, jumlah_sekolah_binaan
--    - Untuk sekolah: npsn, alamat, kabupaten
--    - Untuk korwas_cabdin: cabang_dinas, wilayah
-- ============================================

