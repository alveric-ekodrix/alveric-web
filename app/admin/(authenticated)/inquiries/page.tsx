'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ContactSubmission } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, MessageSquare, Search, Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const supabase = createClient();

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setInquiries(data);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: ContactSubmission['status']) {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    await supabase.from('contact_submissions').update({ status: newStatus }).eq('id', id);
  }

  const filtered = inquiries.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.full_name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      (item.subject && item.subject.toLowerCase().includes(q)) ||
      item.message.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusLabels: Record<string, { label: string; cls: string }> = {
    new: { label: 'New', cls: 'bg-blue-100 text-blue-800' },
    read: { label: 'Read', cls: 'bg-slate-100 text-slate-600' },
    replied: { label: 'Replied', cls: 'bg-emerald-100 text-emerald-800' },
    closed: { label: 'Closed', cls: 'bg-slate-50 text-slate-400' },
  };

  const allStatuses = ['new', 'read', 'replied', 'closed'];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-navy-900">Contact Inquiries</h1>
        <p className="text-xs text-slate-500">
          Review general inquiries submitted via the contact form. Respond and update pipeline status.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-gold-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-semibold text-navy-900 w-full sm:w-auto"
        >
          <option value="all">All Statuses</option>
          {allStatuses.map((s) => (
            <option key={s} value={s}>
              {s.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-navy-900 mr-2" />
          <span>Loading inquiries...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-navy-900">No Inquiries Found</h2>
          <p className="text-xs text-slate-500">
            When visitors submit the contact form, their messages will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const status = statusLabels[item.status] || statusLabels['new'];
            return (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-navy-900">{item.full_name}</span>
                    {item.subject && (
                      <span className="text-xs text-slate-500 block">Re: {item.subject}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                      className={`px-2 py-1 rounded text-[11px] font-bold uppercase border-0 cursor-pointer ${status.cls}`}
                    >
                      {allStatuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>

                {/* Message Content */}
                <p className="text-xs text-slate-700 bg-slate-50 rounded-xl p-4 leading-relaxed">
                  {item.message}
                </p>

                {/* Contact Actions */}
                <div className="flex items-center gap-4 pt-1">
                  <a
                    href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject || 'Your Inquiry')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 text-white text-[11px] font-bold hover:bg-navy-800 transition"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{item.email}</span>
                  </a>
                  {item.phone && (
                    <a
                      href={`tel:${item.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-50 transition"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{item.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
