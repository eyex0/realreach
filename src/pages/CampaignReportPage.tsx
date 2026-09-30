import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import L from 'leaflet';
import { ArrowLeft, Loader2, AlertCircle, Flag, MapPin, Route as RouteIcon } from 'lucide-react';
import { useLeafletMap } from '../lib/useLeafletMap';
import { getCampaignReport, type CampaignReport, type CampaignArea } from '../lib/api';

/** Same order and thresholds the backend scores with, so legend and data agree. */
const BAND_COLOUR: Record<string, string> = {
  stationary: '#94a3b8',
  normal: '#10b981',
  slightly_fast: '#f59e0b',
  very_fast: '#ef4444',
  extremely_fast: '#7c3aed',
};

const BAND_LABEL: Record<string, string> = {
  stationary: 'Stationary',
  normal: 'Normal pace',
  slightly_fast: 'Slightly fast',
  very_fast: 'Very fast',
  extremely_fast: 'Extremely fast (18 km/h+)',
};

const num = (n: number) => Math.round(n).toLocaleString('en-GB');
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const when = (iso: string | null) => (iso ? iso.slice(0, 16).replace('T', ' ') : '—');

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-[#0a0a0b]">{value}</p>
      {hint && <p className="mt-0.5 text-[10px] text-slate-400">{hint}</p>}
    </div>
  );
}

/** The route of the selected area, coloured by walking speed. */
function RouteMap({ area }: { area: CampaignArea | null }) {
  const segments = area?.route.segments ?? [];

  const { containerRef } = useLeafletMap(
    (map) => {
      if (segments.length === 0) return;
      // One polyline per band, so colours group and the legend matches the map.
      const byBand = new Map<string, [number, number][]>();
      for (const s of segments) {
        const list = byBand.get(s.band) ?? [];
        list.push([s.from_lat, s.from_lng], [s.to_lat, s.to_lng]);
        byBand.set(s.band, list);
      }
      for (const [band, points] of byBand) {
        L.polyline(points, { color: BAND_COLOUR[band] ?? '#94a3b8', weight: 4, opacity: 0.9 }).addTo(map);
      }
      const first = segments[0];
      L.circleMarker([first.from_lat, first.from_lng], {
        radius: 7, color: '#fff', weight: 2, fillColor: '#0a0a0b', fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup('Start');
      const last = segments[segments.length - 1];
      L.circleMarker([last.to_lat, last.to_lng], {
        radius: 7, color: '#fff', weight: 2, fillColor: '#10b981', fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup('End');
      // Flagged segments get a marker, because that is what a reviewer looks for.
      for (const s of segments.filter((x) => x.flags.length > 0)) {
        L.circleMarker([s.to_lat, s.to_lng], { radius: 5, color: '#fff', weight: 2, fillColor: '#ef4444', fillOpacity: 1 })
          .addTo(map)
          .bindPopup(`<b>${s.speed_kmh} km/h</b><br/>${s.flags.join(', ')}`);
      }
      map.fitBounds(L.latLngBounds(segments.flatMap((s) => [[s.from_lat, s.from_lng] as [number, number]])).pad(0.3), {
        animate: false,
      });
    },
    { deps: [area?.task_id ?? 'none'] }
  );

  return (
    <div>
      <div ref={containerRef} className="h-[380px] w-full rounded-2xl border border-slate-200 bg-slate-100" />
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(BAND_LABEL).map(([band, label]) => (
          <li key={band} className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: BAND_COLOUR[band] }} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const CampaignReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<CampaignReport | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    void (async () => {
      try {
        const r = await getCampaignReport(id);
        setReport(r);
        // Default to the first area that actually has a route to show.
        setSelected(r.areas.find((a) => a.route.points > 0)?.task_id ?? r.areas[0]?.task_id ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'failed to load the report');
      }
    })();
  }, [id]);

  const area = useMemo(
    () => report?.areas.find((a) => a.task_id === selected) ?? null,
    [report, selected]
  );

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-10">
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      </main>
    );
  }
  if (!report) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-10">
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading the campaign report…
        </p>
      </main>
    );
  }

  const areas = report.areas;
  const executedPieces = areas.reduce((s, a) => s + (a.pieces_logged ?? 0), 0);
  const verifiedAreas = areas.filter((a) => a.verification_status === 'verified').length;
  const activeAreas = areas.filter((a) => a.status === 'in_progress' || a.status === 'assigned').length;
  const totalAnomalies = areas.reduce((s, a) => s + a.route.anomalies, 0);
  const target = report.campaign.estimated_mailboxes;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-6 lg:px-8">
        <Link to="/ops" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-3.5 w-3.5" />
          Operations
        </Link>

        <header className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006de4]">Campaign report</p>
            <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-[#0a0a0b]">
              {report.campaign.title}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {report.campaign.status} · {report.progress.total} areas ·{' '}
              {report.payout.pieces} pieces logged
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
            {report.trust.scored} of {areas.length} areas carry a trust score
          </span>
        </header>

        {/* What the client buys: what was reached, and what it cost. */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Target reach"
            value={target == null ? 'not set' : num(target)}
            hint={target == null ? 'no estimate on this campaign' : 'campaign estimate'}
          />
          <Metric label="Pieces logged" value={num(executedPieces)} hint="from operator evidence" />
          <Metric
            label="Areas verified"
            value={`${verifiedAreas} / ${areas.length}`}
            hint="machine verdict, then human review"
          />
          <Metric
            label="Payout estimate"
            value={`€${report.payout.estimate.toFixed(2)}`}
            hint={`€${report.payout.rate_per_piece} per piece`}
          />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Per-area table: the screen the buyer actually reads. */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-bold">Delivery areas</h2>
              {totalAnomalies > 0 && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                  <Flag className="h-3 w-3" />
                  {totalAnomalies} speed anomal{totalAnomalies === 1 ? 'y' : 'ies'}
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-2.5 font-bold">Area</th>
                    <th className="px-3 py-2.5 font-bold">Progress</th>
                    <th className="px-3 py-2.5 font-bold">Letterboxes</th>
                    <th className="px-3 py-2.5 font-bold">Distributor</th>
                    <th className="px-3 py-2.5 font-bold">Route</th>
                    <th className="px-3 py-2.5 font-bold">Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {areas.map((a) => {
                    const done = a.status === 'approved' || a.status === 'submitted';
                    return (
                      <tr
                        key={a.task_id}
                        onClick={() => setSelected(a.task_id)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                          selected === a.task_id ? 'bg-slate-50' : ''
                        }`}
                      >
                        <td className="px-5 py-3">
                          <span className="font-bold text-[#0a0a0b]">Area {a.sequence ?? '—'}</span>
                          <span className="mt-0.5 block text-[10px] text-slate-400">
                            {when(a.completed_at ?? a.started_at)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                style={{ width: `${done ? 100 : a.status === 'in_progress' ? 50 : 0}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500">{a.status.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 tabular-nums">
                          {a.estimated_letterboxes > 0 ? num(a.estimated_letterboxes) : '—'}
                        </td>
                        <td className="px-3 py-3">{a.distributor ?? <span className="text-slate-300">unassigned</span>}</td>
                        <td className="px-3 py-3 tabular-nums">
                          {a.route.points > 0 ? (
                            <>
                              {a.route.distance_km.toFixed(2)} km
                              <span className="mt-0.5 block text-[10px] text-slate-400">
                                avg {a.route.average_speed_kmh.toFixed(1)} km/h
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-300">no route</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              a.verification_status === 'verified'
                                ? 'bg-emerald-50 text-emerald-700'
                                : a.verification_status === 'requires_review'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {a.verification_status?.replace('_', ' ') ?? 'pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {areas.some((a) => a.estimated_letterboxes === 0) && (
              <p className="border-t border-slate-100 px-5 py-2.5 text-[10px] text-slate-400">
                Letterbox figures are an estimate derived from the campaign area, not an address
                database. This campaign has no estimate recorded, so they are omitted rather than
                shown as zero.
              </p>
            )}
          </section>

          {/* Verification panel + the selected route. */}
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-bold">Verification</h2>
              {area ? (
                <dl className="mt-3 space-y-2 text-xs">
                  {[
                    ['Distributor', area.distributor ?? 'unassigned'],
                    ['Area', `Area ${area.sequence ?? '—'}`],
                    ['Started', when(area.started_at)],
                    ['Completed', when(area.completed_at)],
                    ['Distance walked', `${area.route.distance_km.toFixed(2)} km`],
                    ['Average pace', `${area.route.average_speed_kmh.toFixed(1)} km/h`],
                    ['Fastest segment', `${area.route.max_speed_kmh.toFixed(1)} km/h`],
                    ['Speed anomalies', String(area.route.anomalies)],
                    ['Pieces logged', num(area.pieces_logged)],
                    ['Proof status', area.verification_status ?? 'pending'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline gap-3 border-b border-slate-50 pb-1.5 last:border-0">
                      <dt className="text-slate-500">{k}</dt>
                      <dd className="ml-auto font-bold tabular-nums text-[#0a0a0b]">{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 text-xs text-slate-500">Select an area to see its verification.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <RouteIcon className="h-4 w-4 text-slate-400" />
                Route, coloured by pace
              </h2>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                A segment faster than a person can walk is flagged, not rejected. A human decides.
              </p>
              <div className="mt-3">
                <RouteMap area={area} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CampaignReportPage;
