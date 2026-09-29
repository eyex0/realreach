import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * SECTION 5 — MEASURE.
 *
 * The old version was five identical cards, which made five numbers of very
 * different weight look equally important. This reads as one line of evidence:
 * the stages sit in a row separated by rules, the last one — the cost — is
 * pulled out as the point of the whole funnel.
 */
const FUNNEL = [
  { value: '12,000', label: 'Executed', desc: 'Flyers distributed in zone' },
  { value: '10,840', label: 'Verified', desc: 'GPS + proof confirmed' },
  { value: '8,920', label: 'Estimated reach', desc: 'Unique letterboxes' },
  { value: '3,420', label: 'Responses', desc: 'QR scans & calls' },
];

const PAYOFF = { value: '€0.21', label: 'Cost per verified reach', desc: 'All-in economics' };

export const MeasureSection: React.FC = () => {
  return (
    <section id="measure" className="py-20 md:py-28 bg-white border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#006de4]">
          <span aria-hidden="true" className="h-px w-8 bg-[#006de4]/40" />
          04 &mdash; Measure
        </p>
        <h2 className="mt-3 font-extrabold text-[#0a0a0b] tracking-tight leading-[1.08] text-[clamp(2rem,4vw,3.25rem)] max-w-3xl">
          Beyond “flyers distributed.”
        </h2>
        <p className="mt-4 text-lg text-[#4b5563] max-w-2xl leading-relaxed">
          Execution → Verification → Reach → Response → Economics. One funnel, fully measurable.
        </p>

        {/* The funnel stages, as a single line of evidence rather than cards. */}
        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {FUNNEL.map((f, i) => (
            <div
              key={f.label}
              className={`${i > 0 ? 'sm:border-l sm:border-slate-200 sm:pl-6' : ''}`}
            >
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <p className="text-4xl sm:text-5xl font-extrabold text-[#0a0a0b] font-mono tracking-tight tabular-nums">
                  {f.value}
                </p>
                <p className="mt-2 text-sm font-bold text-[#0a0a0b]">{f.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              </dd>
            </div>
          ))}
        </dl>

        {/* The payoff, separated out: this is the number the funnel exists for. */}
        <div className="mt-14 flex flex-col gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-baseline gap-4">
            <span className="text-5xl sm:text-6xl font-extrabold text-[#0a0a0b] font-mono tracking-tight tabular-nums">
              {PAYOFF.value}
            </span>
            <span className="max-w-xs text-sm leading-relaxed text-slate-600">
              <span className="block font-bold text-[#0a0a0b]">{PAYOFF.label}</span>
              {PAYOFF.desc}
            </span>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#0a0a0b] underline underline-offset-4 hover:text-[#006de4]"
          >
            <span>Open analytics</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MeasureSection;
