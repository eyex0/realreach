import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// CARTO's basemaps now answer every tile with an "API KEY REQUIRED" watermark
// when called without a key, which left the landing map a grey square. Esri's
// light-grey canvas and OSM are both keyless; OSM stays as the fallback.
const ESRI_LIGHT_TILES =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
const ESRI_LABEL_TILES =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}';
const FALLBACK_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION =
  'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &middot; fallback &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const TILE_FAILURES_BEFORE_FALLBACK = 6;

export interface MilanMapOptions {
  center?: [number, number];
  zoom?: number;
  /** Re-create the map when one of these changes. */
  deps?: unknown[];
}

/**
 * Boots a Leaflet map on a container that Leaflet itself does not own yet.
 *
 * Three things the raw `L.map()` call got wrong on this site:
 *  - the Hero scrolls in with a transform, so Leaflet measures the container
 *    before it has its final size and lays out no tiles -> grey square.
 *  - `scrollWheelZoom: false` with no visible control made the map feel dead.
 *  - one unreachable tile CDN meant a permanently blank map with no fallback.
 *
 * `deps` re-initialises the map when the caller's layers change. Keep it
 * stable (module-level constants, or a serialisable primitive) - passing a
 * fresh object here tears the map down on every render.
 */
export function useLeafletMap(
  setup: (map: L.Map) => void,
  { center = [45.4642, 9.19], zoom = 13, deps = [] }: MilanMapOptions = {},
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // React StrictMode mounts effects twice in dev; if the first teardown did
    // not run, Leaflet would refuse to reuse the container.
    delete (el as unknown as { _leaflet_id?: number })._leaflet_id;

    const map = L.map(el, {
      center,
      zoom,
      scrollWheelZoom: true,
      zoomControl: false,
    });
    mapRef.current = map;
    L.control.zoom({ position: 'topright' }).addTo(map);

    const tiles = L.tileLayer(ESRI_LIGHT_TILES, {
      attribution: ATTRIBUTION,
      maxZoom: 19,
    });
    const labels = L.tileLayer(ESRI_LABEL_TILES, {
      attribution: '',
      maxZoom: 19,
      pane: 'tilePane',
    });

    let failures = 0;
    const onTileError = () => {
      failures += 1;
      if (failures < TILE_FAILURES_BEFORE_FALLBACK) return;
      map.removeLayer(tiles);
      map.removeLayer(labels);
      L.tileLayer(FALLBACK_TILES, {
        attribution: ATTRIBUTION,
        maxZoom: 19,
      }).addTo(map);
    };
    tiles.on('tileerror', onTileError);
    labels.on('tileerror', onTileError);
    tiles.addTo(map);
    labels.addTo(map);

    setup(map);

    // Re-measure after the parent animation settles and on every resize,
    // otherwise Leaflet keeps the stale (often zero) container size.
    const frame = requestAnimationFrame(() => map.invalidateSize());
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      tiles.off('tileerror', onTileError);
      labels.off('tileerror', onTileError);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { containerRef, mapRef };
}
