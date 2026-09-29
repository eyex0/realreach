# RealReach — Project Context

RealReach is an AI-native B2B business-development platform.

It helps users:
1. Discover relevant companies
2. Detect business signals
3. Understand why a company is an opportunity
4. Identify decision-makers
5. Generate evidence-based outreach
6. Track opportunities in a pipeline
7. Monitor companies for new signals

## Core user journey

```
User defines an ICP
→ RealReach finds companies
→ Detects signals
→ Scores opportunities
→ Recommends contacts
→ Drafts outreach using evidence only
→ User reviews and approves outreach
→ RealReach tracks replies and monitors changes
```

## Core Rules

- Use TypeScript everywhere.
- Use Next.js App Router.
- Use PostgreSQL with Prisma.
- Use Tailwind CSS and shadcn/ui.
- Use Zod for validation.
- Use pgvector for embeddings.
- Never invent company, contact, or signal data.
- Every AI claim must be linked to evidence.
- Company data and personal data must be separated.
- Every contact needs source, lawful basis, confidence, and timestamp.
- Outbound email requires user approval before sending.
- Do not scrape LinkedIn directly.
- Respect robots.txt, provider terms, and rate limits.
- Prefer simple, production-ready code over clever abstractions.

## Tech Stack

- Next.js 14+ App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL
- pgvector
- Redis + BullMQ
- Zod
- Clerk or Auth.js
- Stripe
- Resend, Postmark, or SES
- Sentry
- Langfuse or LangSmith

## Current Phase

Build a modular monolith first.
Do not introduce microservices, Kubernetes, Kafka, Elasticsearch, or sharding
unless explicitly requested.

---

## Addendum — what is actually built, and in which stack

> Added 2026-09-29 after this file was drafted. Read this before planning work.

### The shipped stack is not the one listed above

This repository is a **working product**, not a fresh scaffold, and it is built
on a different stack:

| Layer | Actual choice (in use today) | Not used |
| --- | --- | --- |
| Web app | Vite + React 19 SPA | Next.js App Router, RSC |
| Components | Bespoke Tailwind v4 component set | shadcn/ui |
| API | Express + TypeScript, `src/routes/*` | — |
| Database | PostgreSQL + **PostGIS** on Supabase | — |
| Schema/migrations | Numbered SQL files, `db/migrations/*.sql` | Prisma |
| Validation | Zod where new endpoints take input | — |
| Auth | Clerk (web) + HMAC device tokens (operator) | Auth.js |
| Vector search | not started | pgvector |
| Queue | not started — jobs are invoked on demand | Redis + BullMQ |
| Billing / email / LLM / tracing | not started | Stripe, Resend, OpenAI, Langfuse |

Nothing above is a criticism of the original plan — it is the plan for the
**platform**, and the platform has not been scaffolded yet. What exists today is
the **field-ops pilot** (letterbox distribution) plus a working subset of the
platform core. See `docs/TASK_STATUS.md` for the honest task-by-task map, and
`docs/OPENCODE_TASKS.md` for the build prompts.

### Two decisions that are deliberate, not drift

1. **Raw SQL migrations instead of Prisma.** The domain is geospatial
   (`geometry(Polygon, 4326)`, `ST_DWithin`, `ST_Area`, `ST_AsGeoJSON`). Prisma
   has no first-class spatial type, so modelling the route and polygon checks in
   the ORM layer would mean dropping to `$queryRaw` for the interesting parts
   anyway. SQL keeps the evidence honest. If the platform moves to Prisma, these
   tables need an explicit decision, not a silent rewrite.
2. **Deterministic scoring instead of LLM scoring.** `score_v1`
   (`src/lib/opportunityScore.ts`) and `trust_v1` (`src/lib/trust.ts`) are
   versioned, weighted, and unit-tested. The rules say the model may *explain* a
   score but never *produce* one; the code is what makes that enforceable rather
   than aspirational.

### Rules that already hold in this repo, and where they live

| Rule | Where it is enforced |
| --- | --- |
| Every tenant-owned table carries `org_id` | `db/migrations/009_platform_core.sql`; asserted by 6 E2E checks |
| Never invent company/contact/signal data | `source_provider NOT NULL` on `companies`; `evidence NOT NULL` on `signals`; `source_provider` + `lawful_basis` on `people` |
| Every AI claim links to evidence | `findUnsupportedClaims()` in `src/lib/outreachDraft.ts`; blocked with 422 |
| Company data separated from personal data | `companies` / `company_sources` vs `people`; no join path in the UI |
| Contacts need source, lawful basis, confidence | `people` table constraints |
| Approval before send | DB constraint `outreach_approved_before_queue` — not just the API |
| Do not scrape LinkedIn | `people.source_type` allows only `licensed_provider`, `customer_upload`, `public_registry` |
| No secrets in code | `.env.example` in all three repos; nothing else tracked |
| Tests for tenant isolation | `tools/test-e2e-required.ps1` sections J and L |
