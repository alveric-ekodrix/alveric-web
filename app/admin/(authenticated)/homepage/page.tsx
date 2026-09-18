'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HomepageSettings, Media } from '@/types/database';
import { ImageUploadZone } from '@/components/media/ImageUploadZone';
import { useAdminToast } from '@/components/admin/AdminToastProvider';
import { Save, AlertCircle, Loader2 } from 'lucide-react';

export default function HomepageAdminPage() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [heroEyebrow, setHeroEyebrow] = useState('BUILDING SOLUTIONS.');
  const [heroHeading, setHeroHeading] = useState('DELIVERING\nEXCELLENCE.');
  const [heroDescription, setHeroDescription] = useState(
    'Alveric Technical Contracting LLC delivers expert engineering and contracting solutions with a commitment to quality, safety, and excellence.'
  );
  const [primaryCtaText, setPrimaryCtaText] = useState('Our Services');
  const [primaryCtaUrl, setPrimaryCtaUrl] = useState('/services');
  const [secondaryCtaText, setSecondaryCtaText] = useState('Get a Quote');
  const [secondaryCtaUrl, setSecondaryCtaUrl] = useState('/quote');
  const [heroImage, setHeroImage] = useState<Media | null>(null);

  // CTA Section Fields
  const [ctaHeading, setCtaHeading] = useState("Let's Build Your Next Project Together");
  const [ctaDescription, setCtaDescription] = useState(
    'Talk to our experts today and get a solution tailored to your needs.'
  );
  const [ctaButtonText, setCtaButtonText] = useState('Get a Free Quote');
  const [ctaButtonUrl, setCtaButtonUrl] = useState('/quote');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();
  const { showToast } = useAdminToast();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const { data: homeData } = await supabase
        .from('homepage_settings')
        .select('*, hero_image:media!homepage_settings_hero_image_id_fkey(*)')
        .limit(1)
        .maybeSingle();

      if (homeData) {
        setSettings(homeData);
        if (homeData.hero_eyebrow) setHeroEyebrow(homeData.hero_eyebrow);
        if (homeData.hero_heading) setHeroHeading(homeData.hero_heading);
        if (homeData.hero_description) setHeroDescription(homeData.hero_description);
        if (homeData.primary_cta_text) setPrimaryCtaText(homeData.primary_cta_text);
        if (homeData.primary_cta_url) setPrimaryCtaUrl(homeData.primary_cta_url);
        if (homeData.secondary_cta_text) setSecondaryCtaText(homeData.secondary_cta_text);
        if (homeData.secondary_cta_url) setSecondaryCtaUrl(homeData.secondary_cta_url);
        if (homeData.cta_heading) setCtaHeading(homeData.cta_heading);
        if (homeData.cta_description) setCtaDescription(homeData.cta_description);
        if (homeData.cta_button_text) setCtaButtonText(homeData.cta_button_text);
        if (homeData.cta_button_url) setCtaButtonUrl(homeData.cta_button_url);
        if (homeData.hero_image) setHeroImage(homeData.hero_image);
      }
    } catch (err) {
      console.error('Failed to load homepage CMS data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const payload: any = {
        hero_eyebrow: heroEyebrow.trim(),
        hero_heading: heroHeading.trim(),
        hero_description: heroDescription.trim(),
        hero_image_id: heroImage?.id || null,
        primary_cta_text: primaryCtaText.trim(),
        primary_cta_url: primaryCtaUrl.trim(),
        secondary_cta_text: secondaryCtaText.trim(),
        secondary_cta_url: secondaryCtaUrl.trim(),
        cta_heading: ctaHeading.trim(),
        cta_description: ctaDescription.trim(),
        cta_button_text: ctaButtonText.trim(),
        cta_button_url: ctaButtonUrl.trim(),
      };

      if (settings?.id) {
        const { error } = await supabase
          .from('homepage_settings')
          .update(payload)
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('homepage_settings')
          .insert([payload])
          .select('*')
          .single();
        if (error) throw error;
        setSettings(data);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      showToast('Homepage content updated successfully!');

      // Instantly refresh public static edge cache
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: ['/'] }),
        });
      } catch (e) {
        console.warn('Revalidation trigger error:', e);
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to save homepage settings';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-navy-900 mr-2" />
        <span>Loading homepage CMS...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Homepage Content Manager</h1>
          <p className="text-xs text-slate-500">
            Edit the Hero section and Bottom CTA banner in real-time without altering code.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 disabled:opacity-50 transition shadow"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>


      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* HERO SECTION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            1. Hero Section
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={heroEyebrow}
                onChange={(e) => setHeroEyebrow(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Main Heading (Use newline for line breaks)
              </label>
              <textarea
                rows={2}
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Hero Supporting Description
            </label>
            <textarea
              rows={3}
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          {/* Hero Image */}
          <div>
            <ImageUploadZone
              label="Hero Background / Showcase Image"
              helperText="High-resolution hero imagery displayed above the fold. Drag & drop or click to upload."
              value={heroImage}
              onChange={(media) => setHeroImage(media)}
              folder="alveric/homepage"
              previewHeight="h-48"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Primary CTA</span>
              <input
                type="text"
                value={primaryCtaText}
                onChange={(e) => setPrimaryCtaText(e.target.value)}
                placeholder="Button Label"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-navy-900"
              />
              <input
                type="text"
                value={primaryCtaUrl}
                onChange={(e) => setPrimaryCtaUrl(e.target.value)}
                placeholder="Button URL (/services)"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-navy-900"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Secondary CTA</span>
              <input
                type="text"
                value={secondaryCtaText}
                onChange={(e) => setSecondaryCtaText(e.target.value)}
                placeholder="Button Label"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-navy-900"
              />
              <input
                type="text"
                value={secondaryCtaUrl}
                onChange={(e) => setSecondaryCtaUrl(e.target.value)}
                placeholder="Button URL (/quote)"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-navy-900"
              />
            </div>
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            2. Bottom CTA Banner
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                CTA Heading
              </label>
              <input
                type="text"
                value={ctaHeading}
                onChange={(e) => setCtaHeading(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={ctaButtonText}
                onChange={(e) => setCtaButtonText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              CTA Supporting Copy
            </label>
            <textarea
              rows={2}
              value={ctaDescription}
              onChange={(e) => setCtaDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
