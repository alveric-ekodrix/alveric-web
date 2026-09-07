'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProjectCategory } from '@/types/database';
import { slugify } from '@/lib/utils';
import { Plus, Edit, Trash2, Save, X, AlertCircle, CheckCircle2, Loader2, Tags } from 'lucide-react';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ProjectCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function startCreate() {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setDisplayOrder(categories.length);
    setIsPublished(true);
    setIsCreating(true);
    setErrorMessage(null);
  }

  function startEdit(cat: ProjectCategory) {
    setIsCreating(false);
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setDisplayOrder(cat.display_order);
    setIsPublished(cat.is_published);
    setErrorMessage(null);
  }

  function cancelForm() {
    setIsCreating(false);
    setEditingCategory(null);
    setErrorMessage(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    if (!name.trim() || !slug.trim()) {
      setErrorMessage('Category name and slug are required');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        display_order: Number(displayOrder),
        is_published: isPublished,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('project_categories')
          .update(payload)
          .eq('id', editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('project_categories').insert([payload]);
        if (error) throw error;
      }

      await loadCategories();
      cancelForm();
    } catch (err: any) {
      if (err?.code === '23505') {
        setErrorMessage('A category with this slug already exists.');
      } else {
        setErrorMessage(err?.message || 'Failed to save category');
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category? Projects belonging to this category will have their category set to unassigned.')) {
      return;
    }

    try {
      const { error } = await supabase.from('project_categories').delete().eq('id', id);
      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete category');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Project Categories</h1>
          <p className="text-xs text-slate-500">
            Define sectors and classification categories for your technical contracting portfolio.
          </p>
        </div>

        {!isCreating && !editingCategory && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Inline Form for Create or Edit */}
      {(isCreating || editingCategory) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-navy-900 uppercase">
              {editingCategory ? `Edit: ${editingCategory.name}` : 'Create New Category'}
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
                Category Name <span className="text-gold-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingCategory) setSlug(slugify(e.target.value));
                }}
                placeholder="e.g. Commercial Building, Luxury Villa"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Slug <span className="text-gold-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="e.g. commercial-building"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this sector..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="w-32 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-4 sm:pt-0">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-900">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-navy-900 focus:ring-gold-500"
                />
                <span>Published (Visible in Project Filters)</span>
              </label>
            </div>
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
              <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-navy-900 mr-2" />
          <span>Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto space-y-3">
          <Tags className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-navy-900">No Categories Found</h2>
          <p className="text-xs text-slate-500">
            Create project categories first so that projects can be classified and filtered.
          </p>
          <button
            onClick={startCreate}
            className="px-4 py-2 bg-gold-500 text-navy-950 rounded-lg text-xs font-bold hover:bg-gold-400 transition"
          >
            Create First Category
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Name & Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-navy-900 block">{cat.name}</span>
                    <span className="font-mono text-[11px] text-slate-400">/{cat.slug}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {cat.description || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                    {cat.display_order}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        cat.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1 text-slate-400 hover:text-navy-900 transition"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
