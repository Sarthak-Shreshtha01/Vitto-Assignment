import { useEffect, useState } from "react";
import { loanApi } from "@/lib/api/loanApi";
import type { LoanSummary } from "@/app/apiTypes";

// View-model for the loan list: loads it once, and exposes a way to fold a
// freshly created loan in locally rather than refetching the whole list.
export function useLoans() {
  const [loans, setLoans] = useState<LoanSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loanApi
      .list()
      .then(setLoans)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load loans"));
  }, []);

  function addLoan(loan: LoanSummary) {
    setLoans((current) => [loan, ...(current ?? [])]);
  }

  return { loans, error, addLoan };
}
