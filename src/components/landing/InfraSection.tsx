import React from 'react';

/** SECTION 7 — THE INFRASTRUCTURE: architectural flow visualization. */
const NODES = [
  { label: 'Campaign', desc: 'Objective · geography · budget' },
  { label: 'Field Network', desc: 'Workers · teams · routes' },
  { label: 'Verification', desc: 'GPS · proof · events' },
  { label: 'Real-world Data', desc: 'Coverage · reach · response' },
  { label: 'Reach', desc: 'Verified letterboxes' },
  { label: 'Analytics', desc: 'Funnel · economics' },
  { label: 'API', desc: 'Agencies · brands · software' },
];

export const InfraSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#006de4]">06 — The infrastructure</p>
        <h2 className="mt-3 font-extrabold text-[#0a0a0b] tracking-tight leading-[1.08] text-[clamp(2rem,4vw,3.25rem)]">
          Physical activity, structured.
        </h2>
        <p className="mt-4 text-lg text-[#4b5563] leading-relaxed">
          Realreach is the layer that turns movement in the real world into data infrastructure.
        </p>

        <div className="mt-12 flex flex-col items-stretch gap-0 max-w-md mx-auto">
          {NODES.map((n, i) => (
            <React.Fragment key={n.label}>
              <div
                className={`rounded-2xl border-2 px-6 py-4 transition-colors ${
                  i === 0 || i === NODES.length - 1
                    ? 'border-[#0a0a0b] bg-[#0a0a0b] text-white shadow-lg'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <p className="font-extrabold tracking-tight text-lg">{n.label}</p>
                <p className={`text-xs mt-0.5 ${i === 0 || i === NODES.length - 1 ? 'text-neutral-400' : 'text-slate-500'}`}>
                  {n.desc}
                </p>
              </div>
              {i < NODES.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <span className="block w-0.5 h-5 bg-gradient-to-b from-[#006de4] to-[#006de4]/20" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfraSection;
