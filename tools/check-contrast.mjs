#!/usr/bin/env node
/**
 * Contrast audit for the admin console.
 *
 * The UI skill lists "contrast 4.5:1" as a rule, but a rule nobody measures is
 * a rule nobody follows. This computes it, from the actual token values, so the
 * answer is a number rather than an opinion.
 *
 * Reads `src/styles/tokens.css` rather than a hardcoded palette, so it audits
 * what is really rendered. If a token changes, this changes with it - a checker
 * frozen against last quarter's colours is worse than none.
 *
 * Thresholds used, and why:
 *   4.5:1  body text (WCAG 2.1 AA, normal size)
 *   3.0:1  large text >= 18.66px bold or 24px, and UI component boundaries
 *   3.0:1  is also the floor for a *non-text* indicator like a map pin, which
 *          is why "it's just a colour" is not an excuse.
 *
 * The console uses 10-12px labels, which is small text by any reading, so
 * anything that is not unambiguously large is held to 4.5.
 *
 * Run: node tools/check-contrast.mjs
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');

/** --name: #hex  pairs out of the token file. */
const tokens = new Map();
for (const m of css.matchAll(/--rr-([\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
  tokens.set(m[1], m[2].toLowerCase());
}

function rgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3 || h.length === 4) h = [...h.slice(0, 3)].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** Relative luminance, WCAG 2.1. */
function luminance(hex) {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Real pairings from the console, not a cartesian product. Each entry is
 * something that genuinely appears together in a page, which is the only way a
 * contrast report stays short enough to be read.
 */
const PAIRS = [
  ['text-strong on surface', 'text-strong', 'surface', 4.5],
  ['text-body on surface', 'text-body', 'surface', 4.5],
  ['text-muted on surface', 'text-muted', 'surface', 4.5],
  ['text-inverse on brand (top bar)', 'text-inverse', 'brand', 4.5],
  ['text-inverse-muted on brand (top bar)', 'text-inverse-muted', 'brand', 4.5],
  ['success-text on success-bg', 'status-success-text', 'status-success-bg', 4.5],
  ['warning-text on warning-bg', 'status-warning-text', 'status-warning-bg', 4.5],
  ['danger-text on danger-bg', 'status-danger-text', 'status-danger-bg', 4.5],
  ['info-text on info-bg', 'status-info-text', 'status-info-bg', 4.5],
  ['neutral-text on neutral-bg', 'status-neutral-text', 'status-neutral-bg', 4.5],
  // Non-text: a map pin or status dot has to be distinguishable from its
  // background even though nobody reads it as text.
  ['status-success vs surface (indicator)', 'status-success', 'surface', 3.0],
  ['status-warning vs surface (indicator)', 'status-warning', 'surface', 3.0],
  ['status-danger vs surface (indicator)', 'status-danger', 'surface', 3.0],
  ['accent vs surface (indicator)', 'accent', 'surface', 3.0],
  ['highlight vs surface (map pin)', 'highlight', 'surface', 3.0],
  ['border vs surface (card edge)', 'border', 'surface', 1.0],
];

let failed = 0;
const rows = [];

for (const [label, fg, bg, min] of PAIRS) {
  const f = tokens.get(fg);
  const b = tokens.get(bg);
  if (!f || !b) {
    rows.push({ label, value: 'n/a', min, ok: null });
    continue;
  }
  const r = ratio(f, b);
  const ok = r >= min;
  if (!ok) failed += 1;
  rows.push({ label, value: `${r.toFixed(2)}:1`, min, ok });
}

const w = Math.max(...rows.map((r) => r.label.length));
for (const r of rows) {
  const mark = r.ok === null ? '  ?  ' : r.ok ? ' PASS ' : ' FAIL ';
  const val = r.value.padStart(8);
  console.log(`${mark}${r.label.padEnd(w)}  ${val}   (needs ${r.min}:1)`);
}

console.log('');
if (failed === 0) {
  console.log(`contrast: all ${rows.length} pairings pass`);
  process.exit(0);
}
console.log(`contrast: ${failed} of ${rows.length} pairings FAIL`);
console.log('');
console.log('A failing ratio is not automatically a bug: a 10px timestamp label is');
console.log('not body text, and a card border is not text at all. But every failure');
console.log('above is either a real legibility problem or a token that is being used');
console.log('for a job it was not chosen for. Fix the usage, not the number - do not');
console.log('darken a token until the check passes if that makes the whole UI wrong.');
process.exit(1);
