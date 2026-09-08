import { describe, expect, it } from "vitest";

import { applyMailDefaults, formatRecipient, formatRecipientList } from "../outbound";

describe("formatRecipient", () => {
  it("keeps a bare address", () => {
    expect(formatRecipient("ada@example.com")).toBe("ada@example.com");
  });

  it("formats a named address", () => {
    expect(formatRecipient({ email: "ada@example.com", name: "Ada" })).toBe(
      "Ada <ada@example.com>",
    );
  });
});

describe("formatRecipientList", () => {
  it("flattens mixed recipients and drops blanks", () => {
    expect(
      formatRecipientList([
        { email: "ada@example.com", name: "Ada" },
        "bee@example.com",
        { email: "  ", name: "Skip" },
      ]),
    ).toEqual(["Ada <ada@example.com>", "bee@example.com"]);
  });
});

describe("applyMailDefaults", () => {
  it("fills from and replyTo from config", () => {
    const outbound = applyMailDefaults(
      {
        to: "ada@example.com",
        subject: "Booking request RB-1",
        html: "<p>Hi</p>",
        text: "Hi",
      },
      {
        from: "Recro Group <no-reply@recrogroup.co.ke>",
        replyTo: "hello@recrogroup.co.ke",
      },
    );

    expect(outbound.from).toBe("Recro Group <no-reply@recrogroup.co.ke>");
    expect(outbound.replyTo).toBe("hello@recrogroup.co.ke");
  });

  it("does not override an explicit from", () => {
    const outbound = applyMailDefaults(
      {
        from: "Sessions <sessions@recrogroup.co.ke>",
        to: "ada@example.com",
        subject: "Hi",
        html: "<p>Hi</p>",
        text: "Hi",
      },
      { from: "Recro Group <no-reply@recrogroup.co.ke>" },
    );

    expect(outbound.from).toBe("Sessions <sessions@recrogroup.co.ke>");
  });
});
