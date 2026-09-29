import React, { useState } from 'react';
import VolumeEstimationCard from '../components/VolumeEstimationCard';
import CampaignCalculator from '../components/CampaignCalculator';
import { CampaignData } from '../components/OrderModal';
import { estimateCampaign, PriceEstimate } from '../lib/api';
import { Zap, Loader2 } from 'lucide-react';

interface PricingPageProps {
  onOpenOrderWithData: (data: CampaignData) => void;
  onOpenOrderWithVolume: (volume?: string) => void;
}

// Approximate demo boundaries (rectangles) for the calculator zones.
// Real zone polygons come with map drawing — these exist so the
// backend estimate can be tried end-to-end today.
const ZONE_BOUNDARIES: { name: string; rings: number[][][] }[] = [
  {
    name: 'Milano Centro & Nord',
    rings: [[[9.18, 45.46], [9.205, 45.46], [9.205, 45.485], [9.18, 45.485], [9.18, 45.46]]],
  },
  {
    name: 'Milano Ovest & CityLife',
    rings: [[[9.14, 45.46], [9.175, 45.46], [9.175, 45.49], [9.14, 45.49], [9.14, 45.46]]],
  },
  {
    name: 'Milano Sud & Navigli',
    rings: [[[9.17, 45.435], [9.2, 45.435], [9.2, 45.46], [9.17, 45.46], [9.17, 45.435]]],
  },
  {
    name: 'Monza & Brianza',
    rings: [[[9.27, 45.575], [9.3, 45.575], [9.3, 45.6], [9.27, 45.6], [9.27, 45.575]]],
  },
];

const LiveEstimatePanel: React.FC = () => {
  const [zoneIdx, setZoneIdx] = useState(0);
  const [result, setResult] = useState<PriceEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runEstimate = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const est = await estimateCampaign(ZONE_BOUNDARIES[zoneIdx].rings);
      setResult(est);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Estimate failed. Is the API running on :4000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#006de4]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a0a0b] tracking-tight">
              Live backend estimate
            </h2>
          </div>
          <p className="mt-2 text-sm text-[#4b5563]">
            Real PostGIS area computation from the Realreach API — pick a zone and run it.
            Boundaries are approximate demo rectangles until map drawing ships.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <select
              value={zoneIdx}
              onChange={(e) => setZoneIdx(Number(e.target.value))}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-black cursor-pointer"
            >
              {ZONE_BOUNDARIES.map((z, i) => (
                <option key={z.name} value={i}>
                  {z.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={runEstimate}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a0a0b] text-white px-6 py-3 text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{loading ? 'Computing…' : 'Run live estimate'}</span>
            </button>
          </div>

          {error && (
            <p className="mt-4 text-xs font-medium text-red-600">
              {error} (Start the API: backend folder → node dist/index.js)
            </p>
          )}

          {result && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
              <div className="rounded-xl bg-white border border-slate-200 p-3.5">
                <p className="text-[11px] text-slate-500 font-medium">Area</p>
                <p className="text-lg font-bold font-mono">{result.area_m2.toLocaleString()} m²</p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-3.5">
                <p className="text-[11px] text-slate-500 font-medium">Letterboxes</p>
                <p className="text-lg font-bold font-mono">~{result.estimated_mailboxes.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-3.5">
                <p className="text-[11px] text-slate-500 font-medium">Per mailbox</p>
                <p className="text-lg font-bold font-mono">€{result.price_per_mailbox}</p>
              </div>
              <div className="rounded-xl bg-[#0a0a0b] text-white p-3.5">
                <p className="text-[11px] text-neutral-400 font-medium">Total</p>
                <p className="text-lg font-bold font-mono">€{result.price_total.toLocaleString()}</p>
              </div>
              <p className="col-span-2 sm:col-span-4 text-[11px] text-slate-400">
                Computed live by the API (PostGIS). Mailbox density is a placeholder until real Milan data ships.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const PricingPage: React.FC<PricingPageProps> = ({
  onOpenOrderWithData,
  onOpenOrderWithVolume,
}) => {
  return (
    <div className="flex-1">
      <VolumeEstimationCard onOpenOrder={onOpenOrderWithVolume} />
      <CampaignCalculator onOpenOrder={onOpenOrderWithData} />
      <LiveEstimatePanel />
    </div>
  );
};

export default PricingPage;
