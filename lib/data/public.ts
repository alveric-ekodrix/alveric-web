import { createClient } from '@/lib/supabase/server';
import {
  CompanySettings,
  HomepageSettings,
  AboutSettings,
  WhyUsSettings,
  WhyUsFeature,
  SiteStatistic,
  Service,
  ProjectCategory,
  Project,
  Testimonial,
  Job,
} from '@/types/database';

export async function getCompanySettings(): Promise<CompanySettings | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('company_settings')
      .select('*, logo_media:media!company_settings_logo_media_id_fkey(*)')
      .limit(1)
      .maybeSingle();

    if (error) {
      // Fallback try without foreign key alias if simple select
      const { data: rawData } = await supabase.from('company_settings').select('*').limit(1).maybeSingle();
      return rawData || null;
    }
    return data || null;
  } catch (err) {
    console.error('Error fetching company settings:', err);
    return null;
  }
}

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('*, hero_image:media!homepage_settings_hero_image_id_fkey(*), cta_background_image:media!homepage_settings_cta_background_image_id_fkey(*)')
      .limit(1)
      .maybeSingle();

    let result = data;
    if (error) {
      const { data: rawData } = await supabase.from('homepage_settings').select('*').limit(1).maybeSingle();
      result = rawData;
    }

    if (result) {
      // Resolve hero_image if not joined via foreign key
      if (!result.hero_image && result.hero_image_id) {
        const { data: heroMedia } = await supabase
          .from('media')
          .select('*')
          .eq('id', result.hero_image_id)
          .maybeSingle();
        if (heroMedia) result.hero_image = heroMedia;
      }

      // Resolve cta_background_image if not joined via foreign key
      if (!result.cta_background_image && result.cta_background_image_id) {
        const { data: ctaMedia } = await supabase
          .from('media')
          .select('*')
          .eq('id', result.cta_background_image_id)
          .maybeSingle();
        if (ctaMedia) result.cta_background_image = ctaMedia;
      }

      const mediaIds = [
        result.about_image_1_id,
        result.about_image_2_id,
        result.about_image_3_id,
      ].filter(Boolean) as string[];

      if (mediaIds.length > 0) {
        const { data: mediaItems } = await supabase
          .from('media')
          .select('*')
          .in('id', mediaIds);

        if (mediaItems) {
          const mediaMap = new Map(mediaItems.map((m: any) => [m.id, m]));
          if (result.about_image_1_id) result.about_image_1 = mediaMap.get(result.about_image_1_id) || null;
          if (result.about_image_2_id) result.about_image_2 = mediaMap.get(result.about_image_2_id) || null;
          if (result.about_image_3_id) result.about_image_3 = mediaMap.get(result.about_image_3_id) || null;
        }
      }

      // Secondary check: site_statistics backup for 100% reliability
      if (!result.about_image_1 || !result.about_image_2 || !result.about_image_3) {
        const { data: backupStats } = await supabase
          .from('site_statistics')
          .select('*')
          .eq('section', 'home_about_media');

        if (backupStats && backupStats.length > 0) {
          // 1. Direct URL check via suffix
          backupStats.forEach((b) => {
            if (b.suffix && b.suffix.startsWith('http')) {
              const directMedia = {
                id: b.value || b.id,
                secure_url: b.suffix,
                alt_text: b.label === 'about_image_1' ? 'Electrical & MEP' : b.label === 'about_image_2' ? 'Facility Engineering' : 'Field Experts',
                public_id: '',
                resource_type: 'image',
              } as any;
              if (b.label === 'about_image_1' && !result?.about_image_1) result.about_image_1 = directMedia;
              if (b.label === 'about_image_2' && !result?.about_image_2) result.about_image_2 = directMedia;
              if (b.label === 'about_image_3' && !result?.about_image_3) result.about_image_3 = directMedia;
            }
          });

          // 2. Lookup via media IDs
          const backupIds = backupStats.map((s) => s.value).filter(Boolean);
          if (backupIds.length > 0) {
            const { data: backupMedia } = await supabase
              .from('media')
              .select('*')
              .in('id', backupIds);

            if (backupMedia) {
              const bMap = new Map(backupMedia.map((m: any) => [m.id, m]));
              backupStats.forEach((b) => {
                if (b.label === 'about_image_1' && !result?.about_image_1) result.about_image_1 = bMap.get(b.value) || null;
                if (b.label === 'about_image_2' && !result?.about_image_2) result.about_image_2 = bMap.get(b.value) || null;
                if (b.label === 'about_image_3' && !result?.about_image_3) result.about_image_3 = bMap.get(b.value) || null;
              });
            }
          }
        }
      }
    }

    return result || null;
  } catch (err) {
    console.error('Error fetching homepage settings:', err);
    return null;
  }
}

export async function getPublishedServices(): Promise<Service[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*, icon_media:media!services_icon_media_id_fkey(*), featured_image:media!services_featured_image_id_fkey(*)')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) {
      const { data: rawData } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      return rawData || [];
    }
    return data || [];
  } catch (err) {
    console.error('Error fetching published services:', err);
    return [];
  }
}

export async function getPublishedServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*, icon_media:media!services_icon_media_id_fkey(*), featured_image:media!services_featured_image_id_fkey(*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      const { data: rawData } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      return rawData || null;
    }
    return data || null;
  } catch (err) {
    console.error(`Error fetching service by slug ${slug}:`, err);
    return null;
  }
}

export async function getPublishedCategories(): Promise<ProjectCategory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('project_categories')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) return [];
    return data || [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export async function getPublishedProjects(categoryId?: string): Promise<Project[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('projects')
      .select('*, category:project_categories(*), thumbnail_media:media!projects_thumbnail_media_id_fkey(*), featured_image:media!projects_featured_image_id_fkey(*)')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) {
      const { data: rawData } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      return rawData || [];
    }
    return data || [];
  } catch (err) {
    console.error('Error fetching projects:', err);
    return [];
  }
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*, category:project_categories(*), thumbnail_media:media!projects_thumbnail_media_id_fkey(*), featured_image:media!projects_featured_image_id_fkey(*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      const { data: rawData } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      return rawData || null;
    }
    return data || null;
  } catch (err) {
    console.error(`Error fetching project ${slug}:`, err);
    return null;
  }
}

export async function getSiteStatistics(section: string = 'about'): Promise<SiteStatistic[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_statistics')
      .select('*')
      .eq('section', section)
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) return [];
    return data || [];
  } catch (err) {
    console.error('Error fetching statistics:', err);
    return [];
  }
}

export async function getAboutSettings(): Promise<AboutSettings | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('about_settings')
      .select('*, banner_image:media!about_settings_banner_image_id_fkey(*)')
      .limit(1)
      .maybeSingle();

    let result: any = data;
    if (error || !result) {
      const { data: rawData } = await supabase.from('about_settings').select('*').limit(1).maybeSingle();
      result = rawData;
    }

    if (result) {
      if (!result.banner_image && result.banner_image_id) {
        const { data: mediaItem } = await supabase
          .from('media')
          .select('*')
          .eq('id', result.banner_image_id)
          .maybeSingle();
        if (mediaItem) result.banner_image = mediaItem;
      }

      // Resilient backup check in site_statistics
      if (!result.banner_image) {
        const { data: backupMedia } = await supabase
          .from('site_statistics')
          .select('*')
          .eq('section', 'about_banner_media')
          .eq('label', 'about_hero_banner')
          .maybeSingle();

        if (backupMedia && backupMedia.suffix) {
          result.banner_image = {
            id: backupMedia.value || 'backup',
            secure_url: backupMedia.suffix,
          } as any;
        }
      }
    }

    return result || null;
  } catch (err) {
    console.error('Error fetching about settings:', err);
    return null;
  }
}

export async function getWhyUsSettings(): Promise<WhyUsSettings | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('why_us_settings').select('*').limit(1).maybeSingle();
    return data || null;
  } catch {
    return null;
  }
}

export async function getWhyUsFeatures(): Promise<WhyUsFeature[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('why_us_features')
      .select('*, icon_media:media!why_us_features_icon_media_id_fkey(*), image_media:media!why_us_features_image_media_id_fkey(*)')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export async function getPublishedJobs(): Promise<Job[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export async function getPublishedJobBySlug(slug: string): Promise<Job | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();
    return data || null;
  } catch {
    return null;
  }
}
