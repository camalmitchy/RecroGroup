import { describe, expect, it } from "vitest";

import { bookingConfirmation, staffBookingAlert } from "../templates";

describe("paid booking emails", () => {
  it("tells the client the session is confirmed", () => {
    const message = bookingConfirmation({
      recipientName: "Ada Lovelace",
      recipientEmail: "ada@example.com",
      reference: "RB-TEST",
      serviceTitle: "Individual Therapy",
      scheduledFor: null,
      preferredDateLabel: "Tuesday 6 October 2026",
      preferredTime: "9:00 AM",
      amountKes: 7000,
      depositKes: 3500,
      balanceKes: 3500,
      paid: true,
    });

    expect(message.subject).toBe("Booking confirmed RB-TEST");
    expect(message.html).toContain("Your booking is confirmed");
    expect(message.html).toContain("9:00 AM");
    expect(message.to).toEqual({
      email: "ada@example.com",
      name: "Ada Lovelace",
    });
  });

  it("alerts the admin with client and session details", () => {
    const message = staffBookingAlert({
      recipientEmail: "info@recro-group.org",
      reference: "RB-TEST",
      clientName: "Ada Lovelace",
      clientEmail: "ada@example.com",
      clientPhone: "254700000000",
      serviceTitle: "Individual Therapy",
      preferredDateLabel: "Tuesday 6 October 2026",
      preferredTime: "9:00 AM",
      amountPaidKes: 3500,
      amountKes: 7000,
    });

    expect(message.subject).toContain("Paid booking RB-TEST");
    expect(message.to).toBe("info@recro-group.org");
    expect(message.html).toContain("Ada Lovelace");
    expect(message.html).toContain("Individual Therapy");
  });
});
