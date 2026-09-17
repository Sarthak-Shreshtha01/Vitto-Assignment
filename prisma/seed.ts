// Seeds illustrative demo loans (safe, synthetic data only - no real names
// or sensitive-looking details, since this also runs against the public
// deployment). Runs against whichever DATABASE_URL/DIRECT_URL are in the
// environment, so the same script seeds both local and hosted DBs.
//
// Uses the app's own service/repository layer rather than raw SQL, so the
// seeded data is guaranteed internally consistent with what the running
// app would itself produce.
import { generateSchedule } from "../lib/services/scheduleService";
import { allocate } from "../lib/services/allocationService";
import {
  createLoanWithSchedule,
  findLoanWithScheduleAndPayments,
  savePaymentWithAllocations,
} from "../lib/repository/loanRepository";
import { rupeesToPaise } from "../lib/money";
import { prisma } from "../lib/db";

interface PaymentStep {
  // Pays `fraction` of the named instalment's totalDue as of the moment
  // this step runs (>1 deliberately overpays, cascading into the next
  // instalment - see the overpaid example below).
  instalmentSequence: number;
  fraction: number;
  date: string;
}

interface SeedLoanInput {
  label: string;
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  disbursementDate: string;
  payments: PaymentStep[];
}

async function seedLoan(input: SeedLoanInput): Promise<void> {
  const principalPaise = rupeesToPaise(input.principal);
  const disbursementDate = new Date(`${input.disbursementDate}T00:00:00.000Z`);
  const { emiAmountPaise, instalments } = generateSchedule(
    principalPaise,
    input.annualInterestRate,
    input.tenureMonths,
    disbursementDate,
  );

  const { loan } = await createLoanWithSchedule({
    principalPaise,
    annualInterestRate: input.annualInterestRate,
    tenureMonths: input.tenureMonths,
    disbursementDate,
    emiAmountPaise,
    instalments,
  });

  for (const step of input.payments) {
    const current = await findLoanWithScheduleAndPayments(loan.id);
    const target = current.instalments.find((i) => i.sequenceNumber === step.instalmentSequence);
    if (!target) throw new Error(`Instalment ${step.instalmentSequence} not found for ${input.label}`);

    const amountPaise = BigInt(Math.round(Number(target.totalDuePaise) * step.fraction));
    const unpaid = current.instalments.filter((i) => i.amountPaidPaise < i.totalDuePaise);
    const { appliedTo } = allocate(unpaid, amountPaise);
    const instalmentIdBySequence = new Map(unpaid.map((i) => [i.sequenceNumber, i.id]));

    await savePaymentWithAllocations({
      loanId: loan.id,
      amountPaise,
      date: new Date(`${step.date}T00:00:00.000Z`),
      appliedTo: appliedTo.map((a) => ({
        instalmentId: instalmentIdBySequence.get(a.sequenceNumber)!,
        amountAppliedPaise: a.amountAppliedPaise,
      })),
    });
  }

  console.log(`Seeded "${input.label}": loan ${loan.id}`);
}

async function main() {
  console.log("Seeding demo loans (synthetic data only)...");

  // Mixed state: two instalments paid on time, the third only half-paid and
  // now overdue, the fourth not yet due - one loan showing PAID,
  // PARTIALLY_PAID + overdue, and PENDING all at once.
  await seedLoan({
    label: "mixed (paid, overdue, pending)",
    principal: 250000,
    annualInterestRate: 14,
    tenureMonths: 18,
    disbursementDate: "2026-06-05",
    payments: [
      { instalmentSequence: 1, fraction: 1, date: "2026-07-04" },
      { instalmentSequence: 2, fraction: 1, date: "2026-08-06" },
      { instalmentSequence: 3, fraction: 0.5, date: "2026-09-05" },
    ],
  });

  // Freshly disbursed, no payments yet - a clean on-track example.
  await seedLoan({
    label: "fresh (fully pending)",
    principal: 100000,
    annualInterestRate: 10,
    tenureMonths: 6,
    disbursementDate: "2026-09-15",
    payments: [],
  });

  // Overpayment: 1.5x the first instalment's due amount in one payment,
  // demonstrating the cascade-forward design decision (PRD §8/§14).
  await seedLoan({
    label: "overpaid (cascades to next instalment)",
    principal: 400000,
    annualInterestRate: 16,
    tenureMonths: 24,
    disbursementDate: "2026-09-05",
    payments: [{ instalmentSequence: 1, fraction: 1.5, date: "2026-09-18" }],
  });

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
