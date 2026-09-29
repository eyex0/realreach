import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type PlannerLayer = 'zones' | 'routes' | 'teams' | 'density';

export interface PlannerZone {
  id: string;
  name: string;
  coverage: number;
}

// Approximate demo boundaries (real GIS polygons plug in later).
const GEO: Record<string, [number, number][]> = {
  duomo: [[45.462, 9.183], [45.462, 9.197], [45.47, 9.197], [45.47, 9.183]],
  navigli: [[45.448, 9.168], [45.448, 9.181], [45.456, 9.181], [45.456, 9.168]],
  isola: [[45.476, 9.188], [45.476, 9.199], [45.484, 9.199], [45.484, 9.188]],
  citylife: [[45.468, 9.14], [45.468, 9.16], [45.478, 9.16], [45.478, 9.14]],
  romana: [[45.444, 9.195], [45.444, 9.21], [45.452, 9.21], [45.452, 9.195]],
};

const ROUTES: [number, number][][] = [
  [[45.469, 9.185], [45.466, 9.19], [45.463, 9.195]],
  [[45.455, 9.17], [45.451, 9.175], [45.449, 9.18]],
  [[45.483, 9.19], [45.48, 9.193], [45.477, 9.196]],
  [[45.473, 9.145], [45.472, 9.152], [45.47, 9.158]],
];

const TEAMS: { at: [number, number]; label: string }[] = [
  { at: [45.466, 9.19], label: 'Team A · Duomo' },
  { at: [45.452, 9.174], label: 'Team B · Navigli' },
  { at: [45.48, 9.193], label: 'Team C · Isola' },
  { at: [45.473, 9.15], label: 'Team D · CityLife' },
  { at: [45.448, 9.202], label: 'Team E · Romana' },
];

function coverageColor(c: number): string {
  if (c >= 90) return '#10b981';
  if (c >= 65) return '#f59e0b';
  return '#ef4444';
}

interface Props {
  zones: PlannerZone[];
  selectedId: string;
  onSelect: (id: string) => void;
  layers: PlannerLayer[];
}

export const RealPlannerMap: React.FC<Props> = ({ zones, selectedId, onSelect, layers }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const groupRef = useRef<L.LayerGroup | null>(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;
    const map = L.map(divRef.current, { center: [45.4642, 9.185], zoom: 13, scrollWheelZoom: false });
    mapRef.current = map;
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);
    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (groupRef.current) {
      groupRef.current.remove();
      groupRef.current = null;
    }
    const g = L.layerGroup().addTo(map);
    groupRef.current = g;

    if (layers.includes('density')) {
      Object.values(GEO).forEach((rings) => {
        const lats = rings.map((r) => r[0]);
        const lngs = rings.map((r) => r[1]);
        L.circle([(lats[0] + lats[2]) / 2, (lngs[0] + lngs[2]) / 2], {
          radius: 700,
          color: '#006de4',
          weight: 0,
          fillColor: '#006de4',
          fillOpacity: 0.12,
        }).addTo(g);
      });
    }

    if (layers.includes('zones')) {
      zones.forEach((z) => {
        const rings = GEO[z.id];
        if (!rings) return;
        const selected = z.id === selectedId;
        L.polygon(rings, {
          color: coverageColor(z.coverage),
          weight: selected ? 3.5 : 2,
          dashArray: z.coverage < 65 ? '8 5' : undefined,
          fillColor: coverageColor(z.coverage),
          fillOpacity: selected ? 0.22 : 0.1,
        })
          .addTo(g)
          .bindTooltip(`${z.name} · ${z.coverage}%`, { sticky: true })
          .on('click', () => selectRef.current(z.id));
      });
    }

    if (layers.includes('routes')) {
      ROUTES.forEach((path) => {
        L.polyline(path, { color: '#10b981', weight: 3, dashArray: '7 5' }).addTo(g);
      });
    }

    if (layers.includes('teams')) {
      TEAMS.forEach((t) => {
        L.circleMarker(t.at, {
          radius: 7,
          color: '#ffffff',
          weight: 2,
          fillColor: '#10b981',
          fillOpacity: 1,
        })
          .addTo(g)
          .bindPopup(`<b>${t.label}</b><br/>Active now`);
      });
    }
  }, [zones, selectedId, layers]);

  return <div ref={divRef} className="absolute inset-0 z-0" />;
};

export default RealPlannerMap;
