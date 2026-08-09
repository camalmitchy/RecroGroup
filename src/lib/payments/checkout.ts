import "server-only";

import type { PaymentMethod, PaymentPurpose } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { absoluteUrl, darajaConfig, paymentsConfig } from "./config";
import { getProvider, providerForMethod } from "./index";
import { resolveBookingChargeAmount, resolveCampPrice } from "./pricing";
import { createPendingPayment, markPaymentProcessing } from "./service";
import type { PaymentTarget } from "./types";
import { PaymentError } from "./types";
import { assertPositiveAmount, normalizePhone } from "./utils";

export type CheckoutInput = {
  target: PaymentTarget;
  method: PaymentMethod;
  phone?: string | null;
  email?: string | null;
  name?: string | null;
  userId?: string | null;
  idempotencyKey?: string | null;
};

export type CheckoutResult = {
  paymentId: string;
  reference: string;
  status: string;
  amountKes: number;
  redirectUrl?: string | null;
  customerMessage?: string | null;
};

type ResolvedCharge = {
  amountKes: number;
  purpose: PaymentPurpose;
  description: string;
  customer: { name?: string | null; email?: string | null; phone?: string | null };
};

async function resolveCharge(input: CheckoutInput): Promise<ResolvedCharge> {
  switch (input.target.kind) {
    case "booking": {
      const booking = await prisma.booking.findUnique({
        where: { id: input.target.bookingId },
        include: { service: true },
      });
      if (!booking) throw new PaymentError("not_found", "Booking not found");

      const charge = resolveBookingChargeAmount(booking);
      if (charge.amountKes <= 0) {
        throw new PaymentError("already_paid", "This booking is fully paid");
      }

      return {
        amountKes: charge.amountKes,
        purpose: charge.purpose,
        description: booking.service?.title ?? "Therapy session",
        customer: {
          name: input.name ?? booking.clientName,
          email: input.email ?? booking.clientEmail,
          phone: input.phone ?? booking.clientPhone,
        },
      };
    }

    case "griefApplication": {
      const application = await prisma.griefApplication.findUnique({
        where: { id: input.target.griefApplicationId },
      });
      if (!application) {
        throw new PaymentError("not_found", "Application not found");
      }

      const amountKes =
        application.amountKes ??
        (await resolveCampPrice({ parentAttending: application.parentAttending }))
          .totalKes;

      if (application.paymentStatus === "PAID") {
        throw new PaymentError("already_paid", "This application is already paid");
      }

      return {
        amountKes,
        purpose: "GRIEF_CAMP_FEE",
        description: "Grief camp fee",
        customer: {
          name: input.name ?? application.parentName,
          email: input.email ?? application.parentEmail,
          phone: input.phone ?? application.parentPhone,
        },
      };
    }

    case "donation": {
      const donation = await prisma.donation.findUnique({
        where: { id: input.target.donationId },
      });
      if (!donation) throw new PaymentError("not_found", "Donation not found");

      if (donation.paymentStatus === "PAID") {
        throw new PaymentError("already_paid", "This donation is already paid");
      }

      return {
        amountKes: donation.amountKes,
        purpose: "DONATION",
        description: "Sponsor a child",
        customer: {
          name: input.name ?? donation.donorName,
          email: input.email ?? donation.donorEmail,
          phone: input.phone ?? donation.donorPhone,
        },
      };
    }
  }
}

export async function startCheckout(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  const charge = await resolveCharge(input);
  assertPositiveAmount(charge.amountKes, "Payment amount");

  const providerId = providerForMethod(input.method);

  if (input.method === "MPESA") {
    const phone = charge.customer.phone;
    if (!phone) {
      throw new PaymentError("missing_phone", "A phone number is required for M-Pesa");
    }
    charge.customer.phone = normalizePhone(phone);
  }

  if (input.method === "CARD" && !charge.customer.email) {
    throw new PaymentError("missing_email", "An email is required for card payments");
  }

  const payment = await createPendingPayment({
    target: input.target,
    userId: input.userId ?? null,
    method: input.method,
    provider: providerId,
    purpose: charge.purpose,
    amountKes: charge.amountKes,
    phone: charge.customer.phone,
    idempotencyKey: input.idempotencyKey ?? null,
  });

  if (payment.status !== "PENDING") {
    return {
      paymentId: payment.id,
      reference: payment.reference,
      status: payment.status,
      amountKes: payment.amountKes,
    };
  }

  const adapter = getProvider(providerId);

  const result = await adapter.charge({
    reference: payment.reference,
    amountKes: payment.amountKes,
    currency: payment.currency,
    purpose: payment.purpose,
    description: charge.description,
    customer: charge.customer,
    callbackUrl:
      input.method === "MPESA"
        ? (darajaConfig.callbackUrl ??
          absoluteUrl("/api/payments/webhooks/mpesa"))
        : absoluteUrl(
            `/api/payments/return?reference=${encodeURIComponent(payment.reference)}`,
          ),
    metadata: {
      paymentId: payment.id,
      purpose: payment.purpose,
      target: input.target.kind,
    },
  });

  const expiresAt = new Date(
    Date.now() + paymentsConfig.stkTimeoutSeconds * 1000,
  );

  const updated = await markPaymentProcessing(payment.id, {
    providerRef: result.providerRef ?? null,
    expiresAt: input.method === "MPESA" ? expiresAt : null,
  });

  return {
    paymentId: updated.id,
    reference: updated.reference,
    status: updated.status,
    amountKes: updated.amountKes,
    redirectUrl: result.redirectUrl ?? null,
    customerMessage: result.customerMessage ?? null,
  };
}

export async function refreshPaymentStatus(reference: string) {
  const payment = await prisma.payment.findUnique({ where: { reference } });
  if (!payment) throw new PaymentError("not_found", "Payment not found");

  if (
    payment.status === "PAID" ||
    payment.status === "FAILED" ||
    payment.status === "CANCELLED" ||
    payment.status === "REFUNDED" ||
    payment.provider === "MANUAL"
  ) {
    return payment;
  }

  const adapter = getProvider(payment.provider);
  const result = await adapter.verify({
    reference: payment.reference,
    providerRef: payment.providerRef,
    currency: payment.currency,
  });

  if (result.status === payment.status) return payment;

  const { settlePayment } = await import("./service");
  const outcome = await settlePayment(payment.id, result);
  return outcome.payment ?? payment;
}
