import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, XCircle, Flag } from 'lucide-react';

/**
 * SECTION 4 — VERIFY.
 *
 * Structured as a process rather than a row of cards: a numbered rail on the
 * right reads as "these steps happen in this order", which a seven-across grid
 * of equal boxes does not. The old version also led with a pill and a wall of
 * badges; this one leads with the claim and lets the chain prove it.
 */
const STEPS = [
  { title: 'Task assigned', note: 'A zone is allocated to a named distributor.' },
  { title: 'Worker started', note: 'The session opens and starts recording.' },
  { title: 'Location verified', note: 'GPS points land inside the assigned area.' },
  { title: 'Action executed', note: 'Time on task is logged, not self-reported.' },
  { title: 'Proof captured', note: 'Photo and quantity, timestamped on upload.' },
  { title: 'Proof verified', note: 'The engine scores it against the evidence.' },
  { title: 'Reach confirmed', note: 'Counted, timestamped and ready to pay.' },
];

const STATUSES = [
  { label: 'Verified', icon: CheckCircle2, cls: 'text-emerald-700' },
  { label: 'Partially verified', icon: AlertTriangle, cls: 'text-amber-700' },
  { label: 'Unverified', icon: XCircle, cls: 'text-slate-600' },
  { label: 'Flagged', icon: Flag, cls: 'text-red-600' },
];

export const VerifyChain: React.FC = () => {
  return (
    <section
      id="verify"
      className="overflow-hidden py-20 md:py-28 bg-white border-b border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* Left: the claim, then what a verdict can be. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#006de4]">
              <span aria-hidden="true" className="h-px w-8 bg-[#006de4]/40" />
              03 &mdash; Verify
            </p>
            <h2 className="mt-3 font-extrabold tracking-tight leading-[1.08] text-[#0a0a0b] text-[clamp(2rem,4vw,3.25rem)]">
              Every physical action becomes an event.
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-xl leading-relaxed">
              The verification engine — a core product, not a feature — turns fieldwork into a
              backbone of trust. Each step is recorded, timestamped and scored.
            </p>

            <dl className="mt-10 space-y-3">
              {STATUSES.map((s) => (
                <div key={s.label} className="flex items-start gap-3">
                  <s.icon className={`mt-0.5 h-4 w-4 shrink-0 ${s.cls}`} aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-bold text-[#0a0a0b]">{s.label}</dt>
                    <dd className="text-xs text-slate-500">
                      {s.label === 'Verified' && 'Every required check passed on real evidence.'}
                      {s.label === 'Partially verified' && 'Required checks passed, optional ones missing.'}
                      {s.label === 'Unverified' && 'Required evidence is missing. A human decides.'}
                      {s.label === 'Flagged' && 'Someone reported the data as wrong.'}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <Link
              to="/gps-tracking"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#0a0a0b] underline underline-offset-4 hover:text-emerald-700"
            >
              See live tracking →
            </Link>
          </div>

          {/* Right: the chain, as a rail. */}
          <ol className="relative">
            {/* The connecting line, behind the markers. */}
            <span
              aria-hidden="true"
              className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200"
            />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 pb-7 last:pb-0">
                <span className="relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 font-mono text-[11px] font-bold text-emerald-700">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 pt-1">
                  <p className="text-base font-bold leading-snug text-[#0a0a0b]">{s.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default VerifyChain;
