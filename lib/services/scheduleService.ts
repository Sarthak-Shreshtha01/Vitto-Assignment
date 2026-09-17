import type { Instalment } from "@/lib/types";

export interface ScheduleResult {
  emiAmountPaise: bigint;
  instalments: Instalment[];
}

// Generates the full month-by-month repayment schedule using the
// reducing-balance EMI formula. Traces to docs/PRD.md §7 and docs/SRS.md
// §3.1/§7.5. Pure function: takes primitives, returns plain objects, no
// DB/HTTP — callers are responsible for validating inputs first.
export function generateSchedule(
  principalPaise: bigint,
  annualInterestRate: number,
  tenureMonths: number,
  disbursementDate: Date,
): ScheduleResult {
  const monthlyRate = annualInterestRate / 12 / 100;
  const growth = Math.pow(1 + monthlyRate, tenureMonths);
  const emiAmountPaise = BigInt(
    Math.round((Number(principalPaise) * monthlyRate * growth) / (growth - 1)),
  );

  let outstandingPrincipalPaise = principalPaise;
  const instalments: Instalment[] = [];

  for (let sequenceNumber = 1; sequenceNumber <= tenureMonths; sequenceNumber++) {
    const isFinalInstalment = sequenceNumber === tenureMonths;
    const interestComponentPaise = BigInt(
      Math.round(Number(outstandingPrincipalPaise) * monthlyRate),
    );

    // The final instalment absorbs whatever principal remains, so cumulative
    // rounding drift never leaves a stray balance (SRS §7.5).
    const principalComponentPaise = isFinalInstalment
      ? outstandingPrincipalPaise
      : emiAmountPaise - interestComponentPaise;

    const totalDuePaise = isFinalInstalment
      ? principalComponentPaise + interestComponentPaise
      : emiAmountPaise;

    outstandingPrincipalPaise -= principalComponentPaise;

    instalments.push({
      sequenceNumber,
      dueDate: addMonthsClamped(disbursementDate, sequenceNumber),
      principalComponentPaise,
      interestComponentPaise,
      totalDuePaise,
      amountPaidPaise: 0n,
    });
  }

  return { emiAmountPaise, instalments };
}

// due date = disbursementDate + n months, same day-of-month, clamped to the
// target month's length (e.g. 31st -> last day of a 30-day month). Works in
// UTC throughout so it isn't affected by the server's local timezone.
function addMonthsClamped(base: Date, months: number): Date {
  const day = base.getUTCDate();
  const targetMonthIndex = base.getUTCMonth() + months;
  const year = base.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
  const month = ((targetMonthIndex % 12) + 12) % 12;
  const daysInTargetMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  return new Date(Date.UTC(year, month, Math.min(day, daysInTargetMonth)));
}
