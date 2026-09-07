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
    sm: 'h-8 w-36',
    md: 'h-9 sm:h-10 w-40 sm:w-48',
    lg: 'h-10 sm:h-12 w-44 sm:w-56',
    xl: 'h-14 sm:h-16 w-60 sm:w-72',
  };

  const content = (
    <div className={cn('flex items-center select-none group', className)}>
      <div
        className={cn(
          'relative transition-transform duration-300 group-hover:scale-[1.02] flex items-center',
          isLight
            ? 'bg-white px-3 py-1.5 rounded-xl shadow-xs border border-white/20'
            : ''
        )}
      >
        <div className={cn('relative max-w-full', sizeClasses[size], imageClassName)}>
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
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
