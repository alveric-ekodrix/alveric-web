'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HomepageSettings, Media } from '@/types/database';
import { ImageUploadZone } from '@/components/media/ImageUploadZone';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Info,
  Layers,
  Calendar,
} from 'lucide-react';

export default function HomeAboutAdminPage() {
  const supabase = createClient();

  // Dynamic experience calculation:
  // Base: 5+ years in 2026, increments automatically every next year
  const currentYear = new Date().getFullYear();
  const calculatedYears = Math.max(5, 5 + (currentYear - 2026));
  const dynamicExperienceText = `${calculatedYears}+\nYears of\nExperience`;

  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [heading, setHeading] = useState('Built on Integrity.\nDriven by Excellence.');
  const [description, setDescription] = useState(
    'Alveric Technical Contracting LLC is a trusted name in the contracting industry, delivering end-to-end technical solutions across a wide range of disciplines.'
  );
  const [experienceBadge, setExperienceBadge] = useState(dynamicExperienceText);
  const [ctaText, setCtaText] = useState('Learn More About Us');
  const [ctaUrl, setCtaUrl] = useState('/about');

  // The 3 Collage Cards Media
  const [aboutImage1, setAboutImage1] = useState<Media | null>(null);
  const [aboutImage2, setAboutImage2] = useState<Media | null>(null);
  const [aboutImage3, setAboutImage3] = useState<Media | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const { data: homeData } = await supabase
        .from('homepage_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (homeData) {
        setSettings(homeData);
        if (homeData.about_heading) setHeading(homeData.about_heading);
        if (homeData.about_description) setDescription(homeData.about_description);
        if (homeData.about_cta_text) setCtaText(homeData.about_cta_text);
        if (homeData.about_cta_url) setCtaUrl(homeData.about_cta_url);

        if (homeData.about_experience_text) {
          // If legacy 20+, switch to dynamic 5+
          if (homeData.about_experience_text.includes('20+')) {
            setExperienceBadge(dynamicExperienceText);
          } else {
            setExperienceBadge(homeData.about_experience_text);
          }
        }

        // 1. Try loading media from homepage_settings columns
        const directIds = [
          homeData.about_image_1_id,
          homeData.about_image_2_id,
          homeData.about_image_3_id,
        ].filter(Boolean);

        if (directIds.length > 0) {
          const { data: mediaItems } = await supabase
            .from('media')
            .select('*')
            .in('id', directIds);

          if (mediaItems) {
            const map = new Map(mediaItems.map((m) => [m.id, m]));
            if (homeData.about_image_1_id) setAboutImage1(map.get(homeData.about_image_1_id) || null);
            if (homeData.about_image_2_id) setAboutImage2(map.get(homeData.about_image_2_id) || null);
            if (homeData.about_image_3_id) setAboutImage3(map.get(homeData.about_image_3_id) || null);
          }
        }
      }

      // 2. Also check site_statistics fallback for stored media
      const { data: backupMedia } = await supabase
        .from('site_statistics')
        .select('*')
        .eq('section', 'home_about_media');

      if (backupMedia && backupMedia.length > 0) {
        // Direct URLs from suffix
        backupMedia.forEach((b) => {
          if (b.suffix && b.suffix.startsWith('http')) {
            const directMed = {
              id: b.value || b.id,
              secure_url: b.suffix,
              alt_text: b.label === 'about_image_1' ? 'Electrical & MEP' : b.label === 'about_image_2' ? 'Facility Engineering' : 'Field Experts',
              public_id: '',
              resource_type: 'image',
            } as any;
            if (b.label === 'about_image_1' && !aboutImage1) setAboutImage1(directMed);
            if (b.label === 'about_image_2' && !aboutImage2) setAboutImage2(directMed);
            if (b.label === 'about_image_3' && !aboutImage3) setAboutImage3(directMed);
          }
        });

        const mediaIds = backupMedia.map((b) => b.value).filter(Boolean);
        if (mediaIds.length > 0) {
          const { data: mediaRecords } = await supabase
            .from('media')
            .select('*')
            .in('id', mediaIds);

          if (mediaRecords) {
            const mMap = new Map(mediaRecords.map((m) => [m.id, m]));
            backupMedia.forEach((b) => {
              const med = mMap.get(b.value);
              if (med) {
                if (b.label === 'about_image_1') setAboutImage1(med);
                if (b.label === 'about_image_2') setAboutImage2(med);
                if (b.label === 'about_image_3') setAboutImage3(med);
              }
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load Home About data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const payload: any = {
        about_heading: heading.trim(),
        about_description: description.trim(),
        about_experience_text: experienceBadge.trim(),
        about_cta_text: ctaText.trim(),
        about_cta_url: ctaUrl.trim(),
      };

      // Try updating homepage_settings with image columns
      let updateSuccessful = false;
      if (settings?.id) {
        const fullPayload = {
          ...payload,
          about_image_1_id: aboutImage1?.id || null,
          about_image_2_id: aboutImage2?.id || null,
          about_image_3_id: aboutImage3?.id || null,
        };

        const { error: fullError } = await supabase
          .from('homepage_settings')
          .update(fullPayload)
          .eq('id', settings.id);

        if (!fullError) {
          updateSuccessful = true;
        } else {
          // If columns don't exist yet, save base fields first
          const { error: baseError } = await supabase
            .from('homepage_settings')
            .update(payload)
            .eq('id', settings.id);
          if (baseError) throw baseError;
        }
      } else {
        const { data: created, error: createError } = await supabase
          .from('homepage_settings')
          .insert([payload])
          .select('*')
          .single();
        if (createError) throw createError;
        if (created) setSettings(created);
      }

      // Always backup image references into site_statistics so it NEVER gets lost
      const imageBackups = [
        { label: 'about_image_1', value: aboutImage1?.id || '', url: aboutImage1?.secure_url || '' },
        { label: 'about_image_2', value: aboutImage2?.id || '', url: aboutImage2?.secure_url || '' },
        { label: 'about_image_3', value: aboutImage3?.id || '', url: aboutImage3?.secure_url || '' },
      ];

      for (const img of imageBackups) {
        const { data: existing } = await supabase
          .from('site_statistics')
          .select('id')
          .eq('section', 'home_about_media')
          .eq('label', img.label)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('site_statistics')
            .update({
              value: img.value,
              suffix: img.url,
              is_published: true,
            })
            .eq('id', existing.id);
        } else if (img.value || img.url) {
          await supabase.from('site_statistics').insert({
            label: img.label,
            value: img.value,
            suffix: img.url,
            section: 'home_about_media',
            display_order: 0,
            is_published: true,
          });
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Save failed:', err);
      setErrorMessage(err?.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-navy-900 mr-2" />
        <span className="text-sm font-semibold">Loading Home About settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-50 text-gold-600 border border-gold-200">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-navy-900">Home About Section</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage the About Alveric section on the homepage: heading, dynamic experience badge, and 3 showcase cards.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 disabled:opacity-50 transition shadow-md shrink-0"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Success Alert */}
      {saveSuccess && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Home About section saved and updated successfully!</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: Text & Floating Experience Badge */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Info className="w-4 h-4 text-gold-500" />
          <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
            1. Heading, Description & Experience Badge
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Section Heading <span className="text-slate-400 font-normal">(use new line for line break)</span>
              </label>
              <textarea
                rows={2}
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="BUILT ON INTEGRITY.&#10;DRIVEN BY EXCELLENCE."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Section Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Alveric Technical Contracting LLC delivers expert engineering..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Experience Badge Settings */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gold-500" />
                  Experience Badge (Dynamic Auto-Year)
                </span>
                <button
                  type="button"
                  onClick={() => setExperienceBadge(dynamicExperienceText)}
                  className="text-[11px] font-bold text-gold-600 hover:text-gold-700 underline"
                >
                  Reset to Auto ({calculatedYears}+ Years)
                </button>
              </div>

              <textarea
                rows={2}
                value={experienceBadge}
                onChange={(e) => setExperienceBadge(e.target.value)}
                placeholder={dynamicExperienceText}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-white font-medium focus:ring-2 focus:ring-gold-500/20"
              />

              <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p>
                  <strong>Auto-Increment Logic Active:</strong> Currently set to base 5+ years in 2026.
                </p>
                <p>
                  On January 1, 2027, it automatically increments to <strong>6+ Years</strong>, in 2028 to <strong>7+ Years</strong>, etc.
                </p>
              </div>
            </div>

            {/* Live Badge Preview */}
            <div className="flex items-center justify-center py-2 bg-navy-950 rounded-xl p-4">
              <div className="w-24 h-24 rounded-full bg-gold-500 text-white shadow-xl flex flex-col items-center justify-center text-center p-2 border-4 border-navy-950 font-black">
                {experienceBadge.split('\n').map((line, idx) => (
                  <span
                    key={idx}
                    className={
                      idx === 0
                        ? 'text-lg leading-tight font-black'
                        : 'text-[9px] uppercase font-bold tracking-wider leading-tight'
                    }
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">Button Text</label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Learn More About Us"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">Button Link</label>
            <input
              type="text"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="/about"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: The 3 Showcase Collage Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
              2. Three Showcase Cards (Collage Imagery)
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Drag & drop or click to upload
          </span>
        </div>

        <p className="text-xs text-slate-500">
          These images appear on the collage grid on the left side of the About Alveric section on the homepage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="space-y-2">
            <div className="p-3 bg-navy-950 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-gold-400 block">CARD 1 (Top Left)</span>
                <span className="text-[11px] text-slate-300">Electrical & MEP</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">Stacked</span>
            </div>

            <ImageUploadZone
              label="Card 1 Photo"
              helperText="High-res photo of electrical or MEP engineering"
              value={aboutImage1}
              onChange={(m) => setAboutImage1(m)}
              folder="alveric/about"
              previewHeight="h-44"
            />
          </div>

          {/* Card 2 */}
          <div className="space-y-2">
            <div className="p-3 bg-navy-950 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-gold-400 block">CARD 2 (Bottom Left)</span>
                <span className="text-[11px] text-slate-300">Facility Engineering</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">Stacked</span>
            </div>

            <ImageUploadZone
              label="Card 2 Photo"
              helperText="High-res photo of facility contracting"
              value={aboutImage2}
              onChange={(m) => setAboutImage2(m)}
              folder="alveric/about"
              previewHeight="h-44"
            />
          </div>

          {/* Card 3 */}
          <div className="space-y-2">
            <div className="p-3 bg-navy-950 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-gold-400 block">CARD 3 (Right Column)</span>
                <span className="text-[11px] text-slate-300">Field Experts</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 font-bold">Tall Banner</span>
            </div>

            <ImageUploadZone
              label="Card 3 Photo"
              helperText="Vertical/portrait photo of certified technicians"
              value={aboutImage3}
              onChange={(m) => setAboutImage3(m)}
              folder="alveric/about"
              previewHeight="h-44"
            />
          </div>
        </div>

      </div>

      {/* Floating Save Bar at bottom */}
      <div className="sticky bottom-4 z-30 bg-navy-950/90 backdrop-blur-md p-4 rounded-2xl border border-navy-800 shadow-2xl flex items-center justify-between">
        <div className="text-white text-xs">
          <span className="font-bold text-gold-400">Ready to update?</span> Click save to publish changes immediately.
        </div>

        <button
          onClick={() => handleSave()}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-black disabled:opacity-50 transition shadow-lg"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-navy-950" /> : <Save className="w-4 h-4 text-navy-950" />}
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
