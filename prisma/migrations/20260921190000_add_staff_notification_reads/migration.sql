-- CreateTable
CREATE TABLE IF NOT EXISTS "staff_notification_reads" (
    "userId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_notification_reads_pkey" PRIMARY KEY ("userId","notificationId")
);
