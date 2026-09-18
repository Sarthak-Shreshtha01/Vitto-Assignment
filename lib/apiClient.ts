import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

// Thrown for any non-2xx API response. Carries the HTTP status and the
// backend's error code (SRS §8) so callers can react to specific cases
// (e.g. distinguishing an expired session from a plain validation error)
// instead of parsing error.message.
export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

// This module owns the access token's entire lifecycle - nothing else in
// the app touches getIdToken() directly. A Firebase ID token is a JWT valid
// for ~1 hour; instead of trusting the SDK's internal refresh timing
// silently, we decode its own `exp` claim and track expiry ourselves, so
// the decision to refresh is explicit and testable rather than implicit.
let cachedToken: { value: string; expiresAtMs: number } | null = null;

const REFRESH_SKEW_MS = 60_000; // refresh a minute early rather than cutting it exactly at expiry

function decodeTokenExpiryMs(token: string): number {
  const payload = token.split(".")[1];
  const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  return decoded.exp * 1000;
}

// Called on sign-out so a stale token can never be reused if a different
// user signs in afterward.
export function clearCachedToken(): void {
  cachedToken = null;
}

async function fetchAndCacheToken(user: User, forceRefresh: boolean): Promise<string> {
  const token = await user.getIdToken(forceRefresh);
  cachedToken = { value: token, expiresAtMs: decodeTokenExpiryMs(token) };
  return token;
}

const AUTH_READY_TIMEOUT_MS = 5000;

// `auth.currentUser` is a synchronous getter, but Firebase doesn't
// guarantee it's already populated the instant a component's effect runs
// right after AuthGate reacts to a sign-in - reading it directly can race
// and see null for a brief moment even though the user really is signed
// in (this is what was causing "Not signed in" to flash right after a
// successful sign-in). Waiting on the auth-state stream instead resolves
// immediately if the state is already known, and otherwise waits for the
// definitive answer rather than guessing from a possibly-stale read.
function waitForCurrentUser(): Promise<User> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      unsubscribe();
      reject(new ApiClientError(401, "UNAUTHENTICATED", "Not signed in"));
    }, AUTH_READY_TIMEOUT_MS);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout);
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        reject(new ApiClientError(401, "UNAUTHENTICATED", "Not signed in"));
      }
    });
  });
}

// Returns a token known to be valid for at least REFRESH_SKEW_MS longer,
// refreshing proactively (before any request fails) rather than only
// reacting to a 401. `forceRefresh` bypasses the cache entirely - used by
// the retry path below when a request still gets a 401 despite a
// seemingly-valid cached token (e.g. the user's session was revoked).
async function getValidIdToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedToken && cachedToken.expiresAtMs - Date.now() > REFRESH_SKEW_MS) {
    return cachedToken.value;
  }

  const user = await waitForCurrentUser();
  return fetchAndCacheToken(user, forceRefresh);
}

async function parseErrorBody(response: Response): Promise<{ code?: string; message?: string }> {
  try {
    const body = await response.json();
    return body?.error ?? {};
  } catch {
    return {};
  }
}

// The single place every frontend API call goes through - components never
// call fetch() or touch a Firebase token directly. Handles:
//
// - Proactive refresh: a token about to expire is refreshed before the
//   request is even sent (see getValidIdToken above).
// - Reactive refresh: if a request still comes back 401 despite that (a
//   clock skew, or the cache being wrong), force a fresh token and retry
//   exactly once.
// - A 401 that persists after a forced refresh means the session itself is
//   invalid (revoked/deleted user) - sign out so AuthGate sends the user
//   back to sign-in, rather than leaving the UI stuck retrying forever.
// - A 403 is surfaced distinctly (no retry/sign-out - there's no
//   permission model yet, but this keeps the client correct if one is
//   ever added).
export async function authedFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, options, false);
}

async function request<T>(path: string, options: RequestInit, isRetry: boolean): Promise<T> {
  const token = await getValidIdToken(isRetry);

  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...options.headers,
      authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 && !isRetry) {
    return request<T>(path, options, true);
  }

  if (response.status === 401) {
    cachedToken = null;
    await signOut(getFirebaseAuth()).catch(() => {});
    const { code } = await parseErrorBody(response);
    throw new ApiClientError(401, code ?? "UNAUTHORIZED", "Your session has expired. Please sign in again.");
  }

  if (response.status === 403) {
    const { code, message } = await parseErrorBody(response);
    throw new ApiClientError(403, code ?? "FORBIDDEN", message ?? "You don't have permission to do that.");
  }

  if (!response.ok) {
    const { code, message } = await parseErrorBody(response);
    throw new ApiClientError(response.status, code ?? "UNKNOWN_ERROR", message ?? `Request to ${path} failed`);
  }

  return (await response.json()) as T;
}
