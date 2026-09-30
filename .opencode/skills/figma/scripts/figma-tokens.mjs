#!/usr/bin/env node
/**
 * Figma -> design token bridge.
 *
 * Pulls the variables and colour styles out of a Figma file and compares them
 * against the project's `src/styles/tokens.css`, so the two cannot drift apart
 * without somebody being told.
 *
 * Why this exists: a design system lives in two places by nature - in Figma,
 * where designers work, and in the code, where it actually has to exist. The
 * failure mode is not that they differ, it is that they differ *silently*: the
 * mock says #0a0a0b, the code says #111111, and nobody finds out until a
 * client does.
 *
 * Deliberately does NOT write tokens.css. It prints a report and a ready block.
 * Automatically overwriting a design system from a remote file means a
 * half-saved Figma edit can rewrite a colour 34 call sites depend on, and the
 * merge is exactly the decision a human should be making.
 *
 * Usage:
 *   FIGMA_TOKEN=figd_xxx FIGMA_FILE_KEY=abc123 node .opencode/skills/figma/scripts/figma-tokens.mjs
 *   ... --json        raw variables as JSON
 *   ... --block       print a paste-ready :root block
 *   ... --file-key=<key>  override the env var
 *
 * Exit codes: 0 in sync (or no token supplied), 1 drift, 2 bad input.
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const API = 'https://api.figma.com/v1';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];

const token = process.env.FIGMA_TOKEN || opt('token');
const fileKey = process.env.FIGMA_FILE_KEY || opt('file-key');
const tokensCss = join(root, 'src', 'styles', 'tokens.css');

if (!token) {
  console.error(
    'figma-tokens: no token.\n' +
      '  Set FIGMA_TOKEN (Figma > Settings > Account > Personal access tokens).\n' +
      '  Nothing was checked; this is not a pass.'
  );
  process.exit(0);
}
if (!fileKey) {
  console.error('figma-tokens: no file key. Set FIGMA_FILE_KEY (the key in figma.com/design/<KEY>/...).');
  process.exit(2);
}

const headers = { 'X-Figma-Token': token };

/** Figma colour {r,g,b,a} in 0..1 -> #rrggbb, dropping alpha when opaque. */
function toHex({ r, g, b, a = 1 }) {
  const h = (n) => Math.round(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, '0');
  const base = `#${h(r)}${h(g)}${h(b)}`;
  if (a >= 1) return base;
  return `${base}${h(a)}`;
}

/** Figma paints are {type:'SOLID'|'GRADIENT'|...}; only solid can be a token. */
function paintToHex(paint) {
  if (!paint || paint.type !== 'SOLID' || !paint.color) return null;
  return toHex({ ...paint.color, a: paint.opacity ?? 1 });
}

async function get(path) {
  const res = await fetch(`${API}${path}`, { headers });
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`Figma ${res.status}: ${text.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

let variables = [];
let styles = {};

try {
  // Variables first: this is where a real design system puts its tokens.
  // Style fills are the older, pre-variables equivalent, and plenty of files
  // still use only those.
  try {
    const v = await get(`/files/${fileKey}/variables/local`);
    variables = Object.values(v.meta?.variables ?? {});
  } catch (e) {
    // Only a 404 justifies a fallback: the file exists but has no variables, or
    // the endpoint is unavailable. A 403 means the token is bad, and retrying
    // with a second endpoint would just print a second confusing error.
    if (e.status === 404) {
      console.error('figma-tokens: no variables in this file. Reading colour styles instead.');
    } else throw e;
  }

  const file = await get(`/files/${fileKey}?depth=1`);
  styles = file.styles ?? {};
} catch (e) {
  console.error(`figma-tokens: ${e.message}`);
  console.error('  Check FIGMA_TOKEN has access to this file, and FIGMA_FILE_KEY is the right key.');
  process.exit(2);
}

// ---------------------------------------------------------------- collect
/** Figma colour values, keyed by a readable name. */
const figma = new Map();

for (const v of variables) {
  if (v.resolvedType !== 'COLOR') continue;
  const modeId = v.valuesByMode ? Object.keys(v.valuesByMode)[0] : null;
  if (!modeId) continue;
  const raw = v.valuesByMode[modeId];
  // An alias points at another variable; resolve it by name when we can.
  const value = raw && raw.type === 'VARIABLE_ALIAS' ? null : raw;
  if (!value) continue;
  const hex = toHex(value);
  figma.set(v.name, hex);
}

for (const [id, meta] of Object.entries(styles)) {
  if (meta.style_type !== 'FILL' && meta.style_type !== 'STROKE') continue;
  if (figma.has(meta.name)) continue;
  // A style's paints live on the node, not in the file's style map, so the
  // name is recorded with no value rather than a wrong one guessed from a
  // name. Guessing "#0a0a0b" from "brand/ink" is how a token system starts
  // lying to itself.
  figma.set(meta.name, null);
}

const figmaColours = new Map(
  [...figma].filter(([, hex]) => hex).map(([name, hex]) => [name, hex])
);

// ------------------------------------------------------------------ report
if (flag('json')) {
  console.log(JSON.stringify(Object.fromEntries(figma), null, 2));
  process.exit(0);
}

if (flag('block')) {
  console.log('/* Generated from Figma. Review before pasting - names are Figma-side. */');
  console.log(':root {');
  for (const [name, hex] of figmaColours) {
    const slug = name
      .replace(/[^\w]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
    console.log(`  --rr-${slug}: ${hex}; /* ${name} */`);
  }
  console.log('}');
  process.exit(0);
}

const unresolved = [...figma].filter(([, hex]) => !hex).map(([name]) => name);

console.log(`figma-tokens: ${figmaColours.size} colour variables found in ${fileKey}`);
if (unresolved.length) {
  console.log(`  ${unresolved.length} fill styles could not be resolved to a value (${unresolved.slice(0, 3).join(', ')}${unresolved.length > 3 ? ', ...' : ''})`);
  console.log('  Style paints live on the node, not in the style map. Read them from a node, or rename them as variables.');
}

if (!existsSync(tokensCss)) {
  console.error(`figma-tokens: ${tokensCss} not found. Nothing to compare against.`);
  process.exit(2);
}

const css = readFileSync(tokensCss, 'utf8');
const cssColours = new Set();
for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
  const v = m[0].toLowerCase();
  if (v.length === 4 || v.length === 7 || v.length === 9) cssColours.add(v);
}

const inFigmaOnly = [...figmaColours.values()].filter((c) => !cssColours.has(c));
const inCssOnly = [...cssColours].filter((c) => !figmaColours.has(c));

if (inFigmaOnly.length === 0 && inCssOnly.length === 0) {
  console.log('  in sync: every Figma colour exists in tokens.css and vice versa');
  process.exit(0);
}

console.log('  DRIFT');
if (inFigmaOnly.length) console.log(`    in Figma only (${inFigmaOnly.length}): ${inFigmaOnly.join(' ')}`);
if (inCssOnly.length) console.log(`    in css only     (${inCssOnly.length}): ${inCssOnly.join(' ')}`);
console.log('  This compares colour *sets*, not names, so a rename is not drift.');
process.exit(1);
