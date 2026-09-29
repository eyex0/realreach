import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { RealReachLogo } from '../RealReachLogo';

/** SECTION 6 — THE PLATFORM: Command Center preview. */
const TILES = [
  { label: 'Coverage', value: '87%' },
  { label: 'Reach', value: '8,920' },
  { label: 'Verified', value: '91%' },
];

export const PlatformSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#fafbfc] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#006de4]">05 — The platform</p>
          <h2 className="mt-3 font-extrabold text-[#0a0a0b] tracking-tight leading-[1.08] text-[clamp(2rem,4vw,3.25rem)]">
            Command Center, not another dashboard.
          </h2>
          <p className="mt-4 text-lg text-[#4b5563] leading-relaxed">
            The main screen is dominated by campaign geography and live activity — overview,
            campaigns, planner, field network, verification and analytics in one mission-control view.
          </p>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] text-white px-6 py-3 text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            <span>Open the Command Center</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stylized Command Center mock */}
        <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xl">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
            <RealReachLogo size={16} color="#0a0a0b" />
            <span className="text-xs font-bold">Realreach</span>
            <span className="ml-auto rounded-full bg-black px-3 py-1 text-[10px] font-bold text-white">+ New Campaign</span>
          </div>
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Campaign performance</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {TILES.map((t) => (
                <div key={t.label} className="rounded-xl bg-slate-900 text-white p-3 text-center">
                  <p className="text-[9px] text-neutral-400 font-semibold">{t.label}</p>
                  <p className="text-xl font-extrabold font-mono">{t.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-xl bg-slate-100 border border-slate-200 h-36 relative overflow-hidden">
              <svg viewBox="0 0 400 140" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
                <rect width="400" height="140" fill="#eef3ee" />
                <path d="M-10 50 H410 M-10 100 H410 M100 -10 V150 M220 -10 V150 M330 -10 V150" stroke="#fff" strokeWidth="6" />
                <polygon points="120,30 220,20 250,90 150,110 100,70" fill="rgba(0,109,228,0.12)" stroke="#006de4" strokeWidth="2.5" />
                <path d="M130 95 C170 80 180 60 220 55 C260 50 270 70 300 60" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" />
                <circle cx="300" cy="60" r="6" fill="#0a0a0b" />
                <circle cx="300" cy="60" r="2.5" fill="#fff" />
              </svg>
              <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold shadow">Duomo & Brera · live</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
