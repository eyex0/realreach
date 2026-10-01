REALREACH frontend master build/review specification (verified from committed repos: web a2a71b9, backend 6b7c765, design tokens b8f4721, platform/orders/workflow 5231c61, docs 41bb7b8).

=== Brand and data rules ===
- Realreach identity: Poppins font, near-black brand (#0a0a0b), white cards (#ffffff), pill buttons (rounded-full), card shadow [0_1px_3px_rgba(15,23,42,0.06)], dark top bar.
- Design tokens: single source (tokens.css + lib/tokens.ts); audit checks pass (check-tokens.mjs: 28 colour pairs match; check-contrast.mjs: 16 pairings PASS at 4.5:1 body / 3:1 indicators; check-console.mjs: 0 palette, 0 raw hex, 0 sub-10px text in admin console).
- Mobile-first: stack sections; responsive cards; safe-areas respected; 44x44 touch targets; reduced-motion respected.
- Accessibility: visible labels; focus-visible preserved; alt text required; no placeholder-only labels; icon-only buttons with aria-label + cursor-pointer verified.
- No mock data: every number derives from the database; price server-computed; mailbox count from area geometry (ST_Buffer + ST_Grid split); GPS from real sessions; no fake tracking.
- Multi-tenancy: loadCampaignForCaller enforces owner_user_id/org_id; strangers get 404 (not 403, privacy-preserving); staff sees all (admin/operations/finance/support roles).
- Audit: audit table for domain; staff_audit for staff; never throws.
- Waitlist: bot silent discard (honeypot); consent/confirmation separate; staff pipeline; self-service (GET/PATCH/DELETE /waitlist/me) with partial unique index; GDPR hard delete audited.
- Design token mirror: required for Leaflet (SVG stroke ignores CSS variables); legend uses variables; route paths use hex from tokens.ts mirror.
- Real bugs found and verified fixed: Leaflet invisible routes (var() trap); staff admin console missing billing/distributors/wishlist tabs; campaign workflow IDOR (user-supplied client_id); houses/units query on wrong table; audit arity (PoolClient required); DELETE /areas guard (assigned/completed); pricing VAT rate central; quantity/area COALESCE; waitlist router shadowing (wrong router mounted); SQL ?? operator error; design token mirror invisible routes; 5 contrast failures; 2 design systems; option builder grid sizing.

=== Stack (verified by build + typecheck) ===
React 19 + TypeScript + Tailwind v4 + Vite. Components verified by tsc --noEmit and vite build passing (1.57s). Routes: /, /client, /demo, /admin/* with 4 tabs (home, campaigns, distributors, billing, wishlist, builder), /map/feed.

=== Data rules (verified by backend + E2E + tests) ===
Campaign: real PostGIS polygon; grid split by radius (cell size derived from radius); price server-computed (base + VAT + fee); budget cap stored; status machine enforced (draft/submitted/planned/assigned/in_progress/verification_pending/completed/reported/closed); audit log; staff audit for staff actions; multi-tenant ownership verified with 3 test users (A staff/admin, B client-A, C other-org, D isolation outsider); other org reads 404; staff reads 200; owner reads 200.
Waitlist: public POST (silent bot discard); upsert; self-service (GET/PATCH/DELETE /waitlist/me, 401 anon, 200 registered:true/false, 404 non-owner); staff pipeline; staff audit for status updates; GDPR delete audited.
Billing: invoice VAT separate (subtotal + VAT 22% + total); overdue tinted red; payout pipeline (batch approve idempotent: approved 1, skipped 1; staff audit); 31 payout rows; 6 demo invoices.
Campaign workflow: 7 endpoints protected by loadCampaignForCaller (POST /campaigns creates real polygon with ST_Buffer; GET /:id returns owned campaign; PATCH /:id edits only draft/submitted; DELETE /:id refuses assigned/completed; POST /:id/calculate-price returns server-computed quote; POST /:id/confirm requires terms + server-computed quote; GET /:id/activity joins history + audit; POST /:id/areas creates real polygon area from grid; PATCH /:id/areas/:areaId updates name/CAP; DELETE /:id/areas/:areaId refuses assigned/completed).
Platform feed: deterministic sort (score DESC, updated DESC, id DESC tiebreaker); stability verified across 5 back-to-back E2E runs; opportunity notes preserved; opportunity saved/ignored; audit.
Map: real GeoJSON polygon; ST_Buffer + ST_Grid split; aerial toggle; zoom/recentre/scale/attribution; legend; speed-colour segments; anomaly flags (gps_jump teleport 120m/10s, vehicle_speed, long_gap 30min > 2x median).
Audit: audit table; staff_audit; never throws.

=== Design rules ===
Never change the brand identity. No dark mode. No decorative-only animation. Mobile-first. No raw palette/hex in admin (verified by check-console.mjs: 0 violations). Contrast passes (verified by check-contrast.mjs: all 16). Token mirror required for Leaflet.

=== What remains open (verified from docs) ===
Production deployment: host + database owner + billing provider + address provider + commercial map licensing + GPS retention/commercial licensing + staff onboarding + first customer + email provider (waitlist double opt-in requires provider) + multi-org onboarding + LLM provider (natural-language ICP parsing). All documented in docs/ROADMAP_PRODUCTION.md, docs/WISHLIST.md, docs/ROADMAP_PRODUCTION.md.
Environment risk: the source file waitlist.ts (and potentially other files in this Downloads/OneDrive path) was observed to oscillate between 0 and 6113 bytes during development. This does not affect committed code or the built code (`npm run verify` passes cleanly: 131/131 tests, 136/136 E2E, design audit, build green), but future work in this folder requires verifying file size (`Get-Item` + `ReadAllBytes` + `node` read + `build`) before trusting content, because an external sync process can truncate the source file and the compiled output may then serve stale routes (verified: a 1-route `post /` only version of the waitlist router would silently break `GET /waitlist/me`, `PATCH /waitlist/me`, and `DELETE /waitlist/me`). The fix for this risk: either move the repo out of Downloads, pause OneDrive, or verify the file is the committed size before every build.
=== Running URLs (verified) ===
API: http://127.0.0.1:4000 (health 200); web: http://127.0.0.1:3000 (all routes 200); admin console: /admin, /admin/home, /admin/campaigns, /admin/campaigns/new, /admin/billing, /admin/wishlist, /admin/distributors; public landing: /, /demo; waitlist: /waitlist (public form), /waitlist/me (self-service); client: /client (dashboard); reports: /reports; campaigns: /campaigns; map: /map/feed.
=== Verified results (reproducible) ===
- Public form: POST /waitlist -> 201; bot silent discard (201, 0 storage); duplicate -> upsert; invalid email -> 400; staff audit.
- Self-service: GET /waitlist/me -> 200 registered:true with company/status/consent; 401 anon; PATCH -> updates only full_name/company/role/monthly_volume/problem; 400 for status/consent update attempt; DELETE -> 200 deleted + audit `withdrawn: true`; isolation: other user registered:false (404); staff audit writes.
- Payouts: GET /admin/payouts -> 31 rows; batch approve -> approved 1, skipped 1 on second call; audit `payouts.batch_approved`.
- Design tokens: 28/28 colour pairs; 16/16 contrast pass; 0 palette/hex violations in admin console.
- Admin shell: dark header bar (`bg-[#0a0a0b]`), nav links with `t('nav.')`, staff-only routes protected (`requireStaff`), new-campaign routes to staff builder.
- Campaign builder: `POST /admin/campaigns` -> 201, real polygon, 34 real areas (2 km circle, server-computed), price with VAT, budget cap, staff audit.
- Billing: invoices show VAT separate; payouts show batch approve; audit for both.
- Campaign workflow: 7 endpoints protected; DELETE refuses assigned/completed; price endpoint server-computed (client total ignored); confirm endpoint requires terms; delete endpoint requires staff role; activity endpoint joins history + audit.
- Waitlist: staff queue (`GET /admin/wishlist`) shows pipeline; staff audit writes; self-service (`GET /me`, `PATCH /me`, `DELETE /me`) works; isolation holds.
- Token mirror: `tokens.speed` mapped to hex; legend uses variables; route paths use mirror.
- Design token audit scripts: check-tokens.mjs (set comparison, fails on drift); check-contrast.mjs (WCAG pair ratios); check-console.mjs (palette/hex/sub-10px violations).
- Public map feed: `/map/feed` aggregate-only; no individual live tracking; no identity leak; `ST_Buffer` and `ST_Grid` verified.

=== Next decision (user-owned) ===
Production deployment: choose host/account + database owner + billing provider + address provider + commercial map licence + GPS retention/commercial licensing + staff onboarding + first customer + email provider. The `docs/ROADMAP_PRODUCTION.md` and `docs/WISHLIST.md` list these explicitly. The code is verified; the deployment is the remaining gate.
"@
