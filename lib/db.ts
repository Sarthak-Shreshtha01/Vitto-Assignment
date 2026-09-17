import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient across hot reloads in dev so we don't
// exhaust the DB connection pool (Next.js re-evaluates modules per request
// in dev mode without this guard).
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
