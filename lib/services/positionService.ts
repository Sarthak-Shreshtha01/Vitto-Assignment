import type { Instalment } from "@/lib/types";

export interface Position {
  outstandingPrincipalPaise: bigint;
  nextDueDate: Date | null;
  nextDueAmountPaise: bigint | null;
  overdueAmountPaise: bigint;
}

// Derives a loan's current position from its instalments and today's date -
// never stored, always recomputed, so it can't drift out of sync (SRS §4.2).
// `instalments` must already be sorted by sequenceNumber/dueDate ascending.
//
// outstandingPrincipal: since interest/principal aren't re-split per payment
// (SRS §7.1), there's no sub-instalment principal figure to report once an
// instalment has been touched. So an instalment's full principal component
// counts as outstanding only until it receives its first payment (partial or
// full) - only untouched instalments (amountPaid === 0) contribute.
export function derivePosition(instalments: Instalment[], today: Date): Position {
  let outstandingPrincipalPaise = 0n;
  let overdueAmountPaise = 0n;
  let nextDue: Instalment | null = null;

  for (const instalment of instalments) {
    if (instalment.amountPaidPaise === 0n) {
      outstandingPrincipalPaise += instalment.principalComponentPaise;
    }

    const isUnpaid = instalment.amountPaidPaise < instalment.totalDuePaise;

    if (isUnpaid && !nextDue) {
      nextDue = instalment;
    }

    // Overdue definition (SRS §7.3): today > due_date AND amount_paid < total_due.
    if (isUnpaid && isStrictlyBeforeDate(instalment.dueDate, today)) {
      overdueAmountPaise += instalment.totalDuePaise - instalment.amountPaidPaise;
    }
  }

  return {
    outstandingPrincipalPaise,
    nextDueDate: nextDue?.dueDate ?? null,
    nextDueAmountPaise: nextDue ? nextDue.totalDuePaise - nextDue.amountPaidPaise : null,
    overdueAmountPaise,
  };
}

// Compares calendar dates only (ignores time-of-day), in UTC.
function isStrictlyBeforeDate(a: Date, b: Date): boolean {
  const dateOnly = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return dateOnly(a) < dateOnly(b);
}
