# Production Roadmap

The path from where the code is today to something we would put in front of a
paying client. Ordered by dependency, not by enthusiasm.

**What is production, here.** Not "it looks finished". A section is production
ready when all of these are true:

1. It works for a **real customer** on a **real campaign**, not seeded data.
2. A human can break it and recover, and we would know if they had.
3. Every number on screen is **traceable to a record**, and anything estimated
   says so.
4. It is **enforced server-side** — permissions, ownership, money.
5. It has **loading, empty, error and success states**, and a mobile layout.
6. It is **covered by tests** at the level where a bug would hurt.
7. The decisions behind it are **written down**, not held in someone's head.

---

## 1. Where we actually are

| Product | State | Honest summary |
| --- | --- | --- |
| **Field ops** (flyer distribution) | near production | Full loop verified on a real phone: GPS, photo proof, verification, payouts. Missing: hosting, backups, monitoring. |
| **Platform** (B2B discovery) | foundation | Data model, scoring, outreach, monitoring, trust scores. Missing: LLM, connectors, payments, the LLM-dependent parts of first run. |
| **Admin console** | skeleton | Auth, roles, schema, API, Home, real map. Missing: Campaigns, builder, live-map modal, Distributors, Billing. |

Three repositories, 131 unit tests, 136 E2E checks, CI green on all of them.

---

## 2. Critical path

The launch is gated by things that are **decisions or providers**, not code:

```
   ┌─ Address/letterbox data source ──┐
   │                                    ├─▶ Houses vs units ─▶ Pricing ─▶ Invoicing
   ├─ Payment provider ────────────────┤                        │
   │                                    └─▶ Card + invoice flow  │
   └─ GPS retention decision (legal) ──▶ Production launch of tracking

   LLM provider ─▶ Research + Qualification agents (does NOT block launch)
   Address source ─▶ DOES block: it is the product promise (per-house reach)
```

**The one that matters most:** without an address source, "verified reach" is a
density estimate. We can launch on that *if we say so*, and the plan below
assumes we do. If we can get real address data, the product is materially
stronger and the pricing is defensible.

---

## 3. Phases

Each phase has an exit gate. Do not start the next phase while the gate is open.

### P0 — Make it deployable *(blocks everything)*
Nobody uses what is not hosted.

- [ ] Choose host, database, secrets store. **Decision needed.**
- [ ] Migrations run as a deploy step, never at boot. *(runbook written; needs a
      target)*
- [ ] `AUTH_MODE=required` in every non-local environment, verified by
      `tools/test-e2e-required.ps1` against the deployed host.
- [ ] Backups scheduled **and a restore rehearsed** — an untested backup is a
      rumour.
- [ ] Uptime check on `/health`, plus alerting on it.
- [ ] CI gates the deploy, and the deploy is one command.

**Gate:** a real campaign runs on the deployed stack end to end.

### P1 — Admin console sections *(the team cannot work without these)*
Backend for all of it exists and is role-gated; these are the pages.

- [ ] **Campaigns list** — filter tabs, search by client/campaign/district,
      expandable rows with the areas sub-table, bulk assign, CSV export.
- [ ] **Campaign builder** — 3 steps, map tools, area cards, targeting choice,
      material surcharges, quantity slider, the 30 km "Area too large!" rule.
- [ ] **Live map + proof of delivery modal** — the map that already exists,
      scoped to one area, with a printed PDF.
- [ ] **Distributors** — list, profile (history, payouts, documents,
      verification), assignment by drag or proximity.
- [ ] **Billing** — invoices with PDF, overdue, mark paid; payout batches.
- [ ] Every mutation writes `staff_audit` and the UI confirms it.

**Gate:** an operations person can run a whole campaign from the console without
touching the database or asking an engineer.

### P2 — Data trust on the console
The console makes claims. They have to be defensible.

- [ ] Letterbox figures visibly labelled as estimates everywhere they appear.
- [ ] Confidence and freshness on every verification the console shows.
- [ ] Speed anomalies on the console map, with a one-click "report issue" that
      creates the issue — the loop from signal to ticket to resolution.
- [ ] Every staff action attributable: who, when, before and after.

**Gate:** a client disputes a number and we can show exactly where it came from.

### P3 — Payments *(blocked on provider)*
- [ ] Stripe checkout for campaign fees, customer portal, webhooks.
- [ ] Invoice lifecycle: draft → sent → paid/overdue, with a real PDF.
- [ ] Credit ledger and per-action metering, matching the price table.
- [ ] Card details never touch our database.

**Gate:** a client pays a real invoice and the ledger balances.

### P4 — Real address data *(blocked on decision)*
- [ ] Provider evaluated: coverage, licence, cost for Milan, update cadence.
- [ ] Point-in-polygon count, houses vs units, cached per polygon with a
      version stamp so a price can be reproduced months later.
- [ ] Fallback: keep the density estimate, label it, and document the gap.

**Gate:** a drawn area returns an address count you can defend to the client.

### P5 — The AI layer *(not launch-blocking)*
- [ ] `runStructuredAI` wired to real providers (foundation is built and
      tested with a fake provider).
- [ ] Research agent, qualification agent, outreach drafting — all behind the
      guardrails that already exist.
- [ ] Token and cost per run, budget ceiling, Langfuse tracing.
- [ ] Evaluation set so a prompt change cannot silently degrade a claim.

**Gate:** every AI sentence carries a citation, and an unsupported one is
blocked — which is already how the deterministic drafter behaves.

### P6 — Compliance and privacy *(blocks launch if skipped)*
- [ ] GPS retention implemented, per the legal decision — not per our guess.
- [ ] DSAR: export and delete for an operator and a client contact.
- [ ] Data-processing records, sub-processor list, privacy notice and terms
      reviewed by a lawyer.
- [ ] Audit log retention and access control.

**Gate:** we can answer "delete this person's data" completely and on time.

### P7 — Hardening
- [ ] Load test the paths a real campaign hits (evidence upload, GPS ingest).
- [ ] Index review against real query plans, not guesses.
- [ ] Secure headers, CSRF review, secret rotation.
- [ ] Offline behaviour tested on a real phone with a real dead zone.
- [ ] Error monitoring with real alerts, not a dashboard nobody reads.

**Gate:** a full campaign survives a bad network and a busy Monday.

---

## 4. Roles, and who owns what

| Area | Owner | Why it matters |
| --- | --- | --- |
| Host, database, backups | unassigned | Unowned infrastructure is the most common way a launch dies quietly. |
| Address data decision | founder | Licence and cost, and it changes the product promise. |
| Payments account | founder | Business details, tax, legal entity. |
| GPS retention | founder + legal | Exposure, and it cannot be un-said to operators. |
| Pricing | founder | It is a promise to a client. |
| Ops runbook | operations | Who does what when a campaign goes wrong. |

---

## 5. What "every section" means, concretely

| Section | Done when |
| --- | --- |
| Landing | Honest claims, real proof, no invented logos or testimonials, fast on mobile. **The testimonial is still outstanding.** |
| Client dashboard | Real invoices, real reach, filters, empty state that teaches. |
| Campaign builder | A client can draw, price and book without a phone call. |
| Live map + proof | An operator's route, coloured by pace, printable. |
| Distributors | Assign, verify, pay, and see their own quality. |
| Billing | Invoice issued, paid, and reconciled against payouts. |
| Opportunity feed | Score, evidence, next action, and a dismissal that teaches. |
| Outreach | Evidence-only, approved by a human, and sent through a provider. |
| Monitoring | Something changed → someone is told → they act. |
| Field app | Already verified on a phone. Needs hosting and real campaigns. |
| Admin | Staff-only, every action audited, no way to widen access. |

---

## 6. Risks that would actually stop a launch

1. **A verification is challenged and we cannot explain it.** Highest risk.
   Mitigation: P2, and the audit trail from day one.
2. **The tracker exposed personal location carelessly.** Unrecoverable in the
   market. Mitigation: P6, and least-privilege access now.
3. **Priced on a guess.** A client notices. Mitigation: P4, or label it as an
   estimate everywhere.
4. **No one owns backups.** Mitigation: P0, rehearsed restore.
5. **We build for months and nobody pays.** The real one. The plan above is
   sequenced so P0–P2 are useful to a paying client *before* P3–P5.

---

## 7. Sequencing, honestly

- **Can be worked in parallel:** admin sections (P1), trust work (P2), AI (P5).
- **Strictly ordered:** P0 → P1 → P3, and P0 → P4.
- **Do not start yet:** CRM integrations, agency API, native app, automatic
  distributor matching. All gated on retention proving demand.
- **The 3D hero** is last, and only if the first-run loop is already smooth. It
  is the most impressive thing available and the least useful.

---

## 8. What I would do on Monday

1. Fill in the six decisions in [`WISHLIST.md`](./WISHLIST.md) §1. They unblock
   P0, P3, P4 and P6, and four of them are an hour of conversation, not
   engineering.
2. Pick a host and run P0. Everything else is easier on a deployed stack.
3. Build the Campaigns list (P1). It is the screen the team lives in, and the
   backend for it already exists and is role-gated.

The rest of this plan is sequencing, not discovery. The uncertain parts are
flagged above, and they are decisions and providers rather than code.
