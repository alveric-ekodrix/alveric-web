'use client';

import React, { useState, useRef } from 'react';
import { MediaPickerModal } from './MediaPickerModal';
import { Media } from '@/types/database';
import {
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
  Trash2,
  ImageIcon,
} from 'lucide-react';

interface ImageUploadZoneProps {
  label?: string;
  helperText?: string;
  value?: Media | null;
  onChange: (media: Media | null) => void;
  folder?: string;
  previewHeight?: string;
  allowLibraryPicker?: boolean;
  /** Set to false to skip compression (e.g. hero/banner images). Default: true */
  compress?: boolean;
}

// ── Client-side image compression via Canvas ──────────────────────────────────
async function compressImage(file: File, maxDim = 2400, quality = 0.82): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width <= maxDim && height <= maxDim) {
        // Already small enough — skip canvas round-trip
        resolve(file);
        return;
      }
      const ratio = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      // Prefer webp when the browser supports it, otherwise keep original mime
      const outputMime = canvas.toDataURL('image/webp').startsWith('data:image/webp')
        ? 'image/webp'
        : file.type;
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          // Keep original extension name
          const ext = outputMime === 'image/webp' ? '.webp' : file.name.slice(file.name.lastIndexOf('.'));
          const baseName = file.name.replace(/\.[^/.]+$/, '');
          resolve(new File([blob], `${baseName}${ext}`, { type: outputMime }));
        },
        outputMime,
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export function ImageUploadZone({
  label,
  helperText,
  value,
  onChange,
  folder = 'alveric',
  previewHeight = 'h-48',
  allowLibraryPicker = true,
  compress = true,
}: ImageUploadZoneProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [justUploaded, setJustUploaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (rawFile: File) => {
    setUploadError(null);

    if (!rawFile.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, SVG).');
      return;
    }

    if (rawFile.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit.');
      return;
    }

    // Immediate instant local preview so the box NEVER stays blank
    const objectUrl = URL.createObjectURL(rawFile);
    setLocalPreview(objectUrl);
    setIsUploading(true);

    try {
      // Compress before upload (skip SVGs — canvas can't reliably handle them)
      const fileToUpload =
        compress && rawFile.type !== 'image/svg+xml'
          ? await compressImage(rawFile)
          : rawFile;

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('folder', folder);
      formData.append('alt_text', rawFile.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.media);
      setJustUploaded(true);
      setTimeout(() => setJustUploaded(false), 3500);
    } catch (err: any) {
      console.error('Direct upload failed:', err);
      setUploadError(err?.message || 'Failed to upload image. Please check Cloudinary settings.');
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl =
    localPreview ||
    (typeof value === 'string' ? value : value?.secure_url || (value as any)?.url);

  return (
    <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
      {/* Label and Library Link */}
      <div className="flex items-center justify-between">
        <div>
          {label && <label className="block text-xs font-bold text-navy-900">{label}</label>}
          {helperText && <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>}
        </div>
        {allowLibraryPicker && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-gold-600 transition shrink-0 ml-2"
          >
            <FolderOpen className="w-3.5 h-3.5 text-gold-500" />
            <span>Library</span>
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Main Upload / Preview Area */}
      {displayUrl ? (
        /* State A: Image Attached */
        <div className="space-y-3">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative w-full ${previewHeight} rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center transition ${
              isDragging ? 'ring-4 ring-gold-500/40 border-gold-500' : ''
            }`}
          >
            {/* Direct native img tag so it NEVER fails, never requires server-side image proxy, and shows instantly */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt={value?.alt_text || 'Uploaded image'}
              className="w-full h-full object-cover"
              loading="eager"
            />

            {/* Drop replacement indicator */}
            {isDragging && (
              <div className="absolute inset-0 bg-gold-500/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                <UploadCloud className="w-8 h-8 animate-bounce mb-1" />
                <span className="text-xs font-black uppercase tracking-wider">Drop to Replace</span>
              </div>
            )}

            {/* Uploading indicator */}
            {isUploading && (
              <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                <Loader2 className="w-7 h-7 animate-spin text-gold-400 mb-2" />
                <p className="text-xs font-bold">Uploading new image...</p>
              </div>
            )}

            {justUploaded && (
              <div className="absolute top-2.5 right-2.5 z-10 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Uploaded</span>
              </div>
            )}
          </div>

          {/* Visible Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Image attached</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Change</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLocalPreview(null);
                  onChange(null);
                }}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* State B: Empty Dropzone */
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative cursor-pointer w-full ${previewHeight} rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center p-6 select-none ${
            isDragging
              ? 'border-gold-500 bg-gold-50/50 scale-[1.01] ring-4 ring-gold-500/20'
              : 'border-slate-300 bg-slate-50/50 hover:border-gold-500/80 hover:bg-gold-50/10'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center text-slate-600">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-2" />
              <p className="text-xs font-bold text-navy-900">Uploading to Cloudinary...</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Please wait a moment</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-gold-500">
                <UploadCloud className="w-5 h-5" />
              </div>

              <div>
                <p className="text-xs font-bold text-navy-900">
                  Drag & drop image here, or{' '}
                  <span className="text-gold-600 underline font-extrabold">browse</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP, SVG (up to 10MB)</p>
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 shadow-2xs">
                Click anywhere to upload
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          <X className="w-4 h-4 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Media Library Modal */}
      {allowLibraryPicker && (
        <MediaPickerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={(selectedMedia) => {
            onChange(selectedMedia);
            setIsModalOpen(false);
          }}
          title={label ? `Select ${label}` : 'Select Media Asset'}
          folder={folder}
        />
      )}
    </div>
  );
}
