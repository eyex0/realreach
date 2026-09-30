import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2, AlertCircle, Target, MapPin, Wallet, Activity, Flag, ChevronRight, Plus,
} from 'lucide-react';
import { getClientDashboard, type ClientDashboard, type DashboardCampaign } from '../lib/api';

const num = (n: number) => Math.round(n).toLocaleString('en-GB');
const eur = (n: number) => `€${Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pct = (n: number | null) => (n == null ? '—' : `${(n * 100).toFixed(1)}%`);
const when = (iso: string | null) => (iso ? iso.slice(0, 10) : '—');

const WINDOWS: { months: 1 | 3 | 12; label: string }[] = [
  { months: 1, label: '1 month' },
  { months: 3, label: '3 months' },
  { months: 12, label: '12 months' },
];

function Tile({
  label, value, hint, tone,
}: { label: string; value: string; hint?: string; tone?: 'accent' | 'warn' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p
        className={`mt-1 text-2xl font-extrabold tabular-nums ${
          tone === 'accent' ? 'text-emerald-600' : tone === 'warn' ? 'text-amber-600' : 'text-[#0a0a0b]'
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[10px] text-slate-400">{hint}</p>}
    </div>
  );
}

function CampaignRow({ c }: { c: DashboardCampaign }) {
  const done = c.areas > 0 && c.areas_verified >= c.areas;
  return (
    <li className="px-5 py-3">
      <Link to={`/campaigns/${c.id}/report`} className="group flex flex-wrap items-center gap-3">
        <div className="min-w-[180px] flex-1">
          <p className="text-xs font-bold text-[#0a0a0b] group-hover:underline">{c.title}</p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            {c.activity_type?.replace('_', ' ') ?? 'campaign'} · created {when(c.created_at)}
            {c.proofs_pending > 0 ? ` · ${c.proofs_pending} proof(s) to review` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-[#006de4]'}`}
              style={{ width: `${c.areas > 0 ? (c.areas_verified / c.areas) * 100 : 0}%` }}
            />
          </div>
          <span className="w-16 text-right text-[11px] font-bold tabular-nums text-slate-600">
            {c.areas_verified}/{c.areas} areas
          </span>
        </div>

        <span className="w-20 text-right text-[11px] tabular-nums text-slate-500">
          {num(c.pieces)} pcs
        </span>

        <span className="w-24 text-right text-[10px] font-bold text-slate-400">
          {c.estimated_mailboxes != null ? `${num(c.estimated_mailboxes)} target` : 'no target set'}
        </span>

        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
      </Link>
    </li>
  );
}

/**
 * The client home screen (client spec §2.2).
 *
 * Every figure comes from one server call, so the tiles cannot disagree with
 * the rows beneath them. The money panels say what the money is: `payouts` is
 * what field operators are owed, which is *not* an invoice the client owes us.
 * There is no client invoicing yet because there is no payment provider
 * (wishlist D2), and calling it an invoice would be the most misleading thing
 * on the page.
 */
export const ClientDashboardPage: React.FC = () => {
  const [months, setMonths] = useState<1 | 3 | 12>(3);
  const [data, setData] = useState<ClientDashboard | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async (m: 1 | 3 | 12) => {
    setError('');
    try {
      setData(await getClientDashboard(m));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to load the dashboard');
    }
  }, []);

  useEffect(() => {
    void load(months);
  }, [months, load]);

  const t = data?.totals;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006de4]">
              Client dashboard
            </p>
            <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-[#0a0a0b]">
              What is running, and what it reached
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {data
                ? `Showing the last ${months} month${months === 1 ? '' : 's'} · ${data.currency}`
                : 'Loading…'}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
            {WINDOWS.map((w) => (
              <button
                key={w.months}
                type="button"
                onClick={() => setMonths(w.months)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-colors ${
                  months === w.months ? 'bg-[#0a0a0b] text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </header>

        {error && (
          <p className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}

        {!data ? (
          <p className="mt-8 flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your campaigns…
          </p>
        ) : (
          <>
            {/* What the client buys: reach, coverage, and what it cost. */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Tile
                label="Campaigns"
                value={`${t?.campaigns_active ?? 0} active`}
                hint={`${t?.campaigns_total ?? 0} in total`}
              />
              <Tile
                label="Areas verified"
                value={`${t?.areas_verified ?? 0} / ${t?.areas ?? 0}`}
                hint={`verification rate ${pct(t?.verification_rate ?? null)}`}
                tone={(t?.verification_rate ?? 1) >= 0.9 ? 'accent' : undefined}
              />
              <Tile label="Pieces logged" value={num(t?.pieces_logged ?? 0)} hint="from operator evidence" />
              <Tile
                label="Paid to operators"
                value={eur(t?.paid_to_operators ?? 0)}
                hint={`${eur(data.operator_rate_per_piece)} per piece`}
              />
              <Tile
                label="Pending payout"
                value={eur(t?.pending_to_operators ?? 0)}
                hint="generated, not yet paid"
                tone={(t?.pending_to_operators ?? 0) > 0 ? 'warn' : undefined}
              />
            </div>

            {t?.open_data_reports ? (
              <p className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                <Flag className="h-3.5 w-3.5" />
                {t.open_data_reports} bad-data report(s) open. Something on record is disputed and
                waiting on a human.
              </p>
            ) : null}

            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div className="space-y-5">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
                    <Target className="h-4 w-4 text-slate-400" />
                    <h2 className="text-sm font-bold">Campaigns</h2>
                    <Link
                      to="/campaigns/new"
                      className="ml-auto inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold hover:bg-slate-50"
                    >
                      <Plus className="h-3 w-3" />
                      New campaign
                    </Link>
                  </div>

                  {data.campaigns.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                      <p className="text-sm font-bold">No campaigns yet</p>
                      <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                        Draw an area, set a target reach, and we will price it before you commit.
                      </p>
                      <Link
                        to="/campaigns/new"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0a0a0b] px-4 py-2 text-xs font-bold text-white"
                      >
                        Create your first campaign
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 border-b border-slate-50 bg-slate-50 px-5 py-2 text-[10px] uppercase tracking-wider text-slate-400">
                        <span>Campaign</span>
                        <span className="w-28 text-right">Progress</span>
                        <span className="w-20 text-right">Pieces</span>
                        <span className="w-24 text-right">Target</span>
                        <span />
                      </div>
                      <ul className="divide-y divide-slate-50">
                        {data.campaigns.map((c) => (
                          <CampaignRow key={c.id} c={c} />
                        ))}
                      </ul>
                    </>
                  )}
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
                    <Wallet className="h-4 w-4 text-slate-400" />
                    <h2 className="text-sm font-bold">Operator payouts</h2>
                    <span className="text-[10px] text-slate-400">
                      what field operators are owed — not a client invoice
                    </span>
                  </div>
                  {data.operator_payouts.length === 0 ? (
                    <p className="px-5 py-8 text-center text-xs text-slate-500">
                      No payouts generated in this window.
                    </p>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-5 py-2.5 font-bold">Operator</th>
                          <th className="px-3 py-2.5 font-bold">Campaign</th>
                          <th className="px-3 py-2.5 font-bold">Pieces</th>
                          <th className="px-3 py-2.5 font-bold">Status</th>
                          <th className="px-5 py-2.5 text-right font-bold">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {data.operator_payouts.slice(0, 12).map((p) => (
                          <tr key={p.id}>
                            <td className="px-5 py-2.5 font-bold">{p.operator_name ?? 'unassigned'}</td>
                            <td className="px-3 py-2.5 text-slate-600">{p.campaign_title}</td>
                            <td className="px-3 py-2.5 tabular-nums text-slate-600">{num(p.pieces)}</td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  p.status === 'paid'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="px-5 py-2.5 text-right font-bold tabular-nums">
                              {eur(p.amount_eur)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
              </div>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white self-start">
                <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
                  <Activity className="h-4 w-4 text-slate-400" />
                  <h2 className="text-sm font-bold">Recent activity</h2>
                </div>
                {data.activity.length === 0 ? (
                  <p className="px-5 py-8 text-center text-xs text-slate-500">Nothing yet.</p>
                ) : (
                  <ul className="divide-y divide-slate-50">
                    {data.activity.slice(0, 20).map((a) => (
                      <li key={a.id} className="px-5 py-2.5">
                        <p className="text-[11px] text-slate-700">
                          <span className="font-bold">{a.action.replace(/[._]/g, ' ')}</span>
                          {a.subject ? ` · ${a.subject}` : ''}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {when(a.created_at)}
                          {a.new_status ? ` · ${a.new_status}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="flex items-start gap-1.5 border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">
                  <MapPin className="mt-px h-3 w-3 shrink-0" />
                  Open a campaign to see its areas, coverage and the route its operator actually walked.
                </p>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ClientDashboardPage;
