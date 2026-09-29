import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { RealReachLogo } from './RealReachLogo';

interface CapabilitiesBentoProps {
  onOpenOrder: () => void;
}

type PreviewKind = 'map' | 'tracking' | 'print' | 'dashboard' | 'runs' | 'drafts' | 'support';

interface Feature {
  title: string;
  desc: string;
  preview: PreviewKind;
}

const FEATURES: Feature[] = [
  {
    title: 'Custom map area insights',
    desc: 'Filter by Milan zones, postcodes (CAP), or draw custom street polygons with exact residential mailbox counts.',
    preview: 'map',
  },
  {
    title: 'Live tracking you can rely on',
    desc: 'Real-time GPS coordinates of your distributor with street coverage overlays and verified delivery counts.',
    preview: 'tracking',
  },
  {
    title: 'Access to the print store',
    desc: 'Print flyers on 150-350 GSM premium paper stocks and bundle print with delivery automatically.',
    preview: 'print',
  },
  {
    title: 'Distribution insights dashboard',
    desc: 'Detailed delivery heatmaps, completion reports, and shareable vendor links for every run.',
    preview: 'dashboard',
  },
  {
    title: 'Manage all runs in one place',
    desc: 'Schedule recurring drops across Milan and monitor multi-zone campaigns with instant per-letterbox pricing.',
    preview: 'runs',
  },
  {
    title: 'Create unlimited test campaigns',
    desc: 'Plan and save drafts for property listings or product launches without commitment until you publish.',
    preview: 'drafts',
  },
  {
    title: 'Access to Sales & Run Support',
    desc: 'Direct Milan operations phone and chat line — our team coordinates distributor re-runs instantly.',
    preview: 'support',
  },
];

/* ---------- Shared mini pieces (all Realreach-branded, Milan/EUR) ---------- */

const MiniTopbar: React.FC = () => (
  <div className="flex items-center justify-between bg-white px-2.5 py-1.5">
    <div className="flex items-center gap-1">
      <RealReachLogo size={11} color="#0a0a0b" />
      <span className="text-[8px] font-bold">Realreach</span>
      <span className="ml-1.5 hidden text-[7px] font-semibold text-slate-400 min-[420px]:inline">Dashboard</span>
      <span className="hidden text-[7px] font-semibold text-slate-400 min-[420px]:inline">Print</span>
      <span className="hidden text-[7px] font-semibold text-slate-400 min-[420px]:inline">Distribution</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[6px] font-bold text-white">MR</span>
      <span className="text-[7px] font-semibold">Matteo</span>
    </div>
  </div>
);

const MapBackdrop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="300" fill="#edf3ec" />
    <ellipse cx="70" cy="60" rx="55" ry="38" fill="#d7e8d4" />
    <ellipse cx="340" cy="230" rx="65" ry="45" fill="#d7e8d4" />
    <ellipse cx="330" cy="50" rx="40" ry="26" fill="#d7e8d4" />
    <path d="M-10 90 H410 M-10 160 H410 M-10 230 H410 M80 -10 V310 M170 -10 V310 M260 -10 V310 M340 -10 V310" stroke="#ffffff" strokeWidth="7" />
    <path d="M-10 125 H410 M125 -10 V310 M215 -10 V310 M305 -10 V310" stroke="#ffffff" strokeWidth="3" />
    <path d="M300 300 C340 260 380 250 410 255 L410 310 L300 310 Z" fill="#cfe3f5" />
    {children}
  </svg>
);

const MapPreview: React.FC = () => (
  <div className="relative h-full bg-[#edf3ec]">
    <MapBackdrop>
      <polygon points="120,70 210,60 230,140 150,165 105,130" fill="rgba(10,10,11,0.08)" stroke="#0a0a0b" strokeWidth="3" />
      <polygon points="230,150 320,140 340,220 250,245 215,200" fill="rgba(10,10,11,0.08)" stroke="#0a0a0b" strokeWidth="3" />
    </MapBackdrop>
    <div className="absolute left-2 top-2 w-[38%] rounded-lg bg-white p-2 shadow-md">
      <p className="text-[8px] font-bold">Set your audience</p>
      {['Duomo & Brera', 'Navigli', 'Porta Nuova'].map((a, i) => (
        <div key={a} className="mt-1.5 flex items-center justify-between rounded-md bg-slate-50 px-1.5 py-1">
          <span className="text-[7px] font-semibold">{i + 1}. {a}</span>
          <span className="text-[7px] font-bold text-red-500">✕</span>
        </div>
      ))}
    </div>
    <div className="absolute right-2 top-2 w-[34%] rounded-lg bg-white p-2 shadow-md">
      <p className="text-[7px] text-slate-500">Total letterboxes</p>
      <p className="text-[13px] font-extrabold">10,603</p>
      <div className="mt-1 space-y-0.5 text-[7px]">
        <div className="flex justify-between"><span>Houses</span><span className="font-bold">4,302</span></div>
        <div className="flex justify-between"><span>Units</span><span className="font-bold">6,301</span></div>
        <div className="flex justify-between border-t border-slate-100 pt-0.5"><span>Distribution fee</span><span className="font-bold">€1,655.89</span></div>
      </div>
    </div>
  </div>
);

const TrackingPreview: React.FC = () => (
  <div className="relative h-full bg-[#edf3ec]">
    <MapBackdrop>
      <polygon points="90,50 300,40 330,240 120,250" fill="rgba(10,10,11,0.06)" stroke="#0a0a0b" strokeWidth="2.5" />
      <path d="M110 220 C140 180 120 140 160 120 C200 100 210 150 250 140 C290 130 280 90 310 70" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 5" strokeLinecap="round" />
      <path d="M110 220 C150 200 150 160 190 150 C230 140 240 110 280 100" fill="none" stroke="#006de4" strokeWidth="4" strokeDasharray="2 6" strokeLinecap="round" />
      <circle cx="280" cy="100" r="7" fill="#0a0a0b" />
      <circle cx="280" cy="100" r="3" fill="#fff" />
    </MapBackdrop>
    <div className="absolute left-2 top-2 rounded-lg bg-white p-1.5 shadow-md text-[6px] font-semibold leading-relaxed">
      <p className="text-[6px] font-bold text-slate-400">WALKING SPEED</p>
      <p><span className="text-blue-600">—</span> Normal</p>
      <p><span className="text-amber-500">—</span> Fast</p>
    </div>
    <div className="absolute right-2 top-2 rounded-lg bg-white p-2 shadow-md">
      <div className="flex gap-3">
        <div><p className="text-[11px] font-extrabold">8.5k</p><p className="text-[6px] text-slate-500">Letterboxes</p></div>
        <div><p className="text-[11px] font-extrabold">18.1km</p><p className="text-[6px] text-slate-500">Distance</p></div>
      </div>
    </div>
  </div>
);

const PrintPreview: React.FC = () => {
  const products = [
    { name: 'A4 Flyers', spec: '210 x 297 mm', price: 'From €0.07/pc' },
    { name: 'A5 Flyers', spec: '148 x 210 mm', price: 'From €0.04/pc' },
    { name: 'A6 Flyers', spec: '105 x 148 mm', price: 'From €0.03/pc' },
    { name: 'DL Flyers', spec: '99 x 210 mm', price: 'From €0.03/pc' },
  ];
  return (
    <div className="flex h-full flex-col bg-slate-50 p-3">
      <p className="text-center text-[11px] font-extrabold">What are you printing?</p>
      <p className="text-center text-[7px] text-slate-500">Choose a product to get started.</p>
      <div className="mt-2 grid flex-1 grid-cols-4 gap-2">
        {products.map((p) => (
          <div key={p.name} className="flex flex-col rounded-lg bg-white p-1.5 shadow-sm">
            <div className="relative flex-1 rounded-md bg-gradient-to-br from-slate-100 to-slate-200 p-1">
              <div className="absolute inset-x-2 top-1.5 bottom-1 rounded-[2px] bg-white shadow-sm" />
              <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#006de4]" />
              <div className="absolute left-1/2 top-1/2 h-4 w-6 -translate-x-[20%] -translate-y-1/2 rounded-full bg-orange-500/80" />
            </div>
            <p className="mt-1 text-[7px] font-bold">{p.name}</p>
            <p className="text-[6px] text-slate-500">{p.spec}</p>
            <p className="text-[6px] font-bold">{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardPreview: React.FC = () => (
  <div className="flex h-full flex-col gap-2 bg-white p-3">
    <div className="flex items-center justify-between">
      <p className="text-[12px] font-extrabold">Dashboard</p>
      <span className="rounded-full bg-black px-2 py-0.5 text-[7px] font-bold text-white">+ New Campaign</span>
    </div>
    <div className="grid grid-cols-5 gap-1.5">
      {[['Total flyers', '24.5k'], ['Active runs', '1'], ['Success rate', '96%'], ['Support', '1'], ['Credits', '€0']].map(([l, v]) => (
        <div key={l} className="rounded-lg border border-slate-100 p-1.5">
          <p className="text-[6px] text-slate-500">{l}</p>
          <p className="text-[10px] font-extrabold">{v}</p>
        </div>
      ))}
    </div>
    <div className="grid flex-1 grid-cols-2 gap-1.5">
      <div className="rounded-lg border border-slate-100 p-1.5">
        <p className="text-[7px] font-bold">Run outcomes</p>
        <div className="mx-auto mt-1 flex h-12 w-12 items-center justify-center rounded-full border-[6px] border-emerald-500 border-t-slate-100">
          <span className="text-[9px] font-extrabold">96%</span>
        </div>
      </div>
      <div className="flex items-end justify-around rounded-lg border border-slate-100 p-1.5">
        {[35, 70, 25, 55, 40, 80, 30].map((h, i) => (
          <div key={i} className="w-2.5 rounded-sm bg-slate-900" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  </div>
);

const RunsPreview: React.FC = () => {
  const rows = [
    ['Duomo & Brera', '8,500', '€1,133.00'],
    ['Navigli & Ticinese', '10,000', '€1,452.00'],
    ['Porta Nuova & Isola', '6,000', '€864.00'],
  ];
  return (
    <div className="flex h-full flex-col gap-1.5 bg-white p-3">
      <p className="text-[11px] font-extrabold">My campaigns</p>
      {rows.map(([area, flyers, price]) => (
        <div key={area} className="flex items-center justify-between rounded-lg border border-slate-100 px-2 py-1.5">
          <div>
            <p className="text-[8px] font-bold">{area}</p>
            <p className="text-[6px] text-slate-500">{flyers} flyers · Milano</p>
          </div>
          <span className="font-mono text-[8px] font-bold">{price}</span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[6px] font-bold text-emerald-800">
            <CheckCircle2 className="h-2 w-2" /> Success
          </span>
        </div>
      ))}
    </div>
  );
};

const DraftsPreview: React.FC = () => {
  const rows = [
    ['Campaign 30-Aug', '4 areas', '1,950'],
    ['Campaign 28-Aug', '3 areas', '—'],
    ['Campaign 20-Aug', '4 areas', '—'],
    ['Campaign 19-Aug', '1 area', '—'],
  ];
  return (
    <div className="flex h-full flex-col bg-slate-50 p-3">
      <p className="text-center text-[11px] font-extrabold">Start your campaign</p>
      <p className="text-center text-[7px] text-slate-500">Continue a draft or re-run a past campaign.</p>
      <div className="mt-2 flex-1 space-y-1.5 overflow-hidden">
        {rows.map(([name, areas, flyers]) => (
          <div key={name} className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5 shadow-sm">
            <p className="text-[8px] font-bold">{name}</p>
            <p className="text-[7px] text-slate-500">{areas} · {flyers} flyers</p>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[6px] font-bold text-slate-600">Draft</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SupportPreview: React.FC = () => (
  <div className="flex h-full flex-col gap-2 bg-white p-3">
    <div className="flex items-center justify-between">
      <p className="text-[12px] font-extrabold">Support</p>
      <span className="rounded-full bg-black px-2 py-0.5 text-[7px] font-bold text-white">+ New request</span>
    </div>
    <div className="rounded-lg bg-slate-50 p-2">
      <p className="text-[8px] font-bold">We&apos;re here to help</p>
      <p className="text-[6px] text-slate-500">Mon–Fri, 9am–6pm CET · +39 02 800 318 47</p>
    </div>
    <div className="rounded-lg border border-slate-100 p-2">
      <div className="flex items-center justify-between">
        <p className="text-[8px] font-bold">Could I please have help with this Run?</p>
        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[6px] font-bold text-amber-800">Open</span>
      </div>
      <p className="mt-0.5 text-[6px] text-slate-500">Duomo & Brera · Updated 18 minutes ago</p>
    </div>
  </div>
);

const PREVIEWS: Record<PreviewKind, React.FC> = {
  map: MapPreview,
  tracking: TrackingPreview,
  print: PrintPreview,
  dashboard: DashboardPreview,
  runs: RunsPreview,
  drafts: DraftsPreview,
  support: SupportPreview,
};

export const CapabilitiesBento: React.FC<CapabilitiesBentoProps> = ({ onOpenOrder }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = FEATURES[activeIdx];
  const ActivePreview = PREVIEWS[active.preview];

  return (
    <section
      id="features"
      className="py-20 md:py-28 bg-[#fafbfc] border-b border-[var(--color-border)]"
      style={{
        backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm mb-5">
            <RealReachLogo size={16} color="#0a0a0b" />
            <span>Realreach Platform Suite</span>
            <span className="text-[#006de4] font-bold">· Free forever</span>
          </div>
          <h2 className="font-extrabold text-[#0a0a0b] leading-[1.05] tracking-[-0.03em] text-[clamp(2.5rem,4.5vw,4rem)]">
            Free Features
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[#4b5563]">
            When you create an account, get access to every tool below — no subscription, no seat fees.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Preview in Realreach browser frame */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 self-start">
            <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-[11px] font-semibold text-slate-500">
                    <RealReachLogo size={12} color="#0a0a0b" />
                    app.realreach.it
                  </span>
                </div>
                <span className="hidden sm:inline-flex items-center rounded-full bg-[#006de4]/10 text-[#006de4] px-2.5 py-0.5 text-[11px] font-bold">
                  Live preview
                </span>
              </div>
              <MiniTopbar />
              {/* Fixed frame — switching features never moves the layout */}
              <div key={active.preview} className="relative aspect-[4/3] overflow-hidden animate-fade-slide">
                <ActivePreview />
              </div>
            </div>
            {/* Caption */}
            <div className="mt-4 flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#006de4]">
                {String(activeIdx + 1).padStart(2, '0')} / {String(FEATURES.length).padStart(2, '0')}
              </span>
              <p key={active.title} className="text-sm font-semibold text-[#0a0a0b] animate-fadeIn">
                {active.title} — {active.desc}
              </p>
            </div>
          </div>

          {/* Numbered feature index */}
          <ol className="lg:col-span-5 space-y-2">
            {FEATURES.map((feature, idx) => {
              const isActive = idx === activeIdx;
              return (
                <li key={feature.title}>
                  <button
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    aria-pressed={isActive}
                    className={`w-full text-left rounded-2xl border-2 p-4 sm:p-5 transition-all cursor-pointer group ${
                      isActive
                        ? 'border-[#0a0a0b] bg-white shadow-lg'
                        : 'border-transparent hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-sm font-bold tabular-nums transition-colors ${
                          isActive ? 'text-[#006de4]' : 'text-slate-300 group-hover:text-slate-400'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-base sm:text-lg font-bold text-[#0a0a0b]">
                        {feature.title}
                      </span>
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                          isActive ? 'bg-[#0a0a0b] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                        }`}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    {isActive && (
                      <p className="mt-2 pl-10 pr-2 text-sm text-[#4b5563] leading-relaxed animate-fadeIn">
                        {feature.desc}
                      </p>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Footer note + CTA */}
        <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-[#0a0a0b] px-6 py-6 sm:px-8 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <RealReachLogo size={30} color="#ffffff" />
            <div>
              <p className="font-bold">Pay per delivery, not per month.</p>
              <p className="text-sm text-neutral-400">Every feature above is free with your account.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenOrder}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#006de4] text-white px-8 py-3.5 text-base font-semibold hover:bg-[#0060ca] transition-colors shadow-lg cursor-pointer shrink-0"
          >
            <span>Test a campaign area</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesBento;
