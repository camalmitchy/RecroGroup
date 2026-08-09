import {
  AdminPaymentsPage,
  type AdminPaymentRow,
} from "@/features/admin/components/admin-payments-page";
import { requireAdminArea } from "@/features/admin/lib/admin-guard";
import { formatDate, formatDateTime } from "@/features/portal/lib/format";
import { getPaymentPanelStats, listPayments } from "@/server/queries/payments";

export default async function PaymentsPage() {
  const session = await requireAdminArea();

  const [payments, stats] = await Promise.all([
    listPayments({ take: 200 }),
    getPaymentPanelStats(),
  ]);

  const rows: AdminPaymentRow[] = payments.items.map((payment) => ({
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
    payerName:
      payment.user?.name ??
      payment.booking?.clientName ??
      payment.donation?.donorName ??
      payment.griefApplication?.parentName ??
      null,
    bookingReference: payment.booking?.reference ?? null,
    createdAtLabel: formatDate(payment.createdAt),
    paidAtLabel: payment.paidAt ? formatDateTime(payment.paidAt) : null,
  }));

  return (
    <AdminPaymentsPage
      payments={rows}
      stats={stats}
      isAdmin={session.role === "admin"}
    />
  );
}
