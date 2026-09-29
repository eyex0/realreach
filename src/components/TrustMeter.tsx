import React from 'react';
import { HelpCircle } from 'lucide-react';

export interface TrustComponent {
  key: string;
  label: string;
  weight: number;
  value: number;
  detail: string;
}

function tone(value: number): string {
  if (value >= 0.7) return 'bg-emerald-500';
  if (value >= 0.4) return 'bg-amber-500';
  return 'bg-red-500';
}

function textTone(value: number): string {
  if (value >= 0.7) return 'text-emerald-700';
  if (value >= 0.4) return 'text-amber-700';
  return 'text-red-600';
}

function Bar({ label, value, hint }: { label: string; value: number | null; hint?: string }) {
  return (
    <div className="min-w-[104px] flex-1" title={hint}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span>
        <span className={`text-[11px] font-bold ${value == null ? 'text-slate-400' : textTone(value)}`}>
          {value == null ? 'unknown' : value.toFixed(2)}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${value == null ? 'bg-slate-300' : tone(value)}`}
          style={{ width: `${value == null ? 100 : Math.round(value * 100)}%`, opacity: value == null ? 0.4 : 1 }}
        />
      </div>
    </div>
  );
}

/**
 * Confidence and freshness for one verification row.
 *
 * `null` renders as an explicit "unknown" rather than a zero, because a row
 * scored before trust scoring existed has no honest number to show.
 */
export const TrustMeter: React.FC<{
  confidence: number | null;
  freshness: number | null;
  components?: TrustComponent[] | null;
  version?: string | null;
}> = ({ confidence, freshness, components, version }) => {
  const hasDetail = Array.isArray(components) && components.length > 0;
  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
      <div className="flex items-center gap-4">
        <Bar
          label="Confidence"
          value={confidence}
          hint="How much the recorded evidence supports the claim"
        />
        <Bar
          label="Freshness"
          value={freshness}
          hint="How recent the evidence is; halves every 7 days"
        />
        {version && (
          <span className="self-end pb-0.5 text-[10px] font-mono text-slate-400">{version}</span>
        )}
      </div>
      {hasDetail && (
        <ul className="mt-2 space-y-0.5">
          {components!.map((c) => (
            <li key={c.key} className="flex items-start gap-1.5 text-[10px] text-slate-500">
              <HelpCircle className="mt-px h-3 w-3 shrink-0 text-slate-300" />
              <span>
                <span className="font-bold text-slate-600">{c.label}</span>{' '}
                <span className="font-mono">({Math.round(c.weight * 100)}%)</span> — {c.detail}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrustMeter;
