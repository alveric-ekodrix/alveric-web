'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ContactSubmission, ProjectInquiry } from '@/types/database';
import { formatDate } from '@/lib/utils';
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  Loader2,
  Inbox,
  FileText,
  Building,
  MapPin,
  DollarSign,
  Send,
} from 'lucide-react';

export default function AdminInquiriesPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'quote'>('contact');

  // Contact Submissions state
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([]);
  const [isLoadingContact, setIsLoadingContact] = useState(true);

  // Quote Requests state
  const [quoteInquiries, setQuoteInquiries] = useState<ProjectInquiry[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const supabase = createClient();

  useEffect(() => {
    loadContactInquiries();
    loadQuoteInquiries();
  }, []);

  async function loadContactInquiries() {
    setIsLoadingContact(true);
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setInquiries(data);
      }
    } catch (err) {
      console.error('Failed to load contact submissions:', err);
    } finally {
      setIsLoadingContact(false);
    }
  }

  async function loadQuoteInquiries() {
    setIsLoadingQuotes(true);
    try {
      const { data, error } = await supabase
        .from('project_inquiries')
        .select('*, service:services(name), category:project_categories(name)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setQuoteInquiries(data);
      }
    } catch (err) {
      console.error('Failed to load quote inquiries:', err);
    } finally {
      setIsLoadingQuotes(false);
    }
  }

  async function handleContactStatusChange(id: string, newStatus: ContactSubmission['status']) {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    await supabase.from('contact_submissions').update({ status: newStatus }).eq('id', id);
  }

  async function handleQuoteStatusChange(id: string, newStatus: ProjectInquiry['status']) {
    setQuoteInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    await supabase.from('project_inquiries').update({ status: newStatus }).eq('id', id);
  }

  // Filtered contact submissions
  const filteredContact = inquiries.filter((item) => {
    const q = searchQuery.toLowerCase();
    const senderName = item.name || item.full_name || '';
    const matchesSearch =
      senderName.toLowerCase().includes(q) ||
      (item.email || '').toLowerCase().includes(q) ||
      (item.subject && item.subject.toLowerCase().includes(q)) ||
      (item.message || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered quote requests
  const filteredQuotes = quoteInquiries.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (item.client_name || '').toLowerCase().includes(q) ||
      (item.company_name || '').toLowerCase().includes(q) ||
      (item.client_email || '').toLowerCase().includes(q) ||
      (item.project_brief || '').toLowerCase().includes(q) ||
      (item.location || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const contactStatusLabels: Record<string, { label: string; cls: string }> = {
    new: { label: 'New', cls: 'bg-blue-100 text-blue-800' },
    read: { label: 'Read', cls: 'bg-slate-100 text-slate-600' },
    replied: { label: 'Replied', cls: 'bg-emerald-100 text-emerald-800' },
  };
  const contactStatuses = ['new', 'read', 'replied'];

  const quoteStatusLabels: Record<string, { label: string; cls: string }> = {
    new: { label: 'New', cls: 'bg-blue-100 text-blue-800' },
    contacted: { label: 'Contacted', cls: 'bg-indigo-100 text-indigo-800' },
    in_discussion: { label: 'In Discussion', cls: 'bg-amber-100 text-amber-800' },
    converted: { label: 'Converted', cls: 'bg-emerald-100 text-emerald-800' },
    closed: { label: 'Closed', cls: 'bg-slate-100 text-slate-600' },
  };
  const quoteStatuses = ['new', 'contacted', 'in_discussion', 'converted', 'closed'];

  const isLoading = activeTab === 'contact' ? isLoadingContact : isLoadingQuotes;
  const currentStatuses = activeTab === 'contact' ? contactStatuses : quoteStatuses;

  const newContactCount = inquiries.filter((i) => i.status === 'new').length;
  const newQuoteCount = quoteInquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-navy-900">Inquiries & Leads</h1>
        <p className="text-xs text-slate-500">
          Review incoming messages and quote requests. Respond and update statuses.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('contact');
            setStatusFilter('all');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition -mb-[1px] ${
            activeTab === 'contact'
              ? 'border-navy-900 text-navy-900'
              : 'border-transparent text-slate-400 hover:text-navy-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Online Inquiries</span>
          {newContactCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-600 text-white font-black">
              {newContactCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('quote');
            setStatusFilter('all');
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition -mb-[1px] ${
            activeTab === 'quote'
              ? 'border-navy-900 text-navy-900'
              : 'border-transparent text-slate-400 hover:text-navy-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Quote Requests</span>
          {newQuoteCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-black">
              {newQuoteCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === 'contact'
                ? 'Search by name, email, or subject...'
                : 'Search by client, company, email, or details...'
            }
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
          {currentStatuses.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-navy-900 mr-2" />
          <span>Loading inquiries...</span>
        </div>
      ) : activeTab === 'contact' ? (
        /* Contact Submissions Tab */
        filteredContact.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h2 className="text-base font-bold text-navy-900">No Online Inquiries Found</h2>
            <p className="text-xs text-slate-500">
              When visitors submit the contact form, their inquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContact.map((item) => {
              const status = contactStatusLabels[item.status] || contactStatusLabels['new'];
              const senderName = item.name || item.full_name || 'Inquirer';
              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-navy-900">{senderName}</span>
                      {item.subject && (
                        <span className="text-xs text-slate-500 block font-medium">Re: {item.subject}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={item.status}
                        onChange={(e) => handleContactStatusChange(item.id, e.target.value as any)}
                        className={`px-2 py-1 rounded text-[11px] font-bold uppercase border-0 cursor-pointer ${status.cls}`}
                      >
                        {contactStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <p className="text-xs text-slate-700 bg-slate-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
                    {item.message}
                  </p>

                  {/* Contact Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject || 'Your Inquiry to Alveric')}`}
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
        )
      ) : (
        /* Quote Requests Tab */
        filteredQuotes.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center max-w-lg mx-auto space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h2 className="text-base font-bold text-navy-900">No Quote Requests Found</h2>
            <p className="text-xs text-slate-500">
              When clients submit project quotation inquiries, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((item) => {
              const status = quoteStatusLabels[item.status] || quoteStatusLabels['new'];
              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-navy-900">{item.client_name}</span>
                        {item.company_name && (
                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" />
                            {item.company_name}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-500">
                        {item.service?.name && (
                          <span className="px-2 py-0.5 rounded bg-gold-50 text-gold-800 text-[10px] font-bold border border-gold-200">
                            {item.service.name}
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.location}
                          </span>
                        )}
                        {item.budget_range && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-500">
                            <DollarSign className="w-3 h-3 text-slate-400" />
                            {item.budget_range}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={item.status}
                        onChange={(e) => handleQuoteStatusChange(item.id, e.target.value as any)}
                        className={`px-2 py-1 rounded text-[11px] font-bold uppercase border-0 cursor-pointer ${status.cls}`}
                      >
                        {quoteStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Project Brief */}
                  <p className="text-xs text-slate-700 bg-slate-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
                    {item.project_brief}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={`mailto:${item.client_email}?subject=Re: Quotation Request - Alveric Technical Contracting`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 text-white text-[11px] font-bold hover:bg-navy-800 transition"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{item.client_email}</span>
                    </a>
                    {item.client_phone && (
                      <a
                        href={`tel:${item.client_phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-50 transition"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{item.client_phone}</span>
                      </a>
                    )}
                    {item.whatsapp && (
                      <a
                        href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 text-[11px] font-bold hover:bg-emerald-50 transition"
                      >
                        <Send className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
