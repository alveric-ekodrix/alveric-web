import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedProjectBySlug, getCompanySettings } from '@/lib/data/public';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import { formatDate } from '@/lib/utils';
import { MapPin, Calendar, User, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found | Alveric Technical Contracting LLC' };
  }

  return {
    title: `${project.seo_title || project.title} | Alveric Technical Contracting LLC`,
    description: project.seo_description || project.short_description || undefined,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const [project, companySettings] = await Promise.all([
    getPublishedProjectBySlug(slug),
    getCompanySettings(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="w-full">
      {/* Project Hero Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            {project.category && (
              <span className="inline-block px-3 py-1 rounded bg-gold-500/20 text-gold-400 text-xs font-extrabold uppercase tracking-wider border border-gold-500/30">
                {project.category.name}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {project.title}
            </h1>
            {project.short_description && (
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {project.short_description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content & Metadata Bar */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200 mb-12">
            {project.client_name && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-gold-500" />
                  <span>Client</span>
                </div>
                <p className="text-sm font-bold text-navy-900">{project.client_name}</p>
              </div>
            )}

            {project.location && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" />
                  <span>Location</span>
                </div>
                <p className="text-sm font-bold text-navy-900">{project.location}</p>
              </div>
            )}

            {project.completion_date && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-gold-500" />
                  <span>Completed</span>
                </div>
                <p className="text-sm font-bold text-navy-900">{formatDate(project.completion_date)}</p>
              </div>
            )}

            {project.category && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-gold-500" />
                  <span>Sector</span>
                </div>
                <p className="text-sm font-bold text-navy-900">{project.category.name}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-10">
              {/* Featured Image */}
              <div className="relative h-[360px] sm:h-[480px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
                <CldImageWrapper
                  src={project.featured_image?.secure_url || project.thumbnail_media?.secure_url}
                  alt={project.title}
                  fill
                  fallbackText="Project showcase image pending upload"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Project Description */}
              {project.description && (
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-navy-900">Project Overview</h2>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                    {project.description}
                  </div>
                </div>
              )}

              {/* Challenge / Solution / Results Grid */}
              {(project.challenge || project.solution || project.results) && (
                <div className="space-y-6 pt-4 border-t border-slate-200">
                  {project.challenge && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <h3 className="text-base font-black text-navy-900 mb-2">The Engineering Challenge</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{project.challenge}</p>
                    </div>
                  )}

                  {project.solution && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <h3 className="text-base font-black text-navy-900 mb-2">Our Technical Solution</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{project.solution}</p>
                    </div>
                  )}

                  {project.results && (
                    <div className="bg-gold-50/50 p-6 rounded-2xl border border-gold-200">
                      <h3 className="text-base font-black text-navy-900 mb-2">Project Results & Impact</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">{project.results}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar CTA */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-navy-950 text-white border border-navy-800 shadow-xl space-y-4 sticky top-24">
                <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
                  PROJECT INQUIRIES
                </span>
                <h3 className="text-xl font-black leading-snug">
                  Have a Similar Technical Requirement?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our team brings proven contracting methodologies and certified manpower to every assignment.
                </p>

                <div className="space-y-3 pt-2">
                  <Link
                    href={`/quote?category=${project.category_id || ''}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-wider hover:bg-gold-400 transition shadow"
                  >
                    <span>Request Similar Project Quote</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>

                  <Link
                    href="/projects"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20"
                  >
                    <span>Back to All Projects</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
