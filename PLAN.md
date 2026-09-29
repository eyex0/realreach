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

## Stage 16 — Device QA (manual, user-driven + my bugfix loop) **[COMPLETE]**
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

### Out of scope (not in this plan unless requested)
Live ops map/WebSocket, email/SMS notifications, Stripe billing, multi-org
management UI, algorithmic anything, continuous GPS tracking.
