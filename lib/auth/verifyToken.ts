import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { unauthorized } from "@/lib/errors";

// Headers proxy.ts sets once it has independently verified the caller's
// Firebase token, so a controller's requireAuth() call doesn't have to
// re-verify on every request. proxy.ts always overwrites these on the way
// in, so a client can't forge them - see proxy.ts for why that's safe.
const TRUSTED_UID_HEADER = "x-verified-uid";
const TRUSTED_EMAIL_HEADER = "x-verified-email";

function getAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // .env stores literal "\n" escapes in the private key; convert back
      // to real newlines before handing it to the SDK.
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export interface AuthenticatedUser {
  uid: string;
  email: string | null;
}

// The actual Firebase Admin verification of an Authorization: Bearer
// <token> header. Returns null (never throws) on anything missing,
// malformed, or invalid - callers decide how to respond. Used by both
// proxy.ts (the primary check) and requireAuth()'s fallback below.
export async function verifyBearerToken(request: Request): Promise<AuthenticatedUser | null> {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : null;
  if (!token) return null;

  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
}

// Reads the already-verified identity proxy.ts attached, if present.
export function getUserFromTrustedHeaders(request: Request): AuthenticatedUser | null {
  const uid = request.headers.get(TRUSTED_UID_HEADER);
  if (!uid) return null;
  return { uid, email: request.headers.get(TRUSTED_EMAIL_HEADER) };
}

export function setTrustedAuthHeaders(headers: Headers, user: AuthenticatedUser): void {
  headers.set(TRUSTED_UID_HEADER, user.uid);
  if (user.email) headers.set(TRUSTED_EMAIL_HEADER, user.email);
}

// The single auth check every controller calls. Trusts proxy.ts's
// already-verified headers when present (the normal case for real traffic,
// avoiding a second Admin SDK round-trip); otherwise verifies the token
// directly. That fallback matters for two reasons: Next.js's own docs warn
// against relying on proxy alone (a routing change could silently skip it),
// and our integration tests invoke route handlers directly, bypassing
// proxy.ts entirely (SRS §3.4).
export async function requireAuth(request: Request): Promise<AuthenticatedUser> {
  const trusted = getUserFromTrustedHeaders(request);
  if (trusted) return trusted;

  const verified = await verifyBearerToken(request);
  if (!verified) throw unauthorized();
  return verified;
}
