// Firebase Auth throws errors with a stable `.code` (e.g. "auth/wrong-password")
// but a raw, unfriendly `.message` ("Firebase: Error (auth/wrong-password).").
// This maps the codes we're likely to actually hit to plain language.
const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/invalid-email": "That doesn't look like a valid email address.",
  "auth/email-already-in-use": "An account with this email already exists — try signing in instead.",
  "auth/weak-password": "That password is too weak — Firebase requires at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error — check your connection and try again.",
  "auth/user-disabled": "This account has been disabled.",
};

export function getAuthErrorMessage(error: unknown): string {
  const code = typeof error === "object" && error !== null ? (error as { code?: unknown }).code : undefined;
  if (typeof code === "string" && MESSAGES[code]) {
    return MESSAGES[code];
  }
  return "Something went wrong. Please try again.";
}
