"use client";

import { useCallback, useState } from "react";
import { AuthGate } from "@/app/components/AuthGate";
import { LoanPicker } from "@/app/components/LoanPicker";
import { ScheduleTable } from "@/app/components/ScheduleTable";
import { PositionCard } from "@/app/components/PositionCard";
import { PaymentForm } from "@/app/components/PaymentForm";
import { LoanDetailSkeleton } from "@/app/components/LoanDetailSkeleton";
import { authedFetch } from "@/lib/apiClient";
import type { LoanDetail, PaymentResponse } from "@/app/apiTypes";

export default function Home() {
  const [loanId, setLoanId] = useState<string | null>(null);
  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectLoan = useCallback((id: string) => {
    setLoanId(id);
    setLoading(true);
    setError(null);
    authedFetch<LoanDetail>(`/api/loans/${id}`)
      .then(setLoan)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load loan"))
      .finally(() => setLoading(false));
  }, []);

  // Applies the payment response's own deltas locally, so the schedule and
  // position update immediately without a manual refresh (FR-5/SRS §3.5).
  function handlePaymentRecorded(response: PaymentResponse) {
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

  return (
    <AuthGate>
      {() => (
        <main className="main-content">
          <LoanPicker selectedLoanId={loanId} onSelect={handleSelectLoan} />
          {error && <p className="error-text">{error}</p>}
          {loading && <LoanDetailSkeleton />}
          {!loading && loan && (
            <>
              <PositionCard position={loan.position} />
              <ScheduleTable
                schedule={loan.schedule}
                actions={<PaymentForm loanId={loan.id} onRecorded={handlePaymentRecorded} />}
              />
            </>
          )}
        </main>
      )}
    </AuthGate>
  );
}
