# Product Requirements Document (PRD)
## Loan Repayment Service — MSME Lending

| | |
|---|---|
| **Project** | Loan Repayment Service (Vitto Full Stack SDE Assignment) |
| **Author** | Sarthak Shreshtha |
| **Status** | Draft |
| **Version** | 1.0 |
| **Deadline** | Friday, 18 September, 4:00 PM IST |

---

## 1. Purpose

Vitto builds software that banks, NBFCs, and microfinance institutions use to operate lending end-to-end. This document defines the product requirements for a narrow but complete slice of that system: a service that **generates a loan repayment schedule**, **records payments against it**, and **reports the current position of a loan at any time**.

This is not a lending product — no money actually moves. It is infrastructure that a lender's operations team or a loan officer would use to track what is owed, what has been paid, and what remains.

## 2. Background & Context

- Loan sizes: ₹50,000 to ₹10,00,000
- Tenure: 3 to 36 months, repaid monthly
- Repayment behavior in the real world is messy: payments arrive late, short, split across multiple transactions, or duplicated by user/system error. The product must stay correct under all of these conditions — this is the core thing being evaluated, more than UI polish.

## 3. Goals

1. Produce a mathematically correct, auditable EMI (equal monthly instalment) schedule for any valid loan.
2. Allow payments to be recorded against that schedule and correctly allocated across interest, principal, and instalments — even when payments are irregular.
3. Always be able to answer, for any loan, at any point in time: *how much is outstanding, what's due next, and is anything overdue.*
4. Do all of the above behind authenticated endpoints, backed by a real relational database with correctness enforced at the schema level, not just in application code.
5. Ship a **live, publicly reachable deployment** — beyond the brief's baseline ask — so Vitto can sign in and test the product directly, without cloning the repo.

## 4. Non-Goals / Out of Scope

Explicitly excluded per the assignment brief:
- User roles or per-user data ownership (loans are not owned by individual users)
- Multiple currencies
- Prepayment / loan closure
- Penalty interest
- Password reset / email verification
- Component libraries or styled UI (functional over polished)

> **Note:** the brief itself lists deployment as out of scope. We are deliberately adding it back in as an extension (see FR-7, §11) so Vitto can test a live instance directly rather than only running it locally — this does not change any of the exclusions above.

## 5. Users & Stakeholders

| User | Need |
|---|---|
| Loan officer / ops user (the person signing in) | View a loan's schedule and current position; record a payment as it's received |
| Vitto reviewer (interviewer) | Verify money arithmetic is correct, tests are meaningful, repo runs cleanly from a fresh clone, and the author can explain any function including behavior in unspecified edge cases |

There is a single authenticated user role — no admin/borrower distinction.

## 6. Functional Requirements

### FR-1: Create a Loan
- **Input:** principal (₹), annual interest rate (%), tenure (months), disbursement date
- **Behavior:** Validates input, computes the EMI using the reducing-balance formula, generates the full month-by-month repayment schedule, and persists both the loan and its schedule.
- **Output:** The created loan with its full schedule.

### FR-2: Get a Loan
- **Input:** loan identifier
- **Behavior:** Returns:
  - The full schedule — per instalment: due date, principal component, interest component, total due, amount paid so far
  - The current position: outstanding principal, next due date and amount, any overdue amount
- Must reflect all payments recorded to date (no manual refresh/recompute step required by the caller).

### FR-3: Record a Payment
- **Input:** amount, date
- **Behavior:** Allocates the amount across the outstanding schedule according to a documented allocation order (see §8). Updates instalment-level `amount paid`. Must be idempotent against duplicate submission of the same payment (see §8).
- **Output:** Confirmation of what was applied and the resulting position, or a structured error.

### FR-4: Authentication
- Firebase Authentication (email/password or Google).
- All three endpoints above reject unauthenticated requests; tokens are verified **server-side**.
- UI redirects unauthenticated users to a sign-in screen and provides a sign-out action.

### FR-5: UI (single page)
- Displays a loan's schedule as a table, with current position and overdue amount visible at a glance.
- Recording a payment updates the displayed state without a manual page refresh.
- Loan creation may happen via API/seed script — a creation form is not required.

### FR-6: Tests
- ~8–12 tests total.
- Unit tests: schedule generation, payment allocation, and the specific cases in §8.
- Integration tests (2–3): one success path and one failure path against the route handlers + a real DB (not mocks), plus one confirming unauthenticated requests are rejected.
- Runs from a single documented command.

### FR-7: Deployment (extension beyond the brief)
- Application deployed to a publicly reachable URL, backed by a hosted Postgres instance (Neon/Supabase or equivalent — already brief-approved options) and the same Firebase Auth project used locally.
- The deployed instance must be in the **same working state** as the reviewed repo: schema applied via the same startup/migration script (no manual production setup), env vars set through the hosting platform's dashboard (never committed).
- A seeded demo loan (or two) should exist on the deployed instance so Vitto can explore the schedule and record a payment immediately, without first calling the create-loan endpoint themselves.
- The live link and a test account are sent in the submission email alongside the repo access — same channel, same "not in the repo" rule as local credentials.

## 7. EMI Calculation (Reference)

```
EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)
```
Where `P` = principal, `n` = tenure in months, `r` = monthly interest rate (annual rate ÷ 12 ÷ 100).

**Verification case:** ₹2,00,000 at 18% p.a. over 24 months ⇒ EMI ≈ ₹9,986/month. Rounding variance of ₹1–2 is acceptable; any leftover remainder is absorbed into the **final instalment**.

## 8. Business Rules & Edge Cases to Handle

These are the cases the product must demonstrably get right, and each decision must be documented (in the README, not just the code):

| Case | Requirement |
|---|---|
| **Underpayment** | Instalment is ₹9,986, ₹5,000 received — partial payment must be tracked accurately against that instalment, not silently rounded away or misapplied. |
| **Overpayment** | Twice the instalment received — a decision must be made (and documented) on whether this settles the next instalment or reduces principal. |
| **Late payment** | Payment received 11 days after due date — how this affects the loan's "current position" (e.g., overdue flag/amount) must be defined. |
| **Duplicate submission** | The same payment submitted twice must not be double-applied. |
| **Invalid input** | Negative amounts, zero-month tenure, non-numeric values, unknown loan ID — must be rejected with clear, consistent error responses. |
| **Allocation order** | The order in which a payment settles interest vs. principal vs. which outstanding instalment(s) first is a free design choice — but must be consistent and documented. |

## 9. Data Requirements (high level — detailed in SRS/Architecture)

- Loans, schedule instalments, and payments as distinct persisted entities.
- Money **must not** be stored as a floating-point type (integer paise/minor-unit or a fixed-point/decimal type).
- A payment must not be able to exist without an associated loan — enforced by the database schema (foreign key + constraints), not only application code.
- Schema must be created by a script or on startup — never manually.

## 10. Non-Functional Requirements

- **Correctness over completeness:** if time runs short, schedule generation, payment allocation, and tests take priority over UI.
- **Reproducibility:** a reviewer must be able to `npm install`, apply env values, run the documented DB setup step, `npm run dev`, run the documented test command, sign in, and use the app — on a clean machine, with no undocumented intervention.
- **No committed secrets:** Firebase credentials via `.env.example` only; real values sent separately in the submission email.
- **Auditability of code:** author must be able to explain any function's behavior, including in cases not explicitly specified in the brief.
- **Deployment parity:** the live instance runs the same schema, migrations, and code as the reviewed repo — no manual, undocumented steps taken only in production.
- **Safe demo data:** anything seeded on the public deployment is clearly fake/illustrative (no real names or real-looking sensitive data), since the link is reachable by anyone with the URL.

## 11. Deliverables

1. **Git repository** (public or shared access) with discrete, meaningful commits (not squashed) — includes schema setup, tests, `.env.example`, and README.
2. **README** (one page) covering: setup steps, database used, test command, endpoint reference, money type chosen, and allocation/rounding decisions.
3. **Live deployment link** — a working, publicly reachable URL running the same code/schema as the repo, with a seeded demo loan ready to explore.
4. Submission email to `sourav.shukla@vitto.money`, subject `Full Stack SDE — Assignment — Sarthak Shreshtha`, with repo access, environment values, a test account, and the deployment link.

## 12. Acceptance Criteria / Definition of Done

- [ ] All three endpoints implemented, consistent in naming and error shape, and reject unauthenticated calls (token verified server-side).
- [ ] EMI schedule generation matches the reference formula within ₹1–2 rounding tolerance; remainder absorbed in final instalment.
- [ ] All five edge cases in §8 are handled and their handling is documented.
- [ ] Money stored as a non-floating-point type in the DB.
- [ ] Payment→loan relationship enforced at the schema level.
- [ ] 8–12 meaningful tests (unit + integration), runnable via one documented command, all passing.
- [ ] UI shows schedule, current position, overdue amount, and updates on payment without manual refresh.
- [ ] Fresh clone → install → env → DB setup → dev server → tests → sign-in → use app works exactly as documented.
- [ ] No secrets committed; `.env.example` present.
- [ ] Commit history is discrete and reviewable.
- [ ] Live deployment link works: sign in, view seeded loan's schedule and position, record a payment, see it reflected — all without touching the repo locally.
- [ ] Deployment uses the same schema-setup script as local (no manual DB changes made only in production), and env vars are set via the hosting platform, not committed.

## 13. Risks

| Risk | Mitigation |
|---|---|
| Running out of time before UI is polished | Prioritize per brief: schedule → allocation → tests → UI (explicitly sanctioned in the brief itself) |
| Floating-point rounding bugs in money math | Use integer minor units (paise) or a fixed-point decimal type throughout; never `float`/`double` |
| Allocation logic ambiguity questioned in interview | Document the exact order chosen and reasoning in README; be ready to trace it live |
| Repo doesn't run on a clean machine | Verify against a fresh clone before submission, exactly as §03 of the brief instructs |

## 14. Differentiators — What Would Give This Submission an Edge

The brief says the interview will *"examine specific functions and ask how your allocation logic behaves in a case not specified in this brief"* — that rewards depth, not breadth. None of the below are required. Treat them as an optional backlog to pull from once the core requirements (§6–§8) are solid — never at the expense of them.

**High impact, low effort — do these if at all possible:**
- **`GET /loans` (list) endpoint.** Not explicitly required, but the UI needs *some* way to select which loan to view. A minimal listing endpoint is the honest way to do that, instead of hardcoding a loan ID in the UI.
- **Wrap payment allocation in a single DB transaction.** Guards against partial writes if one payment touches multiple instalment rows.
- **Enforce duplicate-payment prevention at the DB level**, not just in application code — e.g. a unique constraint on a natural key (loan_id + date + amount) or an idempotency key. Turns "duplicate submission" from "hopefully caught in code" into a guarantee.
- **One consistent error shape** across all three endpoints — e.g. `{ error: { code, message } }` with a small fixed set of codes (`VALIDATION_ERROR`, `NOT_FOUND`, `UNAUTHORIZED`, `CONFLICT`). The brief explicitly calls out that error responses must be consistent — this is an easy, visible win.
- **A couple of invariant-style tests**, not just example-based ones — e.g. "allocated amounts across any payment sequence never exceed amount paid," "outstanding principal never goes negative." This is the most direct way to answer "how does it behave in a case not in the brief," because you're testing a property, not one input.

**Medium impact — strong signal if time allows:**
- **Append-only payment ledger.** Instead of mutating instalment rows in place, store each payment as an immutable record and *derive* current position (outstanding, next due, overdue) via a query/view. Closer to how real ledgers work, and eliminates a class of "state got out of sync" bugs. Even if you don't fully build this, stating it as the design decision in the README (with a note on why) is a strong thing to defend in the interview.
- **Optimistic concurrency** (a `version` column on the loan row, checked-and-incremented on write) to prevent two near-simultaneous payments from corrupting the schedule. Realistic production concern for a lending backend, low cost to add.
- **Seed script with 2–3 pre-built loans** in different states (on-track, overdue, overpaid) so the reviewer can explore the UI immediately without creating a loan first.
- **`GET /health`** or a trivial DB-connectivity check — makes "does it run" instantly verifiable.

**Nice if time permits — skip without guilt:**
- A short OpenAPI/Swagger description of the 3 endpoints.
- A GitHub Actions workflow running the test suite on push (with a Postgres service container) — shows CI habit for ~10 minutes of setup.
- Basic request-size/rate limiting on the payment endpoint (defensive posture, even if not exercised in review).

**Deployment (now in scope — recommended stack):**
- **Vercel** for the Next.js app — zero-config for Next.js, free tier, env vars managed in its dashboard (never in the repo), and it gives the "documented database setup step" a clean split: migrations run once against the hosted DB, app just connects.
- **Neon** or **Supabase** for hosted Postgres — both explicitly pre-approved by the brief, both have a generous free tier and a connection string that drops straight into Vercel's env vars. Using the *same* provider locally and in production (or at least the same connection-string shape) avoids "works on my machine, breaks in prod" surprises.
- **Firebase Auth** needs no separate hosting — it's already a cloud service; just add the deployed domain to Firebase's authorized domains list.
- Run the schema/migration script as part of the Vercel build step (or a one-time manual run against the hosted DB before first deploy) — never hand-edit the production schema.
- `docker-compose.yml` for local Postgres is still worth doing even with a hosted deployment — it keeps local dev and CI independent of the cloud DB, and is a five-minute add.

**Deliberately do NOT build**, even though some are tempting: user roles/ownership, multi-currency, prepayment/foreclosure, penalty interest. These are explicitly out of scope in the brief (§04) — building them anyway signals you didn't read the constraints carefully, not that you went the extra mile. It's fine to *mention* in the README how the schema or allocation design would extend to these later — that shows foresight without scope creep.
