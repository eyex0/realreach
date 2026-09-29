import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RealReachLogo } from '../components/RealReachLogo';
import { ArrowLeft, RefreshCw, Play, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { listTasks, updateTask, submitProof, syncBackendUser, TaskItem } from '../lib/api';

const STATUS_LABEL: Record<TaskItem['status'], string> = {
  available: 'Available',
  assigned: 'Assigned to you',
  accepted: 'Accepted',
  in_progress: 'In progress',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Needs rework',
};

const STATUS_CLS: Record<TaskItem['status'], string> = {
  available: 'bg-blue-100 text-blue-800',
  assigned: 'bg-cyan-100 text-cyan-800',
  accepted: 'bg-violet-100 text-violet-800',
  in_progress: 'bg-amber-100 text-amber-800',
  submitted: 'bg-slate-200 text-slate-700',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-700',
};

export const MissionsPage: React.FC = () => {
  const { user: clerkUser } = useUser();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [coverage, setCoverage] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [myId, setMyId] = useState<string | null>(null);

  const walkerId = async (): Promise<string> => {
    if (!clerkUser) throw new Error('Signed out. Please sign in again.');
    return syncBackendUser({
      clerkId: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? `${clerkUser.id}@realreach.it`,
      name: clerkUser.fullName ?? undefined,
      role: 'walker',
    });
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (clerkUser) {
        try {
          setMyId(await walkerId());
        } catch {
          /* sync failure falls back to showing only unclaimed tasks */
        }
      }
      setTasks(await listTasks());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load missions. Is the API running on :4000?');
    } finally {
      setLoading(false);
    }
  }, [clerkUser]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const act = async (id: string, fn: () => Promise<unknown>) => {
    setActing(id);
    setError('');
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setActing(null);
    }
  };

  const nextAction = (t: TaskItem) => {
    if (t.status === 'available' || t.status === 'assigned')
      return { label: 'Accept mission', icon: <CheckCircle2 className="h-4 w-4" />, run: async () => updateTask(t.id, 'accepted', await walkerId()) };
    if (t.status === 'accepted')
      return { label: 'Start mission', icon: <Play className="h-4 w-4" />, run: async () => updateTask(t.id, 'in_progress', await walkerId()) };
    if (t.status === 'in_progress')
      return {
        label: 'Submit proof',
        icon: <Send className="h-4 w-4" />,
        run: () => submitProof(t.id, coverage[t.id] ? Number(coverage[t.id]) : undefined),
      };
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-[#0a0a0b] font-sans">
      <div className="mx-auto max-w-4xl px-5 sm:px-6 py-10">
        <Link to="/for-distributors" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-black">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to distributors</span>
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <RealReachLogo size={34} color="#0a0a0b" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Today&apos;s missions</h1>
              <p className="text-sm text-[#4b5563]">
                Open board · Milano · live from the Realreach API{clerkUser?.fullName ? ` · ${clerkUser.fullName}` : ''}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold hover:border-black transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <p className="mt-4 text-xs font-medium text-red-600 rounded-xl bg-red-50 border border-red-200 p-3">{error}</p>
        )}

        {loading && tasks.length === 0 ? (
          <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading missions…</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white border border-slate-200 p-8 text-center">
            <p className="font-bold">No missions right now</p>
            <p className="mt-1 text-sm text-slate-500">New tasks appear here as soon as campaigns are split. Check back soon.</p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {tasks
              .filter((t) => t.status === 'available' || !t.walker_id || t.walker_id === myId)
              .map((t) => {
              const action = nextAction(t);
              return (
                <li key={t.id} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {t.campaign_title ?? 'Campaign'} · {t.id.slice(0, 8)}
                      </p>
                      <p className="mt-0.5 text-base font-bold">
                        Distribution run
                        {t.started_at && (
                          <span className="ml-2 text-[11px] font-semibold text-slate-400">
                            started {new Date(t.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_CLS[t.status]}`}>
                      {STATUS_LABEL[t.status]}
                    </span>
                  </div>

                  {(t.status === 'available' || t.status === 'assigned' || t.status === 'accepted' || t.status === 'in_progress') && action && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                      {t.status === 'in_progress' && (
                        <input
                          value={coverage[t.id] ?? ''}
                          onChange={(e) => setCoverage({ ...coverage, [t.id]: e.target.value })}
                          placeholder="Coverage % (optional)"
                          inputMode="decimal"
                          className="sm:w-44 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-black"
                        />
                      )}
                      <button
                        type="button"
                        disabled={acting === t.id}
                        onClick={() => act(t.id, action.run)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a0a0b] text-white px-5 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {acting === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : action.icon}
                        <span>{acting === t.id ? 'Working…' : action.label}</span>
                      </button>
                    </div>
                  )}

                  {(t.status === 'submitted' || t.status === 'approved' || t.status === 'rejected') && (
                    <p className="mt-3 text-xs text-slate-500">
                      {t.status === 'approved' && 'Proof approved — payout queued.'}
                      {t.status === 'submitted' && 'Proof submitted — awaiting review.'}
                      {t.status === 'rejected' && 'Proof needs rework — the task stays yours, no penalty.'}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-6 text-[11px] text-slate-400">
          Actions run as your signed-in account against the live API. No reassignment, no penalties —
          tasks only move forward.
        </p>
      </div>
    </div>
  );
};

export default MissionsPage;
