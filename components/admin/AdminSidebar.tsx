'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AlvericLogo } from '@/components/ui/AlvericLogo';
import {
  LayoutDashboard,
  Home,
  Info,
  CheckSquare,
  Building,
  Wrench,
  FolderKanban,
  Tags,
  MessageSquareQuote,
  Briefcase,
  Users,
  Inbox,

  LogOut,
  Menu,
  X,
  Sparkles,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  const navSections = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Homepage & Content',
      items: [
        { label: 'Homepage Hero & CTA', href: '/admin/homepage', icon: Home },
        { label: 'Home About & Showcase', href: '/admin/home-about', icon: Sparkles },
        { label: 'About Us Page', href: '/admin/about', icon: Info },
        { label: 'Company Settings', href: '/admin/settings', icon: Building },
        { label: 'Contact & Social Links', href: '/admin/contact', icon: Phone },
      ],
    },
    {
      title: 'Portfolio & Offerings',
      items: [
        { label: 'Services', href: '/admin/services', icon: Wrench },
        { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
      ],
    },
    {
      title: 'Inquiries',
      items: [
        { label: 'Quote Inquiries', href: '/admin/inquiries', icon: Inbox },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-navy-950 text-white border-b border-navy-800 sticky top-0 z-40">
        <AlvericLogo variant="light" showTagline={false} />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-navy-950 text-white flex flex-col border-r border-navy-800 transition-transform duration-200 lg:translate-x-0 lg:static',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header / Brand */}
        <div className="p-5 border-b border-navy-800 flex items-center justify-between">
          <AlvericLogo variant="light" showTagline={false} />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {section.title}
              </span>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition',
                      isActive
                        ? 'bg-gold-500 text-navy-950 font-bold shadow'
                        : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-navy-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}
