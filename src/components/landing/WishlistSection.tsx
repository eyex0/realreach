import React, { useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle, Send } from 'lucide-react';
import { apiFetch } from '../../lib/api';

/**
 * Wishlist signup.
 *
 * Public, so it is built to be finished in under a minute and to survive being
 * filled in by a person on a phone while standing in a shop. Four fields, one
 * button, no account.
 *
 * The `website` input is a honeypot: hidden from people, irresistible to bots.
 * It is `tabIndex={-1}` and `aria-hidden` so a screen reader never announces a
 * field the user cannot see, and the server accepts-and-discards a filled
 * honeypot rather than rejecting it, so a bot learns nothing from the response.
 *
 * Volume is asked for because it decides who we call first — a 40,000-a-month
 * distributor and a 200-a-month one have different problems, and the follow-up
 * is not the same conversation. It is never used to quote a price.
 */

const VOLUMES: { value: string; label: string }[] = [
  { value: 'under_500', label: 'Under 500' },
  { value: '500_2000', label: '500 – 2,000' },
  { value: '2000_10000', label: '2,000 – 10,000' },
  { value: '10000_50000', label: '10,000 – 50,000' },
  { value: 'over_50000', label: 'Over 50,000' },
  { value: 'unsure', label: 'Not sure yet' },
];

interface Props {
  /** Which page the form was submitted from, so we know what actually works. */
  source: string;
}

export function WishlistSection({ source }: Props) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [monthlyVolume, setMonthlyVolume] = useState('');
  const [problem, setProblem] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending') return;
    setError('');
    setState('sending');
    try {
      await apiFetch('/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, full_name: fullName, company, role,
          monthly_volume: monthlyVolume, problem, source, website: honeypot,
        }),
      });
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setState('idle');
    }
  };

  if (state === 'done') {
    return (
      <section className="bg-[#0a0a0b] py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            You are on the list.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
            We are still building, and we would rather tell you when there is something real
            to use than email you about nothing. If you told us what you are trying to solve,
            that is the first thing we will read.
          </p>
        </div>
      </section>
    );
  }

  const field =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white ' +
    'placeholder:text-slate-500 outline-none transition focus:border-white/30 focus:bg-white/10';

  return (
    <section className="bg-[#0a0a0b] py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Not ready to run a pilot yet?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
            Leave your details and we will tell you when there is something worth your time.
            No newsletter, no sequence — one message when there is a reason.
          </p>
        </div>

        <form onSubmit={submit} className="mt-9 space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className={field}
              type="email"
              required
              autoComplete="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={field}
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              className={field}
              type="text"
              autoComplete="organization"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <input
              className={field}
              type="text"
              autoComplete="organization-title"
              placeholder="Your role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <select
            className={`${field} appearance-none`}
            value={monthlyVolume}
            onChange={(e) => setMonthlyVolume(e.target.value)}
            aria-label="Monthly distribution volume"
          >
            <option value="" className="bg-[#0a0a0b]">
              Flyers or letters per month
            </option>
            {VOLUMES.map((v) => (
              <option key={v.value} value={v.value} className="bg-[#0a0a0b]">
                {v.label}
              </option>
            ))}
          </select>

          <textarea
            className={`${field} min-h-[96px] resize-y`}
            rows={3}
            placeholder="What are you trying to prove or measure? (optional, but this is what we read first)"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />

          {/* Honeypot: invisible to people, and to assistive technology. */}
          <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
            <label htmlFor="wishlist-website">Website</label>
            <input
              id="wishlist-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex flex-col items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={state === 'sending' || !email}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#0a0a0b] transition hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              {state === 'sending' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Keep me posted
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-500">
              We store your details to contact you about REALREACH and nothing else. We never
              sell or share them, and every email we send has an unsubscribe link.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default WishlistSection;
