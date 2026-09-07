import { z } from 'zod';

export const contactSubmissionSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().max(150).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export const projectInquirySchema = z.object({
  client_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  company_name: z.string().max(100).optional(),
  client_email: z.string().email('Please enter a valid email address'),
  client_phone: z.string().min(7, 'Please enter a valid phone number'),
  whatsapp: z.string().optional(),
  service_id: z.string().uuid('Please select a service').optional().nullable(),
  category_id: z.string().uuid('Please select a category').optional().nullable(),
  location: z.string().max(150).optional(),
  budget_range: z.string().max(100).optional(),
  preferred_contact_method: z.enum(['phone', 'whatsapp', 'email']).default('email'),
  project_brief: z.string().min(10, 'Please provide details about your project').max(3000),
});

export const jobApplicationSchema = z.object({
  job_id: z.string().uuid().optional().nullable(),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  resume_media_id: z.string().uuid().optional().nullable(),
  cover_message: z.string().max(2000).optional(),
});

// Safe optional UUID helper that tolerates empty strings, null, and undefined
const optionalUuid = z
  .string()
  .nullish()
  .or(z.literal(''))
  .transform((v) => (v && v.trim() !== '' ? v : null));

export const serviceFormSchema = z.object({
  name: z.string().min(2, 'Service name is required').max(150),
  slug: z.string().min(2, 'Slug is required').max(150).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  short_description: z.string().max(300).optional().nullable(),
  description: z.string().optional().nullable(),
  icon_media_id: optionalUuid,
  featured_image_id: optionalUuid,
  benefits: z.array(z.string()).default([]),
  process_steps: z.array(z.object({
    title: z.string().min(1, 'Step title is required'),
    description: z.string().min(1, 'Step description is required'),
  })).default([]),
  display_order: z.number().int().default(0),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  seo_title: z.string().max(100).optional().nullable(),
  seo_description: z.string().max(255).optional().nullable(),
});

export const categoryFormSchema = z.object({
  name: z.string().min(2, 'Category name is required').max(100),
  slug: z.string().min(2, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(500).optional().nullable(),
  display_order: z.number().int().default(0),
  is_published: z.boolean().default(false),
});

export const projectFormSchema = z.object({
  title: z.string().min(2, 'Project title is required').max(200),
  slug: z.string().min(2, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  category_id: optionalUuid,
  client_name: z.string().max(150).optional().nullable(),
  location: z.string().max(150).optional().nullable(),
  completion_date: z.string().optional().nullable(),
  short_description: z.string().max(300).optional().nullable(),
  description: z.string().optional().nullable(),
  challenge: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  results: z.string().optional().nullable(),
  thumbnail_media_id: optionalUuid,
  featured_image_id: optionalUuid,
  gallery_media_ids: z.array(z.string()).default([]),
  service_ids: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  display_order: z.number().int().default(0),
  seo_title: z.string().max(100).optional().nullable(),
  seo_description: z.string().max(255).optional().nullable(),
});

export const testimonialFormSchema = z.object({
  client_name: z.string().min(2, 'Client name is required').max(100),
  client_role: z.string().max(100).optional().nullable(),
  company_name: z.string().max(100).optional().nullable(),
  avatar_media_id: optionalUuid,
  rating: z.number().int().min(1).max(5).default(5),
  content: z.string().min(10, 'Content must be at least 10 characters').max(1000),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  display_order: z.number().int().default(0),
});

export const jobFormSchema = z.object({
  title: z.string().min(2, 'Job title is required').max(150),
  slug: z.string().min(2, 'Slug is required').max(150).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  department: z.string().max(100).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  employment_type: z.string().max(50).optional().nullable(),
  experience: z.string().max(50).optional().nullable(),
  short_description: z.string().max(300).optional().nullable(),
  description: z.string().optional().nullable(),
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  is_published: z.boolean().default(false),
  display_order: z.number().int().default(0),
});

export const companySettingsSchema = z.object({
  company_name: z.string().min(2, 'Company name is required').max(150),
  tagline: z.string().max(200).optional().nullable(),
  logo_media_id: optionalUuid,
  phone_primary: z.string().optional().nullable(),
  phone_secondary: z.string().optional().nullable(),
  whatsapp_number: z.string().optional().nullable(),
  email: z.string().email('Please enter a valid email address').optional().nullable().or(z.literal('')),
  address: z.string().max(300).optional().nullable(),
  business_hours: z.string().max(200).optional().nullable(),
  google_maps_url: z.string().url('Please enter a valid URL').optional().nullable().or(z.literal('')),
  facebook_url: z.string().url('Please enter a valid URL').optional().nullable().or(z.literal('')),
  instagram_url: z.string().url('Please enter a valid URL').optional().nullable().or(z.literal('')),
  linkedin_url: z.string().url('Please enter a valid URL').optional().nullable().or(z.literal('')),
  youtube_url: z.string().url('Please enter a valid URL').optional().nullable().or(z.literal('')),
});

export const homepageSettingsSchema = z.object({
  hero_eyebrow: z.string().max(100).optional().nullable(),
  hero_heading: z.string().max(200).optional().nullable(),
  hero_description: z.string().max(1000).optional().nullable(),
  hero_image_id: z.string().uuid().optional().nullable(),
  primary_cta_text: z.string().max(50).optional().nullable(),
  primary_cta_url: z.string().max(200).optional().nullable(),
  secondary_cta_text: z.string().max(50).optional().nullable(),
  secondary_cta_url: z.string().max(200).optional().nullable(),
  about_heading: z.string().max(200).optional().nullable(),
  about_description: z.string().max(2000).optional().nullable(),
  about_experience_text: z.string().max(100).optional().nullable(),
  about_cta_text: z.string().max(50).optional().nullable(),
  about_cta_url: z.string().max(200).optional().nullable(),
  cta_heading: z.string().max(200).optional().nullable(),
  cta_description: z.string().max(500).optional().nullable(),
  cta_button_text: z.string().max(50).optional().nullable(),
  cta_button_url: z.string().max(200).optional().nullable(),
  cta_background_image_id: z.string().uuid().optional().nullable(),
});
