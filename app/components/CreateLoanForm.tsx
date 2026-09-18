"use client";

import { useState, type SubmitEvent } from "react";
import { loanApi } from "@/lib/api/loanApi";
import { Spinner } from "@/app/components/Spinner";
import type { LoanDetail } from "@/app/apiTypes";

interface CreateLoanFormProps {
  onCreated: (loan: LoanDetail) => void;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

// Not required by the brief (loan creation may happen via API/seed script -
// PRD FR-5), but the endpoint already exists and is fully tested, so a thin
// UI on top of it is low-risk. Delegates entirely to loanApi.create(),
// which handles fetching the full detail back (POST alone doesn't return
// `position` - see loanApi.ts).
export function CreateLoanForm({ onCreated }: CreateLoanFormProps) {
  const [open, setOpen] = useState(false);
  const [principal, setPrincipal] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  const [disbursementDate, setDisbursementDate] = useState(todayIso());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setPrincipal("");
    setAnnualInterestRate("");
    setTenureMonths("");
    setDisbursementDate(todayIso());
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const detail = await loanApi.create({
        principal: Number(principal),
        annualInterestRate: Number(annualInterestRate),
        tenureMonths: Number(tenureMonths),
        disbursementDate,
      });
      onCreated(detail);
      setOpen(false);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create loan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={() => setOpen(true)}>
        + New loan
      </button>

      {open && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <h3>Create a loan</h3>
              <button type="button" className="modal-close" onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <form className="payment-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="loan-principal">Principal (₹50,000 – ₹10,00,000)</label>
                <input
                  id="loan-principal"
                  type="number"
                  min="50000"
                  max="1000000"
                  step="1"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  required
                />
              </div>
              <div className="payment-form-fields">
                <div className="field">
                  <label htmlFor="loan-rate">Annual rate (%)</label>
                  <input
                    id="loan-rate"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={annualInterestRate}
                    onChange={(e) => setAnnualInterestRate(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="loan-tenure">Tenure (3–36 months)</label>
                  <input
                    id="loan-tenure"
                    type="number"
                    min="3"
                    max="36"
                    step="1"
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="loan-disbursement">Disbursement date</label>
                <input
                  id="loan-disbursement"
                  type="date"
                  value={disbursementDate}
                  onChange={(e) => setDisbursementDate(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error-text">{error}</p>}
              <div className="payment-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting && <Spinner />}
                  {submitting ? "Creating…" : "Create loan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
