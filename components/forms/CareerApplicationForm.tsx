'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { jobApplicationSchema } from '@/lib/validations';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

interface CareerApplicationFormProps {
  jobId: string;
  jobTitle: string;
}

export function CareerApplicationForm({ jobId, jobTitle }: CareerApplicationFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverMessage, setCoverMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const payload = {
      job_id: jobId,
      full_name: fullName,
      email,
      phone,
      cover_message: coverMessage,
    };

    const parseResult = jobApplicationSchema.safeParse(payload);
    if (!parseResult.success) {
      setErrorMessage(parseResult.error.errors[0]?.message || 'Please verify your inputs');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('job_applications').insert([
        {
          job_id: jobId,
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          cover_message: coverMessage.trim(),
          status: 'new',
        },
      ]);

      if (error) {
        throw new Error(error.message || 'Failed to submit application');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Something went wrong while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-emerald-900">Application Submitted</h3>
        <p className="text-xs sm:text-sm text-emerald-700 max-w-sm mx-auto">
          Thank you for your interest in joining Alveric Technical Contracting LLC as <strong>{jobTitle}</strong>. Our HR department will review your qualifications and contact you.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-navy-900 mb-1">
          Full Name <span className="text-gold-500">*</span>
        </label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. John Doe"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Email Address <span className="text-gold-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. name@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Phone Number <span className="text-gold-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +971 50 123 4567"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-navy-900 mb-1">
          Cover Message / Relevant Experience Summary
        </label>
        <textarea
          rows={4}
          value={coverMessage}
          onChange={(e) => setCoverMessage(e.target.value)}
          placeholder="Describe your technical certifications, years of experience, and notice period..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-navy-900 text-white font-bold text-sm hover:bg-navy-800 disabled:opacity-50 transition shadow"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Application...</span>
          </>
        ) : (
          <>
            <span>Submit Application</span>
            <Send className="w-4 h-4 text-gold-400" />
          </>
        )}
      </button>
    </form>
  );
}
