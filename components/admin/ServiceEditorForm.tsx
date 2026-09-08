'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Service, Media } from '@/types/database';
import { serviceFormSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { ImageUploadZone } from '@/components/media/ImageUploadZone';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import {
  STANDARD_SERVICE_BENEFITS,
  STANDARD_SERVICE_PROCESS_STEPS,
} from './ApplyStandardContentButton';
import {
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

interface ServiceEditorFormProps {
  initialData?: Service | null;
  isEditing?: boolean;
}

export function ServiceEditorForm({ initialData, isEditing = false }: ServiceEditorFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [displayOrder, setDisplayOrder] = useState(initialData?.display_order || 0);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [isPublished, setIsPublished] = useState(initialData?.is_published || false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description || '');

  // Relations
  const [iconMedia, setIconMedia] = useState<Media | null>(initialData?.icon_media || null);
  const [featuredImage, setFeaturedImage] = useState<Media | null>(initialData?.featured_image || null);

  // Dynamic lists
  const [benefits, setBenefits] = useState<string[]>(
    Array.isArray(initialData?.benefits) ? (initialData.benefits as string[]) : []
  );
  const [newBenefit, setNewBenefit] = useState('');

  const [processSteps, setProcessSteps] = useState<{ title: string; description: string }[]>(
    Array.isArray(initialData?.process_steps)
      ? (initialData.process_steps as { title: string; description: string }[])
      : []
  );
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDesc, setNewStepDesc] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleNameChange(val: string) {
    setName(val);
    if (!isEditing || !slug) {
      setSlug(slugify(val));
    }
  }

  function handleAddBenefit() {
    if (!newBenefit.trim()) return;
    setBenefits([...benefits, newBenefit.trim()]);
    setNewBenefit('');
  }

  function handleRemoveBenefit(index: number) {
    setBenefits(benefits.filter((_, i) => i !== index));
  }

  function handleAddProcessStep() {
    if (!newStepTitle.trim() || !newStepDesc.trim()) return;
    setProcessSteps([...processSteps, { title: newStepTitle.trim(), description: newStepDesc.trim() }]);
    setNewStepTitle('');
    setNewStepDesc('');
  }

  function handleRemoveStep(index: number) {
    setProcessSteps(processSteps.filter((_, i) => i !== index));
  }

  function handleLoadStandardBenefits() {
    setBenefits([...STANDARD_SERVICE_BENEFITS]);
  }

  function handleLoadStandardProcessSteps() {
    setProcessSteps([...STANDARD_SERVICE_PROCESS_STEPS]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      short_description: shortDescription.trim() || null,
      description: description.trim() || null,
      icon_media_id: iconMedia?.id || null,
      featured_image_id: featuredImage?.id || null,
      benefits,
      process_steps: processSteps,
      display_order: Number(displayOrder),
      is_featured: isFeatured,
      is_published: isPublished,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
    };

    const parseResult = serviceFormSchema.safeParse(payload);
    if (!parseResult.success) {
      setErrorMessage(parseResult.error.errors[0]?.message || 'Please verify form fields');
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing && initialData?.id) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
      }

      setIsSuccess(true);
      router.push('/admin/services');
      router.refresh();
    } catch (err: any) {
      if (err?.code === '23505') {
        setErrorMessage('A service with this URL slug already exists. Please choose a unique slug.');
      } else {
        setErrorMessage(err?.message || 'Failed to save service');
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {isSuccess && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Service saved successfully! Redirecting to services list...</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Service General Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Service Name <span className="text-gold-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Electrical Fitting Contracting"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-navy-900 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              URL Slug <span className="text-gold-500">*</span>
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="e.g. electrical-fitting-contracting"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-slate-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Short Summary (Card Preview)
          </label>
          <textarea
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Safe & reliable technical electrical systems engineered for modern infrastructure."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Full Service Description (Detail Page)
          </label>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive description of engineering capabilities, certifications, and scope..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900"
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-900">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-navy-900 focus:ring-gold-500"
              />
              <span>Published (Publicly Visible)</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-900">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500"
              />
              <span>Featured Service</span>
            </label>
          </div>
        </div>
      </div>

      {/* Visual Assets (Icon + Featured Image) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Service Media & Icons
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Icon */}
          <div className="space-y-3">
            <ImageUploadZone
              label="Custom Service Icon"
              helperText="Upload transparent PNG or SVG icon. Leave empty to use auto-generated vector icon."
              value={iconMedia}
              onChange={(media) => setIconMedia(media)}
              folder="alveric/services/icons"
              previewHeight="h-40"
            />
            {!iconMedia && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <ServiceIcon
                    slug={slug}
                    name={name}
                    className="w-6 h-6"
                  />
                </div>
                <span>Auto-generated dual-tone icon active (will be shown on public site)</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          <ImageUploadZone
            label="Service Hero / Showcase Image"
            helperText="High-resolution photo for the service detail page banner and showcase. Drag & drop or click to upload."
            value={featuredImage}
            onChange={(media) => setFeaturedImage(media)}
            folder="alveric/services"
            previewHeight="h-40"
          />
        </div>
      </div>

      {/* Dynamic Key Benefits */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
              Key Advantages &amp; Benefits
            </h2>
            <p className="text-[11px] text-slate-400">
              Displayed as bullet benefits on the service detail page.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLoadStandardBenefits}
            className="self-start sm:self-auto text-[11px] font-bold text-gold-700 bg-gold-50 hover:bg-gold-100 px-3 py-1.5 rounded-lg border border-gold-300/80 transition shadow-2xs"
          >
            + Insert Standard Technical Benefits
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            placeholder="Add a key benefit (e.g. 24/7 Emergency Support, Energy Efficiency)..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddBenefit();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddBenefit}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs transition"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
            >
              <span>• {benefit}</span>
              <button
                type="button"
                onClick={() => handleRemoveBenefit(index)}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Process Steps */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
              Execution Process Steps
            </h2>
            <p className="text-[11px] text-slate-400">
              Milestone-driven technical steps displayed as a timeline.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLoadStandardProcessSteps}
            className="self-start sm:self-auto text-[11px] font-bold text-gold-700 bg-gold-50 hover:bg-gold-100 px-3 py-1.5 rounded-lg border border-gold-300/80 transition shadow-2xs"
          >
            + Insert Standard 4-Step Process
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input
            type="text"
            value={newStepTitle}
            onChange={(e) => setNewStepTitle(e.target.value)}
            placeholder="Step Title (e.g. Initial Site Survey)"
            className="sm:col-span-4 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900"
          />
          <input
            type="text"
            value={newStepDesc}
            onChange={(e) => setNewStepDesc(e.target.value)}
            placeholder="Step Description"
            className="sm:col-span-6 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900"
          />
          <button
            type="button"
            onClick={handleAddProcessStep}
            className="sm:col-span-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs transition"
          >
            Add Step
          </button>
        </div>

        <div className="space-y-2">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-navy-900">
                  {index + 1}. {step.title}
                </span>
                <p className="text-slate-600">{step.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveStep(index)}
                className="text-slate-400 hover:text-red-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Fields */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          SEO & Meta Tags
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Custom SEO Title
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Defaults to Service Name | Alveric"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Meta Description
            </label>
            <input
              type="text"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Search engine snippet description"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 disabled:opacity-50 transition shadow"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isEditing ? 'Save Changes' : 'Create & Save Service'}</span>
        </button>
      </div>

    </form>
  );
}
