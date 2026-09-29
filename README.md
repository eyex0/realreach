# Realreach web app

React + Vite + Tailwind CSS + Clerk SPA for the Realreach platform: public
marketing site, client portal, and the operations console used to review
proofs and run payouts.

## Stack

- Vite + React 18 + TypeScript, Tailwind CSS, motion, Leaflet
- Clerk (`@clerk/clerk-react`) for client/operator sign-in
- Talks to the [realreach-backend](https://github.com/eyex0/realreach-backend)
  Express API (default `http://127.0.0.1:4000`)

## Setup

```bash
npm install
cp .env.example .env      # then paste your Clerk publishable key
```

| Var | Required | Purpose |
| --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | yes | Clerk publishable key (`pk_test_…`) |
| `VITE_API_URL` | no | API base, defaults to `http://127.0.0.1:4000` |

## Run

```bash
npm run dev                # vite on http://127.0.0.1:3000
```

> **Windows note:** `npm` scripts fail if the checkout path contains `&`
> (this folder's name does). Use the direct invocation instead:
>
> ```bash
> node node_modules/vite/bin/vite.js --port=3000 --host=127.0.0.1
> ```

Type-check / build:

```bash
npm run lint               # tsc --noEmit   (or: node node_modules/typescript/bin/tsc --noEmit)
npm run build              # vite build     (or: node node_modules/vite/bin/vite.js build)
```

## Routes

Public pages: `/`, `/how-it-works`, `/features`, `/gps-tracking`,
`/for-distributors`, `/faq`, `/about`, `/blog`, `/contact`, `/legal/*`,
`/signin/*`, `/signup/*`.

Auth required (Clerk `SignedIn`, otherwise redirected to sign-in):

| Route | Purpose |
| --- | --- |
| `/dashboard` | client dashboard |
| `/planner` | campaign planning |
| `/missions` | mission list |
| `/campaigns/new` | campaign builder |
| `/print` | print store |
| `/distribution-portal` | client distribution portal |
| `/ops` | **operations console** (proof review, statuses, payouts) |
| `/reports` | campaign reports |

## Auth flow

1. User signs in through Clerk (`/signin` or `/signup`).
2. The SPA attaches the Clerk session token as
   `Authorization: Bearer <token>` on every API call (`src/lib/api.ts`).
3. The backend verifies the token (`AUTH_MODE=required`) and maps the email
   to a local `users` row (`POST /auth/sync` provisions it on first login).
4. Role gates: only `client`/`admin` tokens may create campaigns, assign
   tasks, review proofs, or touch payouts; walkers get 403 there.

In `AUTH_MODE=optional` (local dev) the API also accepts body actor ids.

## Operations console (`/ops`)

Campaign picker → task grid per status → expandable proof detail with photo,
GPS route stats, machine verification verdict, and the human decision
(approve/reject — the machine verdict is never overwritten). Payout actions
(generate → approve → pay) live in the same page.

## Related repositories

- [realreach-backend](https://github.com/eyex0/realreach-backend) — Express + PostGIS API
- [realreach-operator](https://github.com/eyex0/realreach-operator) — Expo field-operator app
- Implementation plan: [`PLAN.md`](./PLAN.md) in this repo
