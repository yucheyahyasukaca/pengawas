-- ============================================
-- Migration: Create Sekolah Table
-- ============================================
-- Membuat tabel untuk menyimpan data sekolah binaan
-- ============================================

-- 1. Buat tabel sekolah
CREATE TABLE IF NOT EXISTS public.sekolah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  npsn TEXT NOT NULL UNIQUE,
  nama_sekolah TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Negeri' CHECK (status IN ('Negeri', 'Swasta')),
  jenjang TEXT NOT NULL DEFAULT 'SMK' CHECK (jenjang IN ('SMK', 'SMA', 'SLB')),
  kabupaten_kota TEXT NOT NULL,
  alamat TEXT NOT NULL,
  kcd_wilayah INTEGER NOT NULL CHECK (kcd_wilayah >= 1 AND kcd_wilayah <= 13),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_sekolah_npsn ON public.sekolah(npsn);
CREATE INDEX IF NOT EXISTS idx_sekolah_kcd_wilayah ON public.sekolah(kcd_wilayah);
CREATE INDEX IF NOT EXISTS idx_sekolah_kabupaten_kota ON public.sekolah(kabupaten_kota);
CREATE INDEX IF NOT EXISTS idx_sekolah_status ON public.sekolah(status);
CREATE INDEX IF NOT EXISTS idx_sekolah_jenjang ON public.sekolah(jenjang);
CREATE INDEX IF NOT EXISTS idx_sekolah_nama ON public.sekolah USING gin(to_tsvector('indonesian', nama_sekolah));

-- 3. Buat trigger untuk update updated_at
CREATE OR REPLACE FUNCTION update_sekolah_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_sekolah_updated_at_trigger ON public.sekolah;
CREATE TRIGGER update_sekolah_updated_at_trigger
  BEFORE UPDATE ON public.sekolah
  FOR EACH ROW
  EXECUTE FUNCTION update_sekolah_updated_at();

-- 4. Buat RLS policies
ALTER TABLE public.sekolah ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin can manage all sekolah" ON public.sekolah;
DROP POLICY IF EXISTS "Pengawas can view all sekolah" ON public.sekolah;

-- Policy: Admin dapat melihat dan mengelola semua sekolah
CREATE POLICY "Admin can manage all sekolah"
  ON public.sekolah
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Pengawas dapat melihat semua sekolah (read-only)
CREATE POLICY "Pengawas can view all sekolah"
  ON public.sekolah
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'pengawas'
      AND users.status_approval = 'approved'
    )
  );

-- 5. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sekolah TO authenticated;

-- 6. Update constraint jika tabel sudah ada (untuk mengubah dari 1-12 menjadi 1-13)
DO $$
BEGIN
  -- Drop constraint lama jika ada
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'sekolah_kcd_wilayah_check' 
    AND conrelid = 'public.sekolah'::regclass
  ) THEN
    ALTER TABLE public.sekolah DROP CONSTRAINT IF EXISTS sekolah_kcd_wilayah_check;
  END IF;
  
  -- Tambahkan constraint baru
  ALTER TABLE public.sekolah 
  ADD CONSTRAINT sekolah_kcd_wilayah_check 
  CHECK (kcd_wilayah >= 1 AND kcd_wilayah <= 13);
END $$;

-- 7. Insert sample data (optional - bisa dihapus jika tidak diperlukan)
-- INSERT INTO public.sekolah (npsn, nama_sekolah, status, jenjang, kabupaten_kota, alamat, kcd_wilayah)
-- VALUES 
--   ('20337887', 'SMK NEGERI 1 PUNGGELAN', 'Negeri', 'SMK', 'Kabupaten Banjarnegara', 'JL. RAYA PASAR MANIS, LOJI, PUNGGELAN, BANJARNEGARA', 9),
--   ('69774957', 'SMKN 1 PEJAWARAN', 'Negeri', 'SMK', 'Kabupaten Banjarnegara', 'Jalan Raya Pejawaran - Batur Km.3, Pejawaran, Banjarnegara', 9),
--   ('69762663', 'SMK NEGERI 1 MANDIRAJA', 'Negeri', 'SMK', 'Kabupaten Banjarnegara', 'Jl. Raya Glempang, Kec. Mandiraja, Kab. Banjarnegara', 9)
-- ON CONFLICT (npsn) DO NOTHING;

