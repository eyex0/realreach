import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/** SECTION 5 — MEASURE: Execution → Verification → Reach → Response → Economics. */
const FUNNEL = [
  { value: '12,000', label: 'Executed', desc: 'Flyers distributed in zone' },
  { value: '10,840', label: 'Verified', desc: 'GPS + proof confirmed' },
  { value: '8,920', label: 'Estimated reach', desc: 'Unique letterboxes' },
  { value: '3,420', label: 'Responses', desc: 'QR scans & calls' },
  { value: '€0.21', label: 'Cost / verified reach', desc: 'All-in economics' },
];

export const MeasureSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#006de4]">04 — Measure</p>
        <h2 className="mt-3 font-extrabold text-[#0a0a0b] tracking-tight leading-[1.08] text-[clamp(2rem,4vw,3.25rem)] max-w-3xl">
          Beyond “flyers distributed.”
        </h2>
        <p className="mt-4 text-lg text-[#4b5563] max-w-2xl leading-relaxed">
          Execution → Verification → Reach → Response → Economics. One funnel, fully measurable.
        </p>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-5 gap-4">
          {FUNNEL.map((f, i) => (
            <div key={f.label} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 overflow-hidden">
              <span className="font-mono text-xs font-bold text-[#006de4]">0{i + 1}</span>
              <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0a0a0b] font-mono tracking-tight">
                {f.value}
              </p>
              <p className="mt-1 text-sm font-bold">{f.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              {i < FUNNEL.length - 1 && (
                <span className="hidden lg:block absolute top-1/2 -right-2 text-slate-300 font-bold z-10">›</span>
              )}
            </div>
          ))}
        </div>

        <Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#0a0a0b] underline underline-offset-4 hover:text-[#006de4]">
          <span>Open analytics</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default MeasureSection;
