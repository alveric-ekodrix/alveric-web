-- ============================================================
-- ALVERIC TECHNICAL CONTRACTING LLC - DATABASE SCHEMA
-- ============================================================

-- Enable pgcrypto / uuid-ossp if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MEDIA TABLE
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id TEXT UNIQUE NOT NULL,
  secure_url TEXT NOT NULL,
  resource_type TEXT DEFAULT 'image',
  width INTEGER,
  height INTEGER,
  folder TEXT,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. COMPANY SETTINGS
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT,
  tagline TEXT,
  logo_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  phone_primary TEXT,
  phone_secondary TEXT,
  whatsapp_number TEXT,
  email TEXT,
  address TEXT,
  business_hours TEXT,
  google_maps_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. HOMEPAGE SETTINGS
CREATE TABLE IF NOT EXISTS homepage_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_eyebrow TEXT,
  hero_heading TEXT,
  hero_description TEXT,
  hero_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  primary_cta_text TEXT,
  primary_cta_url TEXT,
  secondary_cta_text TEXT,
  secondary_cta_url TEXT,
  about_heading TEXT,
  about_description TEXT,
  about_experience_text TEXT,
  about_cta_text TEXT,
  about_cta_url TEXT,
  cta_heading TEXT,
  cta_description TEXT,
  cta_button_text TEXT,
  cta_button_url TEXT,
  cta_background_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. ABOUT SETTINGS
CREATE TABLE IF NOT EXISTS about_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT,
  description TEXT,
  story TEXT,
  mission TEXT,
  vision TEXT,
  values TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. WHY US SETTINGS
CREATE TABLE IF NOT EXISTS why_us_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. WHY US FEATURES
CREATE TABLE IF NOT EXISTS why_us_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  image_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. SITE STATISTICS
CREATE TABLE IF NOT EXISTS site_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  display_order INTEGER DEFAULT 0,
  section TEXT DEFAULT 'about',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  icon_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  featured_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  benefits JSONB DEFAULT '[]'::jsonb,
  process_steps JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. SERVICE IMAGES (GALLERY)
CREATE TABLE IF NOT EXISTS service_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. PROJECT CATEGORIES
CREATE TABLE IF NOT EXISTS project_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES project_categories(id) ON DELETE SET NULL,
  client_name TEXT,
  location TEXT,
  completion_date DATE,
  short_description TEXT,
  description TEXT,
  challenge TEXT,
  solution TEXT,
  results TEXT,
  thumbnail_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  featured_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. PROJECT IMAGES (GALLERY)
CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. PROJECT SERVICES (MANY-TO-MANY)
CREATE TABLE IF NOT EXISTS project_services (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, service_id)
);

-- 15. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_role TEXT,
  company_name TEXT,
  avatar_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 16. CAREERS / JOBS
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  department TEXT,
  location TEXT,
  employment_type TEXT,
  experience TEXT,
  short_description TEXT,
  description TEXT,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 17. JOB APPLICATIONS
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  cover_message TEXT,
  status TEXT DEFAULT 'new' CHECK(status IN ('new', 'reviewing', 'shortlisted', 'interview', 'selected', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 18. PROJECT INQUIRIES / QUOTES
CREATE TABLE IF NOT EXISTS project_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company_name TEXT,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  whatsapp TEXT,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  category_id UUID REFERENCES project_categories(id) ON DELETE SET NULL,
  location TEXT,
  budget_range TEXT,
  preferred_contact_method TEXT,
  project_brief TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'in_discussion', 'converted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 19. CONTACT SUBMISSIONS
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON services(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);

CREATE INDEX IF NOT EXISTS idx_project_categories_slug ON project_categories(slug);
CREATE INDEX IF NOT EXISTS idx_project_categories_published ON project_categories(is_published, display_order);

CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_published ON jobs(is_published, display_order);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published, display_order);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON project_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON project_inquiries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON job_applications(created_at DESC);

-- ============================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN (
    'company_settings', 'homepage_settings', 'about_settings', 'why_us_settings', 
    'why_us_features', 'site_statistics', 'services', 'project_categories', 
    'projects', 'testimonials', 'jobs', 'job_applications', 'project_inquiries'
  ) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_set_updated_at ON %I;', t);
    EXECUTE format('CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE set_updated_at();', t);
  END LOOP;
END $$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_us_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_us_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Helper admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PUBLIC READ POLICIES
CREATE POLICY "Public read company settings" ON company_settings FOR SELECT TO public USING (true);
CREATE POLICY "Public read homepage settings" ON homepage_settings FOR SELECT TO public USING (true);
CREATE POLICY "Public read about settings" ON about_settings FOR SELECT TO public USING (true);
CREATE POLICY "Public read why us settings" ON why_us_settings FOR SELECT TO public USING (true);
CREATE POLICY "Public read why us features" ON why_us_features FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Public read site statistics" ON site_statistics FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Public read published services" ON services FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Public read published service images" ON service_images FOR SELECT TO public USING (
  EXISTS (SELECT 1 FROM services WHERE services.id = service_images.service_id AND services.is_published = true)
);
CREATE POLICY "Public read published categories" ON project_categories FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Public read published projects" ON projects FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Public read published project images" ON project_images FOR SELECT TO public USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND projects.is_published = true)
);
CREATE POLICY "Public read published project services" ON project_services FOR SELECT TO public USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_services.project_id AND projects.is_published = true)
);
CREATE POLICY "Public read published testimonials" ON testimonials FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Public read published jobs" ON jobs FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Public read media" ON media FOR SELECT TO public USING (true);

-- 2. PUBLIC INSERT POLICIES
CREATE POLICY "Public insert project inquiries" ON project_inquiries FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public insert contact submissions" ON contact_submissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public insert job applications" ON job_applications FOR INSERT TO public WITH CHECK (true);

-- 3. ADMIN FULL ACCESS POLICIES (CRUD)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admin full access on %I" ON %I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Admin full access on %I" ON %I FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());', tbl, tbl);
  END LOOP;
END $$;
