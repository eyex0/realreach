import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw, Loader2, Send, CheckCircle2, Map, MapPin, Plus, AlertCircle,
} from 'lucide-react';
import { listCampaigns, changeCampaignStatus, CampaignSummary } from '../../lib/api';

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700',
  submitted: 'bg-amber-100 text-amber-800',
  approved: 'bg-indigo-100 text-indigo-800',
  planned: 'bg-blue-100 text-blue-800',
  assigned: 'bg-cyan-100 text-cyan-800',
  in_progress: 'bg-emerald-100 text-emerald-800',
  under_review: 'bg-amber-100 text-amber-800',
  completed: 'bg-sky-100 text-sky-800',
  reported: 'bg-slate-200 text-slate-700',
  closed: 'bg-slate-200 text-slate-700',
  paused: 'bg-orange-100 text-orange-800',
  blocked: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Awaiting approval',
  approved: 'Approved',
  planned: 'Planned',
  assigned: 'Assigned',
  in_progress: 'In flight',
  under_review: 'Under review',
  completed: 'Completed',
  reported: 'Reported',
  closed: 'Closed',
  paused: 'Paused',
  blocked: 'Blocked',
  cancelled: 'Cancelled',
};

interface Action {
  to: string;
  label: string;
  icon: React.ReactNode;
  variant: 'primary' | 'secondary';
}

/** Next allowed action for the current status (client-side convenience;
 *  the API + DB enforce the real state machine). */
function nextAction(status: string): Action | null {
  switch (status) {
    case 'draft':
      return { to: 'submitted', label: 'Submit for approval', icon: <Send className="h-3.5 w-3.5" />, variant: 'primary' };
    case 'submitted':
      return { to: 'approved', label: 'Approve plan', icon: <CheckCircle2 className="h-3.5 w-3.5" />, variant: 'primary' };
    case 'approved':
      return { to: 'planned', label: 'Mark ready for tasks', icon: <Map className="h-3.5 w-3.5" />, variant: 'secondary' };
    default:
      return null;
  }
}

export const LiveCampaigns: React.FC<{ onChanged?: () => void }> = () => {
  const [items, setItems] = useState<CampaignSummary[] | null>(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      setItems(await listCampaigns());
    } catch (e) {
      setItems([]);
      setError(e instanceof Error ? e.message : 'Could not reach the API on :4000');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const transition = async (c: CampaignSummary, to: string) => {
    setBusyId(c.id);
    setError('');
    try {
      await changeCampaignStatus(c.id, to, {});
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Transition failed');
    } finally {
      setBusyId(null);
    }
  };

  if (items === null) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-500 text-sm">
        <Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-400" />
        <p className="mt-2">Loading campaigns…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center">
        <MapPin className="h-8 w-8 mx-auto text-slate-300" />
        <h3 className="mt-3 text-sm font-bold text-slate-900">No campaigns yet</h3>
        <p className="mt-1 text-xs text-slate-500">
          Draw your target area and save a draft — you can submit it for approval from here.
        </p>
        <Link
          to="/campaigns/new"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0a0a0b] text-white px-4 py-2.5 text-xs font-bold hover:bg-neutral-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> Create campaign
        </Link>
        {error && (
          <p className="mt-3 text-xs text-red-600 inline-flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          {items.length} campaign{items.length === 1 ? '' : 's'} · live from the API
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-black cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-600 inline-flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-50 overflow-hidden">
        {items.map((c) => {
          const action = nextAction(c.status);
          const busy = busyId === c.id;
          return (
            <div key={c.id} className="p-4 sm:p-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <MapPin className="h-4.5 w-4.5 text-slate-500" />
              </span>
              <div className="flex-1 min-w-[180px]">
                <p className="text-sm font-bold text-slate-900">{c.title}</p>
                <p className="text-[11px] text-slate-500">
                  {(c.activity_type ?? 'flyer_distribution').replace('_', ' ')}
                  {c.objective ? ` · ${c.objective}` : ''}
                  {c.area_m2 ? ` · ${Math.round(c.area_m2).toLocaleString()} m²` : ''}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_STYLES[c.status] ?? 'bg-slate-100 text-slate-700'}`}>
                {STATUS_LABELS[c.status] ?? c.status}
              </span>
              <div className="flex items-center gap-2">
                {action && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void transition(c, action.to)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold transition-colors disabled:opacity-50 cursor-pointer ${
                      action.variant === 'primary'
                        ? 'bg-[#0a0a0b] text-white hover:bg-neutral-800'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : action.icon}
                    {action.label}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveCampaigns;
