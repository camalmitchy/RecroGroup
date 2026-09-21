import { describe, expect, it } from "vitest";

import {
  TIME_SLOTS,
  bookingEntryStep,
  generateAvailableDates,
  isTimeSlot,
  parseDateOnly,
  toDateOnly,
} from "@/features/public/booking/lib/schedule";

describe("booking schedule", () => {
  it("skips Sundays and returns 14 clinic days", () => {
    const from = new Date(2026, 8, 21);
    const dates = generateAvailableDates(from);

    expect(dates).toHaveLength(14);
    expect(dates.every((date) => date.getDay() !== 0)).toBe(true);
    expect(toDateOnly(dates[0])).toBe("2026-09-22");
  });

  it("recognises clinic time slots", () => {
    expect(TIME_SLOTS[0]).toBe("9:00 AM");
    expect(TIME_SLOTS.at(-1)).toBe("5:00 PM");
    expect(isTimeSlot("10:00 AM")).toBe(true);
    expect(isTimeSlot("10:00")).toBe(false);
  });

  it("starts booking at intake when service, date, and time are already chosen", () => {
    expect(
      bookingEntryStep({
        hasService: true,
        date: "2026-09-22",
        time: "10:00 AM",
      }),
    ).toBe("intake");
    expect(
      bookingEntryStep({
        hasService: true,
        date: "2026-09-22",
        time: "10:00+AM",
      }),
    ).toBe("intake");
  });

  it("falls back to the time step when only the service is chosen", () => {
    expect(
      bookingEntryStep({
        hasService: true,
        date: "2026-09-22",
        time: null,
      }),
    ).toBe("time");
    expect(
      bookingEntryStep({
        hasService: false,
        date: null,
        time: null,
      }),
    ).toBe("service");
  });

  it("parses date-only strings in local time", () => {
    const date = parseDateOnly("2026-09-22");
    expect(date).not.toBeNull();
    expect(toDateOnly(date!)).toBe("2026-09-22");
  });
});
