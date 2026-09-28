import { describe, expect, it } from "vitest";

import {
  formatMinutesLabel,
  isStartTaken,
  nairobiWeekday,
  parseSlotMinutes,
  rangesOverlap,
  sessionEndLabel,
  slotWinners,
} from "../slots";

describe("session windows", () => {
  it("parses clinic time labels", () => {
    expect(parseSlotMinutes("9:00 AM")).toBe(9 * 60);
    expect(parseSlotMinutes("12:00 PM")).toBe(12 * 60);
    expect(parseSlotMinutes("1:00 PM")).toBe(13 * 60);
    expect(parseSlotMinutes("5:00 PM")).toBe(17 * 60);
  });

  it("blocks the following hour when a session runs for two hours", () => {
    const held = [{ weekday: 2, startMin: 9 * 60, durationMin: 120 }];
    expect(
      isStartTaken({
        weekday: 2,
        startLabel: "9:00 AM",
        durationMin: 60,
        held,
      }),
    ).toBe(true);
    expect(
      isStartTaken({
        weekday: 2,
        startLabel: "10:00 AM",
        durationMin: 60,
        held,
      }),
    ).toBe(true);
    expect(
      isStartTaken({
        weekday: 2,
        startLabel: "11:00 AM",
        durationMin: 60,
        held,
      }),
    ).toBe(false);
    expect(
      isStartTaken({
        weekday: 3,
        startLabel: "9:00 AM",
        durationMin: 60,
        held,
      }),
    ).toBe(false);
  });

  it("treats the session end as exclusive", () => {
    expect(rangesOverlap(9 * 60, 120, 11 * 60, 60)).toBe(false);
    expect(sessionEndLabel("9:00 AM", 120)).toBe("11:00 AM");
    expect(formatMinutesLabel(9 * 60 + 50)).toBe("9:50 AM");
  });

  it("reads Tuesday in Nairobi from a date-only instant", () => {
    expect(nairobiWeekday(new Date("2026-09-29T00:00:00.000Z"))).toBe(2);
  });
});

describe("slotWinners", () => {
  it("keeps the earlier payment and releases the overlapping one", () => {
    const result = slotWinners([
      {
        id: "later",
        weekday: 2,
        startMin: 10 * 60,
        durationMin: 60,
        paidAtMs: 200,
      },
      {
        id: "earlier",
        weekday: 2,
        startMin: 9 * 60,
        durationMin: 120,
        paidAtMs: 100,
      },
    ]);

    expect([...result.hold]).toEqual(["earlier"]);
    expect([...result.release]).toEqual(["later"]);
  });

  it("allows the same clock time on a different weekday", () => {
    const result = slotWinners([
      {
        id: "tue",
        weekday: 2,
        startMin: 9 * 60,
        durationMin: 60,
        paidAtMs: 100,
      },
      {
        id: "wed",
        weekday: 3,
        startMin: 9 * 60,
        durationMin: 60,
        paidAtMs: 200,
      },
    ]);

    expect(result.hold.has("tue")).toBe(true);
    expect(result.hold.has("wed")).toBe(true);
    expect(result.release.size).toBe(0);
  });
});
