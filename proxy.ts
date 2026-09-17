import { NextResponse, type NextRequest } from "next/server";
import { setTrustedAuthHeaders, verifyBearerToken } from "@/lib/auth/verifyToken";

// Runs in front of every /api/* request (Node.js runtime by default as of
// Next.js 16, which is what makes it possible to use the Firebase Admin SDK
// here at all - it needs real Node APIs, not the old Edge runtime).
//
// This is the "Auth Middleware" from docs/Architecture.md §4.2/§8: it
// verifies the Firebase ID token once, up front, before a request reaches
// any route/controller code or touches the database. On success it attaches
// the verified identity as internal request headers for the controller to
// read (see lib/auth/verifyToken.ts's requireAuth()); on failure it
// short-circuits with 401 immediately.
//
// Controllers still call requireAuth() themselves rather than trusting this
// alone - Next's own docs warn that a routing change could silently skip
// proxy, and anything that invokes a route handler directly (our
// integration tests, for instance) bypasses this file entirely.
export async function proxy(request: NextRequest) {
  const user = await verifyBearerToken(request);

  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Missing or invalid authentication token" } },
      { status: 401 },
    );
  }

  const headers = new Headers(request.headers);
  setTrustedAuthHeaders(headers, user);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/api/:path*"],
};
