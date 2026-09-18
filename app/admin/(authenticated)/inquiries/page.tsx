'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ContactSubmission, ProjectInquiry } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { useAdminToast } from '@/components/admin/AdminToastProvider';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  Loader2,
  FileText,
  Building,
  MapPin,
  DollarSign,
  Send,
  Trash2,
  Eye,
  X,
  Clock,
  User,
  Calendar,
  Layers,
  ChevronRight,
  Copy,
  Check,
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

  // Full view detail modal states
  const [viewingContact, setViewingContact] = useState<ContactSubmission | null>(null);
  const [viewingQuote, setViewingQuote] = useState<ProjectInquiry | null>(null);

  // Deletion modal state
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'contact' | 'quote';
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Phone copy state
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const supabase = createClient();
  const { showToast } = useAdminToast();

  const handlePhoneAction = (phone: string) => {
    if (!phone) return;
    
    // Copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      showToast(`Phone number "${phone}" copied to clipboard.`, 'success');
      setTimeout(() => {
        setCopiedPhone(null);
      }, 2500);
    }

    // On mobile devices, trigger native dialer
    if (typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
    }
  };

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
    if (viewingContact?.id === id) {
      setViewingContact((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    await supabase.from('contact_submissions').update({ status: newStatus }).eq('id', id);
    showToast('Inquiry status updated.', 'success');
  }

  async function handleQuoteStatusChange(id: string, newStatus: ProjectInquiry['status']) {
    setQuoteInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (viewingQuote?.id === id) {
      setViewingQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    await supabase.from('project_inquiries').update({ status: newStatus }).eq('id', id);
    showToast('Quote request status updated.', 'success');
  }

  async function handleDeleteConfirm() {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      if (itemToDelete.type === 'contact') {
        const { error } = await supabase
          .from('contact_submissions')
          .delete()
          .eq('id', itemToDelete.id);

        if (error) throw error;

        setInquiries((prev) => prev.filter((item) => item.id !== itemToDelete.id));
        if (viewingContact?.id === itemToDelete.id) {
          setViewingContact(null);
        }
        showToast(`Inquiry from "${itemToDelete.name}" deleted successfully.`, 'success');
      } else {
        const { error } = await supabase
          .from('project_inquiries')
          .delete()
          .eq('id', itemToDelete.id);

        if (error) throw error;

        setQuoteInquiries((prev) => prev.filter((item) => item.id !== itemToDelete.id));
        if (viewingQuote?.id === itemToDelete.id) {
          setViewingQuote(null);
        }
        showToast(`Quote request from "${itemToDelete.name}" deleted successfully.`, 'success');
      }

      setItemToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete inquiry:', err);
      showToast(err?.message || 'Failed to delete. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
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
        <h1 className="text-2xl font-black text-navy-900">Inquiries &amp; Leads</h1>
        <p className="text-xs text-slate-500">
          Review incoming messages and quote requests. Click View to inspect full details or delete entries.
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
          <div className="space-y-3">
            {filteredContact.map((item) => {
              const status = contactStatusLabels[item.status] || contactStatusLabels['new'];
              const senderName = item.name || item.full_name || 'Inquirer';
              return (
                <div
                  key={item.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Name, Subject, and Contact Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-sm text-navy-900 truncate">{senderName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${status.cls}`}>
                        {status.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    {item.subject && (
                      <p className="text-xs text-slate-500 truncate font-medium">
                        Subject: <span className="text-slate-700">{item.subject}</span>
                      </p>
                    )}

                    {/* Contact Links Bar */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                      <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                        <Mail className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                        <span>{item.email}</span>
                      </span>

                      {item.phone && (
                        <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                          <Phone className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          <span>{item.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewingContact(item)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold-400" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setItemToDelete({
                          type: 'contact',
                          id: item.id,
                          name: senderName,
                        })
                      }
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
          <div className="space-y-3">
            {filteredQuotes.map((item) => {
              const status = quoteStatusLabels[item.status] || quoteStatusLabels['new'];
              return (
                <div
                  key={item.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Name, Company, and Contact Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-black text-sm text-navy-900">{item.client_name}</span>
                      {item.company_name && (
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          {item.company_name}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${status.cls}`}>
                        {status.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    {/* Scope / Location / Budget */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
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
                    </div>

                    {/* Contact Links Bar */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                      <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                        <Mail className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                        <span>{item.client_email}</span>
                      </span>

                      {item.client_phone && (
                        <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                          <Phone className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          <span>{item.client_phone}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewingQuote(item)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold-400" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setItemToDelete({
                          type: 'quote',
                          id: item.id,
                          name: item.client_name,
                        })
                      }
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Quote Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ========================================================= */}
      {/* DETAIL MODAL: ONLINE INQUIRY                              */}
      {/* ========================================================= */}
      {viewingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setViewingContact(null)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 overflow-hidden animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-navy-900 tracking-tight">
                    Online Inquiry Details
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Received {formatDate(viewingContact.created_at)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingContact(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-5 py-5 pr-1 flex-1 text-xs">
              {/* Sender & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Sender Name
                  </span>
                  <span className="font-bold text-sm text-navy-900">
                    {viewingContact.name || viewingContact.full_name || 'Anonymous'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Inquiry Status
                  </span>
                  <select
                    value={viewingContact.status}
                    onChange={(e) =>
                      handleContactStatusChange(viewingContact.id, e.target.value as any)
                    }
                    className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase border border-slate-200 bg-white cursor-pointer"
                  >
                    {contactStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${viewingContact.email}`}
                    className="text-navy-900 font-semibold hover:text-gold-600 transition flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5 text-gold-500" />
                    <span>{viewingContact.email}</span>
                  </a>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Phone Number
                  </span>
                  {viewingContact.phone ? (
                    <button
                      type="button"
                      onClick={() => handlePhoneAction(viewingContact.phone!)}
                      className="group inline-flex items-center gap-1.5 text-navy-900 font-semibold hover:text-gold-600 transition text-left cursor-pointer"
                      title="Click to copy phone number"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold-500" />
                      <span>{viewingContact.phone}</span>
                      {copiedPhone === viewingContact.phone ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" /> Copied
                        </span>
                      ) : (
                        <span className="opacity-0 group-hover:opacity-100 transition text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                          <Copy className="w-3 h-3" /> Copy
                        </span>
                      )}
                    </button>
                  ) : (
                    <span className="text-slate-400">Not provided</span>
                  )}
                </div>
              </div>

              {/* Subject */}
              {viewingContact.subject && (
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                    Subject Line
                  </span>
                  <p className="text-xs font-bold text-navy-900 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    {viewingContact.subject}
                  </p>
                </div>
              )}

              {/* Full Message */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Full Message
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {viewingContact.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {viewingContact.phone && (
                  <a
                    href={`https://wa.me/${viewingContact.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}

                <a
                  href={`mailto:${viewingContact.email}?subject=Re: ${encodeURIComponent(viewingContact.subject || 'Your Inquiry to Alveric')}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply by Email</span>
                </a>

                {viewingContact.phone && (
                  <button
                    type="button"
                    onClick={() => handlePhoneAction(viewingContact.phone!)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                    title="Copy phone number"
                  >
                    {copiedPhone === viewingContact.phone ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Phone Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Phone</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setItemToDelete({
                      type: 'contact',
                      id: viewingContact.id,
                      name: viewingContact.name || viewingContact.full_name || 'Inquirer',
                    });
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setViewingContact(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DETAIL MODAL: QUOTE REQUEST                               */}
      {/* ========================================================= */}
      {viewingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setViewingQuote(null)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 overflow-hidden animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-navy-900 tracking-tight">
                    Quote Request Details
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Submitted {formatDate(viewingQuote.created_at)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingQuote(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-5 py-5 pr-1 flex-1 text-xs">
              {/* Client & Project Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Client Name
                  </span>
                  <span className="font-bold text-sm text-navy-900">
                    {viewingQuote.client_name}
                  </span>
                  {viewingQuote.company_name && (
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Company: {viewingQuote.company_name}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Request Status
                  </span>
                  <select
                    value={viewingQuote.status}
                    onChange={(e) =>
                      handleQuoteStatusChange(viewingQuote.id, e.target.value as any)
                    }
                    className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase border border-slate-200 bg-white cursor-pointer"
                  >
                    {quoteStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Client Email
                  </span>
                  <a
                    href={`mailto:${viewingQuote.client_email}`}
                    className="text-navy-900 font-semibold hover:text-gold-600 transition flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5 text-gold-500" />
                    <span>{viewingQuote.client_email}</span>
                  </a>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Phone / Contact
                  </span>
                  {viewingQuote.client_phone ? (
                    <button
                      type="button"
                      onClick={() => handlePhoneAction(viewingQuote.client_phone!)}
                      className="group inline-flex items-center gap-1.5 text-navy-900 font-semibold hover:text-gold-600 transition text-left cursor-pointer"
                      title="Click to copy phone number"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold-500" />
                      <span>{viewingQuote.client_phone}</span>
                      {copiedPhone === viewingQuote.client_phone ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" /> Copied
                        </span>
                      ) : (
                        <span className="opacity-0 group-hover:opacity-100 transition text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                          <Copy className="w-3 h-3" /> Copy
                        </span>
                      )}
                    </button>
                  ) : (
                    <span className="text-slate-400">Not provided</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Requested Service
                  </span>
                  <span className="font-semibold text-navy-900">
                    {viewingQuote.service?.name || 'General Contracting'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Project Location
                  </span>
                  <span className="font-semibold text-navy-900">
                    {viewingQuote.location || 'UAE'}
                  </span>
                </div>

                {viewingQuote.budget_range && (
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Budget Range
                    </span>
                    <span className="font-semibold text-navy-900">
                      {viewingQuote.budget_range}
                    </span>
                  </div>
                )}

                {viewingQuote.preferred_contact_method && (
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Preferred Contact Method
                    </span>
                    <span className="font-semibold text-navy-900 capitalize">
                      {viewingQuote.preferred_contact_method}
                    </span>
                  </div>
                )}
              </div>

              {/* Full Project Brief */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Project Brief &amp; Scope Details
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {viewingQuote.project_brief}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {viewingQuote.whatsapp ? (
                  <a
                    href={`https://wa.me/${viewingQuote.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                ) : viewingQuote.client_phone ? (
                  <a
                    href={`https://wa.me/${viewingQuote.client_phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                ) : null}

                <a
                  href={`mailto:${viewingQuote.client_email}?subject=Re: Quotation Request - Alveric Technical Contracting`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply by Email</span>
                </a>

                {viewingQuote.client_phone && (
                  <button
                    type="button"
                    onClick={() => handlePhoneAction(viewingQuote.client_phone!)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                    title="Copy phone number"
                  >
                    {copiedPhone === viewingQuote.client_phone ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Phone Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Phone</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setItemToDelete({
                      type: 'quote',
                      id: viewingQuote.id,
                      name: viewingQuote.client_name,
                    });
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Delete Quote Request"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setViewingQuote(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        title={itemToDelete?.type === 'contact' ? 'Delete Online Inquiry' : 'Delete Quote Request'}
        message={
          <>
            Are you sure you want to delete the {itemToDelete?.type === 'contact' ? 'inquiry' : 'quote request'} from{' '}
            <span className="font-bold text-navy-900">&quot;{itemToDelete?.name}&quot;</span>?
            This will permanently remove this record from the database.
          </>
        }
        confirmText={itemToDelete?.type === 'contact' ? 'Delete Inquiry' : 'Delete Quote'}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          if (!isDeleting) setItemToDelete(null);
        }}
      />
    </div>
  );
}
