import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useLeafletMap } from '../lib/useLeafletMap';
import { API_BASE } from '../lib/api';

interface MapCampaign {
  id: string;
  title: string;
  status: string;
  area: { type: 'Polygon'; coordinates: number[][][] } | null;
  area_m2: number;
  tasks_total: number;
  by_status: Record<string, number>;
}

interface MapFeed {
  campaigns: MapCampaign[];
  active_runners: number;
  recent_run: {
    distance_km: number;
    duration_minutes: number;
    points: { lat: number; lon: number }[];
  } | null;
  track_usable: boolean;
}

interface Zone {
  name: string;
  meta: string;
  color: string;
  rings: [number, number][];
}

// Shown only while the API is unreachable, so a visitor never sees an empty
// map. The landing page is public and the API may well be down.
const FALLBACK_ZONES: Zone[] = [
  {
    name: 'Duomo & Brera',
    meta: '2,900 letterboxes · €412.40',
    color: '#006de4',
    rings: [
      [45.47, 9.183],
      [45.47, 9.197],
      [45.462, 9.197],
      [45.462, 9.183],
    ],
  },
  {
    name: 'Navigli & Ticinese',
    meta: '5,200 letterboxes · €756.00',
    color: '#10b981',
    rings: [
      [45.456, 9.168],
      [45.456, 9.181],
      [45.448, 9.181],
      [45.448, 9.168],
    ],
  },
  {
    name: 'Porta Nuova & Isola',
    meta: '3,100 letterboxes · €449.50',
    color: '#f59e0b',
    rings: [
      [45.484, 9.188],
      [45.484, 9.199],
      [45.476, 9.199],
      [45.476, 9.188],
    ],
  },
];

const REFRESH_MS = 60_000;
const FETCH_TIMEOUT_MS = 4_000;

/** Darkest state first: a campaign with approved work reads as "done". */
function campaignColor(c: MapCampaign): string {
  const by = c.by_status ?? {};
  if ((by.approved ?? 0) > 0) return '#10b981';
  if ((by.submitted ?? 0) > 0 || (by.in_progress ?? 0) > 0) return '#006de4';
  return '#f59e0b';
}

function statusLine(c: MapCampaign): string {
  const by = c.by_status ?? {};
  const parts = Object.entries(by).map(([k, v]) => `${v} ${k.replace('_', ' ')}`);
  return parts.length ? parts.join(' · ') : 'no tasks yet';
}

export const RealMilanMap: React.FC = () => {
  const [feed, setFeed] = useState<MapFeed | null>(null);
  const groupRef = useRef<L.LayerGroup | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const framedRef = useRef<'live' | 'fallback' | null>(null);

  const { containerRef, mapRef } = useLeafletMap((map) => {
    groupRef.current = L.layerGroup().addTo(map);
  });
  mapInstanceRef.current = mapRef.current;

  // Live feed, with the static zones as the fallback while it loads.
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/map/live`, { signal: controller.signal });
        if (!res.ok) return;
        const data = (await res.json()) as MapFeed;
        if (!cancelled) setFeed(data);
      } catch {
        // Offline or API down: keep whatever is already drawn.
      } finally {
        clearTimeout(timer);
      }
    };

    load();
    const poll = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearTimeout(poll);
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  // Draw either the live campaigns or the fallback zones.
  useEffect(() => {
    const map = mapRef.current;
    const group = groupRef.current;
    if (!map || !group) return;
    group.clearLayers();

    const liveCampaigns = (feed?.campaigns ?? []).filter((c) => c.area);
    const drawn: L.Layer[] = [];

    if (liveCampaigns.length > 0) {
      liveCampaigns.forEach((c) => {
        // GeoJSON rings are [lon, lat]; Leaflet wants [lat, lon].
        const rings = (c.area!.coordinates[0] as number[][])
          .map(([lon, lat]) => [lat, lon] as [number, number])
          .filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90);
        if (rings.length < 3) return;
        const color = campaignColor(c);
        const polygon = L.polygon(rings, {
          color,
          weight: 2.5,
          fillColor: color,
          fillOpacity: 0.16,
        })
          .addTo(group)
          .bindPopup(
            `<b>${c.title}</b><br/>${statusLine(c)}<br/>${c.area_m2.toLocaleString()} m²`,
          )
          .on('mouseover', (e) => {
            (e.target as L.Polygon).setStyle({ fillOpacity: 0.32, weight: 3.5 });
          })
          .on('mouseout', (e) => {
            (e.target as L.Polygon).setStyle({ fillOpacity: 0.16, weight: 2.5 });
          });
        drawn.push(polygon);
      });
    } else {
      FALLBACK_ZONES.forEach((z) => {
        drawn.push(
          L.polygon(z.rings, {
            color: z.color,
            weight: 2.5,
            fillColor: z.color,
            fillOpacity: 0.14,
          })
            .addTo(group)
            .bindPopup(`<b>${z.name}</b><br/>${z.meta}`),
        );
      });
    }

    const run = feed?.recent_run;
    if (feed?.track_usable && run && run.points.length >= 2) {
      const path = run.points.map((p) => [p.lat, p.lon] as [number, number]);
      drawn.push(
        L.polyline(path, { color: '#0a0a0b', weight: 4, opacity: 0.75 }).addTo(group),
        L.polyline(path, { color: '#10b981', weight: 2.5, dashArray: '6 5' }).addTo(group),
        L.circleMarker(path[0], { radius: 5, color: '#fff', weight: 2, fillColor: '#0a0a0b', fillOpacity: 1 })
          .addTo(group)
          .bindPopup('Start'),
        L.circleMarker(path[path.length - 1], {
          radius: 7,
          color: '#fff',
          weight: 2,
          fillColor: '#10b981',
          fillOpacity: 1,
        })
          .addTo(group)
          .bindPopup(
            `<b>Last verified run</b><br/>${run.distance_km} km · ${run.duration_minutes} min`,
          ),
      );
    }

    // Frame whatever we just drew. The first paint uses the wide fallback
    // zones, so reframe once the real (much smaller) campaign geometry lands,
    // otherwise the live data renders as a speck in the corner.
    if (drawn.length > 0) {
      const source = liveCampaigns.length > 0 ? 'live' : 'fallback';
      if (framedRef.current !== source) {
        map.fitBounds(L.featureGroup(drawn).getBounds().pad(0.12), { animate: false });
        framedRef.current = source;
      }
    }
  }, [feed, mapRef]);

  const live = feed !== null;
  const run = feed?.recent_run;
  const badge = live
    ? feed!.active_runners > 0
      ? `Milano · ${feed!.active_runners} runner${feed!.active_runners === 1 ? '' : 's'} active`
      : run
        ? `Milano · last run ${run.distance_km} km`
        : 'Milano · live campaign data'
    : 'Milano · showing demo zones';

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
      <div
        ref={containerRef}
        className="h-[380px] sm:h-[460px] w-full z-0 bg-slate-100"
      />
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold shadow border border-slate-200">
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              live ? 'bg-emerald-400' : 'bg-slate-300'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              live ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          />
        </span>
        {badge}
      </div>
      <div className="pointer-events-none absolute left-3 bottom-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-500 shadow border border-slate-200">
        {live ? 'Live campaign geometry' : 'Real map · demo zones'}
      </div>
    </div>
  );
};

export default RealMilanMap;
