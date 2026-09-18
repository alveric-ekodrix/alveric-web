'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CompanySettings, Service } from '@/types/database';
import { AlvericLogo } from '@/components/ui/AlvericLogo';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

interface FooterProps {
  companySettings?: CompanySettings | null;
  services?: Service[];
}

export function Footer({ companySettings, services = [] }: FooterProps) {
  // Mobile accordion state for collapsible footer columns
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    quickLinks: false,
    services: false,
    contact: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'Why Us', href: '/why-us' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Get a Quote', href: '/quote' },
  ];

  const phone1 = companySettings?.phone_primary;
  const phone2 = companySettings?.phone_secondary;
  const email = companySettings?.email;
  const address = companySettings?.address;
  const hours = companySettings?.business_hours;

  return (
    <footer className="bg-navy-950 text-slate-300 pt-12 sm:pt-16 pb-8 border-t border-navy-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-navy-800">
          {/* Column 1: Brand & Socials (Always visible) */}
          <div className="space-y-4">
            <AlvericLogo
              logoUrl="/logo/alveric-logo-white.png"
              variant="dark"
              size="md"
              showTagline={false}
            />
            <p className="text-xs font-semibold text-gold-400 tracking-wider uppercase">
              {companySettings?.tagline || 'BUILDING SOLUTIONS. DELIVERING EXCELLENCE.'}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              We are committed to providing high-quality technical contracting services that build lasting value across commercial, residential, and industrial infrastructure.
            </p>

            {/* Social Media Links if configured */}
            <div className="flex items-center gap-3 pt-2">
              {companySettings?.facebook_url && (
                <a
                  href={companySettings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-navy-900 border border-navy-700 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500 transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {companySettings?.linkedin_url && (
                <a
                  href={companySettings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-navy-900 border border-navy-700 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500 transition"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {companySettings?.instagram_url && (
                <a
                  href={companySettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-navy-900 border border-navy-700 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500 transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {companySettings?.youtube_url && (
                <a
                  href={companySettings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-navy-900 border border-navy-700 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500 transition"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links (Collapsible Accordion on mobile) */}
          <div className="border-t border-navy-900 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('quickLinks')}
              className="w-full flex items-center justify-between md:cursor-default text-left group"
              aria-expanded={openSections.quickLinks}
            >
              <h4 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                Quick Links
              </h4>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform duration-200 ${
                  openSections.quickLinks ? 'rotate-180 text-gold-500' : 'text-slate-400'
                }`}
              />
            </button>

            <div
              className={`mt-3 md:mt-4 space-y-2 text-xs transition-all duration-300 ${
                openSections.quickLinks ? 'block' : 'hidden md:block'
              }`}
            >
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-gold-400 transition flex items-center gap-1.5 group py-1 md:py-0"
                    >
                      <ArrowRight className="w-3 h-3 text-gold-500/70 group-hover:translate-x-1 transition-transform" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Our Services (Collapsible Accordion on mobile) */}
          <div className="border-t border-navy-900 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('services')}
              className="w-full flex items-center justify-between md:cursor-default text-left group"
              aria-expanded={openSections.services}
            >
              <h4 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                Our Services
              </h4>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform duration-200 ${
                  openSections.services ? 'rotate-180 text-gold-500' : 'text-slate-400'
                }`}
              />
            </button>

            <div
              className={`mt-3 md:mt-4 space-y-2 text-xs transition-all duration-300 ${
                openSections.services ? 'block' : 'hidden md:block'
              }`}
            >
              {services.length > 0 ? (
                <ul className="space-y-2">
                  {services.slice(0, 7).map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-slate-400 hover:text-gold-400 transition flex items-center gap-1.5 group line-clamp-1 py-1 md:py-0"
                      >
                        <ArrowRight className="w-3 h-3 text-gold-500/70 group-hover:translate-x-1 transition-transform shrink-0" />
                        <span className="truncate">{service.name}</span>
                      </Link>
                    </li>
                  ))}
                  {services.length > 7 && (
                    <li className="pt-1">
                      <Link
                        href="/services"
                        className="text-gold-400 hover:underline font-semibold flex items-center gap-1 py-1 md:py-0"
                      >
                        <span>View All Services</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 py-1">Services catalogue updating soon.</p>
              )}
            </div>
          </div>

          {/* Column 4: Contact Us (Collapsible Accordion on mobile) */}
          <div className="border-t border-navy-900 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('contact')}
              className="w-full flex items-center justify-between md:cursor-default text-left group"
              aria-expanded={openSections.contact}
            >
              <h4 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                Contact Us
              </h4>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform duration-200 ${
                  openSections.contact ? 'rotate-180 text-gold-500' : 'text-slate-400'
                }`}
              />
            </button>

            <div
              className={`mt-3 md:mt-4 space-y-3 text-xs transition-all duration-300 ${
                openSections.contact ? 'block' : 'hidden md:block'
              }`}
            >
              {address && (
                <div className="flex items-start gap-2.5 text-slate-400 py-1 md:py-0">
                  <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}

              {phone1 && (
                <div className="flex items-center gap-2.5 text-slate-400 py-1 md:py-0">
                  <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                  <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="hover:text-gold-400 transition">
                    {phone1}
                  </a>
                </div>
              )}

              {phone2 && (
                <div className="flex items-center gap-2.5 text-slate-400 py-1 md:py-0">
                  <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                  <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="hover:text-gold-400 transition">
                    {phone2}
                  </a>
                </div>
              )}

              {email && (
                <div className="flex items-center gap-2.5 text-slate-400 py-1 md:py-0">
                  <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-gold-400 transition">
                    {email}
                  </a>
                </div>
              )}

              {hours && (
                <div className="flex items-center gap-2.5 text-slate-400 py-1 md:py-0">
                  <Clock className="w-4 h-4 text-gold-500 shrink-0" />
                  <span>{hours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col items-center justify-center text-center gap-1.5 text-xs text-slate-500">
          <p>© 2026 ALVERIC Technical Contracting LLC. All Rights Reserved.</p>
          <p className="text-[11px] text-slate-500">
            Crafted by{' '}
            <a
              href="https://ekodrix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-gold-400 font-medium transition"
            >
              ekodrix
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
