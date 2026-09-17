// Mirrors the JSON shapes returned by app/api/loans/**/route.ts (SRS §3).

export interface LoanSummary {
  id: string;
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  disbursementDate: string;
  emiAmount: number;
}

export interface ScheduleRow {
  sequenceNumber: number;
  dueDate: string;
  principalComponent: number;
  interestComponent: number;
  totalDue: number;
  amountPaid: number;
  status: "PENDING" | "PARTIALLY_PAID" | "PAID";
}

export interface Position {
  outstandingPrincipal: number;
  nextDueDate: string | null;
  nextDueAmount: number | null;
  overdueAmount: number;
}

export interface LoanDetail extends LoanSummary {
  schedule: ScheduleRow[];
  position: Position;
}

export interface AppliedAllocation {
  sequenceNumber: number;
  amountApplied: number;
}

export interface PaymentResponse {
  payment: { id: string; amount: number; date: string };
  duplicate: boolean;
  appliedTo: AppliedAllocation[];
  position: Position;
}
