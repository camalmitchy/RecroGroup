import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { paystackConfig } from "../config";
import {
  PaymentError,
  type ChargeRequest,
  type ChargeResult,
  type Currency,
  type NormalizedEvent,
  type PaymentProviderAdapter,
  type PaymentStatus,
  type VerifyResult,
} from "../types";
import { assertPositiveAmount, dedupeKey } from "../utils";

const PROVIDER = "PAYSTACK" as const;
const METHOD = "CARD" as const;
const TIMEOUT_MS = 30_000;
const DEFAULT_CURRENCY: Currency = "KES";

// M-Pesa is routed through Daraja, so Paystack is card-only here.
export const paystackChannels = ["card"] as const;

// Paystack denominates every amount in the currency subunit (KES cents).
const SUBUNIT = 100;

function toSubunit(amountKes: number) {
  return Math.round(amountKes * SUBUNIT);
}

function fromSubunit(subunit: number) {
  return subunit / SUBUNIT;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function toDate(value: unknown): Date | null {
  const raw = str(value);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

type PaystackEnvelope = {
  status: boolean;
  message: string;
  data: unknown;
};

async function request(
  path: string,
  init: { method: "GET" | "POST"; body?: unknown },
): Promise<PaystackEnvelope> {
  const url = `${paystackConfig.baseUrl}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: init.method,
      headers: {
        Authorization: `Bearer ${paystackConfig.secretKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (cause) {
    throw new PaymentError("paystack_unreachable", `Paystack request to ${path} failed`, {
      retryable: true,
      detail: cause instanceof Error ? cause.message : cause,
    });
  }

  const text = await response.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    throw new PaymentError("paystack_http_error", `Paystack returned ${response.status}`, {
      retryable: response.status >= 500 || response.status === 429,
      detail: body,
    });
  }

  if (!isRecord(body) || body.status !== true) {
    const message = isRecord(body) ? (str(body.message) ?? "Paystack rejected the request") : "Malformed Paystack response";
    throw new PaymentError("paystack_rejected", message, { detail: body });
  }

  return {
    status: true,
    message: str(body.message) ?? "",
    data: body.data,
  };
}

function statusFromPaystack(value: string | null): PaymentStatus {
  switch (value) {
    case "success":
      return "PAID";
    case "failed":
      return "FAILED";
    case "abandoned":
      return "CANCELLED";
    case "pending":
    case "ongoing":
      return "PROCESSING";
    default:
      return "PROCESSING";
  }
}

async function charge(request_: ChargeRequest): Promise<ChargeResult> {
  assertPositiveAmount(request_.amountKes, "Charge amount");

  const email = str(request_.customer.email);
  if (!email) {
    throw new PaymentError("missing_email", "Paystack requires a customer email address");
  }

  const envelope = await request("/transaction/initialize", {
    method: "POST",
    body: {
      email,
      amount: toSubunit(request_.amountKes),
      currency: request_.currency,
      reference: request_.reference,
      callback_url: request_.callbackUrl,
      channels: [...paystackChannels],
      metadata: {
        ...(request_.metadata ?? {}),
        purpose: request_.purpose,
        description: request_.description,
        customer_name: str(request_.customer.name),
        customer_phone: str(request_.customer.phone),
      },
    },
  });

  const data = isRecord(envelope.data) ? envelope.data : {};
  const authorizationUrl = str(data.authorization_url);
  if (!authorizationUrl) {
    throw new PaymentError("paystack_no_redirect", "Paystack did not return an authorization URL", {
      detail: envelope.data,
    });
  }

  return {
    provider: PROVIDER,
    method: METHOD,
    status: "PROCESSING",
    providerRef: str(data.reference) ?? request_.reference,
    redirectUrl: authorizationUrl,
    customerMessage: "Continue on the Paystack checkout page to complete your card payment.",
    raw: envelope.data,
  };
}

async function verify(input: {
  reference: string;
  providerRef?: string | null;
  currency?: Currency;
}): Promise<VerifyResult> {
  const reference = str(input.providerRef) ?? input.reference;
  const expectedCurrency = input.currency ?? DEFAULT_CURRENCY;
  const envelope = await request(`/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
  });

  const data = isRecord(envelope.data) ? envelope.data : {};
  const status = statusFromPaystack(str(data.status));
  const amount = num(data.amount);
  const currency = str(data.currency);
  const gatewayResponse = str(data.gateway_response);

  if (status === "PAID" && currency !== expectedCurrency) {
    return {
      status: "FAILED",
      providerRef: str(data.reference) ?? reference,
      settledAmountKes: null,
      paidAt: null,
      failureReason: `Currency mismatch: expected ${expectedCurrency} but Paystack settled in ${currency ?? "an unknown currency"}`,
      raw: envelope.data,
    };
  }

  return {
    status,
    providerRef: str(data.reference) ?? reference,
    settledAmountKes: amount === null ? null : fromSubunit(amount),
    paidAt: status === "PAID" ? toDate(data.paid_at) : null,
    failureReason: status === "PAID" ? null : gatewayResponse,
    raw: envelope.data,
  };
}

export const paystackProvider: PaymentProviderAdapter = {
  id: PROVIDER,
  method: METHOD,
  isConfigured() {
    return paystackConfig.isConfigured();
  },
  charge,
  verify,
};

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (typeof rawBody !== "string" || !signature) return false;

  try {
    const expected = createHmac("sha512", paystackConfig.secretKey).update(rawBody, "utf8").digest("hex");
    const received = Buffer.from(signature.trim(), "utf8");
    const digest = Buffer.from(expected, "utf8");
    if (received.length !== digest.length) return false;
    return timingSafeEqual(received, digest);
  } catch {
    return false;
  }
}

const EVENT_STATUS: Record<string, PaymentStatus> = {
  "charge.success": "PAID",
  "charge.failed": "FAILED",
  "refund.processed": "REFUNDED",
};

export function parsePaystackEvent(body: unknown): NormalizedEvent {
  if (!isRecord(body)) {
    throw new PaymentError("paystack_bad_event", "Webhook payload is not an object", { detail: body });
  }

  const eventType = str(body.event);
  if (!eventType) {
    throw new PaymentError("paystack_bad_event", "Webhook payload has no event type", { detail: body });
  }

  const status = EVENT_STATUS[eventType];
  if (!status) {
    throw new PaymentError("paystack_unsupported_event", `Unsupported Paystack event: ${eventType}`, {
      detail: body,
    });
  }

  const data = isRecord(body.data) ? body.data : {};
  // refund.processed nests the original transaction reference under `transaction`.
  const transaction = isRecord(data.transaction) ? data.transaction : {};
  const reference = str(data.reference) ?? str(transaction.reference);
  const amount = num(data.amount) ?? num(transaction.amount);
  const gatewayResponse = str(data.gateway_response) ?? str(transaction.gateway_response);
  const currency = str(data.currency) ?? str(transaction.currency);

  const mismatched = status === "PAID" && currency !== null && currency !== "KES";

  const result: VerifyResult = {
    status: mismatched ? "FAILED" : status,
    providerRef: reference,
    settledAmountKes: mismatched || amount === null ? null : fromSubunit(amount),
    paidAt: status === "PAID" && !mismatched ? toDate(data.paid_at ?? data.paidAt) : null,
    failureReason: mismatched
      ? `Currency mismatch: expected KES but Paystack settled in ${currency}`
      : status === "PAID"
        ? null
        : gatewayResponse,
    raw: body.data,
  };

  return {
    dedupeKey: dedupeKey([PROVIDER, eventType, num(data.id), reference]),
    eventType,
    provider: PROVIDER,
    reference,
    providerRef: reference,
    result,
    payload: body,
  };
}

export async function refund(reference: string, amountKes?: number) {
  const ref = str(reference);
  if (!ref) {
    throw new PaymentError("missing_reference", "A transaction reference is required to refund");
  }

  const body: Record<string, unknown> = { transaction: ref };
  if (amountKes !== undefined) {
    assertPositiveAmount(amountKes, "Refund amount");
    body.amount = toSubunit(amountKes);
  }

  const envelope = await request("/refund", { method: "POST", body });
  return envelope.data;
}
