import { getFirebaseAuth } from "@/lib/firebase/client";

// Attaches the current Firebase user's ID token as a Bearer header. Every
// API route requires this - there is no unauthenticated path in the UI.
export async function authedFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error("Not signed in");
  }
  const token = await user.getIdToken();

  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...options.headers,
      authorization: `Bearer ${token}`,
    },
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error?.message ?? `Request to ${path} failed`);
  }
  return body as T;
}
