/*
  Warnings:

  - Added the required column `appointmentDate` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "appointmentDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "appointmentTime" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "reminderSentAt" TIMESTAMP(3),
ADD COLUMN     "therapistName" TEXT;

-- CreateIndex
CREATE INDEX "appointments_appointmentDate_idx" ON "appointments"("appointmentDate");
