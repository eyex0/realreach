# REALREACH — Implementation Plan: Remaining Work to Pilot (Stage 10–17)

Stages 2–9 are **complete** (foundation, campaign planning, ops console, operator
app + sync, verification, reports, billing, authz/hardening — all verified, 22/22
tests green). This plan covers everything left between here and a pilot-ready,
deployable platform. We execute stages in order; **each stage commits its work
when its Verify block passes** (approved by user).

## Context

| Repo | Path | Git | Port |
|---|---|---|---|
| Web frontend | `..\realreach---gps-tracked-letterbox-&-flyer-distribution` (this folder) | yes, 61 files uncommitted | 3000 |
| Backend API | `..\realreach-backend\realreach-backend` | **no git yet**, has inert CI | 4000 |
| Operator app (Expo) | `..\realreach-operator` | yes (Expo template) | — |

**Standing rules**
- Constraints: no algorithmic assignment/reassignment/penalties, forward-only task
  states, piece-rate pay, no continuous GPS in v1, every admin action audit-logged,
  human always decides review.
- Verify commands (folder name contains `&` — never rely on npm script PATH;
  always run with explicit `workdir`):
  - Backend: `node node_modules/typescript/bin/tsc --noEmit`,
    `node node_modules/vitest/vitest.mjs run` (expect 22),
    build+restart: `node node_modules/typescript/bin/tsc -p tsconfig.json` then
    kill :4000 PID and start `node dist/index.js`
  - Frontend: `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json`,
    `node node_modules/vite/bin/vite.js build`
  - Operator: `npx tsc --noEmit`, `npx expo export --platform android`
- Ad-hoc SQL: `node tools/sql.mjs "SELECT …"` or `node tools/sql.mjs file.sql`
  (Supabase MCP is down — never wait on it).
- E2E scripts live in backend `tools/*.ps1` — run via
  `powershell -ExecutionPolicy Bypass -File tools\x.ps1`.
- PowerShell gotchas: JSON bodies with coordinate arrays must be raw
  single-quoted strings; multi-line scripts go in `.ps1` files; no non-ASCII in
  `.ps1`; pending-list responses unwrap to a single object (test `.id`, not `.Count`).
- Servers: web `node node_modules/vite/bin/vite.js --port=3000 --host=127.0.0.1`,
  API `node dist/index.js` (default `AUTH_MODE=optional` in dev).

---

## Stage 10 — Git hygiene & CI activation
**Goal:** all three repos committed, secrets provably excluded, CI runnable.

- [x] **Backend**: `.gitignore` created (`node_modules/`, `dist/`, `storage/`,
      `.env`, `*.log`, `!.env.example`); `git init -b main`; 44 files committed
      as `2ee0f7a feat: API Stages 2-9 …` — `git check-ignore` proves
      `.env`/`dist`/`storage`/`node_modules` excluded. **No remote yet.**
- [x] **Frontend**: secret scan clean (only env-var *names* in PLAN.md); `.env`
      ignored; committed `03c00c2 feat: web platform Stages 2-9 …` and **pushed**
      to `origin` (eyex0/realreach).
- [x] **Operator**: secret scan clean; committed `cb36752 feat: operator app …`
      + `ci: typecheck workflow`. **No remote yet.**
- [x] **CI**: three workflows in place (web: lint+build; backend: Postgres
      service + migrations + typecheck + tests; operator: `npm ci` + tsc).
- [x] Check for a remote — frontend pushed to `eyex0/realreach`; backend →
      `eyex0/realreach-backend` (private, `main`), operator →
      `eyex0/realreach-operator` (private, `master`), all pushed ✓
      (note: `gh repo create --push` failed on missing `workflow` scope; plain
      `git push` with stored credentials worked).
- **Verify:** `git status` clean ×3 ✓; backend `git check-ignore .env` ✓;
  workflows valid YAML ✓.
- **Commit:** per repo as above ✓.

## Stage 11 — Production auth cutover
**Goal:** prove the whole API works with `AUTH_MODE=required` (no legacy actor-id
fallback), end to end, with tokens. **[COMPLETE]**

- [x] New `tools/test-e2e-required.ps1`: 49 checks, **ALL PASS** — 401 sweep of
      every protected route family, public-path whitelist, bogus-Bearer 401,
      role gates (walker Clerk + walker device token → 403 on gated actions),
      full web flow (create→planned→split→assign→approve→payout→reports) on
      Clerk tokens, full operator flow (accept→GPS→evidence→proof→earnings) on
      device tokens.
- [x] **Device tokens:** `src/lib/deviceToken.ts` (HMAC `d1.<payload>.<sig>`,
      60-day TTL, secret `DEVICE_TOKEN_SECRET` fallback `CLERK_SECRET_KEY`,
      timing-safe compare); `authenticate()` accepts `d1.` Bearer and
      re-resolves the role from the DB; `/auth/sync` now returns
      `device_token`; Expo app stores it in its session and attaches it on
      every request; walker `PATCH /tasks/:id` prefers the token identity over
      the body claim. +5 unit tests → **27/27**.
- [x] Re-ran existing scripts: `test-authz` ✓, `test-review-integrity` ✓
      (verdict preserved), `test-reports` ✓ — `test-payouts` rewritten to be
      self-contained (old one tripped on an already-paid row; app behavior was
      correct) → generate/approve/pay/409×2/regenerate/summary/audit all ✓.
- [x] Servers restored to dev (optional) mode.
- **Verify:** `E2E-REQUIRED: ALL PASS`, vitest 27/27, all scripts green.
- **Commit:** backend + operator (see Stage 10 message style).

## Stage 12 — Evidence storage on Supabase (decision gate) **[COMPLETE]**
**Goal:** proof photos stored in Supabase Storage instead of local disk.

- [x] Keys supplied by user into backend `.env` (`SUPABASE_URL` +
      `SUPABASE_SERVICE_ROLE_KEY`); `.env.example` refreshed (all current vars).
- [x] Private bucket `evidence` verified: 10 MB limit, mime allowlist
      (jpeg/png/webp/pdf), created 2026-09-29.
- [x] `storage.ts` made env-lazy (call-time reads — no import-order trap).
- [x] E2E `tools/test-supabase-storage.mjs`: upload through `/sync/evidence`
      → `storage_key` in `evidence/…` bucket → download **byte-identical**
      (70/70) → 6 legacy local-disk rows still readable (mixed drivers).
      **ALL PASS**; plus direct bucket probe round-trip MATCH
      (`tools/setup-supabase-storage.mjs`, idempotent).
- **Verify:** `node tools/test-supabase-storage.mjs` → ALL PASS; vitest 27/27.
- **Commit:** `feat: Supabase evidence storage live (Stage 12)…` ✓ pushed.

## Stage 13 — Data hygiene & pilot seed **[COMPLETE]**
**Goal:** replace accumulated test rows with a clean, reproducible dataset.

- [x] Inventory: 12 test campaigns / 8 users / 18 tasks etc. — user chose
      **full purge + seed**.
- [x] `tools/purge-domain.sql`: truncates all domain tables (keeps config
      tables `campaign_transitions`, `spatial_ref_sys`), keeps only the two
      Clerk-linked login users (emails), deletes the rest (audit FK handled).
- [x] `tools/seed.mjs` (idempotent, requires API on :4000): 1 client + 2
      walkers → "Pilot Demo Campaign" → planned → split 2×2 → walker 1 task
      completed (11-min session, 12 GPS pts, photo+120 pcs+note → machine
      **verified**) → human approved → payout **pending €4.80**; walker 2 task
      left `assigned`. Writes ids to `%TEMP%\rr_seed.json`.
- [x] Stale hardcoded uuids purged from all E2E scripts — they now resolve ids
      via `/auth/sync` / `rr_seed.json` (works across any purge+seed cycle).
- [x] Post-seed verified: overview `tasks=4 approved=1 pieces=120 payout=4.8`,
      campaign report route/estimate sane, payout pending, review queue 0,
      second seed run → "already present".
- [x] Full regression re-run after purge: reports ✓, storage ✓ (legacy note:
      local rows intentionally purged), payouts ✓, review-integrity ✓,
      hardening ✓ (413/429; cleanup fixed for audit FK), e2e-required
      **ALL PASS** (49 checks, restores optional mode).
- **Verify:** all of the above green.
- **Commit:** `chore: pilot seed + test data cleanup (Stage 13)`.

## Stage 14 — Configuration & documentation **[COMPLETE]**
**Goal:** a fresh clone can be set up from docs alone.

- [x] `.env.example` refresh both repos: backend already current (Stage 12 —
      PORT/DATABASE_URL/CLERK/AUTH_MODE/FRONTEND_URL/DEVICE_TOKEN_SECRET/
      SUPABASE_*); frontend `.env.example` rewritten (was AI Studio boilerplate:
      `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL`); operator `.env.example`
      added (`EXPO_PUBLIC_API_URL`).
- [x] Operator `src/config.ts` now honors `EXPO_PUBLIC_API_URL` as the initial
      default (in-app setting still wins).
- [x] Frontend README rewritten (was AI Studio boilerplate): stack, setup,
      env table, Windows `&`-in-path workaround for npm scripts, route table,
      auth flow, ops-console overview, cross-links.
- [x] Operator README created: setup, device run (Expo Go), API URL/LAN note,
      email-only sign-in + device tokens (with pilot limitation stated),
      offline outbox behavior, permissions, dev checks, cross-links.
- [x] Backend README updated: Stage range, PORT/DEVICE_TOKEN_SECRET env rows,
      device-token auth section, full test-helper list (incl. purge/seed),
      cross-links to the other two repos.
- **Verify:** frontend `tsc --noEmit` ✓ + `vite build` ✓; operator
  `npx tsc --noEmit` ✓ (documented commands spot-checked).
- **Commit:** `docs: setup + run documentation` (all three repos).

## Stage 16b — Operator dashboard UI (user request) **[COMPLETE]**
**Goal:** operator app UI/UX like the web home page + dashboard.

- [x] Design tokens `src/theme.ts` mirroring web `index.css` (#0a0a0b brand,
      #f7f7f8 canvas, white cards, Poppins, shadows, radius) + `withFont()`
      helper mapping fontWeight → Poppins face for every screen.
- [x] Poppins loaded via `@expo-google-fonts/poppins` + `expo-font`.
- [x] New **Home dashboard** (`HomeScreen.tsx`): greeting + online pill,
      performance stats (pending/paid/approved), active-mission card,
      board counters, offline-queue card with Sync now — web-dashboard layout
      (micro-labels, stat cards, brand hero card).
- [x] Bottom tab navigation (Home / Missions / Sync) via
      `@react-navigation/bottom-tabs`; Task pushed above tabs; Login gate kept.
- [x] Restyled Login/Missions/Task/Sync with the tokens + shared
      `src/status.ts` badge maps.
- [x] Deps added: `expo-font`, `@expo-google-fonts/poppins`,
      `@react-navigation/bottom-tabs`, `@expo/vector-icons`.
- **Verify:** `npx tsc --noEmit` ✓; web bundle compiles (3.7 MB);
  `npx expo export --platform android` ✓.
- **Commit:** `feat: dashboard home screen + full brand restyle` ✓ pushed.

## Stage 15 — Deployment (decision checkpoint ⏸) **[DEFERRED BY USER]**
**Decision (2026-09-29):** **no deploy yet.** Device QA (Stage 16) runs
against the local API over LAN; hosting (PaaS vs VPS) is re-opened later.
Residual checklist kept below for when that happens.

- [ ] Backend: `Dockerfile` (+`PORT` honored — check `index.ts`), migrations run
      on deploy, production env: `AUTH_MODE=required`, `FRONTEND_URL=<web origin>`,
      Clerk **live** keys, `DATABASE_URL`.
- [ ] Frontend: `vite build` with `VITE_API_BASE=<api origin>` → static host,
      CORS origin matches.
- [ ] Operator: point `EXPO_PUBLIC_API_URL` at prod; build via EAS (needs the
      user's Expo account) or run against prod from Expo Go during pilot.
- **Verify:** prod `/health` 200; prod 401-sweep green; web loads against prod
      API; one full API flow (seed → proof → review) against prod.
- **Commit:** `feat: deployment config (Dockerfile, prod env docs)`.

## Stage 16 — Device QA (manual, user-driven + my bugfix loop) **[COMPLETE — verified on a real phone]**

**Real-phone verification (2026-09-29):** the user completed the full
`realreach-operator/DEVICE_QA.md` checklist on a physical phone via Expo Go
against the local API over LAN — sign-in, accept, live GPS session, photo +
quantity evidence, airplane-mode queue and replay, and human approval in the
web console. **Machine verdict `verified` reached on a real walk.** The
`requires_review` outcome seen during browser QA was a browser artefact (no GPS),
not a defect.

Run path for future device sessions: `npm run phone` (LAN) or
`npm run phone:tunnel`; the API URL is baked in from `.env.local`
(`EXPO_PUBLIC_API_URL=http://192.168.30.68:4000`) and can be overridden in-app
on the Sync tab.

**Goal:** the operator app proven on a real device (run on laptop browser via
Expo web — camera/GPS device pass deferred to a phone session).

- [x] Device checklist written: `realreach-operator/DEVICE_QA.md`.
- [x] User ran it (Expo web on `:8081`): sign-in → missions → accept → GPS
      session → evidence → offline queue flush → proof review (human approved)
      → task shows Approved in app → payouts → earnings.
- [x] Bugs found & fixed:
  - CORS: Expo web origin `:8081` blocked ("Failed to fetch") → comma-separated
    CORS allowlist (`829ec20`).
  - Root URL 404 → friendly service-info route (`ac2b740`).
  - Stale task hint ("Tap Start…" while Submitted) → notice tracks transitions
    (`e2c7ed3`).
  - Missing web deps → `react-dom` + `react-native-web` installed.
- [x] Machine verdict on the browser proof = `requires_review` (no GPS in
      browser) — human approval path confirmed working as designed.
- **Verify:** checklist run completed; regression suite re-run in Stage 17.
- **Commit:** `fix: device QA issues` (as found — see hashes above).

## Stage 17 — Final verification & handoff **[COMPLETE]**
**Goal:** one clean sweep and a written handoff.

- [x] Backend: `tsc` clean, **27/27 vitest**, all seven E2E scripts green —
      `test-authz` (no failures), `test-review-integrity` (verdict preserved),
      `test-payouts` (double-approve 409, regenerate skips paid),
      `test-reports` (overview + campaign report + estimate),
      `test-hardening` (1.2 MB accepted, >8 MB → 413, 429 after 21),
      `test-e2e-required` (**49 PASS**, restores optional mode),
      `test-supabase-storage` (byte-identical round trip).
- [x] Frontend: `tsc --noEmit` clean, `vite build` OK.
- [x] Operator: `tsc --noEmit` clean (`expo export --platform android` green in
      Stage 16b on the same code).
- [x] Servers healthy: API :4000, web :3000 (200), Metro :8081 (200).
- [x] Data hygiene: `purge-domain.sql` then `seed.mjs` → exactly one
      `Pilot Demo Campaign` (4 tasks, 1 approved, 120 pieces, €4.80 pending
      payout for walker 1). All E2E campaigns removed.
- [x] git clean ×3, CI green on push.

**Test-tooling bugs found and fixed during the sweep** (`d00b640`):
- `test-reports.ps1` resolved the campaign id with
  `Invoke-RestMethod ... | Where-Object {...}`. In Windows PowerShell 5.1 the
  JSON array is delivered to the pipeline as a *single unenumerated item*, so
  `$_.title -eq '...'` acted as an array filter and always matched — `$cid`
  became four space-joined uuids and the report call failed with
  `invalid input syntax for type uuid`. Fixed by prefetching into a variable
  before filtering.
- All five server-restarting scripts used a fixed `Start-Sleep -Seconds 2`
  after `Start-Process`, which raced Express startup (connection refused).
  Replaced with a `/health` readiness poll (60 × 500 ms).

**CI defects found and fixed during the sweep**
- Frontend CI had been **failing since the Stage 16b commit** and nobody
  noticed: `npm ci` died with ERESOLVE because `package.json` pinned
  `esbuild@^0.25.0` while `vite@8.3.1` requires `^0.27 || ^0.28`. Local builds
  kept passing because the working tree had been installed with legacy peer
  deps. Bumped to `^0.28.0` and regenerated the lockfile (`a3118f4`).
- Operator CI had **never run**: `.github/workflows/ci.yml` triggered on
  `branches: [main]` but the repo's default branch is `master`. Trigger
  changed to `[main, master]` (`6a5cadf`) — first-ever green run.

**Deferred / known limits at handoff**
- **Stage 15 (deployment) still deferred by user** — no hosting target chosen;
  device QA ran against the local API over LAN.
- **No EAS build / store submission** — operator app is web-verified only;
  Android export validates, but no signed APK/IPA.
- **Operator sign-in is email-only** (no OTP, no identity check) — pilot-only.
- **No live tracking in v1**: one session per proof, not continuous GPS.
- **Pricing is an assumption**: flat €0.04/piece, no client billing.
- Browser QA has no GPS, so machine verdicts land on `requires_review`; the
  human approval path is the one exercised there.

---

## Stage 18 — Landing page map + task board **[COMPLETE]**

**Goal:** the hero map on the landing page was rendering a blank/watermarked
basemap, and the 500-item scope had no home in the repo.

- [x] **Root-caused the dead map.** `basemaps.cartocdn.com` now answers every
      keyless tile request with an `API KEY REQUIRED` watermark tile, so the
      hero showed CARTO's placeholder over Milan. The old HTTP check returned
      `200`, so this only showed up in a rendered screenshot.
- [x] Replaced the tile source with a keyless chain: Esri `World_Light_Gray_Base`
      + `World_Light_Gray_Reference` labels, falling back to OpenStreetMap after
      6 tile errors.
- [x] Extracted `src/lib/useLeafletMap.ts` and moved all three maps
      (`RealMilanMap`, `RealPlannerMap`, `RealBuilderMap`) onto it. Fixes the
      three latent faults the raw `L.map()` calls shared: no `invalidateSize()`
      after the animated Hero settled (Leaflet measured a pre-transform
      container and laid out no tiles), scroll-zoom off with no visible control,
      and no tile fallback.
- [x] Map is now framed with `fitBounds` instead of a hardcoded centre, has
      `+`/`−` controls, hover-highlighted zones, and a background colour so it
      never flashes empty.
- [x] **Map now renders real data, not hardcoded rectangles.** New public,
      aggregate-only endpoint `GET /map/live` returns campaign target-area
      geometry, task counts per status, the count of active sessions, and the
      most recent *finished* GPS track with its distance and duration. The hero
      map fetches it (4 s timeout, 60 s poll) and falls back to the static demo
      zones when the API is unreachable, so the public page never breaks.
- [x] **Privacy decision:** the landing page is unauthenticated, so the feed
      returns **no operator names, ids or e-mail addresses, and never the
      position of an in-progress session**. Publishing a live individual's
      location would violate the platform's own GDPR rules
      (`docs/CONTEXT.md` §17). Named/live positions belong behind a
      client/admin token. Asserted by three new checks in
      `tools/test-e2e-required.ps1` (public reachability, no identity leak, no
      live positions).
- [x] Fixed two bugs found by screenshotting the live page: GeoJSON rings are
      `[lon, lat]` while Leaflet wants `[lat, lon]` (the polygon was being drawn
      in Kenya and blew `fitBounds` out to a world view), and the framing locked
      to the wide fallback bounds so live geometry rendered as a speck.
- [x] Verified by headless-Edge screenshot of `http://127.0.0.1:3000/`: real
      Milan basemap, three zone polygons, runner markers, controls, attribution.
- [x] Added `TASKS.md` (500-task board with verified pilot status, known
      limitations, and a definition-of-done workflow) and `docs/CONTEXT.md`
      (the 20-section platform context brief).

---

## Stage 19 — Data trust + bad-data feedback (Platform Priorities 2 & 10) **[COMPLETE]**

**Goal:** the two cheapest high-trust wins, built before any AI feature, because
Priority 1's opportunity feed must not be built on data users are told not to
trust.

- [x] **Deterministic, versioned trust scores** (`src/lib/trust.ts`, `trust_v1`).
      Confidence is a weighted sum of five components — required-check pass
      ratio 50%, GPS density 20%, route match 15%, evidence completeness 10%,
      optional checks 5% — and freshness halves every 7 days. No LLM, no
      randomness: identical inputs always produce identical output, and every
      component returns its own weight and human-readable detail so the UI can
      show the breakdown instead of a bare number. Changing a weight requires a
      new `TRUST_VERSION`.
- [x] **Persisted** on `verification_results` (migration
      `008_trust_and_feedback.sql`) as `confidence`, `freshness`,
      `trust_version`, `trust_components`. Pre-trust rows stay `NULL` and render
      as an explicit **unknown**, never a fabricated 0.
- [x] **Freshness recomputed at read time** so a stored score cannot rot into a
      misleading number; the stored value remains the as-verified snapshot.
- [x] **`tools/backfill-trust.mjs`** scores historical rows (idempotent,
      `--dry-run` supported) rather than leaving them permanently unknown.
- [x] **Bad-data reports** — `POST /data-reports` open to any user *including the
      operator who produced the data*; `GET` queue for ops; `PATCH` resolve /
      dismiss for client+admin. Subjects are existence-checked so the queue
      cannot fill with dead links, and every action is audit-logged.
- [x] **A report never touches a verdict.** Machine verdict, human review
      decision and data complaint remain three independent records.
- [x] **Wire-format fix (real bug):** `pg` returns `numeric` as a string, so the
      API was emitting `"confidence":"0.510"` and the console's `.toFixed()`
      would have thrown. Fixed once at the driver in `src/db.ts` by parsing
      `NUMERIC` and `INT8` to numbers, which also fixes money and area fields
      app-wide.
- [x] **Second real bug caught by the new tests:** an empty check set scored
      0.05 instead of 0, because "no optional checks" defaulted to "all passed".
- [x] **Third real bug caught by review:** report resolution was gated to
      `admin`, but `client` is the ops role in this product — it already reviews
      proofs and approves payouts. Widened to `client, admin`.
- [x] **UI** — `TrustMeter` shows confidence and freshness with the component
      breakdown; each proof shows its bad-data report count, a "Report data"
      action, and the console gained a bad-data queue with resolve/dismiss.
- [x] **Tests** — 13 new unit tests for the scorer (determinism, bounds, decay,
      floor, weight sum, empty-set), and 12 new E2E checks including
      *"filing a report does not change the machine verdict"*.
- **Verify:** 40/40 vitest, 69/69 E2E-REQUIRED, all other E2E scripts clean,
      storage E2E pass, frontend `tsc` + build clean, CI green.

---

## Stage 20 — Platform core: first run + opportunity feed (Priorities 1 & 3) **[COMPLETE]**

**Goal:** the product promise — "every time a user logs in they see a relevant
opportunity, understand why it matters, and know the next action" — needs the
ICP and opportunity models. Built as a vertical slice, deterministic end to end.

- [x] **Migration `009_platform_core.sql`** — 12 org-scoped tables: `icps`,
      `discovery_runs`, `companies`, `company_sources`, `signals`, `people`,
      `opportunities`, `opportunity_notes`, `opportunity_tasks`,
      `opportunity_activity`, `outreach_messages`, `workspace_activation`.
      Two rules are enforced by the schema, not convention: every tenant table
      carries `org_id`, and a company cannot exist without a named source
      (`source_provider` NOT NULL) nor a signal without evidence.
- [x] **Explainable scoring** (`src/lib/opportunityScore.ts`, `score_v1`):
      ICP fit 30%, signal strength 30%, buying window 15%, contactability 15%,
      data freshness 10%. Weights sum to 1 so a score cannot exceed 100. No
      LLM, no randomness; every component returns its weight, value and a
      readable sentence. Signals decay by type (hiring 45-day half-life, funding
      180), and three weak signals deliberately cannot beat one strong fresh one.
- [x] **Suppressed contacts are never recommended**, at any confidence.
- [x] **Missing data is a non-match, never a wildcard** — a company with unknown
      country fails ICP fit rather than passing it.
- [x] **API** — ICP templates, ICP create-from-template, discovery run,
      opportunity feed (feed/saved views), detail with signals, contacts,
      activity, notes, save/ignore, activation meter.
- [x] **Discovery is idempotent** — re-running updates scores in place via
      `ON CONFLICT (org_id, icp_id, company_id)` and never duplicates the feed.
- [x] **A user action outranks a recomputed score** — the upsert preserves
      `saved`/`ignored`.
- [x] **Tenant isolation** — every read filters on the caller's org; a second
      workspace gets 404 on reads and 403 on writes. Asserted by 6 E2E checks.
- [x] **First-run UI** — `/start`: pick one of 6 ICP templates → run discovery →
      review results with scores. **Feed UI** — `/opportunities`: cards with
      score, why-it-matters (linked to the signal), recommended contact, next
      action, and Save / Research / Not relevant; a detail panel with the full
      score breakdown, evidence, contact provenance and the activity trail; and
      a live activation meter (1 discovery, 5 saved, 1 approved outreach).
- [x] **Seed** — `tools/seed-platform.mjs`, idempotent: 6 ICP templates, 10
      companies with sources, 15 signals with evidence, 10 contacts with
      lawful basis and verification status.

**Real bugs found and fixed while building this**
1. `nextActionFor(hasContact, hasSignal)` had its parameters named in the
   opposite order to the call site, so "draft outreach" and "identify a
   decision-maker" came back swapped. Caught by a unit test.
2. **Route shadowing:** `POST /platform/opportunities/:id/notes` was swallowed by
   the earlier `/:action` param route, so notes could never be created. The
   specific route now precedes the param route.
3. **Activation counter never incremented** on first use — the upsert inserted
   the row with the column default (0) instead of the incremented value.
4. `technologies` was read by the scorer but missing from the `companies` table.

**Verify:** 55/55 vitest (15 new scorer tests), **91/91 E2E-REQUIRED** (22 new
platform checks), all other E2E scripts clean, storage pass, frontend `tsc` +
build clean, CI green.

---

## Stage 21 — Evidence-only outreach + human approval (Priority 4, activation step 3) **[COMPLETE]**

**Goal:** complete the activation path (approve one outreach draft) and give
Priority 4 "make AI transparent" a real surface. Nothing is sent by a machine,
and nothing may state a fact the evidence does not carry.

- [x] **Deterministic drafter** (`src/lib/outreachDraft.ts`) — English, Italian
      and German; cites **exactly one** signal (the strongest) and says so; one
      clear ask; body capped at 90 words; the signal title is **quoted verbatim**
      as a citation, so an English signal inside a German draft reads as a
      citation rather than broken grammar (translating it would need a model,
      and a mistranslated claim is worse than an untranslated one).
- [x] **Refuses to draft with no signal to cite** (422) — a message with nothing
      to point at is exactly the spam this product refuses to produce.
- [x] **Unsupported claims are blocked, not warned about** — every draft and
      every human edit is re-validated; invented numbers and names are refused
      with the offending claim named in the response and rendered in the UI.
- [x] **Suppressed contacts are never drafted to**, whatever their confidence.
- [x] **Nothing is queued without a human approver** — enforced by the database
      (`outreach_approved_before_queue`), not only by the API. Verified by
      attempting to queue an unapproved draft directly in SQL.
- [x] **Approval is attributed** and counted toward activation, which is how a
      workspace reaches "activated".
- [x] **UI** — the detail panel gains an outreach block: language picker,
      "Draft from evidence", the editable draft with its word count, the
      *This draft is based on* evidence list, Save edit, Approve, Reject, and a
      red panel listing any claim the evidence does not support.

**Bugs found and fixed while building this** (the checker was the hard part)
1. **The entity checker flagged ordinary prose** — "Best", "Would", "Germany.
   That" — which would have blocked every legitimate draft and trained users to
   ignore the guard. Rewritten to check only capitalised words *inside* a
   sentence, with a prose stoplist.
2. **An invented "40" passed** because the corpus contained "240" and the test
   was a substring match. Numbers now match an exact token set.
3. **German nouns looked like proper nouns** ("Supportlast", "Werkzeugen"),
   because German capitalises every noun. Rather than ship a word list that
   rots, single-word entity checks are disabled for German drafts; numbers and
   multi-word names are still checked, and the limitation is documented in the
   code and here rather than hidden.
4. **A closing quote broke matching** — a cited title ends `Germany".`, so the
   token never matched its evidence.
5. **The E2E harness discarded error bodies**, so a 422's violation list was
   invisible and the assertion could never pass. `Call` now parses them.

**Known limitation, stated plainly** — a signal's title is not translated. The
citation is verbatim in every language. Fixing that properly needs a model.

**Verify:** 75/75 vitest (20 new drafter and checker tests), **104/104
E2E-REQUIRED** (13 new outreach checks), all other E2E scripts clean, storage
pass, frontend `tsc` + build clean, CI green.

---

## Stage 22 — Monitoring and alerts (Priority 5) **[COMPLETE]**

**Goal:** "users should return weekly because the platform gives them new reasons
to act." A tool you check once is a tool you abandon.

- [x] **Watches** — `company_watches`, org-scoped, with per-kind opt-outs
      (signals / score changes / contact changes) because someone watching for
      hiring does not want a nudge about a two-point score drift.
- [x] **Monitoring pass** (`src/lib/monitoring.ts`) reports new signals, material
      score changes ("score 80 → 90"), new decision-makers, and tasks due
      within 24h — then a **weekly digest** of all of it.
- [x] **The pass is idempotent, and that is the whole contract.** Watermarks live
      in the watch (`last_checked_at`, `last_notified_score`) and the digest is
      keyed by its period, so a scheduler can call it daily and an operator can
      press the button twice without sending the same news twice. Asserted in
      E2E.
- [x] **A new watch backfills 30 days once**, so subscribing produces immediate
      value instead of a week of silence that reads as "monitoring is broken".
- [x] **Score alerts cannot contradict the feed** — the alert recomputes with the
      same deterministic scorer the card uses.
- [x] **One alert per company, not per event.** Three new roles is one reason to
      come back, not three near-identical rows in the inbox.
- [x] **Trigger paths:** `POST /platform/monitoring/run` for a scheduler (cron /
      EventBridge / Azure Scheduler) and `node tools/run-monitoring.mjs` for
      local and manual runs. No background timer exists in this environment —
      the job is a pure function of the database plus watermarks, so wiring it to
      a scheduler is configuration, not code.
- [x] **UI** — a notification bell with unread count, a list with mark-as-read, a
      "Check now" button that runs a pass on demand, and a **Watch** action on
      every opportunity card.
- [x] **The shared `notifications` table was extended, not duplicated**: the
      pilot's `kind` CHECK constraint only allowed pilot kinds, so the platform's
      four kinds were added to the same enum — one inbox, one unread count, and
      the pilot keeps working unchanged.

**Bugs found and fixed while building this**
1. **Silent data-corruption class bug:** `SELECT o.id, o.score, ..., i.*` — `icps`
   also has an `id`, so `i.*` overwrote the opportunity id and every `UPDATE`
   targeted nothing. The alert fired correctly while the baseline it was supposed
   to record never persisted, so the same alert repeated forever. Columns are now
   listed explicitly.
2. **Six identical "score 80 → 90" alerts**, one per opportunity of the same
   company, all comparing against a baseline that was only written after the
   loop. Now one alert per company per pass.
3. **Two different contacts produced two alerts with the same generic title**,
   so a real inbox had indistinguishable rows. Signal and contact alerts are now
   merged per company and self-describing.
4. The platform's alert kinds violated the existing `notifications_kind_check`
   constraint — caught immediately because the first run failed rather than
   silently writing nothing.

**Verify:** 75/75 vitest, **114/114 E2E-REQUIRED** (10 new monitoring checks,
including "re-running reports no duplicate alerts" and "one pass never sends the
same alert twice"), all other E2E scripts clean, storage pass, frontend `tsc` +
build clean, CI green.

---

## Stage 23 — Operator login, animated sign-in, honest store access **[COMPLETE]**

**Goal:** three defects a customer would have found. Anyone could become a
walker, the sign-in art was a still image, and the site sent people to app
stores that do not exist.

- [x] **Operator login is now a real identity check** (migration
      `011_operator_pairing.sql`, `src/lib/pairing.ts`).
      - Previously `POST /auth/sync` accepted **any** email and returned a
        device token, so a stranger who typed an address could collect delivery
        jobs and money. That was a documented pilot limitation, and it was the
        wrong thing to ship.
      - Now an admin issues a **six-character code** and the operator spends it
        **once**. Single use, expiring (1 h – 14 days), revocable, and
        optionally bound to one email.
      - **The code alphabet excludes `0/O` and `1/I/L`.** A code read aloud on a
        noisy street cannot be mistyped into a different valid-looking code, and
        the app tells the operator when a character cannot appear in a code.
      - `POST /auth/pair/exchange` is public (the app has no session yet) and so
        carries its own tight rate limit, and returns a **specific** reason —
        unknown / used / revoked / expired / wrong email — because a coordinator
        on the phone needs to know whether to re-send a code or fix the email.
      - The code is spent **before** provisioning, in its own transaction, so a
        failure later can never leave a code reusable.
      - The spent code records the **device label**, so an operator can be
        traced to a handset and a lost phone identified.
      - A pilot-only code (`PILOT24`) keeps the local walkthrough working and is
        **refused the moment `AUTH_MODE=required`**.
- [x] **Operator app login** — email + code, uppercase, 6-character counter,
      inline validation, a "codes never contain 0, O, 1, I or L" hint for a
      misread character, a live character counter, disabled state until valid,
      and a scroll view so the keyboard cannot cover the button.
- [x] **Ops console** — an "Operator access codes" panel to issue, copy and
      revoke codes, with each code's state (live / used / expired / revoked),
      the email it is bound to, and the device it was spent on.
- [x] **The sign-in walker is animated** — body bob, counter-swinging legs, arm
      and parcel swing, a pulsing location pin, a shadow that contracts as he
      steps, and a slow settle on the stacked parcels. All CSS on SVG groups, so
      it costs nothing on a low-end phone, and it is **disabled wholesale under
      `prefers-reduced-motion`**. The figure also got a real `role="img"` and
      label.
- [x] **Removed two false claims from the public site**:
      - The App Store / Google Play badges linked to the stores' home pages.
        There is no store build, so those were dead ends for anyone who
        believed them. `/faq` now states what is true: the app runs on iOS and
        Android, store listings are not published, access is handed out with a
        pairing code.
      - The runner application modal said "sign in with your mobile number".
        It now describes the pairing flow that actually exists.
- [x] **Deliberately not changed:** the "Trusted by businesses from" logos.
      They were flagged as a risk and the user chose to leave them.

**Bugs caught while building this**
1. **The animation broke the illustration.** A CSS `transform` *replaces* an
   element's SVG `transform` attribute, so the parcel flew to the corner of the
   viewBox. Found by screenshotting, not by reading the code. The positioning
   transform now lives on an outer group and only the inner group animates — the
   same trap applies to the location pin.
2. The pairing claim initially wrote the code's *email* into a column that
   expects a *user id*, because the operator row does not exist until after the
   code is spent. Claiming and attribution are now separate steps.

**Verify:** 90/90 vitest (15 new pairing tests), **130/130 E2E-REQUIRED** (19
new pairing checks: single use, expiry boundary, wrong-email refusal, revocation,
device recording, role gates), all other E2E scripts clean, storage pass,
frontend `tsc` + build clean, operator `tsc` clean, CI green.

---

### Out of scope (not in this plan unless requested)

Live ops map/WebSocket, email/SMS notifications, Stripe billing, multi-org
management UI, algorithmic anything, continuous GPS tracking.

### Beyond this plan

This plan covers the field-ops pilot plus the platform core built in Stage 20.
The rest of the wider platform — natural-language ICP parsing, LLM agents
(research, qualification, outreach drafting), signal monitoring and alerts, email
delivery, CRM sync, billing — is scoped in [`TASKS.md`](./TASKS.md) and
sequenced in [`docs/PRIORITIES.md`](./docs/PRIORITIES.md).

Note on honesty of the first run: discovery is **deterministic template
matching**, not natural-language understanding. Priority 1's "type a sentence,
get filters" step needs an LLM provider, which is not configured in this
environment. The wizard therefore starts from curated templates, and the
scoring, evidence and activation loop behind it is the real implementation.
