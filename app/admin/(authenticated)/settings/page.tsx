'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CompanySettings, Media } from '@/types/database';
import { ImageUploadZone } from '@/components/media/ImageUploadZone';
import { AlvericLogo } from '@/components/ui/AlvericLogo';
import { useAdminToast } from '@/components/admin/AdminToastProvider';
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Upload,
  Save,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function CompanySettingsAdminPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [companyName, setCompanyName] = useState('ALVERIC TECHNICAL CONTRACTING LLC');
  const [tagline, setTagline] = useState('BUILDING SOLUTIONS. DELIVERING EXCELLENCE.');
  const [phonePrimary, setPhonePrimary] = useState('056 991 9792');
  const [phoneSecondary, setPhoneSecondary] = useState('056 991 9749');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [logoMedia, setLogoMedia] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();
  const { showToast } = useAdminToast();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*, logo_media:media!company_settings_logo_media_id_fkey(*)')
        .limit(1)
        .maybeSingle();

      if (data) {
        setSettings(data);
        setCompanyName(data.company_name || 'ALVERIC TECHNICAL CONTRACTING LLC');
        setTagline(data.tagline || 'BUILDING SOLUTIONS. DELIVERING EXCELLENCE.');
        setPhonePrimary(data.phone_primary || '056 991 9792');
        setPhoneSecondary(data.phone_secondary || '056 991 9749');
        setWhatsapp(data.whatsapp_number || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
        setBusinessHours(data.business_hours || '');
        setGoogleMapsUrl(data.google_maps_url || '');
        setFacebookUrl(data.facebook_url || '');
        setInstagramUrl(data.instagram_url || '');
        setLinkedinUrl(data.linkedin_url || '');
        setYoutubeUrl(data.youtube_url || '');
        if (data.logo_media) setLogoMedia(data.logo_media);
      }
    } catch (err: any) {
      console.error('Failed to load settings:', err);
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
      const payload = {
        company_name: companyName.trim(),
        tagline: tagline.trim() || null,
        phone_primary: phonePrimary.trim() || null,
        phone_secondary: phoneSecondary.trim() || null,
        whatsapp_number: whatsapp.trim() || null,
        email: email.trim().toLowerCase() || null,
        address: address.trim() || null,
        business_hours: businessHours.trim() || null,
        google_maps_url: googleMapsUrl.trim() || null,
        facebook_url: facebookUrl.trim() || null,
        instagram_url: instagramUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        youtube_url: youtubeUrl.trim() || null,
        logo_media_id: logoMedia?.id || null,
      };

      if (settings?.id) {
        const { error } = await supabase
          .from('company_settings')
          .update(payload)
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('company_settings')
          .insert([payload])
          .select('*')
          .single();
        if (error) throw error;
        setSettings(data);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      showToast('Company settings saved successfully!');
    } catch (err: any) {
      const msg = err?.message || 'Failed to save company settings';
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
        <span>Loading company settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Company Settings</h1>
          <p className="text-xs text-slate-500">
            Control the corporate identity, official contact phone numbers, and social channels displayed on the website.
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
        {/* Brand & Logo Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Corporate Identity & Logo
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center min-w-[200px] h-36">
              <AlvericLogo
                logoUrl={logoMedia?.secure_url}
                variant="dark"
                showTagline={false}
              />
            </div>

            <div className="flex-1">
              <ImageUploadZone
                label="Custom Official Logo"
                helperText="Upload transparent PNG or SVG logo. Leave empty to use official vector mark."
                value={logoMedia}
                onChange={(media) => setLogoMedia(media)}
                folder="alveric/branding"
                previewHeight="h-36"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-navy-900 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Official Contact & Phone Numbers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Official Contact Numbers & Communication
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Primary Phone Number (From Reference)
              </label>
              <input
                type="text"
                value={phonePrimary}
                onChange={(e) => setPhonePrimary(e.target.value)}
                placeholder="056 991 9792"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Secondary Phone Number (From Reference)
              </label>
              <input
                type="text"
                value={phoneSecondary}
                onChange={(e) => setPhoneSecondary(e.target.value)}
                placeholder="056 991 9749"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                WhatsApp Business Number
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. +971 56 991 9792"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@alveric.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Physical Office Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Office 402, Alveric Tower, Business Bay, Dubai"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Business Operating Hours
              </label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="e.g. Mon - Sat: 8:00 AM - 6:00 PM"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Social Media & Map */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Social Media Channels & Map Link
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/company/alveric"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/alveric"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/alveric"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Google Maps Embed / URL
              </label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
