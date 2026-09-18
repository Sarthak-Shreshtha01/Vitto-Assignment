import { authedFetch } from "@/lib/apiClient";
import { endpoints } from "@/lib/api/endpoints";
import type { LoanDetail, LoanSummary, PaymentResponse } from "@/app/apiTypes";

export interface CreateLoanPayload {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  disbursementDate: string;
}

export interface RecordPaymentPayload {
  amount: number;
  date: string;
}

// The frontend's API layer: the only module that calls authedFetch, and
// the only place that knows the shape of each request/response. Components
// and hooks never touch fetch/authedFetch or a "/api/..." path directly -
// they call loanApi.*, which stays type-safe end to end.

function listLoans(): Promise<LoanSummary[]> {
  return authedFetch<LoanSummary[]>(endpoints.loans.list);
}

function getLoan(loanId: string): Promise<LoanDetail> {
  return authedFetch<LoanDetail>(endpoints.loans.detail(loanId));
}

async function createLoan(payload: CreateLoanPayload): Promise<LoanDetail> {
  const created = await authedFetch<{ id: string }>(endpoints.loans.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  // POST /api/loans doesn't return `position` (SRS §3.1's response is
  // schedule-only, by design) - fetch the full detail so callers always
  // get a complete LoanDetail back from createLoan(), same as getLoan().
  return getLoan(created.id);
}

function recordPayment(loanId: string, payload: RecordPaymentPayload): Promise<PaymentResponse> {
  return authedFetch<PaymentResponse>(endpoints.loans.payments(loanId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export const loanApi = { list: listLoans, get: getLoan, create: createLoan, recordPayment };
