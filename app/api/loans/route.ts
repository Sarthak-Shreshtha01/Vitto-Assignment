import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/verifyToken";
import { validateCreateLoanInput } from "@/lib/validation";
import { generateSchedule } from "@/lib/services/scheduleService";
import { createLoanWithSchedule, listLoans } from "@/lib/repository/loanRepository";
import { toErrorResponse } from "@/lib/errors";
import { serializeInstalment, serializeLoanHeader } from "@/lib/serializers";

// POST /api/loans - create a loan and persist its full generated schedule.
export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await request.json();
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

    return NextResponse.json(
      { ...serializeLoanHeader(loan), schedule: savedInstalments.map(serializeInstalment) },
      { status: 201 },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}

// GET /api/loans - list loans (extension, backs the UI's loan picker).
export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const loans = await listLoans();
    return NextResponse.json(loans.map(serializeLoanHeader));
  } catch (error) {
    return toErrorResponse(error);
  }
}
