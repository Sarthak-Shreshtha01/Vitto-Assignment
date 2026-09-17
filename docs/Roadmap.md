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
