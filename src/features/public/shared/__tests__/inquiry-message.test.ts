import { describe, expect, it } from "vitest";

import {
  formatInquiryMessage,
  truncateSubject,
} from "@/features/public/shared/inquiry-message";
import { inquirySchema } from "@/server/validation/inquiry";

describe("formatInquiryMessage", () => {
  it("renders a section heading in uppercase with label/value lines", () => {
    const message = formatInquiryMessage([
      {
        heading: "Organization",
        fields: [
          ["Company", "Recro Group"],
          ["Contact", "Asha Wanjiru"],
        ],
      },
    ]);

    expect(message).toBe("ORGANIZATION\nCompany: Recro Group\nContact: Asha Wanjiru");
  });

  it("separates sections with a blank line", () => {
    const message = formatInquiryMessage([
      { heading: "One", fields: [["A", "1"]] },
      { heading: "Two", fields: [["B", "2"]] },
    ]);

    expect(message).toBe("ONE\nA: 1\n\nTWO\nB: 2");
  });

  it("renders booleans as Yes and No", () => {
    const message = formatInquiryMessage([
      {
        heading: "Health",
        fields: [
          ["Had surgery", true],
          ["On medication", false],
        ],
      },
    ]);

    expect(message).toContain("Had surgery: Yes");
    expect(message).toContain("On medication: No");
  });

  it("drops empty, null and undefined fields", () => {
    const message = formatInquiryMessage([
      {
        heading: "Details",
        fields: [
          ["Kept", "value"],
          ["Empty", ""],
          ["Blank", "   "],
          ["Missing", null],
          ["Absent", undefined],
        ],
      },
    ]);

    expect(message).toBe("DETAILS\nKept: value");
  });

  it("drops a section whose fields are all empty", () => {
    const message = formatInquiryMessage([
      { heading: "Kept", fields: [["A", "1"]] },
      { heading: "Dropped", fields: [["B", ""], ["C", null]] },
    ]);

    expect(message).not.toContain("DROPPED");
  });

  it("puts multi-line values on their own line", () => {
    const message = formatInquiryMessage([
      { heading: "Notes", fields: [["Comment", "line one\nline two"]] },
    ]);

    expect(message).toBe("NOTES\nComment:\nline one\nline two");
  });

  it("returns an empty string when nothing was filled in", () => {
    expect(formatInquiryMessage([{ heading: "None", fields: [["A", ""]] }])).toBe("");
  });

  it("truncates an oversized message and says so", () => {
    const message = formatInquiryMessage([
      { heading: "Long", fields: [["Essay", "x".repeat(9000)]] },
    ]);

    expect(message.length).toBeLessThanOrEqual(5000);
    expect(message).toContain("[Truncated");
  });

  it("keeps a truncated message acceptable to the inquiry schema", () => {
    const message = formatInquiryMessage([
      { heading: "Long", fields: [["Essay", "x".repeat(20000)]] },
    ]);

    const result = inquirySchema.safeParse({
      name: "Asha Wanjiru",
      email: "asha@example.com",
      message,
      type: "CORPORATE",
    });

    expect(result.success).toBe(true);
  });
});

describe("truncateSubject", () => {
  it("leaves a short subject unchanged", () => {
    expect(truncateSubject("Corporate training — Recro")).toBe(
      "Corporate training — Recro",
    );
  });

  it("truncates an oversized subject with an ellipsis", () => {
    const subject = truncateSubject("y".repeat(500));

    expect(subject.length).toBeLessThanOrEqual(200);
    expect(subject.endsWith("…")).toBe(true);
  });
});
