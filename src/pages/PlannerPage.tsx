import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RealReachLogo } from '../components/RealReachLogo';
import {
  ArrowLeft,
  Plus,
  Users,
  Route as RouteIcon,
  AlertTriangle,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import RealPlannerMap, { PlannerLayer } from '../components/RealPlannerMap';

interface Zone {
  id: string;
  name: string;
  letterboxes: number;
  locations: number;
  coverage: number;
  teams: number;
  capacityNeeded: number;
  routes: string[];
  uncovered: string[];
  polygon: string;
  cx: number;
  cy: number;
}

const ZONES: Zone[] = [
  {
    id: 'duomo', name: 'Duomo & Brera', letterboxes: 2900, locations: 412, coverage: 96, teams: 3, capacityNeeded: 3,
    routes: ['Duomo loop A (2.1km)', 'Brera grid B (1.8km)'], uncovered: [],
    polygon: '300,120 400,100 430,190 350,230 280,200', cx: 355, cy: 160,
  },
  {
    id: 'navigli', name: 'Navigli & Ticinese', letterboxes: 5200, locations: 688, coverage: 88, teams: 4, capacityNeeded: 5,
    routes: ['Navigli canal run (3.2km)', 'Ticinese grid (2.4km)', 'Darsena loop (1.9km)'], uncovered: ['Via Tortona upper blocks'],
    polygon: '180,240 300,230 320,330 200,350 150,300', cx: 235, cy: 290,
  },
  {
    id: 'isola', name: 'Porta Nuova & Isola', letterboxes: 3100, locations: 402, coverage: 72, teams: 2, capacityNeeded: 4,
    routes: ['Isola vertical (2.6km)'], uncovered: ['Bosco Verticale residences', 'Gae Aulenti plaza zone'],
    polygon: '350,240 470,230 490,330 380,350', cx: 420, cy: 290,
  },
  {
    id: 'citylife', name: 'CityLife & Portello', letterboxes: 4800, locations: 590, coverage: 64, teams: 2, capacityNeeded: 4,
    routes: ['CityLife ring (3.0km)'], uncovered: ['Portello park blocks', 'CityLife shopping district'],
    polygon: '90,360 230,350 250,450 120,470', cx: 170, cy: 410,
  },
  {
    id: 'romana', name: 'Porta Romana & Crocetta', letterboxes: 3600, locations: 455, coverage: 41, teams: 1, capacityNeeded: 3,
    routes: [], uncovered: ['Entire zone — no routes drawn', 'Crocetta grid', 'Romana corridor'],
    polygon: '300,370 450,360 470,460 330,480', cx: 385, cy: 420,
  },
];

type Layer = PlannerLayer;

const LAYERS: { id: Layer; label: string }[] = [
  { id: 'zones', label: 'Zones' },
  { id: 'routes', label: 'Routes' },
  { id: 'teams', label: 'Teams' },
  { id: 'density', label: 'Density' },
];

function coverageColor(c: number): string {
  if (c >= 90) return '#10b981';
  if (c >= 65) return '#f59e0b';
  return '#ef4444';
}

export const PlannerPage: React.FC = () => {
  const [activeLayers, setActiveLayers] = useState<Layer[]>(['zones', 'routes', 'teams', 'density']);
  const [selectedId, setSelectedId] = useState<string>('isola');
  const selected = ZONES.find((z) => z.id === selectedId) ?? ZONES[0];

  const toggleLayer = (l: Layer) =>
    setActiveLayers((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));

  const totalLetterboxes = ZONES.reduce((s, z) => s + z.letterboxes, 0);
  const totalTeams = ZONES.reduce((s, z) => s + z.teams, 0);
  const totalNeeded = ZONES.reduce((s, z) => s + z.capacityNeeded, 0);
  const avgCoverage = Math.round(ZONES.reduce((s, z) => s + z.coverage, 0) / ZONES.length);
  const uncoveredCount = ZONES.flatMap((z) => z.uncovered).length;

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-[#0a0a0b] flex flex-col font-sans">
      {/* Top bar */}
      <header className="bg-white px-5 sm:px-8 py-4 border-b border-slate-200 flex flex-wrap items-center gap-4">
        <Link to="/" className="p-1.5 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-2.5">
          <RealReachLogo size={24} color="#0a0a0b" />
          <div>
            <h1 className="text-base font-extrabold tracking-tight leading-none">Reach Planner</h1>
            <p className="text-[11px] text-slate-500 mt-0.5">Milano · mission control</p>
          </div>
        </div>

        {/* Layer toggles */}
        <div className="flex items-center gap-1.5 ml-2 sm:ml-6 bg-slate-100 border border-slate-200 rounded-xl p-1">
          {LAYERS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => toggleLayer(l.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                activeLayers.includes(l.id) ? 'bg-[#0a0a0b] text-white' : 'text-slate-500 hover:text-black'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <Link
          to="/campaigns/new"
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] text-white px-4 py-2 text-xs font-bold hover:bg-neutral-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Campaign</span>
        </Link>
      </header>

      {/* KPI strip */}
      <div className="px-5 sm:px-8 py-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          ['Target locations', totalLetterboxes.toLocaleString(), false],
          ['Expected coverage', `${avgCoverage}%`, false],
          ['Field capacity', `${totalTeams}/${totalNeeded} teams`, false],
          ['Active routes', String(ZONES.reduce((s, z) => s + z.routes.length, 0)), false],
          ['Uncovered areas', String(uncoveredCount), uncoveredCount > 0],
        ].map(([label, value, alert]) => (
          <div key={label as string} className="rounded-2xl bg-white border border-slate-200 shadow-sm px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</p>
            <p className={`mt-1 text-xl font-extrabold font-mono ${alert ? 'text-red-600' : ''}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1 grid lg:grid-cols-12 min-h-0 px-5 sm:px-8 pb-8 gap-4">
        {/* LEFT: pipeline + zones */}
        <aside className="lg:col-span-3 rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-6 overflow-y-auto">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Planning pipeline</p>
            <ol className="space-y-2 text-xs font-semibold">
              {[
                ['Target area', 'Milano · 5 zones'],
                ['Target locations', `${totalLetterboxes.toLocaleString()} letterboxes`],
                ['Expected coverage', `${avgCoverage}% blended`],
                ['Field capacity', totalTeams >= totalNeeded ? 'Sufficient' : `${totalNeeded - totalTeams} teams short`],
              ].map(([stage, detail], i) => (
                <li key={stage} className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5">
                  <span className="font-mono font-bold text-[#006de4]">0{i + 1}</span>
                  <span>
                    <span className="block">{stage}</span>
                    <span className="block text-slate-500 font-medium mt-0.5">{detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Zones</p>
            <div className="space-y-2">
              {ZONES.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setSelectedId(z.id)}
                  className={`w-full text-left rounded-xl border p-3 transition-colors cursor-pointer ${
                    z.id === selectedId ? 'border-black bg-slate-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold">{z.name}</span>
                    <span className="font-mono text-xs font-bold" style={{ color: coverageColor(z.coverage) }}>
                      {z.coverage}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${z.coverage}%`, background: coverageColor(z.coverage) }} />
                  </div>
                  <p className="mt-1.5 text-[10px] text-slate-500">
                    {z.letterboxes.toLocaleString()} boxes · {z.teams}/{z.capacityNeeded} teams
                    {z.uncovered.length > 0 && <span className="text-red-600 font-bold"> · {z.uncovered.length} uncovered</span>}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER: mission-control map */}
        <div className="lg:col-span-6 relative min-h-[420px] lg:min-h-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-[#edf3ec]">
          <RealPlannerMap
            zones={ZONES.map((z) => ({ id: z.id, name: z.name, coverage: z.coverage }))}
            selectedId={selectedId}
            onSelect={setSelectedId}
            layers={activeLayers}
          />

          {/* Legend */}
          <div className="absolute left-3 bottom-3 flex flex-wrap gap-1.5 text-[10px] font-bold">
            <span className="rounded-full bg-white/95 px-2.5 py-1 border border-slate-200 shadow-sm"><span className="text-emerald-500">●</span> Covered 90%+</span>
            <span className="rounded-full bg-white/95 px-2.5 py-1 border border-slate-200 shadow-sm"><span className="text-amber-500">●</span> Partial</span>
            <span className="rounded-full bg-white/95 px-2.5 py-1 border border-slate-200 shadow-sm"><span className="text-red-500">●</span> Uncovered</span>
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-white/95 border border-slate-200 shadow-sm px-3 py-1.5 text-[10px] font-bold flex items-center gap-1.5 text-slate-600">
            <Layers className="h-3 w-3 text-[#006de4]" />
            Real map · demo zone shapes plug into GIS later
          </div>
        </div>

        {/* RIGHT: selected zone detail */}
        <aside className="lg:col-span-3 rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-5 overflow-y-auto">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Selected zone</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight">{selected.name}</h2>
            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-end justify-between">
                <span className="text-xs text-slate-500">Expected coverage</span>
                <span className="font-mono text-2xl font-extrabold" style={{ color: coverageColor(selected.coverage) }}>
                  {selected.coverage}%
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${selected.coverage}%`, background: coverageColor(selected.coverage) }} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white border border-slate-200 p-2.5">
                  <p className="text-slate-500 text-[10px]">Letterboxes</p>
                  <p className="font-mono font-bold">{selected.letterboxes.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-white border border-slate-200 p-2.5">
                  <p className="text-slate-500 text-[10px]">Locations</p>
                  <p className="font-mono font-bold">{selected.locations}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 flex items-center gap-1.5">
              <RouteIcon className="h-3.5 w-3.5" /> Routes ({selected.routes.length})
            </p>
            {selected.routes.length === 0 ? (
              <p className="text-xs text-red-700 font-semibold rounded-xl bg-red-50 border border-red-200 p-3">
                No routes drawn yet — capacity cannot be assigned.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {selected.routes.map((r) => (
                  <li key={r} className="text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5">
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Field capacity
            </p>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
              <div className="flex justify-between text-xs font-bold">
                <span>{selected.teams} assigned</span>
                <span className="text-slate-500">{selected.capacityNeeded} needed</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full ${selected.teams >= selected.capacityNeeded ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, (selected.teams / selected.capacityNeeded) * 100)}%` }}
                />
              </div>
              {selected.teams < selected.capacityNeeded && (
                <p className="mt-2 text-[11px] text-amber-700 font-semibold">
                  Short {selected.capacityNeeded - selected.teams} team{selected.capacityNeeded - selected.teams > 1 ? 's' : ''} to reach full coverage.
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Uncovered ({selected.uncovered.length})
            </p>
            {selected.uncovered.length === 0 ? (
              <p className="text-xs text-emerald-700 font-semibold rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Fully covered — nothing outstanding.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {selected.uncovered.map((u) => (
                  <li key={u} className="text-xs font-semibold rounded-xl bg-red-50 border border-red-200 text-red-700 px-3 py-2.5">
                    {u}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            to="/campaigns/new"
            className="block text-center rounded-xl bg-[#0a0a0b] text-white px-4 py-3 text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            Assign capacity in builder
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default PlannerPage;
