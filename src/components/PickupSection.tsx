import React from 'react';
import { MapPin, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

interface PickupSectionProps {
  onOpenOrder?: () => void;
}

export const PickupSection: React.FC<PickupSectionProps> = ({ onOpenOrder }) => {
  return (
    <section id="pickup" className="relative overflow-hidden bg-white py-16 md:py-24 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:gap-14 lg:grid-cols-2 items-center">
          {/* Left Text */}
          <div className="text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4">
              <Truck className="h-3.5 w-3.5" />
              <span>Door-to-Letterbox Logistics</span>
            </div>
            
            <h2
              id="pickup-heading"
              className="font-bold text-[#0a0a0b] leading-[1.1] tracking-[-0.03em] text-[clamp(1.875rem,4vw+0.75rem,3.25rem)]"
            >
              Your flyers picked up & distributed
            </h2>

            <p className="mt-4 text-[#4b5563] text-base md:text-lg leading-relaxed">
              Choose any pickup location and a REALREACH runner collects your flyers, ready to distribute in your campaign area.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0a0a0b]">Pick up from anywhere</h4>
                  <p className="text-xs sm:text-sm text-[#4b5563]">Your agency office, local commercial printer, or residence.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0a0a0b]">Bundle count verification</h4>
                  <p className="text-xs sm:text-sm text-[#4b5563]">Distributors confirm carton counts and weights prior to commencing runs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#0a0a0b]">Same-day or scheduled drop</h4>
                  <p className="text-xs sm:text-sm text-[#4b5563]">Coordinate drops around listing schedules, auctions, or store launches.</p>
                </div>
              </div>
            </div>

            {onOpenOrder && (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={onOpenOrder}
                  className="rounded-xl bg-[#0a0a0b] px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Book a pickup & drop</span>
                  <span>&rarr;</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-md bg-neutral-50">
              <img
                src="https://realrun.com.au/__l5e/assets-v1/70b3a9a7-3f9a-4ee0-83f7-29d8899447d1/feature-flyer-pickup.png"
                alt="A distributor collecting a box of flyers from a pickup location"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain rounded-2xl hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PickupSection;
