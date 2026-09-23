-- ============================================================
-- MIGRATION 006: Add Banner Image Columns
-- Alveric Technical Contracting LLC
-- ============================================================
-- Fixes: "Could not find the 'banner_image_id' column of 'about_settings'"
-- Fixes: "Could not find the 'hero_mobile_image_id' column of 'homepage_settings'"
-- ============================================================
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- Paste the entire file and click "Run"
-- ============================================================

-- 1. Add banner image columns to about_settings
--    These allow the About page hero banner (desktop + mobile) to be
--    stored as a proper FK reference to the media table.
ALTER TABLE about_settings
  ADD COLUMN IF NOT EXISTS banner_image_id        UUID REFERENCES media(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS banner_mobile_image_id UUID REFERENCES media(id) ON DELETE SET NULL;

-- 2. Add hero mobile image column to homepage_settings
--    Allows a separate optimised image for the homepage hero on mobile.
ALTER TABLE homepage_settings
  ADD COLUMN IF NOT EXISTS hero_mobile_image_id UUID REFERENCES media(id) ON DELETE SET NULL;

-- ============================================================
-- VERIFICATION - should return 3 rows if migration succeeded
-- ============================================================
SELECT
  column_name,
  table_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    (table_name = 'about_settings'    AND column_name IN ('banner_image_id', 'banner_mobile_image_id'))
    OR
    (table_name = 'homepage_settings' AND column_name = 'hero_mobile_image_id')
  )
ORDER BY table_name, column_name;
