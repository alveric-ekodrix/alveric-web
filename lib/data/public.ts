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
    // Query the latest updated record directly
    const { data: rawData, error } = await supabase
      .from('about_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let result: any = rawData || {};

    if (!result.banner_image && result.banner_image_id) {
      const { data: mediaItem } = await supabase
        .from('media')
        .select('*')
        .eq('id', result.banner_image_id)
        .maybeSingle();
      if (mediaItem) result.banner_image = mediaItem;
    }

    if (!result.story_image && result.story_image_id) {
      const { data: mediaItem } = await supabase
        .from('media')
        .select('*')
        .eq('id', result.story_image_id)
        .maybeSingle();
      if (mediaItem) result.story_image = mediaItem;
    }

    if (!result.cta_image && result.cta_image_id) {
      const { data: mediaItem } = await supabase
        .from('media')
        .select('*')
        .eq('id', result.cta_image_id)
        .maybeSingle();
      if (mediaItem) result.cta_image = mediaItem;
    }

    if (!result.team_image && result.team_image_id) {
      const { data: mediaItem } = await supabase
        .from('media')
        .select('*')
        .eq('id', result.team_image_id)
        .maybeSingle();
      if (mediaItem) result.team_image = mediaItem;
    }

    // Load media from site_statistics fallback (banner_image, story_image, team_image, cta_image)
    const { data: pageMedia } = await supabase
      .from('site_statistics')
      .select('*')
      .in('section', ['about_banner_media', 'about_page_media']);

    if (pageMedia && pageMedia.length > 0) {
      for (const item of pageMedia) {
        if (!item.suffix) continue;
        const mediaObj = {
          id: item.value || item.id,
          secure_url: item.suffix,
          alt_text: item.label,
        };

        if ((item.label === 'about_hero_banner' || item.label === 'banner_image') && !result.banner_image) {
          result.banner_image = mediaObj;
        } else if (item.label === 'story_image') {
          result.story_image = mediaObj;
        } else if (item.label === 'team_image') {
          result.team_image = mediaObj;
        } else if (item.label === 'cta_image') {
          result.cta_image = mediaObj;
        }
      }
    }

    // Default values for newly added fields to ensure public page always renders exact content
    const defaults = {
      hero_eyebrow: 'ABOUT ALVERIC',
      hero_feature_1_title: 'Quality Workmanship',
      hero_feature_2_title: 'On-Time Delivery',
      hero_feature_3_title: 'Client-Centric Approach',
      hero_primary_button: 'Our Services',
      hero_secondary_button: 'Get a Quote',
      hero_trust_text: 'Trusted by 100+ clients across the UAE',
      hero_overlay_label: 'ENGINEERING EXCELLENCE',
      hero_overlay_title: 'Engineering Excellence for a Brighter Future',

      story_eyebrow: 'OUR STORY',
      story_heading: 'A Journey Built on Trust and Expertise',
      story_button: 'Our Journey',
      story_image_overlay_title: 'Creating Smarter Spaces for Better Lives',

      mission_eyebrow: 'OUR PURPOSE',
      mission_supporting_text: 'Focused on Progress. Driven by People.',

      vision_eyebrow: 'OUR HORIZON',
      vision_supporting_text: 'Setting New Standards in Contracting Excellence.',

      values_items: [
        { title: 'Integrity', description: "We do what's right, always." },
        { title: 'Quality', description: 'We never compromise on standards.' },
        { title: 'Safety', description: 'People and safety come first.' },
        { title: 'Innovation', description: 'We embrace smarter solutions.' },
      ],
      values_link_text: 'Learn More About Our Values',

      why_choose_eyebrow: 'WHY CHOOSE ALVERIC',
      why_choose_heading: 'More Than a Contractor A Long-Term Partner',
      why_choose_description:
        'We bring together technical expertise, industry experience, and a commitment to excellence to deliver solutions that stand the test of time.',
      why_choose_benefits: [
        'Licensed & Certified Professionals',
        'Comprehensive Project Management',
        'Transparent Communication',
        'Commitment to Quality & Safety',
      ],
      why_choose_button: 'Work With Us',
      why_choose_image_overlay: 'Trusted Partner in Every Build',

      certifications_eyebrow: 'OUR CERTIFICATIONS',
      certifications_heading: 'Committed to Global Standards',
      certifications_description:
        'We follow internationally recognized standards to ensure quality, safety, and compliance in every project we deliver.',
      certifications_items: [
        { title: 'ISO 9001:2015' },
        { title: 'UAE Municipality Compliant' },
        { title: 'HSE Certified' },
      ],

      cta_eyebrow: "LET'S BUILD TOGETHER",
      cta_heading: 'Ready to Bring Your Project to Life?',
      cta_description:
        'Partner with Alveric Technical Contracting and experience reliable, efficient, and high-quality contracting solutions.',
      cta_primary_button: 'Get a Free Quote',
      cta_secondary_button: 'Chat on WhatsApp',
    };

    // Filter out null/undefined values from result so defaults take effect if fields are not set
    const cleanedResult = { ...result };
    Object.keys(defaults).forEach((key) => {
      if (cleanedResult[key] === null || cleanedResult[key] === undefined || cleanedResult[key] === '') {
        cleanedResult[key] = (defaults as any)[key];
      }
    });

    return {
      ...defaults,
      ...cleanedResult,
    } as AboutSettings;
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
