'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Media } from '@/types/database';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import {
  Upload,
  Search,
  Trash2,
  ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Copy,
} from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setMediaItems(data);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadMessage(null);
    setUploadProgress(0);

    let uploaded = 0;
    const total = files.length;

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''));

        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Upload failed');
        }

        const { media } = await response.json();
        if (media) {
          setMediaItems((prev) => [media, ...prev]);
        }

        uploaded++;
        setUploadProgress(Math.round((uploaded / total) * 100));
      } catch (err: any) {
        setUploadMessage({ type: 'error', text: `Failed to upload ${file.name}: ${err.message}` });
      }
    }

    setIsUploading(false);
    if (!uploadMessage) {
      setUploadMessage({ type: 'success', text: `${uploaded} file${uploaded !== 1 ? 's' : ''} uploaded successfully.` });
    }
    setTimeout(() => setUploadMessage(null), 4000);
  }, []);

  async function handleDelete(media: Media) {
    if (!confirm(`Permanently delete "${media.alt_text || media.public_id}"? This cannot be undone.`)) return;

    try {
      const response = await fetch(`/api/media/${media.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      setMediaItems((prev) => prev.filter((m) => m.id !== media.id));
      if (selectedMedia?.id === media.id) setSelectedMedia(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete media');
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setUploadMessage({ type: 'success', text: 'URL copied to clipboard!' });
      setTimeout(() => setUploadMessage(null), 2000);
    });
  }

  const filtered = mediaItems.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.alt_text?.toLowerCase().includes(q) ||
      item.public_id?.toLowerCase().includes(q) ||
      item.resource_type?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Media Library</h1>
          <p className="text-xs text-slate-500">
            Upload, browse, and manage all Cloudinary assets used across the website.
          </p>
        </div>

        <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition shadow cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Files'}</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.svg"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </label>
      </div>

      {/* Status Messages */}
      {uploadMessage && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
            uploadMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {uploadMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{uploadMessage.text}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          isDragging ? 'border-gold-500 bg-gold-50' : 'border-slate-300 bg-slate-50/50'
        }`}
      >
        <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-500">
          Drag & drop files here to upload to Cloudinary
        </p>
        <p className="text-[11px] text-slate-400 mt-1">Images, videos, PDFs supported</p>
      </div>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search media by name, public ID, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs bg-white focus:ring-1 focus:ring-gold-500"
        />
      </div>

      <div className="flex gap-6">
        {/* Media Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-navy-900 mr-2" />
              <span>Loading media library...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
              <h2 className="text-sm font-bold text-navy-900">No Media Found</h2>
              <p className="text-xs text-slate-500">
                Upload images to populate the Cloudinary media library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(selectedMedia?.id === item.id ? null : item)}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition ${
                    selectedMedia?.id === item.id
                      ? 'border-gold-500 shadow-md'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="aspect-square relative bg-slate-100">
                    <CldImageWrapper
                      src={item.secure_url}
                      alt={item.alt_text || item.public_id}
                      fill
                      fallbackText={item.resource_type ?? undefined}
                    />
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-[10px] font-semibold text-slate-700 truncate">
                      {item.alt_text || item.public_id?.split('/').pop() || 'Media'}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase">{item.resource_type}</p>
                  </div>

                  {/* Quick Actions Overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedMedia && (
          <div className="w-72 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 self-start sticky top-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-navy-900 uppercase">Media Details</h3>
              <button onClick={() => setSelectedMedia(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <CldImageWrapper
                src={selectedMedia.secure_url}
                alt={selectedMedia.alt_text || ''}
                fill
                fallbackText={selectedMedia.resource_type ?? undefined}
              />
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">Alt Text</span>
                <p className="text-navy-900 font-semibold mt-0.5">
                  {selectedMedia.alt_text || '—'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Public ID</span>
                <p className="text-navy-900 font-mono text-[11px] break-all mt-0.5">
                  {selectedMedia.public_id}
                </p>
              </div>
              {selectedMedia.width && (
                <div>
                  <span className="text-slate-400 font-semibold">Dimensions</span>
                  <p className="text-navy-900 mt-0.5">
                    {selectedMedia.width} × {selectedMedia.height}px
                  </p>
                </div>
              )}
              <div>
                <span className="text-slate-400 font-semibold">Type</span>
                <p className="text-navy-900 uppercase mt-0.5">{selectedMedia.resource_type}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => copyToClipboard(selectedMedia.secure_url)}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy CDN URL</span>
              </button>
              <button
                onClick={() => handleDelete(selectedMedia)}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
