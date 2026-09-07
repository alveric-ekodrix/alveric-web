-- Migration 004: Add About Section Showcase Images to homepage_settings
-- This allows admins to upload custom images for the 3 About Alveric cards on the homepage

ALTER TABLE homepage_settings
ADD COLUMN IF NOT EXISTS about_image_1_id UUID REFERENCES media(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS about_image_2_id UUID REFERENCES media(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS about_image_3_id UUID REFERENCES media(id) ON DELETE SET NULL;
