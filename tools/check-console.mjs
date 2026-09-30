#!/usr/bin/env node
/**
 * Console hygiene check.
 *
 * Three rules, each of which was actually violated at some point in this
 * codebase, which is the only reason they are here:
 *
 *  1. No default Tailwind palette classes in the admin console. The console
 *     uses tokens; `text-slate-500` silently opts out of that and drags in a
 *     second palette. 245 of them existed before this was enforced.
 *
 *  2. No raw hex in a component. `tools/check-tokens.mjs` proves the two token
 *     lists agree; this proves the lists are what the UI actually uses.
 *
 *  3. No text below 10px. 10px is already the floor for uppercase meta and
 *     status pills in a dense console - real body text starts at 12px - and 9px
 *     existed because nobody had a number in front of them.
 *
 * Fails the build. Exits 0 and says nothing when the directory is absent, so a
 * consumer of the web package is not broken by it.
 *
 * Run: node tools/check-console.mjs
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCAN = ['src/pages/admin', 'src/components/admin'];

if (!SCAN.every((d) => existsSync(join(root, d)))) {
  console.log('console: no admin console in this project, nothing to check');
  process.exit(0);
}

function files(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...files(p));
    else if (/\.tsx?$/.test(entry)) out.push(p);
  }
  return out;
}

const PALETTE =
  /(?:hover:|focus:|group-hover:)?(?:text|bg|border|ring|divide|placeholder|from|to|fill|stroke)-(?:slate|gray|zinc|neutral|stone|emerald|blue|red|amber|green|violet|indigo|sky|rose|fuchsia|cyan|teal|lime|orange|pink|purple|yellow)-[0-9]{2,3}\b/;
const HEX = /#[0-9a-fA-F]{3,8}\b/;
const TINY = /text-\[(\d+)px\]/g;

const problems = [];

for (const file of SCAN.flatMap(files)) {
  const rel = relative(root, file);
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    // The token file is the one place a hex is allowed.
    if (rel.includes('tokens.css')) return;

    const palette = line.match(PALETTE);
    if (palette) {
      problems.push([rel, i + 1, `default palette: ${palette[0]}`]);
    }

    const hex = line.match(HEX);
    if (hex) {
      problems.push([rel, i + 1, `raw hex: ${hex[0]}`]);
    }

    for (const m of line.matchAll(TINY)) {
      if (Number(m[1]) < 10) {
        problems.push([rel, i + 1, `text ${m[1]}px is below the 10px floor`]);
      }
    }
  });
}

if (problems.length === 0) {
  console.log(`console: clean across ${SCAN.length} directories (no palette, no hex, no sub-10px text)`);
  process.exit(0);
}

const byFile = new Map();
for (const [file, line, msg] of problems) {
  if (!byFile.has(file)) byFile.set(file, []);
  byFile.get(file).push(`  ${file}:${line}  ${msg}`);
}
for (const [file, lines] of byFile) {
  console.error(file);
  for (const l of lines.slice(0, 6)) console.error(l);
  if (lines.length > 6) console.error(`  ... and ${lines.length - 6} more`);
}
console.error(`\nconsole: ${problems.length} problem(s)`);
console.error('Use the token utilities (text-strong, text-body, bg-surface, text-warning,');
console.error('ring-[var(--rr-border)]) rather than palette or hex values.');
process.exit(1);
