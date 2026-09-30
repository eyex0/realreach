#!/usr/bin/env node
/**
 * Token drift check.
 *
 * tokens.css styles the markup; tokens.ts mirrors the same values for the
 * places CSS cannot reach (Leaflet path colours, canvas, print/PDF attributes).
 * That duplication is a real risk: if someone changes a colour in the CSS and
 * forgets the TS, the map legend stops matching the routes on the map, and that
 * is exactly the kind of quiet, plausible-looking wrongness this project is
 * supposed to avoid.
 *
 * So it is checked, not trusted. Compares the *sets* of colour values on both
 * sides and fails on any difference in either direction. Sets rather than a
 * name-by-name mapping on purpose: it catches a value changed in one place,
 * and it cannot be satisfied by renaming a token on one side only.
 *
 * Run: node tools/check-tokens.mjs
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Every colour literal in a file, lowercased and deduplicated. */
function colorsIn(text) {
  const found = new Set();
  // #rgb, #rrggbb, #rrggbbaa — but not a 3-8 digit run of ordinary prose.
  for (const m of text.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    const v = m[0].toLowerCase();
    if (v.length === 4 || v.length === 7 || v.length === 9) found.add(v);
  }
  return found;
}

const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');
const ts = readFileSync(join(root, 'src/lib/tokens.ts'), 'utf8');

const cssSet = colorsIn(css);
const tsSet = colorsIn(ts);

const onlyCss = [...cssSet].filter((c) => !tsSet.has(c)).sort();
const onlyTs = [...tsSet].filter((c) => !cssSet.has(c)).sort();

if (onlyCss.length === 0 && onlyTs.length === 0) {
  console.log(`tokens: OK (${cssSet.size} colours match in css and ts)`);
  process.exit(0);
}

console.error('tokens: DRIFT between src/styles/tokens.css and src/lib/tokens.ts');
if (onlyCss.length) {
  console.error(`  in css only : ${onlyCss.join(' ')}`);
  console.error('    -> mirror these into tokens.ts');
}
if (onlyTs.length) {
  console.error(`  in ts only  : ${onlyTs.join(' ')}`);
  console.error('    -> these have no token; add them to tokens.css or drop them');
}
process.exit(1);
