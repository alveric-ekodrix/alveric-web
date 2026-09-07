'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { contactSubmissionSchema } from '@/lib/validations';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const payload = {
      full_name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    const parseResult = contactSubmissionSchema.safeParse(payload);
    if (!parseResult.success) {
      setErrorMessage(parseResult.error.errors[0]?.message || 'Please check form inputs');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('contact_submissions').insert([
        {
          full_name: payload.full_name,
          email: payload.email,
          phone: payload.phone || null,
          subject: payload.subject || null,
          message: payload.message,
          status: 'new',
        },
      ]);

      if (error) {
        throw new Error(error.message || 'Failed to submit contact form');
      }

      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send your message. Please try again.');
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
        <h3 className="text-lg font-black text-emerald-900">Message Received</h3>
        <p className="text-xs sm:text-sm text-emerald-700 max-w-sm mx-auto">
          Thank you for contacting Alveric Technical Contracting LLC. A contracting coordinator will review your inquiry and respond promptly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition"
        >
          Send Another Message
        </button>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Your Name <span className="text-gold-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Robert Smith"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Email Address <span className="text-gold-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. name@company.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 056 991 9792"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-900 mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Facility MEP Maintenance Contract"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-navy-900 mb-1">
          Your Message <span className="text-gold-500">*</span>
        </label>
        <textarea
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe your facility requirements or contracting scope..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-navy-900 text-white font-bold text-sm hover:bg-navy-800 disabled:opacity-50 transition shadow"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <Send className="w-4 h-4 text-gold-400" />
          </>
        )}
      </button>
    </form>
  );
}
