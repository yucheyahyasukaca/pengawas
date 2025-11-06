-- ============================================
-- Migration: Extend Sekolah Table with Profile Fields
-- ============================================
-- Menambahkan kolom untuk data profil sekolah lengkap
-- ============================================

-- 1. Tambahkan kolom untuk identitas sekolah
ALTER TABLE public.sekolah
ADD COLUMN IF NOT EXISTS kepala_sekolah TEXT,
ADD COLUMN IF NOT EXISTS status_akreditasi TEXT,
ADD COLUMN IF NOT EXISTS jalan TEXT,
ADD COLUMN IF NOT EXISTS desa TEXT,
ADD COLUMN IF NOT EXISTS kecamatan TEXT,
ADD COLUMN IF NOT EXISTS nomor_telepon TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS email_sekolah TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS tiktok TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT;

-- 2. Tambahkan kolom untuk profil guru (JSONB untuk fleksibilitas)
ALTER TABLE public.sekolah
ADD COLUMN IF NOT EXISTS profil_guru JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS profil_tenaga_kependidikan JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS profil_siswa JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS branding_sekolah JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS kokurikuler JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS ekstrakurikuler JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS rapor_pendidikan JSONB DEFAULT '[]'::jsonb;

-- 3. Buat index untuk pencarian
CREATE INDEX IF NOT EXISTS idx_sekolah_kepala_sekolah ON public.sekolah(kepala_sekolah) WHERE kepala_sekolah IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sekolah_email_sekolah ON public.sekolah(email_sekolah) WHERE email_sekolah IS NOT NULL;

-- 4. Update RLS policies untuk sekolah dapat update data mereka sendiri
-- Policy: Sekolah dapat melihat dan update data sekolah mereka sendiri
DROP POLICY IF EXISTS "Sekolah can view own sekolah" ON public.sekolah;
DROP POLICY IF EXISTS "Sekolah can update own sekolah" ON public.sekolah;

-- Policy untuk sekolah melihat data mereka sendiri
CREATE POLICY "Sekolah can view own sekolah"
  ON public.sekolah
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'sekolah'
      AND (
        -- Check if user metadata has sekolah_id that matches this sekolah id
        (users.metadata->>'sekolah_id')::uuid = sekolah.id
        OR
        -- Or check if user email matches sekolah email (for initial setup)
        users.email = sekolah.email_sekolah
      )
    )
  );

-- Policy untuk sekolah update data mereka sendiri
CREATE POLICY "Sekolah can update own sekolah"
  ON public.sekolah
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'sekolah'
      AND (
        (users.metadata->>'sekolah_id')::uuid = sekolah.id
        OR
        users.email = sekolah.email_sekolah
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'sekolah'
      AND (
        (users.metadata->>'sekolah_id')::uuid = sekolah.id
        OR
        users.email = sekolah.email_sekolah
      )
    )
  );

-- 5. Grant permissions
GRANT SELECT, UPDATE ON public.sekolah TO authenticated;

