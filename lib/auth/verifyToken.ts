import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { unauthorized } from "@/lib/errors";

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

// Verifies the Authorization: Bearer <token> header server-side via the
// Firebase Admin SDK - the browser's possession of a token is never treated
// as sufficient on its own (SRS §3.4). Throws UNAUTHORIZED on anything
// missing, malformed, or invalid; callers let it propagate to the shared
// error handler.
export async function requireAuth(request: Request): Promise<AuthenticatedUser> {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : null;

  if (!token) {
    throw unauthorized();
  }

  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    throw unauthorized();
  }
}
