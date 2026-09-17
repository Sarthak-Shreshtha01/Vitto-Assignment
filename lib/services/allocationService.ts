import type { Instalment } from "@/lib/types";

export interface AppliedAllocation {
  sequenceNumber: number;
  amountAppliedPaise: bigint;
}

export interface AllocationResult {
  updatedInstalments: Instalment[];
  appliedTo: AppliedAllocation[];
  // Left over if the payment exceeds total outstanding across every
  // instalment given. Not applied anywhere — no negative balances, no
  // credit account (SRS §3.3.2.e, §7.2). Reported for the caller to surface.
  excessPaise: bigint;
}

// Allocates a payment across outstanding instalments, oldest-due-first,
// fully settling one before moving to the next (SRS §7.1-7.2). `instalments`
// must already be filtered to amountPaid < totalDue and sorted by dueDate
// ascending - this function trusts that ordering rather than re-deriving it.
// Interest/principal split is fixed at schedule-generation time and isn't
// re-split here; a payment simply reduces an instalment's outstanding
// balance (amountPaidPaise).
export function allocate(instalments: Instalment[], paymentAmountPaise: bigint): AllocationResult {
  let remainingPaise = paymentAmountPaise;
  const appliedTo: AppliedAllocation[] = [];

  const updatedInstalments = instalments.map((instalment) => {
    const outstandingPaise = instalment.totalDuePaise - instalment.amountPaidPaise;
    if (remainingPaise <= 0n || outstandingPaise <= 0n) {
      return instalment;
    }

    const amountAppliedPaise = remainingPaise < outstandingPaise ? remainingPaise : outstandingPaise;
    remainingPaise -= amountAppliedPaise;
    appliedTo.push({ sequenceNumber: instalment.sequenceNumber, amountAppliedPaise });

    return { ...instalment, amountPaidPaise: instalment.amountPaidPaise + amountAppliedPaise };
  });

  return { updatedInstalments, appliedTo, excessPaise: remainingPaise };
}
