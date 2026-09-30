import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, AlertCircle, Inbox, MailWarning, ChevronDown } from 'lucide-react';
import { useAdmin } from '../../components/admin/AdminShell';
import { listAdminWishlist, setAdminWishlistStatus, type AdminWishlistSignup } from '../../lib/adminApi';

/**
 * Wishlist queue.
 *
 * This is a pipeline, not a counter. The point of collecting signups is finding
 * people worth a phone call, so each row carries the business context that
 * decides priority — volume above all, because a 40,000-a-month distributor and
 * a 200-a-month one are not the same conversation.
 *
 * The banner is not decoration. Nobody on this list has confirmed yet, so
 * **nobody here may be emailed**. EU marketing law requires a confirmed opt-in
 * and we have no mail provider to send one with. The number is shown so the
 * constraint stays visible instead of being rediscovered the hard way.
 */

const STATUSES = ['new', 'contacted', 'converted', 'closed'] as const;

const STATUS_STYLE: Record<string, string> = {
  new: 'bg-warning-bg text-warning',
  contacted: 'bg-info-bg text-info',
  converted: 'bg-success-bg text-success',
  closed: 'bg-muted text-body',
};

const VOLUME_LABEL: Record<string, string> = {
  under_500: '< 500',
  '500_2000': '500 – 2k',
  '2000_10000': '2k – 10k',
  '10000_50000': '10k – 50k',
  over_50000: '> 50k',
  unsure: 'non so',
  other: '—',
};

const FILTERS: { key: string | null; label: string }[] = [
  { key: null, label: 'Tutti' },
  { key: 'new', label: 'Da contattare' },
  { key: 'contacted', label: 'Contattati' },
  { key: 'converted', label: 'Convertiti' },
  { key: 'closed', label: 'Chiusi' },
];

function Row({ s, onChanged }: { s: AdminWishlistSignup; onChanged: () => void }) {
  const { date } = useAdmin();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(s.notes ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const move = async (status: string) => {
    setBusy(true);
    setError('');
    try {
      await setAdminWishlistStatus(s.id, status, notes);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to update');
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="px-5 py-3.5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex min-w-[200px] flex-1 flex-col text-left cursor-pointer"
        >
          <span className="text-xs font-bold text-[var(--rr-brand)]">
            {s.full_name ?? s.email}
            {s.company ? <span className="font-normal text-body"> · {s.company}</span> : null}
          </span>
          <span className="text-[10px] text-muted">{s.email}</span>
        </button>

        <span className="rounded bg-muted px-2 py-1 text-[10px] font-bold text-body">
          {VOLUME_LABEL[s.monthly_volume ?? ''] ?? '—'}
        </span>
        <span className="w-20 text-right text-[10px] text-muted">
          {s.source ? s.source.slice(0, 18) : '—'}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            STATUS_STYLE[s.status] ?? 'bg-muted text-body'
          }`}
        >
          {s.status}
        </span>
        <span className="w-20 text-right text-[10px] text-muted">{date(s.created_at)}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {open && (
        <div className="mt-3 space-y-3 rounded-xl border border-hairline bg-subtle/60 p-3">
          {s.problem && (
            <p className="text-[11px] leading-relaxed text-strong">
              <span className="font-bold">In their words: </span>
              {s.problem}
            </p>
          )}
          <p className="text-[10px] text-body">
            {s.role ? `${s.role} · ` : ''}
            {s.referrer ? `da ${s.referrer}` : 'nessun referrer'}
            {s.consent_at ? ` · consenso ${date(s.consent_at)}` : ''}
            {s.confirmed_at ? ' · CONFERMATO' : ' · non confermato'}
          </p>

          {error && (
            <p className="flex items-center gap-1.5 text-[10px] text-danger">
              <AlertCircle className="h-3 w-3" /> {error}
            </p>
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Note: cosa hai detto, cosa manca, prossimo passo"
            className="w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-[11px] outline-none focus:border-strong"
          />

          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((st) => (
              <button
                key={st}
                type="button"
                disabled={busy || st === s.status}
                onClick={() => void move(st)}
                className={`rounded-full px-3 py-1.5 text-[10px] font-bold disabled:opacity-30 cursor-pointer ${
                  st === 'converted'
                    ? 'bg-success text-white'
                    : 'border border-hairline bg-surface hover:bg-subtle'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

export function AdminWishlistPage() {
  const { num } = useAdmin();
  const [rows, setRows] = useState<AdminWishlistSignup[] | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [marketable, setMarketable] = useState(0);
  const [filter, setFilter] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await listAdminWishlist(filter);
      setRows(res.signups);
      setCounts(res.counts);
      setMarketable(res.marketable);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to load wishlist');
      setRows([]);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--rr-brand)]">Wishlist</h1>
        <p className="mt-1 text-xs text-body">
          Chi si e registrato dalla landing. Il punto non e il numero, e chi vale una telefonata.
        </p>
      </header>

      <p className="mt-4 flex items-start gap-2 rounded-xl bg-warning-bg px-4 py-3 text-[11px] leading-relaxed text-warning">
        <MailWarning className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <strong>{num(marketable)}</strong> contatti confermati, quindi{' '}
          <strong>{marketable === 0 ? 'nessuno di questa lista puo essere emailed' : 'solo questi sono emailable'}</strong>.
          Non abbiamo ancora un provider email, quindi non esiste il doppio opt-in che la legge
          richiede: raccogliamo i dati, ma il primo contatto resta una telefonata.
        </span>
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold cursor-pointer ${
              filter === f.key ? 'bg-[var(--rr-brand)] text-white' : 'border border-hairline hover:bg-subtle'
            }`}
          >
            {f.label}
            {f.key && counts[f.key] ? ` (${counts[f.key]})` : ''}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-danger-bg px-3 py-2 text-xs text-danger">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <section className="mt-4 overflow-hidden rounded-2xl bg-surface shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-[var(--rr-border)]/70">
        {rows === null ? (
          <p className="px-5 py-12 text-center text-xs text-muted">
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          </p>
        ) : rows.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Inbox className="mx-auto h-6 w-6 text-muted" />
            <p className="mt-3 text-sm font-bold">Nessuna iscrizione</p>
            <p className="mt-1 text-xs text-body">
              Il modulo e in fondo alla landing. Condividi il link, non il numero.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-hairline">
            {rows.map((s) => (
              <Row key={s.id} s={s} onChanged={() => void load()} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default AdminWishlistPage;
