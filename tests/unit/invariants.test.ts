import { describe, expect, it } from "vitest";
import { generateSchedule } from "@/lib/services/scheduleService";
import { allocate } from "@/lib/services/allocationService";
import { derivePosition } from "@/lib/services/positionService";
import type { Instalment } from "@/lib/types";

// Property-style tests (PRD §14 differentiator): rather than asserting one
// specific input/output pair, these assert a rule that must hold no matter
// what payment sequence is thrown at the system - the most direct way to
// answer "how does this behave in a case not specified in the brief."

describe("allocate: conservation and no-overpay invariants", () => {
  it("never applies more than the payment amount, and never pays an instalment past what it's due", () => {
    const { instalments } = generateSchedule(30000000n, 15, 12, new Date("2026-01-05"));
    let schedule: Instalment[] = instalments;

    // Deliberately varied: underpayment, an exact instalment amount, a
    // multi-instalment overpayment cascade, and a payment that dwarfs
    // everything remaining in the loan.
    const paymentAmounts = [500000n, 1272193n, 3000000n, 10000000n, 999999999n];

    for (const amountPaise of paymentAmounts) {
      const unpaid = schedule.filter((i) => i.amountPaidPaise < i.totalDuePaise);
      const { updatedInstalments, appliedTo, excessPaise } = allocate(unpaid, amountPaise);

      const totalApplied = appliedTo.reduce((sum, a) => sum + a.amountAppliedPaise, 0n);

      // Conservation: every paisa of the payment is either applied
      // somewhere or accounted for as excess - never created or destroyed.
      expect(totalApplied + excessPaise).toBe(amountPaise);
      expect(excessPaise >= 0n).toBe(true);

      const updatedBySequence = new Map(updatedInstalments.map((i) => [i.sequenceNumber, i]));
      schedule = schedule.map((i) => updatedBySequence.get(i.sequenceNumber) ?? i);

      expect(schedule.every((i) => i.amountPaidPaise <= i.totalDuePaise)).toBe(true);
    }
  });
});

describe("derivePosition: non-negativity invariants", () => {
  it("never reports negative outstanding principal or overdue amount, at any point in a loan's lifetime", () => {
    const principalPaise = 50000000n;
    const { instalments } = generateSchedule(principalPaise, 13, 18, new Date("2026-01-05"));
    let schedule: Instalment[] = instalments;

    const steps: { amountPaise: bigint; asOf: Date }[] = [
      { amountPaise: 200000n, asOf: new Date("2026-01-10") },
      { amountPaise: 500000n, asOf: new Date("2026-03-01") },
      { amountPaise: 4000000n, asOf: new Date("2026-06-15") },
      { amountPaise: 1n, asOf: new Date("2026-12-01") },
      { amountPaise: 50000000n, asOf: new Date("2027-06-01") },
    ];

    for (const step of steps) {
      const unpaid = schedule.filter((i) => i.amountPaidPaise < i.totalDuePaise);
      const { updatedInstalments } = allocate(unpaid, step.amountPaise);
      const updatedBySequence = new Map(updatedInstalments.map((i) => [i.sequenceNumber, i]));
      schedule = schedule.map((i) => updatedBySequence.get(i.sequenceNumber) ?? i);

      const position = derivePosition(schedule, step.asOf);

      expect(position.outstandingPrincipalPaise >= 0n).toBe(true);
      expect(position.overdueAmountPaise >= 0n).toBe(true);
      expect(position.outstandingPrincipalPaise <= principalPaise).toBe(true);
    }
  });
});
