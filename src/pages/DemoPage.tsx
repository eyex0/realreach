import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DemoSimulation from '../components/DemoSimulation';
import { ASSUMPTIONS } from '../lib/demoModel';

/**
 * /demo — the product simulation (MASTER PROMPT §28).
 *
 * Public, because a demo is a sales tool: no sign-up wall in front of the thing
 * that explains the product. It reads live campaign data? No — it is entirely
 * simulated, and it says so on the page and in the model.
 */
const DemoPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <header className="mt-6 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#006de4]">
            Product demo · {ASSUMPTIONS.durationSeconds} seconds
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0a0a0b] sm:text-5xl">
            One campaign, start to report.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            A client defines an area. Realreach splits it into districts, deploys field
            operators, verifies every drop against GPS, time, location and photo, then reports
            what was actually reached. This is a simulation of that loop — every number is
            counted from the run you are watching, not typed in.
          </p>
        </header>

        <div className="mt-10">
          <DemoSimulation />
        </div>

        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            What the loop actually is
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: 'Plan',
                d: 'Define the area, the target reach, the dates and the budget. The platform prices it before you commit.',
              },
              {
                t: 'Execute',
                d: 'The area is split into zones and assigned to named field operators with their own routes.',
              },
              {
                t: 'Verify',
                d: 'GPS, timestamp, location and photo are checked per drop. A human always decides on the edge cases.',
              },
              {
                t: 'Measure',
                d: 'Coverage, verified reach, verification rate and cost per verified reach, exported as a report.',
              },
            ].map((s) => (
              <div key={s.t} className="rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-bold text-[#0a0a0b]">{s.t}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs leading-relaxed text-slate-500">
            Real people. Real places. Real action. Real reach. The verification engine and the
            coverage model shown here are the same code the field app runs; the campaign figures
            are a simulation with the assumptions listed in the panel above.
          </p>
        </section>
      </div>
    </main>
  );
};

export default DemoPage;
