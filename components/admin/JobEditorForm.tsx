'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Job } from '@/types/database';
import { jobFormSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { Save, Plus, Trash2, AlertCircle, Loader2 } from 'lucide-react';

interface JobEditorFormProps {
  initialData?: Job | null;
  isEditing?: boolean;
}

export function JobEditorForm({ initialData, isEditing = false }: JobEditorFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [department, setDepartment] = useState(initialData?.department || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [employmentType, setEmploymentType] = useState(initialData?.employment_type || 'Full-Time');
  const [experience, setExperience] = useState(initialData?.experience || '3+ Years');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [displayOrder, setDisplayOrder] = useState(initialData?.display_order || 0);
  const [isPublished, setIsPublished] = useState<boolean>(initialData?.is_published ?? true);

  const [responsibilities, setResponsibilities] = useState<string[]>(
    Array.isArray(initialData?.responsibilities) ? (initialData.responsibilities as string[]) : []
  );
  const [newResp, setNewResp] = useState('');

  const [requirements, setRequirements] = useState<string[]>(
    Array.isArray(initialData?.requirements) ? (initialData.requirements as string[]) : []
  );
  const [newReq, setNewReq] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEditing || !slug) {
      setSlug(slugify(val));
    }
  }

  function handleAddResp() {
    if (!newResp.trim()) return;
    setResponsibilities([...responsibilities, newResp.trim()]);
    setNewResp('');
  }

  function handleAddReq() {
    if (!newReq.trim()) return;
    setRequirements([...requirements, newReq.trim()]);
    setNewReq('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      department: department.trim() || null,
      location: location.trim() || null,
      employment_type: employmentType.trim() || null,
      experience: experience.trim() || null,
      short_description: shortDescription.trim() || null,
      description: description.trim() || null,
      responsibilities,
      requirements,
      display_order: Number(displayOrder),
      is_published: isPublished,
    };

    const parseResult = jobFormSchema.safeParse(payload);
    if (!parseResult.success) {
      setErrorMessage(parseResult.error.errors[0]?.message || 'Please check form fields');
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing && initialData?.id) {
        const { error } = await supabase.from('jobs').update(payload).eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('jobs').insert([payload]);
        if (error) throw error;
      }

      router.push('/admin/careers');
      router.refresh();
    } catch (err: any) {
      if (err?.code === '23505') {
        setErrorMessage('A job opening with this URL slug already exists.');
      } else {
        setErrorMessage(err?.message || 'Failed to save job opening');
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Position Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Job Title <span className="text-gold-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Senior MEP Project Engineer"
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
              placeholder="e.g. senior-mep-project-engineer"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-slate-50/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. MEP Contracting"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dubai, UAE"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">Employment Type</label>
            <input
              type="text"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              placeholder="Full-Time / Contract"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">Experience Level</label>
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 5+ Years"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Short Description (Card Summary)
          </label>
          <textarea
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief overview of role objectives..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Full Description
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive description of position..."
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
            <span>Published (Active Opening)</span>
          </label>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Key Responsibilities
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={newResp}
            onChange={(e) => setNewResp(e.target.value)}
            placeholder="Add key responsibility..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddResp();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddResp}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {responsibilities.map((resp, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span>• {resp}</span>
              <button
                type="button"
                onClick={() => setResponsibilities(responsibilities.filter((_, idx) => idx !== i))}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Requirements & Qualifications
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={newReq}
            onChange={(e) => setNewReq(e.target.value)}
            placeholder="Add qualification or license requirement..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddReq();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddReq}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {requirements.map((req, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span>• {req}</span>
              <button
                type="button"
                onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

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
          <span>{isEditing ? 'Update Opening' : 'Post Opening'}</span>
        </button>
      </div>
    </form>
  );
}
