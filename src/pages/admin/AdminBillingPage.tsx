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
  draft: { labelKey: 'invoices.draft', cls: 'bg-muted text-body' },
  sent: { labelKey: 'invoices.sent', cls: 'bg-info-bg text-info' },
  paid: { labelKey: 'invoices.paid', cls: 'bg-success-bg text-success' },
  overdue: { labelKey: 'invoices.overdue', cls: 'bg-danger-bg text-danger' },
  cancelled: { labelKey: 'invoices.cancelled', cls: 'bg-muted text-body' },
};

const PAYOUT_STATUS: Record<string, string> = {
  pending: 'bg-warning-bg text-warning',
  approved: 'bg-info-bg text-info',
  paid: 'bg-success-bg text-success',
  cancelled: 'bg-muted text-body',
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
        <p className="mt-1 text-xs text-body">
          Fatture ai clienti e mandati ai distributori. Due registri separati di proposito.
        </p>
      </header>

      {error && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-danger-bg px-3 py-2 text-xs text-danger">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
      {flash && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-success-bg px-3 py-2 text-xs text-success">
          <CheckCircle2 className="h-4 w-4" /> {flash}
        </p>
      )}

      {/* Invoices */}
      <section className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-[var(--rr-border)]/70">
        <div className="flex flex-wrap items-center gap-3 border-b border-hairline px-5 py-4">
          <Receipt className="h-4 w-4 text-muted" />
          <h2 className="text-sm font-bold text-strong">Fatture clienti</h2>
          {overdueTotal > 0 && (
            <span className="rounded-full bg-danger-bg px-2.5 py-1 text-[10px] font-bold text-danger">
              {eur(overdueTotal)} scadute
            </span>
          )}
        </div>

        {invoices === null ? (
          <p className="px-5 py-10 text-center text-xs text-muted">
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          </p>
        ) : invoices.length === 0 ? (
          <p className="px-5 py-10 text-center text-xs text-muted">{t('invoices.none')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-left text-xs">
              <thead className="bg-subtle text-[10px] uppercase tracking-wider text-muted">
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
              <tbody className="divide-y divide-hairline">
                {invoices.map((inv) => {
                  const meta = INVOICE_STATUS[inv.overdue ? 'overdue' : inv.status] ?? INVOICE_STATUS.draft;
                  return (
                    <tr key={inv.id} className={inv.overdue ? 'bg-danger-bg/40' : ''}>
                      <td className="px-5 py-2.5 font-mono text-[11px] text-body">
                        {inv.number}
                      </td>
                      <td className="px-3 py-2.5 text-strong">{inv.client_name ?? '—'}</td>
                      <td className="px-3 py-2.5 text-body">{inv.campaign_title ?? '—'}</td>
                      <td className="px-3 py-2.5 tabular-nums text-body">
                        {date(inv.issued_at)}
                      </td>
                      <td
                        className={`px-3 py-2.5 tabular-nums ${
                          inv.overdue ? 'font-bold text-danger' : 'text-body'
                        }`}
                      >
                        {date(inv.due_date)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-body">
                        {eur(inv.subtotal_eur)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-body">
                        {eur(inv.vat_eur)}
                        <span className="ml-1 text-[10px] text-muted">
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
                          className="mr-1.5 inline-flex items-center gap-1 rounded-full border border-hairline px-2.5 py-1 text-[10px] font-bold hover:bg-subtle cursor-pointer"
                        >
                          <Printer className="h-3 w-3" />
                        </button>
                        {inv.status !== 'paid' && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void pay(inv.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-hairline px-2.5 py-1 text-[10px] font-bold hover:bg-subtle disabled:opacity-40 cursor-pointer"
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
      <section className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-[var(--rr-border)]/70">
        <div className="flex flex-wrap items-center gap-3 border-b border-hairline px-5 py-4">
          <Wallet className="h-4 w-4 text-muted" />
          <h2 className="text-sm font-bold">Mandati ai distributori</h2>
          <span className="text-[10px] text-muted">per area completata</span>
          {pendingPayouts.length > 0 && (
            <span className="rounded-full bg-warning-bg px-2.5 py-1 text-[10px] font-bold text-warning">
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
          <p className="px-5 py-10 text-center text-xs text-muted">
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          </p>
        ) : payouts.length === 0 ? (
          <p className="px-5 py-10 text-center text-xs text-muted">
            Nessun mandato generato. Genera dal report di una campagna con lavoro approvato.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="bg-subtle text-[10px] uppercase tracking-wider text-muted">
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
              <tbody className="divide-y divide-hairline">
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
                      <span className="block text-[10px] font-normal text-muted">
                        {p.operator_email}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-body">{p.campaign_title}</td>
                    <td className="px-3 py-2.5">
                      <span className="flex flex-wrap gap-1">
                        {(p.areas ?? []).map((a, i) => (
                          <span
                            key={`${p.id}-${i}`}
                            title={a.cap ? `CAP ${a.cap}` : undefined}
                            className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-body"
                          >
                            {a.area ?? `#${a.seq}`}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-body">{num(p.pieces)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-body">
                      {eur(p.rate_eur)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold tabular-nums">
                      {eur(p.amount_eur)}
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusPill
                        label={p.status}
                        cls={PAYOUT_STATUS[p.status] ?? 'bg-muted text-body'}
                      />
                    </td>
                    <td className="px-5 py-2.5 text-[10px] text-muted">
                      {p.approved_at ? `Appr. ${dateTime(p.approved_at)}` : date(p.generated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="border-t border-hairline px-5 py-3 text-[10px] text-muted">
          Un mandato per operatore e campagna, non per area. Le aree elencate mostrano come e
          quando è stato creato. L'approvazione ignora i mandati gia approvati.
        </p>
      </section>
    </main>
  );
}

export default AdminBillingPage;
