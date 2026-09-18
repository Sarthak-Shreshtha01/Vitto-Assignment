import { Prisma, type Loan, type Payment, type PaymentAllocation } from "@prisma/client";
import { prisma } from "@/lib/db";
import { notFound } from "@/lib/errors";
import type { Instalment } from "@/lib/types";

export interface LoanRecord {
  id: string;
  principalPaise: bigint;
  annualInterestRate: number;
  tenureMonths: number;
  disbursementDate: Date;
  emiAmountPaise: bigint;
  createdAt: Date;
}

function toLoanRecord(loan: Loan): LoanRecord {
  return {
    id: loan.id,
    principalPaise: loan.principalPaise,
    annualInterestRate: Number(loan.annualInterestRate),
    tenureMonths: loan.tenureMonths,
    disbursementDate: loan.disbursementDate,
    emiAmountPaise: loan.emiAmountPaise,
    createdAt: loan.createdAt,
  };
}

// Prisma's Instalment row already matches our domain shape field-for-field
// (see prisma/schema.prisma) - this strips the DB-only id/loanId columns so
// pure services never see persistence details.
function toDomainInstalment(row: {
  sequenceNumber: number;
  dueDate: Date;
  principalComponentPaise: bigint;
  interestComponentPaise: bigint;
  totalDuePaise: bigint;
  amountPaidPaise: bigint;
}): Instalment {
  return {
    sequenceNumber: row.sequenceNumber,
    dueDate: row.dueDate,
    principalComponentPaise: row.principalComponentPaise,
    interestComponentPaise: row.interestComponentPaise,
    totalDuePaise: row.totalDuePaise,
    amountPaidPaise: row.amountPaidPaise,
  };
}

// Creates a loan and its full schedule in one transaction, so a failure
// partway through can't leave the schedule half-written (Architecture §4.4).
export async function createLoanWithSchedule(input: {
  principalPaise: bigint;
  annualInterestRate: number;
  tenureMonths: number;
  disbursementDate: Date;
  emiAmountPaise: bigint;
  instalments: Instalment[];
}): Promise<{ loan: LoanRecord; instalments: (Instalment & { id: string })[] }> {
  return prisma.$transaction(async (tx) => {
    const loan = await tx.loan.create({
      data: {
        principalPaise: input.principalPaise,
        annualInterestRate: input.annualInterestRate,
        tenureMonths: input.tenureMonths,
        disbursementDate: input.disbursementDate,
        emiAmountPaise: input.emiAmountPaise,
      },
    });

    await tx.instalment.createMany({
      data: input.instalments.map((instalment) => ({
        loanId: loan.id,
        sequenceNumber: instalment.sequenceNumber,
        dueDate: instalment.dueDate,
        principalComponentPaise: instalment.principalComponentPaise,
        interestComponentPaise: instalment.interestComponentPaise,
        totalDuePaise: instalment.totalDuePaise,
        amountPaidPaise: instalment.amountPaidPaise,
      })),
    });

    const createdInstalments = await tx.instalment.findMany({
      where: { loanId: loan.id },
      orderBy: { sequenceNumber: "asc" },
    });

    return {
      loan: toLoanRecord(loan),
      instalments: createdInstalments.map((row) => ({ ...toDomainInstalment(row), id: row.id })),
    };
  });
}

export interface LoanWithScheduleAndPayments {
  loan: LoanRecord;
  instalments: (Instalment & { id: string })[];
  payments: Payment[];
}

export async function findLoanWithScheduleAndPayments(
  loanId: string,
): Promise<LoanWithScheduleAndPayments> {
  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    include: {
      instalments: { orderBy: { sequenceNumber: "asc" } },
      payments: { orderBy: { paymentDate: "asc" } },
    },
  });

  if (!loan) {
    throw notFound(`No loan found with id ${loanId}`);
  }

  return {
    loan: toLoanRecord(loan),
    instalments: loan.instalments.map((row) => ({ ...toDomainInstalment(row), id: row.id })),
    payments: loan.payments,
  };
}

export async function listLoans(): Promise<LoanRecord[]> {
  const loans = await prisma.loan.findMany({ orderBy: { createdAt: "desc" } });
  return loans.map(toLoanRecord);
}

export async function findExistingPayment(
  loanId: string,
  amountPaise: bigint,
  date: Date,
): Promise<(Payment & { allocations: PaymentAllocation[] }) | null> {
  return prisma.payment.findUnique({
    where: { loanId_amountPaise_paymentDate: { loanId, amountPaise, paymentDate: date } },
    include: { allocations: true },
  });
}

export type SavePaymentResult =
  | { duplicate: true; payment: Payment & { allocations: PaymentAllocation[] } }
  | { duplicate: false; payment: Payment; allocations: PaymentAllocation[] };

// Persists a new payment plus its allocations in one transaction (payment
// row, instalment amount_paid updates, and allocation rows all succeed or
// all roll back together). If a concurrent request already inserted the
// identical (loanId, amount, date) payment and won the race, the unique
// constraint (SRS §7.4) rejects our insert - we catch that here and return
// the existing payment as a replay instead of letting a raw DB error
// surface. This is a safety net for races; the caller's own
// findExistingPayment check is the primary duplicate path.
export async function savePaymentWithAllocations(input: {
  loanId: string;
  amountPaise: bigint;
  date: Date;
  appliedTo: { instalmentId: string; amountAppliedPaise: bigint }[];
}): Promise<SavePaymentResult> {
  try {
    return await prisma.$transaction(
      async (tx) => {
        const payment = await tx.payment.create({
          data: { loanId: input.loanId, amountPaise: input.amountPaise, paymentDate: input.date },
        });

        let allocations: PaymentAllocation[] = [];

        if (input.appliedTo.length > 0) {
          // A single Postgres transaction runs on one connection, so
          // statements against it are processed one at a time regardless
          // of how the JS code issuing them is structured (Promise.all
          // doesn't buy real concurrency here) - the only way to keep a
          // payment that cascades across many instalments fast is to cut
          // the number of round-trips to a constant, not one pair per
          // instalment. Prisma's query builder can't bulk-update rows with
          // a different increment each, so this does it in raw SQL.
          const values = Prisma.join(
            input.appliedTo.map(
              (applied) => Prisma.sql`(${applied.instalmentId}::text, ${applied.amountAppliedPaise}::bigint)`,
            ),
          );
          await tx.$executeRaw`
            UPDATE instalments AS i
            SET amount_paid_paise = i.amount_paid_paise + v.amount
            FROM (VALUES ${values}) AS v(id, amount)
            WHERE i.id = v.id
          `;

          allocations = await tx.paymentAllocation.createManyAndReturn({
            data: input.appliedTo.map((applied) => ({
              paymentId: payment.id,
              instalmentId: applied.instalmentId,
              amountAppliedPaise: applied.amountAppliedPaise,
            })),
          });
        }

        return { duplicate: false as const, payment, allocations };
      },
      // Defense in depth on top of the parallelization above - the hosted
      // pooler's round-trip latency is well over Prisma's 5s default (see
      // vitest.config.mts for the same underlying reason).
      { timeout: 20000 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existing = await findExistingPayment(input.loanId, input.amountPaise, input.date);
      if (existing) {
        return { duplicate: true as const, payment: existing };
      }
    }
    throw error;
  }
}
