// Shared domain types for the pure service layer. Traces to docs/SRS.md §4.2.
// Money fields are always integer paise (BigInt) — never float/double.

export interface Instalment {
  sequenceNumber: number;
  dueDate: Date;
  principalComponentPaise: bigint;
  interestComponentPaise: bigint;
  totalDuePaise: bigint;
  amountPaidPaise: bigint;
}

export type InstalmentStatus = "PENDING" | "PARTIALLY_PAID" | "PAID";

// Derived, never stored — SRS §3.2.
export function instalmentStatus(instalment: Instalment): InstalmentStatus {
  if (instalment.amountPaidPaise <= 0n) return "PENDING";
  if (instalment.amountPaidPaise < instalment.totalDuePaise) return "PARTIALLY_PAID";
  return "PAID";
}
