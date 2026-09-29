import React from 'react';
import { Printer, Package, Truck, Sparkles, Check, ArrowRight } from 'lucide-react';

interface PrintStoreSectionProps {
  onOpenOrder: () => void;
}

export const PrintStoreSection: React.FC<PrintStoreSectionProps> = ({ onOpenOrder }) => {
  return (
    <section id="print-store" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Realreach Print Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
              <Printer className="w-3.5 h-3.5" />
              <span>Turnkey Commercial Printing</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Order your flyers with Realreach and we'll print them, bundle them and send them to you, ready for your distributor to collect.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              No need to coordinate with external print shops or transport heavy boxes yourself. We handle commercial offset printing in Milan and the Lombardy region, bundling them in exact packs of 100 with barcode tracking.
            </p>

            {/* Print specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block">DL &amp; A5 Formats</span>
                <span className="text-xs text-slate-500 mt-1 block">European standard letterbox flyer dimensions for maximum impact.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block">250 GSM Silk Stock</span>
                <span className="text-xs text-slate-500 mt-1 block">Sturdy, premium tactile finish preferred by leading real estate agencies.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block">Bundled in 100s</span>
                <span className="text-xs text-slate-500 mt-1 block">Pre-counted bundles to prevent distributor error and ensure exact coverage.</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block">Direct to Depot</span>
                <span className="text-xs text-slate-500 mt-1 block">Sent directly to the runner's collection point nearest to your campaign area.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenOrder}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Order Print & Distribution</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Visual of printed stacks */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/src/assets/images/print_production_flyers_1790585836250.jpg"
                  alt="Bundles of printed property flyers ready for letterbox drop collection"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur border border-slate-200 p-4 rounded-xl shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-950 block">Commercial Offset Precision</span>
                  <span className="text-[11px] text-slate-500">24-hour turnaround across Milan &amp; Lombardy Region</span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                  Free Depot Delivery
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PrintStoreSection;
