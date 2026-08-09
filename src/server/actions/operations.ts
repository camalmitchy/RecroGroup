"use server";

import { revalidatePath } from "next/cache";

import type {
  AppointmentStatus,
  BookingStatus,
  GriefApplicationStatus,
  InquiryStatus,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { AuthorizationError, requireStaff } from "@/server/authz";
import type { ActionResult } from "@/server/result";
import { fail, failure, ok } from "@/server/result";

const GRIEF_STATUSES: GriefApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
];

const INQUIRY_STATUSES: InquiryStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const BOOKING_STATUSES: BookingStatus[] = [
  "REQUESTED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

export async function setGriefApplicationStatus(
  applicationId: string,
  status: GriefApplicationStatus,
): Promise<ActionResult<{ id: string; status: GriefApplicationStatus }>> {
  try {
    await requireStaff();

    if (!GRIEF_STATUSES.includes(status)) {
      return fail("Unknown application status");
    }

    const application = await prisma.griefApplication.update({
      where: { id: applicationId },
      data: { status },
      select: { id: true, status: true },
    });

    revalidatePath("/dashboard/programs");
    revalidatePath("/admin/grief-camp");

    return ok(application);
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("setGriefApplicationStatus", error);
  }
}

export async function setInquiryStatus(
  inquiryId: string,
  status: InquiryStatus,
): Promise<ActionResult<{ id: string; status: InquiryStatus }>> {
  try {
    await requireStaff();

    if (!INQUIRY_STATUSES.includes(status)) {
      return fail("Unknown inquiry status");
    }

    const inquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status },
      select: { id: true, status: true },
    });

    revalidatePath("/dashboard/inquiries");
    revalidatePath("/admin/messages");

    return ok(inquiry);
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("setInquiryStatus", error);
  }
}

export async function setBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<ActionResult<{ id: string; status: BookingStatus }>> {
  try {
    await requireStaff();

    if (!BOOKING_STATUSES.includes(status)) {
      return fail("Unknown booking status");
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      select: { id: true, status: true },
    });

    revalidatePath("/dashboard/bookings");
    revalidatePath("/admin/bookings");

    return ok(booking);
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("setBookingStatus", error);
  }
}

export async function assignTherapist(
  bookingId: string,
  therapistId: string | null,
): Promise<ActionResult<{ id: string; therapistId: string | null }>> {
  try {
    await requireStaff();

    if (therapistId) {
      const therapist = await prisma.therapist.findUnique({
        where: { id: therapistId },
        select: { id: true, isActive: true },
      });

      if (!therapist) return fail("Therapist not found");
      if (!therapist.isActive) return fail("That therapist is no longer active");
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { therapistId },
      select: { id: true, therapistId: true },
    });

    revalidatePath("/dashboard/bookings");
    revalidatePath("/admin/bookings");

    return ok(booking);
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("assignTherapist", error);
  }
}

export async function linkPaymentToBooking(
  paymentId: string,
  bookingId: string | null,
): Promise<ActionResult<{ id: string; bookingId: string | null }>> {
  try {
    await requireStaff();

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: { id: true, status: true, bookingId: true },
    });

    if (!payment) return fail("Payment not found");

    if (payment.status === "PAID" && payment.bookingId && bookingId !== payment.bookingId) {
      return fail(
        "This payment is already settled against another booking. Refund it instead of relinking.",
      );
    }

    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { id: true },
      });
      if (!booking) return fail("Booking not found");
    }

    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: { bookingId },
      select: { id: true, bookingId: true },
    });

    revalidatePath("/dashboard/payments");
    revalidatePath("/admin/payments");

    return ok(updated);
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("linkPaymentToBooking", error);
  }
}

export async function setAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
): Promise<ActionResult<{ id: string; status: AppointmentStatus }>> {
  try {
    await requireStaff();

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      select: { id: true, status: true },
    });

    revalidatePath("/dashboard/bookings");

    return ok(appointment);
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("setAppointmentStatus", error);
  }
}
