# RealReach — Wishlist

Things we know we want, and are **not** doing yet. Written so the decision is
deliberate rather than an omission, and so nothing here is quietly lost.

Read with [`../TASKS.md`](../TASKS.md) (scope) and
[`PRIORITIES.md`](./PRIORITIES.md) (why this order).

**How to use this file.** Each item says why it is parked and what would change
our mind. If an item's trigger is met, it is no longer a wishlist item — it goes
into [`PLAN.md`](../PLAN.md) as a stage.

Legend: **decision** — needs a person to choose · **provider** — needs a vendor
or data source · **volume** — needs real usage before it can be tuned ·
**later** — deliberately deferred and not yet worth it.

---

## 1. Decisions we owe

These are not engineering tasks. Nothing can be built until someone decides.

| # | Decision | Blocks | Why it is not ours to make |
| --- | --- | --- | --- |
| D1 | **Address / letterbox data source** | houses vs units, per-type pricing, the price in the hero | A provider and a per-country licensing decision. Milan public registry and OSM are both options; neither is chosen. |
| D2 | **Payments** — card, invoice, or both | invoices, checkout, the client's "Pay" action | Needs a provider account and a decision on who bears chargebacks. |
| D3 | **GPS retention and who may view it** | production launch, operator trust | Legally owed. We store route points and never expose another operator's location, but retention is not implemented and should not be guessed. |
| D4 | **Does the client see live tracking, or only after completion?** | live polling on the tracking map | Live tracking implies an expectation of support at 9pm on a Sunday. Someone has to own that promise. |
| D5 | **What counts as a completed area?** | coverage thresholds, "campaign complete" | A coverage percentage that says "done" is a commitment to a customer. |
| D6 | **Which first customers, and are they paying?** | everything about priority | The brief is explicit: validation is someone paying, not someone saying it is interesting. |

## 2. Waiting on a provider

| Item | Blocked by | Note |
| --- | --- | --- |
| Natural-language ICP ("type a sentence, get filters") | an LLM key | The `runStructuredAI` foundation is built and tested with a fake provider. It refuses rather than faking output when no key is configured. |
| Research agent (Task 12) | an LLM key | Contract and evidence rules are written; the prompt is the remaining work. |
| Qualification agent (Task 13) | an LLM key | The deterministic `score_v1` already produces the output shape; the model would only narrate it. |
| Email sending, bounces, unsubscribes | an email provider | Approval gate and the DB constraint are already in place, so nothing goes out unapproved. |
| Satellite map tiles | a tile provider or a paid plan | Current tiles are keyless Esri/OSM. |

## 3. Wrong on the site today

Not wishlist — **known problems we have not been asked to fix.** Raised so they
are not forgotten.

| Item | Problem | Needs |
| --- | --- | --- |
| "Trusted by" logo strip | Engel & Völkers, Tecnocasa, Sotheby's, Century 21 and others are real third-party brands presented as customers. | A decision. Flagged twice; the user chose to leave them. |
| Testimonial band | "Real feedback from businesses using Realreach every week", quoted to "Sodia Print — Torino". We have no such customer. | A decision. A fabricated quote is a stronger claim than a logo strip. |

## 4. Waiting on volume

Tuning that cannot be done honestly without real runs.

- **Scoring learned from outcomes** (Priority 8). The outcomes are captured —
  saved, ignored, verdicts, human decisions — but there is not enough of them to
  fit anything. The honest next step is a scoring service that reads the ledger,
  not a claim that the loop is closed.
- **Automatic distributor matching.** Two operators is not a matching problem.
- **Route-quality scoring across campaigns.**
- **Response and ROI analytics.** Needs a QR or tracking layer that does not
  exist yet.

## 5. Deliberately later

Priced against risk, not ambition. Each is a way to spend a month.

- Card payments checkout polish, invoices PDF export
- Feature flags, job-retry tooling, support tickets (Priority 6 remainder)
- Automatic distributor matching, response analytics (Priority 7/10)
- CRM integrations and an agency API (Priority 9) — explicitly gated on
  retention proving demand
- 3D hero (Three.js paper plane). It is the most impressive thing we could
  build next and the least useful: nothing about it makes a campaign verifiable.
  It goes last, and only if the first-run loop is already smooth.

## 6. Known limits, not wishes

Real constraints we have chosen and would defend.

- **A new watch backfills 30 days once**, then reports only what is new. A watch
  that spams history is how a user learns to ignore alerts.
- **Scores are deterministic and versioned.** A model may explain a score, never
  produce one. This costs some flexibility and buys explainability.
- **Letterbox figures are estimates** derived from area size until D1 is decided.
  They are labelled as such everywhere they appear.
- **Monitoring runs on demand or via a scheduler.** There is no background timer
  in the codebase; the job is a pure function plus watermarks, so wiring cron or
  EventBridge is configuration.
- **Operator pairing is a code plus an email**, not a password. Strong enough for
  a field pilot, not a bank-grade identity.
