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

## Phase 3 — Unit Tests for Core Logic ✅ Done

**Goal:** lock in correctness on the pure functions before anything touches a database — matches the brief's explicit priority order.

- [x] EMI formula matches the reference case (₹2,00,000 @ 18% / 24mo ≈ ₹9,986) — `tests/unit/scheduleService.test.ts`
- [x] Final-instalment rounding drift absorption (`Σ principalComponent == principal` exactly)
- [x] Underpayment case (partial amount tracked against the right instalment) — `tests/unit/allocationService.test.ts`
- [x] Overpayment case (cascades to next instalment, doesn't reduce principal early)
- [x] Payment exceeding total outstanding (excess recorded, not applied)
- [x] Invalid input rejected before reaching allocation logic — added `lib/validation.ts` + `tests/unit/validation.test.ts` (wasn't built yet in Phase 2; needed to exist for this checklist item)
- [x] Bonus: overdue/late-payment behavior and the outstanding-principal design decision — `tests/unit/positionService.test.ts`

15 unit tests total across 4 files, all passing (`npm test`) — the 15th (malformed-JSON handling) was added during the Phase-6+ audit pass, see below. This is above the "~8-12 total" guideline on its own — Phase 6 will add integration tests on top, so the full suite will land a bit over the suggested range. Each test maps to a distinct documented case (PRD §8 or SRS §7), not padding; noting this tradeoff explicitly for the README.

**Traces to:** PRD §8 edge cases, SRS §3.6, §7; FR-6

---

## Phase 4 — Data Access Layer ✅ Done

**Goal:** wrap all DB reads/writes with transaction boundaries and duplicate detection, per the Architecture doc's repository layer.

- [x] `lib/db.ts` — Prisma client singleton (dev hot-reload safe)
- [x] `lib/repository/loanRepository.ts`:
  - `createLoanWithSchedule()` — loan + instalments in one transaction
  - `findLoanWithScheduleAndPayments()` — throws `NOT_FOUND` for an unknown id
  - `listLoans()` — backs the `GET /api/loans` extension for the UI picker
  - `findExistingPayment(loanId, amount, date)` — duplicate lookup
  - `savePaymentWithAllocations()` — payment + instalment updates + allocation rows in one transaction; catches the unique-constraint violation (P2002) as a replay rather than a raw error, as a safety net for concurrent/racing duplicate requests
- [x] Verified against the real Supabase DB with a throwaway integration check (not committed): create → read back → no duplicate found → save payment → duplicate detected on replay → cleaned up
- [x] Bumped Vitest's `testTimeout` to 20s — the hosted pooler's round-trip is well over the 5s default, which caused false timeouts during that check

**Traces to:** PRD §14 (transactions, DB-level duplicate prevention), Architecture §4.4

---

## Phase 5 — API Routes + Auth ✅ Done (fully verified with real Firebase)

**Goal:** the four endpoints, all behind server-verified Firebase auth, all using the one error shape.

- [x] `lib/auth/verifyToken.ts` — `requireAuth()` using Firebase Admin `verifyIdToken`
- [x] `POST /api/loans` — create loan + schedule
- [x] `GET /api/loans/:id` — schedule + derived position
- [x] `POST /api/loans/:id/payments` — record payment, handle duplicate replay (pre-check + DB-level race safety net)
- [x] `GET /api/loans` — list (extension, backs the UI's loan picker)
- [x] Added `lib/serializers.ts` (shared rupee/date response mapping) and `lib/dates.ts` (`todayInIst()`, per SRS §2.4's "server clock, IST" assumption)
- [x] Firebase project set up (real client config + admin credentials in `.env`)
- [x] Verified with a **real Firebase ID token** — signed up a test account via the Identity Toolkit REST API directly (no browser needed), confirmed `requireAuth()` accepts it, then exercised every route over real HTTP against the running dev server: `GET /api/loans` (listed all 3 seeded loans correctly), `GET /api/loans/:id` (schedule + position matched exactly, including the final-instalment rounding drift and the overdue flag), `POST /api/loans` (created a throwaway test loan), `POST /api/loans/:id/payments` (recorded a payment, then replayed the identical request and got `duplicate: true` back with the same payment id)
- [x] Also confirmed a genuinely invalid token (malformed JWT, not just a missing header) still correctly returns 401
- [x] Cleaned up the throwaway test loan afterward — DB back to exactly the 3 seeded loans

**Traces to:** PRD FR-1–FR-4, SRS §3.1–§3.4, §5.1, Architecture §4.1–§4.2

---

## Phase 6 — Integration Tests ✅ Done

**Goal:** exercise the route handlers against a real test database — not mocks.

- [x] `POST /api/loans` success path — `tests/integration/createLoan.test.ts`
- [x] One failure path (`GET /api/loans/:id` unknown id → 404) — `tests/integration/getLoan.test.ts`
- [x] Unauthenticated request → 401 without a valid token — `tests/integration/auth.test.ts`
- [x] Test data isolation — each test cleans up what it creates (`afterAll` cascade-deletes); verified DB left at 0 rows after each run

Route handlers are invoked directly (real `Request`/`NextResponse` objects, real Prisma against the real Supabase DB) rather than through a running HTTP server — still exercises the actual handler code end-to-end. Since Firebase isn't set up yet (deferred — see TODO), the success-path and failure-path tests mock only `requireAuth` itself; the auth test is the one that exercises the real, unmocked guard with no token at all. Full suite: 18 tests (15 unit + 3 integration), all passing via `npm test`.

**Traces to:** PRD FR-6, SRS §3.6, §10

---

## Audit pass (after Phase 8)

Did a full re-check before continuing further: git hygiene (working tree clean, nothing pushed that shouldn't be, no secrets anywhere in history), lint/typecheck/build/full test suite all green, DB row counts cross-checked against what the seed script should produce, and a line-by-line re-read of the payments route (the riskiest file) and the auth guard. Two things came out of it:

- **Fixed:** malformed JSON in a request body was surfacing as a generic 500 instead of a 400 `VALIDATION_ERROR`, since `request.json()` wasn't wrapped anywhere. Added `parseJsonBody()` in `lib/validation.ts`, used by both `POST /api/loans` and `POST /api/loans/:id/payments`, with a test locking it in.
- **Documented, not fixed:** the payments route reads the schedule, computes the allocation, then writes. Two genuinely concurrent *different* payments to the same loan (not duplicates - those are DB-guaranteed safe via the unique constraint) could both compute their allocation from the same pre-write snapshot. PRD §14 lists optimistic concurrency (a `version` column) as an optional differentiator for exactly this scenario, so it's deliberately left as a documented gap rather than implemented under deadline pressure - the `GET /api/loans/:id` endpoint is unaffected since it always re-derives position fresh from the DB, so this only risks the position embedded in a `POST /payments` response being briefly stale under real concurrency, never a persisted-data corruption.

Also confirmed a fake (garbage) Bearer token degrades to 401 rather than a 500 (this was checked before Firebase was configured, when it mattered most, but re-confirmed after too).

**Update right after this audit: Firebase got set up** (see Phase 5's checklist above) - the auth path is now verified with a real token end-to-end, not just mocked/missing-token cases.

---

## Phase 7 — UI (single page) ⏳ Built; API layer verified, browser click-through still pending

**Goal:** the minimum page that lets a reviewer sign in, see a schedule, and record a payment without a manual refresh.

- [x] `AuthGate` — redirect unauthenticated visitors to sign-in; sign-out action
- [x] Firebase client SDK sign-in (email/password and Google)
- [x] `LoanPicker` — backed by `GET /api/loans`
- [x] `ScheduleTable` — due date, principal, interest, total due, amount paid, status
- [x] `PositionCard` — outstanding principal, next due, overdue amount (visually distinct if > 0)
- [x] `PaymentForm` — amount + date, updates displayed state from the response (merges `appliedTo` into local state directly), no reload
- [x] Made Firebase client init lazy (`lib/firebase/client.ts`'s `getFirebaseAuth()`) — `getAuth()` validates the API key synchronously and was crashing `next build`'s prerender pass with empty credentials
- [x] Confirmed `npm run build` and the page's SSR shell (`curl localhost:3000/`) both work cleanly with no Firebase credentials set
- [x] Firebase is now live and every API route the UI calls has been verified end-to-end with a real ID token (see Phase 5) - the UI's data layer isn't hitting anything unproven
- [x] Restyled the whole UI against Vitto's actual brand (docs/stitch.md): CSS custom properties for colors/type/radii in `app/globals.css`, Inter font, a shared `BrandMark`, branded header/sign-in card, KPI-card position summary, status-pill schedule table with a real (data-derived, not decorative) status filter, and a proper modal for recording a payment instead of an inline form
- [ ] **Still not clicked through in an actual browser** — no browser tool available in this environment. Verified the SSR shell renders the correct markup/classes and doesn't crash (`curl` + grep), and that the backend calls the UI makes all work with a real token, but the actual rendered visual result (colors, layout, modal behavior) hasn't been seen.

**Traces to:** PRD FR-5, SRS §3.5, Architecture §4.5

---

## Phase 8 — Seed Script ✅ Done

**Goal:** the deployed link must be explorable immediately, without calling the create-loan endpoint first.

- [x] `prisma/seed.ts` — 3 demo loans in different states, clearly synthetic data:
  - "mixed": two instalments paid on time, a third half-paid and now overdue, a fourth not yet due (PAID + PARTIALLY_PAID/overdue + PENDING all in one loan)
  - "fresh": just disbursed, zero payments — a clean on-track example
  - "overpaid": a single payment at 1.5x the first instalment's due amount, cascading into the second — demonstrates the overpayment design decision live
- [x] Built on the app's own `generateSchedule`/`allocate`/repository functions (not raw SQL), so seed data is guaranteed consistent with what the app itself produces
- [x] Runs via `npm run db:seed` (also wired as `prisma.seed` so `npx prisma db seed` works) — same script for local and hosted DB, whichever `DATABASE_URL` is active
- [x] Ran it against the real Supabase DB and verified the numbers directly: overdue amount, next due date/amount, and outstanding principal all came out exactly as designed
- [x] Documented as a **manual, one-time** step, deliberately not wired into the Vercel build — the script isn't idempotent (re-running creates duplicate loans), so it must not run on every deploy

**Traces to:** PRD §11, §14; NFR "safe demo data"

---

## Architecture refactor (post-Phase-8, user-requested)

Requested explicitly, on top of the phase plan: a real middleware layer, a controller layer between routes and services, an explicit frontend token lifecycle, and a branded UI. All verified end-to-end, not just built.

- **`proxy.ts`** — a real Next.js Proxy (Next 16 renamed `middleware.ts`, and it now defaults to the Node.js runtime, which is what makes running the Firebase Admin SDK there possible). Verifies the Firebase token once for every `/api/*` request and attaches it as trusted headers.
- **`requireAuth()`** now trusts those headers when present, and independently re-verifies otherwise (Next's own docs warn against relying on Proxy alone, and our integration tests invoke route handlers directly, bypassing Proxy entirely) - so auth is centralized without becoming a single point that testing/direct invocation could silently skip.
- **`lib/controllers/*.ts`** — `loanController.ts` (createLoan, getLoan, listLoans) and `paymentController.ts` (recordPayment) now own all orchestration (auth, validation, service calls, repository calls, response shaping). Routes shrank to one-liners that call `lib/http.ts`'s `handleRoute()`.
- **`lib/apiClient.ts`** rewritten to own the frontend's access token lifecycle explicitly: decodes the token's own `exp` claim and caches it, refreshes proactively before it expires, retries once reactively on an unexpected 401, and only then signs out. 403 handled distinctly.
- **UI rebuilt against `docs/stitch.md`** (Vitto's brand system, extracted from vitto.money) — see Phase 7's checklist for specifics.
- Verified: full test suite still green (18/18) after the refactor; rebuilt, relinted; live end-to-end check against the running dev server with a real Firebase token covering GET list, GET by id, POST create, POST payment (including duplicate detection), and malformed-JSON handling — all through the new proxy → controller path, not the old direct-in-route path; cleaned DB back to the 3 seed loans afterward.

### Follow-up round: UI polish, frontend layering, create-loan, seed expansion

- Removed Google sign-in (email/password only); removed client-side password/email format validation per explicit request - Firebase's own server-side response still surfaces real errors.
- Added skeleton loaders (`Skeleton`, `LoanDetailSkeleton`) and a `Spinner` for buttons/the initial auth check, replacing plain "Loading…" text everywhere.
- Firebase sign-in errors now map from `error.code` to plain language (`lib/firebase/authErrors.ts`) instead of showing the raw SDK message (e.g. "Incorrect email or password" instead of "Firebase: Error (auth/invalid-credential).").
- Added `CreateLoanForm` (a modal over the already-tested `POST /api/loans`) - not required by the brief (FR-5 explicitly allows API/seed-only creation) but low-risk and requested.
- **Frontend re-layered properly**, on top of a direct correction: no more `useEffect` + inline `authedFetch("/api/...")` in components.
  - `lib/api/endpoints.ts` - every path in one place.
  - `lib/api/loanApi.ts` - one typed function per endpoint; the only caller of `authedFetch`.
  - `lib/hooks/useLoans.ts` / `useLoanDetail.ts` - view-model hooks owning loading/error/state; `page.tsx` is now purely declarative.
  - `LoanPicker` became presentational (loans passed in as props) with a search box (filters by reference/id/principal/rate) once there are more than a handful.
- Seed script made **properly idempotent** (`prisma.loan.deleteMany()` before reseeding - was previously a documented gap) and expanded from 3 to 7 loans: added a severely-overdue loan (several stacked unpaid instalments), min- and max-principal/tenure edge cases, and a fully-paid-off loan (exercises the "Fully paid" position state nothing else reached). Verified idempotency by running it twice in a row (stayed at 7, no duplicates) and spot-checked every loan's derived position directly.
- Verified live again after all of this: full suite green, build/lint clean, dev server SSR shell renders, and the exact create-loan flow (`POST` then `GET` for the full detail) exercised over real HTTP with a real token.

### Bug fix: "Not signed in" flashing right after a real, successful sign-in

User-reported: signed in successfully (Firebase's own `identitytoolkit` call returned 200, no console errors), but the dashboard showed a "Not signed in" error instead of the loan list - not a session-expiry bounce, since no `/api/loans` request was even visible in the network tab.

Root cause: `apiClient.ts`'s `getValidIdToken()` read `auth.currentUser` via its synchronous getter immediately when `useLoans()`'s effect fired right after `AuthGate` switched to the authenticated view. Firebase doesn't guarantee that getter reflects a just-completed sign-in the instant a dependent effect runs - a known class of race in Firebase+React apps. When it lost the race, the code took the `!user` branch and threw "Not signed in" before ever calling `fetch()`, matching every symptom exactly.

Fix: replaced the direct `.currentUser` read with `waitForCurrentUser()`, which resolves immediately if `currentUser` is already set (the normal case, zero added latency) and otherwise waits on the `onAuthStateChanged` stream for the definitive answer (bounded by a 5s timeout, so a genuinely signed-out user still fails fast). Verified: full suite still green, build/lint clean.

### Bug fix: large payments failing with a 500 (real production bug, found via user report)

User-reported: recording a ₹20,000 payment on a loan worked, but ₹1,20,000 on the same loan returned `500 INTERNAL_ERROR`. Reproduced directly against the user's actual loan (still in the DB) rather than a synthetic one.

Root cause, found in the server console (which logs the real error before sanitizing the HTTP response): `PrismaClientKnownRequestError: Transaction already closed` / `Transaction not found`. `savePaymentWithAllocations()` looped over every instalment the payment touched, doing an `UPDATE` then an `INSERT` per instalment **inside one interactive transaction**. A small payment touches 1-2 instalments and finishes quickly; a larger one that cascades across many touches N of them, and each round-trip to the hosted Supabase pooler has real latency - past a certain N, cumulative time blew through Prisma's 5s default transaction timeout and Postgres closed the transaction mid-write.

First attempt (parallelizing the per-instalment work with `Promise.all`, plus raising the timeout to 20s) was **not actually a fix** - a Postgres transaction runs on one connection, so statements against it are processed one at a time no matter how the JS is structured; a regression test cascading a payment across 24 instalments still timed out. The real fix: cut the number of round-trips to a **constant**, not one pair per instalment -

- One raw SQL `UPDATE ... FROM (VALUES ...)` bulk-updates every touched instalment's `amount_paid_paise` in a single statement (Prisma's query builder has no "different increment per row" bulk update, hence raw SQL here specifically).
- One `createManyAndReturn` bulk-inserts all the allocation rows.

Payment creation + these two now total 3 round-trips regardless of how many instalments are touched, instead of `1 + 2N`. The same 24-instalment cascade that used to time out at 20s+ now completes in ~8s.

Added `tests/integration/paymentCascade.test.ts` as a permanent regression test (a payment cascading across all 24 instalments of a max-principal, max-ish-tenure loan) - this is what caught the `Promise.all` non-fix before it shipped. Full suite: 19 tests, all green.

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

- [x] `GET /health` - `app/api/health/route.ts`, deliberately excluded from proxy.ts's auth so uptime monitoring can reach it unauthenticated; runs `SELECT 1` against the real DB
- [x] Invariant-style tests - `tests/unit/invariants.test.ts`: conservation (applied + excess === payment amount, always), no instalment ever paid past its due amount, outstanding principal and overdue amount never negative, across a varied sequence of payments
- [ ] Append-only payment ledger (or documented as a design decision, even if not built)
- [ ] Optimistic concurrency (`version` column on loans)
- [ ] OpenAPI/Swagger description
- [ ] GitHub Actions CI running the test suite

**Deliberately not building:** user roles, multi-currency, prepayment/foreclosure, penalty interest (PRD §4, §14).
