'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/database';
import { CldImageWrapper } from '@/components/media/CldImageWrapper';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Building2,
} from 'lucide-react';

interface HomeProjectsSectionProps {
  projects: Project[];
}

export function HomeProjectsSection({
  projects,
}: HomeProjectsSectionProps) {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-7 flex items-end justify-between gap-6">

          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-500">
              OUR PROJECTS
            </span>

            <h2 className="mt-1 text-2xl font-black leading-tight tracking-tight text-navy-900 sm:text-3xl">
              Delivering Outstanding Results
            </h2>

            <p className="mt-2 max-w-md text-[11px] leading-relaxed text-slate-500 sm:text-xs">
              We take pride in every project we deliver. From concept to completion,
              we ensure excellence at every step.
            </p>
          </div>

          {/* Top Right Controls */}
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/projects"
              className="hidden items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-[10px] font-bold text-navy-900 transition hover:border-navy-900 sm:inline-flex"
            >
              <span>View All Projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                aria-label="Previous projects"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-navy-900 hover:text-navy-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                aria-label="Next projects"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-navy-900 hover:text-navy-900"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View All */}
        <div className="mb-6 sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-[10px] font-bold text-navy-900"
          >
            View All Projects
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Projects */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <Building2 className="mb-3 h-7 w-7 text-slate-400" />
            <h3 className="text-sm font-bold text-navy-900">
              No projects available at the moment.
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Portfolio entries are populated through the administrator project manager.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-[1.35/1] w-full overflow-hidden bg-slate-100 sm:aspect-[1.4/1]">
                  <CldImageWrapper
                    src={
                      project.thumbnail_media?.secure_url ||
                      project.featured_image?.secure_url
                    }
                    alt={project.title}
                    fill
                    fallbackText="Project image pending"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Metadata */}
                <div className="p-2.5 sm:p-3">
                  <h3 className="truncate text-[10px] font-extrabold leading-tight text-navy-900 transition-colors group-hover:text-gold-600 sm:text-xs">
                    {project.title}
                  </h3>

                  {project.location && (
                    <div className="mt-1 flex min-w-0 items-center gap-1 text-[9px] text-slate-500 sm:text-[10px]">
                      <MapPin className="h-2.5 w-2.5 shrink-0 text-slate-400 sm:h-3 sm:w-3" />
                      <span className="truncate">{project.location}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}