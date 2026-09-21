import { notFound } from "next/navigation";

import {
  BookingDetail,
  type BookingDetailData,
  type TherapistOption,
} from "@/features/portal/components/booking-detail";
import { formatDate, formatDateTime } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { getBookingById } from "@/server/queries/bookings";
import { listTherapists } from "@/server/queries/catalog";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getRequiredSession("/dashboard/bookings");
  const { id } = await params;

  const [booking, therapists] = await Promise.all([
    getBookingById(id),
    listTherapists(),
  ]);

  if (!booking) notFound();

  const detail: BookingDetailData = {
    id: booking.id,
    reference: booking.reference,
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    clientPhone: booking.clientPhone,
    preferredDateLabel: formatDate(booking.preferredDate),
    preferredTime: booking.preferredTime,
    sessionMode: booking.sessionMode,
    notes: booking.notes,
    therapistId: booking.therapistId,
    serviceTitle: booking.service?.title ?? null,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    amountKes: booking.amountKes,
    depositKes: booking.depositKes,
    amountPaidKes: booking.amountPaidKes,
    createdAtLabel: formatDate(booking.createdAt),
    payments: booking.payments.map((payment) => ({
      id: payment.id,
      reference: payment.reference,
      method: payment.method,
      status: payment.status,
      amountKes: payment.amountKes,
      mpesaReceipt: payment.mpesaReceipt,
      createdAtLabel: formatDateTime(payment.createdAt),
      paidAtLabel: payment.paidAt ? formatDateTime(payment.paidAt) : null,
    })),
    appointments: booking.appointments.map((appointment) => ({
      id: appointment.id,
      scheduledAtLabel: formatDateTime(appointment.scheduledAt),
      durationMin: appointment.durationMin,
      status: appointment.status,
    })),
  };

  const therapistOptions: TherapistOption[] = therapists
    .filter((therapist) => therapist.isActive || therapist.id === booking.therapistId)
    .map((therapist) => ({
      id: therapist.id,
      fullName: therapist.fullName,
    }));

  return <BookingDetail booking={detail} therapists={therapistOptions} />;
}
