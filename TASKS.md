# RealReach — Task Board

Source of truth for what is built, what is planned, and what is verified.
Companion documents: [`PLAN.md`](./PLAN.md) (stage-by-stage engineering plan for
the field-ops pilot) and the per-area context briefs in [`docs/`](./docs).

**Status legend** — `[x]` verified working · `[~]` built, not yet verified ·
`[ ]` not started.

---

## Pilot status — RealReach Field Ops (letterbox distribution)

This is the shipped, verified vertical. Everything below was signed off on
2026-09-29 after a full regression sweep and a real-phone QA run.

| Area | Status | Verified by |
| --- | --- | --- |
| Campaign lifecycle (draft → planned → live → completed) | `[x]` | `tools/test-reports.ps1`, ops console |
| Spatial split into letterbox tasks (PostGIS) | `[x]` | 4 tasks, 2×2 grid, seq numbering |
| Operator app: sign-in, missions, accept, GPS session, proof | `[x]` | Real phone via Expo Go |
| Evidence: photo, quantity, note + offline outbox replay | `[x]` | Airplane-mode test, real phone |
| Machine verification (GPS route, quantity, photo) | `[x]` | `verified` verdict on a real walk |
| Human proof review (client/admin only) | `[x]` | `tools/test-review-integrity.ps1` |
| Machine verdict never overwritten by human decision | `[x]` | Verdict + human decision stored separately |
| Payouts: generate → approve → pay, €0.04/piece | `[x]` | `tools/test-payouts.ps1`, immutability on paid rows |
| Ops console (campaigns, tasks, proofs, payouts) | `[x]` | Browser, daily use |
| Auth: Clerk sessions + device tokens, role gates | `[x]` | `tools/test-e2e-required.ps1` (49 checks) |
| Audit log for admin/money actions | `[x]` | payout + approval events |
| Rate limiting, upload size caps, storage (Supabase) | `[x]` | `tools/test-hardening.ps1`, storage E2E |
| Reports: overview, campaign, estimate | `[x]` | `tools/test-reports.ps1` |
| Landing page + live Milan map | `[x]` | Rendered and screenshotted |
| Landing map backed by real campaign data | `[x]` | `GET /map/live`, real geometry + last GPS track |
| CI green on all three repos | `[x]` | GitHub Actions |
| Data hygiene tools (purge + idempotent seed) | `[x]` | `tools/purge-domain.sql`, `tools/seed.mjs` |
| Deployment / hosting | `[ ]` | Deferred by decision |
| Installable store build (EAS APK/IPA) | `[~]` | Exports clean; not submitted to a store |
| Live continuous tracking | `[ ]` | Out of scope for v1 |

### Known limitations (deliberate, not bugs)

- Operator sign-in is email-only — no OTP, no identity check. Pilot-only.
- One session per proof; v1 does not stream live GPS to the web console.
- Rate is a hardcoded €0.04/piece. There is no client billing.
- Demo map zones are hand-drawn rectangles, not real GIS boundaries. The hero
  map shows real campaign geometry when the API is reachable and falls back to
  those demo zones when it is not.
- Browser QA cannot produce GPS, so verdicts there are `requires_review`.

---

## Phase 0 — Product decisions

- [x] **T001** Define launch ICP — narrow segment chosen for the field-ops pilot (Milan metro, letterbox/flyer distribution, 50–500 employee B2B).
- [x] **T002** Define core user workflow — ICP → discovery → signals → qualification → contacts → outreach → tracking.
- [x] **T003** Define first-country focus — Italy (Milan) first, Germany as the expansion proof.
- [x] **T004** Define first buyer persona — ops/marketing manager at a B2B company running physical distribution.
- [x] **T005** Define main problem statement — teams cannot prove who was reached, where, or how much was delivered.
- [x] **T006** Define success metrics — tasks completed per campaign, verified pieces, payout accuracy.
- [x] **T007** Choose launch pricing direction — subscription + usage credits.
- [ ] **T008** Create competitor shortlist
- [ ] **T009** Create differentiation statement
- [ ] **T010** Check RealReach name availability

## Phase 1 — Project foundation

- [x] **T011** Create GitHub repository — three repos: `realreach` (web), `realreach-backend`, `realreach-operator`
- [x] **T012** Initialize TypeScript project — Vite + React 19 + TS (web), Express + TS (API), Expo SDK 57 (operator)
- [x] **T013** Tailwind CSS — v4
- [ ] **T014** shadcn/ui — not used; a bespoke component set matches the brand
- [x] **T015** Set up PostgreSQL — Supabase Postgres + PostGIS
- [ ] **T016** Prisma — raw SQL migrations used instead
- [x] **T017** Configure environment variables — `.env.example` in all three repos
- [x] **T018** Set up local development environment — API :4000, web :3000, Metro :8081
- [ ] **T019** Staging environment
- [ ] **T020** Production environment
- [x] **T021** Configure GitHub Actions CI — green on all three repos
- [ ] **T022** Automatic deployment — deferred
- [ ] **T023** Sentry error tracking
- [x] **T024** Basic logging — structured request logging
- [x] **T025** README and project documentation — all three repos

## Phase 2 — Database foundation

- [x] **T030** companies table — `campaigns` (the pilot's company/campaign unit)
- [x] **T032** signals table — GPS sessions + evidence rows
- [x] **T034** opportunities table — letterbox tasks with state machine
- [x] **T037** tasks table — payout rows
- [x] **T040** audit logs — admin and money actions
- [x] **T041** Indexes for search fields — spatial + status indexes
- [x] **T042** Migration scripts — numbered SQL migrations
- [x] **T043** Seed test data — `tools/seed.mjs`, idempotent
- [ ] **T026/T027/T028/T029** organizations, users, workspaces, memberships — pilot is single-tenant by design
- [ ] **T031** company_sources
- [ ] **T033** people
- [ ] **T035** saved_companies
- [ ] **T036** outreach_messages
- [ ] **T038** notes
- [ ] **T039** credit_transactions

## Phase 3 — Auth and workspaces

- [x] **T044** Choose auth provider — Clerk for web, HMAC device tokens for operators
- [x] **T046** Login
- [ ] **T045** Email/password sign-up — Clerk handles it
- [x] **T051** Role-based access control — client/admin/walker
- [ ] **T048–T057** organizations, workspaces, invitations, settings pages
- [x] **T058** Multi-tenant isolation tests — the `AUTH_MODE=required` E2E sweep
- [x] **T059** Audit logging for auth events

## Phase 4 — Core UI

- [x] **T060–T062** Brand colors, typography, spacing
- [x] **T063–T075** Components: buttons, inputs, tables, cards, badges, modals, empty/loading/error states, nav, responsive layout
- [x] **T076** Dashboard page — operator app home (stats, active mission, queue)
- [ ] **T077–T085** company search, profiles, opportunity list/detail, signals, contacts, outreach, settings, billing
- [x] Landing narrative: Hero + Plan + Runner + Verify + Measure + Platform + Infra + case studies
- [x] Real Leaflet map (Milan zones, live runners) on the landing page, planner and campaign builder

## Phase 5 — Company data layer

- [ ] **T088–T102** Provider research and selection
- [~] **T103/T104** Connector architecture — not needed for the pilot (no external sources)
- [ ] **T105–T122** Ingestion, normalization, dedup, refresh scheduling
- [ ] **T123–T138** Company search, filters, export, saved searches

## Phase 6 — Signal engine

- [~] **T139–T148** Signal taxonomy — the pilot's signals are delivery events, not market signals
- [x] Evidence storage for every proof (photo, quantity, note, GPS points)
- [ ] **T149–T168** Signal ingestion, confidence/freshness scoring, review workflow, feeds

## Phase 7 — ICP and opportunity engine

- [ ] **T169–T180** ICP model and builder
- [ ] **T181–T193** Explainable scoring model
- [x] Task state machine: available → assigned → accepted → in_progress → submitted → approved
- [ ] **T194–T207** Opportunity generation, feed, pipeline stages, export

## Phase 8 — AI infrastructure

- [ ] **T208–T226** LLM provider, prompts, guardrails, cost ceilings, observability
- [ ] **T227–T234** pgvector, embeddings, semantic search

## Phase 9 — AI agents

- [ ] **T235–T248** Agent runtime
- [ ] **T249–T270** Discovery and research agents
- [ ] **T271–T280** Qualification agent
- [ ] **T281–T288** Contact mapping
- [ ] **T289–T302** Monitoring agent and notifications

## Phase 10 — Contacts and compliance

- [ ] **T303–T315** Licensed contact provider and contact management
- [~] **T316–T317** Source and lawful-basis fields on evidence rows
- [ ] **T318–T332** Retention, suppression, DSAR, DPA, privacy docs
- [x] Every proof records its operator, timestamp and machine verdict (audit trail for the pilot)

## Phase 11 — Outreach system

- [ ] **T333–T354** Outreach drafts and approval
- [ ] **T355–T371** Email infrastructure and deliverability

## Phase 12 — CRM and collaboration

- [~] **T372** Pipeline board — the ops console is a table view of campaigns/tasks/proofs
- [ ] **T373–T392** Drag-and-drop stages, owners, tasks, notes, CRM sync

## Phase 13 — Billing and credits

- [~] **T403–T409** Payout ledger and per-piece rate (no Stripe)
- [ ] **T393–T402** Stripe products, checkout, webhooks
- [ ] **T410–T415** Usage dashboards, upgrade/cancellation flows

## Phase 14 — Admin and operations

- [x] **T416–T432** Ops console (admin view of campaigns, proofs, payouts, reports)
- [ ] **T423–T429** Provider, quota, job-failure, freshness and AI-cost dashboards
- [x] **T434** API rate limiting
- [x] **T435** Request validation
- [ ] **T438** Secure headers, **T439** secrets management, **T440** environment separation
- [ ] **T441–T443** Backups, restore test, DR plan
- [ ] **T444–T449** Uptime, latency, cost and breach alerting

## Phase 15 — Onboarding and launch

- [x] Operator app first-run flow (sign-in → missions → task)
- [x] Landing page
- [ ] **T453–T462** Web onboarding wizard, tours, help center
- [ ] **T463–T480** Marketing site expansion, pricing page, design partners, public launch

## Phase 16 — Post-launch growth

- [ ] **T481–T500** Customer success, growth loops, agency program

---

## How to use this file

1. Tick a task only when its **Definition of Done** is satisfied.
2. Update this file in the same commit as the code that closes the task.
3. Link the verification (test name, screenshot, or manual run) in the commit body.
4. Keep [`PLAN.md`](./PLAN.md) for engineering stages; this file for scope.
