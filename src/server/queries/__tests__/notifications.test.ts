import { describe, expect, it } from "vitest";

import {
  NOTIFICATION_RETENTION_MS,
  notificationCutoff,
} from "@/server/queries/notifications";

describe("notificationCutoff", () => {
  it("is one week before the given time", () => {
    const now = new Date("2026-10-08T05:00:00.000Z");

    expect(notificationCutoff(now).toISOString()).toBe("2026-10-01T05:00:00.000Z");
    expect(NOTIFICATION_RETENTION_MS).toBe(7 * 24 * 60 * 60 * 1000);
  });
});
