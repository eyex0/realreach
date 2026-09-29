import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Approximate demo zone boundaries over Milan (real GIS polygons plug in later).
const ZONES: { name: string; meta: string; color: string; rings: [number, number][] }[] = [
  {
    name: 'Duomo & Brera',
    meta: '2,900 letterboxes · €412.40',
    color: '#006de4',
    rings: [[45.47, 9.183], [45.47, 9.197], [45.462, 9.197], [45.462, 9.183]],
  },
  {
    name: 'Navigli & Ticinese',
    meta: '5,200 letterboxes · €756.00',
    color: '#10b981',
    rings: [[45.456, 9.168], [45.456, 9.181], [45.448, 9.181], [45.448, 9.168]],
  },
  {
    name: 'Porta Nuova & Isola',
    meta: '3,100 letterboxes · €449.50',
    color: '#f59e0b',
    rings: [[45.484, 9.188], [45.484, 9.199], [45.476, 9.199], [45.476, 9.188]],
  },
];

const RUNNERS: { name: string; at: [number, number] }[] = [
  { name: 'Marco V. · Duomo loop', at: [45.466, 9.19] },
  { name: 'Sofia B. · Navigli run', at: [45.452, 9.174] },
  { name: 'Gianluca C. · Isola vertical', at: [45.48, 9.193] },
];

export const RealMilanMap: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    const map = L.map(divRef.current, {
      center: [45.4642, 9.19],
      zoom: 13,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    ZONES.forEach((z) => {
      L.polygon(z.rings, { color: z.color, weight: 2.5, fillColor: z.color, fillOpacity: 0.14 })
        .addTo(map)
        .bindPopup(`<b>${z.name}</b><br/>${z.meta}`);
    });

    RUNNERS.forEach((r) => {
      L.circleMarker(r.at, {
        radius: 7,
        color: '#ffffff',
        weight: 2,
        fillColor: '#10b981',
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup(`<b>${r.name}</b><br/>Live · GPS tracking`);
    });

    // Re-enable scroll zoom only when the map itself is focused/clicked.
    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
      <div ref={divRef} className="h-[380px] sm:h-[460px] w-full z-0" />
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold shadow border border-slate-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Milano · 3 runners live
      </div>
      <div className="absolute right-3 bottom-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-500 shadow border border-slate-200">
        Real map · demo zones
      </div>
    </div>
  );
};

export default RealMilanMap;
