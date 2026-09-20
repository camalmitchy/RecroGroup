import { describe, expect, it } from "vitest";

import { buildMatchReport, referencesRelated } from "@/lib/payments/reconciliation";

const base = {
  bankReference: "RB-YP8WH4YT",
  proofUrl: "https://blob.example/slip.jpg",
  bookingReference: "RB-YP8WH4YT",
  paymentReference: "RP-ABCD2345",
  duplicateOf: null,
};

describe("referencesRelated", () => {
  it("matches an exact reference", () => {
    expect(referencesRelated("RB-YP8WH4YT", "RB-YP8WH4YT")).toBe(true);
  });

  it("ignores case, spacing and punctuation", () => {
    expect(referencesRelated("rb yp8wh4yt", "RB-YP8WH4YT")).toBe(true);
  });

  it("matches when the slip reference embeds the booking reference", () => {
    expect(referencesRelated("TRF/RB-YP8WH4YT/2026", "RB-YP8WH4YT")).toBe(true);
  });

  it("rejects an unrelated reference", () => {
    expect(referencesRelated("TXN20260620-9381", "RB-YP8WH4YT")).toBe(false);
  });

  it("rejects empty input rather than matching everything", () => {
    expect(referencesRelated("", "RB-YP8WH4YT")).toBe(false);
    expect(referencesRelated("RB-YP8WH4YT", "")).toBe(false);
  });
});

describe("buildMatchReport", () => {
  it("passes cleanly when everything lines up", () => {
    const report = buildMatchReport(base);
    expect(report.severity).toBe("ok");
    expect(report.checks.every((c) => c.severity === "ok")).toBe(true);
  });

  it("flags a duplicate slip as a hard mismatch", () => {
    const report = buildMatchReport({ ...base, duplicateOf: "RP-EARLIER1" });
    expect(report.severity).toBe("mismatch");
    expect(report.summary).toMatch(/do not verify/i);
  });

  it("warns when the reference does not resemble the booking", () => {
    const report = buildMatchReport({ ...base, bankReference: "UNRELATED-123" });
    expect(report.severity).toBe("warn");
  });

  it("warns when no slip was attached", () => {
    const report = buildMatchReport({ ...base, proofUrl: null });
    expect(report.severity).toBe("warn");
  });

  it("lets a duplicate outrank a mere warning", () => {
    const report = buildMatchReport({
      ...base,
      proofUrl: null,
      duplicateOf: "RP-EARLIER1",
    });
    expect(report.severity).toBe("mismatch");
  });

  it("matches against the payment reference when the booking one differs", () => {
    const report = buildMatchReport({
      ...base,
      bankReference: "RP-ABCD2345",
      bookingReference: "RB-OTHER999",
    });
    expect(report.severity).toBe("ok");
  });
});
