"use client";

import { useEffect, useState } from "react";
import { authedFetch } from "@/lib/apiClient";
import type { LoanSummary } from "@/app/apiTypes";

interface LoanPickerProps {
  selectedLoanId: string | null;
  onSelect: (loanId: string) => void;
}

// Backed by GET /api/loans (PRD §14 differentiator) - the honest way to let
// the reviewer pick a loan instead of hardcoding an id in the UI.
export function LoanPicker({ selectedLoanId, onSelect }: LoanPickerProps) {
  const [loans, setLoans] = useState<LoanSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authedFetch<LoanSummary[]>("/api/loans")
      .then((data) => {
        setLoans(data);
        if (data.length > 0 && !selectedLoanId) {
          onSelect(data[0].id);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load loans"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <p className="error-text">{error}</p>;
  if (!loans) return <p>Loading loans…</p>;
  if (loans.length === 0) return <p>No loans yet.</p>;

  return (
    <label className="loan-picker">
      Loan:{" "}
      <select value={selectedLoanId ?? ""} onChange={(e) => onSelect(e.target.value)}>
        {loans.map((loan) => (
          <option key={loan.id} value={loan.id}>
            {loan.id} — ₹{loan.principal.toLocaleString("en-IN")} @ {loan.annualInterestRate}%
          </option>
        ))}
      </select>
    </label>
  );
}
