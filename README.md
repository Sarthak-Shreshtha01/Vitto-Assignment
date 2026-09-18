# Loan Repayment Service

A backend + single-page UI for MSME lending operations: generates an EMI repayment schedule for a loan, records payments against it, and reports a loan's current position (outstanding principal, next due, overdue amount) at any time. Built for the Vitto Full Stack SDE take-home assignment.

**Live demo:** https://vitto-assignment-chi.vercel.app
**Test account:** `vitto.reviewer@example.com` / `ReviewerPass123!`

The deployed instance is seeded with several demo loans in different states (on-track, overdue, overpaid, fully paid) so it's explorable immediately — no need to create a loan first.

## Project docs

Full architectural detail — layering, folder structure, sequence diagrams, database ERD, and the ADR summary of every key design decision — is in [`docs/Architecture.md`](./docs/Architecture.md).

## Tech stack

- **Next.js 16** (App Router, TypeScript) — single deployable serving both the API and the UI
- **PostgreSQL** via **Prisma** (hosted on **Supabase**)
- **Firebase Authentication** (email/password) — client SDK for sign-in, Admin SDK for server-side token verification
- **Vitest** for unit + integration tests
- Plain CSS (no component library), styled against a small brand-derived design system

## Architecture, in one paragraph

A single Next.js app. A **Proxy** (`proxy.ts`) verifies the Firebase ID token once, up front, for every `/api/*` request. Route handlers are one-liners that delegate to **controllers** (`lib/controllers/`), which own request orchestration (auth, validation, calling services/repository, shaping the response). Business logic — EMI schedule generation, payment allocation, position derivation — lives in **pure functions** (`lib/services/`) with no DB or HTTP dependency, which is what makes them directly unit-testable and easy to reason about. A **repository layer** (`lib/repository/`) owns all DB access and transaction boundaries. Money is always an integer **paise** `bigint`, end to end — never a float. Full detail and diagrams in [`docs/Architecture.md`](./docs/Architecture.md).

## Setup (fresh clone)

```bash
git clone <this-repo>
cd loan-repayment-service
npm install
```

1. **Environment variables** — copy `.env.example` to `.env` and fill in real values (a hosted Postgres connection string and a Firebase project's client + admin credentials). See "Environment variables" below for what each one is.

2. **Database schema** — apply the migrations to your Postgres instance:
   ```bash
   npm run db:migrate
   ```
   (This also runs automatically via `npm run db:deploy` in a deploy pipeline — never hand-edit the schema.)

3. **Seed demo data** (optional but recommended) — creates several demo loans in different states:
   ```bash
   npm run db:seed
   ```
   This is idempotent: it clears and reseeds every loan in the database, so it's safe to run more than once, but don't point it at a database with real data you want to keep.

4. **Run it:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`, sign in (create an account via the sign-up toggle on the sign-in screen, or use Firebase's console to add one), and use the app.

5. **Run the tests:**
   ```bash
   npm test
   ```
   Runs the full suite (unit + integration) in one command. Integration tests hit the real database configured in `.env`.

## Environment variables

See [`.env.example`](./.env.example) for the full list with comments. Summary:

| Variable | What it's for |
|---|---|
| `DATABASE_URL` | Pooled Postgres connection string, used by the app at runtime |
| `DIRECT_URL` | Direct (non-pooled) Postgres connection, used only by Prisma Migrate |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client SDK config (safe to expose to the browser) |
| `FIREBASE_ADMIN_*` | Firebase Admin SDK credentials (server-side token verification only — never expose these) |

## API reference

All endpoints require `Authorization: Bearer <Firebase ID token>` and return `401 UNAUTHORIZED` without one. Every error response has the shape `{ "error": { "code": "...", "message": "..." } }`.

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/loans` | Create a loan; generates and persists its full EMI schedule |
| `GET` | `/api/loans` | List all loans (backs the UI's loan picker) |
| `GET` | `/api/loans/:id` | Get a loan's schedule plus its current position, derived live |
| `POST` | `/api/loans/:id/payments` | Record a payment; allocates it across the outstanding schedule |
| `GET` | `/api/health` | Unauthenticated DB-connectivity check |

Full request/response shapes and every validation rule are in [`docs/Architecture.md`](./docs/Architecture.md).

## Money representation

All currency is stored as **integer paise** (`BigInt` columns in Postgres, `bigint` in TypeScript) — never a floating-point type, anywhere in the codebase. Conversion to/from rupees happens only at the API request/response boundary (`lib/money.ts`). This eliminates an entire class of floating-point rounding bugs by construction rather than by discipline.

## Business rule decisions

The brief leaves several decisions to the implementer's judgment. Here's what was chosen and why (full detail in `docs/Architecture.md`):

- **Allocation order:** a payment is applied oldest-unpaid-instalment-first, fully settling one before moving to the next. Matches how most lenders report days-past-due, and keeps the overdue calculation simple and defensible.
- **Overpayment:** the excess beyond the current instalment cascades forward to the next unpaid instalment(s) — it does **not** reduce principal early, since that would be a prepayment (explicitly out of scope). If a payment exceeds the entire remaining balance, the leftover is simply not applied anywhere (no negative balances, no credit account).
- **Late payment / overdue:** an instalment is overdue if `today > due_date AND amount_paid < total_due`, evaluated fresh on every read (never stored, so it can't drift out of sync). Being paid late isn't separately penalized (no penalty interest — out of scope), but the schedule's due date vs. the payment's actual date remains visible in the data.
- **Duplicate submission:** a payment is identified by `(loan_id, amount, date)`. A resubmission of the same triple is treated as a replay — no new row, no new allocation, the original result is returned with `duplicate: true`. This is enforced by a **database unique constraint**, not just an application check, so it holds even under concurrent/racing requests.
- **Rounding:** all money math uses integer paise; the **final instalment of a schedule absorbs all cumulative rounding drift**, so the sum of principal components always equals the original principal exactly.
- **Outstanding principal:** since a payment isn't re-split into interest/principal at allocation time, an instalment's principal only stops counting as "outstanding" once the instalment receives its *first* payment (partial or full) — see the comment in `lib/services/positionService.ts`.

## Testing

`npm test` runs the full suite from a single command. It includes:

- **Unit tests** for the pure schedule/allocation/position logic and input validation — including the specific edge cases from the brief (underpayment, overpayment cascade, duplicate no-op, invalid input) and a couple of invariant-style tests ("allocated amounts never exceed the payment amount", "outstanding principal never goes negative") that hold across a whole sequence of payments, not just one example.
- **Integration tests** against the real database (not mocks) — a create-loan success path, an unknown-loan 404, an unauthenticated-request 401, and a regression test for a real bug found during deployment (a payment cascading across many instalments used to time out).

## Deployment

Deployed on Vercel, backed by the same Supabase Postgres project used locally, and the same Firebase project (with the deployed domain added to Firebase's authorized domains list). The schema and seed data are applied via the same scripts documented above — no manual production changes.
