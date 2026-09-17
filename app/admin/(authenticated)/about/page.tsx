'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ImageUploadZone } from '@/components/media/ImageUploadZone';
import { Media, AboutValueItem, AboutCertificationItem } from '@/types/database';
import {
  Save,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Info,
  Compass,
  Target,
  BookOpen,
  Award,
  Sparkles,
  Shield,
  Send,
  BarChart3,
  FileCheck,
  Eye,
} from 'lucide-react';

export const EXACT_DESIGN_ABOUT = {
  // Existing Base Fields
  heading: 'Building A Better Tomorrow',
  description:
    'Alveric Technical Contracting delivers reliable, innovative, and high-quality contracting solutions across commercial, residential, and industrial projects.',
  story:
    'Alveric Technical Contracting was founded with a clear vision — to deliver high-quality technical contracting services that create lasting value. Over the years, we have grown through our commitment to excellence, integrity, and innovation, becoming a trusted partner for clients across the UAE.',
  mission:
    'To deliver safe, reliable, and innovative contracting solutions that enhance communities and create long-term value for our clients, people, and partners.',
  vision:
    'To be a regional leader in technical contracting, recognized for quality, integrity, and a commitment to building a better tomorrow.',
  values:
    "Integrity: We do what's right, always. | Quality: We never compromise on standards. | Safety: People and safety come first. | Innovation: We embrace smarter solutions.",

  // 1. Hero Content
  hero_eyebrow: 'ABOUT ALVERIC',
  hero_feature_1_title: 'Quality Workmanship',
  hero_feature_2_title: 'On-Time Delivery',
  hero_feature_3_title: 'Client-Centric Approach',
  hero_primary_button: 'Our Services',
  hero_secondary_button: 'Get a Quote',
  hero_trust_text: 'Trusted by 100+ clients across the UAE',
  hero_overlay_label: 'ENGINEERING EXCELLENCE',
  hero_overlay_title: 'Engineering Excellence for a Brighter Future',

  // 2. Company Statistics
  stats: [
    { value: '5+', label: 'Years of Excellence' },
    { value: '100+', label: 'Projects Completed' },
    { value: '50+', label: 'Happy Clients' },
    { value: '25+', label: 'Skilled Professionals' },
  ],

  // 3. Story Section
  story_eyebrow: 'OUR STORY',
  story_heading: 'A Journey Built on Trust and Expertise',
  story_button: 'Our Journey',
  story_image_overlay_title: 'Creating Smarter Spaces for Better Lives',

  // 4. Mission
  mission_eyebrow: 'OUR PURPOSE',
  mission_supporting_text: 'Focused on Progress. Driven by People.',

  // 5. Vision
  vision_eyebrow: 'OUR HORIZON',
  vision_supporting_text: 'Setting New Standards in Contracting Excellence.',

  // 6. Values
  values_items: [
    { title: 'Integrity', description: "We do what's right, always." },
    { title: 'Quality', description: 'We never compromise on standards.' },
    { title: 'Safety', description: 'People and safety come first.' },
    { title: 'Innovation', description: 'We embrace smarter solutions.' },
  ],
  values_link_text: 'Learn More About Our Values',

  // 7. Why Choose Alveric
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

  // 8. Certifications
  certifications_eyebrow: 'OUR CERTIFICATIONS',
  certifications_heading: 'Committed to Global Standards',
  certifications_description:
    'We follow internationally recognized standards to ensure quality, safety, and compliance in every project we deliver.',
  certifications_items: [
    { title: 'ISO 9001:2015' },
    { title: 'UAE Municipality Compliant' },
    { title: 'HSE Certified' },
  ],

  // 9. Final CTA
  cta_eyebrow: "LET'S BUILD TOGETHER",
  cta_heading: 'Ready to Bring Your Project to Life?',
  cta_description:
    'Partner with Alveric Technical Contracting and experience reliable, efficient, and high-quality contracting solutions.',
  cta_primary_button: 'Get a Free Quote',
  cta_secondary_button: 'Chat on WhatsApp',
};

export default function AdminAboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // 1. Existing Base fields
  const [heading, setHeading] = useState(EXACT_DESIGN_ABOUT.heading);
  const [description, setDescription] = useState(EXACT_DESIGN_ABOUT.description);
  const [story, setStory] = useState(EXACT_DESIGN_ABOUT.story);
  const [mission, setMission] = useState(EXACT_DESIGN_ABOUT.mission);
  const [vision, setVision] = useState(EXACT_DESIGN_ABOUT.vision);
  const [values, setValues] = useState(EXACT_DESIGN_ABOUT.values);

  // 2. Hero fields
  const [heroEyebrow, setHeroEyebrow] = useState(EXACT_DESIGN_ABOUT.hero_eyebrow);
  const [heroFeature1Title, setHeroFeature1Title] = useState(EXACT_DESIGN_ABOUT.hero_feature_1_title);
  const [heroFeature2Title, setHeroFeature2Title] = useState(EXACT_DESIGN_ABOUT.hero_feature_2_title);
  const [heroFeature3Title, setHeroFeature3Title] = useState(EXACT_DESIGN_ABOUT.hero_feature_3_title);
  const [heroPrimaryButton, setHeroPrimaryButton] = useState(EXACT_DESIGN_ABOUT.hero_primary_button);
  const [heroSecondaryButton, setHeroSecondaryButton] = useState(EXACT_DESIGN_ABOUT.hero_secondary_button);
  const [heroTrustText, setHeroTrustText] = useState(EXACT_DESIGN_ABOUT.hero_trust_text);
  const [heroOverlayLabel, setHeroOverlayLabel] = useState(EXACT_DESIGN_ABOUT.hero_overlay_label);
  const [heroOverlayTitle, setHeroOverlayTitle] = useState(EXACT_DESIGN_ABOUT.hero_overlay_title);

  // 3. Statistics fields (4 items)
  const [stats, setStats] = useState(EXACT_DESIGN_ABOUT.stats);

  // 4. Story fields
  const [storyEyebrow, setStoryEyebrow] = useState(EXACT_DESIGN_ABOUT.story_eyebrow);
  const [storyHeading, setStoryHeading] = useState(EXACT_DESIGN_ABOUT.story_heading);
  const [storyButton, setStoryButton] = useState(EXACT_DESIGN_ABOUT.story_button);
  const [storyImageOverlayTitle, setStoryImageOverlayTitle] = useState(EXACT_DESIGN_ABOUT.story_image_overlay_title);

  // 5. Mission fields
  const [missionEyebrow, setMissionEyebrow] = useState(EXACT_DESIGN_ABOUT.mission_eyebrow);
  const [missionSupportingText, setMissionSupportingText] = useState(EXACT_DESIGN_ABOUT.mission_supporting_text);

  // 6. Vision fields
  const [visionEyebrow, setVisionEyebrow] = useState(EXACT_DESIGN_ABOUT.vision_eyebrow);
  const [visionSupportingText, setVisionSupportingText] = useState(EXACT_DESIGN_ABOUT.vision_supporting_text);

  // 7. Values fields
  const [valuesItems, setValuesItems] = useState<AboutValueItem[]>(EXACT_DESIGN_ABOUT.values_items);
  const [valuesLinkText, setValuesLinkText] = useState(EXACT_DESIGN_ABOUT.values_link_text);

  // 8. Why Choose fields
  const [whyChooseEyebrow, setWhyChooseEyebrow] = useState(EXACT_DESIGN_ABOUT.why_choose_eyebrow);
  const [whyChooseHeading, setWhyChooseHeading] = useState(EXACT_DESIGN_ABOUT.why_choose_heading);
  const [whyChooseDescription, setWhyChooseDescription] = useState(EXACT_DESIGN_ABOUT.why_choose_description);
  const [whyChooseBenefits, setWhyChooseBenefits] = useState<string[]>(EXACT_DESIGN_ABOUT.why_choose_benefits);
  const [whyChooseButton, setWhyChooseButton] = useState(EXACT_DESIGN_ABOUT.why_choose_button);
  const [whyChooseImageOverlay, setWhyChooseImageOverlay] = useState(EXACT_DESIGN_ABOUT.why_choose_image_overlay);

  // 9. Certifications fields
  const [certificationsEyebrow, setCertificationsEyebrow] = useState(EXACT_DESIGN_ABOUT.certifications_eyebrow);
  const [certificationsHeading, setCertificationsHeading] = useState(EXACT_DESIGN_ABOUT.certifications_heading);
  const [certificationsDescription, setCertificationsDescription] = useState(EXACT_DESIGN_ABOUT.certifications_description);
  const [certificationsItems, setCertificationsItems] = useState<AboutCertificationItem[]>(EXACT_DESIGN_ABOUT.certifications_items);

  // 10. Final CTA fields
  const [ctaEyebrow, setCtaEyebrow] = useState(EXACT_DESIGN_ABOUT.cta_eyebrow);
  const [ctaHeading, setCtaHeading] = useState(EXACT_DESIGN_ABOUT.cta_heading);
  const [ctaDescription, setCtaDescription] = useState(EXACT_DESIGN_ABOUT.cta_description);
  const [ctaPrimaryButton, setCtaPrimaryButton] = useState(EXACT_DESIGN_ABOUT.cta_primary_button);
  const [ctaSecondaryButton, setCtaSecondaryButton] = useState(EXACT_DESIGN_ABOUT.cta_secondary_button);

  // Media states
  const [bannerImage, setBannerImage] = useState<Media | null>(null);
  const [storyImage, setStoryImage] = useState<Media | null>(null);
  const [teamImage, setTeamImage] = useState<Media | null>(null);
  const [ctaImage, setCtaImage] = useState<Media | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setIsLoading(true);
    try {
      // 1. Load content from about_settings
      const { data } = await supabase
        .from('about_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setSettingsId(data.id);
        setHeading(data.heading || EXACT_DESIGN_ABOUT.heading);
        setDescription(data.description || EXACT_DESIGN_ABOUT.description);
        setStory(data.story || EXACT_DESIGN_ABOUT.story);
        setMission(data.mission || EXACT_DESIGN_ABOUT.mission);
        setVision(data.vision || EXACT_DESIGN_ABOUT.vision);
        setValues(data.values || EXACT_DESIGN_ABOUT.values);

        // Extended fields (fallback to exact design defaults)
        setHeroEyebrow(data.hero_eyebrow || EXACT_DESIGN_ABOUT.hero_eyebrow);
        setHeroFeature1Title(data.hero_feature_1_title || EXACT_DESIGN_ABOUT.hero_feature_1_title);
        setHeroFeature2Title(data.hero_feature_2_title || EXACT_DESIGN_ABOUT.hero_feature_2_title);
        setHeroFeature3Title(data.hero_feature_3_title || EXACT_DESIGN_ABOUT.hero_feature_3_title);
        setHeroPrimaryButton(data.hero_primary_button || EXACT_DESIGN_ABOUT.hero_primary_button);
        setHeroSecondaryButton(data.hero_secondary_button || EXACT_DESIGN_ABOUT.hero_secondary_button);
        setHeroTrustText(data.hero_trust_text || EXACT_DESIGN_ABOUT.hero_trust_text);
        setHeroOverlayLabel(data.hero_overlay_label || EXACT_DESIGN_ABOUT.hero_overlay_label);
        setHeroOverlayTitle(data.hero_overlay_title || EXACT_DESIGN_ABOUT.hero_overlay_title);

        setStoryEyebrow(data.story_eyebrow || EXACT_DESIGN_ABOUT.story_eyebrow);
        setStoryHeading(data.story_heading || EXACT_DESIGN_ABOUT.story_heading);
        setStoryButton(data.story_button || EXACT_DESIGN_ABOUT.story_button);
        setStoryImageOverlayTitle(data.story_image_overlay_title || EXACT_DESIGN_ABOUT.story_image_overlay_title);

        setMissionEyebrow(data.mission_eyebrow || EXACT_DESIGN_ABOUT.mission_eyebrow);
        setMissionSupportingText(data.mission_supporting_text || EXACT_DESIGN_ABOUT.mission_supporting_text);

        setVisionEyebrow(data.vision_eyebrow || EXACT_DESIGN_ABOUT.vision_eyebrow);
        setVisionSupportingText(data.vision_supporting_text || EXACT_DESIGN_ABOUT.vision_supporting_text);

        if (Array.isArray(data.values_items) && data.values_items.length > 0) {
          setValuesItems(data.values_items);
        }
        setValuesLinkText(data.values_link_text || EXACT_DESIGN_ABOUT.values_link_text);

        setWhyChooseEyebrow(data.why_choose_eyebrow || EXACT_DESIGN_ABOUT.why_choose_eyebrow);
        setWhyChooseHeading(data.why_choose_heading || EXACT_DESIGN_ABOUT.why_choose_heading);
        setWhyChooseDescription(data.why_choose_description || EXACT_DESIGN_ABOUT.why_choose_description);
        if (Array.isArray(data.why_choose_benefits) && data.why_choose_benefits.length > 0) {
          setWhyChooseBenefits(data.why_choose_benefits);
        }
        setWhyChooseButton(data.why_choose_button || EXACT_DESIGN_ABOUT.why_choose_button);
        setWhyChooseImageOverlay(data.why_choose_image_overlay || EXACT_DESIGN_ABOUT.why_choose_image_overlay);

        setCertificationsEyebrow(data.certifications_eyebrow || EXACT_DESIGN_ABOUT.certifications_eyebrow);
        setCertificationsHeading(data.certifications_heading || EXACT_DESIGN_ABOUT.certifications_heading);
        setCertificationsDescription(data.certifications_description || EXACT_DESIGN_ABOUT.certifications_description);
        if (Array.isArray(data.certifications_items) && data.certifications_items.length > 0) {
          setCertificationsItems(data.certifications_items);
        }

        setCtaEyebrow(data.cta_eyebrow || EXACT_DESIGN_ABOUT.cta_eyebrow);
        setCtaHeading(data.cta_heading || EXACT_DESIGN_ABOUT.cta_heading);
        setCtaDescription(data.cta_description || EXACT_DESIGN_ABOUT.cta_description);
        setCtaPrimaryButton(data.cta_primary_button || EXACT_DESIGN_ABOUT.cta_primary_button);
        setCtaSecondaryButton(data.cta_secondary_button || EXACT_DESIGN_ABOUT.cta_secondary_button);

        if (data.banner_image_id) {
          const { data: mediaRec } = await supabase
            .from('media')
            .select('*')
            .eq('id', data.banner_image_id)
            .maybeSingle();
          if (mediaRec) setBannerImage(mediaRec);
        }
      }

      // 2. Load 4 Company Statistics from site_statistics (section = 'about')
      const { data: statRows } = await supabase
        .from('site_statistics')
        .select('*')
        .eq('section', 'about')
        .order('display_order', { ascending: true });

      if (statRows && statRows.length >= 4) {
        setStats(
          statRows.slice(0, 4).map((s) => ({
            value: s.value,
            label: s.label,
          }))
        );
      }

      // 3. Load images from site_statistics fallback
      const { data: mediaStats } = await supabase
        .from('site_statistics')
        .select('*')
        .in('section', ['about_banner_media', 'about_page_media']);

      if (mediaStats && mediaStats.length > 0) {
        mediaStats.forEach((m) => {
          if (m.suffix) {
            const mediaItem = {
              id: m.value || m.id,
              secure_url: m.suffix,
              alt_text: m.label,
              resource_type: 'image',
            } as any;

            if ((m.label === 'about_hero_banner' || m.label === 'banner_image') && !bannerImage) {
              setBannerImage(mediaItem);
            } else if (m.label === 'story_image') {
              setStoryImage(mediaItem);
            } else if (m.label === 'team_image') {
              setTeamImage(mediaItem);
            } else if (m.label === 'cta_image') {
              setCtaImage(mediaItem);
            }
          }
        });
      }
    } catch (err) {
      console.error('Failed to load about settings:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Helper function to reset all fields to the exact design specifications
  async function applyDesignStandard() {
    setHeading(EXACT_DESIGN_ABOUT.heading);
    setDescription(EXACT_DESIGN_ABOUT.description);
    setStory(EXACT_DESIGN_ABOUT.story);
    setMission(EXACT_DESIGN_ABOUT.mission);
    setVision(EXACT_DESIGN_ABOUT.vision);
    setValues(EXACT_DESIGN_ABOUT.values);

    setHeroEyebrow(EXACT_DESIGN_ABOUT.hero_eyebrow);
    setHeroFeature1Title(EXACT_DESIGN_ABOUT.hero_feature_1_title);
    setHeroFeature2Title(EXACT_DESIGN_ABOUT.hero_feature_2_title);
    setHeroFeature3Title(EXACT_DESIGN_ABOUT.hero_feature_3_title);
    setHeroPrimaryButton(EXACT_DESIGN_ABOUT.hero_primary_button);
    setHeroSecondaryButton(EXACT_DESIGN_ABOUT.hero_secondary_button);
    setHeroTrustText(EXACT_DESIGN_ABOUT.hero_trust_text);
    setHeroOverlayLabel(EXACT_DESIGN_ABOUT.hero_overlay_label);
    setHeroOverlayTitle(EXACT_DESIGN_ABOUT.hero_overlay_title);

    setStats(EXACT_DESIGN_ABOUT.stats);

    setStoryEyebrow(EXACT_DESIGN_ABOUT.story_eyebrow);
    setStoryHeading(EXACT_DESIGN_ABOUT.story_heading);
    setStoryButton(EXACT_DESIGN_ABOUT.story_button);
    setStoryImageOverlayTitle(EXACT_DESIGN_ABOUT.story_image_overlay_title);

    setMissionEyebrow(EXACT_DESIGN_ABOUT.mission_eyebrow);
    setMissionSupportingText(EXACT_DESIGN_ABOUT.mission_supporting_text);

    setVisionEyebrow(EXACT_DESIGN_ABOUT.vision_eyebrow);
    setVisionSupportingText(EXACT_DESIGN_ABOUT.vision_supporting_text);

    setValuesItems(EXACT_DESIGN_ABOUT.values_items);
    setValuesLinkText(EXACT_DESIGN_ABOUT.values_link_text);

    setWhyChooseEyebrow(EXACT_DESIGN_ABOUT.why_choose_eyebrow);
    setWhyChooseHeading(EXACT_DESIGN_ABOUT.why_choose_heading);
    setWhyChooseDescription(EXACT_DESIGN_ABOUT.why_choose_description);
    setWhyChooseBenefits(EXACT_DESIGN_ABOUT.why_choose_benefits);
    setWhyChooseButton(EXACT_DESIGN_ABOUT.why_choose_button);
    setWhyChooseImageOverlay(EXACT_DESIGN_ABOUT.why_choose_image_overlay);

    setCertificationsEyebrow(EXACT_DESIGN_ABOUT.certifications_eyebrow);
    setCertificationsHeading(EXACT_DESIGN_ABOUT.certifications_heading);
    setCertificationsDescription(EXACT_DESIGN_ABOUT.certifications_description);
    setCertificationsItems(EXACT_DESIGN_ABOUT.certifications_items);

    setCtaEyebrow(EXACT_DESIGN_ABOUT.cta_eyebrow);
    setCtaHeading(EXACT_DESIGN_ABOUT.cta_heading);
    setCtaDescription(EXACT_DESIGN_ABOUT.cta_description);
    setCtaPrimaryButton(EXACT_DESIGN_ABOUT.cta_primary_button);
    setCtaSecondaryButton(EXACT_DESIGN_ABOUT.cta_secondary_button);

    // Immediately trigger save
    await handleSaveInternal({
      heading: EXACT_DESIGN_ABOUT.heading,
      description: EXACT_DESIGN_ABOUT.description,
      story: EXACT_DESIGN_ABOUT.story,
      mission: EXACT_DESIGN_ABOUT.mission,
      vision: EXACT_DESIGN_ABOUT.vision,
      values: EXACT_DESIGN_ABOUT.values,
      hero_eyebrow: EXACT_DESIGN_ABOUT.hero_eyebrow,
      hero_feature_1_title: EXACT_DESIGN_ABOUT.hero_feature_1_title,
      hero_feature_2_title: EXACT_DESIGN_ABOUT.hero_feature_2_title,
      hero_feature_3_title: EXACT_DESIGN_ABOUT.hero_feature_3_title,
      hero_primary_button: EXACT_DESIGN_ABOUT.hero_primary_button,
      hero_secondary_button: EXACT_DESIGN_ABOUT.hero_secondary_button,
      hero_trust_text: EXACT_DESIGN_ABOUT.hero_trust_text,
      hero_overlay_label: EXACT_DESIGN_ABOUT.hero_overlay_label,
      hero_overlay_title: EXACT_DESIGN_ABOUT.hero_overlay_title,
      story_eyebrow: EXACT_DESIGN_ABOUT.story_eyebrow,
      story_heading: EXACT_DESIGN_ABOUT.story_heading,
      story_button: EXACT_DESIGN_ABOUT.story_button,
      story_image_overlay_title: EXACT_DESIGN_ABOUT.story_image_overlay_title,
      mission_eyebrow: EXACT_DESIGN_ABOUT.mission_eyebrow,
      mission_supporting_text: EXACT_DESIGN_ABOUT.mission_supporting_text,
      vision_eyebrow: EXACT_DESIGN_ABOUT.vision_eyebrow,
      vision_supporting_text: EXACT_DESIGN_ABOUT.vision_supporting_text,
      values_items: EXACT_DESIGN_ABOUT.values_items,
      values_link_text: EXACT_DESIGN_ABOUT.values_link_text,
      why_choose_eyebrow: EXACT_DESIGN_ABOUT.why_choose_eyebrow,
      why_choose_heading: EXACT_DESIGN_ABOUT.why_choose_heading,
      why_choose_description: EXACT_DESIGN_ABOUT.why_choose_description,
      why_choose_benefits: EXACT_DESIGN_ABOUT.why_choose_benefits,
      why_choose_button: EXACT_DESIGN_ABOUT.why_choose_button,
      why_choose_image_overlay: EXACT_DESIGN_ABOUT.why_choose_image_overlay,
      certifications_eyebrow: EXACT_DESIGN_ABOUT.certifications_eyebrow,
      certifications_heading: EXACT_DESIGN_ABOUT.certifications_heading,
      certifications_description: EXACT_DESIGN_ABOUT.certifications_description,
      certifications_items: EXACT_DESIGN_ABOUT.certifications_items,
      cta_eyebrow: EXACT_DESIGN_ABOUT.cta_eyebrow,
      cta_heading: EXACT_DESIGN_ABOUT.cta_heading,
      cta_description: EXACT_DESIGN_ABOUT.cta_description,
      cta_primary_button: EXACT_DESIGN_ABOUT.cta_primary_button,
      cta_secondary_button: EXACT_DESIGN_ABOUT.cta_secondary_button,
    }, EXACT_DESIGN_ABOUT.stats);
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    await handleSaveInternal({
      heading: heading.trim() || null,
      description: description.trim() || null,
      story: story.trim() || null,
      mission: mission.trim() || null,
      vision: vision.trim() || null,
      values: values.trim() || null,

      hero_eyebrow: heroEyebrow.trim() || null,
      hero_feature_1_title: heroFeature1Title.trim() || null,
      hero_feature_2_title: heroFeature2Title.trim() || null,
      hero_feature_3_title: heroFeature3Title.trim() || null,
      hero_primary_button: heroPrimaryButton.trim() || null,
      hero_secondary_button: heroSecondaryButton.trim() || null,
      hero_trust_text: heroTrustText.trim() || null,
      hero_overlay_label: heroOverlayLabel.trim() || null,
      hero_overlay_title: heroOverlayTitle.trim() || null,

      story_eyebrow: storyEyebrow.trim() || null,
      story_heading: storyHeading.trim() || null,
      story_button: storyButton.trim() || null,
      story_image_overlay_title: storyImageOverlayTitle.trim() || null,

      mission_eyebrow: missionEyebrow.trim() || null,
      mission_supporting_text: missionSupportingText.trim() || null,

      vision_eyebrow: visionEyebrow.trim() || null,
      vision_supporting_text: visionSupportingText.trim() || null,

      values_items: valuesItems,
      values_link_text: valuesLinkText.trim() || null,

      why_choose_eyebrow: whyChooseEyebrow.trim() || null,
      why_choose_heading: whyChooseHeading.trim() || null,
      why_choose_description: whyChooseDescription.trim() || null,
      why_choose_benefits: whyChooseBenefits.filter(Boolean),
      why_choose_button: whyChooseButton.trim() || null,
      why_choose_image_overlay: whyChooseImageOverlay.trim() || null,

      certifications_eyebrow: certificationsEyebrow.trim() || null,
      certifications_heading: certificationsHeading.trim() || null,
      certifications_description: certificationsDescription.trim() || null,
      certifications_items: certificationsItems.filter((c) => c.title && c.title.trim()),

      cta_eyebrow: ctaEyebrow.trim() || null,
      cta_heading: ctaHeading.trim() || null,
      cta_description: ctaDescription.trim() || null,
      cta_primary_button: ctaPrimaryButton.trim() || null,
      cta_secondary_button: ctaSecondaryButton.trim() || null,
    }, stats);
  }

  async function handleSaveInternal(fullPayload: Record<string, any>, currentStats: typeof stats) {
    setIsSaving(true);
    setSaveStatus('idle');

    // Base payload containing standard columns in about_settings
    const basePayload = {
      heading: fullPayload.heading,
      description: fullPayload.description,
      story: fullPayload.story,
      mission: fullPayload.mission,
      vision: fullPayload.vision,
      values: fullPayload.values,
      updated_at: new Date().toISOString(),
    };

    try {
      // 1. Save to about_settings (first with full extended columns, with fallback to base columns if columns not migrated)
      let currentId = settingsId;

      // If settingsId was not loaded, check if an existing row exists to avoid creating multiple rows
      if (!currentId) {
        const { data: existingRow } = await supabase
          .from('about_settings')
          .select('id')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (existingRow?.id) {
          currentId = existingRow.id;
          setSettingsId(currentId);
        }
      }

      let saveError: any = null;

      const payloadToSave = {
        ...fullPayload,
        updated_at: new Date().toISOString(),
      };

      if (currentId) {
        let res = await supabase
          .from('about_settings')
          .update(payloadToSave)
          .eq('id', currentId);

        // Fallback if extended columns are not yet applied in Supabase
        if (res.error && (res.error.message?.includes('schema cache') || res.error.message?.includes('column'))) {
          console.warn('Extended columns notice, falling back to base columns:', res.error.message);
          res = await supabase
            .from('about_settings')
            .update(basePayload)
            .eq('id', currentId);
        }
        saveError = res.error;
      } else {
        let res = await supabase
          .from('about_settings')
          .insert([payloadToSave])
          .select('id')
          .maybeSingle();

        if (res.error && (res.error.message?.includes('schema cache') || res.error.message?.includes('column'))) {
          res = await supabase
            .from('about_settings')
            .insert([basePayload])
            .select('id')
            .maybeSingle();
        }
        saveError = res.error;
        if (res.data?.id) currentId = res.data.id;
      }

      if (currentId && currentId !== settingsId) {
        setSettingsId(currentId);
      }

      if (saveError) {
        throw new Error(saveError.message || saveError.details || 'Failed to save about text settings');
      }

      // Keep table clean: remove any accidental duplicate rows
      if (currentId) {
        try {
          await supabase.from('about_settings').delete().neq('id', currentId);
        } catch {
          // Non-critical cleanup
        }
      }

      // 2. Persist the 4 Statistics in site_statistics (section = 'about')
      for (let i = 0; i < currentStats.length; i++) {
        const statItem = currentStats[i];
        if (!statItem.label) continue;
        try {
          const { data: existingStat } = await supabase
            .from('site_statistics')
            .select('id')
            .eq('section', 'about')
            .eq('label', statItem.label)
            .maybeSingle();

          if (existingStat) {
            await supabase
              .from('site_statistics')
              .update({
                value: statItem.value,
                display_order: i + 1,
                is_published: true,
              })
              .eq('id', existingStat.id);
          } else {
            await supabase.from('site_statistics').insert([
              {
                section: 'about',
                label: statItem.label,
                value: statItem.value,
                suffix: '',
                display_order: i + 1,
                is_published: true,
              },
            ]);
          }
        } catch (sErr) {
          console.warn(`Failed to persist stat ${statItem.label}:`, sErr);
        }
      }

      // 3. Persist media in site_statistics under about_page_media
      const mediaList = [
        { label: 'banner_image', value: bannerImage?.id || 'banner', suffix: bannerImage?.secure_url || '' },
        { label: 'story_image', value: storyImage?.id || 'story', suffix: storyImage?.secure_url || '' },
        { label: 'team_image', value: teamImage?.id || 'team', suffix: teamImage?.secure_url || '' },
        { label: 'cta_image', value: ctaImage?.id || 'cta', suffix: ctaImage?.secure_url || '' },
      ];

      for (const m of mediaList) {
        try {
          const { data: existing } = await supabase
            .from('site_statistics')
            .select('id')
            .eq('section', 'about_page_media')
            .eq('label', m.label)
            .maybeSingle();

          if (existing) {
            await supabase
              .from('site_statistics')
              .update({
                value: m.value,
                suffix: m.suffix,
                is_published: true,
              })
              .eq('id', existing.id);
          } else if (m.suffix) {
            await supabase.from('site_statistics').insert([
              {
                section: 'about_page_media',
                label: m.label,
                value: m.value,
                suffix: m.suffix,
                display_order: 0,
                is_published: true,
              },
            ]);
          }
        } catch (mediaErr) {
          console.warn(`Failed to persist ${m.label} in site_statistics:`, mediaErr);
        }
      }

      // Also update about_banner_media for legacy compatibility
      if (bannerImage?.secure_url) {
        try {
          const { data: legacyBanner } = await supabase
            .from('site_statistics')
            .select('id')
            .eq('section', 'about_banner_media')
            .eq('label', 'about_hero_banner')
            .maybeSingle();

          if (legacyBanner) {
            await supabase
              .from('site_statistics')
              .update({
                value: bannerImage.id || bannerImage.secure_url,
                suffix: bannerImage.secure_url,
                is_published: true,
              })
              .eq('id', legacyBanner.id);
          } else {
            await supabase.from('site_statistics').insert([
              {
                section: 'about_banner_media',
                label: 'about_hero_banner',
                value: bannerImage.id || bannerImage.secure_url,
                suffix: bannerImage.secure_url,
                display_order: 0,
                is_published: true,
              },
            ]);
          }
        } catch (legacyErr) {
          console.warn('Failed to persist legacy about banner:', legacyErr);
        }
      }

      // Trigger cache revalidation to purge any stale ISR cache
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: '/about' }),
        });
      } catch {
        // Non-blocking for client
      }

      setSaveStatus('success');
      setStatusMessage('About Us page content & images saved and published successfully!');
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch (err: any) {
      console.error('Failed to save about settings:', err);
      setSaveStatus('error');
      const msg = err?.message || err?.details || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      setStatusMessage(msg || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-navy-900 mr-2" />
        <span className="text-sm font-semibold">Loading About Us page settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-50 text-gold-600 border border-gold-200">
              <Info className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-navy-900">About Us Page Manager</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your corporate story, mission, vision, statistics, values, and certifications for the public About Us page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={applyDesignStandard}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold transition shadow-xs disabled:opacity-50"
            title="Populates all fields with the approved design content"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Reset to Standard Content</span>
          </button>

          <Link
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-navy-900 text-xs font-bold hover:bg-slate-50 transition shadow-xs"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 disabled:opacity-50 transition shadow-md"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveStatus === 'success' && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMessage || 'Changes saved successfully!'}</span>
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{statusMessage || 'Failed to save changes. Please try again.'}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">

        {/* ========================================================= */}
        {/* SECTION 1: Page Hero Banner Content & Media               */}
        {/* ========================================================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gold-500" />
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                1. Hero Wide Banner Content &amp; Media
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-50 text-gold-700 border border-gold-200">
              Panoramic Banner
            </span>
          </div>

          {/* Hero Wide Banner Image Upload */}
          <div>
            <ImageUploadZone
              label="Hero Wide Banner Image"
              helperText="Upload a high-resolution panoramic image (recommended 1920x800 or wider) showing an engineer/construction site. Drives the wide hero banner background."
              value={bannerImage}
              onChange={setBannerImage}
              folder="about"
              previewHeight="h-44 sm:h-52"
              compress={false}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Hero Eyebrow Text
              </label>
              <input
                type="text"
                value={heroEyebrow}
                onChange={(e) => setHeroEyebrow(e.target.value)}
                placeholder="e.g. ABOUT ALVERIC"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Page Main Heading
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Building A Better Tomorrow"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Hero Introduction / Subtitle
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Alveric Technical Contracting delivers reliable, innovative, and high-quality contracting solutions..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-gold-500 leading-relaxed"
              />
            </div>
          </div>

          {/* 3 Hero Feature Badges */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-black text-navy-900 uppercase tracking-wider">
              Hero Highlights / Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Feature 1 Title
                </label>
                <input
                  type="text"
                  value={heroFeature1Title}
                  onChange={(e) => setHeroFeature1Title(e.target.value)}
                  placeholder="Quality Workmanship"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Feature 2 Title
                </label>
                <input
                  type="text"
                  value={heroFeature2Title}
                  onChange={(e) => setHeroFeature2Title(e.target.value)}
                  placeholder="On-Time Delivery"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Feature 3 Title
                </label>
                <input
                  type="text"
                  value={heroFeature3Title}
                  onChange={(e) => setHeroFeature3Title(e.target.value)}
                  placeholder="Client-Centric Approach"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Hero Buttons & Trust Proof */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Primary Button Label
              </label>
              <input
                type="text"
                value={heroPrimaryButton}
                onChange={(e) => setHeroPrimaryButton(e.target.value)}
                placeholder="Our Services"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={heroSecondaryButton}
                onChange={(e) => setHeroSecondaryButton(e.target.value)}
                placeholder="Get a Quote"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Trust Social Proof Text
              </label>
              <input
                type="text"
                value={heroTrustText}
                onChange={(e) => setHeroTrustText(e.target.value)}
                placeholder="Trusted by 100+ clients across the UAE"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Hero Floating Overlay Quote Badge */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Overlay Badge Label
              </label>
              <input
                type="text"
                value={heroOverlayLabel}
                onChange={(e) => setHeroOverlayLabel(e.target.value)}
                placeholder="ENGINEERING EXCELLENCE"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Overlay Badge Title / Text
              </label>
              <input
                type="text"
                value={heroOverlayTitle}
                onChange={(e) => setHeroOverlayTitle(e.target.value)}
                placeholder="Engineering Excellence for a Brighter Future"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: Company Statistics (4 Records)                 */}
        {/* ========================================================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gold-500" />
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                2. Company Statistics Strip
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              4 Stats Items
            </span>
          </div>

          <p className="text-xs text-slate-500">
            These four metrics appear in the dark strip directly under the hero banner on the public About page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Metric #{idx + 1}
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...stats];
                      newStats[idx].value = e.target.value;
                      setStats(newStats);
                    }}
                    placeholder="e.g. 5+"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-black text-navy-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...stats];
                      newStats[idx].label = e.target.value;
                      setStats(newStats);
                    }}
                    placeholder="e.g. Years of Excellence"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-navy-900 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: Company Story & Journey Media                  */}
        {/* ========================================================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold-500" />
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                3. Company Story &amp; Journey Media
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Our Story
            </span>
          </div>

          <div>
            <ImageUploadZone
              label="Our Story Building Architecture Image"
              helperText="Upload a modern architectural building or luxury development photo (recommended 1200x800px). Displays alongside A Journey Built on Trust and Expertise."
              value={storyImage}
              onChange={setStoryImage}
              folder="about"
              previewHeight="h-44 sm:h-52"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Story Eyebrow Text
              </label>
              <input
                type="text"
                value={storyEyebrow}
                onChange={(e) => setStoryEyebrow(e.target.value)}
                placeholder="OUR STORY"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Story Heading
              </label>
              <input
                type="text"
                value={storyHeading}
                onChange={(e) => setStoryHeading(e.target.value)}
                placeholder="A Journey Built on Trust and Expertise"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Founding Story Statement
            </label>
            <textarea
              rows={5}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Alveric Technical Contracting was founded with a clear vision..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-gold-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Story Button Text
              </label>
              <input
                type="text"
                value={storyButton}
                onChange={(e) => setStoryButton(e.target.value)}
                placeholder="Our Journey"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Story Image Floating Badge Title
              </label>
              <input
                type="text"
                value={storyImageOverlayTitle}
                onChange={(e) => setStoryImageOverlayTitle(e.target.value)}
                placeholder="Creating Smarter Spaces for Better Lives"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: Mission & Vision                               */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Target className="w-4 h-4 text-gold-500" />
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                4. Our Mission
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Mission Eyebrow
              </label>
              <input
                type="text"
                value={missionEyebrow}
                onChange={(e) => setMissionEyebrow(e.target.value)}
                placeholder="OUR PURPOSE"
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white mb-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Mission Statement
              </label>
              <textarea
                rows={4}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="To deliver safe, reliable, and innovative contracting solutions..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50 focus:bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Mission Supporting Text
              </label>
              <input
                type="text"
                value={missionSupportingText}
                onChange={(e) => setMissionSupportingText(e.target.value)}
                placeholder="Focused on Progress. Driven by People."
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Eye className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                5. Our Vision
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Vision Eyebrow
              </label>
              <input
                type="text"
                value={visionEyebrow}
                onChange={(e) => setVisionEyebrow(e.target.value)}
                placeholder="OUR HORIZON"
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white mb-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Vision Statement
              </label>
              <textarea
                rows={4}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="To be a regional leader in technical contracting..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50 focus:bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Vision Supporting Text
              </label>
              <input
                type="text"
                value={visionSupportingText}
                onChange={(e) => setVisionSupportingText(e.target.value)}
                placeholder="Setting New Standards in Contracting Excellence."
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 6: Core Corporate Values (4 Editable Values)     */}
        {/* ========================================================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-500" />
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                6. Core Corporate Values
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-50 text-gold-700 border border-gold-200">
              4 Values
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {valuesItems.map((val, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Value #{idx + 1}
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={val.title}
                    onChange={(e) => {
                      const newVals = [...valuesItems];
                      newVals[idx].title = e.target.value;
                      setValuesItems(newVals);
                    }}
                    placeholder="e.g. Integrity"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-navy-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={val.description}
                    onChange={(e) => {
                      const newVals = [...valuesItems];
                      newVals[idx].description = e.target.value;
                      setValuesItems(newVals);
                    }}
                    placeholder="We do what's right, always."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 bg-white leading-snug"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Values Section CTA Link Text
            </label>
            <input
              type="text"
              value={valuesLinkText}
              onChange={(e) => setValuesLinkText(e.target.value)}
              placeholder="Learn More About Our Values"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 7: Why Choose Alveric / On-Site Engineers        */}
        {/* ========================================================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold-500" />
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                7. Why Choose Alveric / On-Site Engineers
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Long-Term Partner
            </span>
          </div>

          <div>
            <ImageUploadZone
              label="On-Site Engineers Team Image"
              helperText="Upload a photo of your technical team or technicians on site (recommended 1200x800px). Displays next to More Than a Contractor, A Long-Term Partner."
              value={teamImage}
              onChange={setTeamImage}
              folder="about"
              previewHeight="h-44 sm:h-52"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Why Choose Eyebrow
              </label>
              <input
                type="text"
                value={whyChooseEyebrow}
                onChange={(e) => setWhyChooseEyebrow(e.target.value)}
                placeholder="WHY CHOOSE ALVERIC"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Why Choose Heading
              </label>
              <input
                type="text"
                value={whyChooseHeading}
                onChange={(e) => setWhyChooseHeading(e.target.value)}
                placeholder="More Than a Contractor A Long-Term Partner"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Why Choose Description
            </label>
            <textarea
              rows={3}
              value={whyChooseDescription}
              onChange={(e) => setWhyChooseDescription(e.target.value)}
              placeholder="We bring together technical expertise, industry experience, and a commitment to excellence..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50 focus:bg-white leading-relaxed"
            />
          </div>

          {/* 4 Benefits */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-bold text-navy-900 mb-1">
              4 Key Benefits
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {whyChooseBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gold-50 text-gold-700 text-[10px] font-bold flex items-center justify-center shrink-0 border border-gold-200">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => {
                      const newBenefits = [...whyChooseBenefits];
                      newBenefits[idx] = e.target.value;
                      setWhyChooseBenefits(newBenefits);
                    }}
                    placeholder={`Benefit #${idx + 1}`}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-navy-900 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={whyChooseButton}
                onChange={(e) => setWhyChooseButton(e.target.value)}
                placeholder="Work With Us"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Image Floating Badge Overlay
              </label>
              <input
                type="text"
                value={whyChooseImageOverlay}
                onChange={(e) => setWhyChooseImageOverlay(e.target.value)}
                placeholder="Trusted Partner in Every Build"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 8: Certifications / Global Standards              */}
        {/* ========================================================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-gold-500" />
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                8. Certifications / Global Standards
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              3 Standards
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Certifications Eyebrow
              </label>
              <input
                type="text"
                value={certificationsEyebrow}
                onChange={(e) => setCertificationsEyebrow(e.target.value)}
                placeholder="OUR CERTIFICATIONS"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Certifications Heading
              </label>
              <input
                type="text"
                value={certificationsHeading}
                onChange={(e) => setCertificationsHeading(e.target.value)}
                placeholder="Committed to Global Standards"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Certifications Description
            </label>
            <textarea
              rows={2}
              value={certificationsDescription}
              onChange={(e) => setCertificationsDescription(e.target.value)}
              placeholder="We follow internationally recognized standards to ensure quality, safety, and compliance..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50 focus:bg-white leading-relaxed"
            />
          </div>

          {/* 3 Certification Items */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Certification Items (Titles only - icons rendered automatically)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {certificationsItems.map((cert, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Certification #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) => {
                      const newCerts = [...certificationsItems];
                      newCerts[idx].title = e.target.value;
                      setCertificationsItems(newCerts);
                    }}
                    placeholder={`e.g. ISO 9001:2015`}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-navy-900 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 9: Bottom CTA Skyline Banner Media & Content      */}
        {/* ========================================================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-gold-500" />
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                9. Bottom CTA Banner Media &amp; Content
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-50 text-navy-900 border border-navy-200">
              Skyline Silhouette
            </span>
          </div>

          <div>
            <ImageUploadZone
              label="Skyline Silhouette / CTA Background Image"
              helperText="Upload a panoramic city skyline (e.g. Dubai skyline at dusk/night, min 1400x600px). Blends behind the Ready to Bring Your Project to Life banner."
              value={ctaImage}
              onChange={setCtaImage}
              folder="about"
              previewHeight="h-44 sm:h-52"
              compress={false}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                CTA Eyebrow
              </label>
              <input
                type="text"
                value={ctaEyebrow}
                onChange={(e) => setCtaEyebrow(e.target.value)}
                placeholder="LET'S BUILD TOGETHER"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                CTA Heading
              </label>
              <input
                type="text"
                value={ctaHeading}
                onChange={(e) => setCtaHeading(e.target.value)}
                placeholder="Ready to Bring Your Project to Life?"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              CTA Description
            </label>
            <textarea
              rows={2}
              value={ctaDescription}
              onChange={(e) => setCtaDescription(e.target.value)}
              placeholder="Partner with Alveric Technical Contracting and experience reliable, efficient, and high-quality contracting solutions."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50 focus:bg-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Primary Button Label
              </label>
              <input
                type="text"
                value={ctaPrimaryButton}
                onChange={(e) => setCtaPrimaryButton(e.target.value)}
                placeholder="Get a Free Quote"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={ctaSecondaryButton}
                onChange={(e) => setCtaSecondaryButton(e.target.value)}
                placeholder="Chat on WhatsApp"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Floating Bottom Bar */}
        <div className="sticky bottom-4 z-30 bg-navy-950/90 backdrop-blur-md p-4 rounded-2xl border border-navy-800 shadow-2xl flex items-center justify-between">
          <div className="text-white text-xs">
            <span className="font-bold text-gold-400">Ready to publish?</span> Updates take effect immediately on the live website.
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-black disabled:opacity-50 transition shadow-lg"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-navy-950" /> : <Save className="w-4 h-4 text-navy-950" />}
            <span>Save All About Content</span>
          </button>
        </div>
      </form>
    </div>
  );
}
