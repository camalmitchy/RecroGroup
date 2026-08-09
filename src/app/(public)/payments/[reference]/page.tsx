import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatKes } from "@/lib/payments/utils";

export const dynamic = "force-dynamic";

const COPY = {
  PAID: {
    icon: CheckCircle2,
    tone: "text-emerald-600",
    title: "Payment received",
    body: "Thank you. A receipt has been sent to your email and our team has been notified.",
  },
  PENDING: {
    icon: Clock,
    tone: "text-amber-600",
    title: "Payment pending",
    body: "We have not received confirmation yet. If you completed the payment, it may take a moment to reflect.",
  },
  PROCESSING: {
    icon: Clock,
    tone: "text-amber-600",
    title: "Payment in progress",
    body: "We are waiting for confirmation from your payment provider. This page updates once it arrives.",
  },
  FAILED: {
    icon: XCircle,
    tone: "text-destructive",
    title: "Payment did not go through",
    body: "No money was taken. You can try again, or reach out if you need help.",
  },
  CANCELLED: {
    icon: XCircle,
    tone: "text-destructive",
    title: "Payment cancelled",
    body: "The payment was cancelled before it completed. You can try again whenever you are ready.",
  },
  REFUNDED: {
    icon: CheckCircle2,
    tone: "text-muted-foreground",
    title: "Payment refunded",
    body: "This payment has been refunded. Please allow a few days for it to reflect.",
  },
} as const;

export default async function PaymentStatusPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  const payment = await prisma.payment.findUnique({
    where: { reference },
    include: { booking: { include: { service: true } } },
  });

  if (!payment) notFound();

  const copy = COPY[payment.status];
  const Icon = copy.icon;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 md:py-24">
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <Icon className={`mx-auto size-12 ${copy.tone}`} />
        <h1 className="mt-6 font-serif text-2xl text-foreground">{copy.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{copy.body}</p>

        <dl className="mt-8 space-y-3 border-t border-border pt-6 text-left text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Reference</dt>
            <dd className="font-mono text-foreground">{payment.reference}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-medium text-foreground">
              {formatKes(payment.settledAmountKes ?? payment.amountKes)}
            </dd>
          </div>
          {payment.mpesaReceipt && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">M-Pesa receipt</dt>
              <dd className="font-mono text-foreground">{payment.mpesaReceipt}</dd>
            </div>
          )}
          {payment.booking?.service && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Service</dt>
              <dd className="text-foreground">{payment.booking.service.title}</dd>
            </div>
          )}
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border-2 border-border px-6 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Back to home
          </Link>
          {(payment.status === "FAILED" || payment.status === "CANCELLED") && (
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-full bg-primary-deep px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-deep/90"
            >
              Try again
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
