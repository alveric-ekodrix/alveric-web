-- Migration: Add icon_name text column to why_us_features
-- This allows admins to specify a Lucide icon name (kebab-case) for each feature card
-- without needing to upload a separate media file for simple icon-only cards.

ALTER TABLE why_us_features
  ADD COLUMN IF NOT EXISTS icon_name TEXT;
