import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Loader2, AlertCircle, MapPin, Receipt, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useLeafletMap } from '../../lib/useLeafletMap';
import { useAdmin } from '../../components/admin/AdminShell';
import DeliveryMap, { type MapCampaign } from '../../components/admin/DeliveryMap';
import {
  getAdminOverview, getAdminMap, payInvoice, type AdminOverview, type AdminInvoice,
} from '../../lib/adminApi';

/**
 * The delivery map card.
 *
 * Real geometry, not pins: each campaign's area polygons, coloured by how much
 * is done, with any recorded route drawn on top and coloured by walking pace.
 */
function DeliveryMapCard({ campaigns }: { campaigns: MapCampaign[] }) {
  const navigate = useNavigate();
  return (
    <DeliveryMap
      campaigns={campaigns}
      height={460}
      onSelectCampaign={(id) => navigate(`/campaigns/${id}/report`)}
    />
  );
}

/** Deliveries and revenue per month, two bars per month, no chart library. */
function ActivityChart({ series }: { series: AdminOverview['series'] }) {
  const { num, eur, t } = useAdmin();
  const maxPieces = Math.max(1, ...series.map((s) => s.letterboxes));
  const maxRevenue = Math.max(1, ...series.map((s) => s.revenue));
  const [label, setLabel] = useState<string | null>(null);

  if (series.length === 0) {
    return <p className="px-5 py-10 text-center text-xs text-slate-400">{t('common.loading')}</p>;
  }

  return (
    <div className="px-5 pb-4 pt-2">
      <div className="flex h-40 items-end gap-2">
        {series.map((s) => {
          const [year, month] = s.period.split('-');
          const hPieces = (s.letterboxes / maxPieces) * 100;
          const hRevenue = (s.revenue / maxRevenue) * 100;
          const active = label === s.period;
          return (
            <div
              key={s.period}
              className="group relative flex flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setLabel(s.period)}
              onMouseLeave={() => setLabel(null)}
            >
              {active && (
                <div className="absolute -top-1 z-10 whitespace-nowrap rounded-lg bg-[#0a0a0b] px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-lg">
                  <div>
                    {month}/{year} · {t('common.deliveries')}: {num(s.letterboxes)}
                  </div>
                  <div>
                    {t('common.revenue')}: {eur(s.revenue)}
                  </div>
                </div>
              )}
              <div
                className="w-full rounded-t-md bg-[#006de4] transition-all"
                style={{ height: `${Math.max(2, hPieces)}%` }}
              />
              <div
                className="mt-0.5 w-full rounded-b-md bg-emerald-400 transition-all"
                style={{ height: `${Math.max(2, hRevenue)}%` }}
              />
              <span className="mt-1.5 text-[9px] font-semibold text-slate-400">
                {month}/{year.slice(2)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[#006de4]" />
          {t('common.deliveries')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-emerald-400" />
          {t('common.revenue')}
        </span>
      </div>
    </div>
  );
}

function KpiCard({
  label, value, tone,
}: { label: string; value: string; tone?: 'alert' | 'positive' }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p
        className={`mt-1.5 text-[28px] font-extrabold leading-none tabular-nums ${
          tone === 'alert' ? 'text-red-600' : tone === 'positive' ? 'text-emerald-600' : 'text-[#0a0a0b]'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status, t }: { status: string; t: (k: string) => string }) {
  const key = `invoices.${status}`;
  const label = t(key);
  const known = label !== key;
  const cls = known
    ? status === 'paid'
      ? 'bg-emerald-50 text-emerald-700'
      : status === 'overdue'
        ? 'bg-red-50 text-red-700'
        : 'bg-slate-100 text-slate-600'
    : 'bg-slate-100 text-slate-600';
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${cls}`}>{label}</span>;
}

export function AdminHomePage() {
  const { t, num, eur, date, relative } = useAdmin();
  const navigate = useNavigate();
  const [months, setMonths] = useState<1 | 3 | 12>(3);
  const [data, setData] = useState<AdminOverview | null>(null);
  const [mapCampaigns, setMapCampaigns] = useState<MapCampaign[] | null>(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (m: 1 | 3 | 12) => {
    setError('');
    try {
      setData(await getAdminOverview(m));
      setMapCampaigns((await getAdminMap('active')).campaigns as MapCampaign[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to load');
    }
  }, []);

  useEffect(() => {
    void load(months);
  }, [months, load]);

  const k = data?.kpis;

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      {error && (
        <p className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      {!data ? (
        <p className="flex items-center gap-2 px-1 py-16 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> {t('common.loading')}
        </p>
      ) : (
        <div className="space-y-5">
          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard label={t('kpi.activeCampaigns')} value={num(k?.active_campaigns ?? 0)} />
            <KpiCard
              label={t('kpi.letterboxesMonth')}
              value={num(k?.letterboxes_this_month ?? 0)}
            />
            <KpiCard
              label={t('kpi.revenueMonth')}
              value={eur(k?.revenue_this_month ?? 0)}
              tone={(k?.revenue_this_month ?? 0) > 0 ? 'positive' : undefined}
            />
            <KpiCard
              label={t('kpi.overdueInvoices')}
              value={num(k?.overdue_invoices ?? 0)}
              tone={(k?.overdue_invoices ?? 0) > 0 ? 'alert' : undefined}
            />
            <KpiCard
              label={t('kpi.openIssues')}
              value={num(k?.open_issues ?? 0)}
              tone={(k?.open_issues ?? 0) > 0 ? 'alert' : undefined}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
            {/* Map */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
              <header className="flex flex-wrap items-center gap-3 px-5 py-4">
                <MapPin className="h-4 w-4 text-slate-400" />
                <h2 className="text-sm font-bold">{t('home.deliveryMap')}</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {num(mapCampaigns?.length ?? 0)} {t('home.activeDeliveryCampaigns')}
                </span>
                {data.map_pins.length > 0 && (
                  <button
                    type="button"
                    onClick={() => navigate('/admin/campaigns?status=active')}
                    className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-[#006de4] hover:underline cursor-pointer"
                  >
                    {t('home.openLiveMap')}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </header>
              {(mapCampaigns ?? []).length === 0 ? (
                <div className="px-5 pb-16 pt-10 text-center">
                  <p className="text-sm font-bold">{t('home.emptyTitle')}</p>
                  <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                    {t('home.emptyBody')}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/campaigns/new')}
                    className="mt-4 rounded-full bg-[#0a0a0b] px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
                  >
                    {t('home.createFirst')}
                  </button>
                </div>
              ) : (
                <DeliveryMapCard campaigns={mapCampaigns ?? []} />
              )}
            </section>

            {/* Invoices */}
            <section className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
              <header className="flex items-center gap-2 px-5 py-4">
                <Receipt className="h-4 w-4 text-slate-400" />
                <h2 className="text-sm font-bold">{t('home.invoices')}</h2>
                <button
                  type="button"
                  onClick={() => navigate('/admin/billing')}
                  className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-[#006de4] hover:underline cursor-pointer"
                >
                  {t('home.viewAllInvoices')}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </header>

              {data.invoices.length === 0 ? (
                <p className="px-5 pb-10 text-center text-xs text-slate-400">
                  {t('invoices.none')}
                </p>
              ) : (
                <ul className="divide-y divide-slate-50 border-t border-slate-100">
                  {data.invoices.slice(0, 6).map((inv) => {
                    const overdue =
                      inv.status !== 'paid' &&
                      inv.status !== 'cancelled' &&
                      inv.due_date != null &&
                      new Date(inv.due_date) < new Date();
                    return (
                      <li key={inv.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                        <div className="min-w-[140px] flex-1">
                          <p className="truncate text-xs font-bold text-[#0a0a0b]">
                            {inv.campaign_title ?? inv.number}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {inv.client_name ?? '—'} · {inv.number}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold tabular-nums">
                            {eur(inv.total_eur ?? inv.amount)}
                          </p>
                          <p
                            className={`text-[10px] ${overdue ? 'font-bold text-red-600' : 'text-slate-400'}`}
                          >
                            {t('invoices.due')} {date(inv.due_date)}
                          </p>
                        </div>
                        <StatusPill status={overdue ? 'overdue' : inv.status} t={t} />
                        {inv.status !== 'paid' && (
                          <button
                            type="button"
                            disabled={busyId === inv.id}
                            onClick={async () => {
                              setBusyId(inv.id);
                              try {
                                await payInvoice(inv.id);
                                await load(months);
                              } finally {
                                setBusyId(null);
                              }
                            }}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                          >
                            {busyId === inv.id ? '…' : t('invoices.markPaid')}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>

          {/* Activity chart */}
          <section className="rounded-2xl bg-white px-5 pb-5 pt-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
            <header className="mb-2 flex flex-wrap items-center gap-3">
              <h2 className="text-sm font-bold">{t('home.activity')}</h2>
              <div className="ml-auto flex items-center gap-1 rounded-full bg-slate-100 p-1">
                {([1, 3, 12] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMonths(m)}
                    className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                      months === m ? 'bg-white text-[#0a0a0b] shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    {m === 1 ? '1m' : m === 3 ? '3m' : '12m'}
                  </button>
                ))}
              </div>
            </header>
            <ActivityChart series={data.series} />
            <p className="mt-2 text-[10px] text-slate-400">
              {t('home.range')}: {months}m · {relative(data.series[data.series.length - 1]?.period ? undefined : undefined)}
            </p>
          </section>
        </div>
      )}
    </main>
  );
}

export default AdminHomePage;
