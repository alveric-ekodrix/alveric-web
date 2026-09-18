import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AlvericLogoProps {
  logoUrl?: string | null;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  imageClassName?: string;
  showTagline?: boolean;
  href?: string;
}

const DEFAULT_LOGO_URL = '/logo/Alveric-logo-Photoroom.png';

export function AlvericLogo({
  logoUrl,
  variant = 'dark',
  size = 'md',
  className,
  imageClassName,
  showTagline = false,
  href = '/',
}: AlvericLogoProps) {
  const isLight = variant === 'light';
  const effectiveLogoUrl = logoUrl || DEFAULT_LOGO_URL;

  const sizeClasses = {
    sm: 'h-10 w-40 sm:w-48',
    md: 'h-12 sm:h-14 w-48 sm:w-56',
    lg: 'h-14 sm:h-16 w-56 sm:w-64 lg:w-72',
    xl: 'h-16 sm:h-20 w-64 sm:w-80',
  };

  const content = (
    <div className={cn('flex items-center select-none group shrink-0', className)}>
      <div
        className={cn(
          'relative transition-transform duration-300 group-hover:scale-[1.02] flex items-center shrink-0',
          isLight && !effectiveLogoUrl.includes('white')
            ? 'bg-white px-3 py-1.5 rounded-xl shadow-xs border border-white/20'
            : ''
        )}
      >
        <div className={cn('relative max-w-full shrink-0', sizeClasses[size], imageClassName)}>
          <Image
            src={effectiveLogoUrl}
            alt="ALVERIC TECHNICAL CONTRACTING LLC"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
