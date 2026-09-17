"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { SignIn } from "@/app/components/SignIn";

interface AuthGateProps {
  children: (user: User) => React.ReactNode;
}

// Redirects unauthenticated visitors to sign-in and provides a sign-out
// action, per FR-4/SRS §3.4. The actual token verification happens
// server-side on every API request (lib/auth/verifyToken.ts) - this only
// gates the UI.
export function AuthGate({ children }: AuthGateProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(getFirebaseAuth(), setUser), []);

  if (user === undefined) {
    return <p>Loading…</p>;
  }

  if (user === null) {
    return <SignIn />;
  }

  return (
    <div>
      <header className="app-header">
        <span>Signed in as {user.email}</span>
        <button type="button" onClick={() => signOut(getFirebaseAuth())}>
          Sign out
        </button>
      </header>
      {children(user)}
    </div>
  );
}
