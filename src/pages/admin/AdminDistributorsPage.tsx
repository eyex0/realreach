import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, AlertCircle, Star, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAdmin } from '../../components/admin/AdminShell';
import { listAdminDistributors, getAdminDistributor, type AdminDistributor } from '../../lib/adminApi';

/**
 * Distributors.
 *
 * The metrics shown are derived, not stored: completed jobs, average pace and
 * coverage come from the underlying runs, so a profile cannot quietly disagree
 * with the campaign report it came from.
 */

const VERIFICATION: Record<string, { label: string; cls: string }> = {
  verified: { label: 'Verificato', cls: 'bg-success-bg text-success' },
  unverified: { label: 'Da verificare', cls: 'bg-warning-bg text-warning' },
  rejected: { label: 'Respinto', cls: 'bg-danger-bg text-danger' },
};

function Profile({ id }: { id: string }) {
  const { num, eur, date, dateTime } = useAdmin();
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminDistributor>> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const d = await getAdminDistributor(id);
        if (active) setData(d);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'failed to load');
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <p className="flex items-center gap-2 px-5 py-4 text-xs text-danger">
        <AlertCircle className="h-4 w-4" /> {error}
      </p>
    );
  }
  if (!data) {
    return (
      <p className="px-5 py-4 text-xs text-muted">
        <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
        Caricamento…
      </p>
    );
  }

  const p = data.profile;
  const totalPieces = data.payouts.reduce((s, x) => s + Number(x.pieces ?? 0), 0);
  const totalEarned = data.payouts.reduce((s, x) => s + Number(x.amount_eur ?? 0), 0);

  return (
    <div className="space-y-5 px-5 py-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ['Aree completate', num(data.jobs.filter((j) => j.status === 'approved').length)],
          ['Aree in corso', num(data.jobs.filter((j) => j.status === 'in_progress').length)],
          ['Volantini', num(totalPieces)],
          ['Guadagni', eur(totalEarned)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-hairline p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</p>
            <p className="mt-1 text-lg font-extrabold tabular-nums text-[var(--rr-brand)]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Job history */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Storico lavori
          </p>
          {data.jobs.length === 0 ? (
            <p className="mt-2 text-xs text-muted">Nessun lavoro registrato.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {data.jobs.slice(0, 10).map((j) => (
                <li key={j.id} className="flex items-center gap-2 text-[11px]">
                  <span className="font-bold text-strong">
                    {j.quartiere ?? `Area ${j.campaign_seq ?? ''}`}
                  </span>
                  <span className="truncate text-muted">{j.campaign_title}</span>
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      j.status === 'approved'
                        ? 'bg-success-bg text-success'
                        : 'bg-muted text-body'
                    }`}
                  >
                    {j.status.replace('_', ' ')}
                  </span>
                  <span className="w-20 text-right text-[10px] text-muted">
                    {date(j.completed_at ?? j.started_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Payouts */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Mandati</p>
          {data.payouts.length === 0 ? (
            <p className="mt-2 text-xs text-muted">Nessun mandato.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {data.payouts.slice(0, 10).map((x) => (
                <li key={x.id} className="flex items-center gap-2 text-[11px]">
                  <span className="truncate text-body">{x.campaign_title}</span>
                  <span className="ml-auto font-bold tabular-nums text-strong">
                    {eur(x.amount_eur)}
                  </span>
                  <span className="w-16 text-right text-[10px] text-muted">
                    {x.paid_at ? `paid ${date(x.paid_at)}` : x.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[10px] text-muted">
            Documenti: {Array.isArray(p.documents) && p.documents.length > 0 ? p.documents.length : '—'} ·
            onboarding {p.onboarded_at ? date(p.onboarded_at) : '—'}
            {p.phone ? ` · ${p.phone}` : ''}
            {p.created_at ? ` · iscritto ${date(p.created_at)}` : ''}

          </p>
        </div>
      </div>
    </div>
  );
}

export function AdminDistributorsPage() {
  const { num } = useAdmin();
  const [rows, setRows] = useState<AdminDistributor[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setRows(await listAdminDistributors());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to load distributors');
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-end gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--rr-brand)]">
            Distributori
          </h1>
          <p className="mt-1 text-xs text-body">
            {rows === null ? 'Caricamento…' : `${num(rows.length)} distributori`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="ml-auto rounded-full border border-hairline px-4 py-2 text-[11px] font-bold hover:bg-subtle cursor-pointer"
        >
          Aggiorna
        </button>
      </header>

      {error && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-danger-bg px-3 py-2 text-xs text-danger">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <section className="mt-5 overflow-hidden rounded-2xl bg-surface shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-[var(--rr-border)]/70">
        {rows === null ? (
          <p className="px-5 py-12 text-center text-xs text-muted">
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          </p>
        ) : rows.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-bold">Nessun distributore</p>
            <p className="mt-1 text-xs text-body">
              I distributori vengono creati quando un operatore si abbina con un codice.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-hairline">
            {rows.map((d) => {
              const v = VERIFICATION[d.verification_status] ?? VERIFICATION.unverified;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(open === d.id ? null : d.id)}
                    className="flex w-full flex-wrap items-center gap-3 px-5 py-3.5 text-left hover:bg-subtle/60 cursor-pointer"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-body">
                      {(d.display_name ?? d.email).slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-[160px] flex-1">
                      <p className="text-xs font-bold text-[var(--rr-brand)]">
                        {d.display_name ?? d.email}
                      </p>
                      <p className="text-[10px] text-muted">{d.email}</p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${v.cls} inline-flex items-center gap-1`}
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {v.label}
                    </span>

                    <span className="w-24 text-right text-[11px] tabular-nums text-body">
                      {num(d.completed_jobs)} completati
                    </span>
                    <span className="w-20 text-right text-[11px] tabular-nums text-body">
                      {num(d.active_jobs)} attivi
                    </span>
                    <span className="w-20 text-right text-[11px] tabular-nums text-body">
                      {num(d.letterboxes)} volantini
                    </span>
                    <span className="hidden w-32 text-right text-[10px] text-muted md:inline-flex md:items-center md:justify-end md:gap-1">
                      <MapPin className="h-3 w-3" />
                      {(d.service_areas ?? []).join(', ') || '—'}
                    </span>
                    <span className="inline-flex w-16 items-center justify-end gap-1 text-[11px] tabular-nums text-body">
                      {d.rating != null ? (
                        <>
                          <Star className="h-3 w-3 fill-[var(--rr-highlight)] text-warning" />
                          {Number(d.rating).toFixed(1)}
                        </>
                      ) : (
                        '—'
                      )}
                    </span>
                    {d.open_issues > 0 && (
                      <span className="w-16 text-right text-[10px] font-bold text-warning">
                        {d.open_issues} segnalazioni
                      </span>
                    )}
                    <ChevronRight
                      className={`h-4 w-4 text-muted transition-transform ${open === d.id ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {open === d.id && <Profile id={d.id} />}
                </li>
              );
            })}
          </ul>
        )}

        <p className="border-t border-hairline px-5 py-3 text-[10px] text-muted">
          I metrici sono derivati dai corse reali, non memorizzati: un profilo non puo dire una
          cosa diversa dal report della campagna da cui proviene.
        </p>
      </section>
    </main>
  );
}

export default AdminDistributorsPage;
