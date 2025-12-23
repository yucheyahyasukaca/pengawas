-- Create table pengembangan_diri
CREATE TABLE IF NOT EXISTS public.pengembangan_diri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    nama_kegiatan TEXT NOT NULL,
    tanggal_kegiatan DATE NOT NULL,
    materi_kegiatan TEXT,
    sertifikat_url TEXT,
    status TEXT NOT NULL DEFAULT 'diajukan' CHECK (status IN ('diajukan', 'disetujui', 'selesai', 'ditolak')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pengembangan_diri ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- Helper function to check role safely (avoiding infinite recursion)
-- This function is reusable
CREATE OR REPLACE FUNCTION public.get_user_role_safe()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- Policy 1: Pengawas can view their own data
DROP POLICY IF EXISTS "Pengawas can view own pengembangan diri" ON public.pengembangan_diri;
CREATE POLICY "Pengawas can view own pengembangan diri"
ON public.pengembangan_diri
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: Pengawas can insert their own data
DROP POLICY IF EXISTS "Pengawas can insert own pengembangan diri" ON public.pengembangan_diri;
CREATE POLICY "Pengawas can insert own pengembangan diri"
ON public.pengembangan_diri
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Pengawas can update their own data
DROP POLICY IF EXISTS "Pengawas can update own pengembangan diri" ON public.pengembangan_diri;
CREATE POLICY "Pengawas can update own pengembangan diri"
ON public.pengembangan_diri
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Pengawas can delete their own data
DROP POLICY IF EXISTS "Pengawas can delete own pengembangan diri" ON public.pengembangan_diri;
CREATE POLICY "Pengawas can delete own pengembangan diri"
ON public.pengembangan_diri
FOR DELETE
USING (auth.uid() = user_id);

-- Policy 5: Admin/Korwas can view all data
DROP POLICY IF EXISTS "Admin/Korwas can view all pengembangan diri" ON public.pengembangan_diri;
CREATE POLICY "Admin/Korwas can view all pengembangan diri"
ON public.pengembangan_diri
FOR SELECT
USING (
  get_user_role_safe() IN ('admin', 'korwas_cabdin')
);

-- Policy 6: Admin/Korwas can update status (review)
DROP POLICY IF EXISTS "Admin/Korwas can update status" ON public.pengembangan_diri;
CREATE POLICY "Admin/Korwas can update status"
ON public.pengembangan_diri
FOR UPDATE
USING (
  get_user_role_safe() IN ('admin', 'korwas_cabdin')
);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_pengembangan_diri_updated_at ON public.pengembangan_diri;
CREATE TRIGGER update_pengembangan_diri_updated_at
  BEFORE UPDATE ON public.pengembangan_diri
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pengembangan_diri TO authenticated;
