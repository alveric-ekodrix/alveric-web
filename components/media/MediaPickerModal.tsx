'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Media } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Check, Image as ImageIcon, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  title?: string;
  folder?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select or Upload Media',
  folder = 'alveric',
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Media | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

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
      console.error('Failed to load media items:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function applyFile(file: File) {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, SVG, etc.).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit.');
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (!altText) {
      setAltText(file.name.replace(/\.[^/.]+$/, ''));
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOver(true);
    }
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    dragCounter.current = 0;
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', folder);
      formData.append('alt_text', altText);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Upload failed');
      }

      const newMedia: Media = json.media;
      setMediaItems((prev) => [newMedia, ...prev]);
      onSelect(newMedia);
      onClose();
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }

  if (!isOpen) return null;

  const filteredItems = mediaItems.filter(
    (item) =>
      item.public_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.alt_text && item.alt_text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex flex-col h-[85vh] w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-navy-900" />
            <h3 className="text-lg font-bold text-navy-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          <button
            onClick={() => setActiveTab('library')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === 'library'
                ? 'border-gold-500 text-navy-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Media Library ({mediaItems.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === 'upload'
                ? 'border-gold-500 text-navy-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Upload New File
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {activeTab === 'library' ? (
            <div className="flex flex-col h-full gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search media by name or alt text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                />
              </div>

              {/* Grid or Empty */}
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-navy-900 mr-2" />
                  <span>Loading media library...</span>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-dashed border-slate-200">
                  <ImageIcon className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="text-slate-600 font-medium mb-1">No media files found</p>
                  <p className="text-slate-400 text-xs mb-4">
                    Switch to the Upload tab to add images to Cloudinary.
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-4 py-2 bg-navy-900 text-white rounded-md text-sm font-medium hover:bg-navy-800 transition"
                  >
                    Upload an Image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        onDoubleClick={() => {
                          onSelect(item);
                          onClose();
                        }}
                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer bg-white transition shadow-sm ${
                          isSelected
                            ? 'border-gold-500 ring-2 ring-gold-500/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        title="Click to select, double-click to insert immediately"
                      >
                        <Image
                          src={item.secure_url}
                          alt={item.alt_text || 'Media'}
                          fill
                          sizes="180px"
                          className="object-cover group-hover:scale-105 transition duration-200"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-gold-500 text-white p-1 rounded-full shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/75 to-transparent text-white text-[11px] truncate opacity-0 group-hover:opacity-100 transition">
                          {item.alt_text || item.public_id}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center max-w-xl mx-auto h-full gap-4">
              <div
                className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 ${
                  isDraggingOver
                    ? 'border-gold-500 bg-gold-50 scale-[1.01] shadow-md'
                    : 'border-slate-300 bg-white hover:border-gold-400 hover:bg-slate-50'
                }`}
                onClick={() => document.getElementById('media-modal-file-input')?.click()}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  id="media-modal-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {isDraggingOver ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-gold-100 flex items-center justify-center mb-3">
                      <Upload className="w-7 h-7 text-gold-600" />
                    </div>
                    <p className="font-bold text-gold-700">Drop to upload</p>
                    <p className="text-xs text-gold-500 mt-1">Release to add your image</p>
                  </>
                ) : previewUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-44 h-44 rounded-lg overflow-hidden border border-slate-200 mb-3 shadow-md">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                    <span className="text-xs text-slate-500 underline">Click to choose another file or drag a new one</span>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-navy-50 flex items-center justify-center text-navy-900 mb-3">
                      <Upload className="w-7 h-7 text-navy-900" />
                    </div>
                    <p className="font-semibold text-slate-700">Click to browse or drag & drop</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, SVG up to 10MB</p>
                  </>
                )}
              </div>

              {selectedFile && (
                <div className="w-full bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alt Text / Description (SEO)
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="e.g. Alveric Electrical Installation at Commercial Building"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-800 focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                  <button
                    disabled={isUploading}
                    onClick={handleUpload}
                    className="w-full py-2.5 bg-navy-900 text-white rounded-lg font-medium text-sm hover:bg-navy-800 disabled:opacity-50 flex items-center justify-center gap-2 transition shadow"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload & Select</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {uploadError && (
                <p className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 w-full text-center">
                  {uploadError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {activeTab === 'library' && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-white">
            <span className="text-xs text-slate-500">
              {selectedItem ? `Selected: ${selectedItem.alt_text || selectedItem.public_id}` : 'No item selected'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                disabled={!selectedItem}
                onClick={() => {
                  if (selectedItem) {
                    onSelect(selectedItem);
                    onClose();
                  }
                }}
                className="px-5 py-2 bg-navy-900 text-white rounded-md text-sm font-medium hover:bg-navy-800 disabled:opacity-40 transition shadow-sm"
              >
                Insert Selected
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
