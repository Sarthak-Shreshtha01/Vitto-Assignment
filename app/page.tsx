"use client";

import { useEffect } from "react";
import { AuthGate } from "@/app/components/AuthGate";
import { LoanPicker } from "@/app/components/LoanPicker";
import { ScheduleTable } from "@/app/components/ScheduleTable";
import { PositionCard } from "@/app/components/PositionCard";
import { PaymentForm } from "@/app/components/PaymentForm";
import { CreateLoanForm } from "@/app/components/CreateLoanForm";
import { LoanDetailSkeleton } from "@/app/components/LoanDetailSkeleton";
import { useLoans } from "@/lib/hooks/useLoans";
import { useLoanDetail } from "@/lib/hooks/useLoanDetail";
import type { LoanDetail } from "@/app/apiTypes";

export default function Home() {
  const { loans, error: loansError, addLoan } = useLoans();
  const { loanId, loan, loading, error, select, setDetail, applyPayment } = useLoanDetail();

  // Auto-select the first loan once the list arrives, so there's never an
  // empty state to click through on a normal visit.
  useEffect(() => {
    if (loans && loans.length > 0 && !loanId) {
      select(loans[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans]);

  function handleLoanCreated(created: LoanDetail) {
    addLoan({
      id: created.id,
      principal: created.principal,
      annualInterestRate: created.annualInterestRate,
      tenureMonths: created.tenureMonths,
      disbursementDate: created.disbursementDate,
      emiAmount: created.emiAmount,
    });
    setDetail(created);
  }

  return (
    <AuthGate>
      {() => (
        <main className="main-content">
          <LoanPicker
            loans={loans}
            error={loansError}
            selectedLoanId={loanId}
            onSelect={select}
            actions={<CreateLoanForm onCreated={handleLoanCreated} />}
          />
          {error && <p className="error-text">{error}</p>}
          {loading && <LoanDetailSkeleton />}
          {!loading && loan && (
            <>
              <PositionCard position={loan.position} />
              <ScheduleTable
                schedule={loan.schedule}
                actions={<PaymentForm loanId={loan.id} onRecorded={applyPayment} />}
              />
            </>
          )}
        </main>
      )}
    </AuthGate>
  );
}
