import { describe, expect, it } from "vitest";

import { resolveBookingChargeAmount } from "@/lib/payments/pricing";

describe("resolveBookingChargeAmount", () => {
  it("charges the deposit on an untouched booking", () => {
    const result = resolveBookingChargeAmount({
      amountKes: 5000,
      depositKes: 2500,
      amountPaidKes: 0,
    });

    expect(result).toEqual({
      amountKes: 2500,
      purpose: "BOOKING_DEPOSIT",
      outstanding: 5000,
    });
  });

  it("charges the remaining balance once a deposit is settled", () => {
    const result = resolveBookingChargeAmount({
      amountKes: 5000,
      depositKes: 2500,
      amountPaidKes: 2500,
    });

    expect(result).toEqual({
      amountKes: 2500,
      purpose: "BOOKING_BALANCE",
      outstanding: 2500,
    });
  });

  it("charges nothing when the booking is fully paid", () => {
    const result = resolveBookingChargeAmount({
      amountKes: 5000,
      depositKes: 2500,
      amountPaidKes: 5000,
    });

    expect(result.amountKes).toBe(0);
    expect(result.outstanding).toBe(0);
  });

  it("treats a deposit covering the full price as a single payment", () => {
    const result = resolveBookingChargeAmount({
      amountKes: 5000,
      depositKes: 5000,
      amountPaidKes: 0,
    });

    expect(result.purpose).toBe("BOOKING_FULL");
    expect(result.amountKes).toBe(5000);
  });

  it("treats a missing deposit as payment in full", () => {
    const result = resolveBookingChargeAmount({
      amountKes: 8000,
      depositKes: null,
      amountPaidKes: 0,
    });

    expect(result.purpose).toBe("BOOKING_FULL");
    expect(result.amountKes).toBe(8000);
  });

  it("never returns a negative amount when overpaid", () => {
    const result = resolveBookingChargeAmount({
      amountKes: 5000,
      depositKes: 2500,
      amountPaidKes: 7500,
    });

    expect(result.amountKes).toBe(0);
    expect(result.outstanding).toBe(0);
  });

  it("never charges more than the outstanding balance", () => {
    const result = resolveBookingChargeAmount({
      amountKes: 5000,
      depositKes: 4000,
      amountPaidKes: 3000,
    });

    expect(result.amountKes).toBe(2000);
    expect(result.amountKes).toBeLessThanOrEqual(result.outstanding);
  });

  it("charges nothing when no price was ever set", () => {
    const result = resolveBookingChargeAmount({
      amountKes: null,
      depositKes: null,
      amountPaidKes: 0,
    });

    expect(result.amountKes).toBe(0);
  });

  it("handles a partial payment smaller than the deposit", () => {
    const result = resolveBookingChargeAmount({
      amountKes: 5000,
      depositKes: 2500,
      amountPaidKes: 1000,
    });

    expect(result.purpose).toBe("BOOKING_BALANCE");
    expect(result.amountKes).toBe(4000);
  });
});
