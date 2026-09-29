import React, { useCallback, useEffect, useState } from 'react';
import { Bell, Check, Loader2, RefreshCw, Radio } from 'lucide-react';
import {
  listNotifications, markNotificationRead, runMonitoringNow,
  type AppNotification, type MonitoringResult,
} from '../lib/platformApi';

const KIND_STYLE: Record<string, string> = {
  signal: 'bg-blue-50 text-blue-700',
  score_change: 'bg-amber-50 text-amber-700',
  contact_change: 'bg-violet-50 text-violet-700',
  task_due: 'bg-red-50 text-red-700',
  digest: 'bg-slate-100 text-slate-700',
};

/**
 * Notification centre (Platform Priority 5).
 *
 * The reason a user comes back: something they care about moved. Alerts are
 * watermarked server-side, so pressing "Check now" twice never produces two
 * copies of the same news — which is the whole contract of this panel.
 */
export const NotificationCenter: React.FC<{ onChanged?: () => void }> = ({ onChanged }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [lastRun, setLastRun] = useState<MonitoringResult | null>(null);

  const load = useCallback(async () => {
    try {
      setItems(await listNotifications());
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const unread = (items ?? []).filter((n) => !n.read_at).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          void load();
        }}
        className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-[340px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold">Alerts</p>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const r = await runMonitoringNow(false);
                  setLastRun(r);
                  await load();
                  onChanged?.();
                } finally {
                  setBusy(false);
                }
              }}
              title="Run a monitoring pass now. In production a scheduler calls this daily."
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold disabled:opacity-40 cursor-pointer"
            >
              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              Check now
            </button>
          </div>

          {lastRun && (
            <p className="mt-1.5 rounded-lg bg-slate-50 px-2 py-1 text-[10px] text-slate-500">
              Watched {lastRun.watched} · {lastRun.signals} new signal(s) · {lastRun.score_changes} score change(s) ·{' '}
              {lastRun.notified} notification(s)
            </p>
          )}

          {items === null ? (
            <p className="py-4 text-center text-[11px] text-slate-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="py-4 text-center text-[11px] text-slate-500">
              Nothing yet. Watch a company and alerts arrive here when something changes.
            </p>
          ) : (
            <ul className="mt-2 max-h-[320px] space-y-1.5 overflow-y-auto">
              {items.map((n) => (
                <li
                  key={n.id}
                  className={`rounded-xl border p-2 ${n.read_at ? 'border-slate-100' : 'border-slate-200 bg-white'}`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold ${KIND_STYLE[n.kind] ?? 'bg-slate-100 text-slate-600'}`}>
                      {n.kind.replace('_', ' ')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold">{n.title}</p>
                      {n.body && <p className="text-[10px] text-slate-500">{n.body}</p>}
                      <p className="text-[9px] text-slate-400">{n.created_at.slice(0, 16).replace('T', ' ')}</p>
                    </div>
                    {!n.read_at && (
                      <button
                        type="button"
                        onClick={async () => {
                          await markNotificationRead(n.id);
                          await load();
                        }}
                        title="Mark read"
                        className="text-slate-400 hover:text-emerald-600 cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-2 flex items-start gap-1 border-t border-slate-100 pt-2 text-[9px] text-slate-400">
            <Radio className="mt-px h-3 w-3 shrink-0" />
            Alerts are watermarked: running the check twice never sends the same news twice.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
