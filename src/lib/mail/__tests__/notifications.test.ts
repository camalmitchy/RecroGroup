import { beforeEach, describe, expect, it, vi } from "vitest";

const sendEmail = vi.fn(async () => ({ id: "1", accepted: true }));

vi.mock("../index", () => ({
  mailConfig: {
    get staffAddress() {
      const value = process.env.MAIL_STAFF_ADDRESS?.trim();
      return value ? value : undefined;
    },
  },
  sendEmail,
}));

const { notifyBookingCreated } = await import("../notifications");

const input = {
  recipientName: "Ada Lovelace",
  recipientEmail: "ada@example.com",
  reference: "RB-1",
  serviceTitle: "Individual Therapy",
  scheduledFor: new Date("2026-09-10T10:00:00.000Z"),
  amountKes: 5000,
  depositKes: 2500,
  balanceKes: 2500,
};

beforeEach(() => {
  sendEmail.mockClear();
  vi.unstubAllEnvs();
});

describe("notifyBookingCreated", () => {
  it("emails the client", async () => {
    await notifyBookingCreated(input);

    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: { email: "ada@example.com", name: "Ada Lovelace" },
        subject: "Booking request RB-1",
      }),
    );
    expect(sendEmail.mock.calls[0]?.[0].bcc).toBeUndefined();
  });

  it("BCC staff when MAIL_STAFF_ADDRESS is set", async () => {
    vi.stubEnv("MAIL_STAFF_ADDRESS", "desk@recrogroup.co.ke");

    await notifyBookingCreated(input);

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        bcc: "desk@recrogroup.co.ke",
        subject: "Booking request RB-1",
      }),
    );
  });
});
