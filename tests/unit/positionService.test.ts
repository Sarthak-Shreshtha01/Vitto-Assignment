import { describe, expect, it } from "vitest";
import { derivePosition } from "@/lib/services/positionService";
import type { Instalment } from "@/lib/types";

function instalment(overrides: Partial<Instalment>): Instalment {
  return {
    sequenceNumber: 1,
    dueDate: new Date("2026-03-05"),
    principalComponentPaise: 701000n,
    interestComponentPaise: 300000n,
    totalDuePaise: 998600n,
    amountPaidPaise: 0n,
    ...overrides,
  };
}

describe("derivePosition", () => {
  it("does not flag an instalment overdue on or before its due date, even if unpaid", () => {
    const instalments = [instalment({ dueDate: new Date("2026-03-05"), amountPaidPaise: 0n })];

    const onDueDate = derivePosition(instalments, new Date("2026-03-05"));
    expect(onDueDate.overdueAmountPaise).toBe(0n);

    const beforeDueDate = derivePosition(instalments, new Date("2026-02-20"));
    expect(beforeDueDate.overdueAmountPaise).toBe(0n);
  });

  it("flags the outstanding balance overdue once today passes the due date unpaid (PRD's 11-days-late case)", () => {
    const due = instalment({ dueDate: new Date("2026-03-05"), totalDuePaise: 998600n, amountPaidPaise: 500000n });
    const today = new Date("2026-03-16"); // 11 days after the due date

    const position = derivePosition([due], today);

    expect(position.overdueAmountPaise).toBe(998600n - 500000n);
    // Being paid late isn't separately penalized - it's just reflected as overdue (SRS §7.3).
  });

  it("counts an instalment's principal as outstanding only until it receives its first payment", () => {
    // Realistic post-allocation state: oldest-first means instalment 1 is
    // fully settled before instalment 2 ever sees a rupee.
    const fullyPaid = instalment({
      sequenceNumber: 1,
      principalComponentPaise: 701000n,
      totalDuePaise: 998600n,
      amountPaidPaise: 998600n,
      dueDate: new Date("2026-03-05"),
    });
    const partiallyPaid = instalment({
      sequenceNumber: 2,
      principalComponentPaise: 711500n,
      totalDuePaise: 998600n,
      amountPaidPaise: 500000n,
      dueDate: new Date("2026-04-05"),
    });
    const untouched = instalment({
      sequenceNumber: 3,
      principalComponentPaise: 722000n,
      amountPaidPaise: 0n,
      dueDate: new Date("2026-05-05"),
    });

    const position = derivePosition([fullyPaid, partiallyPaid, untouched], new Date("2026-02-20"));

    // partiallyPaid has been touched, so its principal no longer counts as outstanding,
    // even though it isn't fully paid off yet (documented design decision).
    expect(position.outstandingPrincipalPaise).toBe(untouched.principalComponentPaise);
    expect(position.nextDueDate).toEqual(partiallyPaid.dueDate);
    expect(position.nextDueAmountPaise).toBe(partiallyPaid.totalDuePaise - partiallyPaid.amountPaidPaise);
  });
});
