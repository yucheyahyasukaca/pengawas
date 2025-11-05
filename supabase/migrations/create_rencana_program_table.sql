-- Create rencana_program table
CREATE TABLE IF NOT EXISTS rencana_program (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pengawas_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  periode TEXT,
  status TEXT DEFAULT 'Draft',
  form_data JSONB NOT NULL,
  sekolah_ids JSONB DEFAULT '[]'::jsonb,
  file TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_rencana_program_pengawas_id ON rencana_program(pengawas_id);
CREATE INDEX IF NOT EXISTS idx_rencana_program_created_at ON rencana_program(created_at DESC);

-- Enable Row Level Security
ALTER TABLE rencana_program ENABLE ROW LEVEL SECURITY;

-- Create policy: Pengawas can only see their own rencana program
CREATE POLICY "Pengawas can view own rencana program"
  ON rencana_program
  FOR SELECT
  USING (auth.uid() = pengawas_id);

-- Create policy: Pengawas can insert their own rencana program
CREATE POLICY "Pengawas can insert own rencana program"
  ON rencana_program
  FOR INSERT
  WITH CHECK (auth.uid() = pengawas_id);

-- Create policy: Pengawas can update their own rencana program
CREATE POLICY "Pengawas can update own rencana program"
  ON rencana_program
  FOR UPDATE
  USING (auth.uid() = pengawas_id)
  WITH CHECK (auth.uid() = pengawas_id);

-- Create policy: Pengawas can delete their own rencana program
CREATE POLICY "Pengawas can delete own rencana program"
  ON rencana_program
  FOR DELETE
  USING (auth.uid() = pengawas_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_rencana_program_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_rencana_program_updated_at
  BEFORE UPDATE ON rencana_program
  FOR EACH ROW
  EXECUTE FUNCTION update_rencana_program_updated_at();

