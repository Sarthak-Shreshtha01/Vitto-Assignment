# Software Requirements Specification (SRS)
## Loan Repayment Service — MSME Lending

| | |
|---|---|
| **Project** | Loan Repayment Service (Vitto Full Stack SDE Assignment) |
| **Author** | Sarthak Shreshtha |
| **Status** | Draft |
| **Version** | 1.0 |
| **Traces to** | PRD.md v1.0 |

---

## 1. Introduction

### 1.1 Purpose
This SRS translates the PRD's goals and requirements into specific, testable system behavior: exact API contracts, data model, validation rules, and business-rule algorithms. Where the assignment brief leaves a decision to the author's discretion (allocation order, overpayment handling, overdue definition), this document states the **chosen decision**, not just the options — implementation and tests are built against these decisions.

### 1.2 Scope
Covers the backend (Next.js route handlers + PostgreSQL), authentication (Firebase), the single-page UI, the test suite, and the deployment. Out-of-scope items are as listed in PRD §4 (user roles, multi-currency, prepayment/foreclosure, penalty interest).

### 1.3 Definitions & Abbreviations

| Term | Meaning |
|---|---|
| EMI | Equal Monthly Instalment |
| Instalment | One row of the repayment schedule (one month) |
| Allocation | The act of applying a payment's amount against one or more instalments |
| Paise | ₹1 = 100 paise; the minor currency unit used for all stored money values |
| Position | The derived, point-in-time summary of a loan: outstanding principal, next due, overdue |
| IST | Indian Standard Time (UTC+5:30) — reference timezone for all dates |

### 1.4 References
- Vitto Full Stack SDE Technical Assessment brief (source document)
- PRD.md v1.0 (this project)

## 2. Overall Description

### 2.1 Product Perspective
A standalone Next.js application (App Router, route handlers as the API layer) with its own PostgreSQL database. Firebase Authentication is the only external identity provider. No other system integrates with it.

### 2.2 User Classes
Single class: an authenticated internal user (loan officer / reviewer). No role differentiation, no per-user data partitioning (per PRD §5).

### 2.3 Design & Implementation Constraints
- Language: TypeScript (preferred) or JavaScript, per brief §04.
- Money **must** be stored as an integer minor-unit (paise), never `float`/`double`/JS `number` used loosely for currency — see §4.1.
- Schema created only via a migration/startup script — never manual DDL against the running DB.
- No secrets in the repository.

### 2.4 Assumptions & Dependencies
- A single global "today" (server clock, IST) is used to compute overdue status — no client-supplied "as of" date.
- Firebase project is already provisioned; only client config + a server-side verification path (Admin SDK or equivalent) are needed.
- Hosted Postgres (Neon/Supabase) is reachable via a standard connection string from both local dev and the deployment.

## 3. Functional Requirements (Detailed)

Each requirement below traces to the matching FR in PRD §6.

### 3.1 FR-1 — Create a Loan

**Endpoint:** `POST /api/loans`

**Request body:**
```json
{
  "principal": 200000,
  "annualInterestRate": 18,
  "tenureMonths": 24,
  "disbursementDate": "2026-01-05"
}
```
- `principal`: number, rupees (whole or decimal up to paise precision), `50000 ≤ principal ≤ 1000000`
- `annualInterestRate`: number, percent, `> 0`
- `tenureMonths`: integer, `3 ≤ tenureMonths ≤ 36`
- `disbursementDate`: ISO date string (`YYYY-MM-DD`)

**Processing:**
1. Validate input (see §8).
2. Convert `principal` to paise (integer).
3. Compute monthly rate `r = annualInterestRate / 12 / 100`.
4. Compute EMI via the reference formula (PRD §7), rounded to the nearest paisa.
5. Generate `tenureMonths` instalment rows:
   - `dueDate[i]` = `disbursementDate + i months` (i = 1..n), same day-of-month as disbursement (clamped to month length, e.g. 31st → last day of a 30-day month).
   - `interestComponent[i] = round(outstandingPrincipal × r)`
   - `principalComponent[i] = EMI − interestComponent[i]`
   - `outstandingPrincipal -= principalComponent[i]`
   - On the **final** instalment, `principalComponent` is set to whatever `outstandingPrincipal` remains (absorbs all rounding drift), and `totalDue` is recalculated as `principalComponent + interestComponent` for that row — it will differ from EMI by at most a few paise.
6. Persist loan + schedule in a single transaction.

**Response `201`:**
```json
{
  "id": "ln_01H...",
  "principal": 200000,
  "annualInterestRate": 18,
  "tenureMonths": 24,
  "disbursementDate": "2026-01-05",
  "emiAmount": 9986,
  "schedule": [
    {
      "sequenceNumber": 1,
      "dueDate": "2026-02-05",
      "principalComponent": 7010,
      "interestComponent": 3000,
      "totalDue": 9986,
      "amountPaid": 0,
      "status": "PENDING"
    }
  ]
}
```

**Errors:** `400 VALIDATION_ERROR` (see §8), `401 UNAUTHORIZED`.

---

### 3.2 FR-2 — Get a Loan

**Endpoint:** `GET /api/loans/:id`

**Processing:** Loads the loan, its schedule, and all recorded payments; derives `position` at request time (never stored redundantly — see §4.2).

**Response `200`:**
```json
{
  "id": "ln_01H...",
  "principal": 200000,
  "annualInterestRate": 18,
  "tenureMonths": 24,
  "disbursementDate": "2026-01-05",
  "emiAmount": 9986,
  "schedule": [
    {
      "sequenceNumber": 1,
      "dueDate": "2026-02-05",
      "principalComponent": 7010,
      "interestComponent": 3000,
      "totalDue": 9986,
      "amountPaid": 9986,
      "status": "PAID"
    },
    {
      "sequenceNumber": 2,
      "dueDate": "2026-03-05",
      "principalComponent": 7115,
      "interestComponent": 2871,
      "totalDue": 9986,
      "amountPaid": 5000,
      "status": "PARTIALLY_PAID"
    }
  ],
  "position": {
    "outstandingPrincipal": 185875,
    "nextDueDate": "2026-03-05",
    "nextDueAmount": 4986,
    "overdueAmount": 0
  }
}
```
`status` per instalment ∈ `PENDING | PARTIALLY_PAID | PAID` (derived, not stored, from `amountPaid` vs `totalDue`).

**Errors:** `404 NOT_FOUND` (unknown `id`), `401 UNAUTHORIZED`.

---

### 3.3 FR-3 — Record a Payment

**Endpoint:** `POST /api/loans/:id/payments`

**Request body:**
```json
{ "amount": 5000, "date": "2026-03-10" }
```
- `amount`: number, rupees, `> 0`
- `date`: ISO date string

**Processing (allocation algorithm — see §7 for the full rationale):**
1. Check for a prior payment on this loan with the **same** `(amount, date)`. If found, treat as a duplicate submission: return the **existing** result with `duplicate: true`, apply nothing new (idempotent — see §7.4).
2. Otherwise, in one DB transaction:
   a. Convert `amount` to paise; persist a new `payments` row.
   b. Fetch all instalments for the loan with `amountPaid < totalDue`, ordered by `dueDate` ascending (oldest first).
   c. For each such instalment, in order, apply as much of the remaining payment amount as needed to bring it to fully paid, **interest-first-then-principal is not tracked separately at allocation time** — the instalment's `amountPaid` is simply incremented (interest/principal split is fixed at schedule-generation time, not re-derived per payment).
   d. Continue cascading any remainder to the next oldest unpaid instalment, and so on, until the payment is exhausted or all instalments are fully paid.
   e. If the payment fully pays the loan's final instalment and a remainder is still left over (payment amount exceeds total outstanding), that remainder is **not** applied anywhere (no negative balances, no credit account) — track this as an "excess" for reporting purposes.
3. Recompute `position` and return it.

**Response `201`:**
```json
{
  "payment": { "id": "pay_01H...", "amount": 5000, "date": "2026-03-10" },
  "duplicate": false,
  "appliedTo": [
    { "sequenceNumber": 2, "amountApplied": 5000 }
  ],
  "position": {
    "outstandingPrincipal": 185875,
    "nextDueDate": "2026-03-05",
    "nextDueAmount": 4986,
    "overdueAmount": 4986
  }
}
```

**Errors:** `400 VALIDATION_ERROR` (negative/zero amount, invalid date, non-numeric), `404 NOT_FOUND` (unknown loan id), `401 UNAUTHORIZED`.

---

### 3.4 FR-4 — Authentication

- Firebase client SDK handles sign-in (email/password or Google) in the browser.
- Every route handler verifies the Firebase ID token **server-side** (e.g. via Firebase Admin SDK `verifyIdToken`) from the `Authorization: Bearer <token>` header. No endpoint trusts a client-asserted identity.
- Missing/invalid/expired token → `401 UNAUTHORIZED` with the standard error shape (§8).
- UI: unauthenticated visitors are redirected to a sign-in screen; a visible sign-out action is present once authenticated.

### 3.5 FR-5 — UI (single page)

- One authenticated page: loan schedule as a table (due date, principal, interest, total due, amount paid, status), current position card (outstanding principal, next due date/amount), overdue amount visibly highlighted if `> 0`.
- A payment-entry form (amount, date) that calls FR-3 and updates the displayed schedule/position **client-side** from the response — no full page reload.
- Loan selection: since the brief doesn't specify how a loan is chosen in the UI, and creation may happen via API/seed script, the page includes a minimal loan picker backed by `GET /api/loans` (PRD §14 differentiator) rather than a hardcoded ID.

### 3.6 FR-6 — Tests

Test types and minimum coverage (traceability in §9):
- Unit — schedule generation: EMI formula correctness, final-instalment remainder absorption, tenure/date rollover.
- Unit — allocation: underpayment, overpayment/cascade, duplicate no-op, invalid input rejected before reaching allocation logic.
- Integration — `POST /api/loans` success path against a real test DB.
- Integration — one failure path (e.g. `GET /api/loans/:id` with an unknown id → 404).
- Integration — one unauthenticated request rejected (401) without a valid token.

### 3.7 FR-7 — Deployment

- Hosted on Vercel (Next.js) + Neon/Supabase (Postgres) + the same Firebase project (deployed domain added to Firebase authorized domains).
- Schema applied via the same script used locally — run once against the hosted DB, not hand-edited.
- Seeded with at least one demo loan with a mix of paid, partially-paid, and overdue instalments, so the live link is immediately explorable.
- Live URL + a test account sent in the submission email (PRD §11).

## 4. Data Model

### 4.1 Money Representation
All currency fields are stored as **integer paise** (Postgres `BIGINT` or `INTEGER`, never `FLOAT`/`DOUBLE`/`NUMERIC` used loosely — `BIGINT` is chosen specifically to guarantee exact integer arithmetic). API request/response bodies use rupee values with up to 2 decimal places for readability; conversion to/from paise happens at the API boundary only.

### 4.2 Entities

**`loans`**
| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` / `text` | PK |
| `principal_paise` | `bigint` | NOT NULL, `> 0` |
| `annual_interest_rate` | `numeric(6,3)` | NOT NULL, `> 0` (Postgres `numeric` is exact, not floating point) |
| `tenure_months` | `integer` | NOT NULL, `3 ≤ x ≤ 36` |
| `disbursement_date` | `date` | NOT NULL |
| `emi_amount_paise` | `bigint` | NOT NULL |
| `created_at` | `timestamptz` | NOT NULL, default now() |

**`instalments`**
| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` / `text` | PK |
| `loan_id` | `uuid` / `text` | FK → `loans.id`, NOT NULL, `ON DELETE CASCADE` |
| `sequence_number` | `integer` | NOT NULL |
| `due_date` | `date` | NOT NULL |
| `principal_component_paise` | `bigint` | NOT NULL |
| `interest_component_paise` | `bigint` | NOT NULL |
| `total_due_paise` | `bigint` | NOT NULL (= principal + interest for that row) |
| `amount_paid_paise` | `bigint` | NOT NULL, default 0 |
| | | UNIQUE (`loan_id`, `sequence_number`) |

**`payments`**
| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` / `text` | PK |
| `loan_id` | `uuid` / `text` | FK → `loans.id`, NOT NULL — **enforced at schema level**, satisfying "a payment must not exist without a loan" |
| `amount_paise` | `bigint` | NOT NULL, `> 0` |
| `payment_date` | `date` | NOT NULL |
| `created_at` | `timestamptz` | NOT NULL, default now() |
| | | UNIQUE (`loan_id`, `amount_paise`, `payment_date`) — backs duplicate-submission detection (§7.4) |

**`payment_allocations`** *(recommended — supports the audit-trail differentiator in PRD §14; not strictly required by the brief)*
| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` / `text` | PK |
| `payment_id` | `uuid` / `text` | FK → `payments.id`, NOT NULL |
| `instalment_id` | `uuid` / `text` | FK → `instalments.id`, NOT NULL |
| `amount_applied_paise` | `bigint` | NOT NULL, `> 0` |

A "current position" (outstanding principal, next due, overdue amount) is **derived** at read time from `instalments` + today's date — it is not a stored column, so it can never drift out of sync with the underlying rows.

### 4.3 Entity Relationship Summary
```
loans (1) ──< instalments (many)
loans (1) ──< payments (many)
payments (1) ──< payment_allocations (many) >── instalments (1)
```

## 5. External Interface Requirements

### 5.1 API Summary

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/loans` | Required | Create a loan + schedule |
| `GET` | `/api/loans/:id` | Required | Get schedule + position |
| `POST` | `/api/loans/:id/payments` | Required | Record a payment |
| `GET` | `/api/loans` *(extension)* | Required | List loans, for UI selection |

### 5.2 Software Interfaces
- **Firebase Authentication** — client SDK for sign-in; Admin SDK (or REST token-info endpoint) for server-side verification.
- **PostgreSQL** — via an ORM (e.g. Prisma) or plain SQL with a migration tool; choice is not assessed per the brief.
- **Next.js** — App Router route handlers as the API layer; same app serves the UI.

### 5.3 Communication Interfaces
REST over HTTPS, JSON request/response bodies, Bearer token auth header.

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Correctness | EMI and allocation arithmetic must be exact in integer paise; no floating-point money math anywhere in the codebase. |
| Reproducibility | Fresh clone → `npm install` → env → DB setup script → `npm run dev` → test command → sign-in → use, with zero undocumented steps (brief §03). |
| Security | Secrets only via environment variables; tokens verified server-side on every request; no credentials in the repo or commit history. |
| Consistency | One error response shape across all endpoints (§8). |
| Testability | Test suite runs from a single documented command; integration tests hit a real test database, not mocks. |
| Availability (deployment) | Live instance stays in parity with the reviewed repo/schema; no drift from manual production changes. |

## 7. Business Rule Algorithms

### 7.1 Allocation Order (chosen design)
**Oldest-due-instalment-first, full instalment before moving to the next.** Within an instalment, the interest/principal split is fixed at schedule-generation time (not re-split per payment) — a payment simply reduces the instalment's outstanding balance.

*Rationale:* matches how most lenders report "days past due" — the earliest obligation is always cleared first, which keeps the overdue calculation simple and defensible.

### 7.2 Overpayment
Excess beyond the current oldest unpaid instalment **cascades forward** to the next oldest unpaid instalment(s) — it does **not** reduce principal ahead of schedule (that would be a prepayment, which is explicitly out of scope per PRD §4). If it exceeds the total remaining balance of the loan, the excess is recorded but not applied anywhere (see §3.3 step 2e).

### 7.3 Late Payment & Overdue Definition
An instalment is **overdue** at the moment of query if: `today > due_date AND amount_paid < total_due`. `overdueAmount` in `position` = sum of `(total_due − amount_paid)` across all such instalments, evaluated **as of now**, not stored. A payment that eventually pays off a late instalment removes it from the overdue calculation from that point forward — being paid late is not separately penalized (no penalty interest, per PRD §4), but the schedule row's `dueDate` vs. the payment's actual date remains visible in the data, so "was paid late" is always derivable if needed.

### 7.4 Duplicate Submission
A payment is identified by `(loan_id, amount, date)`. If a payment with an identical triple already exists, the new request is treated as a **replay**, not a new payment: no new row is inserted, no new allocation happens, and the existing result is returned with `duplicate: true`. This is enforced with a database unique constraint (§4.2), not only an application-level check, so it holds even under concurrent/racing requests.

### 7.5 Rounding
All rounding happens at paisa granularity using integer arithmetic (round-half-up). The final instalment absorbs any cumulative rounding drift so that `Σ principalComponent == original principal` exactly.

## 8. Validation & Error Handling

**Error response shape (all endpoints):**
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "principal must be between 50000 and 1000000" } }
```

| Code | HTTP Status | Trigger |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Negative/zero amount, non-numeric input, tenure outside 3–36, principal outside ₹50,000–₹10,00,000, malformed date |
| `UNAUTHORIZED` | 401 | Missing, invalid, or expired Firebase token |
| `NOT_FOUND` | 404 | Unknown loan `id` |
| `INTERNAL_ERROR` | 500 | Unexpected server/database failure |

## 9. Traceability Matrix

| PRD Requirement | SRS Section | Verified By |
|---|---|---|
| FR-1 Create Loan | §3.1, §7.5 | Unit tests (schedule generation) |
| FR-2 Get Loan | §3.2, §4.2 | Integration test (success path) |
| FR-3 Record Payment | §3.3, §7.1–7.4 | Unit tests (allocation cases) + integration (failure path) |
| FR-4 Auth | §3.4 | Integration test (401 on missing token) |
| FR-5 UI | §3.5 | Manual verification (brief §03 step 4) |
| FR-6 Tests | §3.6 | Self-referential — test suite itself |
| FR-7 Deployment | §3.7 | Manual verification of live URL |
| Edge cases (PRD §8) | §7 | Unit test suite, one test per case |

## 10. Appendix — Sample Error Responses

```json
// Unknown loan id
{ "error": { "code": "NOT_FOUND", "message": "No loan found with id ln_does_not_exist" } }

// Negative payment amount
{ "error": { "code": "VALIDATION_ERROR", "message": "amount must be greater than 0" } }

// Missing/invalid auth token
{ "error": { "code": "UNAUTHORIZED", "message": "Missing or invalid authentication token" } }
```
