# RealReach — Client Product Specification

Source: observed in the RealRun reference demo (`Realrun Demo Tutorial 2026_720p.mp4`)
plus the master brief. This file is the contract for the **client-facing**
product. What exists today is recorded honestly in the status table.

## 1. The loop we sell

```
Client defines an area
  → platform calculates eligible letterboxes and a price
  → material, quantity, pickup and billing are confirmed
  → operations assigns a distributor
  → distributor collects and walks the route with Live Track running
  → GPS, time, location and photo are verified per drop
  → coverage and cost per verified reach are reported
```

## 2. Screens

### 2.1 Client dashboard
Active campaigns with a map thumbnail · recent invoices with status, due date,
amount and a pay action · recent activity feed · empty-state CTA · time
filters (1 / 3 / 12 months) · navigation Home / Activity / Billing.
**Currency is EUR and selectable — never hard-coded.**

### 2.2 Campaign wizard (three steps)

**Step 1 — create delivery areas.** Map editor with address/suburb search,
pointer select, polygon draw, eraser, suburb selector, map/satellite toggle,
editable area name, live address count, **houses vs units** breakdown, area in
km², and a live price estimate. Validation must **warn and explain** when an area
exceeds the configured distance limit, and must not silently truncate it.

**Step 2 — campaign details.** Name · material type · quantity · collection date
· pickup address · distributor notes · optional deadline and objective.
Material surcharges are configurable per type: Standard DL, A5, Folded, Envelope,
Magnet, Booklet, Double-up, Magazine.

**Step 3 — invoice and order summary.** Billing name, agent, campaign, material,
quantity, dates, every area with its counts, the price breakdown, terms
acceptance, then pay by card or request an invoice.

### 2.3 Activity and campaign management
Campaign table: name, status (draft / active / completed / cancelled / issue
reported), run progress (`12/12`), quantity, material, pickup address and date,
created, assigned distributor, actions (view, track, report issue, invoice).
Campaign detail: every area with suburb, progress, address count, distributor,
status, timestamps and a tracking map.

### 2.4 Verification and tracking
Area polygon · GPS breadcrumb · street-level map · historical or live mode ·
satellite toggle · coverage per area · **route segments coloured by walking
speed** · legend · refresh interval (~60 s) · ability to inspect whether both
sides of a street were covered. The verification panel summarises distributor,
area, start, last update, distance, coverage, addresses, **speed anomalies** and
proof status.

## 3. Status against the code

| Screen / capability | Status | Where |
| --- | --- | --- |
| Campaign wizard, 3 steps, draw + price | `[x]` | `CampaignBuilderPage`, `POST /campaigns/estimate` |
| Polygon splitting into areas | `[x]` | `POST /campaigns/:id/split` (PostGIS) |
| Distributor assignment | `[x]` | `POST /tasks/:id/assign` |
| Field app: accept, GPS, photo, proof, offline | `[x]` | `realreach-operator`, verified on a phone |
| Machine verification (GPS/time/location/photo) | `[x]` | `src/lib/verify.ts` |
| Confidence + freshness per proof | `[x]` | `src/lib/trust.ts` (`trust_v1`) |
| Human review, verdict never overwritten | `[x]` | `POST /proofs/:id/review` |
| **Route coloured by walking speed** | `[x]` | `src/lib/routeSpeed.ts`, `CampaignReportPage` |
| **Speed anomalies flagged** | `[x]` | `vehicle_speed`, `gps_jump`, `long_gap` |
| **Client-facing campaign report** | `[x]` | `/campaigns/:id/report` |
| Payouts, €0.04/piece, immutable once paid | `[x]` | `/payouts/*` |
| Houses vs units counts and per-type pricing | `[ ]` | **needs an address data source** — see unknowns |
| Material surcharge rate card | `[~]` | material exists, surcharge table does not |
| Live tracking map, satellite toggle | `[~]` | recorded route renders; satellite and live polling do not |
| Client home with invoices and time filters | `[ ]` | no client dashboard exists |
| Card payment / invoice request | `[ ]` | no billing integration |
| Distance-limit validation | `[~]` | estimate works, the rule is not configurable |
| EUR currency selection | `[~]` | EUR everywhere; not selectable |

## 4. Known differences from the reference

Stated plainly, because the reference is a competitor and pretending otherwise
would be dishonest:

- **We do not use Google Maps.** The brief forbids depending on it; we run
  keyless Esri with an OpenStreetMap fallback.
- **Our verification is stronger.** The reference shows a route polyline and a
  per-suburb status. We verify **each drop** against GPS, time, location and
  photo, and score it. We should not position as a copy of them.
- **We have no address database yet**, so houses vs units cannot be counted
  honestly. It is shown as omitted rather than estimated into existence.
- **We do not block oversized areas**, we show the measured distance. A hard
  refusal with no alternative is a worse product.

## 5. The ten unknowns, with the position we have taken

The brief asks for these to be resolved before development. Where a decision
needs the founder it is marked **needs you**; everything else is a decision we
have made and can defend.

| # | Unknown | Position |
| --- | --- | --- |
| 1 | Letterbox/address data source | **Needs you.** Nothing to count houses or units without a provider. Milan public registry and OSM are options; both are per-country. |
| 2 | First geographies | Milan, Italy. Matches the seed and every verified run to date. |
| 3 | Price formula | Flat €0.12 per letterbox, 220 m² per letterbox, both labelled placeholders in `pricing.ts`. Houses/units pricing waits on #1. |
| 4 | Distributor app: native, web or both | Expo, verified on a real phone. One codebase, both platforms. |
| 5 | Proof standard | GPS + time + location + photo, all required checks. Verified on a real walk; a human decides the edge cases. |
| 6 | Tracking privacy and retention | **Needs legal input before production.** We store route points and never expose another operator's location. Retention is not yet implemented. |
| 7 | What counts as complete | Not defined. Current proxy: machine verdict `verified` plus human review. A coverage-percentage threshold is a decision with a customer attached. |
| 8 | Payments | **Needs you.** Nothing is charged today; payouts are a ledger. Card and invoice both need a provider. |
| 9 | Issue resolution ownership | Undecided. A bad-data report exists and ops resolves it; who arbitrates a failed verification does not. |
| 10 | Metrics that matter to clients | Delivered quantity, coverage and cost per verified reach. Response and ROI need a tracking or QR layer we do not have. |

## 6. Roadmap position

**Built and verified** — the vertical loop from §1, end to end, on a real phone.

**Next, in order**
1. Client dashboard: campaigns, invoices, activity, time filters.
2. Address data source, then houses vs units and the surcharge rate card.
3. Satellite view and live polling on the tracking map.
4. Payments, once a provider is chosen.
5. Distance-limit rule, configurable per city.

**Not started** — automatic distributor matching, route-quality scoring across
campaigns, response and ROI analytics, agency API.

Every item above is a decision, a provider, or a data source. None of them is a
reason to stop: the loop that proves the business works end to end already runs.
