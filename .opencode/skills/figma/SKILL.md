---
name: figma
description: Use when working with Figma design files or syncing design tokens - pulling Figma variables and colour styles via the REST API, comparing them against src/styles/tokens.css, exporting icons or assets, or setting up the Figma API. Triggers on "figma", "design tokens", "tokens.css", "figma variable", "design system sync", "export icon".
---

# Figma

Figma is a GUI tool. This skill covers the only part an agent can actually
touch: the **REST API**, which reads a file's variables, styles and assets.

There is also a Figma **Dev Mode MCP server**, which is better when it is
available - it reads live layer structure rather than a snapshot. It requires a
**paid plan** and the desktop app running, so it is not a default. Check for it
before assuming the REST API is the only option, but do not tell the user it is
installed without confirming.

## Setup

Personal access token: Figma > Settings > Account > Personal access tokens.
Read-only scopes are enough. The free plan supports the REST API.

```bash
export FIGMA_TOKEN=figd_xxx
export FIGMA_FILE_KEY=abc123   # the key in figma.com/design/<KEY>/<slug>
```

**Never commit either value.** If a token appears in a file, treat it as
compromised: revoke it in Figma and create a new one. It is a bearer credential
with access to every file that account can read.

## Token sync

The project's design tokens live in `src/styles/tokens.css` (source of truth)
and `src/lib/tokens.ts` (mirror for Leaflet, canvas and print, which CSS cannot
reach).

```bash
node .opencode/skills/figma/scripts/figma-tokens.mjs            # report drift
node .opencode/skills/figma/scripts/figma-tokens.mjs --block    # paste-ready :root
node .opencode/skills/figma/scripts/figma-tokens.mjs --json     # raw variables
```

Exit codes: `0` in sync, `1` drift, `2` bad input. **No token at all exits 0 and
says nothing was checked** - read the message, do not treat it as a pass.

### What the script will not do

It never writes `tokens.css`. That is deliberate: a half-saved Figma edit must
not be able to rewrite a colour that dozens of call sites depend on, and the
merge is a decision a human should make. Print the report, then edit by hand.

It compares colour **sets**, not names, so renaming a variable in Figma is not
reported as drift. That is on purpose - a rename is not a change of design.

Figma `FILL` styles cannot be resolved to a value from the file response: a
style's paints live on the node, not in the style map. The script reports them
as unresolved rather than guessing a hex from the name. Guessing `#0a0a0b` from
`brand/ink` is how a token system starts lying to itself. For real values,
either use variables, or read the paints from a specific node.

## The trap in this codebase

Leaflet takes colours as **SVG `stroke` attributes**. A `var(--rr-x)` string is
valid in a stylesheet and meaningless in an attribute - map routes render
unstyled and invisible, while typecheck, build and E2E all pass.

- Styled markup (legend swatches, backgrounds) -> CSS variables, or the
  `@utility` shorthands in `tokens.css` (`text-strong`, `bg-surface`).
- Leaflet paths, canvas, print/PDF attributes -> `tokens` from `src/lib/tokens.ts`.

After any token change run both:

```bash
npm run tokens   # css/ts drift
npm run verify   # typecheck + tokens + build
```

## Assets

Icons and images: `GET /v1/images/:file_key?ids=<node_ids>&format=svg|png`, which
returns time-limited URLs - download immediately, they expire in ~30 days.
Prefer SVG for UI icons. In this project icons come from `lucide-react`; pulling
icons out of Figma is usually a sign the design has drifted from the code.

## Honest limits

- Figma is a source of *truth for designers*, not automatically for the code.
  A token in Figma that no component uses is documentation, not design.
- A colour in the Figma file is not a validated colour. Nothing here checks
  contrast ratios; if accessibility matters, check them separately.
- Esri World Imagery, used by the admin map, is fine for development and needs a
  commercial licence before launch. Unrelated to Figma, but the same category of
  thing: a real dependency with a real licence attached.
