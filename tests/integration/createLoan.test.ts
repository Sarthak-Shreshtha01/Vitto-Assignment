import { afterAll, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db";
import { POST } from "@/app/api/loans/route";

// Auth itself has its own dedicated test (tests/integration/auth.test.ts).
// This test is about the route -> service -> repository -> DB path, so the
// auth boundary is stubbed rather than requiring a real Firebase token.
vi.mock("@/lib/auth/verifyToken", () => ({
  requireAuth: vi.fn().mockResolvedValue({ uid: "test-user", email: "test@example.com" }),
}));

describe("POST /api/loans (integration - success path)", () => {
  const createdLoanIds: string[] = [];

  it("creates a loan with its full schedule against the real database", async () => {
    const request = new Request("http://localhost/api/loans", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer fake-token" },
      body: JSON.stringify({
        principal: 200000,
        annualInterestRate: 18,
        tenureMonths: 24,
        disbursementDate: "2026-01-05",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const body = await response.json();
    createdLoanIds.push(body.id);

    expect(body.emiAmount).toBeGreaterThan(0);
    expect(body.schedule).toHaveLength(24);
    expect(body.schedule[0].status).toBe("PENDING");
    expect(body.schedule[0].amountPaid).toBe(0);

    const dbLoan = await prisma.loan.findUnique({
      where: { id: body.id },
      include: { instalments: true },
    });
    expect(dbLoan).not.toBeNull();
    expect(dbLoan?.instalments).toHaveLength(24);
  });

  afterAll(async () => {
    await prisma.loan.deleteMany({ where: { id: { in: createdLoanIds } } }); // cascades
    await prisma.$disconnect();
  });
});
