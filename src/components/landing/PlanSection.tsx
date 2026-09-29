import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

/** SECTION 2 — PLAN: campaign + geography. */
export const PlanSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#006de4]">01 — Plan</p>
          <h2 className="mt-3 font-extrabold text-[#0a0a0b] tracking-tight leading-[1.08] text-[clamp(2rem,4vw,3.25rem)]">
            Draw an area. Say what to reach.
          </h2>
          <p className="mt-4 text-lg text-[#4b5563] leading-relaxed">
            Define your objective, pick the streets, set the budget — Realreach turns the geography
            into priced, trackable tasks. No quotes, no guesswork.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/campaigns/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] text-white px-6 py-3 text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              <span>Start a campaign</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-black transition-colors"
            >
              <span>Open Reach Planner</span>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <MapPin className="h-4 w-4 text-[#006de4]" />
            <span>Campaign objective</span>
          </div>
          <p className="mt-2 text-lg font-bold text-[#0a0a0b]">“I want to reach these locations.”</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              ['Geography', 'Duomo & Brera · 8,500 letterboxes'],
              ['Budget', '€1,133.00 all-in'],
              ['Dates', 'Next available run window'],
              ['KPI', 'Verified coverage ≥ 95%'],
            ].map(([k, v]) => (
              <li key={k} className="flex items-center justify-between rounded-xl bg-white border border-slate-200 px-4 py-2.5">
                <span className="font-semibold text-slate-500">{k}</span>
                <span className="font-bold text-[#0a0a0b] text-right">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PlanSection;
