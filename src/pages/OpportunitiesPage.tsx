import React, { useCallback, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import {
  Loader2, AlertCircle, Target, Bookmark, BookmarkCheck, X, ChevronRight,
  Sparkles, Flag, RefreshCw, CheckCircle2,
} from 'lucide-react';
import { syncBackendUser } from '../lib/api';
import {
  listTemplates, listIcps, createIcp, runDiscovery, getFeed, getOpportunity,
  markOpportunity, addOpportunityNote, getActivation, setPlatformUser,
  type FeedItem, type IcpTemplate, type OpportunityDetail, type Activation,
} from '../lib/platformApi';

const PRIORITY_STYLE: Record<string, string> = {
  CRITICAL: 'bg-red-50 text-red-700 border-red-200',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
  MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
  LOW: 'bg-slate-50 text-slate-600 border-slate-200',
};

function ScoreDial({ score }: { score: number }) {
  const tone = score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-slate-500';
  return (
    <div className="flex flex-col items-center justify-center w-16 shrink-0">
      <span className={`text-2xl font-black leading-none ${tone}`}>{score}</span>
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">score</span>
    </div>
  );
}

function Breakdown({ components }: { components: FeedItem['score_breakdown'] }) {
  if (!Array.isArray(components) || components.length === 0) return null;
  return (
    <ul className="mt-2 space-y-1">
      {components.map((c) => (
        <li key={c.key} className="text-[11px] text-slate-500">
          <span className="font-bold text-slate-700">{c.label}</span>{' '}
          <span className="font-mono">{c.points.toFixed(1)}</span>
          <span className="text-slate-400"> / {Math.round(c.weight * 100)}</span>
          <span className="block text-slate-400">{c.detail}</span>
        </li>
      ))}
    </ul>
  );
}

function OpportunityCard({ item, onOpen, onSave, onIgnore, busy }: {
  item: FeedItem;
  onOpen: () => void;
  onSave: () => void;
  onIgnore: () => void;
  busy: boolean;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-300 transition-colors">
      <div className="flex items-start gap-4">
        <ScoreDial score={item.score} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-sm truncate">{item.canonical_name}</h3>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${PRIORITY_STYLE[item.priority]}`}>
              {item.priority}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {[item.industry, item.city ?? item.country, item.employee_count ? `${item.employee_count} employees` : null]
              .filter(Boolean)
              .join(' · ')}
          </p>

          {item.signal_title && (
            <p className="mt-2 text-xs text-slate-700">
              <span className="font-bold">Why it matters:</span>{' '}
              {item.signal_title}
              {item.signal_url && (
                <a href={item.signal_url} target="_blank" rel="noreferrer" className="ml-1 text-blue-600 underline">
                  source
                </a>
              )}
            </p>
          )}
          {item.recommended_role && (
            <p className="text-xs text-slate-700 mt-1">
              <span className="font-bold">Recommended contact:</span> {item.recommended_role}
            </p>
          )}
          <p className="text-xs text-slate-900 font-semibold mt-1.5 flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5" />
            Next action: {item.next_action}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onSave}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0a0a0b] text-white px-3 py-1.5 text-[11px] font-bold hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
        >
          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bookmark className="h-3 w-3" />}
          Save
        </button>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[11px] font-bold hover:bg-slate-50 cursor-pointer"
        >
          <Sparkles className="h-3 w-3" />
          Research
        </button>
        <button
          type="button"
          onClick={onIgnore}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
        >
          <X className="h-3 w-3" />
          Not relevant
        </button>
        <span className="ml-auto text-[10px] text-slate-400">
          {item.icp_name} · via {item.source_provider}
        </span>
      </div>
    </article>
  );
}

function DetailPanel({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const [detail, setDetail] = useState<OpportunityDetail | null>(null);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setDetail(await getOpportunity(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to load');
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" /> {error}
      </div>
    );
  }
  if (!detail) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">Loading…</div>;
  }

  const o = detail.opportunity;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">{o.canonical_name}</h3>
          <p className="text-[11px] text-slate-500">
            {o.domain} · {o.industry} · {o.employee_count ?? '?'} employees
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Source: {o.source_provider}
            {o.source_license ? ` (${o.source_license})` : ''} · refreshed{' '}
            {o.last_refreshed_at.slice(0, 10)}
          </p>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Why it scores {o.score}</p>
        <p className="text-xs text-slate-700 mt-1">{o.rationale}</p>
        <Breakdown components={o.score_breakdown} />
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Signals &amp; evidence</p>
        {detail.signals.length === 0 ? (
          <p className="text-xs text-slate-400 mt-1">No signals recorded.</p>
        ) : (
          <ul className="mt-1 space-y-1.5">
            {detail.signals.map((s) => (
              <li key={s.id} className="text-xs border-l-2 border-slate-200 pl-2">
                <span className="font-bold">{s.type.replace('_', ' ')}</span> · {s.title}
                <span className="block text-[10px] text-slate-400">
                  {s.source_provider} · confidence {Number(s.confidence).toFixed(2)} ·{' '}
                  {s.detected_at.slice(0, 10)}
                  {s.source_url && (
                    <a href={s.source_url} target="_blank" rel="noreferrer" className="ml-1 text-blue-600 underline">
                      source
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recommended contacts</p>
        {detail.contacts.length === 0 ? (
          <p className="text-xs text-slate-400 mt-1">No contact on record yet.</p>
        ) : (
          <ul className="mt-1 space-y-1.5">
            {detail.contacts.map((c) => (
              <li key={c.id} className="text-xs flex flex-wrap items-center gap-2">
                <span className="font-bold">{c.full_name}</span>
                <span className="text-slate-500">{c.title ?? 'role unknown'}</span>
                <span className="text-[10px] text-slate-400">
                  {c.source_type.replace('_', ' ')} · {c.lawful_basis.replace('_', ' ')} · conf{' '}
                  {Number(c.confidence).toFixed(2)} · {c.verification_status}
                </span>
                {c.suppressed && (
                  <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-bold">suppressed</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Activity</p>
        <ul className="mt-1 space-y-1">
          {detail.activity.map((a) => (
            <li key={a.id} className="text-[11px] text-slate-600">
              <span className="font-bold">{a.kind}</span>
              {a.body ? ` — ${a.body}` : ''}
              <span className="text-slate-400"> · {a.created_at.slice(0, 16).replace('T', ' ')}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note…"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-slate-400"
        />
        <button
          type="button"
          disabled={!note.trim() || busy}
          onClick={async () => {
            setBusy(true);
            try {
              await addOpportunityNote(o.id, note.trim());
              setNote('');
              await load();
              onChanged();
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-xl bg-slate-900 text-white px-3 py-1.5 text-[11px] font-bold disabled:opacity-40 cursor-pointer"
        >
          Add note
        </button>
      </div>
    </div>
  );
}

export const OpportunitiesPage: React.FC = () => {
  const { user } = useUser();
  const [view, setView] = useState<'feed' | 'saved'>('feed');
  const [items, setItems] = useState<FeedItem[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activation, setActivation] = useState<Activation | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      setError('');
      setItems(await getFeed(view));
      setActivation(await getActivation().catch(() => null));
    } catch (e) {
      setItems([]);
      setError(e instanceof Error ? e.message : 'Failed to load the feed');
    }
  }, [view]);

  useEffect(() => {
    let active = true;
    void (async () => {
      if (!user?.id || !user.primaryEmailAddress?.emailAddress) return;
      const backendId = await syncBackendUser({
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        name: user.fullName ?? undefined,
        role: 'client',
      }).catch(() => null);
      if (!active || !backendId) return;
      setPlatformUser(backendId);
      await refresh();
    })();
    return () => {
      active = false;
      setPlatformUser(null);
    };
  }, [user, refresh]);

  const act = async (id: string, action: 'save' | 'ignore' | 'unsave') => {
    setBusyId(id);
    try {
      await markOpportunity(id, action);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'action failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Opportunity feed</p>
          <h1 className="text-3xl font-black tracking-tight mt-1">What to act on now</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Ranked by a deterministic score you can inspect. Every claim links to the signal and source behind it.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView('feed')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
              view === 'feed' ? 'bg-[#0a0a0b] text-white' : 'border border-slate-200 text-slate-600'
            }`}
          >
            Feed
          </button>
          <button
            type="button"
            onClick={() => setView('saved')}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
              view === 'saved' ? 'bg-[#0a0a0b] text-white' : 'border border-slate-200 text-slate-600'
            }`}
          >
            <BookmarkCheck className="h-3.5 w-3.5" /> Saved
          </button>
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded-xl border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 cursor-pointer"
            aria-label="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {activation && !activation.activated && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-slate-500" />
            <p className="text-xs font-bold">Get to your first win</p>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {activation.steps.map((s) => (
              <div key={s.key} className="rounded-xl border border-slate-100 p-3">
                <p className="text-[11px] text-slate-500">{s.label}</p>
                <p className="text-sm font-black mt-0.5">
                  {Math.min(s.current, s.target)} / {s.target}
                </p>
                <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.done ? 'bg-emerald-500' : 'bg-slate-400'}`}
                    style={{ width: `${Math.min(100, (s.current / s.target) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activation?.activated && (
        <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> Workspace activated — keep the feed moving.
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          {items === null ? (
            <p className="text-sm text-slate-500">Loading your feed…</p>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-sm font-bold">Nothing here yet</p>
              <p className="text-xs text-slate-500 mt-1">
                {view === 'feed'
                  ? 'Run your first discovery to see companies matching your ICP.'
                  : 'Save an opportunity and it will appear here.'}
              </p>
              <Link
                to="/start"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0a0a0b] text-white px-4 py-2 text-xs font-bold"
              >
                Start first run
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <OpportunityCard
                key={item.id}
                item={item}
                busy={busyId === item.id}
                onOpen={() => setOpenId(item.id)}
                onSave={() => void act(item.id, item.saved ? 'unsave' : 'save')}
                onIgnore={() => void act(item.id, 'ignore')}
              />
            ))
          )}
        </div>

        <div className="lg:sticky lg:top-6 self-start">
          {openId ? (
            <DetailPanel id={openId} onClose={() => setOpenId(null)} onChanged={() => void refresh()} />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">How scoring works</p>
              <p className="text-xs text-slate-600 mt-2">
                The score is a deterministic, versioned sum of five components — ICP fit, signal strength, buying
                window, contactability and data freshness. No model invents it, and every component is shown with its
                own evidence.
              </p>
              <p className="text-[10px] text-slate-400 mt-3 flex items-start gap-1.5">
                <Flag className="mt-px h-3 w-3 shrink-0" />
                Saving or dismissing an opportunity is the signal that teaches scoring over time.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default OpportunitiesPage;
