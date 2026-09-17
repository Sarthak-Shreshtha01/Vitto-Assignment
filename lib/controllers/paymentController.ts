import { requireAuth } from "@/lib/auth/verifyToken";
import { parseJsonBody, validateRecordPaymentInput } from "@/lib/validation";
import { allocate, type AppliedAllocation } from "@/lib/services/allocationService";
import { derivePosition } from "@/lib/services/positionService";
import {
  findExistingPayment,
  findLoanWithScheduleAndPayments,
  savePaymentWithAllocations,
} from "@/lib/repository/loanRepository";
import { paiseToRupees } from "@/lib/money";
import { serializePosition } from "@/lib/serializers";
import { todayInIst } from "@/lib/dates";
import type { RouteResult } from "@/lib/controllers/types";
import type { Instalment } from "@/lib/types";
import type { Payment, PaymentAllocation } from "@prisma/client";

// POST /api/loans/:id/payments - allocates a payment across the outstanding
// schedule, oldest-instalment-first (SRS §3.3/§7.1-7.2). Idempotent against
// a duplicate (loanId, amount, date) submission: a pre-check catches the
// common case, and the repository's unique-constraint safety net catches a
// concurrent/racing duplicate that slips past it.
export async function recordPayment(request: Request, loanId: string): Promise<RouteResult> {
  await requireAuth(request);
  const body = await parseJsonBody(request);
  const { amountPaise, date } = validateRecordPaymentInput(body);

  // Confirms the loan exists (throws NOT_FOUND otherwise) and gives us the
  // current schedule in the same call.
  const { instalments } = await findLoanWithScheduleAndPayments(loanId);

  const existingPayment = await findExistingPayment(loanId, amountPaise, date);
  if (existingPayment) {
    return {
      status: 201,
      body: buildPaymentResponse({
        payment: existingPayment,
        duplicate: true,
        allocations: existingPayment.allocations,
        instalments, // unaffected - a duplicate applies nothing new
      }),
    };
  }

  const unpaidInstalments = instalments.filter((i) => i.amountPaidPaise < i.totalDuePaise);
  const { appliedTo } = allocate(unpaidInstalments, amountPaise);
  const instalmentIdBySequence = new Map(unpaidInstalments.map((i) => [i.sequenceNumber, i.id]));

  const saveResult = await savePaymentWithAllocations({
    loanId,
    amountPaise,
    date,
    appliedTo: appliedTo.map((a) => ({
      instalmentId: instalmentIdBySequence.get(a.sequenceNumber)!,
      amountAppliedPaise: a.amountAppliedPaise,
    })),
  });

  if (saveResult.duplicate) {
    // A concurrent identical request won the race between our pre-check and
    // our insert - refetch, since that request's allocation may have
    // already changed the schedule.
    const refreshed = await findLoanWithScheduleAndPayments(loanId);
    return {
      status: 201,
      body: buildPaymentResponse({
        payment: saveResult.payment,
        duplicate: true,
        allocations: saveResult.payment.allocations,
        instalments: refreshed.instalments,
      }),
    };
  }

  // Apply this payment's own deltas in memory rather than round-tripping to
  // the DB again just to derive the position.
  const appliedBySequence = new Map(appliedTo.map((a) => [a.sequenceNumber, a.amountAppliedPaise]));
  const updatedInstalments = instalments.map((i) => {
    const applied = appliedBySequence.get(i.sequenceNumber);
    return applied ? { ...i, amountPaidPaise: i.amountPaidPaise + applied } : i;
  });

  return {
    status: 201,
    body: buildPaymentResponse({
      payment: saveResult.payment,
      duplicate: false,
      allocations: saveResult.allocations,
      instalments: updatedInstalments,
      appliedTo,
    }),
  };
}

// Shapes a payment + its allocations + the resulting position into the
// SRS §3.3 response body, whether this was a fresh payment or a replay.
function buildPaymentResponse(input: {
  payment: Payment;
  duplicate: boolean;
  allocations: PaymentAllocation[];
  instalments: (Instalment & { id: string })[];
  appliedTo?: AppliedAllocation[];
}) {
  const sequenceByInstalmentId = new Map(input.instalments.map((i) => [i.id, i.sequenceNumber]));

  const appliedTo =
    input.appliedTo ??
    input.allocations.map((a) => ({
      sequenceNumber: sequenceByInstalmentId.get(a.instalmentId) ?? 0,
      amountAppliedPaise: a.amountAppliedPaise,
    }));

  const position = derivePosition(input.instalments, todayInIst());

  return {
    payment: {
      id: input.payment.id,
      amount: paiseToRupees(input.payment.amountPaise),
      date: input.payment.paymentDate.toISOString().slice(0, 10),
    },
    duplicate: input.duplicate,
    appliedTo: appliedTo.map((a) => ({
      sequenceNumber: a.sequenceNumber,
      amountApplied: paiseToRupees(a.amountAppliedPaise),
    })),
    position: serializePosition(position),
  };
}
