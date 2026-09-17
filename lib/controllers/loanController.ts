import { requireAuth } from "@/lib/auth/verifyToken";
import { parseJsonBody, validateCreateLoanInput } from "@/lib/validation";
import { generateSchedule } from "@/lib/services/scheduleService";
import { derivePosition } from "@/lib/services/positionService";
import {
  createLoanWithSchedule,
  findLoanWithScheduleAndPayments,
  listLoans as listLoansFromDb,
} from "@/lib/repository/loanRepository";
import { serializeInstalment, serializeLoanHeader, serializePosition } from "@/lib/serializers";
import { todayInIst } from "@/lib/dates";
import type { RouteResult } from "@/lib/controllers/types";

// POST /api/loans - validates input, generates the EMI schedule via the
// reducing-balance formula, and persists the loan + schedule in a single
// transaction. Returns the created loan with its full schedule. SRS §3.1.
export async function createLoan(request: Request): Promise<RouteResult> {
  await requireAuth(request);
  const body = await parseJsonBody(request);
  const input = validateCreateLoanInput(body);

  const { emiAmountPaise, instalments } = generateSchedule(
    input.principalPaise,
    input.annualInterestRate,
    input.tenureMonths,
    input.disbursementDate,
  );

  const { loan, instalments: savedInstalments } = await createLoanWithSchedule({
    principalPaise: input.principalPaise,
    annualInterestRate: input.annualInterestRate,
    tenureMonths: input.tenureMonths,
    disbursementDate: input.disbursementDate,
    emiAmountPaise,
    instalments,
  });

  return {
    status: 201,
    body: { ...serializeLoanHeader(loan), schedule: savedInstalments.map(serializeInstalment) },
  };
}

// GET /api/loans/:id - loads a loan's schedule and payments, then derives
// its position (outstanding principal, next due, overdue amount) as of
// right now. Position is never stored, so this always reflects every
// payment recorded to date with no caller-side refresh step. SRS §3.2.
export async function getLoan(request: Request, loanId: string): Promise<RouteResult> {
  await requireAuth(request);
  const { loan, instalments } = await findLoanWithScheduleAndPayments(loanId);
  const position = derivePosition(instalments, todayInIst());

  return {
    status: 200,
    body: {
      ...serializeLoanHeader(loan),
      schedule: instalments.map(serializeInstalment),
      position: serializePosition(position),
    },
  };
}

// GET /api/loans - lists every loan. Not part of the original brief; backs
// the UI's loan picker so it doesn't need a hardcoded id (PRD §14).
export async function listLoans(request: Request): Promise<RouteResult> {
  await requireAuth(request);
  const loans = await listLoansFromDb();
  return { status: 200, body: loans.map(serializeLoanHeader) };
}
