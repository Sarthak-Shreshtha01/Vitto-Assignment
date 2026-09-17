import { signOut } from "firebase/auth";
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

async function getIdToken(forceRefresh: boolean): Promise<string> {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new ApiClientError(401, "UNAUTHENTICATED", "Not signed in");
  }
  return user.getIdToken(forceRefresh);
}

async function parseErrorBody(response: Response): Promise<{ code?: string; message?: string }> {
  try {
    const body = await response.json();
    return body?.error ?? {};
  } catch {
    return {};
  }
}

// The single place every frontend API call goes through. Every route
// requires auth, so this always attaches a Bearer token - and it's the one
// place that knows what to do when that token stops being good enough:
//
// - 401 on the first attempt might just mean the cached token expired
//   (Firebase tokens are short-lived) - force a refresh and retry once.
// - 401 again after a fresh token means the session itself is invalid
//   (revoked/deleted user) - sign out so AuthGate sends the user back to
//   sign-in, rather than leaving them stuck retrying forever.
// - 403 means authenticated but not permitted - surfaced distinctly since
//   retrying or signing out wouldn't help (no role/permission model exists
//   yet, but this keeps the client correct if one is ever added).
export async function authedFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  return request<T>(path, options, false);
}

async function request<T>(path: string, options: RequestInit, isRetry: boolean): Promise<T> {
  const token = await getIdToken(isRetry);

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
