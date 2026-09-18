import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/health - a trivial, unauthenticated DB-connectivity check (PRD
// §14 differentiator). Deliberately excluded from proxy.ts's auth
// enforcement, same as any real health-check endpoint would need to be, so
// uptime monitoring can hit it without a Firebase token.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "error", database: "disconnected" }, { status: 503 });
  }
}
