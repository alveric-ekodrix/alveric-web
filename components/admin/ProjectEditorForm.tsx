'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Project, ProjectCategory, Service, Media } from '@/types/database';
import { projectFormSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { ImageUploadZone } from '@/components/media/ImageUploadZone';
import { Save, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface ProjectEditorFormProps {
  initialData?: Project | null;
  isEditing?: boolean;
}

export function ProjectEditorForm({ initialData, isEditing = false }: ProjectEditorFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [clientName, setClientName] = useState(initialData?.client_name || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [completionDate, setCompletionDate] = useState(initialData?.completion_date || '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [challenge, setChallenge] = useState(initialData?.challenge || '');
  const [solution, setSolution] = useState(initialData?.solution || '');
  const [results, setResults] = useState(initialData?.results || '');

  const [displayOrder, setDisplayOrder] = useState(initialData?.display_order || 0);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [isPublished, setIsPublished] = useState(initialData?.is_published || false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description || '');

  // Media
  const [thumbnailMedia, setThumbnailMedia] = useState<Media | null>(initialData?.thumbnail_media || null);
  const [featuredImage, setFeaturedImage] = useState<Media | null>(initialData?.featured_image || null);

  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadFormDependencies();
  }, []);

  async function loadFormDependencies() {
    setIsLoadingMetadata(true);
    try {
      const [catsRes, servsRes] = await Promise.all([
        supabase.from('project_categories').select('*').order('name'),
        supabase.from('services').select('*').order('name'),
      ]);
      if (catsRes.data) setCategories(catsRes.data);
      if (servsRes.data) setServices(servsRes.data);
    } catch (err) {
      console.error('Failed to load project form dependencies:', err);
    } finally {
      setIsLoadingMetadata(false);
    }
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEditing || !slug) {
      setSlug(slugify(val));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category_id: categoryId || null,
      client_name: clientName.trim() || null,
      location: location.trim() || null,
      completion_date: completionDate || null,
      short_description: shortDescription.trim() || null,
      description: description.trim() || null,
      challenge: challenge.trim() || null,
      solution: solution.trim() || null,
      results: results.trim() || null,
      thumbnail_media_id: thumbnailMedia?.id || null,
      featured_image_id: featuredImage?.id || null,
      display_order: Number(displayOrder),
      is_featured: isFeatured,
      is_published: isPublished,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      gallery_media_ids: [],
      service_ids: [],
    };

    const parseResult = projectFormSchema.safeParse(payload);
    if (!parseResult.success) {
      setErrorMessage(parseResult.error.errors[0]?.message || 'Please check form fields');
      return;
    }

    setIsSaving(true);

    try {
      const dbPayload = {
        title: payload.title,
        slug: payload.slug,
        category_id: payload.category_id,
        client_name: payload.client_name,
        location: payload.location,
        completion_date: payload.completion_date,
        short_description: payload.short_description,
        description: payload.description,
        challenge: payload.challenge,
        solution: payload.solution,
        results: payload.results,
        thumbnail_media_id: payload.thumbnail_media_id,
        featured_image_id: payload.featured_image_id,
        display_order: payload.display_order,
        is_featured: payload.is_featured,
        is_published: payload.is_published,
        seo_title: payload.seo_title,
        seo_description: payload.seo_description,
      };

      if (isEditing && initialData?.id) {
        const { error } = await supabase
          .from('projects')
          .update(dbPayload)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([dbPayload]);
        if (error) throw error;
      }

      setIsSuccess(true);
      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      if (err?.code === '23505') {
        setErrorMessage('A project with this URL slug already exists. Please choose a unique slug.');
      } else {
        setErrorMessage(err?.message || 'Failed to save project');
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
          <span>Project saved successfully! Redirecting to projects list...</span>
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
          Project Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Project Title <span className="text-gold-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Commercial Office Building MEP"
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
              placeholder="e.g. commercial-office-building-mep"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-slate-50/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Sector / Category (From Database)
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Client Name / Organization
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Emaar Properties"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Project Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dubai Marina, UAE"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Completion Date
            </label>
            <input
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-900">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-navy-900 focus:ring-gold-500"
              />
              <span>Published</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-900">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500"
              />
              <span>Featured</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Short Description (Card Excerpt)
          </label>
          <textarea
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief overview of project scope..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Full Project Overview
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed technical specifications and execution narrative..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Case Study Breakdown (Challenge / Solution / Results) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Case Study Breakdown
        </h2>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Engineering Challenge
          </label>
          <textarea
            rows={3}
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="Complex structural constraints, fast-track schedule, or site logistics..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Technical Solution Provided
          </label>
          <textarea
            rows={3}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Engineered installation methodology, equipment deployed, precision craftsmanship..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Results & Impact
          </label>
          <textarea
            rows={3}
            value={results}
            onChange={(e) => setResults(e.target.value)}
            placeholder="On-time delivery, zero safety incidents, client sign-off, energy ratings achieved..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Project Imagery
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageUploadZone
            label="Thumbnail Image (Card Preview)"
            helperText="Appears on project cards & grid. Drag & drop or click to upload."
            value={thumbnailMedia}
            onChange={(media) => setThumbnailMedia(media)}
            folder="alveric/projects"
            previewHeight="h-44"
          />

          <ImageUploadZone
            label="Featured Banner Image (Detail Hero)"
            helperText="Large hero banner on the project detail page. Drag & drop or click to upload."
            value={featuredImage}
            onChange={(media) => setFeaturedImage(media)}
            folder="alveric/projects"
            previewHeight="h-44"
          />
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          SEO Configuration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Custom Meta Title
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Defaults to Project Title | Alveric"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Custom Meta Description
            </label>
            <input
              type="text"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Summary for search engines"
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
          <span>{isEditing ? 'Save Changes' : 'Publish Project'}</span>
        </button>
      </div>

    </form>
  );
}
