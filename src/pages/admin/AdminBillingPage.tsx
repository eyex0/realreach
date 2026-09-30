import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, AlertCircle, Receipt, Wallet, CheckCircle2, Printer } from 'lucide-react';
import { useAdmin } from '../../components/admin/AdminShell';
import {
  listAdminInvoices, payInvoice, listAdminPayouts, approvePayoutsBatch,
  type AdminInvoice, type AdminPayout,
} from '../../lib/adminApi';

/**
 * Billing.
 *
 * Two ledgers, kept apart on purpose: invoices are what a client owes us,
 * payouts are what we owe field operators. Merging them into one "money" table
 * is how a business ends up unable to tell which is which.
 *
 * The batch approval is deliberately conservative: only `pending` rows are sent,
 * the server ignores anything already approved, and the response reports what
 * it skipped, so a double click cannot pay anyone twice.
 */

const INVOICE_STATUS: Record<string, { labelKey: string; cls: string }> = {
  draft: { labelKey: 'invoices.draft', cls: 'bg-slate-100 text-slate-600' },
  sent: { labelKey: 'invoices.sent', cls: 'bg-blue-50 text-blue-700' },
  paid: { labelKey: 'invoices.paid', cls: 'bg-emerald-50 text-emerald-700' },
  overdue: { labelKey: 'invoices.overdue', cls: 'bg-red-50 text-red-700' },
  cancelled: { labelKey: 'invoices.cancelled', cls: 'bg-slate-100 text-slate-500' },
};

const PAYOUT_STATUS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-blue-50 text-blue-700',
  paid: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-500',
};

function StatusPill({ label, cls }: { label: string; cls: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${cls}`}>{label}</span>;
}

export function AdminBillingPage() {
  const { t, eur, date, dateTime, num } = useAdmin();
  const [invoices, setInvoices] = useState<AdminInvoice[] | null>(null);
  const [payouts, setPayouts] = useState<AdminPayout[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [inv, pay] = await Promise.all([listAdminInvoices(), listAdminPayouts()]);
      setInvoices(inv);
      setPayouts(pay);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to load billing');
      setInvoices([]);
      setPayouts([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const pay = async (id: string) => {
    setBusy(true);
    setError('');
    try {
      await payInvoice(id);
      setFlash('Fattura segnata come pagata');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to mark the invoice paid');
    } finally {
      setBusy(false);
    }
  };

  const approve = async () => {
    if (selected.size === 0) return;
    setBusy(true);
    setError('');
    try {
      const res = await approvePayoutsBatch([...selected]);
      setFlash(
        res.skipped > 0
          ? `Approvati ${res.approved.length}, ignorati ${res.skipped} (gia approvati)`
          : `Approvati ${res.approved.length} mandati per ${eur(res.amount)}`
      );
      setSelected(new Set());
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to approve');
    } finally {
      setBusy(false);
    }
  };

  const pendingPayouts = (payouts ?? []).filter((p) => p.status === 'pending');
  const pendingTotal = pendingPayouts.reduce((s, p) => s + Number(p.amount_eur ?? 0), 0);
  const overdueTotal = (invoices ?? [])
    .filter((i) => i.overdue)
    .reduce((s, i) => s + Number(i.total_eur ?? i.amount ?? 0), 0);

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--rr-brand)]">
          {t('nav.billing')}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Fatture ai clienti e mandati ai distributori. Due registri separati di proposito.
        </p>
      </header>

      {error && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
      {flash && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4" /> {flash}
        </p>
      )}

      {/* Invoices */}
      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Receipt className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-bold text-strong">Fatture clienti</h2>
          {overdueTotal > 0 && (
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700">
              {eur(overdueTotal)} scadute
            </span>
          )}
        </div>

        {invoices === null ? (
          <p className="px-5 py-10 text-center text-xs text-slate-400">
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          </p>
        ) : invoices.length === 0 ? (
          <p className="px-5 py-10 text-center text-xs text-slate-400">{t('invoices.none')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-2.5 font-bold">Numero</th>
                  <th className="px-3 py-2.5 font-bold">{t('invoices.client')}</th>
                  <th className="px-3 py-2.5 font-bold">{t('invoices.campaign')}</th>
                  <th className="px-3 py-2.5 font-bold">{t('invoices.issued')}</th>
                  <th className="px-3 py-2.5 font-bold">{t('invoices.due')}</th>
                  <th className="px-3 py-2.5 text-right font-bold">Imponibile</th>
                  <th className="px-3 py-2.5 text-right font-bold">{t('invoices.vat')}</th>
                  <th className="px-3 py-2.5 text-right font-bold">{t('invoices.amount')}</th>
                  <th className="px-3 py-2.5 font-bold">{t('invoices.status')}</th>
                  <th className="px-5 py-2.5 text-right font-bold">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map((inv) => {
                  const meta = INVOICE_STATUS[inv.overdue ? 'overdue' : inv.status] ?? INVOICE_STATUS.draft;
                  return (
                    <tr key={inv.id} className={inv.overdue ? 'bg-red-50/40' : ''}>
                      <td className="px-5 py-2.5 font-mono text-[11px] text-slate-600">
                        {inv.number}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700">{inv.client_name ?? '—'}</td>
                      <td className="px-3 py-2.5 text-slate-600">{inv.campaign_title ?? '—'}</td>
                      <td className="px-3 py-2.5 tabular-nums text-slate-500">
                        {date(inv.issued_at)}
                      </td>
                      <td
                        className={`px-3 py-2.5 tabular-nums ${
                          inv.overdue ? 'font-bold text-red-600' : 'text-slate-500'
                        }`}
                      >
                        {date(inv.due_date)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                        {eur(inv.subtotal_eur)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-500">
                        {eur(inv.vat_eur)}
                        <span className="ml-1 text-[9px] text-slate-400">
                          {num(Number(inv.vat_rate) * 100, 0)}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold tabular-nums">
                        {eur(inv.total_eur ?? inv.amount)}
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusPill label={t(meta.labelKey)} cls={meta.cls} />
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => window.print()}
                          title="PDF"
                          className="mr-1.5 inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
                        >
                          <Printer className="h-3 w-3" />
                        </button>
                        {inv.status !== 'paid' && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void pay(inv.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                          >
                            {t('invoices.markPaid')}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Payouts */}
      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Wallet className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-bold">Mandati ai distributori</h2>
          <span className="text-[10px] text-slate-400">per area completata</span>
          {pendingPayouts.length > 0 && (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
              {num(pendingPayouts.length)} da approvare · {eur(pendingTotal)}
            </span>
          )}
          {selected.size > 0 && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void approve()}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--rr-brand)] px-4 py-2 text-[11px] font-bold text-white disabled:opacity-40 cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approva selezionati ({selected.size})
            </button>
          )}
        </div>

        {payouts === null ? (
          <p className="px-5 py-10 text-center text-xs text-slate-400">
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          </p>
        ) : payouts.length === 0 ? (
          <p className="px-5 py-10 text-center text-xs text-slate-400">
            Nessun mandato generato. Genera dal report di una campagna con lavoro approvato.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="w-8 px-3 py-2.5" />
                  <th className="px-3 py-2.5 font-bold">Distributore</th>
                  <th className="px-3 py-2.5 font-bold">{t('invoices.campaign')}</th>
                  <th className="px-3 py-2.5 font-bold">Aree</th>
                  <th className="px-3 py-2.5 font-bold">Volantini</th>
                  <th className="px-3 py-2.5 font-bold">Tariffa</th>
                  <th className="px-3 py-2.5 text-right font-bold">Importo</th>
                  <th className="px-3 py-2.5 font-bold">{t('invoices.status')}</th>
                  <th className="px-5 py-2.5 font-bold">Generato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-3 py-2.5">
                      {p.status === 'pending' && (
                        <input
                          type="checkbox"
                          checked={selected.has(p.id)}
                          onChange={() =>
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (next.has(p.id)) next.delete(p.id);
                              else next.add(p.id);
                              return next;
                            })
                          }
                          aria-label={`Select payout ${p.id}`}
                        />
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-[var(--rr-brand)]">
                      {p.operator_name ?? '—'}
                      <span className="block text-[10px] font-normal text-slate-400">
                        {p.operator_email}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{p.campaign_title}</td>
                    <td className="px-3 py-2.5">
                      <span className="flex flex-wrap gap-1">
                        {(p.areas ?? []).map((a, i) => (
                          <span
                            key={`${p.id}-${i}`}
                            title={a.cap ? `CAP ${a.cap}` : undefined}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600"
                          >
                            {a.area ?? `#${a.seq}`}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-600">{num(p.pieces)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-500">
                      {eur(p.rate_eur)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold tabular-nums">
                      {eur(p.amount_eur)}
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusPill
                        label={p.status}
                        cls={PAYOUT_STATUS[p.status] ?? 'bg-slate-100 text-slate-600'}
                      />
                    </td>
                    <td className="px-5 py-2.5 text-[10px] text-slate-400">
                      {p.approved_at ? `Appr. ${dateTime(p.approved_at)}` : date(p.generated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">
          Un mandato per operatore e campagna, non per area. Le aree elencate mostrano come e
          quando è stato creato. L'approvazione ignora i mandati gia approvati.
        </p>
      </section>
    </main>
  );
}

export default AdminBillingPage;
