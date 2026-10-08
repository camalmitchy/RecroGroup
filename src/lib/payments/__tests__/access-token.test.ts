import { describe, expect, it } from "vitest";

import {
  createPaymentAccessToken,
  paymentAccessMatches,
  readPaymentAccessToken,
} from "@/lib/payments/access-token";

describe("payment access tokens", () => {
  it("stores and matches a token without accepting a different one", () => {
    const token = createPaymentAccessToken();
    const meta = { accessToken: token, receiptEmailSentAt: "2026-10-07" };

    expect(readPaymentAccessToken(meta)).toBe(token);
    expect(paymentAccessMatches(meta, token)).toBe(true);
    expect(paymentAccessMatches(meta, `${token}x`)).toBe(false);
    expect(paymentAccessMatches(meta, null)).toBe(false);
    expect(paymentAccessMatches({}, token)).toBe(false);
  });
});
