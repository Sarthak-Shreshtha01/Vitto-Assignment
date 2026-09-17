import { describe, expect, it } from "vitest";
import { generateSchedule } from "@/lib/services/scheduleService";

describe("generateSchedule", () => {
  it("computes the EMI within the PRD's stated rounding tolerance and produces one row per month", () => {
    // PRD §7 reference case: ₹2,00,000 @ 18% p.a. over 24 months ⇒ EMI ≈ ₹9,986/month.
    const { emiAmountPaise, instalments } = generateSchedule(
      20000000n,
      18,
      24,
      new Date("2026-01-05"),
    );

    const emiRupees = Number(emiAmountPaise) / 100;
    expect(Math.abs(emiRupees - 9986)).toBeLessThanOrEqual(2);

    expect(instalments).toHaveLength(24);
    expect(instalments.map((i) => i.sequenceNumber)).toEqual(
      Array.from({ length: 24 }, (_, i) => i + 1),
    );
    expect(instalments.every((i) => i.amountPaidPaise === 0n)).toBe(true);
    // Every non-final row is billed at exactly the EMI.
    expect(instalments.slice(0, -1).every((i) => i.totalDuePaise === emiAmountPaise)).toBe(true);
  });

  it("absorbs all cumulative rounding drift into the final instalment", () => {
    const cases: [bigint, number, number][] = [
      [20000000n, 18, 24],
      [50000000n, 13.5, 36],
      [5000000n, 9.75, 3],
    ];

    for (const [principalPaise, rate, tenure] of cases) {
      const { instalments } = generateSchedule(principalPaise, rate, tenure, new Date("2026-01-05"));
      const sumOfPrincipalComponents = instalments.reduce(
        (sum, i) => sum + i.principalComponentPaise,
        0n,
      );
      expect(sumOfPrincipalComponents).toBe(principalPaise);

      const last = instalments[instalments.length - 1];
      expect(last.totalDuePaise).toBe(last.principalComponentPaise + last.interestComponentPaise);
    }
  });

  it("clamps due dates to the target month's length while preserving day-of-month otherwise", () => {
    // 2026 is not a leap year, so Jan 31 + 1 month clamps to Feb 28, then
    // rolls back to the 31st once March (a 31-day month) is reached again.
    const { instalments } = generateSchedule(5000000n, 12, 3, new Date("2026-01-31"));

    expect(instalments[0].dueDate.toISOString().slice(0, 10)).toBe("2026-02-28");
    expect(instalments[1].dueDate.toISOString().slice(0, 10)).toBe("2026-03-31");
    expect(instalments[2].dueDate.toISOString().slice(0, 10)).toBe("2026-04-30");
  });
});
