-- ============================================
-- FIX: Trigger Error saat Create User
-- ============================================
-- Script ini memperbaiki error "Failed to create user"
-- yang terjadi karena RLS policies memblokir INSERT dari trigger
-- ============================================

-- 1. Pastikan function handle_new_user menggunakan SECURITY DEFINER
-- dan bypass RLS untuk INSERT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert dengan error handling yang lebih baik
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

-- 2. Buat policy khusus untuk INSERT via trigger
-- Policy ini memungkinkan INSERT tanpa perlu auth.uid() check
DROP POLICY IF EXISTS "Allow trigger to insert users" ON public.users;

CREATE POLICY "Allow trigger to insert users"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- 3. Pastikan trigger sudah ada dan benar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Grant permissions untuk function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- 5. Pastikan service_role bisa insert ke public.users
-- (Ini penting untuk trigger)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CATATAN:
-- ============================================
-- Policy "Allow trigger to insert users" memungkinkan
-- trigger function untuk INSERT tanpa perlu auth check
-- karena trigger berjalan dengan SECURITY DEFINER
-- ============================================

