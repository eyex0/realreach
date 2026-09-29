import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RealReachLogo } from '../components/RealReachLogo';
import {
  ArrowLeft, Loader2, AlertCircle, RefreshCw, Split, Send,
  CheckCircle2, Map, Users, MapPin, Check, ShieldCheck, X, Coins,
} from 'lucide-react';
import {
  listCampaigns, getCampaign, listTasks, listOperators, splitCampaign, assignTask,
  changeCampaignStatus, listProofs, reviewProof, listPayouts, generatePayouts, approvePayout, payPayout,
  getProofDetail, fetchBlob,
  CampaignSummary, TaskItem, OperatorRow, ProofQueueItem, PayoutRow, ProofDetail,
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
  available: 'bg-slate-100 text-slate-600',
  accepted: 'bg-blue-100 text-blue-700',
  submitted_task: 'bg-amber-100 text-amber-800',
  approved_task: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const badge = (s: string) => STATUS_BADGE[s] ?? 'bg-slate-100 text-slate-600';

function statusAction(status: string): { to: string; label: string; icon: React.ReactNode } | null {
  switch (status) {
    case 'draft':
      return { to: 'submitted', label: 'Submit for approval', icon: <Send className="h-3.5 w-3.5" /> };
    case 'submitted':
      return { to: 'approved', label: 'Approve plan', icon: <CheckCircle2 className="h-3.5 w-3.5" /> };
    case 'approved':
      return { to: 'planned', label: 'Mark ready for tasks', icon: <Map className="h-3.5 w-3.5" /> };
    case 'planned':
      return { to: 'assigned', label: 'Open task board', icon: <Split className="h-3.5 w-3.5" /> };
    default:
      return null;
  }
}

const VERDICT: Record<string, string> = {
  verified: 'bg-emerald-100 text-emerald-800',
  partially_verified: 'bg-amber-100 text-amber-800',
  requires_review: 'bg-red-100 text-red-700',
  rejected: 'bg-red-100 text-red-700',
};

export const OpsConsolePage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignSummary[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [operators, setOperators] = useState<OperatorRow[]>([]);
  const [proofs, setProofs] = useState<ProofQueueItem[] | null>(null);
  const [payouts, setPayouts] = useState<PayoutRow[] | null>(null);
  const [openProof, setOpenProof] = useState<string | null>(null);
  const [proofDetail, setProofDetail] = useState<ProofDetail | null>(null);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [replace, setReplace] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');
  const [assignDraft, setAssignDraft] = useState<Record<string, string>>({});

  const loadAll = useCallback(async () => {
    setError('');
    try {
      const [cs, ops, pr, po] = await Promise.all([
        listCampaigns(),
        listOperators(),
        listProofs('pending').catch(() => [] as ProofQueueItem[]),
        listPayouts().catch(() => [] as PayoutRow[]),
      ]);
      setCampaigns(cs);
      setOperators(ops);
      setProofs(pr);
      setPayouts(po);
    } catch (e) {
      setCampaigns([]);
      setError(e instanceof Error ? e.message : 'API unreachable on :4000');
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!selected) {
      setTasks([]);
      return;
    }
    void listTasks(undefined, selected)
      .then(setTasks)
      .catch(() => setTasks([]));
  }, [selected]);

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    setError('');
    setFlash('');
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy(null);
    }
  };

  const doStatus = (c: CampaignSummary, to: string) =>
    run(`status-${c.id}`, async () => {
      await changeCampaignStatus(c.id, to, {});
      setFlash(`Campaign → ${to}`);
      await loadAll();
    });

  const doSplit = () =>
    run('split', async () => {
      if (!selected) return;
      const r = await splitCampaign(selected, rows, cols, { replace });
      setFlash(`Generated ${r.created} task${r.created === 1 ? '' : 's'}`);
      setTasks(await listTasks(undefined, selected));
      await loadAll();
    });

  const doAssign = (task: TaskItem) =>
    run(`assign-${task.id}`, async () => {
      const op = assignDraft[task.id];
      if (!op) throw new Error('Pick an operator first');
      await assignTask(task.id, op);
      setFlash(`Task ${String(task.id).slice(0, 8)} assigned`);
      setTasks(await listTasks(undefined, task.campaign_id));
      await loadAll();
    });

  const doReview = (proof: ProofQueueItem, decision: 'approved' | 'rejected') =>
    run(`review-${proof.id}`, async () => {
      const reason =
        decision === 'rejected'
          ? window.prompt('Reason for rejecting this proof (operator keeps the task, no penalty):') ??
            'Evidence incomplete'
          : undefined;
      await reviewProof(proof.id, decision, reason);
      setFlash(`Proof ${decision}`);
      setProofs(await listProofs('pending').catch(() => []));
      await loadAll();
    });

  const toggleProof = async (id: string) => {
    if (openProof === id) {
      setOpenProof(null);
      setProofDetail(null);
      return;
    }
    setOpenProof(id);
    setProofDetail(null);
    try {
      setProofDetail(await getProofDetail(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load proof detail');
    }
  };

  const loadPhoto = async (evidenceId: string) => {
    if (photoUrls[evidenceId]) return;
    try {
      const blob = await fetchBlob(`/sync/evidence/${evidenceId}/file`);
      setPhotoUrls((p) => ({ ...p, [evidenceId]: URL.createObjectURL(blob) }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load photo');
    }
  };

  const doGeneratePayouts = () =>
    run('gen-payouts', async () => {
      if (!selected) return;
      const r = await generatePayouts(selected);
      setFlash(
        r.skipped_paid > 0
          ? `${r.operators} payout(s) generated · ${r.skipped_paid} paid kept untouched`
          : `${r.operators} payout(s) generated at €${r.rate_per_piece.toFixed(2)}/piece`
      );
      setPayouts(await listPayouts().catch(() => []));
    });

  const doPayout = (p: PayoutRow, action: 'approve' | 'pay') =>
    run(`payout-${p.id}`, async () => {
      if (action === 'approve') await approvePayout(p.id);
      else await payPayout(p.id);
      setFlash(`Payout ${action === 'approve' ? 'approved' : 'paid'} · €${Number(p.amount_eur).toFixed(2)}`);
      setPayouts(await listPayouts().catch(() => []));
      await loadAll();
    });

  const campaign = campaigns?.find((c) => c.id === selected) ?? null;
  const canSplit = campaign ? ['approved', 'planned', 'assigned'].includes(campaign.status) : false;

  return (
    <div className="min-h-screen bg-slate-50 text-[#0a0a0b]">
      <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-1.5 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <RealReachLogo size={20} color="#0a0a0b" />
          <span className="text-sm font-bold tracking-tight">Operations console</span>
        </div>
        <button
          type="button"
          onClick={() => void loadAll()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-black cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-5 space-y-5">
        {error && (
          <p className="text-xs text-red-600 inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </p>
        )}
        {flash && (
          <p className="text-xs text-emerald-700 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            <Check className="h-3.5 w-3.5" /> {flash}
          </p>
        )}

        <div className="grid lg:grid-cols-12 gap-5">
          {/* Campaign list */}
          <section className="lg:col-span-4 space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Campaigns</h2>
            {campaigns === null ? (
              <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-400" />
              </div>
            ) : campaigns.length === 0 ? (
              <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center text-xs text-slate-500">
                No campaigns yet.{' '}
                <Link to="/campaigns/new" className="font-bold text-black underline">Create one</Link>.
              </div>
            ) : (
              <ul className="space-y-2">
                {campaigns.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(c.id)}
                      className={`w-full text-left rounded-2xl border bg-white p-4 transition-all cursor-pointer ${
                        selected === c.id ? 'border-black shadow-md' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold truncate">{c.title}</p>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${badge(c.status)}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {(c.activity_type ?? 'flyer_distribution').replace('_', ' ')}
                        {c.area_m2 ? ` · ${Math.round(c.area_m2).toLocaleString()} m²` : ''}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Selected campaign: plan → split → assign */}
          <section className="lg:col-span-8 space-y-4">
            {!campaign ? (
              <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center">
                <MapPin className="h-8 w-8 mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-bold">Select a campaign</p>
                <p className="mt-1 text-xs text-slate-500">
                  Approve the plan, split the area into tasks, then assign them to operators.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold">{campaign.title}</h2>
                      <p className="text-[11px] text-slate-500">
                        {campaign.objective ?? 'No objective set'}
                        {campaign.start_date ? ` · ${campaign.start_date.slice(0, 10)} → ${campaign.end_date?.slice(0, 10) ?? '—'}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${badge(campaign.status)}`}>
                        {campaign.status.replace('_', ' ')}
                      </span>
                      {statusAction(campaign.status) && (
                        <button
                          type="button"
                          disabled={busy !== null}
                          onClick={() => doStatus(campaign, statusAction(campaign.status)!.to)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0a0a0b] text-white px-3 py-2 text-[11px] font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {busy === `status-${campaign.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : statusAction(campaign.status)!.icon}
                          {statusAction(campaign.status)!.label}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Split panel */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-end gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Rows</label>
                      <input
                        type="number" min={1} max={20} value={rows}
                        onChange={(e) => setRows(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                        className="w-20 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Columns</label>
                      <input
                        type="number" min={1} max={20} value={cols}
                        onChange={(e) => setCols(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                        className="w-20 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs outline-none focus:border-black"
                      />
                    </div>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 pb-2.5 cursor-pointer">
                      <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} />
                      Replace unclaimed tasks
                    </label>
                    <button
                      type="button"
                      onClick={doSplit}
                      disabled={!canSplit || busy !== null}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-[#0a0a0b] text-white px-4 py-2.5 text-xs font-bold hover:bg-neutral-800 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      {busy === 'split' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Split className="h-3.5 w-3.5" />}
                      Generate tasks ({rows * cols} cells)
                    </button>
                  </div>
                  {!canSplit && (
                    <p className="mt-2 text-[11px] text-slate-400">
                      Splitting is available once the plan is approved.
                    </p>
                  )}
                </div>

                {/* Tasks */}
                <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold">Tasks ({tasks.length})</h3>
                  </div>
                  {tasks.length === 0 ? (
                    <p className="p-6 text-center text-xs text-slate-500">
                      No tasks yet — split the campaign area above.
                    </p>
                  ) : (
                    <ul className="divide-y divide-slate-50">
                      {tasks.map((t) => (
                        <li key={t.id} className="px-5 py-3 flex flex-wrap items-center gap-3">
                          <span className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600">
                            {t.campaign_seq ?? '·'}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">{t.id.slice(0, 8)}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge(t.status)}`}>
                            {t.status.replace('_', ' ')}
                          </span>
                          <div className="ml-auto flex items-center gap-2">
                            {t.status === 'available' ? (
                              <>
                                <select
                                  value={assignDraft[t.id] ?? ''}
                                  onChange={(e) => setAssignDraft((p) => ({ ...p, [t.id]: e.target.value }))}
                                  className="rounded-xl bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-[11px] outline-none focus:border-black cursor-pointer"
                                >
                                  <option value="">Choose operator…</option>
                                  {operators.map((o) => (
                                    <option key={o.id} value={o.id}>
                                      {o.display_name ?? o.full_name ?? o.email} · {o.active_tasks} active
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  disabled={busy !== null || !assignDraft[t.id]}
                                  onClick={() => void doAssign(t)}
                                  className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-2.5 py-1.5 text-[11px] font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                                >
                                  {busy === `assign-${t.id}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                                  Assign
                                </button>
                              </>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                {t.assigned_at ? `assigned ${t.assigned_at.slice(0, 10)}` : ''}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </section>
        </div>

        {/* Proof review queue */}
        <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-bold">Proof review queue ({proofs?.length ?? 0})</h3>
            <span className="text-[11px] text-slate-400">
              verification runs automatically; a human always decides
            </span>
          </div>
          {proofs === null ? (
            <div className="p-6 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-400" /></div>
          ) : proofs.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-500">Nothing waiting for review.</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {proofs.map((p) => (
                <li key={p.id} className="px-5 py-4 border-b border-slate-50">
                  <div className="flex flex-wrap items-start gap-3">
                  <span className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600">
                    {p.campaign_seq ?? '·'}
                  </span>
                  <div
                    className="flex-1 min-w-[220px] cursor-pointer"
                    onClick={() => void toggleProof(p.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') void toggleProof(p.id); }}
                  >
                    <p className="text-xs font-bold">
                      {p.campaign_title}
                      <span className="font-mono text-slate-400 font-medium"> · {p.task_id.slice(0, 8)}</span>
                      <span className="ml-2 text-[10px] font-bold text-slate-400">
                        {openProof === p.id ? '▾ hide evidence' : '▸ view evidence'}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {p.evidence_count} evidence item(s)
                      {p.coverage_percentage != null ? ` · ${p.coverage_percentage}% coverage` : ''}
                      {' · '}submitted {p.submitted_at.slice(0, 16).replace('T', ' ')}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {p.checks?.map((c) => (
                        <span
                          key={c.key}
                          title={`${c.label}: ${c.detail ?? ''}`}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.passed ? 'bg-emerald-50 text-emerald-700' : c.required ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {c.passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          {c.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${VERDICT[p.verification_status ?? ''] ?? 'bg-slate-100 text-slate-500'}`}>
                      {(p.verification_status ?? 'unverified').replace('_', ' ')}
                    </span>
                    {p.review_status !== 'pending' && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.review_status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      }`}>
                        human: {p.review_status}
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => void doReview(p, 'rejected')}
                      className="inline-flex items-center gap-1 rounded-xl border border-red-200 text-red-600 px-2.5 py-1.5 text-[11px] font-bold hover:bg-red-50 disabled:opacity-40 cursor-pointer"
                    >
                      {busy === `review-${p.id}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => void doReview(p, 'approved')}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#0a0a0b] text-white px-2.5 py-1.5 text-[11px] font-bold hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Approve
                    </button>
                  </div>
                  </div>

                  {openProof === p.id && (
                    <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                      {!proofDetail ? (
                        <p className="text-[11px] text-slate-500 inline-flex items-center gap-1.5">
                          <Loader2 className="h-3 w-3 animate-spin" /> Loading evidence…
                        </p>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-4 text-[11px] text-slate-600">
                            <span><b>{proofDetail.route.points}</b> GPS points</span>
                            <span><b>{proofDetail.route.sessions}</b> session(s)</span>
                            <span><b>{Math.round(proofDetail.route.duration_seconds / 60)}</b> min on site</span>
                            {proofDetail.evidence.filter((e) => e.kind === 'quantity').reduce((s, e) => s + (e.quantity ?? 0), 0) > 0 && (
                              <span>
                                <b>
                                  {proofDetail.evidence.filter((e) => e.kind === 'quantity').reduce((s, e) => s + (e.quantity ?? 0), 0)}
                                </b>{' '}
                                pieces logged
                              </span>
                            )}
                          </div>
                          <ul className="space-y-2">
                            {proofDetail.evidence.length === 0 && (
                              <li className="text-[11px] text-slate-500">No evidence items on this task.</li>
                            )}
                            {proofDetail.evidence.map((ev) => (
                              <li key={ev.id} className="flex flex-wrap items-center gap-2 text-[11px] bg-white border border-slate-200 rounded-lg px-3 py-2">
                                <span className="font-bold uppercase text-[10px] text-slate-500">{ev.kind}</span>
                                {ev.content && <span className="text-slate-700">“{ev.content}”</span>}
                                {ev.quantity != null && <span className="font-bold text-slate-700">{ev.quantity} pcs</span>}
                                <span className="text-slate-400">
                                  {ev.captured_at ? new Date(ev.captured_at).toLocaleString() : ''}
                                </span>
                                {ev.kind === 'photo' && (
                                  photoUrls[ev.id] ? (
                                    <img
                                      src={photoUrls[ev.id]}
                                      alt="proof"
                                      className="ml-auto max-h-32 rounded-lg border border-slate-200"
                                    />
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => void loadPhoto(ev.id)}
                                      className="ml-auto rounded-lg border border-slate-300 px-2 py-1 text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
                                    >
                                      Load photo
                                    </button>
                                  )
                                )}
                              </li>
                            ))}
                          </ul>
                          {proofDetail.review_status !== 'pending' && (
                            <p className="text-[11px] text-slate-600">
                              Human decision:{' '}
                              <b className={proofDetail.review_status === 'approved' ? 'text-emerald-700' : 'text-red-600'}>
                                {proofDetail.review_status}
                              </b>
                              {proofDetail.verification[0]?.reviewed_by
                                ? ` · reviewer ${proofDetail.verification[0].reviewed_by.slice(0, 8)}`
                                : ''}
                              {proofDetail.verification[0]?.reviewed_at
                                ? ` · ${proofDetail.verification[0].reviewed_at.slice(0, 16).replace('T', ' ')}`
                                : ''}
                            </p>
                          )}
                          {proofDetail.verification.length > 1 && (
                            <p className="text-[11px] text-slate-500">
                              {proofDetail.verification.length} verification run(s) · latest:{' '}
                              <b>{proofDetail.verification[0].status.replace('_', ' ')}</b>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Payouts */}
        <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-slate-500" />
              <h3 className="text-sm font-bold">Payouts ({payouts?.length ?? 0})</h3>
              <span className="text-[11px] text-slate-400">piece-rate · generate from approved work</span>
            </div>
            <button
              type="button"
              disabled={!selected || busy !== null}
              onClick={doGeneratePayouts}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-1.5 text-[11px] font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              {busy === 'gen-payouts' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Coins className="h-3 w-3" />}
              Generate for selected campaign
            </button>
          </div>
          {payouts === null ? (
            <div className="p-6 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-400" /></div>
          ) : payouts.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-500">
              No payouts yet. Approve proofs, then generate a statement for the campaign.
            </p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {payouts.map((p) => (
                <li key={p.id} className="px-5 py-3 flex flex-wrap items-center gap-3 text-xs">
                  <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {(p.operator_name ?? p.operator_email ?? '??').slice(0, 2).toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-[160px]">
                    <p className="font-bold">{p.operator_name ?? p.operator_email}</p>
                    <p className="text-[11px] text-slate-500">
                      {p.campaign_title ?? '—'} · {p.pieces} pieces × €{Number(p.rate_eur).toFixed(2)}
                    </p>
                  </div>
                  <span className="font-extrabold text-sm">€{Number(p.amount_eur).toFixed(2)}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'paid' ? 'bg-emerald-100 text-emerald-800'
                      : p.status === 'approved' ? 'bg-indigo-100 text-indigo-800'
                      : p.status === 'cancelled' ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.status}
                  </span>
                  <div className="flex items-center gap-2">
                    {p.status === 'pending' && (
                      <button
                        type="button"
                        disabled={busy !== null}
                        onClick={() => void doPayout(p, 'approve')}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-2.5 py-1.5 text-[11px] font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        {busy === `payout-${p.id}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                        Approve
                      </button>
                    )}
                    {p.status === 'approved' && (
                      <button
                        type="button"
                        disabled={busy !== null}
                        onClick={() => void doPayout(p, 'pay')}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#0a0a0b] text-white px-2.5 py-1.5 text-[11px] font-bold hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
                      >
                        <Coins className="h-3 w-3" />
                        Mark paid
                      </button>
                    )}
                    {p.paid_at ? (
                      <span className="text-[11px] text-slate-400">{p.paid_at.slice(0, 10)}</span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Operator pool */}
        <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-bold">Operator pool ({operators.length})</h3>
          </div>
          {operators.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-500">No operators registered yet.</p>
          ) : (
            <ul className="divide-y divide-slate-50">
              {operators.map((o) => (
                <li key={o.id} className="px-5 py-3 flex flex-wrap items-center gap-3 text-xs">
                  <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {(o.display_name ?? o.full_name ?? o.email).slice(0, 2).toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-[140px]">
                    <p className="font-bold">{o.display_name ?? o.full_name ?? o.email}</p>
                    <p className="text-[11px] text-slate-500">{o.email}</p>
                  </div>
                  <span className="text-[11px] text-slate-500">{o.active_tasks} active · {o.pending_review} in review</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge(o.availability_today ?? 'available')}`}>
                    {o.availability_today ?? 'not set'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default OpsConsolePage;
