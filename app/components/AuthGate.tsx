"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { clearCachedToken } from "@/lib/apiClient";
import { SignIn } from "@/app/components/SignIn";
import { BrandMark } from "@/app/components/BrandMark";
import { Spinner } from "@/app/components/Spinner";

interface AuthGateProps {
  children: (user: User) => React.ReactNode;
}

// Redirects unauthenticated visitors to sign-in and provides a sign-out
// action, per FR-4/SRS §3.4. The actual token verification happens
// server-side on every API request (proxy.ts + lib/auth/verifyToken.ts) -
// this only gates the UI.
export function AuthGate({ children }: AuthGateProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(getFirebaseAuth(), setUser), []);

  async function handleSignOut() {
    clearCachedToken();
    await signOut(getFirebaseAuth());
  }

  if (user === undefined) {
    return (
      <div className="app-shell app-loading">
        <BrandMark size={36} />
        <Spinner size={24} />
      </div>
    );
  }

  if (user === null) {
    return <SignIn />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <BrandMark />
          <div className="brand-text">
            <span className="brand-wordmark">Vitto</span>
            <span className="brand-subtitle">Loan Repayment Service</span>
          </div>
        </div>
        <div className="user-info">
          <span className="user-email">{user.email}</span>
          <button type="button" className="btn-text" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>
      {children(user)}
    </div>
  );
}
