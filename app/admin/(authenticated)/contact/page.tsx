'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CompanySettings } from '@/types/database';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Share2,
  MessageCircle,
} from 'lucide-react';

export default function ContactSettingsAdminPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [phonePrimary, setPhonePrimary] = useState('');
  const [phoneSecondary, setPhoneSecondary] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (data) {
        setSettings(data);
        setPhonePrimary(data.phone_primary || '');
        setPhoneSecondary(data.phone_secondary || '');
        setWhatsapp(data.whatsapp_number || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
        setBusinessHours(data.business_hours || '');
        setGoogleMapsUrl(data.google_maps_url || '');
        setFacebookUrl(data.facebook_url || '');
        setInstagramUrl(data.instagram_url || '');
        setLinkedinUrl(data.linkedin_url || '');
        setYoutubeUrl(data.youtube_url || '');
      }
    } catch (err: any) {
      console.error('Failed to load contact settings:', err);
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
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save contact and social settings');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-navy-900 mr-2" />
        <span>Loading contact info and social links...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900">
            Contact Info, Address &amp; Social Links
          </h1>
          <p className="text-xs text-slate-500">
            Configure the official phone numbers, office location address, and social media channels displayed across the website.
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

      {saveSuccess && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Contact details, address, and social links updated successfully! Changes are live across the site.</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Official Contact Numbers & Communication */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-900">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                Official Contact Numbers
              </h2>
              <p className="text-[11px] text-slate-400">
                These numbers appear on the Header, Footer, and Contact Us page.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Primary Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phonePrimary}
                  onChange={(e) => setPhonePrimary(e.target.value)}
                  placeholder="e.g. 056 991 9792"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-navy-900 bg-slate-50/50 focus:bg-white focus:border-navy-900 transition"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Main telephone shown in the top header and quote section.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Secondary Phone Number
              </label>
              <input
                type="text"
                value={phoneSecondary}
                onChange={(e) => setPhoneSecondary(e.target.value)}
                placeholder="e.g. 056 991 9749"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-navy-900 bg-slate-50/50 focus:bg-white focus:border-navy-900 transition"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Alternate line shown on the footer and contact directory.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                WhatsApp Business Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +971 56 991 9792"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:border-navy-900 transition"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Used for instant quote requests and floating WhatsApp actions.
              </span>
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:border-navy-900 transition"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Primary corporate inquiry inbox.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Business Operating Hours
              </label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="e.g. Mon - Sat: 8:00 AM - 6:00 PM (Sunday Closed)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:border-navy-900 transition"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Physical Address & Map */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-900">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                Physical Office Address &amp; Location
              </h2>
              <p className="text-[11px] text-slate-400">
                Official office headquarters and map directions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Physical Office Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Office 402, Alveric Tower, Business Bay, Dubai, United Arab Emirates"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:border-navy-900 transition resize-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Displayed on the website footer and contact card.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Google Maps Embed or Link URL
              </label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:border-navy-900 transition"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Direct link or embed URL for visitors to navigate to your physical office.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Social Media Channels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-900">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                Social Media Links
              </h2>
              <p className="text-[11px] text-slate-400">
                Official social profile channels linked in the footer and contact sections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/company/alveric"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:border-navy-900 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/alveric"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:border-navy-900 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/alveric"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:border-navy-900 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/@alveric"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:border-navy-900 transition"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 text-white text-xs sm:text-sm font-bold hover:bg-navy-800 disabled:opacity-50 transition shadow"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Contact &amp; Social Details</span>
          </button>
        </div>
      </form>
    </div>
  );
}
