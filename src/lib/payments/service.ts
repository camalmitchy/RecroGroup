import "server-only";

import { Prisma } from "@prisma/client";
import type {
  Currency,
  PaymentMethod,
  PaymentPurpose,
  PaymentStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import type { NormalizedEvent, PaymentTarget, VerifyResult } from "./types";
import { generateReference } from "./utils";

const SETTLED: PaymentStatus[] = ["PAID", "REFUNDED"];
const TERMINAL: PaymentStatus[] = ["PAID", "FAILED", "CANCELLED", "REFUNDED"];

function isTerminal(status: PaymentStatus) {
  return TERMINAL.includes(status);
}

function targetLink(target: PaymentTarget) {
  switch (target.kind) {
    case "booking":
      return { bookingId: target.bookingId };
    case "griefApplication":
      return { griefApplicationId: target.griefApplicationId };
    case "donation":
      return { donationId: target.donationId };
  }
}

export type CreatePaymentInput = {
  target: PaymentTarget;
  userId?: string | null;
  method: PaymentMethod;
  provider: "MPESA_DARAJA" | "PAYSTACK" | "MANUAL";
  purpose: PaymentPurpose;
  amountKes: number;
  currency?: Currency;
  phone?: string | null;
  idempotencyKey?: string | null;
  notes?: string | null;
};

export async function createPendingPayment(input: CreatePaymentInput) {
  if (input.idempotencyKey) {
    const existing = await prisma.payment.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (existing) return existing;
  }

  const data: Prisma.PaymentUncheckedCreateInput = {
    reference: generateReference("RP"),
    method: input.method,
    provider: input.provider,
    purpose: input.purpose,
    currency: input.currency ?? "KES",
    amountKes: input.amountKes,
    status: "PENDING",
    phone: input.phone ?? null,
    userId: input.userId ?? null,
    idempotencyKey: input.idempotencyKey ?? null,
    notes: input.notes ?? null,
    ...targetLink(input.target),
  };

  try {
    return await prisma.payment.create({ data });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      input.idempotencyKey
    ) {
      const existing = await prisma.payment.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (existing) return existing;
    }
    throw error;
  }
}

export async function markPaymentProcessing(
  paymentId: string,
  patch: { providerRef?: string | null; expiresAt?: Date | null },
) {
  return prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "PROCESSING",
      providerRef: patch.providerRef ?? undefined,
      expiresAt: patch.expiresAt ?? undefined,
    },
  });
}

export async function recordEvent(event: NormalizedEvent, paymentId?: string | null) {
  try {
    return await prisma.paymentEvent.create({
      data: {
        paymentId: paymentId ?? null,
        provider: event.provider,
        eventType: event.eventType,
        dedupeKey: event.dedupeKey,
        payload: event.payload as Prisma.InputJsonValue,
        processed: false,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return null;
    }
    throw error;
  }
}

async function resolvePayment(event: NormalizedEvent) {
  if (event.reference) {
    const byReference = await prisma.payment.findUnique({
      where: { reference: event.reference },
    });
    if (byReference) return byReference;
  }

  if (event.providerRef) {
    return prisma.payment.findFirst({
      where: { provider: event.provider, providerRef: event.providerRef },
    });
  }

  return null;
}

export async function settlePayment(paymentId: string, result: VerifyResult) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return { applied: false as const, reason: "not_found" as const };

    if (isTerminal(payment.status)) {
      return { applied: false as const, reason: "already_final" as const, payment };
    }

    const settledAmount = result.settledAmountKes ?? payment.amountKes;
    const paidAt = result.status === "PAID" ? (result.paidAt ?? new Date()) : null;

    const updated = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: result.status,
        settledAmountKes: result.status === "PAID" ? settledAmount : null,
        providerRef: result.providerRef ?? payment.providerRef,
        mpesaReceipt: result.mpesaReceipt ?? payment.mpesaReceipt,
        mpesaCheckoutId: payment.mpesaCheckoutId ?? result.providerRef ?? null,
        phone: result.phone ?? payment.phone,
        failureReason: result.failureReason ?? null,
        paidAt,
        providerMeta: (result.raw ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });

    if (result.status === "PAID") {
      await applySettlementToTarget(tx, updated.id);
    }

    return { applied: true as const, payment: updated };
  });
}

type TxClient = Prisma.TransactionClient;

async function applySettlementToTarget(tx: TxClient, paymentId: string) {
  const payment = await tx.payment.findUnique({ where: { id: paymentId } });
  if (!payment) return;

  const amount = payment.settledAmountKes ?? payment.amountKes;

  if (payment.bookingId) {
    const booking = await tx.booking.findUnique({
      where: { id: payment.bookingId },
    });
    if (!booking) return;

    const paidTotal = await sumSettled(tx, { bookingId: payment.bookingId });
    const total = booking.amountKes ?? amount;

    await tx.booking.update({
      where: { id: booking.id },
      data: {
        amountPaidKes: paidTotal,
        paymentStatus: paidTotal >= total ? "PAID" : "PROCESSING",
        status: booking.status === "REQUESTED" ? "CONFIRMED" : booking.status,
      },
    });
    return;
  }

  if (payment.griefApplicationId) {
    const application = await tx.griefApplication.findUnique({
      where: { id: payment.griefApplicationId },
    });
    if (!application) return;

    const paidTotal = await sumSettled(tx, {
      griefApplicationId: payment.griefApplicationId,
    });
    const total = application.amountKes ?? amount;

    await tx.griefApplication.update({
      where: { id: application.id },
      data: { paymentStatus: paidTotal >= total ? "PAID" : "PROCESSING" },
    });
    return;
  }

  if (payment.donationId) {
    await tx.donation.update({
      where: { id: payment.donationId },
      data: { paymentStatus: "PAID" },
    });
  }
}

async function sumSettled(tx: TxClient, where: Prisma.PaymentWhereInput) {
  const rows = await tx.payment.findMany({
    where: { ...where, status: { in: SETTLED } },
    select: { settledAmountKes: true, amountKes: true },
  });
  return rows.reduce(
    (total, row) => total + (row.settledAmountKes ?? row.amountKes),
    0,
  );
}

export async function processEvent(event: NormalizedEvent) {
  const payment = await resolvePayment(event);
  const stored = await recordEvent(event, payment?.id ?? null);

  if (!stored) {
    return { duplicate: true as const };
  }

  if (!payment) {
    await prisma.paymentEvent.update({
      where: { id: stored.id },
      data: { error: "No matching payment for this event" },
    });
    return { duplicate: false as const, matched: false as const };
  }

  try {
    const outcome = await settlePayment(payment.id, event.result);
    await prisma.paymentEvent.update({
      where: { id: stored.id },
      data: { processed: true },
    });

    if (outcome.applied) {
      const { sendPaymentFailureNotice, sendPaymentReceipt } = await import(
        "./receipts"
      );
      if (event.result.status === "PAID") {
        await sendPaymentReceipt(payment.id);
      } else if (event.result.status === "FAILED") {
        await sendPaymentFailureNotice(payment.id);
      }
    }

    return { duplicate: false as const, matched: true as const, outcome };
  } catch (error) {
    await prisma.paymentEvent.update({
      where: { id: stored.id },
      data: { error: error instanceof Error ? error.message : String(error) },
    });
    throw error;
  }
}

export async function expireStalePayments(now = new Date()) {
  const { count } = await prisma.payment.updateMany({
    where: {
      status: { in: ["PENDING", "PROCESSING"] },
      expiresAt: { lt: now },
    },
    data: { status: "FAILED", failureReason: "Payment request timed out" },
  });
  return count;
}
