"use client";

import { useState, type FormEvent } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { BrandMark } from "@/app/components/BrandMark";
import { Spinner } from "@/app/components/Spinner";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const auth = getFirebaseAuth();
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-shell sign-in-page">
      <div className="sign-in sign-in-card">
        <div className="sign-in-header">
          <BrandMark size={36} />
          <div>
            <h1>Loan Repayment Service</h1>
            <p>Internal Ops Portal · Sign in to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting && <Spinner />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          className="link-button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}
