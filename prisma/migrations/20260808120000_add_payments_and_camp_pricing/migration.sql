-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('MPESA_DARAJA', 'PAYSTACK', 'MANUAL');

-- CreateEnum
CREATE TYPE "PaymentPurpose" AS ENUM ('BOOKING_DEPOSIT', 'BOOKING_BALANCE', 'BOOKING_FULL', 'GRIEF_CAMP_FEE', 'DONATION', 'MERCHANDISE', 'OTHER');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('KES', 'USD');

-- CreateEnum
CREATE TYPE "CampAttendeeType" AS ENUM ('CAMPER', 'PARENT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "amountPaidKes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "depositKes" INTEGER;

-- AlterTable
ALTER TABLE "grief_applications" ADD COLUMN     "amountKes" INTEGER,
ADD COLUMN     "campSessionId" TEXT,
ADD COLUMN     "formData" JSONB,
ADD COLUMN     "parentAttending" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "reference" TEXT;

UPDATE "grief_applications"
SET "reference" = 'GC-' || upper(substr(md5(random()::text || "id"), 1, 8))
WHERE "reference" IS NULL;

ALTER TABLE "grief_applications" ALTER COLUMN "reference" SET NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'KES',
ADD COLUMN     "donationId" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "griefApplicationId" TEXT,
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "provider" "PaymentProvider",
ADD COLUMN     "providerMeta" JSONB,
ADD COLUMN     "providerRef" TEXT,
ADD COLUMN     "purpose" "PaymentPurpose" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "settledAmountKes" INTEGER;

UPDATE "payments"
SET "provider" = CASE
  WHEN "method" = 'MPESA' THEN 'MPESA_DARAJA'::"PaymentProvider"
  WHEN "method" = 'CARD' THEN 'PAYSTACK'::"PaymentProvider"
  ELSE 'MANUAL'::"PaymentProvider"
END
WHERE "provider" IS NULL;

UPDATE "payments"
SET "reference" = 'RP-' || upper(substr(md5(random()::text || "id"), 1, 8))
WHERE "reference" IS NULL OR "reference" = '';

ALTER TABLE "payments" ALTER COLUMN "provider" SET NOT NULL;
ALTER TABLE "payments" ALTER COLUMN "reference" SET NOT NULL;

-- CreateTable
CREATE TABLE "payment_events" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT,
    "provider" "PaymentProvider" NOT NULL,
    "eventType" TEXT NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" TEXT,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT NOT NULL,
    "donorPhone" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "amountKes" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'KES',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camp_sessions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "startsOn" DATE NOT NULL,
    "endsOn" DATE NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "capacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "camp_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camp_price_tiers" (
    "id" TEXT NOT NULL,
    "campSessionId" TEXT NOT NULL,
    "attendeeType" "CampAttendeeType" NOT NULL,
    "label" TEXT NOT NULL,
    "amountKes" INTEGER NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "camp_price_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_events_dedupeKey_key" ON "payment_events"("dedupeKey");

-- CreateIndex
CREATE INDEX "payment_events_provider_eventType_idx" ON "payment_events"("provider", "eventType");

-- CreateIndex
CREATE INDEX "payment_events_processed_idx" ON "payment_events"("processed");

-- CreateIndex
CREATE INDEX "payment_events_createdAt_idx" ON "payment_events"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "donations_reference_key" ON "donations"("reference");

-- CreateIndex
CREATE INDEX "donations_paymentStatus_idx" ON "donations"("paymentStatus");

-- CreateIndex
CREATE INDEX "donations_createdAt_idx" ON "donations"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "camp_sessions_slug_key" ON "camp_sessions"("slug");

-- CreateIndex
CREATE INDEX "camp_sessions_isActive_idx" ON "camp_sessions"("isActive");

-- CreateIndex
CREATE INDEX "camp_price_tiers_campSessionId_attendeeType_effectiveFrom_idx" ON "camp_price_tiers"("campSessionId", "attendeeType", "effectiveFrom");

-- CreateIndex
CREATE UNIQUE INDEX "grief_applications_reference_key" ON "grief_applications"("reference");

-- CreateIndex
CREATE INDEX "grief_applications_campSessionId_idx" ON "grief_applications"("campSessionId");

-- CreateIndex
CREATE INDEX "grief_applications_createdAt_idx" ON "grief_applications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "payments_reference_key" ON "payments"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "payments_mpesaReceipt_key" ON "payments"("mpesaReceipt");

-- CreateIndex
CREATE UNIQUE INDEX "payments_idempotencyKey_key" ON "payments"("idempotencyKey");

-- CreateIndex
CREATE INDEX "payments_provider_providerRef_idx" ON "payments"("provider", "providerRef");

-- CreateIndex
CREATE INDEX "payments_bookingId_idx" ON "payments"("bookingId");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_griefApplicationId_fkey" FOREIGN KEY ("griefApplicationId") REFERENCES "grief_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "camp_price_tiers" ADD CONSTRAINT "camp_price_tiers_campSessionId_fkey" FOREIGN KEY ("campSessionId") REFERENCES "camp_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grief_applications" ADD CONSTRAINT "grief_applications_campSessionId_fkey" FOREIGN KEY ("campSessionId") REFERENCES "camp_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

