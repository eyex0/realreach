import React from 'react';
import L from 'leaflet';
import { useLeafletMap } from '../lib/useLeafletMap';

// Approximate demo zone boundaries over Milan (real GIS polygons plug in later).
const ZONES: {
  name: string;
  meta: string;
  color: string;
  rings: [number, number][];
}[] = [
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

const RUNNERS: { name: string; at: [number, number] }[] = [
  { name: 'Marco V. · Duomo loop', at: [45.466, 9.19] },
  { name: 'Sofia B. · Navigli run', at: [45.452, 9.174] },
  { name: 'Gianluca C. · Isola vertical', at: [45.48, 9.193] },
];

export const RealMilanMap: React.FC = () => {
  const { containerRef } = useLeafletMap((map) => {
    ZONES.forEach((z) => {
      L.polygon(z.rings, {
        color: z.color,
        weight: 2.5,
        fillColor: z.color,
        fillOpacity: 0.14,
      })
        .addTo(map)
        .bindPopup(`<b>${z.name}</b><br/>${z.meta}`)
        .on('mouseover', (e) => {
          (e.target as L.Polygon).setStyle({ fillOpacity: 0.3, weight: 3.5 });
        })
        .on('mouseout', (e) => {
          (e.target as L.Polygon).setStyle({ fillOpacity: 0.14, weight: 2.5 });
        });
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

    // Frame every zone and runner instead of trusting a hardcoded centre.
    const bounds = L.featureGroup(
      ZONES.map((z) => L.polygon(z.rings)),
    ).getBounds();
    map.fitBounds(bounds.pad(0.08), { animate: false });
  });

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
      <div
        ref={containerRef}
        className="h-[380px] sm:h-[460px] w-full z-0 bg-slate-100"
      />
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold shadow border border-slate-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Milano · 3 runners live
      </div>
      <div className="pointer-events-none absolute left-3 bottom-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-500 shadow border border-slate-200">
        Real map · demo zones
      </div>
    </div>
  );
};

export default RealMilanMap;
