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

- [ ] **Backend**: create `.gitignore` first — `node_modules/`, `dist/`,
      `storage/`, `.env`, `*.log`, `!.env.example` (`.env` holds the Clerk secret
      and DB password: **must never be committed**). Then `git init`,
      `git add -A`, initial commit `feat: API Stages 2-9 (campaigns, tasks, sync, verification, reports, payouts, authz)`.
- [ ] **Frontend**: review `git status` (61 files), commit as
      `feat: web platform Stages 2-9 (builder, ops console, reports, review UI, auth)`.
- [ ] **Operator**: check status (template commit + our source), commit
      `feat: operator app (offline queue, GPS, camera proof, earnings)`.
- [ ] **CI**: confirm the three workflows (web: lint+build; backend: Postgres
      service + migrations + tests; add a typecheck-only workflow for the
      operator: `npm ci` + `npx tsc --noEmit`).
- [ ] Check for a remote (`git remote -v`, `gh auth status`); if a remote exists
      push, otherwise ask the user where to push.
- **Verify:** `git status` clean ×3; backend `git check-ignore .env` says ignored;
  `git log --oneline` sane; workflows are valid YAML.
- **Commit:** per repo as above.

## Stage 11 — Production auth cutover
**Goal:** prove the whole API works with `AUTH_MODE=required` (no legacy actor-id
fallback), end to end, with tokens.

- [ ] New `tools/test-e2e-required.ps1`: start server with `AUTH_MODE=required`,
      mint client+walker tokens (`tools/token-probe.mjs`), then the full flow:
      campaign create→status→split→assign→accept→session→GPS→evidence→proof→
      **walker 403 on review**→client approve→payout generate/approve/pay→reports.
- [ ] 401 sweep: probe every mounted route family without a token → expect 401
      except the public whitelist (`/health`, `/auth`, `/sync`, `POST /campaigns/estimate`).
- [ ] Fix anything the sweep finds; keep `optional` mode as the dev fallback only.
- [ ] Re-run backend tests + the existing scripts (`test-authz.ps1`,
      `test-review-integrity.ps1`, `test-payouts.ps1`, `test-reports.ps1`).
- [ ] Restart servers back in dev (optional) mode.
- **Verify:** new script prints PASS end to end; vitest 22/22.
- **Commit:** `feat: required-mode E2E suite` + any fixes.

## Stage 12 — Evidence storage on Supabase (decision gate)
**Goal:** proof photos stored in Supabase Storage instead of local disk.

- [ ] Needs `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in backend `.env`
      (user must supply — MCP tools cannot expose the service-role key).
- [ ] Create private bucket `evidence`; confirm `src/lib/storage.ts` Supabase
      path (driver already written, dormant).
- [ ] E2E: photo upload via `/sync/evidence` → row's `storage_key` points at
      Supabase; download via `/sync/evidence/:id/file` returns identical bytes.
- [ ] If keys are not available: mark stage **deferred** — local-disk driver is
      acceptable for a single-node pilot; document it.
- **Verify:** E2E photo round-trip passes (or deferral recorded in this file).
- **Commit:** `feat: Supabase evidence storage` (or `docs: defer …`).

## Stage 13 — Data hygiene & pilot seed
**Goal:** replace accumulated test rows with a clean, reproducible dataset.

- [ ] Inventory current rows (campaigns include "Review Integrity Run",
      "Stage6 …" etc.); decide keep-one-golden-demo vs full purge (ask user if
      unclear).
- [ ] `tools/seed.mjs`: idempotent pilot dataset — 1 client, 2 walkers,
      1 campaign (Milan polygon) → planned → split (2×2) → assign 2 tasks →
      one completed+approved proof so reports/payouts render meaningfully.
- [ ] Verify post-seed: `/reports/overview`, `/payouts/generate`, review queue.
- **Verify:** seed runs twice without error (idempotent); report numbers sane.
- **Commit:** `chore: pilot seed + test data cleanup`.

## Stage 14 — Configuration & documentation
**Goal:** a fresh clone can be set up from docs alone.

- [ ] `.env.example` refresh both repos: `DATABASE_URL`, `CLERK_SECRET_KEY`,
      `AUTH_MODE`, `FRONTEND_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`;
      frontend `.env.example`: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_BASE`;
      operator: document `EXPO_PUBLIC_API_URL` (and add `.env.example`).
- [ ] Frontend README rewrite (currently stale) — stack, run, routes, auth flow.
- [ ] Operator README: setup, device run (`npx expo start`), offline behavior,
      permissions (camera/location), how sign-in works.
- [ ] Cross-link the three READMEs; backend README already current.
- **Verify:** spot-check every documented command actually works.
- **Commit:** `docs: setup + run documentation`.

## Stage 15 — Deployment (decision checkpoint ⏸)
**Goal:** a live pilot URL. **Stop here and ask the user to choose:**
PaaS (Railway/Render + Vercel) · VPS (Docker compose) · no deploy yet.

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

## Stage 16 — Device QA (manual, user-driven + my bugfix loop)
**Goal:** the operator app proven on a real device.

- [ ] I prepare a device checklist: sign-in (Clerk) → pull missions → accept →
      start (GPS) → camera proof → submit → airplane-mode test (outbox queues)
      → back online (auto flush) → earnings visible.
- [ ] User runs it on device/emulator (I cannot — no device here); reports issues.
- [ ] I fix, re-run scripts + typechecks, hand back the next checklist step.
- **Verify:** checklist completed; regressions green.
- **Commit:** `fix: device QA issues` (as found).

## Stage 17 — Final verification & handoff
**Goal:** one clean sweep and a written handoff.

- [ ] Run everything: backend tsc + 22 tests, frontend lint+build, operator tsc+
      export, all `tools/*.ps1` E2E scripts, servers healthy, git clean ×3,
      CI green on push.
- [ ] Handoff summary: what's live, how to run each piece, deferred items
      (Supabase storage if deferred, EAS build, anything from QA), known limits
      (pricing assumptions, no live tracking in v1).
- **Verify:** every line of the sweep above is green.
- **Commit:** final `chore: Stage 17 verification`.

---

### Out of scope (not in this plan unless requested)
Live ops map/WebSocket, email/SMS notifications, Stripe billing, multi-org
management UI, algorithmic anything, continuous GPS tracking.
