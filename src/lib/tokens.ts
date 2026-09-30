/**
 * TypeScript mirror of `styles/tokens.css`.
 *
 * CSS custom properties are the source of truth for anything that styles
 * markup. This file exists for the places CSS cannot reach: Leaflet path
 * colours, canvas, and the print/PDF layer, where a value has to be a real
 * string in a real attribute.
 *
 * The duplication is deliberate and the risk is real, so it is checked rather
 * than trusted: `tools/check-tokens.mjs` diffs every value here against
 * tokens.css and fails the build on a drift. Two lists that silently disagree
 * are worse than one duplicated line.
 *
 * If you change a colour, change it in tokens.css first, then mirror it here.
 */

export const tokens = {
  brand: {
    base: '#0a0a0b',
    hover: '#1a1a1d',
    emphasis: '#0c2016',
  },
  accent: {
    base: '#006de4',
    strong: '#0060ca',
  },
  surface: {
    base: '#ffffff',
    subtle: '#fafafa',
    muted: '#f1f5f9',
    sunken: '#eef1f4',
    inverse: '#0a0a0b',
    inverseCard: '#1a1a1d',
  },
  text: {
    strong: '#0a0a0b',
    body: '#4b5563',
    muted: '#94a3b8',
    inverse: '#f9fafb',
    inverseMuted: '#64748b',
  },
  border: {
    base: '#e5e7eb',
    subtle: '#f3f4f6',
    strong: '#d1d5db',
  },
  status: {
    success: '#10b981',
    successDeep: '#059669',
    successBg: '#ecfdf5',
    successText: '#047857',
    warning: '#f59e0b',
    warningBg: '#fffbeb',
    warningText: '#b45309',
    danger: '#ef4444',
    dangerBg: '#fef2f2',
    dangerText: '#b91c1c',
    info: '#006de4',
    infoBg: '#eff6ff',
    infoText: '#1d4ed8',
    neutralBg: '#f1f5f9',
    neutralText: '#475569',
  },
  highlight: '#fbbf24',

  /** Route speed bands, matching the legend and the verification report. */
  speed: {
    low: '#10b981',
    mid: '#f59e0b',
    high: '#ef4444',
  },
} as const;

export type StatusToken = keyof typeof tokens.status;

/**
 * Pick a status colour by name.
 *
 * Throws on an unknown name rather than returning a default. A typo in a status
 * name should be loud at the point of the call, because the failure mode is a
 * green dot on a failed task and nobody notices until a client does.
 */
export function statusColor(name: StatusToken): string {
  const value = tokens.status[name];
  if (!value) throw new Error(`unknown status token '${name}'`);
  return value;
}

export default tokens;
