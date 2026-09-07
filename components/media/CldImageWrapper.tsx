import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface CldImageWrapperProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fallbackText?: string;
}

export function CldImageWrapper({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  sizes,
  fallbackText,
}: CldImageWrapperProps) {
  if (!src) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 border border-dashed border-slate-200 rounded-lg select-none',
          fill ? 'absolute inset-0 w-full h-full' : 'w-full min-h-[160px]',
          className
        )}
      >
        <ImageOff className="w-8 h-8 text-slate-300 mb-1" />
        <span className="text-xs font-medium text-slate-400 text-center">
          {fallbackText || 'Image pending upload'}
        </span>
      </div>
    );
  }

  // Cloudinary URL optimization: inject f_auto,q_auto if it is a Cloudinary URL
  let optimizedSrc = src;
  if (src.includes('res.cloudinary.com') && src.includes('/upload/')) {
    optimizedSrc = src.replace('/upload/', '/upload/f_auto,q_auto/');
  }

  if (fill) {
    const isExplicitRelative = className?.includes('relative');
    return (
      <div
        className={cn(
          isExplicitRelative ? 'relative' : 'absolute inset-0',
          'w-full h-full overflow-hidden'
        )}
      >
        <Image
          src={optimizedSrc}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          className={cn('object-cover w-full h-full', className)}
        />
      </div>
    );
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width || 600}
      height={height || 400}
      unoptimized
      priority={priority}
      sizes={sizes}
      className={cn('object-cover', className)}
    />
  );
}
