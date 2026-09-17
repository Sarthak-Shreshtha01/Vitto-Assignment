import { describe, expect, it } from "vitest";
import { validateCreateLoanInput, validateRecordPaymentInput } from "@/lib/validation";
import { ApiError } from "@/lib/errors";

const validLoanBody = {
  principal: 200000,
  annualInterestRate: 18,
  tenureMonths: 24,
  disbursementDate: "2026-01-05",
};

const validPaymentBody = { amount: 5000, date: "2026-03-10" };

describe("validateCreateLoanInput", () => {
  it("accepts valid input and converts principal to paise", () => {
    const result = validateCreateLoanInput(validLoanBody);
    expect(result.principalPaise).toBe(20000000n);
    expect(result.tenureMonths).toBe(24);
    expect(result.disbursementDate.toISOString().slice(0, 10)).toBe("2026-01-05");
  });

  it("rejects every documented invalid case before it would reach schedule generation", () => {
    const invalidBodies = [
      { ...validLoanBody, principal: -1000 }, // negative amount
      { ...validLoanBody, principal: 10000 }, // below ₹50,000 floor
      { ...validLoanBody, principal: "200000" }, // non-numeric
      { ...validLoanBody, tenureMonths: 0 }, // zero-month tenure
      { ...validLoanBody, tenureMonths: 37 }, // above 36-month ceiling
      { ...validLoanBody, annualInterestRate: 0 }, // must be > 0
      { ...validLoanBody, disbursementDate: "not-a-date" }, // malformed date
    ];

    for (const body of invalidBodies) {
      expect(() => validateCreateLoanInput(body)).toThrow(ApiError);
      try {
        validateCreateLoanInput(body);
      } catch (error) {
        expect((error as ApiError).code).toBe("VALIDATION_ERROR");
      }
    }
  });
});

describe("validateRecordPaymentInput", () => {
  it("accepts valid input and converts amount to paise", () => {
    const result = validateRecordPaymentInput(validPaymentBody);
    expect(result.amountPaise).toBe(500000n);
    expect(result.date.toISOString().slice(0, 10)).toBe("2026-03-10");
  });

  it("rejects invalid amounts and dates before allocation ever runs", () => {
    const invalidBodies = [
      { ...validPaymentBody, amount: -500 }, // negative
      { ...validPaymentBody, amount: 0 }, // zero
      { ...validPaymentBody, amount: "5000" }, // non-numeric
      { ...validPaymentBody, date: "10-03-2026" }, // wrong format
      { unrelatedField: true }, // missing everything
    ];

    for (const body of invalidBodies) {
      expect(() => validateRecordPaymentInput(body)).toThrow(ApiError);
    }
  });
});
