import { NextResponse } from "next/server";

import { refreshPaymentStatus } from "@/lib/payments/checkout";
import { PaymentError } from "@/lib/payments/types";
import { prisma } from "@/lib/prisma";
import { ensureSlotColumns } from "@/server/booking-slots";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;

  try {
    const payment = await refreshPaymentStatus(reference);
    await ensureSlotColumns();
    const booking = payment.bookingId
      ? await prisma.booking.findUnique({
          where: { id: payment.bookingId },
          select: { rescheduleReason: true },
        })
      : null;

    return NextResponse.json({
      reference: payment.reference,
      status: payment.status,
      amountKes: payment.amountKes,
      settledAmountKes: payment.settledAmountKes,
      method: payment.method,
      mpesaReceipt: payment.mpesaReceipt,
      failureReason: payment.failureReason,
      paidAt: payment.paidAt,
      needsReschedule: Boolean(booking?.rescheduleReason),
      rescheduleReason: booking?.rescheduleReason ?? null,
    });
  } catch (error) {
    if (error instanceof PaymentError && error.code === "not_found") {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    console.error("Failed to refresh payment status", error);
    return NextResponse.json(
      { error: "Could not check payment status" },
      { status: 500 },
    );
  }
}
