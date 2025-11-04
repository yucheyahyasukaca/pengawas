-- ============================================
-- SQL untuk Disable Email Confirmation
-- ============================================
-- Catatan: Setting ini tidak bisa diubah via SQL
-- Harus diubah via Supabase Dashboard
-- ============================================
-- 
-- Cara disable email confirmation:
-- 1. Buka Supabase Dashboard
-- 2. Authentication → Settings
-- 3. Cari "Enable email confirmations"
-- 4. Nonaktifkan (turn off)
-- 5. Save
--
-- Atau gunakan Admin API dengan email_confirm: true
-- (sudah diimplementasi di app/api/auth/register/pengawas/route.ts)
-- ============================================

-- Catatan: Setting email confirmation tidak bisa diubah via SQL
-- Ini adalah setting di Supabase Dashboard yang harus diubah manual

-- Alternatif: Pastikan registrasi menggunakan Admin API dengan email_confirm: true
-- (sudah diimplementasi)

