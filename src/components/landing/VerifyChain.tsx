import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, XCircle, Flag } from 'lucide-react';

/** SECTION 4 — VERIFY: the verification engine pipeline + statuses. */
const STEPS = [
  'Task assigned',
  'Worker started',
  'Location verified',
  'Action executed',
  'Proof captured',
  'Proof verified',
  'Reach confirmed',
];

const STATUSES = [
  { label: 'Verified', icon: <CheckCircle2 className="h-4 w-4" />, cls: 'bg-emerald-100 text-emerald-800' },
  { label: 'Partially verified', icon: <AlertTriangle className="h-4 w-4" />, cls: 'bg-amber-100 text-amber-800' },
  { label: 'Unverified', icon: <XCircle className="h-4 w-4" />, cls: 'bg-slate-100 text-slate-600' },
  { label: 'Flagged', icon: <Flag className="h-4 w-4" />, cls: 'bg-red-100 text-red-700' },
];

export const VerifyChain: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#0a0a0b] text-white">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">03 — Verify</p>
        <h2 className="mt-3 font-extrabold tracking-tight leading-[1.08] text-[clamp(2rem,4vw,3.25rem)]">
          Every physical action becomes an event.
        </h2>
        <p className="mt-4 text-lg text-neutral-400 max-w-2xl leading-relaxed">
          The verification engine — a core product, not a feature — turns fieldwork into a backbone
          of trust. Each step is recorded, timestamped and scored.
        </p>

        <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {STEPS.map((s, i) => (
            <li key={s} className="relative rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
              <span className="font-mono text-xs font-bold text-emerald-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-2 text-sm font-bold leading-snug">{s}</p>
              {i < STEPS.length - 1 && (
                <span className="hidden lg:block absolute top-1/2 -right-2.5 text-neutral-600 font-bold">›</span>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-neutral-400 mr-1">Verification status:</span>
          {STATUSES.map((s) => (
            <span key={s.label} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${s.cls}`}>
              {s.icon}
              {s.label}
            </span>
          ))}
          <Link to="/gps-tracking" className="ml-auto text-sm font-semibold text-white underline underline-offset-4 hover:text-emerald-300">
            See live tracking →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VerifyChain;
