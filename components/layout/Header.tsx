'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CompanySettings, Service } from '@/types/database';
import { AlvericLogo } from '@/components/ui/AlvericLogo';
import { ChevronDown, Menu, X, ArrowRight, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  companySettings?: CompanySettings | null;
  services?: Service[];
}

export function Header({ companySettings, services = [] }: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services', hasDropdown: true },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const primaryPhone = companySettings?.phone_primary;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 w-full bg-white border-b transition-[box-shadow,border-color] duration-200',
        isScrolled
          ? 'shadow-md border-slate-200'
          : 'border-slate-100'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="shrink-0 flex items-center">
          <AlvericLogo
            logoUrl={companySettings?.logo_media?.secure_url}
            variant="dark"
            size="xl"
            showTagline={false}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 shrink-0">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            if (link.hasDropdown) {
              return (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-semibold transition relative',
                      isActive
                        ? 'text-navy-900 font-bold'
                        : 'text-navy-900/80 hover:text-navy-900'
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-slate-500" />
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold-500 rounded-full" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {servicesDropdownOpen && services.length > 0 && (
                    <div className="absolute left-0 top-full pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 overflow-hidden">
                        <div className="px-3 py-2 border-b border-slate-100">
                          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                            Our Core Services
                          </span>
                        </div>
                        <div className="max-h-80 overflow-y-auto py-1">
                          {services.map((service) => (
                            <Link
                              key={service.id}
                              href={`/services/${service.slug}`}
                              className="flex items-center px-3 py-2 text-xs font-medium text-navy-900 hover:text-gold-600 hover:bg-slate-50 rounded-lg transition"
                            >
                              {service.name}
                            </Link>
                          ))}
                        </div>
                        <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-b-lg">
                          <Link
                            href="/services"
                            className="flex items-center justify-between text-xs font-semibold text-navy-900 hover:text-gold-600 transition"
                          >
                            <span>View All Services</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-semibold transition relative',
                  isActive
                    ? 'text-navy-900 font-bold'
                    : 'text-navy-900/80 hover:text-navy-900'
                )}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Get a Quote */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {primaryPhone && (
            <a
              href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-xs font-bold text-navy-900 hover:text-gold-600 transition"
            >
              <Phone className="w-3.5 h-3.5 text-gold-500" />
              <span>{primaryPhone}</span>
            </a>
          )}
          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-navy-900 text-white text-sm font-bold shadow-md hover:bg-navy-800 transition group"
          >
            <span>Get a Quote</span>
            <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-navy-900 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <div key={link.href}>
                {link.hasDropdown ? (
                  <div>
                    {/* Services row: link + chevron toggle */}
                    <div className="flex items-center">
                      <Link
                        href={link.href}
                        className={cn(
                          'flex-1 px-3 py-2.5 rounded-l-lg text-base font-semibold transition',
                          isActive
                            ? 'bg-navy-50 text-navy-900 font-bold border-l-4 border-gold-500'
                            : 'text-navy-900/80 hover:bg-slate-50 hover:text-navy-900'
                        )}
                      >
                        {link.label}
                      </Link>
                      {services.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen((prev) => !prev)}
                          aria-label="Toggle services submenu"
                          className={cn(
                            'px-3 py-2.5 rounded-r-lg transition flex items-center',
                            isActive
                              ? 'bg-navy-50 text-navy-900'
                              : 'text-navy-900/60 hover:bg-slate-50 hover:text-navy-900'
                          )}
                        >
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 transition-transform duration-200',
                              mobileServicesOpen ? 'rotate-180' : ''
                            )}
                          />
                        </button>
                      )}
                    </div>

                    {/* Collapsible services sub-list */}
                    {mobileServicesOpen && services.length > 0 && (
                      <div className="pl-4 pr-2 py-1.5 mt-1 space-y-0.5 bg-slate-50 rounded-xl border border-slate-100">
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.slug}`}
                            className="flex items-center gap-2 py-2 px-2 text-xs font-medium text-navy-900/80 hover:text-gold-600 rounded-lg hover:bg-white transition"
                          >
                            <span className="w-1 h-1 rounded-full bg-gold-500 shrink-0" />
                            {service.name}
                          </Link>
                        ))}
                        <Link
                          href="/services"
                          className="flex items-center gap-1.5 px-2 py-2 text-xs font-bold text-gold-600 hover:text-gold-700 transition"
                        >
                          <span>View All Services</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'block px-3 py-2.5 rounded-lg text-base font-semibold transition',
                      isActive
                        ? 'bg-navy-50 text-navy-900 font-bold border-l-4 border-gold-500'
                        : 'text-navy-900/80 hover:bg-slate-50 hover:text-navy-900'
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            );
          })}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {primaryPhone && (
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-navy-900"
              >
                <Phone className="w-4 h-4 text-gold-500" />
                <span>Call Us: {primaryPhone}</span>
              </a>
            )}
            <Link
              href="/quote"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-navy-900 text-white font-bold text-sm shadow hover:bg-navy-800 transition"
            >
              <span>Get a Free Quote</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
