import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Globe2, Crosshair, Loader2 } from 'lucide-react';

/**
 * The production delivery map.
 *
 * Basemap notes, because this is the part that quietly breaks a deployment:
 *
 *  - **Light grey vector-style raster**, from OSM data served by Esri's Canvas
 *    Light Gray, with the separate Reference layer for street labels. Both are
 *    keyless, which is why there is no API key to leak or rotate.
 *  - **Aerial** is Esri World Imagery. It carries a required attribution and
 *    Esri's terms cover non-commercial and development use; a commercial launch
 *    needs either an Esri account or a different imagery source. Flagged rather
 *    than hidden, because it is the one licence in this component that is not
 *    freely redistributable.
 *  - **maxZoom differs per layer** (19 raster, 18 imagery). A single maxZoom is
 *    the classic cause of blurry or missing tiles at city zoom.
 *  - `detectRetina` so the map is sharp on the phones the field team uses.
 */

const LIGHT_TILES =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const LIGHT_LABELS =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}';
const AERIAL_TILES =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const OSM_ATTR =
  'Tiles &copy; <a href="https://www.esri.com/">Esri</a> · Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Speed bands, matching src/lib/routeSpeed.ts on the API side. */
const SPEED_COLOURS: Record<string, string> = {
  stationary: '#94a3b8',
  normal: '#10b981',
  slightly_fast: '#f59e0b',
  very_fast: '#ef4444',
  extremely_fast: '#7c3aed',
};

export interface MapArea {
  id: string;
  seq: number | null;
  name: string | null;
  cap: string | null;
  status: string;
  distributor: string | null;
  letterboxes: number | null;
  pieces: number;
  area: { type: string; coordinates: number[][][] } | null;
  route: { lat: number; lng: number; at: string; accuracy: number | null }[];
}

export interface MapCampaign {
  id: string;
  title: string;
  status: string;
  client_name: string | null;
  areas: MapArea[];
  areas_done: number;
  areas_total: number;
  letterboxes: number;
}

const PROGRESS_COLOUR = (done: number, total: number) =>
  total === 0 ? '#94a3b8' : done >= total ? '#10b981' : done > 0 ? '#006de4' : '#f59e0b';

function haversine(a: [number, number], b: [number, number]): number {
  const R = 6_371_008.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Colour a recorded track by walking pace, using the same bands as the API. */
function speedBand(kmh: number): string {
  if (kmh <= 1.5) return 'stationary';
  if (kmh <= 8) return 'normal';
  if (kmh <= 12) return 'slightly_fast';
  if (kmh <= 18) return 'very_fast';
  return 'extremely_fast';
}

function routeSegments(points: MapArea['route']) {
  const segments: { band: string; latlngs: [number, number][] }[] = [];
  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1];
    const to = points[i];
    const seconds = (new Date(to.at).getTime() - new Date(from.at).getTime()) / 1000;
    if (seconds <= 0) continue;
    const kmh =
      (haversine([from.lat, from.lng], [to.lat, to.lng]) / 1000 / seconds) * 3600;
    const band = speedBand(kmh);
    const last = segments[segments.length - 1];
    if (last && last.band === band) last.latlngs.push([to.lat, to.lng]);
    else segments.push({ band, latlngs: [[from.lat, from.lng], [to.lat, to.lng]] });
  }
  return segments;
}

export function DeliveryMap({
  campaigns,
  height = 520,
  onSelectCampaign,
}: {
  campaigns: MapCampaign[];
  height?: number;
  onSelectCampaign?: (id: string) => void;
}) {
  const [aerial, setAerial] = useState(false);
  const [busy, setBusy] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const baseRef = useRef<L.LayerGroup | null>(null);
  const dataRef = useRef<L.LayerGroup | null>(null);
  // Leaflet's LayerGroup has no bounds, so the drawn extent is kept here for
  // the recentre control.
  const boundsRef = useRef<L.LatLngBounds | null>(null);

  // Build the map once. Rebuilt only if Leaflet was handed a dead container.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [45.4642, 9.19],
      zoom: 12,
      zoomControl: false,
      preferCanvas: true,
      attributionControl: true,
    });
    mapRef.current = map;
    baseRef.current = L.layerGroup().addTo(map);
    dataRef.current = L.layerGroup().addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    setBusy(false);
    return () => {
      map.remove();
      mapRef.current = null;
      baseRef.current = null;
      dataRef.current = null;
    };
  }, []);

  // Basemap swap. Aerial has its own maxZoom, so the tile URL and the layer
  // options change together.
  useEffect(() => {
    const base = baseRef.current;
    if (!base) return;
    base.clearLayers();
    L.tileLayer(aerial ? AERIAL_TILES : LIGHT_TILES, {
      maxZoom: aerial ? 18 : 19,
      maxNativeZoom: aerial ? 18 : 19,
      detectRetina: true,
      attribution: OSM_ATTR,
    }).addTo(base);
    if (aerial) {
      L.tileLayer(LIGHT_LABELS, { maxZoom: 19, detectRetina: true, opacity: 0 }).addTo(base);
    } else {
      L.tileLayer(LIGHT_LABELS, { maxZoom: 19, detectRetina: true, attribution: OSM_ATTR }).addTo(base);
    }
  }, [aerial]);

  // Draw the campaigns, their areas and any recorded route.
  useEffect(() => {
    const data = dataRef.current;
    if (!data) return;
    data.clearLayers();
    const bounds = L.latLngBounds([]);

    for (const campaign of campaigns) {
      const colour = PROGRESS_COLOUR(campaign.areas_done, campaign.areas_total);

      for (const area of campaign.areas) {
        if (!area.area) continue;
        // GeoJSON is [lng, lat]; Leaflet is [lat, lng].
        const rings = area.area.coordinates.map((ring) =>
          ring.map(([lng, lat]) => [lat, lng] as [number, number])
        );
        const poly = L.polygon(rings, {
          color: colour,
          weight: 2,
          fillColor: colour,
          fillOpacity: 0.18,
        }).addTo(data);
        bounds.extend(poly.getBounds());

        const label = `${area.name ?? `Area ${area.seq ?? ''}`}${area.cap ? ` · ${area.cap}` : ''}`;
        poly.bindPopup(
          `<b>${campaign.title}</b><br/>${label}<br/>` +
            `Stato: ${area.status}${area.distributor ? `<br/>Distributore: ${area.distributor}` : ''}` +
            (area.letterboxes ? `<br/>Volantini: ${area.letterboxes}` : '')
        );

        if (area.route.length > 1) {
          for (const seg of routeSegments(area.route)) {
            L.polyline(seg.latlngs, {
              color: SPEED_COLOURS[seg.band],
              weight: 4,
              opacity: 0.95,
            }).addTo(data);
          }
        }
      }
    }

    if (bounds.isValid()) {
      mapRef.current?.fitBounds(bounds.pad(0.15), { animate: false, maxZoom: 16 });
    }
  }, [campaigns]);

  const empty = campaigns.length === 0;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div ref={containerRef} style={{ height }} className="w-full bg-slate-100" />

      {busy && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        </div>
      )}

      {empty && !busy && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="rounded-xl bg-white/90 px-4 py-2 text-xs font-semibold text-slate-600 shadow">
            Nessuna campagna da mostrare
          </p>
        </div>
      )}

      {/* Layer switch: light grey / aerial */}
      <button
        type="button"
        onClick={() => setAerial((v) => !v)}
        title={aerial ? 'Mappa chiara' : 'Satellitare'}
        aria-label={aerial ? 'Switch to light map' : 'Switch to satellite imagery'}
        className="absolute right-3 top-3 z-[1000] flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:text-slate-900 cursor-pointer"
      >
        <Globe2 className="h-4 w-4" />
      </button>

      {/* Recentre */}
      <button
        type="button"
        onClick={() => {
          const map = mapRef.current;
          if (!map) return;
          const drawn = boundsRef.current;
          if (drawn?.isValid()) map.fitBounds(drawn.pad(0.15), { animate: true });
          else map.setView([45.4642, 9.19], 12);
        }}
        title="Ricentra"
        aria-label="Recentre the map"
        className="absolute right-3 top-12 z-[1000] flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:text-slate-900 cursor-pointer"
      >
        <Crosshair className="h-4 w-4" />
      </button>

      {/* Legend, only when there is a route to explain. */}
      {campaigns.some((c) => c.areas.some((a) => a.route.length > 1)) && (
        <ul className="absolute bottom-8 left-3 z-[1000] space-y-1 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-sm">
          {[
            ['normal', 'Andatura normale'],
            ['slightly_fast', 'Un po\u2019 veloce'],
            ['very_fast', 'Molto veloce'],
            ['extremely_fast', 'Estremo (18 km/h+)'],
          ].map(([band, label]) => (
            <li key={band} className="flex items-center gap-2 text-[10px] font-semibold text-slate-600">
              <span className="h-2.5 w-6 rounded-sm" style={{ backgroundColor: SPEED_COLOURS[band] }} />
              {label}
            </li>
          ))}
        </ul>
      )}

      {onSelectCampaign && (
        <select
          onChange={(e) => e.target.value && onSelectCampaign(e.target.value)}
          defaultValue=""
          className="absolute left-3 top-3 z-[1000] max-w-[260px] rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm"
        >
          <option value="">{campaigns.length} campagne attive</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default DeliveryMap;
