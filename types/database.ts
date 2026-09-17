export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Media {
  id: string;
  public_id: string;
  secure_url: string;
  resource_type: string | null;
  width: number | null;
  height: number | null;
  folder: string | null;
  alt_text: string | null;
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  created_at: string;
}

export interface CompanySettings {
  id: string;
  company_name: string | null;
  tagline: string | null;
  logo_media_id: string | null;
  phone_primary: string | null;
  phone_secondary: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  business_hours: string | null;
  google_maps_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  founding_year?: string | number | null;
  created_at: string;
  updated_at: string;
  logo_media?: Media | null;
}

export interface HomepageSettings {
  id: string;
  hero_eyebrow: string | null;
  hero_heading: string | null;
  hero_description: string | null;
  hero_image_id: string | null;
  primary_cta_text: string | null;
  primary_cta_url: string | null;
  secondary_cta_text: string | null;
  secondary_cta_url: string | null;
  about_heading: string | null;
  about_description: string | null;
  about_experience_text: string | null;
  about_cta_text: string | null;
  about_cta_url: string | null;
  about_image_1_id?: string | null;
  about_image_2_id?: string | null;
  about_image_3_id?: string | null;
  cta_heading: string | null;
  cta_description: string | null;
  cta_button_text: string | null;
  cta_button_url: string | null;
  cta_background_image_id: string | null;
  created_at: string;
  updated_at: string;
  hero_image?: Media | null;
  cta_background_image?: Media | null;
  about_image_1?: Media | null;
  about_image_2?: Media | null;
  about_image_3?: Media | null;
}

export interface AboutValueItem {
  title: string;
  description: string;
}

export interface AboutCertificationItem {
  title: string;
}

export interface AboutSettings {
  id: string;
  heading: string | null;
  description: string | null;
  story: string | null;
  mission: string | null;
  vision: string | null;
  values: string | null;
  banner_image_id?: string | null;

  // Hero fields
  hero_eyebrow?: string | null;
  hero_feature_1_title?: string | null;
  hero_feature_2_title?: string | null;
  hero_feature_3_title?: string | null;
  hero_primary_button?: string | null;
  hero_secondary_button?: string | null;
  hero_trust_text?: string | null;
  hero_overlay_label?: string | null;
  hero_overlay_title?: string | null;

  // Story fields
  story_eyebrow?: string | null;
  story_heading?: string | null;
  story_button?: string | null;
  story_image_overlay_title?: string | null;

  // Mission fields
  mission_eyebrow?: string | null;
  mission_supporting_text?: string | null;

  // Vision fields
  vision_eyebrow?: string | null;
  vision_supporting_text?: string | null;

  // Values fields
  values_items?: AboutValueItem[] | Json | null;
  values_link_text?: string | null;

  // Why Choose fields
  why_choose_eyebrow?: string | null;
  why_choose_heading?: string | null;
  why_choose_description?: string | null;
  why_choose_benefits?: string[] | Json | null;
  why_choose_button?: string | null;
  why_choose_image_overlay?: string | null;

  // Certifications fields
  certifications_eyebrow?: string | null;
  certifications_heading?: string | null;
  certifications_description?: string | null;
  certifications_items?: AboutCertificationItem[] | Json | null;

  // Final CTA fields
  cta_eyebrow?: string | null;
  cta_heading?: string | null;
  cta_description?: string | null;
  cta_primary_button?: string | null;
  cta_secondary_button?: string | null;

  created_at: string;
  updated_at: string;
  banner_image?: Media | null;
  story_image?: Media | null;
  team_image?: Media | null;
  cta_image?: Media | null;
}

export interface WhyUsSettings {
  id: string;
  heading: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface WhyUsFeature {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  icon_media_id: string | null;
  image_media_id: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  icon_media?: Media | null;
  image_media?: Media | null;
}

export interface SiteStatistic {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  display_order: number;
  section: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  icon_media_id: string | null;
  featured_image_id: string | null;
  benefits: string[] | Json;
  process_steps: { title: string; description: string }[] | Json;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  icon_media?: Media | null;
  featured_image?: Media | null;
  service_images?: { media: Media; display_order: number }[];
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  client_name: string | null;
  location: string | null;
  completion_date: string | null;
  short_description: string | null;
  description: string | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  thumbnail_media_id: string | null;
  featured_image_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  category?: ProjectCategory | null;
  thumbnail_media?: Media | null;
  featured_image?: Media | null;
  project_images?: { media: Media; display_order: number }[];
  project_services?: { service: Service }[];
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string | null;
  company_name: string | null;
  avatar_media_id: string | null;
  rating: number;
  content: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  avatar_media?: Media | null;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  experience: string | null;
  short_description: string | null;
  description: string | null;
  responsibilities: string[] | Json;
  requirements: string[] | Json;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  resume_media_id: string | null;
  cover_message: string | null;
  status: 'new' | 'reviewing' | 'shortlisted' | 'interview' | 'selected' | 'rejected';
  created_at: string;
  updated_at: string;
  job?: Job | null;
  resume_media?: Media | null;
}

export interface ProjectInquiry {
  id: string;
  client_name: string;
  company_name: string | null;
  client_email: string;
  client_phone: string | null;
  whatsapp: string | null;
  service_id: string | null;
  category_id: string | null;
  location: string | null;
  budget_range: string | null;
  preferred_contact_method: string | null;
  project_brief: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'converted' | 'closed';
  created_at: string;
  updated_at: string;
  service?: Service | null;
  category?: ProjectCategory | null;
}

export interface ContactSubmission {
  id: string;
  name?: string;
  full_name?: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Migration 003 ────────────────────────────────────────────────────────────

export interface ServicesHeroSettings {
  id: string;
  eyebrow_text: string | null;
  heading: string | null;
  subheading: string | null;
  background_image_id: string | null;
  overlay_opacity: number | null;
  primary_cta_text: string | null;
  primary_cta_url: string | null;
  secondary_cta_text: string | null;
  secondary_cta_url: string | null;
  badge_text: string | null;
  badge_color: string | null;
  layout_variant: 'centered' | 'left-aligned' | 'split' | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  background_image?: Media | null;
}

export interface ProjectsHeroSettings {
  id: string;
  eyebrow_text: string | null;
  heading: string | null;
  subheading: string | null;
  background_image_id: string | null;
  overlay_opacity: number | null;
  primary_cta_text: string | null;
  primary_cta_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  background_image?: Media | null;
}

export interface ProjectFormSettings {
  id: string;
  page_eyebrow: string | null;
  page_heading: string | null;
  page_subheading: string | null;
  label_client_name: string | null;
  label_company_name: string | null;
  label_email: string | null;
  label_phone: string | null;
  label_whatsapp: string | null;
  label_service: string | null;
  label_category: string | null;
  label_location: string | null;
  label_budget: string | null;
  label_contact_method: string | null;
  label_project_brief: string | null;
  placeholder_project_brief: string | null;
  submit_button_text: string | null;
  success_heading: string | null;
  success_message: string | null;
  budget_options: string[] | Json;
  contact_method_options: string[] | Json;
  notification_email: string | null;
  send_auto_reply: boolean;
  auto_reply_subject: string | null;
  auto_reply_body: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
