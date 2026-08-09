import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { bookingSchema } from "@/server/validation/booking";
import {
  MAX_DONATION_KES,
  MIN_DONATION_KES,
  donationSchema,
} from "@/server/validation/donation";
import { inquirySchema } from "@/server/validation/inquiry";

const NOW = new Date("2026-08-09T09:00:00.000Z");

const validBooking = {
  serviceSlug: "individual",
  clientName: "Asha Wanjiru",
  clientEmail: "asha@example.com",
  clientPhone: "0712345678",
  preferredDate: "2026-08-20",
  preferredTime: "10:00 AM",
  sessionMode: "IN_PERSON" as const,
};

const validDonation = {
  donorName: "Asha Wanjiru",
  donorEmail: "asha@example.com",
  amountKes: 5000,
  isAnonymous: false,
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("bookingSchema", () => {
  it("accepts a well-formed booking", () => {
    expect(bookingSchema.safeParse(validBooking).success).toBe(true);
  });

  it("rejects a preferred date in the past", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      preferredDate: "2026-08-01",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a preferred date of today", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      preferredDate: "2026-08-09",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a non-Kenyan phone number", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      clientPhone: "+1 555 0100",
    });
    expect(result.success).toBe(false);
  });

  it.each(["0712345678", "0110000000", "254712345678", "+254712345678"])(
    "accepts Kenyan phone format %s",
    (clientPhone) => {
      expect(bookingSchema.safeParse({ ...validBooking, clientPhone }).success).toBe(
        true,
      );
    },
  );

  it("rejects a malformed email", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      clientEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown session mode", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      sessionMode: "TELEPATHY",
    });
    expect(result.success).toBe(false);
  });

  it("strips a client-supplied amount so pricing stays server-side", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      amountKes: 1,
      depositKes: 1,
    });

    expect(result.success).toBe(true);
    expect(result.data).not.toHaveProperty("amountKes");
    expect(result.data).not.toHaveProperty("depositKes");
  });
});

describe("donationSchema", () => {
  it("accepts a well-formed donation", () => {
    expect(donationSchema.safeParse(validDonation).success).toBe(true);
  });

  it("rejects an amount below the minimum", () => {
    const result = donationSchema.safeParse({
      ...validDonation,
      amountKes: MIN_DONATION_KES - 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an amount above the maximum", () => {
    const result = donationSchema.safeParse({
      ...validDonation,
      amountKes: MAX_DONATION_KES + 1,
    });
    expect(result.success).toBe(false);
  });

  it("accepts the exact boundary amounts", () => {
    expect(
      donationSchema.safeParse({ ...validDonation, amountKes: MIN_DONATION_KES })
        .success,
    ).toBe(true);
    expect(
      donationSchema.safeParse({ ...validDonation, amountKes: MAX_DONATION_KES })
        .success,
    ).toBe(true);
  });

  it("rejects a fractional amount", () => {
    const result = donationSchema.safeParse({ ...validDonation, amountKes: 100.5 });
    expect(result.success).toBe(false);
  });

  it("rejects a negative amount", () => {
    const result = donationSchema.safeParse({ ...validDonation, amountKes: -5000 });
    expect(result.success).toBe(false);
  });

  it("defaults isAnonymous to false when omitted", () => {
    const result = donationSchema.safeParse({
      donorName: "Asha Wanjiru",
      donorEmail: "asha@example.com",
      amountKes: 5000,
    });

    expect(result.success).toBe(true);
    expect(result.data?.isAnonymous).toBe(false);
  });

  it("still requires contact details when anonymous", () => {
    const result = donationSchema.safeParse({
      amountKes: 5000,
      isAnonymous: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("inquirySchema", () => {
  it("accepts a contact enquiry", () => {
    const result = inquirySchema.safeParse({
      name: "Asha Wanjiru",
      email: "asha@example.com",
      message: "I would like to know more about family therapy.",
      type: "CONTACT",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty message", () => {
    const result = inquirySchema.safeParse({
      name: "Asha Wanjiru",
      email: "asha@example.com",
      message: "",
      type: "CONTACT",
    });
    expect(result.success).toBe(false);
  });
});
