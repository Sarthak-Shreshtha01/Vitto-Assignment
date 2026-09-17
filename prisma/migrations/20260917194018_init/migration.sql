-- CreateEnum
CREATE TYPE "InstalmentStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID');

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "principal_paise" BIGINT NOT NULL,
    "annual_interest_rate" DECIMAL(6,3) NOT NULL,
    "tenure_months" INTEGER NOT NULL,
    "disbursement_date" DATE NOT NULL,
    "emi_amount_paise" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instalments" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "sequence_number" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "principal_component_paise" BIGINT NOT NULL,
    "interest_component_paise" BIGINT NOT NULL,
    "total_due_paise" BIGINT NOT NULL,
    "amount_paid_paise" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "instalments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "amount_paise" BIGINT NOT NULL,
    "payment_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_allocations" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "instalment_id" TEXT NOT NULL,
    "amount_applied_paise" BIGINT NOT NULL,

    CONSTRAINT "payment_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instalments_loan_id_sequence_number_key" ON "instalments"("loan_id", "sequence_number");

-- CreateIndex
CREATE UNIQUE INDEX "payments_loan_id_amount_paise_payment_date_key" ON "payments"("loan_id", "amount_paise", "payment_date");

-- AddForeignKey
ALTER TABLE "instalments" ADD CONSTRAINT "instalments_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_instalment_id_fkey" FOREIGN KEY ("instalment_id") REFERENCES "instalments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
