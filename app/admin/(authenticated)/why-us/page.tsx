'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { WhyUsFeature } from '@/types/database';
import { slugify } from '@/lib/utils';
import {
  Save,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function AdminWhyUsPage() {
  const [features, setFeatures] = useState<WhyUsFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingFeature, setEditingFeature] = useState<WhyUsFeature | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const supabase = createClient();

  useEffect(() => {
    loadFeatures();
  }, []);

  async function loadFeatures() {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('why_us_features')
        .select('*')
        .order('display_order', { ascending: true });
      if (data) setFeatures(data);
    } catch (err) {
      console.error('Failed to load why-us features:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function startCreate() {
    setEditingFeature(null);
    setTitle('');
    setDescription('');
    setIconName('');
    setDisplayOrder(features.length);
    setIsPublished(true);
    setIsCreating(true);
    setErrorMessage(null);
  }

  function startEdit(feat: WhyUsFeature) {
    setIsCreating(false);
    setEditingFeature(feat);
    setTitle(feat.title);
    setDescription(feat.description || '');
    setIconName(feat.icon_name || '');
    setDisplayOrder(feat.display_order);
    setIsPublished(feat.is_published);
    setErrorMessage(null);
  }

  function cancelForm() {
    setIsCreating(false);
    setEditingFeature(null);
    setErrorMessage(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    if (!title.trim()) {
      setErrorMessage('Feature title is required');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        icon_name: iconName.trim() || null,
        display_order: Number(displayOrder),
        is_published: isPublished,
      };

      if (editingFeature) {
        const { error } = await supabase
          .from('why_us_features')
          .update(payload)
          .eq('id', editingFeature.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('why_us_features').insert([payload]);
        if (error) throw error;
      }

      await loadFeatures();
      cancelForm();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save feature');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this feature card?')) return;
    try {
      const { error } = await supabase.from('why_us_features').delete().eq('id', id);
      if (error) throw error;
      setFeatures((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete feature');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Why Us — Feature Cards</h1>
          <p className="text-xs text-slate-500">
            Manage the competitive advantage feature cards displayed on the Why Choose Us page.
          </p>
        </div>

        {!isCreating && !editingFeature && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Feature Card</span>
          </button>
        )}
      </div>

      {saveStatus === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Feature card saved successfully.</span>
        </div>
      )}

      {(isCreating || editingFeature) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-navy-900 uppercase">
              {editingFeature ? 'Edit Feature Card' : 'New Feature Card'}
            </h2>
            <button type="button" onClick={cancelForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Feature Title <span className="text-gold-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 20+ Years of Engineering Excellence"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Lucide Icon Name (Optional)
              </label>
              <input
                type="text"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="e.g. shield-check, wrench, award"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-navy-900 bg-slate-50/50"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Any valid Lucide icon name in kebab-case format.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief competitive differentiator explaining this strength..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-900 pt-5">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-navy-900 focus:ring-gold-500"
              />
              <span>Published</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={cancelForm}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 disabled:opacity-50 transition shadow"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{editingFeature ? 'Update Card' : 'Create Card'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Features List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-navy-900 mr-2" />
          <span>Loading feature cards...</span>
        </div>
      ) : features.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto space-y-3">
          <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-navy-900">No Feature Cards Yet</h2>
          <p className="text-xs text-slate-500">
            Add competitive differentiators and value propositions to display on the Why Us page.
          </p>
          <button
            onClick={startCreate}
            className="px-4 py-2 bg-gold-500 text-navy-950 rounded-lg text-xs font-bold hover:bg-gold-400 transition"
          >
            Add First Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat) => (
            <div
              key={feat.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 pr-4">
                  <span className="text-sm font-bold text-navy-900">{feat.title}</span>
                  {feat.icon_name && (
                    <span className="text-[11px] font-mono text-gold-600 block">
                      [{feat.icon_name}]
                    </span>
                  )}
                  {feat.description && (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {feat.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(feat)}
                    className="p-1 text-slate-400 hover:text-navy-900 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(feat.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    feat.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {feat.is_published ? 'Published' : 'Draft'}
                </span>
                <span className="text-[11px] text-slate-400">Order: {feat.display_order}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
