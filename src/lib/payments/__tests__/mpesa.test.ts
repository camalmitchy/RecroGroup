import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { parseC2bConfirmation, parseStkCallback } from "@/lib/payments/providers/mpesa";
import type { ChargeRequest } from "@/lib/payments/types";

const SHORTCODE = "4109876";
const TILL = "5551212";

const chargeRequest: ChargeRequest = {
  reference: "BKG-ABCD2345",
  amountKes: 2_500,
  currency: "KES",
  purpose: "BOOKING_DEPOSIT",
  description: "Booking deposit for counselling",
  customer: { name: "Asha Wanjiru", email: "asha@example.com", phone: "0712345678" },
  callbackUrl: "https://recro.test/api/payments/mpesa/callback",
};

function stubDarajaEnv(overrides: Record<string, string> = {}) {
  const env: Record<string, string> = {
    MPESA_ENV: "sandbox",
    MPESA_CONSUMER_KEY: "ck",
    MPESA_CONSUMER_SECRET: "cs",
    MPESA_SHORTCODE: SHORTCODE,
    MPESA_TILL_NUMBER: TILL,
    MPESA_PASSKEY: "passkey",
    MPESA_CALLBACK_URL: chargeRequest.callbackUrl,
    ...overrides,
  };
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
}

/** The Daraja adapter caches its OAuth token at module scope, so each case needs a fresh import. */
async function freshMpesa() {
  vi.resetModules();
  return import("@/lib/payments/providers/mpesa");
}

function darajaFetchMock(stkResponse: unknown = { ResponseCode: "0", CheckoutRequestID: "ws_CO_1" }) {
  return vi.fn<typeof fetch>(async (url) => {
    if (String(url).includes("/oauth/")) {
      return new Response(JSON.stringify({ access_token: "tok-123", expires_in: "3599" }), { status: 200 });
    }
    return new Response(JSON.stringify(stkResponse), { status: 200 });
  });
}

function stkBody(fetchMock: ReturnType<typeof darajaFetchMock>) {
  const call = fetchMock.mock.calls.find((args) => String(args[0]).includes("/stkpush/"));
  const body = call?.[1]?.body;
  if (body == null) {
    throw new Error("expected an STK push request with a JSON body");
  }
  return JSON.parse(String(body)) as Record<string, unknown>;
}

beforeEach(() => {
  stubDarajaEnv();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("STK push party selection", () => {
  it("signs with the head office shortcode but credits the till for Buy Goods", async () => {
    stubDarajaEnv({ MPESA_TRANSACTION_TYPE: "CustomerBuyGoodsOnline" });
    const fetchMock = darajaFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    const { mpesaProvider } = await freshMpesa();
    await mpesaProvider.charge(chargeRequest);

    const body = stkBody(fetchMock);
    expect(body.TransactionType).toBe("CustomerBuyGoodsOnline");
    expect(body.BusinessShortCode).toBe(SHORTCODE);
    expect(body.PartyB).toBe(TILL);
    expect(body.BusinessShortCode).not.toBe(body.PartyB);
  });

  it("uses the shortcode for both parties on PayBill", async () => {
    stubDarajaEnv({ MPESA_TRANSACTION_TYPE: "CustomerPayBillOnline" });
    const fetchMock = darajaFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    const { mpesaProvider } = await freshMpesa();
    await mpesaProvider.charge(chargeRequest);

    const body = stkBody(fetchMock);
    expect(body.TransactionType).toBe("CustomerPayBillOnline");
    expect(body.BusinessShortCode).toBe(SHORTCODE);
    expect(body.PartyB).toBe(SHORTCODE);
  });

  it("falls back to the shortcode as the till when no till is configured", async () => {
    stubDarajaEnv({ MPESA_TRANSACTION_TYPE: "CustomerBuyGoodsOnline", MPESA_TILL_NUMBER: "" });
    const fetchMock = darajaFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    const { mpesaProvider } = await freshMpesa();
    await mpesaProvider.charge(chargeRequest);

    expect(stkBody(fetchMock).PartyB).toBe(SHORTCODE);
  });

  it("derives the password from the head office shortcode, passkey and timestamp", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 8, 14, 30, 45));
    const fetchMock = darajaFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    const { mpesaProvider } = await freshMpesa();
    await mpesaProvider.charge(chargeRequest);

    const body = stkBody(fetchMock);
    expect(body.Timestamp).toBe("20260808143045");
    expect(Buffer.from(String(body.Password), "base64").toString("utf8")).toBe(
      `${SHORTCODE}passkey20260808143045`,
    );
    vi.useRealTimers();
  });
});

describe("mpesaProvider.charge", () => {
  it("normalizes the payer phone into 254 form for both party fields", async () => {
    const fetchMock = darajaFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    const { mpesaProvider } = await freshMpesa();
    await mpesaProvider.charge(chargeRequest);

    const body = stkBody(fetchMock);
    expect(body.PartyA).toBe("254712345678");
    expect(body.PhoneNumber).toBe("254712345678");
  });

  it("truncates the account reference to 12 and the description to 13 characters", async () => {
    const fetchMock = darajaFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    const { mpesaProvider } = await freshMpesa();
    await mpesaProvider.charge({
      ...chargeRequest,
      reference: "BOOKING-REFERENCE-FAR-TOO-LONG",
      description: "An extremely long transaction description",
    });

    const body = stkBody(fetchMock);
    expect(body.AccountReference).toBe("BOOKING-REFE");
    expect(body.TransactionDesc).toBe("An extremely ");
  });

  it("rounds the amount to whole shillings", async () => {
    const fetchMock = darajaFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    const { mpesaProvider } = await freshMpesa();
    await mpesaProvider.charge({ ...chargeRequest, amountKes: 2_500.6 });

    expect(stkBody(fetchMock).Amount).toBe(2_501);
  });

  it("rejects an invalid payer phone before any network call", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { mpesaProvider } = await freshMpesa();
    await expect(
      mpesaProvider.charge({ ...chargeRequest, customer: { ...chargeRequest.customer, phone: "12345" } }),
    ).rejects.toMatchObject({ code: "invalid_phone" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a missing payer phone", async () => {
    vi.stubGlobal("fetch", vi.fn());

    const { mpesaProvider } = await freshMpesa();
    await expect(
      mpesaProvider.charge({ ...chargeRequest, customer: { ...chargeRequest.customer, phone: null } }),
    ).rejects.toMatchObject({ code: "invalid_phone" });
  });

  it("throws when Daraja returns a non-zero response code", async () => {
    vi.stubGlobal(
      "fetch",
      darajaFetchMock({ ResponseCode: "1", ResponseDescription: "Invalid Access Token" }),
    );

    const { mpesaProvider } = await freshMpesa();
    await expect(mpesaProvider.charge(chargeRequest)).rejects.toMatchObject({
      code: "stk_push_rejected",
      message: "Invalid Access Token",
    });
  });

  it("throws when Daraja accepts the push but omits the CheckoutRequestID", async () => {
    vi.stubGlobal("fetch", darajaFetchMock({ ResponseCode: "0" }));

    const { mpesaProvider } = await freshMpesa();
    await expect(mpesaProvider.charge(chargeRequest)).rejects.toMatchObject({
      code: "stk_push_rejected",
    });
  });

  it("returns PROCESSING with the CheckoutRequestID as the provider reference", async () => {
    vi.stubGlobal(
      "fetch",
      darajaFetchMock({
        ResponseCode: "0",
        CheckoutRequestID: "ws_CO_08082026",
        CustomerMessage: "Success. Request accepted for processing",
      }),
    );

    const { mpesaProvider } = await freshMpesa();
    const result = await mpesaProvider.charge(chargeRequest);

    expect(result).toMatchObject({
      provider: "MPESA_DARAJA",
      method: "MPESA",
      status: "PROCESSING",
      providerRef: "ws_CO_08082026",
      customerMessage: "Success. Request accepted for processing",
    });
  });

  it("targets the production host when MPESA_ENV is production", async () => {
    stubDarajaEnv({ MPESA_ENV: "production" });
    const fetchMock = darajaFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    const { mpesaProvider } = await freshMpesa();
    await mpesaProvider.charge(chargeRequest);

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("https://api.safaricom.co.ke");
  });

  it("wraps an unreachable Daraja as a retryable network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("ETIMEDOUT");
      }),
    );

    const { mpesaProvider } = await freshMpesa();
    await expect(mpesaProvider.charge(chargeRequest)).rejects.toMatchObject({
      code: "network_error",
      retryable: true,
    });
  });
});

describe("getAccessToken", () => {
  it("reuses a cached token across calls", async () => {
    const fetchMock = darajaFetchMock();
    vi.stubGlobal("fetch", fetchMock);

    const { getAccessToken } = await freshMpesa();
    await getAccessToken();
    await getAccessToken();

    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes("/oauth/"))).toHaveLength(1);
  });

  it("throws a retryable error when Daraja returns no access token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ error: "invalid_client" }), { status: 200 })),
    );

    const { getAccessToken } = await freshMpesa();
    await expect(getAccessToken()).rejects.toMatchObject({ code: "auth_failed", retryable: true });
  });
});

describe("mpesaProvider.verify", () => {
  it("treats the Daraja pending error code as still PROCESSING", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL) => {
        if (String(url).includes("/oauth/")) {
          return new Response(JSON.stringify({ access_token: "tok", expires_in: 3599 }), { status: 200 });
        }
        return new Response(
          JSON.stringify({ errorCode: "500.001.1001", errorMessage: "still under processing" }),
          { status: 500 },
        );
      }),
    );

    const { mpesaProvider } = await freshMpesa();
    const result = await mpesaProvider.verify({ reference: "BKG-1", providerRef: "ws_CO_1" });

    expect(result.status).toBe("PROCESSING");
  });

  it.each([
    [0, "PAID"],
    [1032, "CANCELLED"],
    [1037, "FAILED"],
    [2001, "FAILED"],
  ])("maps query ResultCode %i to %s", async (resultCode, expected) => {
    vi.stubGlobal(
      "fetch",
      darajaFetchMock({ ResultCode: String(resultCode), ResultDesc: "desc" }),
    );

    const { mpesaProvider } = await freshMpesa();
    const result = await mpesaProvider.verify({ reference: "BKG-1", providerRef: "ws_CO_1" });

    expect(result.status).toBe(expected);
  });

  it("requires a CheckoutRequestID", async () => {
    vi.stubGlobal("fetch", vi.fn());

    const { mpesaProvider } = await freshMpesa();
    await expect(mpesaProvider.verify({ reference: "BKG-1", providerRef: "  " })).rejects.toMatchObject({
      code: "missing_provider_ref",
    });
  });
});

describe("parseStkCallback", () => {
  function callback(resultCode: number | string, items?: Array<Record<string, unknown>>) {
    return {
      Body: {
        stkCallback: {
          MerchantRequestID: "29115-34620561-1",
          CheckoutRequestID: "ws_CO_191220191020363925",
          ResultCode: resultCode,
          ResultDesc: resultCode === 0 ? "The service request is processed successfully." : "Request cancelled by user",
          ...(items ? { CallbackMetadata: { Item: items } } : {}),
        },
      },
    };
  }

  const successItems = [
    { Name: "Amount", Value: 2500 },
    { Name: "MpesaReceiptNumber", Value: "NLJ7RT61SV" },
    { Name: "TransactionDate", Value: 20260808143045 },
    { Name: "PhoneNumber", Value: 254712345678 },
  ];

  it("extracts receipt, amount and phone from the CallbackMetadata items on success", () => {
    const event = parseStkCallback(callback(0, successItems));

    expect(event.result).toMatchObject({
      status: "PAID",
      providerRef: "ws_CO_191220191020363925",
      settledAmountKes: 2_500,
      mpesaReceipt: "NLJ7RT61SV",
      phone: "254712345678",
      failureReason: null,
    });
    expect(event.result.paidAt).toEqual(new Date(2026, 7, 8, 14, 30, 45));
  });

  it("reads a ResultCode delivered as a string exactly like a numeric one", () => {
    const asNumber = parseStkCallback(callback(0, successItems));
    const asString = parseStkCallback(callback("0", successItems));

    expect(asString.result.status).toBe("PAID");
    expect(asString.result.settledAmountKes).toBe(asNumber.result.settledAmountKes);
    expect(asString.dedupeKey).toBe(asNumber.dedupeKey);
  });

  it.each([1032, "1032"])("maps ResultCode %s to CANCELLED", (resultCode) => {
    const event = parseStkCallback(callback(resultCode));

    expect(event.result.status).toBe("CANCELLED");
    expect(event.result.failureReason).toBe("Request cancelled by user");
    expect(event.result.paidAt).toBeNull();
  });

  it.each([1, 2001, "1037"])("maps ResultCode %s to FAILED", (resultCode) => {
    expect(parseStkCallback(callback(resultCode)).result.status).toBe("FAILED");
  });

  it("supplies a timeout message when a timeout code arrives with no description", () => {
    const event = parseStkCallback({
      Body: { stkCallback: { CheckoutRequestID: "ws_CO_1", ResultCode: 1037 } },
    });

    expect(event.result.failureReason).toMatch(/timed out/);
  });

  it("keeps a stable dedupe key across a redelivered callback", () => {
    const payload = callback(0, successItems);
    expect(parseStkCallback(payload).dedupeKey).toBe(parseStkCallback(payload).dedupeKey);
  });

  it("gives different dedupe keys to different checkout requests", () => {
    const a = parseStkCallback(callback(0, successItems));
    const b = parseStkCallback({
      Body: { stkCallback: { CheckoutRequestID: "ws_CO_OTHER", ResultCode: 0 } },
    });
    expect(a.dedupeKey).not.toBe(b.dedupeKey);
  });

  it("tolerates a success callback with no metadata items", () => {
    const event = parseStkCallback(callback(0));

    expect(event.result.status).toBe("PAID");
    expect(event.result.settledAmountKes).toBeNull();
    expect(event.result.mpesaReceipt).toBeNull();
  });

  it.each([
    { payload: null, label: "a null payload" },
    { payload: {}, label: "an empty object" },
    { payload: { Body: {} }, label: "a payload with no stkCallback" },
    {
      payload: { Body: { stkCallback: { ResultCode: 0 } } },
      label: "a payload with no CheckoutRequestID",
    },
    {
      payload: { Body: { stkCallback: { CheckoutRequestID: "ws_CO_1" } } },
      label: "a payload with no ResultCode",
    },
    {
      payload: { Body: { stkCallback: { CheckoutRequestID: "ws_CO_1", ResultCode: "abc" } } },
      label: "a non-numeric ResultCode",
    },
  ])("throws on $label", ({ payload }) => {
    expect(() => parseStkCallback(payload)).toThrow();
  });
});

describe("parseC2bConfirmation", () => {
  const confirmation = {
    TransactionType: "Pay Bill",
    TransID: "RKTQDM7W6S",
    TransTime: "20260808143045",
    TransAmount: "2500.00",
    BusinessShortCode: SHORTCODE,
    BillRefNumber: "bkg-abcd2345",
    MSISDN: "254712345678",
    FirstName: "Asha",
  };

  it("extracts the transaction id, amount, payer and bill reference", () => {
    const event = parseC2bConfirmation(confirmation);

    expect(event.providerRef).toBe("RKTQDM7W6S");
    expect(event.result).toMatchObject({
      status: "PAID",
      settledAmountKes: 2_500,
      mpesaReceipt: "RKTQDM7W6S",
      phone: "254712345678",
    });
    expect(event.result.paidAt).toEqual(new Date(2026, 7, 8, 14, 30, 45));
  });

  it("upper-cases the bill reference so it matches the stored payment reference", () => {
    expect(parseC2bConfirmation(confirmation).reference).toBe("BKG-ABCD2345");
  });

  it("rounds a fractional amount to whole shillings", () => {
    expect(parseC2bConfirmation({ ...confirmation, TransAmount: "2500.60" }).result.settledAmountKes).toBe(
      2_501,
    );
  });

  it("falls back to the current time when TransTime is unusable", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 8, 9, 0, 0));

    const event = parseC2bConfirmation({ ...confirmation, TransTime: "garbage" });

    expect(event.result.paidAt).toEqual(new Date(2026, 7, 8, 9, 0, 0));
    vi.useRealTimers();
  });

  it("leaves the reference null when no BillRefNumber is present", () => {
    const withoutRef = { ...confirmation, BillRefNumber: undefined };
    expect(parseC2bConfirmation(withoutRef).reference).toBeNull();
  });

  it.each([null, {}, { TransID: "" }])("throws on the malformed payload %s", (payload) => {
    expect(() => parseC2bConfirmation(payload)).toThrow(/Missing TransID/);
  });
});
