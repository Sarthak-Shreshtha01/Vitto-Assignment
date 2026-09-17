import { validationError } from "@/lib/errors";
import { rupeesToPaise } from "@/lib/money";

// Pure input validation, traces to docs/SRS.md §3.1/§3.3/§8. Runs before a
// request ever reaches schedule generation or allocation - callers (route
// handlers) call these first and let the thrown ApiError propagate.

// request.json() throws a plain SyntaxError on malformed JSON, which would
// otherwise surface as a generic 500 - this maps it to the same
// VALIDATION_ERROR shape as every other bad-input case.
export async function parseJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw validationError("Request body must be valid JSON");
  }
}

export interface CreateLoanInput {
  principalPaise: bigint;
  annualInterestRate: number;
  tenureMonths: number;
  disbursementDate: Date;
}

export function validateCreateLoanInput(body: unknown): CreateLoanInput {
  const { principal, annualInterestRate, tenureMonths, disbursementDate } = asRecord(body);

  if (typeof principal !== "number" || !Number.isFinite(principal)) {
    throw validationError("principal must be a number");
  }
  if (principal < 50000 || principal > 1000000) {
    throw validationError("principal must be between 50000 and 1000000");
  }

  if (typeof annualInterestRate !== "number" || !Number.isFinite(annualInterestRate) || annualInterestRate <= 0) {
    throw validationError("annualInterestRate must be a number greater than 0");
  }

  if (
    typeof tenureMonths !== "number" ||
    !Number.isInteger(tenureMonths) ||
    tenureMonths < 3 ||
    tenureMonths > 36
  ) {
    throw validationError("tenureMonths must be an integer between 3 and 36");
  }

  const parsedDisbursementDate = parseIsoDate(disbursementDate);
  if (!parsedDisbursementDate) {
    throw validationError("disbursementDate must be a valid ISO date (YYYY-MM-DD)");
  }

  return {
    principalPaise: rupeesToPaise(principal),
    annualInterestRate,
    tenureMonths,
    disbursementDate: parsedDisbursementDate,
  };
}

export interface RecordPaymentInput {
  amountPaise: bigint;
  date: Date;
}

export function validateRecordPaymentInput(body: unknown): RecordPaymentInput {
  const { amount, date } = asRecord(body);

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw validationError("amount must be a number greater than 0");
  }

  const parsedDate = parseIsoDate(date);
  if (!parsedDate) {
    throw validationError("date must be a valid ISO date (YYYY-MM-DD)");
  }

  return { amountPaise: rupeesToPaise(amount), date: parsedDate };
}

function asRecord(body: unknown): Record<string, unknown> {
  if (typeof body !== "object" || body === null) {
    throw validationError("request body must be a JSON object");
  }
  return body as Record<string, unknown>;
}

function parseIsoDate(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}
