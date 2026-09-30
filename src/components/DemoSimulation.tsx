import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';
import { useLeafletMap } from '../lib/useLeafletMap';
import {
  ZONES, OPERATORS, ASSUMPTIONS, STAGES, simulate, routeFor,
  type SimulationState,
} from '../lib/demoModel';

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const num = (n: number) => Math.round(n).toLocaleString('en-GB');
const eur = (n: number) => `€${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * The 45–60 second product simulation (MASTER PROMPT §28).
 *
 * It is driven entirely by `simulate(progress)`, so every figure on screen is
 * a count of what the simulation actually did. The assumption strip at the
 * bottom is not decoration: the brief (§18) requires that a viewer can tell a
 * modelled number from a measured one, and a demo that hides that is worse than
 * no demo.
 */
export const DemoSimulation: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startedAt = useRef<number | null>(null);
  const [showAssumptions, setShowAssumptions] = useState(false);

  const state: SimulationState = simulate(progress);

  // Playback: a plain rAF loop so pausing and restarting are trivial and the
  // map never fights the animation for control.
  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startedAt.current = performance.now() - progress * ASSUMPTIONS.durationSeconds * 1000;

    const tick = (now: number) => {
      const elapsed = (now - (startedAt.current ?? now)) / 1000;
      const next = Math.min(1, elapsed / ASSUMPTIONS.durationSeconds);
      setProgress(next);
      if (next >= 1) {
        setPlaying(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // `progress` is intentionally not a dependency: including it would restart
    // the clock on every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const { containerRef, mapRef } = useLeafletMap(
    (map) => {
      ZONES.forEach((z) => {
        L.polygon(
          [
            [z.centre[0] - z.half[0], z.centre[1] - z.half[1]],
            [z.centre[0] - z.half[0], z.centre[1] + z.half[1]],
            [z.centre[0] + z.half[0], z.centre[1] + z.half[1]],
            [z.centre[0] + z.half[0], z.centre[1] - z.half[1]],
          ],
          { color: z.color, weight: 2, fillColor: z.color, fillOpacity: 0.12, dashArray: '6 4' }
        )
          .addTo(map)
          .bindPopup(`<b>${z.name}</b><br/>${num(z.letterboxes)} assumed letterboxes`);
      });

      // Routes are drawn once; the moving dots are separate markers below.
      OPERATORS.forEach((op) => {
        L.polyline(routeFor(op), { color: '#94a3b8', weight: 1.5, opacity: 0.5, dashArray: '3 4' }).addTo(map);
      });

      const bounds = L.latLngBounds(ZONES.map((z) => z.centre as [number, number]));
      map.fitBounds(bounds.pad(0.35), { animate: false });
    },
    { center: [45.4675, 9.19], zoom: 12 }
  );

  // Markers update on every frame, so they are kept out of React's tree and
  // driven imperatively: rebuilding a dozen SVG nodes each frame is how a demo
  // turns janky. The map instance comes from the hook, which creates it in an
  // effect that runs before this one.
  const markerLayer = useRef<L.LayerGroup | null>(null);
  const trailLayer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || markerLayer.current) return;
    markerLayer.current = L.layerGroup().addTo(map);
    trailLayer.current = L.layerGroup().addTo(map);
  }, [mapRef]);

  useEffect(() => {
    const markers = markerLayer.current;
    const trails = trailLayer.current;
    if (!markers || !trails) return;

    markers.clearLayers();
    trails.clearLayers();

    for (const op of state.operators) {
      const zone = ZONES.find((z) => z.id === op.zoneId)!;
      // The trail is the part of the route already walked.
      const route = routeFor(OPERATORS.find((o) => o.id === op.id)!);
      const walked = route.slice(0, Math.max(2, Math.round(op.progress * (route.length - 1)) + 1));
      L.polyline(walked, { color: zone.color, weight: 3, opacity: 0.85 }).addTo(trails);

      L.circleMarker([op.lat, op.lng], {
        radius: 8,
        color: '#ffffff',
        weight: 2.5,
        fillColor: op.verified ? '#10b981' : zone.color,
        fillOpacity: 1,
      })
        .addTo(markers)
        .bindPopup(
          `<b>${op.label}</b><br/>${zone.name}<br/>` +
            `Drops: ${op.verifiedDrops}/${op.totalDrops} verified`
        );
    }
  }, [state]);

  const m = state.metrics;

  return (
    <div className="space-y-6">
      {/* Stage rail */}
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {STAGES.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                i === state.stage
                  ? 'bg-[#0a0a0b] text-white'
                  : i < state.stage
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              {i < state.stage ? '✓' : i + 1} {s.label}
            </span>
            {i < STAGES.length - 1 && <span className="text-slate-300">›</span>}
          </li>
        ))}
      </ol>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Map */}
        <div className="relative">
          <div
            ref={containerRef}
            className="h-[420px] w-full rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
          />
          <div className="absolute left-3 top-3 z-[1000] rounded-xl bg-white/95 px-3 py-2 shadow">
            <p className="text-[11px] font-bold text-[#0a0a0b]">{ASSUMPTIONS.campaignName}</p>
            <p className="text-[10px] text-slate-500">
              Target reach {num(ASSUMPTIONS.targetReach)} · {ZONES.length} districts ·{' '}
              {OPERATORS.length} operators
            </p>
          </div>

          {state.latestProof && (
            <div className="absolute bottom-3 left-3 z-[1000] rounded-xl bg-white/95 px-3 py-2 text-[10px] shadow">
              <p className="font-bold text-[#0a0a0b]">
                Proof captured · {ZONES.find((z) => z.id === state.latestProof!.zoneId)?.name}
              </p>
              <p className="mt-0.5 flex flex-wrap gap-x-2 text-emerald-700">
                <span>GPS ✓</span>
                <span>Time ✓</span>
                <span>Location ✓</span>
                <span>Photo ✓</span>
              </p>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#006de4]">
              Live analytics
            </p>
            <span className="text-[10px] font-bold text-slate-400">simulation</span>
          </div>

          <dl className="mt-4 space-y-3">
            {[
              { k: 'Target reach', v: num(m.targetReach) },
              { k: 'Executed', v: num(m.executed) },
              { k: 'Verified reach', v: num(m.verified), accent: true },
              { k: 'Coverage', v: pct(m.coveragePct) },
              { k: 'Verification rate', v: pct(m.verificationRate) },
              { k: 'Active operators', v: `${m.activeOperators} of ${OPERATORS.length}` },
              { k: 'Completed activities', v: num(m.completedActivities) },
              { k: 'Cost / verified reach', v: eur(m.costPerVerifiedReach) },
            ].map((row) => (
              <div key={row.k} className="flex items-baseline gap-3 border-b border-slate-50 pb-2 last:border-0">
                <dt className="text-xs text-slate-500">{row.k}</dt>
                <dd
                  className={`ml-auto text-sm font-extrabold tabular-nums ${
                    row.accent ? 'text-emerald-600' : 'text-[#0a0a0b]'
                  }`}
                >
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-150"
              style={{ width: `${Math.min(100, m.coveragePct * 100)}%` }}
            />
          </div>

          {/* Controls */}
          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (progress >= 1) {
                  setProgress(0);
                  setPlaying(true);
                } else {
                  setPlaying((p) => !p);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0a0a0b] px-3.5 py-2 text-[11px] font-bold text-white"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {progress >= 1 ? 'Replay' : playing ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={() => {
                setProgress(0);
                setPlaying(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-[11px] font-bold text-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restart
            </button>
            <button
              type="button"
              onClick={() => setShowAssumptions((v) => !v)}
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-slate-500"
            >
              <Info className="h-3.5 w-3.5" />
              Assumptions
            </button>
          </div>

          {showAssumptions && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-[11px] font-bold text-amber-900">These are assumptions, not results</p>
              <ul className="mt-1 space-y-0.5 text-[10px] leading-relaxed text-amber-800">
                <li>· Target reach {num(ASSUMPTIONS.targetReach)}</li>
                <li>· Zone letterbox counts are modelled per district</li>
                <li>· {OPERATORS.length} operators, {ASSUMPTIONS.durationSeconds}s run</li>
                <li>· {eur(ASSUMPTIONS.pricePerVerifiedReachEur)} per verified reach (list price)</li>
              </ul>
              <p className="mt-1.5 text-[10px] leading-relaxed text-amber-800">{ASSUMPTIONS.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoSimulation;
