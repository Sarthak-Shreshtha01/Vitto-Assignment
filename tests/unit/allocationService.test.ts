import { describe, expect, it } from "vitest";
import { allocate } from "@/lib/services/allocationService";
import type { Instalment } from "@/lib/types";

function makeInstalments(totalDues: number[]): Instalment[] {
  return totalDues.map((totalDue, index) => ({
    sequenceNumber: index + 1,
    dueDate: new Date(Date.UTC(2026, 0, 5 + index)),
    principalComponentPaise: BigInt(totalDue) * 90n,
    interestComponentPaise: BigInt(totalDue) * 10n,
    totalDuePaise: BigInt(totalDue) * 100n,
    amountPaidPaise: 0n,
  }));
}

describe("allocate", () => {
  it("tracks an underpayment accurately against the oldest instalment without touching later ones", () => {
    // PRD §8: instalment is ₹9,986, ₹5,000 received.
    const instalments = makeInstalments([9986, 9986]);
    const { updatedInstalments, appliedTo, excessPaise } = allocate(instalments, 500000n);

    expect(appliedTo).toEqual([{ sequenceNumber: 1, amountAppliedPaise: 500000n }]);
    expect(updatedInstalments[0].amountPaidPaise).toBe(500000n);
    expect(updatedInstalments[1].amountPaidPaise).toBe(0n);
    expect(excessPaise).toBe(0n);
  });

  it("cascades an overpayment forward to the next outstanding instalment rather than reducing principal early", () => {
    // PRD §8: twice the instalment received.
    const instalments = makeInstalments([9986, 9986, 9986]);
    const paymentPaise = instalments[0].totalDuePaise * 2n;

    const { updatedInstalments, appliedTo, excessPaise } = allocate(instalments, paymentPaise);

    expect(appliedTo).toEqual([
      { sequenceNumber: 1, amountAppliedPaise: instalments[0].totalDuePaise },
      { sequenceNumber: 2, amountAppliedPaise: instalments[1].totalDuePaise },
    ]);
    expect(updatedInstalments[0].amountPaidPaise).toBe(instalments[0].totalDuePaise);
    expect(updatedInstalments[1].amountPaidPaise).toBe(instalments[1].totalDuePaise);
    expect(updatedInstalments[2].amountPaidPaise).toBe(0n); // untouched - no early principal reduction
    expect(excessPaise).toBe(0n);
  });

  it("reports leftover as excess, applied nowhere, when a payment exceeds total outstanding across the loan", () => {
    const instalments = makeInstalments([9986, 9986]);
    const totalOutstanding = instalments.reduce((sum, i) => sum + i.totalDuePaise, 0n);
    const paymentPaise = totalOutstanding + 500000n; // ₹5,000 more than the whole loan owes

    const { updatedInstalments, excessPaise } = allocate(instalments, paymentPaise);

    expect(excessPaise).toBe(500000n);
    expect(updatedInstalments.every((i) => i.amountPaidPaise === i.totalDuePaise)).toBe(true);
    // Invariant: no instalment is ever paid beyond what it's due.
    expect(updatedInstalments.every((i) => i.amountPaidPaise <= i.totalDuePaise)).toBe(true);
  });

  it("skips instalments that are already fully paid rather than misapplying funds to them", () => {
    const instalments = makeInstalments([9986, 9986]);
    instalments[0].amountPaidPaise = instalments[0].totalDuePaise; // already settled elsewhere

    const { updatedInstalments, appliedTo } = allocate(instalments, 500000n);

    expect(appliedTo).toEqual([{ sequenceNumber: 2, amountAppliedPaise: 500000n }]);
    expect(updatedInstalments[0].amountPaidPaise).toBe(instalments[0].totalDuePaise);
  });
});
