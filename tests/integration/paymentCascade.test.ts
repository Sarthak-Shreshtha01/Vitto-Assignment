import { afterAll, describe, expect, it } from "vitest";
import { generateSchedule } from "@/lib/services/scheduleService";
import { allocate } from "@/lib/services/allocationService";
import {
  createLoanWithSchedule,
  findLoanWithScheduleAndPayments,
  savePaymentWithAllocations,
} from "@/lib/repository/loanRepository";
import { prisma } from "@/lib/db";

// Regression test for a real bug: a payment large enough to cascade across
// many instalments used to time out mid-transaction against the hosted
// Supabase pooler (sequential round-trips per instalment blew past
// Prisma's 5s interactive-transaction timeout - see loanRepository.ts's
// savePaymentWithAllocations, which now parallelizes those writes and
// raises the timeout as a second line of defense).
describe("savePaymentWithAllocations (integration - large cascade)", () => {
  let loanId: string;

  it("applies a single payment across every instalment in a 24-month loan without timing out", async () => {
    const { emiAmountPaise, instalments } = generateSchedule(
      100000000n, // ₹10,00,000 - the max allowed principal
      11,
      24,
      new Date("2026-01-05"),
    );

    const { loan, instalments: saved } = await createLoanWithSchedule({
      principalPaise: 100000000n,
      annualInterestRate: 11,
      tenureMonths: 24,
      disbursementDate: new Date("2026-01-05"),
      emiAmountPaise,
      instalments,
    });
    loanId = loan.id;

    const totalDuePaise = saved.reduce((sum, i) => sum + i.totalDuePaise, 0n);
    const { appliedTo } = allocate(saved, totalDuePaise);
    expect(appliedTo).toHaveLength(24); // touches every instalment

    const instalmentIdBySequence = new Map(saved.map((i) => [i.sequenceNumber, i.id]));
    const result = await savePaymentWithAllocations({
      loanId,
      amountPaise: totalDuePaise,
      date: new Date("2026-01-05"),
      appliedTo: appliedTo.map((a) => ({
        instalmentId: instalmentIdBySequence.get(a.sequenceNumber)!,
        amountAppliedPaise: a.amountAppliedPaise,
      })),
    });

    expect(result.duplicate).toBe(false);
    if (result.duplicate) throw new Error("unreachable");
    expect(result.allocations).toHaveLength(24);

    const { instalments: final } = await findLoanWithScheduleAndPayments(loanId);
    expect(final.every((i) => i.amountPaidPaise === i.totalDuePaise)).toBe(true);
  });

  afterAll(async () => {
    if (loanId) await prisma.loan.delete({ where: { id: loanId } }); // cascades
    await prisma.$disconnect();
  });
});
