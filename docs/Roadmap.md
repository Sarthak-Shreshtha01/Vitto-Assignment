# Roadmap
## Loan Repayment Service — MSME Lending

| | |
|---|---|
| **Project** | Loan Repayment Service (Vitto Full Stack SDE Assignment) |
| **Traces to** | PRD.md v1.0, SRS.md v1.0, Architecture.md v1.0 |
| **Deadline** | Friday, 18 September, 4:00 PM IST |

---

## How to read this

Phases are ordered by **dependency and the brief's own stated priority**: schedule generation → payment allocation → tests → routes → UI → deployment (PRD §10, §13). Each phase lists what it produces, which docs it traces to, and a done-check.

**The deadline is today.** If time runs out, stop at the end of any phase — everything up to and including Phase 5 (core logic + tests) is the part the brief says matters most ("correctness over completeness," PRD §10). Phases 8–9 are the extension (deployment) the PRD adds on top of the brief's baseline; Phase 10 is optional differentiators only — skip without guilt (PRD §14).

Work through phases sequentially and check in after each one before moving to the next, same as the setup phase.

---

## Phase 0 — Project Setup ✅ Done

- Next.js (App Router, TypeScript) scaffolded at repo root
- Dependencies installed: Prisma 6.19.3 (pinned — avoided an 8.0 RC with a breaking config change), Firebase + Firebase Admin SDK, Vitest
- `prisma/schema.prisma` written and validated (loans, instalments, payments, payment_allocations — integer paise, FK + unique constraints)
- `docker-compose.yml`, `.env.example`, `vitest.config.mts`
- Git repo initialized, first commit made

---

## Phase 1 — Database Provisioning ✅ Done

**Goal:** a real, reachable Postgres instance with the schema applied — nothing after this phase can be tested without it.

- [x] Create a Supabase project (free tier)
- [x] Add the connection strings to `.env` as `DATABASE_URL` (pooled) and `DIRECT_URL` (direct, for migrations)
- [x] Run `npm run db:migrate` to create the initial migration and apply it
- [x] Confirm tables exist (`loans`, `instalments`, `payments`, `payment_allocations`) via `prisma migrate status`

**Traces to:** PRD §9 (schema via script, never manual), SRS §2.4, §3.7

---

## Phase 2 — Core Business Logic (pure functions) ✅ Done

**Goal:** the three services the Architecture doc calls "the single biggest architectural decision" — no DB, no HTTP, so they're directly unit-testable and directly explainable in the interview.

- [x] `lib/money.ts` — rupee ↔ paise conversion (API-boundary only)
- [x] `lib/services/scheduleService.ts` — `generateSchedule()`: EMI formula, month-by-month rows, final-instalment remainder absorption, date rollover/clamping
- [x] `lib/services/allocationService.ts` — `allocate()`: oldest-instalment-first cascade, underpayment, overpayment cascade, excess-tracking
- [x] `lib/services/positionService.ts` — `derivePosition()`: outstanding principal, next due, overdue amount, all derived (never stored)
- [x] `lib/errors.ts` — standard error shape + typed constructors

**Traces to:** PRD §7–§8, SRS §3.1/§3.3/§7, Architecture §4.3

---

## Phase 3 — Unit Tests for Core Logic

**Goal:** lock in correctness on the pure functions before anything touches a database — matches the brief's explicit priority order.

- [ ] EMI formula matches the reference case (₹2,00,000 @ 18% / 24mo ≈ ₹9,986)
- [ ] Final-instalment rounding drift absorption (`Σ principalComponent == principal` exactly)
- [ ] Underpayment case (partial amount tracked against the right instalment)
- [ ] Overpayment case (cascades to next instalment, doesn't reduce principal early)
- [ ] Payment exceeding total outstanding (excess recorded, not applied)
- [ ] Invalid input rejected before reaching allocation logic

**Traces to:** PRD §8 edge cases, SRS §3.6, §7; FR-6

---

## Phase 4 — Data Access Layer

**Goal:** wrap all DB reads/writes with transaction boundaries and duplicate detection, per the Architecture doc's repository layer.

- [ ] `lib/db.ts` — Prisma client singleton (dev hot-reload safe)
- [ ] `lib/repository/loanRepository.ts`:
  - `createLoanWithSchedule()` — loan + instalments in one transaction
  - `findLoanWithScheduleAndPayments()`
  - `findExistingPayment(loanId, amount, date)` — duplicate lookup
  - `savePaymentWithAllocations()` — payment + instalment updates + allocation rows in one transaction, catching the unique-constraint violation as "replay" rather than a raw error

**Traces to:** PRD §14 (transactions, DB-level duplicate prevention), Architecture §4.4

---

## Phase 5 — API Routes + Auth

**Goal:** the four endpoints, all behind server-verified Firebase auth, all using the one error shape.

- [ ] `lib/auth/verifyToken.ts` — `requireAuth()` using Firebase Admin `verifyIdToken`
- [ ] `POST /api/loans` — create loan + schedule
- [ ] `GET /api/loans/:id` — schedule + derived position
- [ ] `POST /api/loans/:id/payments` — record payment, handle duplicate replay
- [ ] `GET /api/loans` — list (extension, backs the UI's loan picker)
- [ ] Firebase project created; client config + admin credentials in `.env`

**Traces to:** PRD FR-1–FR-4, SRS §3.1–§3.4, §5.1, Architecture §4.1–§4.2

---

## Phase 6 — Integration Tests

**Goal:** exercise the route handlers against a real test database — not mocks.

- [ ] `POST /api/loans` success path
- [ ] One failure path (e.g. `GET /api/loans/:id` unknown id → 404)
- [ ] Unauthenticated request → 401 without a valid token
- [ ] Test data isolation (each test creates/cleans its own rows, or DB reset between runs)

**Traces to:** PRD FR-6, SRS §3.6, §10; total suite should land at ~8–12 tests across Phases 3 + 6

---

## Phase 7 — UI (single page)

**Goal:** the minimum page that lets a reviewer sign in, see a schedule, and record a payment without a manual refresh.

- [ ] `AuthGate` — redirect unauthenticated visitors to sign-in; sign-out action
- [ ] Firebase client SDK sign-in (email/password or Google)
- [ ] `LoanPicker` — backed by `GET /api/loans`
- [ ] `ScheduleTable` — due date, principal, interest, total due, amount paid, status
- [ ] `PositionCard` — outstanding principal, next due, overdue amount (visually distinct if > 0)
- [ ] `PaymentForm` — amount + date, updates displayed state from the response, no reload

**Traces to:** PRD FR-5, SRS §3.5, Architecture §4.5

---

## Phase 8 — Seed Script

**Goal:** the deployed link must be explorable immediately, without calling the create-loan endpoint first.

- [ ] `prisma/seed.ts` — 1–2 demo loans in different states (on-track, overdue, partially paid), clearly fake data
- [ ] Runs against both local and hosted DB via the same script

**Traces to:** PRD §11, §14; NFR "safe demo data"

---

## Phase 9 — Deployment

**Goal:** a publicly reachable instance in the same working state as the repo.

- [ ] Deploy to Vercel; connect to the Neon/Supabase project (same one or a prod-equivalent)
- [ ] Set env vars via Vercel dashboard (never committed)
- [ ] Add deployed domain to Firebase authorized domains
- [ ] Run migration + seed script against the hosted DB (no manual schema edits)
- [ ] Verify: sign in, view seeded loan, record a payment, see it reflected — live

**Traces to:** PRD FR-7, §11, §12; SRS §3.7; Architecture §11

---

## Phase 10 — README + Submission Polish

**Goal:** the one-page README a reviewer needs to run everything cold, plus the final packaging.

- [ ] Setup steps (fresh clone → install → env → DB setup → dev → test → sign-in → use)
- [ ] Database used, test command, endpoint reference
- [ ] Money type chosen (integer paise) and why
- [ ] Allocation order + overpayment/late/duplicate decisions (SRS §7), stated plainly
- [ ] Verify against an actual fresh clone before submitting
- [ ] Submission email to `sourav.shukla@vitto.money` — repo access, env values, test account, live link

**Traces to:** PRD §11, §12, §13

---

## Phase 11 — Differentiators (optional, cut first if short on time)

Only pull from this list once Phases 1–10 are solid (PRD §14):

- [ ] `GET /health`
- [ ] Invariant-style tests ("allocated amounts never exceed amount paid", "outstanding principal never negative")
- [ ] Append-only payment ledger (or documented as a design decision, even if not built)
- [ ] Optimistic concurrency (`version` column on loans)
- [ ] OpenAPI/Swagger description
- [ ] GitHub Actions CI running the test suite

**Deliberately not building:** user roles, multi-currency, prepayment/foreclosure, penalty interest (PRD §4, §14).
