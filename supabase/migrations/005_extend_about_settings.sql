-- ============================================================
-- MIGRATION 005: Extend About Us Page Settings
-- Alveric Technical Contracting LLC
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Paste the entire file and click "Run"
-- ============================================================

-- 1. Extend about_settings table with all missing fields
ALTER TABLE about_settings
  -- Hero fields
  ADD COLUMN IF NOT EXISTS hero_eyebrow TEXT DEFAULT 'ABOUT ALVERIC',
  ADD COLUMN IF NOT EXISTS hero_feature_1_title TEXT DEFAULT 'Quality Workmanship',
  ADD COLUMN IF NOT EXISTS hero_feature_2_title TEXT DEFAULT 'On-Time Delivery',
  ADD COLUMN IF NOT EXISTS hero_feature_3_title TEXT DEFAULT 'Client-Centric Approach',
  ADD COLUMN IF NOT EXISTS hero_primary_button TEXT DEFAULT 'Our Services',
  ADD COLUMN IF NOT EXISTS hero_secondary_button TEXT DEFAULT 'Get a Quote',
  ADD COLUMN IF NOT EXISTS hero_trust_text TEXT DEFAULT 'Trusted by 100+ clients across the UAE',
  ADD COLUMN IF NOT EXISTS hero_overlay_label TEXT DEFAULT 'ENGINEERING EXCELLENCE',
  ADD COLUMN IF NOT EXISTS hero_overlay_title TEXT DEFAULT 'Engineering Excellence for a Brighter Future',

  -- Story fields
  ADD COLUMN IF NOT EXISTS story_eyebrow TEXT DEFAULT 'OUR STORY',
  ADD COLUMN IF NOT EXISTS story_heading TEXT DEFAULT 'A Journey Built on Trust and Expertise',
  ADD COLUMN IF NOT EXISTS story_button TEXT DEFAULT 'Our Journey',
  ADD COLUMN IF NOT EXISTS story_image_overlay_title TEXT DEFAULT 'Creating Smarter Spaces for Better Lives',

  -- Mission fields
  ADD COLUMN IF NOT EXISTS mission_eyebrow TEXT DEFAULT 'OUR PURPOSE',
  ADD COLUMN IF NOT EXISTS mission_supporting_text TEXT DEFAULT 'Focused on Progress. Driven by People.',

  -- Vision fields
  ADD COLUMN IF NOT EXISTS vision_eyebrow TEXT DEFAULT 'OUR HORIZON',
  ADD COLUMN IF NOT EXISTS vision_supporting_text TEXT DEFAULT 'Setting New Standards in Contracting Excellence.',

  -- Values fields
  ADD COLUMN IF NOT EXISTS values_items JSONB DEFAULT '[
    {"title": "Integrity", "description": "We do what''s right, always."},
    {"title": "Quality", "description": "We never compromise on standards."},
    {"title": "Safety", "description": "People and safety come first."},
    {"title": "Innovation", "description": "We embrace smarter solutions."}
  ]'::jsonb,
  ADD COLUMN IF NOT EXISTS values_link_text TEXT DEFAULT 'Learn More About Our Values',

  -- Why Choose fields
  ADD COLUMN IF NOT EXISTS why_choose_eyebrow TEXT DEFAULT 'WHY CHOOSE ALVERIC',
  ADD COLUMN IF NOT EXISTS why_choose_heading TEXT DEFAULT 'More Than a Contractor A Long-Term Partner',
  ADD COLUMN IF NOT EXISTS why_choose_description TEXT DEFAULT 'We bring together technical expertise, industry experience, and a commitment to excellence to deliver solutions that stand the test of time.',
  ADD COLUMN IF NOT EXISTS why_choose_benefits JSONB DEFAULT '[
    "Licensed & Certified Professionals",
    "Comprehensive Project Management",
    "Transparent Communication",
    "Commitment to Quality & Safety"
  ]'::jsonb,
  ADD COLUMN IF NOT EXISTS why_choose_button TEXT DEFAULT 'Work With Us',
  ADD COLUMN IF NOT EXISTS why_choose_image_overlay TEXT DEFAULT 'Trusted Partner in Every Build',

  -- Certifications fields
  ADD COLUMN IF NOT EXISTS certifications_eyebrow TEXT DEFAULT 'OUR CERTIFICATIONS',
  ADD COLUMN IF NOT EXISTS certifications_heading TEXT DEFAULT 'Committed to Global Standards',
  ADD COLUMN IF NOT EXISTS certifications_description TEXT DEFAULT 'We follow internationally recognized standards to ensure quality, safety, and compliance in every project we deliver.',
  ADD COLUMN IF NOT EXISTS certifications_items JSONB DEFAULT '[
    {"title": "ISO 9001:2015"},
    {"title": "UAE Municipality Compliant"},
    {"title": "HSE Certified"}
  ]'::jsonb,

  -- Final CTA fields
  ADD COLUMN IF NOT EXISTS cta_eyebrow TEXT DEFAULT 'LET''S BUILD TOGETHER',
  ADD COLUMN IF NOT EXISTS cta_heading TEXT DEFAULT 'Ready to Bring Your Project to Life?',
  ADD COLUMN IF NOT EXISTS cta_description TEXT DEFAULT 'Partner with Alveric Technical Contracting and experience reliable, efficient, and high-quality contracting solutions.',
  ADD COLUMN IF NOT EXISTS cta_primary_button TEXT DEFAULT 'Get a Free Quote',
  ADD COLUMN IF NOT EXISTS cta_secondary_button TEXT DEFAULT 'Chat on WhatsApp';


-- 2. Seed / Upsert About Us Settings with exact values (idempotent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM about_settings LIMIT 1) THEN
    -- Update existing record only if newly created fields are null or empty
    UPDATE about_settings
    SET
      hero_eyebrow = COALESCE(NULLIF(hero_eyebrow, ''), 'ABOUT ALVERIC'),
      hero_feature_1_title = COALESCE(NULLIF(hero_feature_1_title, ''), 'Quality Workmanship'),
      hero_feature_2_title = COALESCE(NULLIF(hero_feature_2_title, ''), 'On-Time Delivery'),
      hero_feature_3_title = COALESCE(NULLIF(hero_feature_3_title, ''), 'Client-Centric Approach'),
      hero_primary_button = COALESCE(NULLIF(hero_primary_button, ''), 'Our Services'),
      hero_secondary_button = COALESCE(NULLIF(hero_secondary_button, ''), 'Get a Quote'),
      hero_trust_text = COALESCE(NULLIF(hero_trust_text, ''), 'Trusted by 100+ clients across the UAE'),
      hero_overlay_label = COALESCE(NULLIF(hero_overlay_label, ''), 'ENGINEERING EXCELLENCE'),
      hero_overlay_title = COALESCE(NULLIF(hero_overlay_title, ''), 'Engineering Excellence for a Brighter Future'),

      story_eyebrow = COALESCE(NULLIF(story_eyebrow, ''), 'OUR STORY'),
      story_heading = COALESCE(NULLIF(story_heading, ''), 'A Journey Built on Trust and Expertise'),
      story_button = COALESCE(NULLIF(story_button, ''), 'Our Journey'),
      story_image_overlay_title = COALESCE(NULLIF(story_image_overlay_title, ''), 'Creating Smarter Spaces for Better Lives'),

      mission_eyebrow = COALESCE(NULLIF(mission_eyebrow, ''), 'OUR PURPOSE'),
      mission_supporting_text = COALESCE(NULLIF(mission_supporting_text, ''), 'Focused on Progress. Driven by People.'),

      vision_eyebrow = COALESCE(NULLIF(vision_eyebrow, ''), 'OUR HORIZON'),
      vision_supporting_text = COALESCE(NULLIF(vision_supporting_text, ''), 'Setting New Standards in Contracting Excellence.'),

      values_items = COALESCE(values_items, '[
        {"title": "Integrity", "description": "We do what''s right, always."},
        {"title": "Quality", "description": "We never compromise on standards."},
        {"title": "Safety", "description": "People and safety come first."},
        {"title": "Innovation", "description": "We embrace smarter solutions."}
      ]'::jsonb),
      values_link_text = COALESCE(NULLIF(values_link_text, ''), 'Learn More About Our Values'),

      why_choose_eyebrow = COALESCE(NULLIF(why_choose_eyebrow, ''), 'WHY CHOOSE ALVERIC'),
      why_choose_heading = COALESCE(NULLIF(why_choose_heading, ''), 'More Than a Contractor A Long-Term Partner'),
      why_choose_description = COALESCE(NULLIF(why_choose_description, ''), 'We bring together technical expertise, industry experience, and a commitment to excellence to deliver solutions that stand the test of time.'),
      why_choose_benefits = COALESCE(why_choose_benefits, '[
        "Licensed & Certified Professionals",
        "Comprehensive Project Management",
        "Transparent Communication",
        "Commitment to Quality & Safety"
      ]'::jsonb),
      why_choose_button = COALESCE(NULLIF(why_choose_button, ''), 'Work With Us'),
      why_choose_image_overlay = COALESCE(NULLIF(why_choose_image_overlay, ''), 'Trusted Partner in Every Build'),

      certifications_eyebrow = COALESCE(NULLIF(certifications_eyebrow, ''), 'OUR CERTIFICATIONS'),
      certifications_heading = COALESCE(NULLIF(certifications_heading, ''), 'Committed to Global Standards'),
      certifications_description = COALESCE(NULLIF(certifications_description, ''), 'We follow internationally recognized standards to ensure quality, safety, and compliance in every project we deliver.'),
      certifications_items = COALESCE(certifications_items, '[
        {"title": "ISO 9001:2015"},
        {"title": "UAE Municipality Compliant"},
        {"title": "HSE Certified"}
      ]'::jsonb),

      cta_eyebrow = COALESCE(NULLIF(cta_eyebrow, ''), 'LET''S BUILD TOGETHER'),
      cta_heading = COALESCE(NULLIF(cta_heading, ''), 'Ready to Bring Your Project to Life?'),
      cta_description = COALESCE(NULLIF(cta_description, ''), 'Partner with Alveric Technical Contracting and experience reliable, efficient, and high-quality contracting solutions.'),
      cta_primary_button = COALESCE(NULLIF(cta_primary_button, ''), 'Get a Free Quote'),
      cta_secondary_button = COALESCE(NULLIF(cta_secondary_button, ''), 'Chat on WhatsApp')
    WHERE id = (SELECT id FROM about_settings LIMIT 1);
  ELSE
    -- Insert complete default row if none exists
    INSERT INTO about_settings (
      heading, description, story, mission, vision, values,
      hero_eyebrow, hero_feature_1_title, hero_feature_2_title, hero_feature_3_title,
      hero_primary_button, hero_secondary_button, hero_trust_text, hero_overlay_label, hero_overlay_title,
      story_eyebrow, story_heading, story_button, story_image_overlay_title,
      mission_eyebrow, mission_supporting_text,
      vision_eyebrow, vision_supporting_text,
      values_items, values_link_text,
      why_choose_eyebrow, why_choose_heading, why_choose_description, why_choose_benefits, why_choose_button, why_choose_image_overlay,
      certifications_eyebrow, certifications_heading, certifications_description, certifications_items,
      cta_eyebrow, cta_heading, cta_description, cta_primary_button, cta_secondary_button
    ) VALUES (
      'Building A Better Tomorrow',
      'Alveric Technical Contracting delivers reliable, innovative, and high-quality contracting solutions across commercial, residential, and industrial projects.',
      'Alveric Technical Contracting was founded with a clear vision — to deliver high-quality technical contracting services that create lasting value. Over the years, we have grown through our commitment to excellence, integrity, and innovation, becoming a trusted partner for clients across the UAE.',
      'To deliver safe, reliable, and innovative contracting solutions that enhance communities and create long-term value for our clients, people, and partners.',
      'To be a regional leader in technical contracting, recognized for quality, integrity, and a commitment to building a better tomorrow.',
      'Integrity: We do what''s right, always. | Quality: We never compromise on standards. | Safety: People and safety come first. | Innovation: We embrace smarter solutions.',
      'ABOUT ALVERIC', 'Quality Workmanship', 'On-Time Delivery', 'Client-Centric Approach',
      'Our Services', 'Get a Quote', 'Trusted by 100+ clients across the UAE', 'ENGINEERING EXCELLENCE', 'Engineering Excellence for a Brighter Future',
      'OUR STORY', 'A Journey Built on Trust and Expertise', 'Our Journey', 'Creating Smarter Spaces for Better Lives',
      'OUR PURPOSE', 'Focused on Progress. Driven by People.',
      'OUR HORIZON', 'Setting New Standards in Contracting Excellence.',
      '[
        {"title": "Integrity", "description": "We do what''s right, always."},
        {"title": "Quality", "description": "We never compromise on standards."},
        {"title": "Safety", "description": "People and safety come first."},
        {"title": "Innovation", "description": "We embrace smarter solutions."}
      ]'::jsonb,
      'Learn More About Our Values',
      'WHY CHOOSE ALVERIC', 'More Than a Contractor A Long-Term Partner', 'We bring together technical expertise, industry experience, and a commitment to excellence to deliver solutions that stand the test of time.',
      '[
        "Licensed & Certified Professionals",
        "Comprehensive Project Management",
        "Transparent Communication",
        "Commitment to Quality & Safety"
      ]'::jsonb,
      'Work With Us', 'Trusted Partner in Every Build',
      'OUR CERTIFICATIONS', 'Committed to Global Standards', 'We follow internationally recognized standards to ensure quality, safety, and compliance in every project we deliver.',
      '[
        {"title": "ISO 9001:2015"},
        {"title": "UAE Municipality Compliant"},
        {"title": "HSE Certified"}
      ]'::jsonb,
      'LET''S BUILD TOGETHER', 'Ready to Bring Your Project to Life?', 'Partner with Alveric Technical Contracting and experience reliable, efficient, and high-quality contracting solutions.',
      'Get a Free Quote', 'Chat on WhatsApp'
    );
  END IF;
END $$;


-- 3. Seed / Upsert the 4 Company Statistics into site_statistics (section = 'about')
-- 1: Years of Excellence
INSERT INTO site_statistics (label, value, suffix, display_order, section, is_published)
SELECT 'Years of Excellence', '5+', '', 1, 'about', true
WHERE NOT EXISTS (
  SELECT 1 FROM site_statistics WHERE section = 'about' AND label = 'Years of Excellence'
);
UPDATE site_statistics
SET value = '5+', is_published = true, display_order = 1
WHERE section = 'about' AND label = 'Years of Excellence';

-- 2: Projects Completed
INSERT INTO site_statistics (label, value, suffix, display_order, section, is_published)
SELECT 'Projects Completed', '100+', '', 2, 'about', true
WHERE NOT EXISTS (
  SELECT 1 FROM site_statistics WHERE section = 'about' AND label = 'Projects Completed'
);
UPDATE site_statistics
SET value = '100+', is_published = true, display_order = 2
WHERE section = 'about' AND label = 'Projects Completed';

-- 3: Happy Clients
INSERT INTO site_statistics (label, value, suffix, display_order, section, is_published)
SELECT 'Happy Clients', '50+', '', 3, 'about', true
WHERE NOT EXISTS (
  SELECT 1 FROM site_statistics WHERE section = 'about' AND label = 'Happy Clients'
);
UPDATE site_statistics
SET value = '50+', is_published = true, display_order = 3
WHERE section = 'about' AND label = 'Happy Clients';

-- 4: Skilled Professionals
INSERT INTO site_statistics (label, value, suffix, display_order, section, is_published)
SELECT 'Skilled Professionals', '25+', '', 4, 'about', true
WHERE NOT EXISTS (
  SELECT 1 FROM site_statistics WHERE section = 'about' AND label = 'Skilled Professionals'
);
UPDATE site_statistics
SET value = '25+', is_published = true, display_order = 4
WHERE section = 'about' AND label = 'Skilled Professionals';
