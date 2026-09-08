import type {
  Currency,
  PaymentMethod,
  PaymentProvider,
  PaymentPurpose,
  PaymentStatus,
} from "@prisma/client";

export type {
  Currency,
  PaymentMethod,
  PaymentProvider,
  PaymentPurpose,
  PaymentStatus,
};

export type PaymentTarget =
  | { kind: "booking"; bookingId: string }
  | { kind: "griefApplication"; griefApplicationId: string }
  | { kind: "donation"; donationId: string };

export type ChargeRequest = {
  reference: string;
  amountKes: number;
  currency: Currency;
  purpose: PaymentPurpose;
  description: string;
  customer: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export type ChargeResult = {
  provider: PaymentProvider;
  method: PaymentMethod;
  status: PaymentStatus;
  providerRef?: string | null;
  redirectUrl?: string | null;
  customerMessage?: string | null;
  raw?: unknown;
};

export type VerifyResult = {
  status: PaymentStatus;
  providerRef?: string | null;
  settledAmountKes?: number | null;
  mpesaReceipt?: string | null;
  phone?: string | null;
  paidAt?: Date | null;
  failureReason?: string | null;
  raw?: unknown;
};

export type NormalizedEvent = {
  dedupeKey: string;
  eventType: string;
  provider: PaymentProvider;
  reference?: string | null;
  providerRef?: string | null;
  result: VerifyResult;
  payload: unknown;
};

export interface PaymentProviderAdapter {
  readonly id: PaymentProvider;
  readonly method: PaymentMethod;
  isConfigured(): boolean;
  charge(request: ChargeRequest): Promise<ChargeResult>;
  verify(input: {
    reference: string;
    providerRef?: string | null;
    currency?: Currency;
  }): Promise<VerifyResult>;
}

export class PaymentError extends Error {
  readonly code: string;
  readonly retryable: boolean;
  readonly detail?: unknown;

  constructor(
    code: string,
    message: string,
    options: { retryable?: boolean; detail?: unknown } = {},
  ) {
    super(message);
    this.name = "PaymentError";
    this.code = code;
    this.retryable = options.retryable ?? false;
    this.detail = options.detail;
  }
}
