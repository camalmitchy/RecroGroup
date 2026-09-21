-- CreateTable
CREATE TABLE "staff_inbox_cursors" (
    "userId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_inbox_cursors_pkey" PRIMARY KEY ("userId")
);
