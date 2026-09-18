import { useCallback, useState } from "react";
import { loanApi } from "@/lib/api/loanApi";
import type { LoanDetail, PaymentResponse } from "@/app/apiTypes";

// View-model for the currently selected loan's full detail (schedule +
// position). Owns loading/error state so components stay purely
// declarative - they call `select`, render based on `loan`/`loading`/
// `error`, and never touch loanApi or authedFetch themselves.
export function useLoanDetail() {
  const [loanId, setLoanId] = useState<string | null>(null);
  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const select = useCallback((id: string) => {
    setLoanId(id);
    setLoading(true);
    setError(null);
    loanApi
      .get(id)
      .then(setLoan)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load loan"))
      .finally(() => setLoading(false));
  }, []);

  // Used when a loan is created client-side and we already have its full
  // detail (loanApi.create() returns one) - no need to refetch.
  function setDetail(detail: LoanDetail) {
    setLoanId(detail.id);
    setLoan(detail);
  }

  // Applies a payment response's own deltas locally, so the schedule and
  // position update immediately without a manual refresh (FR-5/SRS §3.5).
  function applyPayment(response: PaymentResponse) {
    setLoan((current) => {
      if (!current) return current;
      const appliedBySequence = new Map(
        response.appliedTo.map((a) => [a.sequenceNumber, a.amountApplied]),
      );

      return {
        ...current,
        position: response.position,
        schedule: current.schedule.map((row) => {
          const applied = appliedBySequence.get(row.sequenceNumber);
          if (!applied) return row;
          const amountPaid = row.amountPaid + applied;
          return {
            ...row,
            amountPaid,
            status: amountPaid >= row.totalDue ? "PAID" : amountPaid > 0 ? "PARTIALLY_PAID" : "PENDING",
          };
        }),
      };
    });
  }

  return { loanId, loan, loading, error, select, setDetail, applyPayment };
}
