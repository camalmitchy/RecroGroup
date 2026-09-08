import { createHmac } from "node:crypto";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  parsePaystackEvent,
  paystackProvider,
  refund,
  verifyWebhookSignature,
} from "@/lib/payments/providers/paystack";
import type { ChargeRequest } from "@/lib/payments/types";

const SECRET = "test-paystack-secret";

function sign(body: string, secret = SECRET) {
  return createHmac("sha512", secret).update(body, "utf8").digest("hex");
}

function fetchCall(fetchMock: ReturnType<typeof vi.fn<typeof fetch>>, index = 0) {
  const call = fetchMock.mock.calls[index];
  if (!call) {
    throw new Error(`expected fetch call at index ${index}`);
  }
  return { url: String(call[0]), init: call[1] };
}

function paystackResponse(data: unknown, init: { ok?: boolean; status?: number } = {}) {
  return new Response(JSON.stringify({ status: init.ok === false ? false : true, message: "ok", data }), {
    status: init.status ?? 200,
  });
}

const chargeRequest: ChargeRequest = {
  reference: "BKG-ABCD2345",
  amountKes: 5_000,
  currency: "KES",
  purpose: "BOOKING_DEPOSIT",
  description: "Booking deposit",
  customer: { name: "Asha Wanjiru", email: "asha@example.com", phone: "254712345678" },
  callbackUrl: "https://recro.test/api/payments/paystack/callback",
};

beforeEach(() => {
  vi.stubEnv("PAYSTACK_SECRET_KEY", SECRET);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("verifyWebhookSignature", () => {
  const body = JSON.stringify({ event: "charge.success", data: { reference: "BKG-1" } });

  it("accepts a signature computed with the configured secret", () => {
    expect(verifyWebhookSignature(body, sign(body))).toBe(true);
  });

  it("rejects a signature computed over a tampered body", () => {
    const tampered = body.replace("BKG-1", "BKG-2");
    expect(verifyWebhookSignature(tampered, sign(body))).toBe(false);
  });

  it("rejects a signature computed with a different secret", () => {
    expect(verifyWebhookSignature(body, sign(body, "wrong-paystack-secret"))).toBe(false);
  });

  it.each([null, ""])("returns false without throwing for a %s signature", (signature) => {
    expect(() => verifyWebhookSignature(body, signature)).not.toThrow();
    expect(verifyWebhookSignature(body, signature)).toBe(false);
  });

  it("returns false rather than crashing on a signature of the wrong length", () => {
    expect(() => verifyWebhookSignature(body, "abc123")).not.toThrow();
    expect(verifyWebhookSignature(body, "abc123")).toBe(false);
    expect(verifyWebhookSignature(body, `${sign(body)}extra`)).toBe(false);
  });

  it("tolerates surrounding whitespace on the header value", () => {
    expect(verifyWebhookSignature(body, `  ${sign(body)}  `)).toBe(true);
  });

  it("returns false when the secret key is not configured", () => {
    vi.stubEnv("PAYSTACK_SECRET_KEY", "");
    expect(verifyWebhookSignature(body, sign(body))).toBe(false);
  });
});

describe("parsePaystackEvent", () => {
  it("maps charge.success to PAID and converts the subunit amount to shillings", () => {
    const event = parsePaystackEvent({
      event: "charge.success",
      data: {
        id: 991,
        reference: "BKG-ABCD2345",
        amount: 500_000,
        currency: "KES",
        paid_at: "2026-08-08T10:00:00.000Z",
      },
    });

    expect(event.result.status).toBe("PAID");
    expect(event.result.settledAmountKes).toBe(5_000);
    expect(event.providerRef).toBe("BKG-ABCD2345");
    expect(event.result.paidAt).toEqual(new Date("2026-08-08T10:00:00.000Z"));
    expect(event.result.failureReason).toBeNull();
  });

  it("maps charge.failed to FAILED and surfaces the gateway response", () => {
    const event = parsePaystackEvent({
      event: "charge.failed",
      data: { reference: "BKG-1", amount: 500_000, gateway_response: "Insufficient funds" },
    });

    expect(event.result.status).toBe("FAILED");
    expect(event.result.failureReason).toBe("Insufficient funds");
    expect(event.result.paidAt).toBeNull();
  });

  it("reads the nested transaction reference for refund.processed", () => {
    const event = parsePaystackEvent({
      event: "refund.processed",
      data: {
        amount: 250_000,
        transaction: { reference: "BKG-ORIGINAL", currency: "KES" },
      },
    });

    expect(event.result.status).toBe("REFUNDED");
    expect(event.reference).toBe("BKG-ORIGINAL");
    expect(event.result.settledAmountKes).toBe(2_500);
  });

  it("downgrades a successful charge settled in the wrong currency to FAILED", () => {
    const event = parsePaystackEvent({
      event: "charge.success",
      data: { reference: "BKG-1", amount: 500_000, currency: "NGN" },
    });

    expect(event.result.status).toBe("FAILED");
    expect(event.result.settledAmountKes).toBeNull();
    expect(event.result.failureReason).toMatch(/Currency mismatch/);
  });

  it("produces a stable dedupe key for a repeated delivery of the same event", () => {
    const payload = {
      event: "charge.success",
      data: { id: 991, reference: "BKG-1", amount: 500_000, currency: "KES" },
    };
    expect(parsePaystackEvent(payload).dedupeKey).toBe(parsePaystackEvent(payload).dedupeKey);
  });

  it("produces different dedupe keys for different transactions", () => {
    const a = parsePaystackEvent({ event: "charge.success", data: { id: 1, reference: "A", currency: "KES" } });
    const b = parsePaystackEvent({ event: "charge.success", data: { id: 2, reference: "B", currency: "KES" } });
    expect(a.dedupeKey).not.toBe(b.dedupeKey);
  });

  it.each([null, "a string", 42, [], { data: {} }, { event: "" }])(
    "throws on the malformed payload %s",
    (payload) => {
      expect(() => parsePaystackEvent(payload)).toThrow();
    },
  );

  it("throws on an event type it does not handle", () => {
    expect(() => parsePaystackEvent({ event: "subscription.create", data: {} })).toThrow(
      /Unsupported Paystack event/,
    );
  });
});

describe("paystackProvider.charge", () => {
  it("sends a KES 5,000 charge as 500000 subunits", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      paystackResponse({ authorization_url: "https://checkout.paystack.com/x", reference: "BKG-ABCD2345" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await paystackProvider.charge(chargeRequest);

    expect(JSON.parse(String(fetchCall(fetchMock).init?.body))).toMatchObject({
      amount: 500_000,
      currency: "KES",
      email: "asha@example.com",
      reference: "BKG-ABCD2345",
      channels: ["card"],
    });
  });

  it("returns the authorization url as the redirect target", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        paystackResponse({ authorization_url: "https://checkout.paystack.com/abc", reference: "PSK-1" }),
      ),
    );

    const result = await paystackProvider.charge(chargeRequest);

    expect(result).toMatchObject({
      provider: "PAYSTACK",
      method: "CARD",
      status: "PROCESSING",
      providerRef: "PSK-1",
      redirectUrl: "https://checkout.paystack.com/abc",
    });
  });

  it("authenticates with the configured secret key", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      paystackResponse({ authorization_url: "https://checkout.paystack.com/x" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await paystackProvider.charge(chargeRequest);

    const headers = fetchCall(fetchMock).init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe(`Bearer ${SECRET}`);
  });

  it("rejects a non-integer amount before any network call", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(paystackProvider.charge({ ...chargeRequest, amountKes: 100.5 })).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a charge with no customer email before any network call", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      paystackProvider.charge({ ...chargeRequest, customer: { ...chargeRequest.customer, email: null } }),
    ).rejects.toThrow(/requires a customer email/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws when Paystack omits the authorization url", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => paystackResponse({ reference: "PSK-1" })));

    await expect(paystackProvider.charge(chargeRequest)).rejects.toThrow(
      /did not return an authorization URL/,
    );
  });

  it("marks a 5xx from Paystack as retryable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 503 })),
    );

    await expect(paystackProvider.charge(chargeRequest)).rejects.toMatchObject({ retryable: true });
  });

  it("marks a 400 from Paystack as not retryable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 400 })),
    );

    await expect(paystackProvider.charge(chargeRequest)).rejects.toMatchObject({ retryable: false });
  });

  it("wraps a network failure as retryable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("ECONNRESET");
      }),
    );

    await expect(paystackProvider.charge(chargeRequest)).rejects.toMatchObject({
      code: "paystack_unreachable",
      retryable: true,
    });
  });
});

describe("paystackProvider.verify", () => {
  it("converts a 500000 subunit settlement back to KES 5,000", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        paystackResponse({
          status: "success",
          reference: "BKG-ABCD2345",
          amount: 500_000,
          currency: "KES",
          paid_at: "2026-08-08T10:00:00.000Z",
        }),
      ),
    );

    const result = await paystackProvider.verify({ reference: "BKG-ABCD2345" });

    expect(result.status).toBe("PAID");
    expect(result.settledAmountKes).toBe(5_000);
    expect(result.paidAt).toEqual(new Date("2026-08-08T10:00:00.000Z"));
  });

  it.each([
    ["success", "PAID"],
    ["failed", "FAILED"],
    ["abandoned", "CANCELLED"],
    ["pending", "PROCESSING"],
    ["ongoing", "PROCESSING"],
    ["something-new", "PROCESSING"],
  ])("maps the %s status to %s", async (paystackStatus, expected) => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        paystackResponse({ status: paystackStatus, reference: "BKG-1", amount: 100, currency: "KES" }),
      ),
    );

    const result = await paystackProvider.verify({ reference: "BKG-1" });
    expect(result.status).toBe(expected);
  });

  it("fails a successful transaction settled in a foreign currency", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        paystackResponse({ status: "success", reference: "BKG-1", amount: 500_000, currency: "USD" }),
      ),
    );

    const result = await paystackProvider.verify({ reference: "BKG-1", currency: "KES" });

    expect(result.status).toBe("FAILED");
    expect(result.settledAmountKes).toBeNull();
    expect(result.failureReason).toMatch(/expected KES but Paystack settled in USD/);
  });

  it("prefers the provider reference over the local reference when querying", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      paystackResponse({ status: "success", reference: "PSK-REMOTE", amount: 100, currency: "KES" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await paystackProvider.verify({ reference: "BKG-LOCAL", providerRef: "PSK-REMOTE" });

    expect(fetchCall(fetchMock).url).toContain("/transaction/verify/PSK-REMOTE");
  });

  it("url-encodes the reference in the verify path", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      paystackResponse({ status: "success", reference: "a/b", amount: 100, currency: "KES" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await paystackProvider.verify({ reference: "a/b" });

    expect(fetchCall(fetchMock).url).toContain("/transaction/verify/a%2Fb");
  });
});

describe("refund", () => {
  it("sends a partial refund in subunits", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => paystackResponse({ id: 1 }));
    vi.stubGlobal("fetch", fetchMock);

    await refund("BKG-ABCD2345", 2_500);

    expect(JSON.parse(String(fetchCall(fetchMock).init?.body))).toEqual({
      transaction: "BKG-ABCD2345",
      amount: 250_000,
    });
  });

  it("omits the amount for a full refund", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => paystackResponse({ id: 1 }));
    vi.stubGlobal("fetch", fetchMock);

    await refund("BKG-ABCD2345");

    expect(JSON.parse(String(fetchCall(fetchMock).init?.body))).toEqual({
      transaction: "BKG-ABCD2345",
    });
  });

  it("rejects an empty reference before any network call", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(refund("")).rejects.toThrow(/reference is required/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
