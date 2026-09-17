import { paiseToRupees } from "@/lib/money";
import { instalmentStatus, type Instalment } from "@/lib/types";
import type { Position } from "@/lib/services/positionService";
import type { LoanRecord } from "@/lib/repository/loanRepository";

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export function serializeLoanHeader(loan: LoanRecord) {
  return {
    id: loan.id,
    principal: paiseToRupees(loan.principalPaise),
    annualInterestRate: loan.annualInterestRate,
    tenureMonths: loan.tenureMonths,
    disbursementDate: isoDate(loan.disbursementDate),
    emiAmount: paiseToRupees(loan.emiAmountPaise),
  };
}

export function serializeInstalment(instalment: Instalment) {
  return {
    sequenceNumber: instalment.sequenceNumber,
    dueDate: isoDate(instalment.dueDate),
    principalComponent: paiseToRupees(instalment.principalComponentPaise),
    interestComponent: paiseToRupees(instalment.interestComponentPaise),
    totalDue: paiseToRupees(instalment.totalDuePaise),
    amountPaid: paiseToRupees(instalment.amountPaidPaise),
    status: instalmentStatus(instalment),
  };
}

export function serializePosition(position: Position) {
  return {
    outstandingPrincipal: paiseToRupees(position.outstandingPrincipalPaise),
    nextDueDate: position.nextDueDate ? isoDate(position.nextDueDate) : null,
    nextDueAmount:
      position.nextDueAmountPaise !== null ? paiseToRupees(position.nextDueAmountPaise) : null,
    overdueAmount: paiseToRupees(position.overdueAmountPaise),
  };
}
