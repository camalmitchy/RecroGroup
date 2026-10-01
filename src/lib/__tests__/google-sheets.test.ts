import { describe, expect, it } from "vitest";

import { sheetTabForInquiry } from "../google-sheets";

describe("sheetTabForInquiry", () => {
  it("sends consortium applications to the Consortium tab", () => {
    expect(
      sheetTabForInquiry({
        type: "CONTACT",
        subject: "Consortium application",
      }),
    ).toBe("Consortium");
  });

  it("sends team builder applications to the Team building tab", () => {
    expect(
      sheetTabForInquiry({
        type: "CORPORATE",
        subject: "Team builder application — Jane",
      }),
    ).toBe("Team building");
  });

  it("sends corporate training inquiries to the Corporate speaking tab", () => {
    expect(
      sheetTabForInquiry({
        type: "CORPORATE",
        subject: "Corporate training — Recro",
      }),
    ).toBe("Corporate speaking");
  });

  it("ignores the public contact form", () => {
    expect(
      sheetTabForInquiry({
        type: "CONTACT",
        subject: "A question about sessions",
      }),
    ).toBeNull();
  });
});
