import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Wrench } from 'lucide-react';

interface ServiceIconProps {
  iconUrl?: string | null;
  slug?: string;
  name?: string;
  className?: string;
}

export function ServiceIcon({ iconUrl, slug = '', name = '', className }: ServiceIconProps) {
  if (iconUrl) {
    return (
      <div className={cn('relative w-9 h-9 shrink-0 rounded-full overflow-hidden', className)}>
        <Image
          src={iconUrl}
          alt={name || 'Service Icon'}
          fill
          className="object-cover rounded-full scale-[1.02]"
        />
      </div>
    );
  }

  const s = (slug + ' ' + name).toLowerCase();

  // 1. Electrical Fitting
  if (s.includes('electr')) {
    return (
      <svg viewBox="0 0 36 36" className={cn('w-9 h-9 shrink-0', className)} fill="none">
        <path d="M19 3L7 19H17L14 33L29 15H17L21 3H19Z" fill="#0B2239" />
        <path d="M17 19L14 33L29 15H17Z" fill="#C9972B" />
      </svg>
    );
  }

  // 2. Air-Conditioning & Ventilation
  if (s.includes('air') || s.includes('condition') || s.includes('hvac') || s.includes('ventilat')) {
    return (
      <svg viewBox="0 0 36 36" className={cn('w-9 h-9 shrink-0', className)} fill="none">
        {/* Snowflake center & rays */}
        <path d="M18 4V16M18 20V32M4 18H16M20 18H32" stroke="#0B2239" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M8 8L16 16M20 20L28 28M8 28L16 20M20 16L28 8" stroke="#0B2239" strokeWidth="2" strokeLinecap="round" />
        {/* Airflow waves in gold */}
        <path d="M7 26C10 24 13 28 16 26" stroke="#C9972B" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 30C10 28 13 32 16 30" stroke="#C9972B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 3. Painting Contracting
  if (s.includes('paint')) {
    return (
      <svg viewBox="0 0 36 36" className={cn('w-9 h-9 shrink-0', className)} fill="none">
        {/* Roller */}
        <rect x="7" y="6" width="20" height="9" rx="3" fill="#0B2239" />
        {/* Roller frame & handle */}
        <path d="M27 10.5H30V22H18V30" stroke="#C9972B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="16" y="27" width="4" height="6" rx="1" fill="#C9972B" />
      </svg>
    );
  }

  // 4. Building Maintenance
  if (s.includes('building') || s.includes('maintenance')) {
    return (
      <svg viewBox="0 0 36 36" className={cn('w-9 h-9 shrink-0', className)} fill="none">
        {/* Building */}
        <rect x="8" y="6" width="13" height="24" rx="1.5" fill="#0B2239" />
        <rect x="11" y="9" width="3" height="3" fill="#FFFFFF" />
        <rect x="16" y="9" width="3" height="3" fill="#FFFFFF" />
        <rect x="11" y="15" width="3" height="3" fill="#FFFFFF" />
        <rect x="16" y="15" width="3" height="3" fill="#FFFFFF" />
        <rect x="11" y="21" width="3" height="3" fill="#FFFFFF" />
        <rect x="16" y="21" width="3" height="3" fill="#FFFFFF" />
        {/* Gear / Wrench in Gold */}
        <path d="M23 18L26 21M26 18L23 21" stroke="#C9972B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24.5" cy="24.5" r="4.5" stroke="#C9972B" strokeWidth="2" />
        <path d="M24.5 22V27M22 24.5H27" stroke="#C9972B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 5. Swimming Pools Maintenance
  if (s.includes('pool') || s.includes('swim')) {
    return (
      <svg viewBox="0 0 36 36" className={cn('w-9 h-9 shrink-0', className)} fill="none">
        {/* Pool ladder */}
        <path d="M12 5C12 5 12 18 12 21M18 5C18 5 18 18 18 21" stroke="#0B2239" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 10H18M12 15H18M12 20H18" stroke="#0B2239" strokeWidth="2" strokeLinecap="round" />
        {/* Waves */}
        <path d="M5 24C8 22 11 26 14 24C17 22 20 26 23 24C26 22 29 26 32 24" stroke="#C9972B" strokeWidth="2" strokeLinecap="round" />
        <path d="M5 28C8 26 11 30 14 28C17 26 20 30 23 28C26 26 29 30 32 28" stroke="#0B2239" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 6. Plumbing & Sanitary
  if (s.includes('plumb') || s.includes('sanitar')) {
    return (
      <svg viewBox="0 0 36 36" className={cn('w-9 h-9 shrink-0', className)} fill="none">
        {/* Pipe */}
        <path d="M5 14H16V22H24" stroke="#0B2239" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Water droplet */}
        <path d="M24 24C24 24 27 28 27 30C27 31.6569 25.6569 33 24 33C22.3431 33 21 31.6569 21 30C21 28 24 24 24 24Z" fill="#C9972B" />
      </svg>
    );
  }

  // 7. Carpentry & Wood Flooring
  if (s.includes('carpent') || s.includes('wood')) {
    return (
      <svg viewBox="0 0 36 36" className={cn('w-9 h-9 shrink-0', className)} fill="none">
        {/* Saw */}
        <path d="M6 19L20 7L27 14L13 26L6 19Z" fill="#0B2239" />
        <circle cx="10" cy="22" r="1.5" fill="#FFFFFF" />
        {/* Wood Board in Gold */}
        <rect x="6" y="27" width="24" height="4" rx="1" fill="#C9972B" />
      </svg>
    );
  }

  // 8. Floor & Wall Tiling
  if (s.includes('til') || s.includes('floor')) {
    return (
      <svg viewBox="0 0 36 36" className={cn('w-9 h-9 shrink-0', className)} fill="none">
        <rect x="6" y="6" width="6" height="6" fill="#0B2239" />
        <rect x="14" y="6" width="6" height="6" fill="#C9972B" />
        <rect x="22" y="6" width="6" height="6" fill="#0B2239" />
        <rect x="6" y="14" width="6" height="6" fill="#C9972B" />
        <rect x="14" y="14" width="6" height="6" fill="#0B2239" />
        <rect x="22" y="14" width="6" height="6" fill="#C9972B" />
        <rect x="6" y="22" width="6" height="6" fill="#0B2239" />
        <rect x="14" y="22" width="6" height="6" fill="#C9972B" />
        <rect x="22" y="22" width="6" height="6" fill="#0B2239" />
      </svg>
    );
  }

  // 9. Demolition & Wrecking
  if (s.includes('wreck') || s.includes('demolit')) {
    return (
      <svg viewBox="0 0 36 36" className={cn('w-9 h-9 shrink-0', className)} fill="none">
        {/* Excavator Arm */}
        <path d="M14 18L21 9L27 12L29 18" stroke="#0B2239" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Body & tracks */}
        <rect x="7" y="18" width="10" height="7" rx="1.5" fill="#0B2239" />
        <rect x="5" y="26" width="14" height="4" rx="2" fill="#C9972B" />
        {/* Rubble */}
        <circle cx="25" cy="28" r="2" fill="#C9972B" />
        <circle cx="29" cy="26" r="2.5" fill="#0B2239" />
      </svg>
    );
  }

  // 10. Decoration Design
  if (s.includes('decor') || s.includes('design')) {
    return (
      <svg viewBox="0 0 36 36" className={cn('w-9 h-9 shrink-0', className)} fill="none">
        {/* Lamp */}
        <path d="M12 4V9M8 14H16L14 9H10L8 14Z" stroke="#0B2239" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Picture Frame in Gold */}
        <rect x="19" y="8" width="11" height="8" rx="1" stroke="#C9972B" strokeWidth="1.5" />
        {/* Armchair */}
        <path d="M9 25V29M21 25V29M7 23H23V26H7V23Z" stroke="#0B2239" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return <Wrench className={cn('w-8 h-8 text-navy-900', className)} />;
}
