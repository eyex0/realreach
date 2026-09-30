import React, { useRef } from 'react';
import { BarChart3, ChevronRight, LayoutDashboard, Map, Megaphone, Play, Receipt, Route, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import RealReachLogo from '../components/RealReachLogo';
import DemoSimulation from '../components/DemoSimulation';
import { ASSUMPTIONS } from '../lib/demoModel';

const DemoPage: React.FC = () => {
  const simulationRef = useRef<HTMLDivElement>(null);

  const jumpToDemo = () => simulationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <main className="min-h-screen bg-[#eef0f4] p-3 sm:p-5 lg:p-8">
      <div className="mx-auto max-w-[1536px]">
        <div className="mb-4 flex items-center justify-between px-1 text-xs text-slate-500">
          <Link to="/" className="font-semibold hover:text-black">← Back to Realreach</Link>
          <span>Interactive product demo · {ASSUMPTIONS.durationSeconds}s simulation</span>
        </div>

        <div className="relative flex min-h-[720px] aspect-[16/9] overflow-hidden rounded-[24px] border border-slate-200 bg-[#fbfcfd] shadow-[0_24px_70px_rgba(15,23,42,.14)]">
          <aside className="hidden w-[220px] shrink-0 border-r border-slate-200 bg-white p-4 md:flex md:flex-col">
            <div className="flex items-center gap-2.5 px-2 py-3">
              <RealReachLogo size={25} color="#0a0a0b" />
              <span className="text-[17px] font-extrabold tracking-tight">Realreach</span>
            </div>

            <nav className="mt-8 space-y-1 text-sm font-semibold">
              <button onClick={jumpToDemo} className="flex w-full items-center gap-3 rounded-xl bg-slate-100 px-3 py-2.5 text-left text-black">
                <LayoutDashboard className="h-4 w-4" /> Home
              </button>
              <button onClick={jumpToDemo} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-600 transition hover:bg-slate-100 hover:text-black">
                <Megaphone className="h-4 w-4" /> Campaigns
              </button>
              <button onClick={jumpToDemo} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-600 transition hover:bg-slate-100 hover:text-black">
                <BarChart3 className="h-4 w-4" /> Analytics
              </button>
              <p className="px-3 pb-1 pt-7 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Services</p>
              <button onClick={jumpToDemo} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-600 transition hover:bg-slate-100 hover:text-black">
                <Receipt className="h-4 w-4" /> Print Store
              </button>
              <button onClick={jumpToDemo} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-600 transition hover:bg-slate-100 hover:text-black">
                <Map className="h-4 w-4" /> Distribution
              </button>
              <button onClick={jumpToDemo} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-600 transition hover:bg-slate-100 hover:text-black">
                <Settings2 className="h-4 w-4" /> Settings
              </button>
            </nav>

            <div className="mt-auto border-t border-slate-100 px-2 pt-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">MA</span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">Montaser Abdalla</p>
                  <p className="truncate text-[11px] text-slate-500">Realreach demo account</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1 overflow-y-auto">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#006de4]">Product walkthrough</p>
                <h1 className="mt-1 text-xl font-extrabold tracking-tight text-[#0a0a0b] sm:text-2xl">Welcome back, Montaser</h1>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={jumpToDemo} className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 sm:inline-flex"><BarChart3 className="h-3.5 w-3.5" /> Reports</button>
                <button onClick={jumpToDemo} className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 lg:inline-flex"><Route className="h-3.5 w-3.5" /> Operations console</button>
                <button onClick={jumpToDemo} className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800"><Play className="h-3.5 w-3.5" /> Create new campaign</button>
              </div>
            </header>

            <section className="space-y-6 p-5 sm:p-8">
              <div className="grid grid-cols-3 gap-3 sm:gap-5">
                {[
                  ['Total campaigns', '12'],
                  ['Flyers distributed', '88.3k'],
                  ['Avg. verified coverage', '96%'],
                ].map(([label, value], index) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
                    <p className="text-[10px] font-medium text-slate-500 sm:text-xs">{label}</p>
                    <p className={`mt-1 text-xl font-extrabold tracking-tight sm:text-3xl ${index === 2 ? 'text-emerald-600' : 'text-black'}`}>{value}</p>
                  </div>
                ))}
              </div>

              <div ref={simulationRef} className="scroll-mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.18em] text-[#006de4]">Operating campaign</p>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">From plan to verified local reach</h2>
                    <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm">Watch the campaign area split into districts, operators move through routes, proof events arrive, and the verified report consolidate in real time.</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-800">Simulation · no live customer data</span>
                </div>
                <DemoSimulation />
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  ['Campaign', 'Define the area, target and budget.'],
                  ['Execution', 'Deploy named operators with routes.'],
                  ['Verification', 'Check GPS, time, location and proof.'],
                  ['Analytics', 'Report coverage and cost per reach.'],
                ].map(([title, text], index) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-[10px] font-extrabold">{index + 1}</span><p className="text-xs font-bold">{title}</p><ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-300" /></div>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DemoPage;
