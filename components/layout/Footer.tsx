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
  MessageCircle,
  Sparkles,
  ArrowUp,
} from 'lucide-react';

interface FooterProps {
  companySettings?: CompanySettings | null;
  services?: Service[];
}

const WA_NUMBER_DISPLAY = '0569919792';
const WA_NUMBER_INTL = '971569919792';
const WA_FOOTER_URL = `https://wa.me/${WA_NUMBER_INTL}?text=${encodeURIComponent(
  "Hello Alveric Team! I'm reaching out through your website footer and would like to inquire about your contracting services."
)}`;

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <footer className="relative bg-navy-950 text-slate-300 pt-0 pb-8 border-t border-navy-800/80 overflow-hidden">
      {/* 1. Luminous Gold Gradient Top Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold-500/80 to-transparent opacity-90 shadow-sm" />

      {/* Subtle Background Radial Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {/* Main Footer 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-navy-800/80">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <AlvericLogo
              logoUrl="/logo/alveric-logo-white.png"
              variant="dark"
              size="md"
              showTagline={false}
            />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gold-500/10 border border-gold-500/25 text-[10px] font-extrabold text-gold-400 tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>{companySettings?.tagline || 'BUILDING SOLUTIONS. DELIVERING EXCELLENCE.'}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              We provide precision technical contracting services across commercial, residential, and industrial environments with an uncompromising focus on quality, safety, and reliability.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Connect With Us</span>
              <div className="flex items-center gap-2.5">
                {companySettings?.facebook_url && (
                  <a
                    href={companySettings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-navy-900/90 border border-navy-700/80 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/50 hover:bg-navy-800 transition shadow-sm"
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
                    className="w-8 h-8 rounded-lg bg-navy-900/90 border border-navy-700/80 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/50 hover:bg-navy-800 transition shadow-sm"
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
                    className="w-8 h-8 rounded-lg bg-navy-900/90 border border-navy-700/80 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/50 hover:bg-navy-800 transition shadow-sm"
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
                    className="w-8 h-8 rounded-lg bg-navy-900/90 border border-navy-700/80 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/50 hover:bg-navy-800 transition shadow-sm"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {/* Always include direct WhatsApp in social row */}
                <a
                  href={WA_FOOTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-600 transition shadow-sm"
                  aria-label="WhatsApp Direct"
                  title="WhatsApp 0569919792"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="border-t border-navy-900 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('quickLinks')}
              className="w-full flex items-center justify-between md:cursor-default text-left group"
              aria-expanded={openSections.quickLinks}
            >
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
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
                      className="text-slate-400 hover:text-gold-400 transition flex items-center gap-2 group py-1 md:py-0"
                    >
                      <ArrowRight className="w-3 h-3 text-gold-500/50 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Our Services */}
          <div className="border-t border-navy-900 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('services')}
              className="w-full flex items-center justify-between md:cursor-default text-left group"
              aria-expanded={openSections.services}
            >
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
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
                        className="text-slate-400 hover:text-gold-400 transition flex items-center gap-2 group line-clamp-1 py-1 md:py-0"
                      >
                        <ArrowRight className="w-3 h-3 text-gold-500/50 group-hover:text-gold-400 group-hover:translate-x-1 transition-all shrink-0" />
                        <span className="truncate">{service.name}</span>
                      </Link>
                    </li>
                  ))}
                  {services.length > 7 && (
                    <li className="pt-1.5">
                      <Link
                        href="/services"
                        className="text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1.5 py-1 md:py-0 transition"
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

          {/* Column 4: Contact & Office */}
          <div className="border-t border-navy-900 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('contact')}
              className="w-full flex items-center justify-between md:cursor-default text-left group"
              aria-expanded={openSections.contact}
            >
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
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

              {/* Dedicated WhatsApp Row */}
              <div className="flex items-center gap-2.5 text-slate-300 py-1 md:py-0">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={WA_FOOTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition flex items-center gap-1.5 group"
                >
                  <span className="font-medium">Chat on WhatsApp</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white transition">Chat</span>
                </a>
              </div>

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

        {/* 4. Bottom Copyright & Ekodrix Signature */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ALVERIC Technical Contracting LLC. All Rights Reserved.</p>

          <div className="flex items-center gap-6">
            <p className="text-[11px] text-slate-500">
              Crafted with excellence by{' '}
              <a
                href="https://ekodrix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-gold-400 font-medium transition"
              >
                ekodrix
              </a>
            </p>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-800 hover:border-gold-500/50 flex items-center justify-center text-slate-400 hover:text-gold-400 transition shadow-sm"
              aria-label="Scroll to top"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

