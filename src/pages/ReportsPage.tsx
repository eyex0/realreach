import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RealReachLogo } from '../components/RealReachLogo';
import {
  ArrowLeft, Loader2, AlertCircle, RefreshCw, Check, BarChart3, Route, Coins, CheckCircle2,
} from 'lucide-react';
import {
  listReports, getCampaignReport, ReportOverviewItem, CampaignReport,
} from '../lib/api';

const STATUS_BADGE: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700',
  submitted: 'bg-amber-100 text-amber-800',
  approved: 'bg-indigo-100 text-indigo-800',
  planned: 'bg-blue-100 text-blue-800',
  assigned: 'bg-cyan-100 text-cyan-800',
  in_progress: 'bg-emerald-100 text-emerald-800',
  under_review: 'bg-amber-100 text-amber-800',
  completed: 'bg-sky-100 text-sky-800',
  reported: 'bg-slate-200 text-slate-700',
  closed: 'bg-slate-200 text-slate-700',
  paused: 'bg-orange-100 text-orange-800',
  blocked: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-700',
};
const badge = (s: string) => STATUS_BADGE[s] ?? 'bg-slate-100 text-slate-600';

const eur = (n: number) => `€${n.toFixed(2)}`;

export const ReportsPage: React.FC = () => {
  const [rows, setRows] = useState<ReportOverviewItem[] | null>(null);
  const [detail, setDetail] = useState<CampaignReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      setRows(await listReports());
    } catch (e) {
      setRows([]);
      setError(e instanceof Error ? e.message : 'API unreachable on :4000');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const open = async (id: string) => {
    setBusy(true);
    setError('');
    try {
      setDetail(await getCampaignReport(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load report');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0a0a0b]">
      <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-1.5 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <RealReachLogo size={20} color="#0a0a0b" />
          <span className="text-sm font-bold tracking-tight">Reports</span>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-black cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-5 space-y-5">
        {error && (
          <p className="text-xs text-red-600 inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </p>
        )}

        {detail ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => setDetail(null)}
                  className="text-xs font-bold text-slate-500 hover:text-black cursor-pointer"
                >
                  ← All campaigns
                </button>
                <h2 className="text-lg font-extrabold mt-1">{detail.campaign.title}</h2>
                <p className="text-[11px] text-slate-500">
                  {detail.campaign.status} · {detail.campaign.start_date?.slice(0, 10) ?? '—'} →{' '}
                  {detail.campaign.end_date?.slice(0, 10) ?? '—'}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${badge(detail.campaign.status)}`}>
                {detail.campaign.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <BarChart3 className="h-3.5 w-3.5" /> Delivery
                </div>
                <p className="mt-2 text-2xl font-extrabold">
                  {detail.progress.by_status['approved'] ?? 0}
                  <span className="text-sm text-slate-400">/{detail.progress.total}</span>
                </p>
                <p className="text-[11px] text-slate-500">tasks approved · {Object.entries(detail.progress.by_status).map(([k, v]) => `${v} ${k.replace('_', ' ')}`).join(', ') || 'none'}</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <Route className="h-3.5 w-3.5" /> Route
                </div>
                <p className="mt-2 text-2xl font-extrabold">{detail.route.distance_km} km</p>
                <p className="text-[11px] text-slate-500">
                  {detail.route.points} GPS points · {detail.route.duration_minutes} min on site
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <Coins className="h-3.5 w-3.5" /> Payout (piece-rate)
                </div>
                <p className="mt-2 text-2xl font-extrabold">{eur(detail.payout.estimate)}</p>
                <p className="text-[11px] text-slate-500">
                  {detail.payout.pieces} pieces × {eur(detail.payout.rate_per_piece)}
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Client estimate
                </div>
                <p className="mt-2 text-2xl font-extrabold">{eur(detail.estimate.price_total)}</p>
                <p className="text-[11px] text-slate-500">
                  {detail.estimate.estimated_mailboxes} mailboxes × {eur(detail.estimate.price_per_mailbox)}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100">
                  <h3 className="text-sm font-bold">Evidence & review</h3>
                </div>
                <div className="p-5 space-y-2 text-xs">
                  {Object.entries(detail.evidence).length === 0 ? (
                    <p className="text-slate-500">No evidence recorded yet.</p>
                  ) : (
                    Object.entries(detail.evidence).map(([kind, v]) => (
                      <div key={kind} className="flex justify-between">
                        <span className="text-slate-600">{kind}</span>
                        <span className="font-bold">{v.count}{kind === 'quantity' ? ` (${v.quantity} pcs)` : ''}</span>
                      </div>
                    ))
                  )}
                  <div className="pt-2 border-t border-slate-100">
                    {detail.proofs.length === 0 ? (
                      <p className="text-slate-500">No proofs submitted.</p>
                    ) : (
                      detail.proofs.map((p) => (
                        <div key={p.review_status} className="flex justify-between">
                          <span className="text-slate-600">proofs {p.review_status}</span>
                          <span className="font-bold">{p.count}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    {detail.verification.length === 0 ? (
                      <p className="text-slate-500">No verification runs yet.</p>
                    ) : (
                      detail.verification.map((v) => (
                        <div key={v.status} className="flex justify-between">
                          <span className="text-slate-600">verification {v.status.replace('_', ' ')}</span>
                          <span className="font-bold">{v.count}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100">
                  <h3 className="text-sm font-bold">Tasks ({detail.tasks.length})</h3>
                </div>
                <ul className="divide-y divide-slate-50 max-h-[320px] overflow-auto">
                  {detail.tasks.map((t) => (
                    <li key={t.id} className="px-5 py-2.5 flex items-center gap-3 text-xs">
                      <span className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {t.campaign_seq ?? '·'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge(t.status)}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                      <span className="text-slate-500 truncate">{t.walker_name ?? 'unassigned'}</span>
                      <span className="ml-auto text-slate-600">
                        {t.pieces} pcs · {t.evidence_count} evid
                        {t.verification_status ? ` · ${t.verification_status}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </>
        ) : rows === null ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center">
            <Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-400" />
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center">
            <p className="text-sm font-bold">No campaigns to report on yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Create a campaign first — reports appear as soon as work is logged.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => void open(r.id)}
                  className="w-full text-left rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all p-4 cursor-pointer"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold truncate">{r.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge(r.status)}`}>
                          {r.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {r.tasks_approved}/{r.tasks_total} approved
                        {r.pieces > 0 ? ` · ${r.pieces} pieces` : ''}
                        {r.proofs_pending > 0 ? ` · ${r.proofs_pending} proofs pending review` : ''}
                      </p>
                      <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-xs">
                        <div
                          className="h-full bg-emerald-500"
                          style={{
                            width: `${r.tasks_total ? Math.round((r.tasks_approved / r.tasks_total) * 100) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold">{eur(r.payout_estimate)}</p>
                      <p className="text-[10px] text-slate-500">payout est.</p>
                    </div>
                    <Check className="h-4 w-4 text-slate-300" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default ReportsPage;
