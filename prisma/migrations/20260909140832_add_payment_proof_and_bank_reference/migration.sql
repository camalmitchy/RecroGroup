-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "bankReference" TEXT;

-- CreateIndex
CREATE INDEX "payments_bankReference_idx" ON "payments"("bankReference");

