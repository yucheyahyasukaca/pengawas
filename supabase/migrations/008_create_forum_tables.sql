-- ============================================
-- Migration: Create Forum Communication Tables
-- ============================================
-- Membuat tabel untuk forum komunikasi pengawas
-- ============================================

-- 1. Buat tabel forum_threads (thread utama)
CREATE TABLE IF NOT EXISTS public.forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ,
  edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Metadata untuk sorting dan filtering
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMPTZ,
  last_reply_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. Buat tabel forum_replies (balasan thread)
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ,
  edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. Buat tabel forum_attachments (lampiran gambar)
CREATE TABLE IF NOT EXISTS public.forum_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Constraint: harus ada thread_id atau reply_id, tidak boleh keduanya null
  CONSTRAINT check_thread_or_reply CHECK (
    (thread_id IS NOT NULL AND reply_id IS NULL) OR
    (thread_id IS NULL AND reply_id IS NOT NULL)
  )
);

-- 4. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_forum_threads_author ON public.forum_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_created ON public.forum_threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_threads_last_reply ON public.forum_threads(last_reply_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_forum_threads_deleted ON public.forum_threads(is_deleted) WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_forum_replies_thread ON public.forum_replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_author ON public.forum_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_created ON public.forum_replies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_deleted ON public.forum_replies(is_deleted) WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_forum_attachments_thread ON public.forum_attachments(thread_id) WHERE thread_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_forum_attachments_reply ON public.forum_attachments(reply_id) WHERE reply_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_forum_attachments_uploader ON public.forum_attachments(uploaded_by);

-- 5. Buat trigger untuk update updated_at
CREATE OR REPLACE FUNCTION update_forum_threads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_forum_replies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_forum_threads_updated_at_trigger ON public.forum_threads;
CREATE TRIGGER update_forum_threads_updated_at_trigger
  BEFORE UPDATE ON public.forum_threads
  FOR EACH ROW
  EXECUTE FUNCTION update_forum_threads_updated_at();

DROP TRIGGER IF EXISTS update_forum_replies_updated_at_trigger ON public.forum_replies;
CREATE TRIGGER update_forum_replies_updated_at_trigger
  BEFORE UPDATE ON public.forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_forum_replies_updated_at();

-- 6. Buat function untuk update reply_count dan last_reply_at
CREATE OR REPLACE FUNCTION update_thread_reply_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_deleted = FALSE THEN
    -- Update reply count dan last reply info
    UPDATE public.forum_threads
    SET 
      reply_count = (
        SELECT COUNT(*) 
        FROM public.forum_replies 
        WHERE thread_id = NEW.thread_id AND is_deleted = FALSE
      ),
      last_reply_at = NEW.created_at,
      last_reply_by = NEW.author_id
    WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Update reply count jika status deleted berubah
    UPDATE public.forum_threads
    SET reply_count = (
      SELECT COUNT(*) 
      FROM public.forum_replies 
      WHERE thread_id = NEW.thread_id AND is_deleted = FALSE
    )
    WHERE id = NEW.thread_id;
    
    -- Update last_reply_at jika reply baru dibuat atau dihapus
    UPDATE public.forum_threads
    SET last_reply_at = (
      SELECT MAX(created_at)
      FROM public.forum_replies
      WHERE thread_id = NEW.thread_id AND is_deleted = FALSE
    ),
    last_reply_by = (
      SELECT author_id
      FROM public.forum_replies
      WHERE thread_id = NEW.thread_id AND is_deleted = FALSE
      ORDER BY created_at DESC
      LIMIT 1
    )
    WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update reply count saat reply dihapus
    UPDATE public.forum_threads
    SET reply_count = (
      SELECT COUNT(*) 
      FROM public.forum_replies 
      WHERE thread_id = OLD.thread_id AND is_deleted = FALSE
    ),
    last_reply_at = (
      SELECT MAX(created_at)
      FROM public.forum_replies
      WHERE thread_id = OLD.thread_id AND is_deleted = FALSE
    ),
    last_reply_by = (
      SELECT author_id
      FROM public.forum_replies
      WHERE thread_id = OLD.thread_id AND is_deleted = FALSE
      ORDER BY created_at DESC
      LIMIT 1
    )
    WHERE id = OLD.thread_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 7. Buat trigger untuk update reply stats
DROP TRIGGER IF EXISTS update_thread_reply_stats_trigger ON public.forum_replies;
CREATE TRIGGER update_thread_reply_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_reply_stats();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_attachments ENABLE ROW LEVEL SECURITY;

-- 9. Buat RLS policies untuk forum_threads
-- Policy: Pengawas yang approved dapat melihat semua thread yang tidak dihapus
CREATE POLICY "Pengawas can view active threads"
  ON public.forum_threads
  FOR SELECT
  USING (
    is_deleted = FALSE AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'pengawas'
      AND users.status_approval = 'approved'
    )
  );

-- Policy: Pengawas yang approved dapat membuat thread
CREATE POLICY "Pengawas can create threads"
  ON public.forum_threads
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'pengawas'
      AND users.status_approval = 'approved'
    )
    AND author_id = auth.uid()
  );

-- Policy: Author dapat mengedit thread mereka sendiri
CREATE POLICY "Authors can edit own threads"
  ON public.forum_threads
  FOR UPDATE
  USING (
    author_id = auth.uid() AND
    is_deleted = FALSE
  )
  WITH CHECK (
    author_id = auth.uid() AND
    is_deleted = FALSE
  );

-- Policy: Admin dapat mengedit semua thread
CREATE POLICY "Admin can edit all threads"
  ON public.forum_threads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Author dapat menghapus thread mereka sendiri (soft delete)
CREATE POLICY "Authors can delete own threads"
  ON public.forum_threads
  FOR UPDATE
  USING (
    author_id = auth.uid() AND
    is_deleted = FALSE
  )
  WITH CHECK (
    author_id = auth.uid()
  );

-- Policy: Admin dapat menghapus semua thread
CREATE POLICY "Admin can delete all threads"
  ON public.forum_threads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 10. Buat RLS policies untuk forum_replies
-- Policy: Pengawas yang approved dapat melihat semua reply yang tidak dihapus
CREATE POLICY "Pengawas can view active replies"
  ON public.forum_replies
  FOR SELECT
  USING (
    is_deleted = FALSE AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'pengawas'
      AND users.status_approval = 'approved'
    )
  );

-- Policy: Pengawas yang approved dapat membuat reply
CREATE POLICY "Pengawas can create replies"
  ON public.forum_replies
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'pengawas'
      AND users.status_approval = 'approved'
    )
    AND author_id = auth.uid()
  );

-- Policy: Author dapat mengedit reply mereka sendiri
CREATE POLICY "Authors can edit own replies"
  ON public.forum_replies
  FOR UPDATE
  USING (
    author_id = auth.uid() AND
    is_deleted = FALSE
  )
  WITH CHECK (
    author_id = auth.uid() AND
    is_deleted = FALSE
  );

-- Policy: Admin dapat mengedit semua reply
CREATE POLICY "Admin can edit all replies"
  ON public.forum_replies
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Author dapat menghapus reply mereka sendiri (soft delete)
CREATE POLICY "Authors can delete own replies"
  ON public.forum_replies
  FOR UPDATE
  USING (
    author_id = auth.uid() AND
    is_deleted = FALSE
  )
  WITH CHECK (
    author_id = auth.uid()
  );

-- Policy: Admin dapat menghapus semua reply
CREATE POLICY "Admin can delete all replies"
  ON public.forum_replies
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 11. Buat RLS policies untuk forum_attachments
-- Policy: Pengawas yang approved dapat melihat semua attachments
CREATE POLICY "Pengawas can view attachments"
  ON public.forum_attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'pengawas'
      AND users.status_approval = 'approved'
    )
  );

-- Policy: Pengawas yang approved dapat upload attachments
CREATE POLICY "Pengawas can upload attachments"
  ON public.forum_attachments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'pengawas'
      AND users.status_approval = 'approved'
    )
    AND uploaded_by = auth.uid()
  );

-- Policy: Admin dapat menghapus semua attachments
CREATE POLICY "Admin can delete attachments"
  ON public.forum_attachments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 12. Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.forum_threads TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.forum_replies TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.forum_attachments TO authenticated;

-- ============================================
-- CATATAN PENTING:
-- ============================================
-- 1. Forum hanya dapat diakses oleh pengawas yang sudah approved
-- 2. Admin dapat mengedit dan menghapus semua thread/reply
-- 3. Soft delete digunakan untuk menjaga integritas data
-- 4. Reply count dan last_reply_at diupdate otomatis via trigger
-- 5. Attachments disimpan di Supabase Storage, URL disimpan di tabel
--
-- SETUP SUPABASE STORAGE:
-- Setelah menjalankan migration ini, buat storage bucket di Supabase:
-- 1. Buka Supabase Dashboard → Storage
-- 2. Klik "New bucket"
-- 3. Nama bucket: "forum-attachments"
-- 4. Public bucket: YES (agar gambar bisa diakses)
-- 5. File size limit: 5MB
-- 6. Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
-- 7. Klik "Create bucket"
--
-- SETUP STORAGE POLICIES:
-- Setelah bucket dibuat, buat policies di Storage → Policies:
-- 
-- Policy 1: "Pengawas can upload files"
-- INSERT policy dengan condition:
--   EXISTS (
--     SELECT 1 FROM public.users
--     WHERE users.id = auth.uid()
--     AND users.role = 'pengawas'
--     AND users.status_approval = 'approved'
--   )
--
-- Policy 2: "Anyone can view files"
-- SELECT policy untuk public access (karena bucket public)
-- ============================================

