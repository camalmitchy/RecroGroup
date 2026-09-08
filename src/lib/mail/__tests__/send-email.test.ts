import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn(async () => ({ id: "console-1", accepted: true }));

vi.mock("../drivers/console", () => ({
  consoleMailDriver: { name: "console", send },
}));
vi.mock("../drivers/resend", () => ({
  resendMailDriver: { name: "resend", send },
}));

const { sendEmail } = await import("../index");

const baseMessage = {
  to: { email: "ada@example.com", name: "Ada Lovelace" },
  subject: "Booking request RB-1",
  html: "<p>We received your booking</p>",
  text: "We received your booking",
};

beforeEach(() => {
  send.mockClear();
  vi.unstubAllEnvs();
  vi.stubEnv("MAIL_DRIVER", "console");
  vi.stubEnv("MAIL_FROM", "");
  vi.stubEnv("MAIL_REPLY_TO", "");
});

describe("sendEmail", () => {
  it("injects the default from address before sending", async () => {
    await sendEmail(baseMessage);

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Recro Group <no-reply@recrogroup.co.ke>",
        subject: "Booking request RB-1",
        to: baseMessage.to,
      }),
    );
  });

  it("injects MAIL_REPLY_TO when set", async () => {
    vi.stubEnv("MAIL_FROM", "Recro Group <bookings@recrogroup.co.ke>");
    vi.stubEnv("MAIL_REPLY_TO", "hello@recrogroup.co.ke");

    await sendEmail(baseMessage);

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Recro Group <bookings@recrogroup.co.ke>",
        replyTo: "hello@recrogroup.co.ke",
      }),
    );
  });
});
