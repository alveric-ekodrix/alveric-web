'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const STANDARD_SERVICE_BENEFITS = [
  'Fully compliant with UAE Municipality & Civil Defense regulations',
  'Certified engineers and skilled technicians dedicated to your project',
  'Rigorous quality control with premium specification materials',
  'Milestone-driven project scheduling with guaranteed on-time delivery',
  'Transparent itemized pricing with zero hidden contractor fees',
  'Comprehensive post-handover warranty and maintenance support',
];

export const STANDARD_SERVICE_PROCESS_STEPS = [
  {
    title: 'Site Survey & Engineering Assessment',
    description:
      'Our technical specialists inspect the site premises, evaluate structural requirements, and record precise measurements for exact scoping.',
  },
  {
    title: 'Detailed Planning & Material Specification',
    description:
      'We draft comprehensive execution schedules, select approved materials conforming to UAE standards, and align with all project stakeholders.',
  },
  {
    title: 'Precision On-Site Execution & Supervision',
    description:
      'Experienced contracting crews execute work under direct senior engineering supervision, maintaining strict safety and cleanliness protocols.',
  },
  {
    title: 'Quality Inspection, Commissioning & Handover',
    description:
      'Rigorous multi-point testing is completed followed by client walkthrough, certification documentation, and official project handover.',
  },
];

export function ApplyStandardContentButton() {
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleApplyToAll() {
    const confirmed = window.confirm(
      'Are you sure you want to apply standard technical benefits and the 4-step execution process to all services in the database?'
    );
    if (!confirmed) return;

    setIsApplying(true);
    setStatus('idle');
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('services')
        .update({
          benefits: STANDARD_SERVICE_BENEFITS,
          process_steps: STANDARD_SERVICE_PROCESS_STEPS,
        })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      setStatus('success');
      router.refresh();
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update all services');
      setStatus('error');
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {status === 'success' && (
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Standard process &amp; benefits applied to all services!
        </span>
      )}
      {status === 'error' && (
        <span className="inline-flex items-center gap-1.5 text-xs text-red-700 font-bold bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
          {errorMessage}
        </span>
      )}

      <button
        type="button"
        onClick={handleApplyToAll}
        disabled={isApplying}
        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gold-300 bg-gold-50/80 hover:bg-gold-100 text-navy-950 text-xs font-bold transition shadow-xs disabled:opacity-50"
      >
        {isApplying ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-600" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
        )}
        <span>Apply Standard Process &amp; Benefits to All Services</span>
      </button>
    </div>
  );
}
