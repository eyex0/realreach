import React, { useState } from 'react';
import { CheckCircle, Send, Loader2 } from 'lucide-react';

const VOLUMES = ['0–1,000', '2,000+', '5,000+', '10,000+'];

interface VolumeEstimationCardProps {
  onOpenOrder?: (volume?: string) => void;
}

export const VolumeEstimationCard: React.FC<VolumeEstimationCardProps> = ({ onOpenOrder }) => {
  const [selectedVolume, setSelectedVolume] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMsg('Please enter your name, email and phone number.');
      setStatus('error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    // Simulate reliable submission
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '' });
    }, 600);
  };

  return (
    <section className="py-20 px-6 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-[900px] text-center">
        <h2
          className="font-bold text-[var(--color-text-primary)] text-[clamp(1.75rem,4vw,2.5rem)] leading-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          How many flyers do you estimate to deliver per month?
        </h2>
        <p className="mt-3 text-[var(--color-text-secondary)] text-base sm:text-lg">
          Select an option and we'll help you get started.
        </p>

        {/* 4 Volume Pills */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-[720px] mx-auto">
          {VOLUMES.map((vol) => {
            const isSelected = selectedVolume === vol;
            return (
              <button
                key={vol}
                type="button"
                onClick={() => {
                  setSelectedVolume(vol);
                  setStatus('idle');
                  setErrorMsg('');
                }}
                className={`rounded-xl border px-4 py-4 text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#0a0a0b] bg-[#0a0a0b] text-white shadow-sm'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:border-[#0a0a0b] hover:bg-neutral-50'
                }`}
              >
                {vol}
              </button>
            );
          })}
        </div>

        {/* Instant Lead Capture Form */}
        {selectedVolume && (
          <div className="mt-8 max-w-[520px] mx-auto rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-7 text-left shadow-sm transition-all duration-300">
            {status === 'success' ? (
              <div className="py-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0a0a0b]">
                  <CheckCircle className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <h3
                  className="mt-4 font-bold text-[var(--color-text-primary)] text-[clamp(1.125rem,2vw,1.375rem)]"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Thanks — we'll be in touch
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto">
                  One of our team will reach out shortly to plan your flyer distribution.
                </p>
                
                {onOpenOrder && (
                  <button
                    type="button"
                    onClick={() => onOpenOrder(selectedVolume)}
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0a0a0b] text-white px-5 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors"
                  >
                    Open Instant Campaign Builder
                  </button>
                )}

                <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Need it sooner? Call{' '}
                    <a
                      href="tel:1800318479"
                      className="font-semibold text-[var(--color-text-primary)] hover:underline"
                    >
                      1800 318 479
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Estimated volume:{' '}
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {selectedVolume}
                    </span>{' '}
                    flyers / month
                  </p>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Instant coverage
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="flyer-name"
                    className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="flyer-name"
                    type="text"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[#0a0a0b] focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="flyer-email"
                    className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="flyer-email"
                    type="email"
                    required
                    maxLength={255}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[#0a0a0b] focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="flyer-phone"
                    className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
                  >
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="flyer-phone"
                    type="tel"
                    required
                    maxLength={20}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[#0a0a0b] focus:border-transparent transition-all"
                    placeholder="04XX XXX XXX"
                  />
                </div>

                {status === 'error' && errorMsg && (
                  <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-full py-3.5 px-5 text-sm font-semibold bg-[#0a0a0b] text-white hover:bg-[#1a1a1d] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm cursor-pointer"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
export default VolumeEstimationCard;
