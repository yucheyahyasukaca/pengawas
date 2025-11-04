-- ============================================
-- FIX: Function Return Type Error
-- ============================================
-- Script ini memperbaiki error "cannot change return type of existing function"
-- ============================================

-- Drop function jika sudah ada (karena return type berbeda)
DROP FUNCTION IF EXISTS public.get_user_with_role();

-- Buat ulang function dengan return type yang baru (include status_approval)
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_user_with_role() TO authenticated;

-- ============================================
-- CATATAN:
-- ============================================
-- Function ini sekarang include kolom status_approval
-- di return type-nya untuk mendukung sistem approval
-- ============================================

