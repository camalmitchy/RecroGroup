import {
  PaymentsPanel,
  type PaymentRow,
} from "@/features/portal/components/payments-panel";
import { formatDate, formatDateTime } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { getPaymentPanelStats, listPayments } from "@/server/queries/payments";

export default async function PaymentsPage() {
  await getRequiredSession("/dashboard/payments");

  const [payments, stats] = await Promise.all([
    listPayments({ take: 200 }),
    getPaymentPanelStats(),
  ]);

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
    createdAtLabel: formatDate(payment.createdAt),
    paidAtLabel: payment.paidAt ? formatDateTime(payment.paidAt) : null,
  }));

  return <PaymentsPanel payments={rows} stats={stats} />;
}
