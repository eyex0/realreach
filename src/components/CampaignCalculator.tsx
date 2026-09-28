import React, { useState } from 'react';
import { 
  Calculator, 
  MapPin, 
  Printer, 
  Truck, 
  Check, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  Clock,
  Layers,
  Award
} from 'lucide-react';

interface CampaignCalculatorProps {
  onOpenOrder: (campaignData: {
    city: string;
    suburb: string;
    quantity: number;
    serviceType: 'print_and_deliver' | 'deliver_only';
    format: string;
    paperStock: string;
    isSoloDrop: boolean;
    totalPrice: number;
    pricePerUnit: number;
  }) => void;
}

const REGIONS = [
  {
    city: 'Milano Centro & Nord',
    state: 'MI',
    suburbs: ['Duomo & Brera', 'Montenapoleone & Quadrilatero', 'Porta Nuova & Isola', 'Garibaldi & Corso Como', 'Città Studi & Piola'],
  },
  {
    city: 'Milano Ovest & CityLife',
    state: 'MI',
    suburbs: ['CityLife & Portello', 'Fiera & Pagano', 'Wagner & De Angeli', 'San Siro & Buonarroti'],
  },
  {
    city: 'Milano Sud & Navigli',
    state: 'MI',
    suburbs: ['Navigli & Porta Ticinese', 'Darsena & Tortona', 'Porta Romana & Crocetta', 'Bocconi & Guastalla'],
  },
  {
    city: 'Monza & Brianza',
    state: 'MB',
    suburbs: ['Monza Centro & Villa Reale', 'Monza Parco & Sobborghi', 'Sesto San Giovanni', 'San Donato Milanese'],
  },
];

const FORMATS = [
  { id: 'DL', name: 'DL Flyer (99 x 210mm)', desc: 'Standard letterbox format · High open rate' },
  { id: 'A5', name: 'A5 Card (148 x 210mm)', desc: 'Double impact · Ideal for property auctions' },
  { id: 'A4_FOLD', name: 'A4 Folded to DL', desc: '4-6 page luxury presentation for prestige developments' },
];

const PAPER_STOCKS = [
  { id: '150_gloss', name: '150 GSM Gloss', desc: 'Lightweight & cost-efficient', mult: 1.0 },
  { id: '250_silk', name: '250 GSM Premium Silk', desc: 'Agent standard · Sturdy & tactile', mult: 1.25, popular: true },
  { id: '350_card', name: '350 GSM Heavy Luxury', desc: 'Rigid postcard weight with velvet finish', mult: 1.55 },
];

export const CampaignCalculator: React.FC<CampaignCalculatorProps> = ({ onOpenOrder }) => {
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [selectedSuburb, setSelectedSuburb] = useState(REGIONS[0].suburbs[0]);
  const [quantity, setQuantity] = useState(10000);
  const [serviceType, setServiceType] = useState<'print_and_deliver' | 'deliver_only'>('print_and_deliver');
  const [format, setFormat] = useState('DL');
  const [paperStock, setPaperStock] = useState('250_silk');
  const [isSoloDrop, setIsSoloDrop] = useState(false);

  const currentRegion = REGIONS[selectedCityIndex];

  // Pricing calculations:
  // Base delivery rate per 1,000 drops (scaled with volume)
  let baseDeliveryRatePer1000 = 98; // $98 per 1,000 flyers
  if (quantity >= 20000) baseDeliveryRatePer1000 = 86;
  if (quantity >= 40000) baseDeliveryRatePer1000 = 79;
  if (quantity <= 5000) baseDeliveryRatePer1000 = 115;

  // Solo drop exclusivity surcharge
  if (isSoloDrop) {
    baseDeliveryRatePer1000 += 38;
  }

  // Printing cost per 1,000 (if print & deliver is active)
  let basePrintRatePer1000 = 42;
  if (format === 'A5') basePrintRatePer1000 = 54;
  if (format === 'A4_FOLD') basePrintRatePer1000 = 74;

  const stockObj = PAPER_STOCKS.find(s => s.id === paperStock);
  const stockMult = stockObj ? stockObj.mult : 1.0;
  const finalPrintRatePer1000 = serviceType === 'print_and_deliver' ? basePrintRatePer1000 * stockMult : 0;

  const totalRatePer1000 = baseDeliveryRatePer1000 + finalPrintRatePer1000;
  const totalPrice = Math.round((quantity / 1000) * totalRatePer1000);
  const pricePerUnit = (totalPrice / quantity).toFixed(3);
  const priceWithGst = Math.round(totalPrice * 1.1);

  const handleCityChange = (idx: number) => {
    setSelectedCityIndex(idx);
    setSelectedSuburb(REGIONS[idx].suburbs[0]);
  };

  const handleProceed = () => {
    onOpenOrder({
      city: currentRegion.city,
      suburb: selectedSuburb,
      quantity,
      serviceType,
      format,
      paperStock,
      isSoloDrop,
      totalPrice,
      pricePerUnit: parseFloat(pricePerUnit),
    });
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - REALREACH Pricing */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-blue-600 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Instant Suburb Pricing</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500">No Quotes Needed</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
            Pay per delivery, not per month
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
            Select your audience by suburbs and streets using our mapping tool. Get instant pricing with no quotes needed and zero monthly subscriptions.
          </p>
        </div>

        {/* 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Parameters (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm">
            
            {/* Step 1: City & Suburb Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                01. Select Metro Market & Suburb
              </label>
              
              {/* City Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {REGIONS.map((region, idx) => (
                  <button
                    key={region.city}
                    onClick={() => handleCityChange(idx)}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      selectedCityIndex === idx
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div>{region.city}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{region.state}</div>
                  </button>
                ))}
              </div>

              {/* Suburb Dropdown */}
              <div className="relative">
                <select
                  value={selectedSuburb}
                  onChange={(e) => setSelectedSuburb(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600 cursor-pointer appearance-none"
                >
                  {currentRegion.suburbs.map((suburb) => (
                    <option key={suburb} value={suburb} className="bg-white text-slate-900">
                      {suburb}
                    </option>
                  ))}
                  <option value="Custom Postcode Cluster" className="bg-white text-slate-900">
                    Custom Postcode Cluster (Specify on Next Step)
                  </option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Step 2: Distribution Volume */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  02. Target Letterboxes
                </label>
                <span className="font-mono text-base font-extrabold text-blue-600 tabular-nums">
                  {quantity.toLocaleString()} Homes
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="2500"
                max="50000"
                step="2500"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              {/* Preset quick buttons */}
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {[5000, 10000, 20000, 35000, 50000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setQuantity(preset)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                      quantity === preset
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Service Scope */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                03. Choose Service Type
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setServiceType('print_and_deliver')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                    serviceType === 'print_and_deliver'
                      ? 'bg-blue-50/70 border-blue-600 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-950 flex items-center gap-1.5">
                      <Printer className="w-4 h-4 text-blue-600" />
                      Print & Deliver
                    </span>
                    <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Turnkey
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    Turnkey offset printing in Milan + bundled distribution. Best total value.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('deliver_only')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    serviceType === 'deliver_only'
                      ? 'bg-blue-50/70 border-blue-600 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-950 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-blue-600" />
                      Distribution Only
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    You provide printed collateral. Drop off at our Milan dispatch hub.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 4: Paper Stock (Shown only when Print & Deliver is selected) */}
            {serviceType === 'print_and_deliver' && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    04. Brochure Format
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {FORMATS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFormat(f.id)}
                        className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                          format === f.id
                            ? 'bg-blue-50 border-blue-600 text-slate-900 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold text-slate-900">{f.name}</div>
                        <div className="text-[10px] text-slate-500 mt-1 leading-tight">{f.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    05. Paper Weight & Finish
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PAPER_STOCKS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setPaperStock(s.id)}
                        className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                          paperStock === s.id
                            ? 'bg-blue-50 border-blue-600 text-slate-900 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold text-slate-900 flex items-center justify-between">
                          <span>{s.name}</span>
                          {s.popular && (
                            <span className="text-[9px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-bold">
                              Agency Standard
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 leading-tight">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Exclusive Solo Drop Toggle */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">Guaranteed Solo Drop Exclusivity</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Your flyer delivered alone into letterboxes — no competitor or supermarket flyers in the same drop.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSoloDrop(!isSoloDrop)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isSoloDrop ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={isSoloDrop}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isSoloDrop ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Right Column: Binding Instant Quote Summary (5 Cols) */}
          <div className="lg:col-span-5 sticky top-28 bg-white border border-slate-200 p-6 sm:p-7 rounded-2xl shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold">
                  REALREACH GUARANTEE
                </span>
                <h3 className="text-xl font-bold text-slate-950 mt-0.5">Campaign Summary</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                EUR Currency (€)
              </span>
            </div>

            {/* Itemized breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Target Territory</span>
                <span className="font-semibold text-slate-900 text-right">{selectedSuburb}, {currentRegion.city}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Households Reached</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{quantity.toLocaleString()} Homes</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Service Package</span>
                <span className="font-semibold text-blue-600">
                  {serviceType === 'print_and_deliver' ? 'Offset Print + GPS Distribution' : 'GPS Distribution Only'}
                </span>
              </div>

              {serviceType === 'print_and_deliver' && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Stock & Format</span>
                  <span className="font-semibold text-slate-800">{format} · {stockObj?.name}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Drop Exclusivity</span>
                <span className="font-semibold text-slate-800">
                  {isSoloDrop ? '100% Solo Drop (Exclusive)' : 'Standard Distribution'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Live GPS Tracking & Audit</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Included Free
                </span>
              </div>
            </div>

            {/* Total Highlight Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Cost per letterbox:</span>
                <span className="font-mono text-blue-600 font-bold tabular-nums">
                  €{pricePerUnit} / home
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1 border-t border-slate-200">
                <div>
                  <div className="text-xs font-semibold text-slate-700">Total Investment</div>
                  <div className="text-[10px] text-slate-400">Excludes IVA</div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tabular-nums">
                  €{totalPrice.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Total inc. 22% IVA:</span>
                <span className="font-mono font-medium text-slate-800">€{Math.round(totalPrice * 1.22).toLocaleString()} EUR</span>
              </div>
            </div>

            {/* Timing & Vendor value estimation */}
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Turnaround: Print within 24h · Delivery in 48-72h</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Vendor Reporting: Shareable live tracking link included</span>
              </div>
            </div>

            {/* Proceed CTA Button */}
            <button
              onClick={handleProceed}
              className="w-full py-4 px-6 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-150 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Create a campaign now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-[11px] text-center text-slate-500">
              No credit card required upfront · Invoiced on booking confirmation
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CampaignCalculator;
