import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useLeafletMap } from '../lib/useLeafletMap';

interface Props {
  rings: number[][][] | null;
  onChange: (rings: number[][][] | null) => void;
}

/** Click-to-draw polygon control over a real Milan map. */
export const RealBuilderMap: React.FC<Props> = ({ rings, onChange }) => {
  const savedRef = useRef<L.LayerGroup | null>(null);
  const drawRef = useRef<L.LayerGroup | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [vertices, setVertices] = useState<[number, number][]>([]);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const { containerRef, mapRef } = useLeafletMap((map) => {
    savedRef.current = L.layerGroup().addTo(map);
    drawRef.current = L.layerGroup().addTo(map);
  }, { center: [45.4642, 9.185], zoom: 13 });

  // Render the saved polygon.
  useEffect(() => {
    const g = savedRef.current;
    if (!g) return;
    g.clearLayers();
    if (rings && rings[0] && rings[0].length >= 4) {
      const latlngs = rings[0].map(([lng, lat]) => [lat, lng] as [number, number]);
      L.polygon(latlngs, { color: '#0a0a0b', weight: 3, fillColor: '#006de4', fillOpacity: 0.18 }).addTo(g);
    }
  }, [rings]);

  // Render draw preview.
  useEffect(() => {
    const g = drawRef.current;
    if (!g) return;
    g.clearLayers();
    vertices.forEach(([lat, lng]) => {
      L.circleMarker([lat, lng], { radius: 5, color: '#006de4', weight: 2, fillColor: '#fff', fillOpacity: 1 }).addTo(g);
    });
    if (vertices.length >= 2) {
      L.polyline(vertices, { color: '#006de4', weight: 2, dashArray: '6 4' }).addTo(g);
    }
    if (vertices.length >= 3) {
      L.polygon(vertices, { color: '#006de4', weight: 2, fillColor: '#006de4', fillOpacity: 0.12 }).addTo(g);
    }
  }, [vertices]);

  // Click-to-add vertices while drawing.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handler = (e: L.LeafletMouseEvent) => {
      if (!drawing) return;
      setVertices((prev) => {
        if (prev.length >= 20) return prev;
        return [...prev, [e.latlng.lat, e.latlng.lng]];
      });
    };
    map.on('click', handler);
    return () => {
      map.off('click', handler);
    };
  }, [drawing]);

  const startDraw = () => {
    onChangeRef.current(null);
    setVertices([]);
    setDrawing(true);
  };

  const finishDraw = () => {
    if (vertices.length < 3) return;
    const ring = vertices.map(([lat, lng]) => [lng, lat]);
    ring.push([...ring[0]]);
    onChangeRef.current([ring]);
    setVertices([]);
    setDrawing(false);
  };

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0 z-0 bg-slate-100" />
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {!drawing ? (
          <button
            type="button"
            onClick={startDraw}
            className="rounded-xl bg-[#0a0a0b] text-white px-4 py-2 text-xs font-bold shadow-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Draw area
          </button>
        ) : (
          <>
            <span className="rounded-xl bg-white px-3 py-2 text-[11px] font-bold shadow-xl border border-slate-200">
              Click map to add corners ({vertices.length})
            </span>
            <button
              type="button"
              onClick={finishDraw}
              disabled={vertices.length < 3}
              className="rounded-xl bg-[#006de4] text-white px-4 py-2 text-xs font-bold shadow-xl hover:bg-[#0060ca] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Finish
            </button>
            <button
              type="button"
              onClick={() => { setVertices([]); setDrawing(false); }}
              className="rounded-xl bg-white px-4 py-2 text-xs font-bold shadow-xl border border-slate-200 hover:border-black transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </>
        )}
        {rings && !drawing && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-xl bg-white px-4 py-2 text-xs font-bold shadow-xl border border-slate-200 hover:border-black transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
      {!rings && !drawing && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <p className="rounded-xl bg-black/70 text-white px-4 py-2 text-xs font-bold">
            Draw your target area to begin
          </p>
        </div>
      )}
    </div>
  );
};

export default RealBuilderMap;
