import React from 'react';
import { Printer, Check, ArrowRight } from 'lucide-react';

interface NowPrintingSectionProps {
  onOpenOrder?: () => void;
}

export const NowPrintingSection: React.FC<NowPrintingSectionProps> = ({ onOpenOrder }) => {
  return (
    <section
      id="now-printing"
      className="bg-white py-16 md:py-20 border-b border-[var(--color-border)]"
      aria-labelledby="now-printing-heading"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <div className="w-full grid md:grid-cols-2 gap-8 md:gap-12 items-center rounded-2xl bg-neutral-50/80 border border-[var(--color-border)] p-6 md:p-10">
          
          {/* Left Text */}
          <div className="md:pl-2 md:pt-1">
            <span className="inline-block font-semibold uppercase tracking-[0.08em] text-xs px-2.5 py-1 rounded bg-blue-100 text-blue-700">
              New
            </span>

            <h2
              id="now-printing-heading"
              className="mt-3 font-extrabold text-[#0a0a0b] tracking-[-0.02em] text-[clamp(1.75rem,3vw+0.5rem,2.75rem)] leading-[1.15]"
            >
              Now Printing
            </h2>

            <p className="mt-4 text-[#4b5563] leading-relaxed text-base md:text-lg">
              Print and distribute in one place. Order your flyers with REALREACH and we'll print them, bundle them and send them to you, ready for your distributor to collect.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-[#4b5563]">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>150–350 GSM premium stocks</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>DL, A5, A6 & folded formats</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Automated bleed check</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Bulk discounts applied</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenOrder}
                className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0b] px-6 py-3 font-semibold text-white transition-colors hover:bg-neutral-800 text-sm shadow-sm cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print flyers</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full overflow-hidden rounded-xl bg-white border border-[var(--color-border)] shadow-sm">
            <img
              src="https://realrun.com.au/__l5e/assets-v1/c57c8c55-5bad-4017-a848-4a351d52cf3f/now-printing.png"
              alt="Flyers being printed and packed for distribution"
              className="w-full h-full object-cover aspect-[16/10] hover:scale-[1.02] transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
export default NowPrintingSection;
