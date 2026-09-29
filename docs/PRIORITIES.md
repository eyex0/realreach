# RealReach — Platform Priorities

The ordered, opinionated list of what to build next and what **not** to build
yet. This file is the source of truth for *sequence*; [`../TASKS.md`](../TASKS.md)
is the source of truth for *scope*; [`CONTEXT.md`](./CONTEXT.md) holds the
per-area briefs.

## Platform goal

> Every time a user logs in, they immediately see a relevant opportunity,
> understand why it matters, and know the next action to take.

Achieve that consistently and RealReach becomes part of the user's weekly sales
workflow — not another tool they tried once.

## The order (do these in exactly this sequence)

| # | Priority | Pilot status |
| --- | --- | --- |
| 1 | Perfect the first-run experience | `[~]` template -> discovery -> feed -> save works; NL ICP needs an LLM |
| 2 | Make data trustworthy and sourced | `[x]` confidence, freshness, unknown-marker and bad-data reporting all shipped |
| 3 | Make the opportunity feed the home screen | `[x]` `/opportunities`: score, why it matters, next action, save/dismiss |
| 4 | Make AI transparent and evidence-based | `[~]` verdict + outreach evidence shown, unsupported claims blocked; LLM outputs not yet |
| 5 | Add monitoring and alerts | `[x]` watches, watermarked passes, score/signal/contact/task alerts, weekly digest |
| 6 | Build admin and support tools | `[~]` ops console covers campaigns, proofs, payouts, reports; no feature flags, job retry, or support tickets |
| 7 | Improve data coverage by market | `[ ]` Italy only (Milan); no external sources |
| 8 | Use feedback to improve scoring and matching | `[~]` bad-data reporting live; outcome capture needs the opportunity model |
| 9 | Add CRM/integration depth | `[ ]` blocked until retention proves demand |
| 10 | Expand geography and ICPs | `[ ]` blocked until coverage is reliable |

---

## 1. Perfect the first run

> The most important platform job is ensuring a new user gets value in the
> first 10 minutes.

Build and optimise, in order:

1. Clear onboarding
2. ICP templates
3. First discovery run
4. Opportunity feed
5. Save opportunities
6. Contact recommendations
7. Outreach draft

**Activation flow**

```text
Sign up
→ Choose ICP template
→ Run discovery
→ See 25 companies
→ Save 5 opportunities
→ Approve 1 outreach draft
```

If this flow is slow, confusing, or produces weak results, nothing else
matters.

**Status** - two first runs now exist. The field-ops app one (sign in -> missions
-> accept -> GPS session -> proof -> paid) is verified on a real phone. The
**platform** one lives at `/start`: pick one of six curated ICP templates, run
discovery, review scored results, save what matters. Activation is measured live
in the feed (1 discovery run, 5 saved opportunities, 1 approved outreach).

What is still missing is the natural-language step. "Type a sentence, get
structured filters" needs an LLM provider, which is not configured in this
environment, so the wizard starts from templates instead. Everything behind it -
the structured filters, the deterministic `score_v1` scoring with a full
breakdown, the evidence links and the activation counter - is the real
implementation, not a placeholder.

## 2. Make data trustworthy

Users will only pay if they trust the data. This is more important than adding
more AI features.

1. Source attribution on every company and contact
2. Last-updated date
3. Confidence score
4. Freshness score
5. Duplicate detection
6. Clear "unknown" fields
7. Easy reporting of bad data
8. Regular refresh jobs

Every company and person must answer: **where did this data come from? when was
it last updated? how confident is it? can the user report an issue?**

**Pilot status**

| Requirement | Pilot |
| --- | --- |
| Source attribution | `[x]` every evidence row stores `source`, `mime`, `storage_key`, `captured_at`, and the uploader |
| Last-updated | `[x]` `created_at` / `captured_at` / `reviewed_at` on every row |
| Machine decision provenance | `[x]` `verification_results.checks` + `reason_code`, never overwritten by a human decision |
| Confidence score | `[x]` deterministic, versioned (`trust_v1`), with a per-component breakdown, stored on every verification |
| Freshness score | `[x]` halves every 7 days, recomputed at read time so a stored score never goes stale |
| Explicit "unknown" | `[x]` pre-trust rows report `null` and render as "unknown", never as 0 |
| Report bad data | `[x]` `POST /data-reports`, flaggable by anyone incl. the operator; ops queue with resolve/dismiss |
| Duplicate detection | `[~]` campaign/task dedupe exists; entity resolution does not |
| Refresh jobs | `[ ]` no scheduler exists |

## 3. Make the opportunity feed the home screen

The platform must open to actionable opportunities, not an empty dashboard.

Each card shows: company name · score · why it matters · primary signal ·
recommended contact · next action · save / research / draft outreach.

```text
Company X — Score 82
Hiring 3 customer-support specialists in Berlin
Expanding into Germany
Recommended contact: Head of Customer Operations
Next action: Send introduction email
```

Users must immediately understand: **what should I do next?**

**Pilot status** — the operator home screen already answers "what do I do next"
with an active-mission hero card, which is the same idea applied to delivery
work. The scored opportunity feed does not exist; it depends on priorities 1, 2
and 4.

## 4. Make AI transparent

Never a black box. Every AI output shows: signals used · sources · confidence ·
why the company is relevant · why now · what evidence supports the claim.

Outreach must show its basis:

```text
This draft is based on:
- Hiring signal: Customer Support Specialist, Berlin
- Expansion signal: New German distributor
- Source links
```

If the AI mentions something without evidence, block it.

**Pilot status** — the machine verifier is the template to copy: it returns
`verified` / `requires_review` / `rejected` with per-check detail and a reason
code, and a human approval is recorded separately without ever overwriting the
machine verdict. Every verdict now also carries a confidence score with its
per-component breakdown, so the "show your evidence" pattern is proven end to
end. There is no LLM in the pilot yet, so there is nothing further to make
transparent — but the *shape* of the guarantee is already proven.

## 5. Make the workflow sticky

Users should return weekly because the platform gives them new reasons to act.

Daily/weekly signal alerts · new opportunity notifications · saved-company
monitoring · score changes · contact changes · task reminders · weekly digest.

```text
Company X just posted 2 customer-service roles in Germany.
Opportunity score increased from 68 to 84.
Review opportunity →
```

This turns RealReach from a search tool into a daily workflow.

**Status** - `[x]` shipped. The shared `notifications` table was extended with
the platform's kinds rather than duplicated, so the pilot and the platform share
one inbox. `company_watches` stores per-kind opt-outs and the watermarks that make
a monitoring pass idempotent; a pass reports new signals, material score changes,
new decision-makers, tasks due within 24h, and a weekly digest.

The pass is a pure function of the database plus those watermarks, exposed as
`POST /platform/monitoring/run` and `node tools/run-monitoring.mjs`. Wiring it to a
cron, EventBridge or Azure Scheduler is configuration, not code.

## 6. Keep the platform simple

Do not add every possible feature. For the first 6–12 months, focus on:

```text
Discover → Understand → Qualify → Contact → Reach → Track
```

Avoid building too early: complex CRM · custom agent builders · mobile app ·
white-label portals · enterprise SSO · large analytics suites · dozens of
integrations. Add these only when customers ask repeatedly and retention proves
demand.

**Pilot status** — the field-ops app is a deliberate exception: a mobile app is
the product, because a walker cannot do delivery work from a browser. That is
scope, not sprawl.

## 7. Build platform health monitoring

Know when the platform is failing before customers complain.

Track: data freshness · failed ingestion jobs · API errors · queue backlog · AI
costs · agent failures · bounce rates · credit usage · customer activation ·
churn risk.

Alert on: data older than X days · job failure rate above X% · AI cost per run
above X · bounce rate above X% · customer inactive for X days.

**Pilot status** — `[~]` structured request logging and rate limits exist; there
is no metrics store, no dashboard, and no alerting.

## 8. Build admin and support tools

Customer search · workspace overview · credit adjustments · data-refresh
controls · job retry tools · feature flags · error investigation · support
ticket tracking · usage reports.

Without admin tools, every customer issue becomes manual work.

**Pilot status** — the ops console is the seed of this: campaigns, tasks,
proofs with machine verdicts, payouts, and reports. Credit adjustments, feature
flags, job retry, and support tickets are missing.

## 9. Improve data coverage gradually

```text
Phase 1: Italy + Germany
Phase 2: UK + France
Phase 3: UAE + Saudi Arabia
Phase 4: Broader Europe
Phase 5: Global expansion
```

For each new market add: local company registry · local news sources · local job
boards · local compliance rules · local contact providers.

Do not claim global coverage before the data is reliable.

**Pilot status** — Italy only, and only Milan, with no external data sources at
all. The pilot's "data" is what its own operators record.

## 10. Build a feedback loop

Every user action should improve the platform.

Track: opportunities saved · opportunities ignored · bad-data reports ·
outreach approved · outreach edited · contacts marked wrong · signals marked
irrelevant · searches with no good results.

Use it to improve scoring, signal relevance, contact matching, outreach
quality, and search ranking. This becomes a long-term advantage.

**Pilot status** - `[~]` the first half is live: any user (including the
operator who produced the data) can flag bad data, the ops console shows an
open-report count per proof and a queue with resolve/dismiss, and filing a
report provably never changes the machine verdict.

`[x]` the platform half now exists too. Every opportunity records saved/ignored,
every state change lands in `opportunity_activity`, and the feed collects those
outcomes. The scoring engine is still deterministic and rule-based, so there is
no learned model to retrain yet - the honest next step is a scoring service that
reads these outcomes, not a claim that the loop is closed.
---

## How to use this file

1. Do not start priority *n+1* while *n* has an open `[ ]` that blocks it.
2. When a priority ships, tick it here and add the task IDs to
   [`../TASKS.md`](../TASKS.md).
3. Anything in "avoid building too early" needs repeated customer demand plus
   proven retention before it is scheduled.
