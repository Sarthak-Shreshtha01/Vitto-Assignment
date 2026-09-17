"use client";

import { useState, type FormEvent } from "react";
import { authedFetch } from "@/lib/apiClient";
import type { PaymentResponse } from "@/app/apiTypes";

interface PaymentFormProps {
  loanId: string;
  onRecorded: (response: PaymentResponse) => void;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export function PaymentForm({ loanId, onRecorded }: PaymentFormProps) {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2>Record a payment</h2>
      <label>
        Amount (₹)
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>
      <label>
        Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? "Recording…" : "Record payment"}
      </button>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
}
