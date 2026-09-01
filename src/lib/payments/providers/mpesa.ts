import "server-only";

import { darajaConfig } from "../config";
import {
  PaymentError,
  type ChargeRequest,
  type ChargeResult,
  type NormalizedEvent,
  type PaymentProviderAdapter,
  type VerifyResult,
} from "../types";
import {
  assertPositiveAmount,
  darajaTimestamp,
  dedupeKey,
  normalizePhone,
  parseDarajaTimestamp,
} from "../utils";

const PROVIDER = "MPESA_DARAJA" as const;
const METHOD = "MPESA" as const;
const REQUEST_TIMEOUT_MS = 30_000;
const TOKEN_REFRESH_SKEW_MS = 60_000;

const CANCELLED_RESULT_CODES = new Set([1032]);
const TIMEOUT_RESULT_CODES = new Set([1037, 1019]);
const PENDING_ERROR_CODE = "500.001.1001";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function num(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function pick(source: unknown, key: string): unknown {
  return isRecord(source) ? source[key] : undefined;
}

function truncate(value: string, max: number) {
  return value.length > max ? value.slice(0, max) : value;
}

function base64(value: string) {
  return Buffer.from(value, "utf8").toString("base64");
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text().catch(() => "");
  if (text === "") return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function darajaFetch(url: string, init: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (error) {
    throw new PaymentError("network_error", "Could not reach M-Pesa Daraja", {
      retryable: true,
      detail: error instanceof Error ? error.message : error,
    });
  }

  const body = await readBody(response);

  if (!response.ok) {
    const message =
      str(pick(body, "errorMessage")) ??
      str(pick(body, "ResponseDescription")) ??
      str(pick(body, "errorCode")) ??
      `Daraja request failed with status ${response.status}`;
    throw new PaymentError("daraja_error", message, {
      retryable: response.status >= 500 || response.status === 429,
      detail: body,
    });
  }

  return body;
}

let cachedToken: { value: string; expiresAt: number } | null = null;
let inFlightToken: Promise<string> | null = null;

async function requestAccessToken(): Promise<string> {
  const credentials = base64(`${darajaConfig.consumerKey}:${darajaConfig.consumerSecret}`);
  const body = await darajaFetch(
    `${darajaConfig.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: { Authorization: `Basic ${credentials}`, Accept: "application/json" },
      cache: "no-store",
    },
  );

  const token = str(pick(body, "access_token"));
  if (!token) {
    throw new PaymentError("auth_failed", "Daraja did not return an access token", {
      retryable: true,
      detail: body,
    });
  }

  const expiresIn = num(pick(body, "expires_in")) ?? 3599;
  const ttl = Math.max(expiresIn * 1000 - TOKEN_REFRESH_SKEW_MS, 30_000);
  cachedToken = { value: token, expiresAt: Date.now() + ttl };
  return token;
}

export async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  inFlightToken ??= requestAccessToken().finally(() => {
    inFlightToken = null;
  });
  return inFlightToken;
}

async function authorizedPost(path: string, payload: JsonRecord): Promise<unknown> {
  const token = await getAccessToken();
  return darajaFetch(`${darajaConfig.baseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

function requirePhone(input: string | null | undefined) {
  if (!input) {
    throw new PaymentError("invalid_phone", "A phone number is required to start an M-Pesa payment");
  }
  try {
    return normalizePhone(input);
  } catch {
    throw new PaymentError("invalid_phone", `Not a valid Kenyan phone number: ${input}`, {
      detail: input,
    });
  }
}

function stkParties() {
  const transactionType = darajaConfig.transactionType;
  // Buy Goods signs with the Head Office shortcode but credits the till, so PartyB differs.
  const partyB =
    transactionType === "CustomerBuyGoodsOnline"
      ? (darajaConfig.tillNumber ?? darajaConfig.shortcode)
      : darajaConfig.shortcode;
  return { transactionType, businessShortCode: darajaConfig.shortcode, partyB };
}

async function charge(request: ChargeRequest): Promise<ChargeResult> {
  const amount = assertPositiveAmount(Math.round(request.amountKes), "M-Pesa amount");
  const phone = requirePhone(request.customer.phone);
  const timestamp = darajaTimestamp(new Date());
  const { transactionType, businessShortCode, partyB } = stkParties();

  const body = await authorizedPost("/mpesa/stkpush/v1/processrequest", {
    BusinessShortCode: businessShortCode,
    Password: base64(`${businessShortCode}${darajaConfig.passkey}${timestamp}`),
    Timestamp: timestamp,
    TransactionType: transactionType,
    Amount: amount,
    PartyA: phone,
    PartyB: partyB,
    PhoneNumber: phone,
    CallBackURL: request.callbackUrl,
    AccountReference: truncate(request.reference, 12),
    TransactionDesc: truncate(request.description, 13),
  });

  const responseCode = str(pick(body, "ResponseCode"));
  const checkoutRequestId = str(pick(body, "CheckoutRequestID"));

  if (responseCode !== "0" || !checkoutRequestId) {
    throw new PaymentError(
      "stk_push_rejected",
      str(pick(body, "ResponseDescription")) ??
        str(pick(body, "errorMessage")) ??
        "M-Pesa rejected the payment request",
      { detail: body },
    );
  }

  return {
    provider: PROVIDER,
    method: METHOD,
    status: "PROCESSING",
    providerRef: checkoutRequestId,
    customerMessage:
      str(pick(body, "CustomerMessage")) ?? "Check your phone to authorise the M-Pesa payment.",
    raw: body,
  };
}

function statusFromResultCode(code: number): VerifyResult["status"] {
  if (code === 0) return "PAID";
  if (CANCELLED_RESULT_CODES.has(code)) return "CANCELLED";
  return "FAILED";
}

function failureReasonFor(code: number, resultDesc: string | null) {
  if (TIMEOUT_RESULT_CODES.has(code)) {
    return resultDesc ?? "The M-Pesa request timed out before it was authorised";
  }
  return resultDesc;
}

async function verify(input: {
  reference: string;
  providerRef?: string | null;
}): Promise<VerifyResult> {
  const checkoutRequestId = input.providerRef?.trim();
  if (!checkoutRequestId) {
    throw new PaymentError("missing_provider_ref", "A CheckoutRequestID is required to verify");
  }

  const timestamp = darajaTimestamp(new Date());
  const businessShortCode = darajaConfig.shortcode;

  let body: unknown;
  try {
    body = await authorizedPost("/mpesa/stkpushquery/v1/query", {
      BusinessShortCode: businessShortCode,
      Password: base64(`${businessShortCode}${darajaConfig.passkey}${timestamp}`),
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    });
  } catch (error) {
    // Daraja answers an unresolved prompt with a 500 and this code rather than a pending status.
    if (
      error instanceof PaymentError &&
      str(pick(error.detail, "errorCode")) === PENDING_ERROR_CODE
    ) {
      return {
        status: "PROCESSING",
        providerRef: checkoutRequestId,
        raw: error.detail,
      };
    }
    throw error;
  }

  const resultCode = num(pick(body, "ResultCode"));
  const resultDesc = str(pick(body, "ResultDesc"));

  if (resultCode === null) {
    return { status: "PROCESSING", providerRef: checkoutRequestId, raw: body };
  }

  const status = statusFromResultCode(resultCode);

  return {
    status,
    providerRef: checkoutRequestId,
    failureReason: status === "PAID" ? null : failureReasonFor(resultCode, resultDesc),
    raw: body,
  };
}

function callbackMetadata(stkCallback: unknown): Map<string, unknown> {
  const items: unknown = pick(pick(stkCallback, "CallbackMetadata"), "Item");
  const map = new Map<string, unknown>();
  if (!Array.isArray(items)) return map;
  for (const item of items as unknown[]) {
    const name = str(pick(item, "Name"));
    if (!name) continue;
    map.set(name, pick(item, "Value"));
  }
  return map;
}

export function parseStkCallback(body: unknown): NormalizedEvent {
  const stkCallback = pick(pick(body, "Body"), "stkCallback");
  if (!isRecord(stkCallback)) {
    throw new PaymentError("invalid_callback", "Missing Body.stkCallback in M-Pesa callback", {
      detail: body,
    });
  }

  const checkoutRequestId = str(stkCallback.CheckoutRequestID);
  const resultCode = num(stkCallback.ResultCode);
  const resultDesc = str(stkCallback.ResultDesc);

  if (!checkoutRequestId || resultCode === null) {
    throw new PaymentError("invalid_callback", "M-Pesa callback is missing required fields", {
      detail: body,
    });
  }

  const status = statusFromResultCode(resultCode);
  const metadata = callbackMetadata(stkCallback);
  const settledAmount = num(metadata.get("Amount"));
  const phoneRaw = str(metadata.get("PhoneNumber"));

  return {
    dedupeKey: dedupeKey([PROVIDER, "stk_callback", checkoutRequestId, resultCode]),
    eventType: "stk_callback",
    provider: PROVIDER,
    reference: null,
    providerRef: checkoutRequestId,
    result: {
      status,
      providerRef: checkoutRequestId,
      settledAmountKes: settledAmount === null ? null : Math.round(settledAmount),
      mpesaReceipt: str(metadata.get("MpesaReceiptNumber")),
      phone: phoneRaw,
      paidAt: status === "PAID" ? parseDarajaTimestamp(str(metadata.get("TransactionDate"))) : null,
      failureReason: status === "PAID" ? null : failureReasonFor(resultCode, resultDesc),
      raw: stkCallback,
    },
    payload: body,
  };
}

export function parseC2bConfirmation(body: unknown): NormalizedEvent {
  const transId = str(pick(body, "TransID"));
  if (!transId) {
    throw new PaymentError("invalid_callback", "Missing TransID in C2B confirmation", {
      detail: body,
    });
  }

  const amount = num(pick(body, "TransAmount"));
  const reference = str(pick(body, "BillRefNumber"))?.toUpperCase() ?? null;

  return {
    dedupeKey: dedupeKey([PROVIDER, "c2b_confirmation", transId]),
    eventType: "c2b_confirmation",
    provider: PROVIDER,
    reference,
    providerRef: transId,
    result: {
      status: "PAID",
      providerRef: transId,
      settledAmountKes: amount === null ? null : Math.round(amount),
      mpesaReceipt: transId,
      phone: str(pick(body, "MSISDN")),
      paidAt: parseDarajaTimestamp(str(pick(body, "TransTime"))) ?? new Date(),
      failureReason: null,
      raw: body,
    },
    payload: body,
  };
}

export async function registerC2bUrls(urls: { confirmationUrl: string; validationUrl: string }) {
  return authorizedPost("/mpesa/c2b/v1/registerurl", {
    ShortCode: darajaConfig.shortcode,
    ResponseType: "Completed",
    ConfirmationURL: urls.confirmationUrl,
    ValidationURL: urls.validationUrl,
  });
}

export const mpesaProvider: PaymentProviderAdapter = {
  id: PROVIDER,
  method: METHOD,
  isConfigured: () => darajaConfig.isConfigured(),
  charge,
  verify,
};
