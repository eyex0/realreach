import React, { useState } from 'react';
import { X, Send, Phone, Mail, MapPin, CheckCircle, Loader2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl animate-fadeIn">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            Milan &amp; Italy Dispatch Support
          </span>
          <h3 className="mt-2 text-2xl font-bold text-[#0a0a0b] tracking-tight">
            Contact REALREACH
          </h3>
          <p className="mt-1 text-sm text-[#4b5563]">
            Have questions about custom runs, agency accounts, or multi-zone drops across Milan?
          </p>
        </div>

        {status === 'success' ? (
          <div className="py-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-[#0a0a0b]">Message Sent!</h4>
            <p className="mt-2 text-sm text-[#4b5563]">
              Thanks for reaching out. Our team will get back to you within 2 business hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                onClose();
              }}
              className="mt-6 rounded-xl bg-[#0a0a0b] text-white px-6 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0a0a0b] uppercase tracking-wider mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                placeholder="Your full name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0a0a0b] uppercase tracking-wider mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                  placeholder="you@agency.com.au"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0a0a0b] uppercase tracking-wider mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                  placeholder="04XX XXX XXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0a0a0b] uppercase tracking-wider mb-1">
                How can we help?
              </label>
              <textarea
                rows={3}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a0a0b]"
                placeholder="Tell us about your upcoming campaigns or target suburbs..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-[#0a0a0b] py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <a href="tel:1800318479" className="flex items-center gap-1 hover:text-slate-900 font-medium">
                <Phone className="h-3.5 w-3.5" />
                <span>1800 318 479</span>
              </a>
              <a href="mailto:support@realreach.com.au" className="flex items-center gap-1 hover:text-slate-900 font-medium">
                <Mail className="h-3.5 w-3.5" />
                <span>support@realreach.com.au</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default ContactModal;
