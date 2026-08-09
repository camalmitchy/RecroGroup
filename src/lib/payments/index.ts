import "server-only";

import type { PaymentMethod, PaymentProvider } from "@prisma/client";

import { mpesaProvider } from "./providers/mpesa";
import { paystackProvider } from "./providers/paystack";
import type { PaymentProviderAdapter } from "./types";
import { PaymentError } from "./types";

const ADAPTERS: Record<
  Exclude<PaymentProvider, "MANUAL">,
  PaymentProviderAdapter
> = {
  MPESA_DARAJA: mpesaProvider,
  PAYSTACK: paystackProvider,
};

export function getProvider(provider: PaymentProvider): PaymentProviderAdapter {
  if (provider === "MANUAL") {
    throw new PaymentError(
      "manual_provider",
      "Manual payments are recorded by staff, not charged through a provider",
    );
  }

  const adapter = ADAPTERS[provider];
  if (!adapter.isConfigured()) {
    throw new PaymentError(
      "provider_unconfigured",
      `${provider} is not configured on this environment`,
    );
  }

  return adapter;
}

export function providerForMethod(method: PaymentMethod): PaymentProvider {
  switch (method) {
    case "MPESA":
      return "MPESA_DARAJA";
    case "CARD":
      return "PAYSTACK";
    case "BANK":
      return "MANUAL";
  }
}

export function availableMethods(): PaymentMethod[] {
  const methods: PaymentMethod[] = [];
  if (mpesaProvider.isConfigured()) methods.push("MPESA");
  if (paystackProvider.isConfigured()) methods.push("CARD");
  methods.push("BANK");
  return methods;
}

export { PaymentError };
export * from "./types";
