import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronDown, Map, Receipt, Pencil, Loader2, Download, CheckCircle2, X,
} from 'lucide-react';
import { useAdmin } from '../../components/admin/AdminShell';
import {
  listAdminCampaigns, getAdminCampaign, updateAdminCampaign,
  type AdminCampaign, type AdminArea,
} from '../../lib/adminApi';

/**
 * The campaigns table.
 *
 * This is the screen operations lives in, so it optimises for scanning and then
 * drilling in: filter tabs, one search box that covers client, campaign and
 * district, and each row expanding into the areas that actually need attention.
 *
 * Two things deliberately not faked:
 *  - a letterbox figure is labelled as a count, and the campaign without an
 *    estimate simply has none;
 *  - a progress bar is `done / total` on real areas, never a guess.
 */

const STATUS_FILTERS = [
  { key: 'all', labelKey: 'common.all' },
  { key: 'active', labelKey: 'common.active' },
  { key: 'completed', labelKey: 'common.completed' },
] as const;

const STATUS_STYLE: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700',
  in_progress: 'bg-blue-50 text-blue-700',
  active: 'bg-blue-50 text-blue-700',
  planned: 'bg-amber-50 text-amber-700',
  submitted: 'bg-violet-50 text-violet-700',
  draft: 'bg-slate-100 text-slate-600',
  paused: 'bg-orange-50 text-orange-700',
  cancelled: 'bg-slate-100 text-slate-500',
};

const AREA_STATUS_STYLE: Record<string, string> = {
  approved: 'bg-emerald-50 text-emerald-700',
  in_progress: 'bg-blue-50 text-blue-700',
  assigned: 'bg-amber-50 text-amber-700',
  available: 'bg-slate-100 text-slate-600',
  rejected: 'bg-red-50 text-red-700',
  reported: 'bg-red-50 text-red-700',
};

function Progress({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
        <span
          className={`block h-full rounded-full ${done >= total && total > 0 ? 'bg-emerald-500' : 'bg-[var(--rr-accent)]'}`}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="text-[11px] font-bold tabular-nums text-slate-600">
        {done}/{total}
      </span>
    </span>
  );
}

/** One area, shown when a campaign row is expanded. */
function AreaRow({ area }: { area: AdminArea }) {
  const { t, num, eur, km, dateTime, date } = useAdmin();
  return (
    <tr className="bg-slate-50/60">
      <td className="px-5 py-2.5 text-[11px] font-bold text-slate-500">
        {area.quartiere ?? `Area ${area.campaign_seq ?? ''}`}
        {area.cap ? ` · ${area.cap}` : ''}
      </td>
      <td className="px-3 py-2.5">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            AREA_STATUS_STYLE[area.status] ?? 'bg-slate-100 text-slate-600'
          }`}
        >
          {area.status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-3 py-2.5">
        <Progress done={area.status === 'approved' ? 1 : 0} total={1} />
      </td>
      <td className="px-3 py-2.5 text-[11px] tabular-nums text-slate-600">
        {area.letterboxes_total != null ? num(area.letterboxes_total) : '—'}
        <span className="ml-1 text-slate-400">
          {area.houses != null || area.units != null
            ? `(${num(area.houses ?? 0)}/${num(area.units ?? 0)})`
            : ''}
        </span>
      </td>
      <td className="px-3 py-2.5 text-[11px] text-slate-600">
        {area.distributor_name ?? t('common.unassigned')}
      </td>
      <td className="px-3 py-2.5 text-[10px] tabular-nums text-slate-400">
        {area.accepted_at ? `A ${dateTime(area.accepted_at)}` : '—'}
        <br />
        {area.completed_at ? `C ${dateTime(area.completed_at)}` : ''}
      </td>
      <td className="px-3 py-2.5 text-[11px] font-bold tabular-nums text-slate-700">
        {area.price_eur != null ? eur(area.price_eur) : '—'}
        {area.distance_km != null && (
          <span className="ml-1 font-normal text-slate-400">{km(area.distance_km)}</span>
        )}
      </td>
      <td className="px-5 py-2.5 text-right text-[10px] text-slate-400">{area.started_at ? date(area.started_at) : '—'}</td>
    </tr>
  );
}

export function AdminCampaignsPage() {
  const { t, num, eur, relative, date } = useAdmin();
  const navigate = useNavigate();

  const [status, setStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<AdminCampaign[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [areas, setAreas] = useState<Record<string, AdminArea[]>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [renaming, setRenaming] = useState<{ id: string; title: string } | null>(null);

  const load = useCallback(async (s: string, query: string) => {
    setError('');
    try {
      setRows(await listAdminCampaigns({ status: s, q: query }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to load campaigns');
      setRows([]);
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => void load(status, q.trim()), 250);
    return () => clearTimeout(handle);
  }, [status, q, load]);

  const toggle = async (id: string) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    if (areas[id]) return;
    try {
      const detail = await getAdminCampaign(id);
      setAreas((prev) => ({ ...prev, [id]: detail.areas }));
    } catch {
      setError('failed to load the campaign areas');
    }
  };

  const allSelected = useMemo(
    () => (rows?.length ?? 0) > 0 && (rows ?? []).every((r) => selected.has(r.id)),
    [rows, selected]
  );

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set((rows ?? []).map((r) => r.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const changeStatus = async (statusValue: string) => {
    if (selected.size === 0) return;
    setBusy(true);
    try {
      await Promise.all([...selected].map((id) => updateAdminCampaign(id, { status: statusValue })));
      setSelected(new Set());
      await load(status, q.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to change status');
    } finally {
      setBusy(false);
    }
  };

  const rename = async () => {
    if (!renaming || !renaming.title.trim()) return;
    setBusy(true);
    try {
      await updateAdminCampaign(renaming.id, { title: renaming.title.trim() });
      setRenaming(null);
      await load(status, q.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to rename');
    } finally {
      setBusy(false);
    }
  };

  /**
   * CSV export. Built in the browser and downloaded as a blob: an export that
   * needs a server round trip is an export nobody runs during a standup.
   */
  const exportCsv = () => {
    const list = (rows ?? []).filter((r) => selected.size === 0 || selected.has(r.id));
    if (list.length === 0) return;
    const header = [
      'campaign', 'client', 'status', 'areas', 'areas_done', 'letterboxes', 'area_value_eur', 'created',
    ];
    const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const body = list.map((r) =>
      [
        r.title, r.client_name ?? '', r.status, r.areas, r.areas_done,
        r.letterboxes, r.area_value.toFixed(2), r.created_at.slice(0, 10),
      ]
        .map(escape)
        .join(',')
    );
    const blob = new Blob([[header.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `realreach-campaigns-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-end gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--rr-brand)]">
            {t('nav.campaigns')}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {rows === null ? t('common.loading') : `${num(rows.length)} campagne`}
          </p>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setStatus(f.key)}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                  status === f.key ? 'bg-white text-[var(--rr-brand)] shadow-sm' : 'text-slate-500'
                }`}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('common.search')}
              className="w-56 bg-transparent text-xs outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </header>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
      )}

      {/* Bulk actions, only when something is selected. */}
      {selected.size > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <span className="text-[11px] font-bold text-slate-600">
            {selected.size} selezionate
          </span>
          <select
            disabled={busy}
            onChange={(e) => {
              if (e.target.value) void changeStatus(e.target.value);
            }}
            defaultValue=""
            className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-bold disabled:opacity-40"
          >
            <option value="">Cambia stato…</option>
            {['planned', 'active', 'in_progress', 'completed', 'paused', 'cancelled'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-bold hover:bg-slate-50 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Esporta CSV
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Annulla
          </button>
        </div>
      )}

      <section className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="w-8 px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-3 py-2.5 font-bold">{t('common.campaign')}</th>
                <th className="px-3 py-2.5 font-bold">{t('invoices.client')}</th>
                <th className="px-3 py-2.5 font-bold">{t('common.status')}</th>
                <th className="px-3 py-2.5 font-bold">Aree</th>
                <th className="px-3 py-2.5 font-bold">Volantini</th>
                <th className="px-3 py-2.5 font-bold">Ritiro</th>
                <th className="px-3 py-2.5 font-bold">{t('common.created')}</th>
                <th className="px-5 py-2.5 text-right font-bold">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {rows === null ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-xs text-slate-400">
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center">
                    <p className="text-sm font-bold">{t('home.emptyTitle')}</p>
                    <p className="mt-1 text-xs text-slate-500">{t('home.emptyBody')}</p>
                  </td>
                </tr>
              ) : (
                rows.flatMap((r) => {
                  const open = expanded === r.id;
                  const main = (
                    <tr key={r.id} className="border-t border-slate-50 hover:bg-slate-50/60">
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(r.id)}
                          onChange={() => toggleOne(r.id)}
                          aria-label={`Select ${r.title}`}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void toggle(r.id)}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            aria-label={open ? 'Collapse areas' : 'Expand areas'}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                            />
                          </button>
                          <span className="font-bold text-[var(--rr-brand)]">{r.title}</span>
                          <button
                            type="button"
                            onClick={() => setRenaming({ id: r.id, title: r.title })}
                            className="text-slate-300 hover:text-slate-600 cursor-pointer"
                            aria-label="Rename"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          {r.material && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                              {r.material.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {r.client_name ?? r.client_company ?? '—'}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            STATUS_STYLE[r.status] ?? 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {r.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <Progress done={r.areas_done} total={r.areas} />
                      </td>
                      <td className="px-3 py-3 tabular-nums text-slate-600">
                        {r.letterboxes > 0 ? num(r.letterboxes) : '—'}
                      </td>
                      <td className="px-3 py-3 text-[11px] text-slate-500">
                        {r.pickup_address ?? '—'}
                        {r.pickup_date ? (
                          <span className="block text-[10px] text-slate-400">
                            {date(r.pickup_date)}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-[11px] text-slate-400">
                        {relative(r.created_at)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/campaigns/${r.id}/report`)}
                          title="Mappa"
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
                        >
                          <Map className="h-3 w-3" />
                          Map
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/admin/billing')}
                          title="Ricevuta"
                          className="ml-1.5 inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
                        >
                          <Receipt className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                  if (!open) return [main];

                  const list = areas[r.id] ?? [];
                  return [
                    main,
                    <tr key={`${r.id}-areas`}>
                      <td colSpan={9} className="px-0 py-0">
                        {list.length === 0 ? (
                          <p className="px-5 py-4 text-[11px] text-slate-400">Caricamento aree…</p>
                        ) : (
                          <table className="w-full min-w-[1080px] text-left text-xs">
                            <thead className="text-[9px] uppercase tracking-wider text-slate-400">
                              <tr>
                                <th className="px-5 py-2 font-bold">Area</th>
                                <th className="px-3 py-2 font-bold">{t('common.status')}</th>
                                <th className="px-3 py-2 font-bold">Avanzamento</th>
                                <th className="px-3 py-2 font-bold">Indirizzi</th>
                                <th className="px-3 py-2 font-bold">Distributore</th>
                                <th className="px-3 py-2 font-bold">Accettato / Completato</th>
                                <th className="px-3 py-2 font-bold">Fee</th>
                                <th className="px-5 py-2 text-right font-bold">Ritiro</th>
                              </tr>
                            </thead>
                            <tbody>
                              {list.map((a) => (
                                <AreaRow key={a.id} area={a} />
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>,
                  ];
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {rows !== null && rows.length > 0 && (
        <p className="mt-3 text-[10px] text-slate-400">
          <CheckCircle2 className="mr-1 inline h-3 w-3" />
          I numeri di letterbox sono stime ricavate dall'area finché non scegliamo una fonte
          indirizzi. Le aree senza importo restano senza valore invece di mostrare zero.
        </p>
      )}

      {/* Rename */}
      {renaming && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-sm font-bold text-[var(--rr-brand)]">Rinomina campagna</h2>
            <input
              autoFocus
              value={renaming.title}
              onChange={(e) => setRenaming({ ...renaming, title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void rename();
                if (e.key === 'Escape') setRenaming(null);
              }}
              className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRenaming(null)}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void rename()}
                className="rounded-full bg-[var(--rr-brand)] px-4 py-2 text-xs font-bold text-white disabled:opacity-40 cursor-pointer"
              >
                {busy ? '…' : t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminCampaignsPage;
