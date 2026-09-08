-- Add appointment reminder fields
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "appointmentDate" TIMESTAMP(3);
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "appointmentTime" TEXT;
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "therapistName" TEXT;
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "reminderSentAt" TIMESTAMP(3);

-- Create index for efficient reminder queries
CREATE INDEX IF NOT EXISTS "appointments_appointmentDate_idx" ON "appointments"("appointmentDate");

-- Backfill appointmentDate from scheduledAt for existing records
UPDATE "appointments" SET "appointmentDate" = "scheduledAt" WHERE "appointmentDate" IS NULL;

-- Make appointmentDate NOT NULL after backfilling
ALTER TABLE "appointments" ALTER COLUMN "appointmentDate" SET NOT NULL;
