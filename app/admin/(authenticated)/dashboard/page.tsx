import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import {
  FolderKanban,
  Wrench,
  Inbox,
  Briefcase,
  Users,
  MessageSquareQuote,
  Plus,
  ArrowRight,
  Eye,
} from 'lucide-react';

export const revalidate = 0; // Dynamic data for admin dashboard

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Live queries for stats from Supabase
  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: totalServices },
    { count: publishedServices },
    { count: newInquiries },
    { count: activeJobs },
    { count: totalApplications },
    { count: totalTestimonials },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('project_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('job_applications').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
  ]);

  // 2. Fetch recent inquiries
  const { data: recentInquiries } = await supabase
    .from('project_inquiries')
    .select('*, service:services(name)')
    .order('created_at', { ascending: false })
    .limit(5);

  // 3. Fetch recent applications
  const { data: recentApplications } = await supabase
    .from('job_applications')
    .select('*, job:jobs(title)')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    {
      title: 'Projects',
      value: totalProjects || 0,
      subValue: `${publishedProjects || 0} published`,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'border-blue-500',
    },
    {
      title: 'Services',
      value: totalServices || 0,
      subValue: `${publishedServices || 0} active`,
      icon: Wrench,
      href: '/admin/services',
      color: 'border-amber-500',
    },
    {
      title: 'New Inquiries',
      value: newInquiries || 0,
      subValue: 'pending review',
      icon: Inbox,
      href: '/admin/inquiries',
      color: 'border-emerald-500',
    },
    {
      title: 'Active Jobs',
      value: activeJobs || 0,
      subValue: `${totalApplications || 0} applicants`,
      icon: Briefcase,
      href: '/admin/careers',
      color: 'border-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
            Control Center Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your public website content, services, project portfolio, and inquiries in real-time.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </Link>
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-navy-900 text-xs font-bold hover:bg-slate-50 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </Link>
          <Link
            href="/admin/careers/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-navy-900 text-xs font-bold hover:bg-slate-50 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Job</span>
          </Link>
        </div>
      </div>

      {/* Live Calculated Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-navy-900">
                  {stat.value}
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  {stat.subValue}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 text-navy-900 flex items-center justify-center group-hover:bg-navy-900 group-hover:text-gold-400 transition">
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Section: Recent Inquiries & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quote Inquiries */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
              Recent Quote Inquiries
            </h2>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 flex-1">
            {!recentInquiries || recentInquiries.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No quote inquiries received yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="pt-3 first:pt-0 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy-900">{inquiry.client_name}</p>
                      <p className="text-[11px] text-slate-400">{inquiry.client_email} • {formatDate(inquiry.created_at)}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      inquiry.status === 'new' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Job Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-sm font-black text-navy-900 uppercase tracking-wider">
              Recent Career Applications
            </h2>
            <Link
              href="/admin/applications"
              className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-6 flex-1">
            {!recentApplications || recentApplications.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No career applications received yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 space-y-3">
                {recentApplications.map((app) => (
                  <div key={app.id} className="pt-3 first:pt-0 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy-900">{app.full_name}</p>
                      <p className="text-[11px] text-slate-400">
                        {app.job?.title || 'General'} • {formatDate(app.created_at)}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
