'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
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
} from 'lucide-react';

const DEFAULT_ABOUT = {
  heading: 'Pioneering Technical Excellence in Modern Contracting',
  description:
    'Alveric Technical Contracting LLC brings years of proven expertise, innovative technical craftsmanship, and uncompromising safety standards to modern infrastructure development and building maintenance.',
  story:
    'Founded with a clear vision to bridge the gap between engineering precision and contracting efficiency, Alveric Technical Contracting LLC has grown into a comprehensive multi-disciplinary contracting firm.',
  mission:
    'To deliver premier contracting and technical engineering solutions that enhance structural durability, operational efficiency, and client satisfaction through disciplined craftsmanship and ethical practices.',
  vision:
    'To be recognized as the foremost trusted technical contracting partner in the region, acclaimed for sustainable building solutions, technical innovation, and unwavering reliability.',
  values:
    'Integrity, Safety First, Engineering Precision, Client-Centric Collaboration, and Uncompromising Quality in every project detail.',
};

export default function AdminAboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // About page content fields matching about_settings table
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [values, setValues] = useState('');

  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('about_settings')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (data) {
        setSettingsId(data.id);
        setHeading(data.heading || DEFAULT_ABOUT.heading);
        setDescription(data.description || DEFAULT_ABOUT.description);
        setStory(data.story || DEFAULT_ABOUT.story);
        setMission(data.mission || DEFAULT_ABOUT.mission);
        setVision(data.vision || DEFAULT_ABOUT.vision);
        setValues(data.values || DEFAULT_ABOUT.values);
      } else {
        setHeading(DEFAULT_ABOUT.heading);
        setDescription(DEFAULT_ABOUT.description);
        setStory(DEFAULT_ABOUT.story);
        setMission(DEFAULT_ABOUT.mission);
        setVision(DEFAULT_ABOUT.vision);
        setValues(DEFAULT_ABOUT.values);
      }
    } catch (err) {
      console.error('Failed to load about settings:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    const payload = {
      heading: heading.trim() || null,
      description: description.trim() || null,
      story: story.trim() || null,
      mission: mission.trim() || null,
      vision: vision.trim() || null,
      values: values.trim() || null,
    };

    try {
      if (settingsId) {
        const { error } = await supabase
          .from('about_settings')
          .update(payload)
          .eq('id', settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('about_settings')
          .insert([payload])
          .select('id')
          .single();
        if (error) throw error;
        setSettingsId(data?.id || null);
      }
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3500);
    } catch (err) {
      console.error('Failed to save about settings:', err);
      setSaveStatus('error');
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
            Manage your corporate story, mission, vision, and core values for the public About Us page.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
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
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveStatus === 'success' && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>About Us page content saved and published successfully!</span>
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="flex items-center gap-2.5 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>Failed to save changes. Please check your network and try again.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: Page Hero Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
              1. Hero Banner Content
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Page Main Heading
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="e.g. Pioneering Technical Excellence in Modern Contracting"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Hero Introduction / Subtitle
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A compelling introduction to Alveric's expertise, safety standards, and engineering values..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 2: Company Journey & Story */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Compass className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
              2. Company Story & Journey
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Founding Story & Engineering Track Record
            </label>
            <textarea
              rows={6}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Share the origins of Alveric, how the company was established, engineering disciplines covered, and ongoing growth..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 3: Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Target className="w-4 h-4 text-gold-500" />
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                3. Mission Statement
              </h2>
            </div>

            <textarea
              rows={5}
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              placeholder="Our mission is to deliver premier contracting and technical engineering solutions..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 leading-relaxed"
            />
          </div>

          {/* Vision */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Compass className="w-4 h-4 text-gold-500" />
              <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
                4. Vision Statement
              </h2>
            </div>

            <textarea
              rows={5}
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="To be recognized as the foremost trusted technical contracting partner in the region..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 4: Core Values */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Award className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
              5. Core Corporate Values
            </h2>
          </div>

          <div>
            <textarea
              rows={3}
              value={values}
              onChange={(e) => setValues(e.target.value)}
              placeholder="Integrity, Safety First, Engineering Precision, Client-Centric Collaboration, and Uncompromising Quality"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              List the foundational tenets of the organization, separated by commas or pipes.
            </p>
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
            <span>Save About Content</span>
          </button>
        </div>
      </form>
    </div>
  );
}
