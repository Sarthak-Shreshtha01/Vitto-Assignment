"use client";

import { useState, type FormEvent } from "react";
import { authedFetch } from "@/lib/apiClient";
import type { PaymentResponse } from "@/app/apiTypes";
import { Spinner } from "@/app/components/Spinner";

interface PaymentFormProps {
  loanId: string;
  onRecorded: (response: PaymentResponse) => void;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export function PaymentForm({ loanId, onRecorded }: PaymentFormProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await authedFetch<PaymentResponse>(`/api/loans/${loanId}/payments`, {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount), date }),
      });
      onRecorded(response);
      setAmount("");
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
        Record payment
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
              <h3>Record a payment</h3>
              <button type="button" className="modal-close" onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <form className="payment-form" onSubmit={handleSubmit}>
              <div className="payment-form-fields">
                <div className="field">
                  <label htmlFor="payment-amount">Amount (₹)</label>
                  <input
                    id="payment-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="payment-date">Date</label>
                  <input
                    id="payment-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <p className="error-text">{error}</p>}
              <div className="payment-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting && <Spinner />}
                  {submitting ? "Recording…" : "Record payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
