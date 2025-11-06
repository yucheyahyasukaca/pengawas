-- Create rencana_pendampingan table
CREATE TABLE IF NOT EXISTS public.rencana_pendampingan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pengawas_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  sekolah_id UUID NOT NULL REFERENCES public.sekolah(id) ON DELETE CASCADE,
  indikator_utama TEXT NOT NULL,
  akar_masalah TEXT NOT NULL,
  kegiatan_benahi TEXT NOT NULL,
  penjelasan_implementasi JSONB NOT NULL DEFAULT '[]'::jsonb,
  apakah_kegiatan BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_rencana_pendampingan_pengawas_id ON public.rencana_pendampingan(pengawas_id);
CREATE INDEX IF NOT EXISTS idx_rencana_pendampingan_tanggal ON public.rencana_pendampingan(tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_rencana_pendampingan_sekolah_id ON public.rencana_pendampingan(sekolah_id);
CREATE INDEX IF NOT EXISTS idx_rencana_pendampingan_pengawas_tanggal ON public.rencana_pendampingan(pengawas_id, tanggal DESC);

-- Enable Row Level Security
ALTER TABLE public.rencana_pendampingan ENABLE ROW LEVEL SECURITY;

-- Create policy: Pengawas can only see their own rencana pendampingan
CREATE POLICY "Pengawas can view own rencana pendampingan"
  ON public.rencana_pendampingan
  FOR SELECT
  USING (auth.uid() = pengawas_id);

-- Create policy: Pengawas can insert their own rencana pendampingan
CREATE POLICY "Pengawas can insert own rencana pendampingan"
  ON public.rencana_pendampingan
  FOR INSERT
  WITH CHECK (auth.uid() = pengawas_id);

-- Create policy: Pengawas can update their own rencana pendampingan
CREATE POLICY "Pengawas can update own rencana pendampingan"
  ON public.rencana_pendampingan
  FOR UPDATE
  USING (auth.uid() = pengawas_id)
  WITH CHECK (auth.uid() = pengawas_id);

-- Create policy: Pengawas can delete their own rencana pendampingan
CREATE POLICY "Pengawas can delete own rencana pendampingan"
  ON public.rencana_pendampingan
  FOR DELETE
  USING (auth.uid() = pengawas_id);

-- Create policy: Admin can view all rencana pendampingan
CREATE POLICY "Admin can view all rencana pendampingan"
  ON public.rencana_pendampingan
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_rencana_pendampingan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_rencana_pendampingan_updated_at ON public.rencana_pendampingan;
CREATE TRIGGER update_rencana_pendampingan_updated_at
  BEFORE UPDATE ON public.rencana_pendampingan
  FOR EACH ROW
  EXECUTE FUNCTION update_rencana_pendampingan_updated_at();

