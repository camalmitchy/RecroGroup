import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { appointmentReminderEmail } from "@/lib/mail/templates";

/**
 * Cron endpoint to send appointment reminders
 * 
 * This should be called by a scheduler (Vercel Cron, cron-job.org, etc.)
 * Configure it to run daily, e.g., at 9:00 AM
 * 
 * Protect with CRON_SECRET in production
 */
export async function GET(request: NextRequest) {
  try {
    // Authorization check
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Calculate tomorrow's date range
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    console.log(`[cron/reminders] Looking for appointments between ${tomorrow.toISOString()} and ${dayAfterTomorrow.toISOString()}`);

    // Find all appointments scheduled for tomorrow
    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
        status: "CONFIRMED",
        reminderSentAt: null,
      },
      include: {
        user: true,
        therapist: true,
        service: true,
        booking: {
          include: {
            service: true,
          },
        },
      },
    });

    console.log(`[cron/reminders] Found ${appointments.length} appointments to remind`);

    const results = {
      total: appointments.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send reminders
    for (const appointment of appointments) {
      try {
        const recipientEmail =
          appointment.user?.email ?? appointment.booking?.clientEmail;
        if (!recipientEmail) {
          results.failed++;
          results.errors.push(
            `No email on appointment ${appointment.id}`,
          );
          continue;
        }

        const recipientName =
          appointment.user?.name ??
          appointment.booking?.clientName ??
          recipientEmail;

        const appointmentDate = new Date(appointment.appointmentDate);
        const formattedDate = appointmentDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const formattedTime = appointment.appointmentTime || "To be confirmed";

        const emailContent = appointmentReminderEmail({
          customerName: recipientName,
          serviceName:
            appointment.booking?.service?.title ??
            appointment.service?.title ??
            "Your Session",
          appointmentDate: formattedDate,
          appointmentTime: formattedTime,
          therapistName:
            appointment.therapistName ??
            appointment.therapist?.fullName ??
            undefined,
          location: appointment.location || undefined,
          notes: appointment.notes || undefined,
        });

        const result = await sendEmail({
          to: recipientEmail,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html,
        });

        if (result?.accepted) {
          await prisma.appointment.update({
            where: { id: appointment.id },
            data: { reminderSentAt: new Date() },
          });

          results.sent++;
          console.log(
            `[cron/reminders] Sent reminder to ${recipientEmail} for appointment ${appointment.id}`,
          );
        } else {
          results.failed++;
          results.errors.push(
            `Failed to send to ${recipientEmail}: ${result?.error}`,
          );
        }
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        results.errors.push(`Error processing appointment ${appointment.id}: ${errorMessage}`);
        console.error(`[cron/reminders] Error sending reminder for appointment ${appointment.id}:`, error);
      }
    }

    console.log(`[cron/reminders] Completed: ${results.sent} sent, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error("[cron/reminders] Fatal error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Allow POST as well for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
