import {
  PaymentsPanel,
  type PaymentRow,
} from "@/features/portal/components/payments-panel";
import { formatDate, formatDateTime } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { getPaymentPanelStats, listPayments } from "@/server/queries/payments";
import { buildMatchReport } from "@/lib/payments/reconciliation";

export default async function PaymentsPage() {
  await getRequiredSession("/dashboard/payments");

  const [payments, stats] = await Promise.all([
    listPayments({ take: 200 }),
    getPaymentPanelStats(),
  ]);

  const seen = new Map<string, string>();
  const duplicateRefs = new Map<string, string>();
  for (const payment of [...payments.items].reverse()) {
    const key = payment.bankReference?.trim().toUpperCase();
    if (!key || payment.method !== "BANK") continue;
    const first = seen.get(key);
    if (first) duplicateRefs.set(payment.id, first);
    else seen.set(key, payment.reference);
  }

  const rows: PaymentRow[] = payments.items.map((payment) => ({
    id: payment.id,
    reference: payment.reference,
    method: payment.method,
    provider: payment.provider,
    purpose: payment.purpose,
    currency: payment.currency,
    amountKes: payment.amountKes,
    settledAmountKes: payment.settledAmountKes,
    status: payment.status,
    mpesaReceipt: payment.mpesaReceipt,
    providerRef: payment.providerRef,
    failureReason: payment.failureReason,
    phone: payment.phone,
    bookingReference: payment.booking?.reference ?? null,
    bankReference: payment.bankReference,
    proofUrl: payment.proofUrl,
    match:
      payment.method === "BANK"
        ? buildMatchReport({
            bankReference: payment.bankReference ?? "",
            proofUrl: payment.proofUrl,
            bookingReference: payment.booking?.reference ?? "",
            paymentReference: payment.reference,
            duplicateOf: duplicateRefs.get(payment.id) ?? null,
          })
        : null,
    createdAtLabel: formatDate(payment.createdAt),
    paidAtLabel: payment.paidAt ? formatDateTime(payment.paidAt) : null,
  }));

  return <PaymentsPanel payments={rows} stats={stats} />;
}
