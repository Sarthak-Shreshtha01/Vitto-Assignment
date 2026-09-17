import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/verifyToken";
import { parseJsonBody, validateRecordPaymentInput } from "@/lib/validation";
import { allocate, type AppliedAllocation } from "@/lib/services/allocationService";
import { derivePosition } from "@/lib/services/positionService";
import {
  findExistingPayment,
  findLoanWithScheduleAndPayments,
  savePaymentWithAllocations,
} from "@/lib/repository/loanRepository";
import { toErrorResponse } from "@/lib/errors";
import { paiseToRupees } from "@/lib/money";
import { serializePosition } from "@/lib/serializers";
import { todayInIst } from "@/lib/dates";
import type { Instalment } from "@/lib/types";
import type { Payment, PaymentAllocation } from "@prisma/client";

// POST /api/loans/:id/payments - allocate a payment across the outstanding
// schedule, oldest-instalment-first (SRS §3.3). Idempotent against a
// duplicate (loanId, amount, date) submission.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(request);
    const { id: loanId } = await params;
    const body = await parseJsonBody(request);
    const { amountPaise, date } = validateRecordPaymentInput(body);

    // Confirms the loan exists (throws NOT_FOUND otherwise) and gives us
    // the current schedule in the same call.
    const { instalments } = await findLoanWithScheduleAndPayments(loanId);

    const existingPayment = await findExistingPayment(loanId, amountPaise, date);
    if (existingPayment) {
      return NextResponse.json(
        buildResponse({
          payment: existingPayment,
          duplicate: true,
          allocations: existingPayment.allocations,
          instalments, // unaffected - a duplicate applies nothing new
        }),
        { status: 201 },
      );
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
      // A concurrent identical request won the race between our pre-check
      // and our insert - refetch, since that request's allocation may have
      // already changed the schedule.
      const refreshed = await findLoanWithScheduleAndPayments(loanId);
      return NextResponse.json(
        buildResponse({
          payment: saveResult.payment,
          duplicate: true,
          allocations: saveResult.payment.allocations,
          instalments: refreshed.instalments,
        }),
        { status: 201 },
      );
    }

    // Apply this payment's own deltas in memory rather than round-tripping
    // to the DB again just to derive the position.
    const appliedBySequence = new Map(appliedTo.map((a) => [a.sequenceNumber, a.amountAppliedPaise]));
    const updatedInstalments = instalments.map((i) => {
      const applied = appliedBySequence.get(i.sequenceNumber);
      return applied ? { ...i, amountPaidPaise: i.amountPaidPaise + applied } : i;
    });

    return NextResponse.json(
      buildResponse({
        payment: saveResult.payment,
        duplicate: false,
        allocations: saveResult.allocations,
        instalments: updatedInstalments,
        appliedTo,
      }),
      { status: 201 },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}

function buildResponse(input: {
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
