import React, { useCallback, useEffect, useState } from 'react';
import { KeyRound, Loader2, Check, Copy, XCircle, Ban, Plus } from 'lucide-react';

const API_BASE = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL ?? 'http://127.0.0.1:4000';

interface PairingCode {
  id: string;
  code: string;
  email: string | null;
  role: string;
  note: string | null;
  expires_at: string;
  used_at: string | null;
  used_device: string | null;
  used_by_email: string | null;
  revoked_at: string | null;
  created_at: string;
  state: 'live' | 'used' | 'expired' | 'revoked';
}

const STATE_STYLE: Record<PairingCode['state'], string> = {
  live: 'bg-emerald-100 text-emerald-800',
  used: 'bg-slate-100 text-slate-600',
  expired: 'bg-amber-100 text-amber-800',
  revoked: 'bg-red-100 text-red-700',
};

async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  // Clerk token, when the console is signed in.
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const clerk = (window as unknown as { __clerkToken?: string }).__clerkToken;
  if (clerk) headers.Authorization = `Bearer ${clerk}`;
  return fetch(`${API_BASE}${path}`, { ...init, headers: { ...headers, ...(init?.headers ?? {}) } });
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `${res.status}`;
    try {
      detail = (await res.json()).error ?? detail;
    } catch {
      /* non-JSON */
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

/**
 * Operator access codes.
 *
 * The operator app signs in with one of these, so a stranger who types an email
 * address no longer becomes a walker. Codes are single-use, expiring and
 * revocable, and a live code is shown here until it is spent.
 */
export const PairingPanel: React.FC = () => {
  const [codes, setCodes] = useState<PairingCode[] | null>(null);
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [fresh, setFresh] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setCodes(await handle<PairingCode[]>(await authFetch('/auth/pair/codes')));
    } catch (e) {
      setCodes([]);
      setError(e instanceof Error ? e.message : 'could not load codes');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const issue = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await handle<{ codes: string[] }>(
        await authFetch('/auth/pair/codes', {
          method: 'POST',
          body: JSON.stringify({ email: email.trim() || undefined, note: note.trim() || undefined, count: 1 }),
        })
      );
      setFresh(res.codes);
      setEmail('');
      setNote('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'could not issue a code');
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (id: string) => {
    setBusy(true);
    try {
      await handle(await authFetch(`/auth/pair/codes/${id}`, { method: 'DELETE' }));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'could not revoke');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-bold">Operator access codes</h3>
        <span className="text-[11px] text-slate-500">single use · expires · revocable</span>
      </div>

      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex flex-wrap gap-2">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Bind to email (optional)"
            className="flex-1 min-w-[200px] rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-slate-400"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note, e.g. who it is for"
            className="flex-1 min-w-[180px] rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-slate-400"
          />
          <button
            type="button"
            onClick={() => void issue()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0a0a0b] text-white px-4 py-2 text-xs font-bold disabled:opacity-40 cursor-pointer"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Issue code
          </button>
        </div>

        {fresh.length > 0 && (
          <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
            <p className="text-[11px] font-bold text-emerald-800">Send this to the operator</p>
            <div className="mt-1 flex items-center gap-2">
              <code className="text-lg font-black tracking-[0.3em] text-emerald-900">{fresh[0]}</code>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard?.writeText(fresh[0]);
                  setCopied(fresh[0]);
                  setTimeout(() => setCopied(null), 1500);
                }}
                className="text-emerald-700 cursor-pointer"
                title="Copy"
              >
                {copied === fresh[0] ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-emerald-700 mt-1">It works once and then stops working.</p>
          </div>
        )}

        {error && <p className="mt-2 text-[11px] text-red-700">{error}</p>}
      </div>

      {codes === null ? (
        <p className="p-6 text-center text-xs text-slate-500">Loading…</p>
      ) : codes.length === 0 ? (
        <p className="p-6 text-center text-xs text-slate-500">No codes issued yet.</p>
      ) : (
        <ul className="divide-y divide-slate-50">
          {codes.map((c) => (
            <li key={c.id} className="px-5 py-3 flex flex-wrap items-center gap-3 text-xs">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 tracking-widest">
                {c.code}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATE_STYLE[c.state]}`}>{c.state}</span>
              <div className="flex-1 min-w-[180px]">
                <p className="font-bold">{c.email ?? 'any operator'}</p>
                <p className="text-[11px] text-slate-500">
                  {c.note ? `${c.note} · ` : ''}
                  {c.state === 'used'
                    ? `paired ${c.used_at?.slice(0, 10)}${c.used_device ? ` on ${c.used_device}` : ''}`
                    : `expires ${c.expires_at.slice(0, 16).replace('T', ' ')}`}
                </p>
              </div>
              {c.state === 'live' && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void revoke(c.id)}
                  className="inline-flex items-center gap-1 rounded-xl border border-red-200 text-red-600 px-2.5 py-1.5 text-[11px] font-bold hover:bg-red-50 disabled:opacity-40 cursor-pointer"
                >
                  <Ban className="h-3 w-3" />
                  Revoke
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="px-5 py-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-start gap-1.5">
        <XCircle className="mt-px h-3 w-3 shrink-0" />
        Codes never contain 0, O, 1, I or L, so one read aloud over a phone cannot be mistyped.
      </p>
    </section>
  );
};

export default PairingPanel;
