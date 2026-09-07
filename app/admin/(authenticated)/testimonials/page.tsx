'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Testimonial, Media } from '@/types/database';
import { ImageUploadZone } from '@/components/media/ImageUploadZone';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import { Plus, Edit, Trash2, Save, X, Star, MessageSquareQuote, Loader2, AlertCircle } from 'lucide-react';

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [avatarMedia, setAvatarMedia] = useState<Media | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*, avatar_media:media!testimonials_avatar_media_id_fkey(*)')
        .order('display_order', { ascending: true });
      if (!error && data) {
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function startCreate() {
    setEditingTestimonial(null);
    setClientName('');
    setClientRole('');
    setCompanyName('');
    setRating(5);
    setContent('');
    setDisplayOrder(testimonials.length);
    setIsPublished(true);
    setIsFeatured(false);
    setAvatarMedia(null);
    setIsCreating(true);
    setErrorMessage(null);
  }

  function startEdit(t: Testimonial) {
    setIsCreating(false);
    setEditingTestimonial(t);
    setClientName(t.client_name);
    setClientRole(t.client_role || '');
    setCompanyName(t.company_name || '');
    setRating(t.rating);
    setContent(t.content);
    setDisplayOrder(t.display_order);
    setIsPublished(t.is_published);
    setIsFeatured(t.is_featured);
    setAvatarMedia(t.avatar_media || null);
    setErrorMessage(null);
  }

  function cancelForm() {
    setIsCreating(false);
    setEditingTestimonial(null);
    setErrorMessage(null);
    setClientName('');
    setClientRole('');
    setCompanyName('');
    setRating(5);
    setContent('');
    setAvatarMedia(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    if (!clientName.trim() || !content.trim()) {
      setErrorMessage('Client name and testimonial review content are required');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        client_name: clientName.trim(),
        client_role: clientRole.trim() || null,
        company_name: companyName.trim() || null,
        avatar_media_id: avatarMedia?.id || null,
        rating: Number(rating),
        content: content.trim(),
        display_order: Number(displayOrder),
        is_published: isPublished,
        is_featured: isFeatured,
      };

      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editingTestimonial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert([payload]);
        if (error) throw error;
      }

      await loadTestimonials();
      cancelForm();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save testimonial');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Testimonials Management</h1>
          <p className="text-xs text-slate-500">
            Publish real client testimonials and reviews from contracting clients.
          </p>
        </div>

        {!isCreating && !editingTestimonial && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        )}
      </div>

      {(isCreating || editingTestimonial) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-navy-900 uppercase">
              {editingTestimonial ? `Edit Testimonial` : 'Add Testimonial'}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Client Name <span className="text-gold-500">*</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. David Miller"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={clientRole}
                onChange={(e) => setClientRole(e.target.value)}
                placeholder="e.g. Facilities Director"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Al Fardan Group"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploadZone
              label="Client Avatar / Photo (Optional)"
              helperText="Client headshot or company logo. Drag & drop or click to upload."
              value={avatarMedia}
              onChange={(media) => setAvatarMedia(media)}
              folder="alveric/testimonials"
              previewHeight="h-32"
            />

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-2">
                Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-1 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-gold-500 fill-gold-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Testimonial Content <span className="text-gold-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Client's feedback regarding MEP, safety, timing, or craftsmanship..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Order</label>
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

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-900 pt-5">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500"
              />
              <span>Featured</span>
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
              <span>Save Testimonial</span>
            </button>
          </div>
        </form>
      )}

      {/* Testimonials List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-navy-900 mr-2" />
          <span>Loading testimonials...</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto space-y-3">
          <MessageSquareQuote className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-navy-900">No Testimonials in Database</h2>
          <p className="text-xs text-slate-500">
            Add authentic testimonials received from clients.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                    ))}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic line-clamp-3">"{item.content}"</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="text-xs font-bold text-navy-900 block">{item.client_name}</span>
                  <span className="text-[11px] text-slate-400">
                    {item.client_role} {item.company_name && `• ${item.company_name}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1 text-slate-400 hover:text-navy-900 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
