-- ============================================================
-- MIGRATION 003: Services Hero Banner & Projects Form Settings
-- Alveric Technical Contracting LLC
-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Paste the entire file and click "Run"
-- ============================================================


-- ============================================================
-- TABLE 1: SERVICES PAGE HERO SETTINGS
-- Controls the hero banner displayed at the top of /services
-- ============================================================
CREATE TABLE IF NOT EXISTS services_hero_settings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Text content
  eyebrow_text            TEXT DEFAULT 'Our Services',
  heading                 TEXT DEFAULT 'Engineering & Technical Contracting Services',
  subheading              TEXT DEFAULT 'Delivering precision-engineered solutions across MEP, civil, and infrastructure sectors.',

  -- Optional background image (references media table)
  background_image_id     UUID REFERENCES media(id) ON DELETE SET NULL,

  -- Background overlay opacity (0.0 to 1.0)
  overlay_opacity         NUMERIC(3,2) DEFAULT 0.65 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 1),

  -- Primary CTA
  primary_cta_text        TEXT DEFAULT 'Request a Quote',
  primary_cta_url         TEXT DEFAULT '/quote',

  -- Secondary CTA (optional)
  secondary_cta_text      TEXT,
  secondary_cta_url       TEXT,

  -- Badge / highlight pill shown above heading
  badge_text              TEXT,
  badge_color             TEXT DEFAULT '#C9A84C',

  -- Layout variant: 'centered' | 'left-aligned' | 'split'
  layout_variant          TEXT DEFAULT 'left-aligned'
                          CHECK (layout_variant IN ('centered', 'left-aligned', 'split')),

  -- Active state
  is_active               BOOLEAN DEFAULT true,

  -- Timestamps
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);

-- Seed one default row so admin always has a record to edit
INSERT INTO services_hero_settings (
  eyebrow_text, heading, subheading,
  primary_cta_text, primary_cta_url, layout_variant, is_active
)
SELECT
  'Our Services',
  'Engineering & Technical Contracting Services',
  'Delivering precision-engineered solutions across MEP, civil, infrastructure, and fit-out sectors.',
  'Request a Quote', '/quote', 'left-aligned', true
WHERE NOT EXISTS (SELECT 1 FROM services_hero_settings LIMIT 1);


-- ============================================================
-- TABLE 2: PROJECTS PAGE HERO SETTINGS
-- Controls the hero banner at the top of /projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects_hero_settings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Text content
  eyebrow_text            TEXT DEFAULT 'Our Portfolio',
  heading                 TEXT DEFAULT 'Contracting & Engineering Projects',
  subheading              TEXT DEFAULT 'Explore our track record of engineering accomplishments, commercial installations, luxury residential developments, and infrastructure maintenance.',

  -- Optional background image
  background_image_id     UUID REFERENCES media(id) ON DELETE SET NULL,

  -- Overlay opacity
  overlay_opacity         NUMERIC(3,2) DEFAULT 0.70
                          CHECK (overlay_opacity >= 0 AND overlay_opacity <= 1),

  -- Optional CTA
  primary_cta_text        TEXT,
  primary_cta_url         TEXT,

  -- Active state
  is_active               BOOLEAN DEFAULT true,

  -- Timestamps
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);

-- Seed one default row
INSERT INTO projects_hero_settings (eyebrow_text, heading, subheading, is_active)
SELECT
  'Our Portfolio',
  'Contracting & Engineering Projects',
  'Explore our track record of engineering accomplishments, commercial installations, luxury residential developments, and infrastructure maintenance.',
  true
WHERE NOT EXISTS (SELECT 1 FROM projects_hero_settings LIMIT 1);


-- ============================================================
-- TABLE 3: PROJECT INQUIRY FORM SETTINGS
-- Admin-editable copy and config for the /quote Project Inquiry form
-- ============================================================
CREATE TABLE IF NOT EXISTS project_form_settings (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Page-level copy
  page_eyebrow              TEXT DEFAULT 'Get a Quote',
  page_heading              TEXT DEFAULT 'Tell Us About Your Project',
  page_subheading           TEXT DEFAULT 'Share your project details and our team will get back to you within 24 hours.',

  -- Form field labels (admin-customisable without code changes)
  label_client_name         TEXT DEFAULT 'Your Full Name',
  label_company_name        TEXT DEFAULT 'Company Name (Optional)',
  label_email               TEXT DEFAULT 'Email Address',
  label_phone               TEXT DEFAULT 'Phone Number',
  label_whatsapp            TEXT DEFAULT 'WhatsApp Number (Optional)',
  label_service             TEXT DEFAULT 'Service Required',
  label_category            TEXT DEFAULT 'Project Category',
  label_location            TEXT DEFAULT 'Project Location',
  label_budget              TEXT DEFAULT 'Estimated Budget Range',
  label_contact_method      TEXT DEFAULT 'Preferred Contact Method',
  label_project_brief       TEXT DEFAULT 'Project Brief',

  -- Placeholder texts
  placeholder_project_brief TEXT DEFAULT 'Describe your project scope, requirements, timeline, and any specific technical details...',

  -- Submit button text
  submit_button_text        TEXT DEFAULT 'Submit Project Inquiry',

  -- Success message shown after submission
  success_heading           TEXT DEFAULT 'Inquiry Received!',
  success_message           TEXT DEFAULT 'Thank you for reaching out. Our technical team will review your project brief and contact you within 24 hours.',

  -- Budget range options as a JSONB array of strings
  budget_options            JSONB DEFAULT '[
    "Under AED 50,000",
    "AED 50,000 – 150,000",
    "AED 150,000 – 500,000",
    "AED 500,000 – 1,000,000",
    "AED 1,000,000 – 5,000,000",
    "Above AED 5,000,000",
    "To be discussed"
  ]'::jsonb,

  -- Contact method options as a JSONB array of strings
  contact_method_options    JSONB DEFAULT '[
    "Phone Call",
    "WhatsApp",
    "Email",
    "Video Call",
    "Site Visit"
  ]'::jsonb,

  -- Notification email — where new submissions get forwarded (optional)
  notification_email        TEXT,

  -- Auto-reply settings
  send_auto_reply           BOOLEAN DEFAULT true,
  auto_reply_subject        TEXT DEFAULT 'We received your project inquiry – Alveric Technical Contracting',
  auto_reply_body           TEXT DEFAULT E'Dear {{client_name}},\n\nThank you for submitting your project inquiry to Alveric Technical Contracting LLC. We have received your details and our technical team will review your brief within 24 hours.\n\nWarm regards,\nAlveric Technical Contracting Team',

  -- Active state
  is_active                 BOOLEAN DEFAULT true,

  -- Timestamps
  created_at                TIMESTAMPTZ DEFAULT now(),
  updated_at                TIMESTAMPTZ DEFAULT now()
);

-- Seed one default row
INSERT INTO project_form_settings (is_active)
SELECT true
WHERE NOT EXISTS (SELECT 1 FROM project_form_settings LIMIT 1);


-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_services_hero_active  ON services_hero_settings(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_hero_active  ON projects_hero_settings(is_active);
CREATE INDEX IF NOT EXISTS idx_project_form_active   ON project_form_settings(is_active);


-- ============================================================
-- AUTO-UPDATE TRIGGERS (set updated_at on every UPDATE)
-- Reuses the set_updated_at() function from migration 001
-- ============================================================
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN VALUES ('services_hero_settings'), ('projects_hero_settings'), ('project_form_settings') LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_set_updated_at ON %I;', t);
    EXECUTE format(
      'CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE set_updated_at();',
      t
    );
  END LOOP;
END $$;


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE services_hero_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_hero_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_form_settings   ENABLE ROW LEVEL SECURITY;

-- Public can READ the active row (so frontend can fetch copy without auth)
CREATE POLICY "Public read services hero"
  ON services_hero_settings FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Public read projects hero"
  ON projects_hero_settings FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Public read project form settings"
  ON project_form_settings FOR SELECT TO public USING (is_active = true);

-- Admins get full CRUD on all three tables
CREATE POLICY "Admin full access on services_hero_settings"
  ON services_hero_settings FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access on projects_hero_settings"
  ON projects_hero_settings FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin full access on project_form_settings"
  ON project_form_settings FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());


-- ============================================================
-- VERIFICATION — sanity-check SELECT after migration runs
-- Expected output: each table shows 1 row
-- ============================================================
SELECT 'services_hero_settings' AS table_name, COUNT(*) AS rows FROM services_hero_settings
UNION ALL
SELECT 'projects_hero_settings',                COUNT(*) FROM projects_hero_settings
UNION ALL
SELECT 'project_form_settings',                 COUNT(*) FROM project_form_settings;
