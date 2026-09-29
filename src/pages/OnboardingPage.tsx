import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Check, ArrowRight, Sparkles } from 'lucide-react';
import { syncBackendUser } from '../lib/api';
import {
  listTemplates, listIcps, createIcp, runDiscovery, getFeed, setPlatformUser,
  type IcpTemplate, type FeedItem,
} from '../lib/platformApi';

type Step = 1 | 2 | 3;

function describe(t: IcpTemplate): string[] {
  const out: string[] = [];
  if (t.countries.length) out.push(`Countries: ${t.countries.join(', ')}`);
  if (t.industries.length) out.push(`Industries: ${t.industries.join(', ')}`);
  if (t.employee_min != null || t.employee_max != null) {
    out.push(`Size: ${t.employee_min ?? 'any'}–${t.employee_max ?? 'any'} employees`);
  }
  if (t.required_signals.length) out.push(`Signals: ${t.required_signals.join(', ')}`);
  if (t.target_roles.length) out.push(`Roles: ${t.target_roles.join(', ')}`);
  return out;
}

/**
 * First run (Platform Priority 1).
 *
 * The activation path the product promises: choose an ICP template, run
 * discovery, see results, save what matters. Every step is deterministic —
 * there is no model in this loop, so it cannot be slow or unavailable.
 */
export const OnboardingPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [templates, setTemplates] = useState<IcpTemplate[] | null>(null);
  const [selected, setSelected] = useState<IcpTemplate | null>(null);
  const [icpName, setIcpName] = useState('');
  const [existing, setExisting] = useState<{ id: string; name: string }[]>([]);
  const [results, setResults] = useState<FeedItem[] | null>(null);
  const [stats, setStats] = useState<{ matched: number; created: number; ms: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void (async () => {
      const t = await listTemplates().catch(() => []);
      if (!active) return;
      setTemplates(t);
      if (t.length > 0) {
        setSelected(t[0]);
        setIcpName(t[0].name);
      }
      if (user?.id && user.primaryEmailAddress?.emailAddress) {
        const backendId = await syncBackendUser({
          clerkId: user.id,
          email: user.primaryEmailAddress.emailAddress,
          name: user.fullName ?? undefined,
          role: 'client',
        }).catch(() => null);
        if (active && backendId) {
          setPlatformUser(backendId);
          setExisting(await listIcps().catch(() => []));
        }
      }
    })();
    return () => {
      active = false;
      setPlatformUser(null);
    };
  }, [user]);

  const runDiscoveryFor = async (icpId: string) => {
    setBusy(true);
    setError('');
    try {
      const res = await runDiscovery(icpId, 25);
      setStats({ matched: res.matched, created: res.created, ms: res.run.duration_ms });
      setResults(await getFeed('feed'));
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'discovery failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">First run</p>
      <h1 className="text-3xl font-black tracking-tight mt-1">Get to your first opportunity</h1>
      <p className="text-sm text-slate-500 mt-2">
        Three steps, about two minutes. Pick the market you sell into, run discovery, and review what shows up.
      </p>

      <ol className="mt-6 flex items-center gap-2 text-[11px] font-bold">
        {(['Choose your ICP', 'Run discovery', 'Review & save'] as const).map((label, i) => {
          const n = (i + 1) as Step;
          const done = step > n;
          const activeStep = step === n;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                  done
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : activeStep
                      ? 'bg-[#0a0a0b] border-[#0a0a0b] text-white'
                      : 'border-slate-300 text-slate-400'
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : n}
              </span>
              <span className={activeStep ? 'text-slate-900' : 'text-slate-400'}>{label}</span>
              {i < 2 && <span className="h-px w-6 bg-slate-200" />}
            </li>
          );
        })}
      </ol>

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      {step === 1 && (
        <section className="mt-6">
          {existing.length > 0 && (
            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your ICPs</p>
              <ul className="mt-2 space-y-1.5">
                {existing.map((i) => (
                  <li key={i.id} className="flex items-center gap-2 text-xs">
                    <span className="font-bold flex-1">{i.name}</span>
                    <button
                      type="button"
                      onClick={() => void runDiscoveryFor(i.id)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Run discovery
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {templates === null ? (
            <p className="text-sm text-slate-500">Loading templates…</p>
          ) : (
            <>
              <p className="text-xs font-bold text-slate-500">Start from a template</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelected(t);
                      setIcpName(t.name);
                    }}
                    className={`text-left rounded-2xl border p-4 cursor-pointer transition-colors ${
                      selected?.id === t.id
                        ? 'border-slate-900 bg-white'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-bold flex items-start gap-2">
                      {selected?.id === t.id && <Check className="mt-0.5 h-4 w-4 shrink-0" />}
                      {t.name}
                    </p>
                    {t.description && <p className="text-[11px] text-slate-500 mt-1">{t.description}</p>}
                    <ul className="mt-2 space-y-0.5">
                      {describe(t).map((line) => (
                        <li key={line} className="text-[10px] text-slate-400">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-end gap-3">
                <label className="flex-1 min-w-[220px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name this ICP</span>
                  <input
                    value={icpName}
                    onChange={(e) => setIcpName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </label>
                <button
                  type="button"
                  disabled={!selected || !icpName.trim() || busy}
                  onClick={async () => {
                    if (!selected) return;
                    setBusy(true);
                    try {
                      const icp = await createIcp({ name: icpName.trim(), template_key: selected.template_key });
                      await runDiscoveryFor(icp.id);
                    } catch (e) {
                      setError(e instanceof Error ? e.message : 'could not start discovery');
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] text-white px-5 py-2.5 text-sm font-bold disabled:opacity-40 cursor-pointer"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Create ICP &amp; run discovery
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {step === 3 && (
        <section className="mt-6">
          {stats && (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
              Discovery finished in {stats.ms} ms: <b>{stats.matched}</b> companies matched,{' '}
              <b>{stats.created}</b> new opportunities added to your feed.
            </p>
          )}

          <div className="mt-4 space-y-2">
            {(results ?? []).slice(0, 10).map((o) => (
              <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-black w-12 text-center">{o.score}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{o.canonical_name}</p>
                    <p className="text-[11px] text-slate-500">
                      {[o.industry, o.country, o.employee_count ? `${o.employee_count} employees` : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    {o.signal_title && (
                      <p className="text-xs text-slate-700 mt-1.5">
                        <span className="font-bold">Why it matters:</span> {o.signal_title}
                      </p>
                    )}
                    <p className="text-xs font-semibold mt-1">Next action: {o.next_action}</p>
                  </div>
                </div>
              </div>
            ))}
            {(results ?? []).length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
                No companies matched this ICP yet. Try a broader template.
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/opportunities')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] text-white px-5 py-2.5 text-sm font-bold cursor-pointer"
            >
              Open my feed <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 cursor-pointer"
            >
              Try another ICP
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default OnboardingPage;
