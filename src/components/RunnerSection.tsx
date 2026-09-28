import React from 'react';
import { Calendar, Navigation2, DollarSign, PackageCheck, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';

interface RunnerSectionProps {
  onOpenRunnerModal: () => void;
}

const DISTRIBUTOR_BENEFITS = [
  {
    icon: Calendar,
    title: 'Earn on Your Schedule',
    description:
      'Choose jobs that fit your week. No fixed hours, no minimum shifts - work when it suits you.',
  },
  {
    icon: Navigation2,
    title: 'GPS Tracking Does the Work',
    description:
      "Just walk your route. The app tracks your delivery automatically, so there's no manual logging.",
  },
  {
    icon: DollarSign,
    title: 'Paid Twice a Week',
    description:
      'Completed jobs are paid out every Tuesday and Friday. No invoicing, no waiting.',
  },
  {
    icon: PackageCheck,
    title: 'No Bundling or Wrapping',
    description:
      'Flyers arrive ready to deliver. No sorting, no rubber bands, no prep work - just grab and go.',
  },
];

export const RunnerSection: React.FC<RunnerSectionProps> = ({ onOpenRunnerModal }) => {
  return (
    <section
      id="for-distributors"
      className="bg-white py-16 md:py-20 lg:py-24 border-b border-[var(--color-border)]"
      aria-labelledby="distributors-heading"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16">
          
          {/* Left: Content */}
          <div className="flex-1 text-left">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">
              Join Our Walker Network
            </span>

            <h2
              id="distributors-heading"
              className="font-bold text-[#0a0a0b] leading-[1.12] tracking-[-0.03em] text-[clamp(2rem,3.5vw,3rem)]"
            >
              Earn Money, Stay Active
            </h2>

            <p className="mt-3 text-base md:text-lg text-[#4b5563] leading-relaxed max-w-xl">
              Pick up delivery jobs in your area, walk your route, and get paid.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              {DISTRIBUTOR_BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="p-4 rounded-xl bg-neutral-50 border border-slate-100 flex flex-col gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0a0a0b]">{b.title}</h3>
                    <p className="text-xs text-[#4b5563] leading-relaxed">{b.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenRunnerModal}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] px-6 py-3.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
              >
                <Smartphone className="h-4 w-4" />
                <span>Apply as a Walker</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Fair hourly rates &amp; insurance included</span>
              </div>
            </div>
          </div>

          {/* Right: Graphic */}
          <div className="flex-1 w-full max-w-md lg:max-w-lg">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-neutral-50">
              <img
                src="https://realrun.com.au/__l5e/assets-v1/0598d8fa-57f4-4e14-8af7-edf8bf13e61c/distributor-app-scene.png"
                alt="REALREACH Distributor Mobile App"
                className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
export default RunnerSection;
