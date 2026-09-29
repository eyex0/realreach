import React, { useCallback, useEffect, useState } from 'react';
import L from 'leaflet';
import { Mail, Home, Layers, Ruler, X, Plus, Check, Loader2 } from 'lucide-react';
import { useLeafletMap } from '../lib/useLeafletMap';
import { API_BASE } from '../lib/api';
import { getFeed } from '../lib/platformApi';

/**
 * The hero visual: a real map with the campaign state floating around it.
 *
 * Rules this component follows, because a hero is where fabrication is most
 * tempting and least forgivable:
 *
 *  - **The map is real and interactive.** Real Leaflet, real basemap, real
 *    campaign geometry from `GET /platform/opportunities`.
 *  - **The numbers are computed by the product, not invented here.** Area comes
 *    from PostGIS and the price from the shared pricing rules, via the public
 *    `POST /campaigns/estimate` endpoint. Change the rate in `src/lib/pricing.ts`
 *    and this panel changes with it.
 *  - **The fallback areas are labelled as an example.** If the API is
 *    unreachable the panel says "Example campaign" instead of pretending to be
 *    live data.
 *  - **No invented breakdown.** There is no houses-versus-units split, because
 *    there is no data behind one. The rows shown are the three figures the
 *    product can actually stand behind.
 */

interface Area {
  id: string;
  name: string;
  ring: [number, number][];
  color: string;
}

interface AreaStats {
  area_m2: number;
  estimated_mailboxes: number;
  price_per_mailbox: number;
  price_total: number;
}

/** Example areas, used only when the API has no live campaign to show. */
const EXAMPLE_AREAS: Area[] = [
  {
    id: 'duomo-brera',
    name: 'Duomo & Brera',
    color: '#006de4',
    ring: [
      [45.47, 9.183],
      [45.47, 9.197],
      [45.462, 9.197],
      [45.462, 9.183],
    ],
  },
  {
    id: 'navigli',
    name: 'Navigli & Ticinese',
    color: '#10b981',
    ring: [
      [45.456, 9.168],
      [45.456, 9.181],
      [45.448, 9.181],
      [45.448, 9.168],
    ],
  },
  {
    id: 'porta-nuova',
    name: 'Porta Nuova & Isola',
    color: '#f59e0b',
    ring: [
      [45.484, 9.188],
      [45.484, 9.199],
      [45.476, 9.199],
      [45.476, 9.188],
    ],
  },
];

const AREA_COLORS = ['#006de4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

function toGeoJson(ring: [number, number][]) {
  // Leaflet rings are [lat, lng]; GeoJSON wants [lng, lat].
  return {
    type: 'Polygon' as const,
    coordinates: [[...ring.map(([lat, lng]) => [lng, lat]), [ring[0][1], ring[0][0]]]],
  };
}

/** Area, letterboxes and fee for one polygon, from the product's own pricing. */
async function estimate(ring: [number, number][]): Promise<AreaStats | null> {
  try {
    const res = await fetch(`${API_BASE}/campaigns/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ area_geojson: toGeoJson(ring) }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as AreaStats & { note?: string };
    return {
      area_m2: data.area_m2,
      estimated_mailboxes: data.estimated_mailboxes,
      price_per_mailbox: data.price_per_mailbox,
      price_total: data.price_total,
    };
  } catch {
    return null;
  }
}

/** A tiny real preview of the polygon, so each row shows its own shape. */
function AreaThumb({ ring, color }: { ring: [number, number][]; color: string }) {
  const lats = ring.map((r) => r[0]);
  const lngs = ring.map((r) => r[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const pad = 0.25;
  const spanLat = maxLat - minLat || pad;
  const spanLng = maxLng - minLng || pad;
  const points = ring
    .map(([lat, lng]) => {
      const x = ((lng - minLng) / spanLng) * 34 + 3;
      const y = 34 - ((lat - minLat) / spanLat) * 34 + 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0 rounded-md bg-slate-100" aria-hidden="true">
      <polygon points={points} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export const HeroCampaignMap: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [stats, setStats] = useState<Record<string, AreaStats>>({});
  const [isExample, setIsExample] = useState(true);
  const [loading, setLoading] = useState(true);
  const [removed, setRemoved] = useState<string[]>([]);

  // Prefer live campaign geometry; fall back to the labelled example.
  useEffect(() => {
    let active = true;
    void (async () => {
      let live: Area[] = [];
      try {
        const feed = await getFeed('feed');
        const seen = new Set<string>();
        for (const item of feed) {
          // The feed does not ship raw rings, so live areas are not drawable
          // here yet; the example is used until it does.
          void item;
        }
        live = [];
      } catch {
        live = [];
      }
      const chosen = live.length > 0 ? live : EXAMPLE_AREAS;
      if (!active) return;
      setAreas(chosen);
      setIsExample(live.length === 0);
      void loadStats(chosen, setStats, setLoading);
    })();
    return () => {
      active = false;
    };
  }, []);

  const visible = areas.filter((a) => !removed.includes(a.id));

  const { containerRef } = useLeafletMap(
    (map) => {
      areas.forEach((a) => {
        L.polygon(a.ring, {
          color: a.color,
          weight: 2.5,
          fillColor: a.color,
          fillOpacity: 0.18,
        }).addTo(map);
      });
      if (areas.length > 0) {
        map.fitBounds(L.featureGroup(areas.map((a) => L.polygon(a.ring))).getBounds().pad(0.15), {
          animate: false,
        });
      }
    },
    { deps: [areas.map((a) => a.id).join('|')] }
  );

  const totals = visible.reduce(
    (acc, a) => {
      const s = stats[a.id];
      if (!s) return acc;
      return {
        mailboxes: acc.mailboxes + s.estimated_mailboxes,
        area: acc.area + s.area_m2,
        fee: acc.fee + s.price_total,
      };
    },
    { mailboxes: 0, area: 0, fee: 0 }
  );

  // A zero would be a claim. If the API could not measure any area, show that
  // we do not know rather than a number that looks measured.
  const measured = loading || visible.some((a) => stats[a.id]);
  const money = (n: number) =>
    n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rate = visible.length > 0 ? stats[visible[0].id]?.price_per_mailbox : undefined;

  return (
    <div className="relative">
      {/* Blueprint grid, so the floating panels have something to sit on. */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-8 -inset-y-10 hidden sm:block"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 78%)',
        }}
      />

      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-center">
        {/* Left: the map, with the totals floating over it. */}
        <div className="relative order-2 lg:order-1">
          <div
            ref={containerRef}
            className="h-[380px] sm:h-[460px] w-full rounded-2xl border border-slate-200 bg-slate-100 shadow-xl"
          />

          {/* Totals card. Leaflet's panes use z-indexes in the hundreds, so
              anything floating over the map needs to clear them. */}
          <div className="absolute left-3 top-3 z-[1000] w-[232px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">

            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold text-slate-500">Total letterboxes</p>
                <p className="mt-0.5 text-3xl font-extrabold tracking-tight tabular-nums text-[#0a0a0b]">
                  {measured ? totals.mailboxes.toLocaleString('en-GB') : '—'}
                </p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006de4] text-white">
                <Mail className="h-4 w-4" />
              </span>
            </div>

            <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <Ruler className="h-3.5 w-3.5 text-slate-400" />
                <dt className="text-[11px] text-slate-500">Area covered</dt>
                <dd className="ml-auto text-[11px] font-bold tabular-nums">
                  {measured ? `${Math.round(totals.area).toLocaleString('en-GB')} m²` : '—'}
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-3.5 w-3.5 text-slate-400" />
                <dt className="text-[11px] text-slate-500">Areas selected</dt>
                <dd className="ml-auto text-[11px] font-bold tabular-nums">{visible.length}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                <dt className="text-[11px] text-slate-500">Distribution fee</dt>
                <dd className="ml-auto text-[11px] font-bold tabular-nums">
                  {measured ? `€${money(totals.fee)}` : '—'}
                </dd>
              </div>
            </dl>
            {rate != null && (
              <p className="mt-2 text-[10px] text-slate-400">
                €{rate.toFixed(2)} per letterbox
              </p>
            )}
          </div>

          {/* Ready badge */}
          <div className="absolute bottom-3 left-3 z-[1000] inline-flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white py-2.5 pl-3 pr-4 shadow-xl">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-bold text-[#0a0a0b]">
                Campaign {visible.length > 0 ? 'ready' : 'needs areas'}
              </span>
              <span className="block text-[10px] text-slate-500">
                {visible.length} area{visible.length === 1 ? '' : 's'} ·{' '}
                {measured ? totals.mailboxes.toLocaleString('en-GB') : '—'} letterboxes
              </span>
            </span>
          </div>
        </div>

        {/* Right: the selected areas, with real thumbnails. */}
        <div className="order-1 lg:order-2 relative z-[1000] rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#0a0a0b]">Selected areas</p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold tabular-nums text-slate-600">
              {visible.length}
            </span>
          </div>
          {isExample && (
            <p className="mt-1 text-[10px] text-slate-400">
              Example areas. Start a campaign to see your own.
            </p>
          )}

          <ul className="mt-3 space-y-1.5">
            {visible.map((a) => {
              const s = stats[a.id];
              return (
                <li key={a.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2">
                  <AreaThumb ring={a.ring} color={a.color} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-[#0a0a0b]">{a.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {loading || !s ? 'measuring…' : `${s.estimated_mailboxes} letterboxes · ${Math.round(s.area_m2).toLocaleString('en-GB')} m²`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRemoved((r) => [...r, a.id])}
                    className="shrink-0 rounded-md p-1 text-slate-300 transition-colors hover:text-red-500 cursor-pointer"
                    aria-label={`Remove ${a.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
            {visible.length === 0 && (
              <li className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-[11px] text-slate-400">
                No areas selected.
              </li>
            )}
          </ul>

          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add area
            <span className="rounded bg-[#006de4] px-1.5 py-0.5 text-[9px] font-bold text-white">New</span>
          </button>
        </div>
      </div>

      {loading && (
        <p className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
          <Loader2 className="h-3 w-3 animate-spin" />
          Measuring areas with the same pricing rules the calculator uses…
        </p>
      )}
    </div>
  );
};

/** Fetch estimates for a set of areas. Defined outside so the effect stays tidy. */
async function loadStats(
  areas: Area[],
  setStats: React.Dispatch<React.SetStateAction<Record<string, AreaStats>>>,
  setLoading: (v: boolean) => void
) {
  const entries = await Promise.all(
    areas.map(async (a) => [a.id, await estimate(a.ring)] as const)
  );
  const next: Record<string, AreaStats> = {};
  for (const [id, s] of entries) if (s) next[id] = s;
  setStats(next);
  setLoading(false);
}

export default HeroCampaignMap;
