import { afterEach, describe, expect, it, vi } from "vitest";

import {
  absoluteUrl,
  darajaConfig,
  paymentsConfig,
  paystackConfig,
} from "@/lib/payments/config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("darajaConfig", () => {
  it("uses the sandbox host unless production is set", () => {
    vi.stubEnv("MPESA_ENV", "sandbox");
    expect(darajaConfig.baseUrl).toBe("https://sandbox.safaricom.co.ke");
  });

  it("uses the live host in production", () => {
    vi.stubEnv("MPESA_ENV", "production");
    expect(darajaConfig.baseUrl).toBe("https://api.safaricom.co.ke");
  });

  it("treats any other value as sandbox", () => {
    vi.stubEnv("MPESA_ENV", "staging");
    expect(darajaConfig.env).toBe("sandbox");
  });

  it("defaults to Buy Goods for a till", () => {
    vi.stubEnv("MPESA_TRANSACTION_TYPE", "");
    expect(darajaConfig.transactionType).toBe("CustomerBuyGoodsOnline");
  });

  it("honours an explicit paybill transaction type", () => {
    vi.stubEnv("MPESA_TRANSACTION_TYPE", "CustomerPayBillOnline");
    expect(darajaConfig.transactionType).toBe("CustomerPayBillOnline");
  });

  it("falls back to the shortcode when no till is set", () => {
    vi.stubEnv("MPESA_SHORTCODE", "4109876");
    vi.stubEnv("MPESA_TILL_NUMBER", "");
    expect(darajaConfig.tillNumber).toBe("4109876");
  });

  it("leaves the callback url undefined when unset", () => {
    vi.stubEnv("MPESA_CALLBACK_URL", "");
    expect(darajaConfig.callbackUrl).toBeUndefined();
  });

  it("reports unconfigured when credentials are missing", () => {
    vi.stubEnv("MPESA_CONSUMER_KEY", "");
    vi.stubEnv("MPESA_CONSUMER_SECRET", "");
    vi.stubEnv("MPESA_SHORTCODE", "");
    vi.stubEnv("MPESA_PASSKEY", "");
    expect(darajaConfig.isConfigured()).toBe(false);
  });

  it("reports configured once every credential is present", () => {
    vi.stubEnv("MPESA_CONSUMER_KEY", "key");
    vi.stubEnv("MPESA_CONSUMER_SECRET", "secret");
    vi.stubEnv("MPESA_SHORTCODE", "4109876");
    vi.stubEnv("MPESA_PASSKEY", "passkey");
    expect(darajaConfig.isConfigured()).toBe(true);
  });
});

describe("paystackConfig", () => {
  it("reports unconfigured without a secret key", () => {
    vi.stubEnv("PAYSTACK_SECRET_KEY", "");
    expect(paystackConfig.isConfigured()).toBe(false);
  });

  it("reports configured with a secret key", () => {
    vi.stubEnv("PAYSTACK_SECRET_KEY", "test-paystack-secret");
    expect(paystackConfig.isConfigured()).toBe(true);
  });
});

describe("paymentsConfig", () => {
  it("defaults the deposit to 50 percent", () => {
    vi.stubEnv("BOOKING_DEPOSIT_PERCENT", "");
    expect(paymentsConfig.bookingDepositPercent).toBe(50);
  });

  it("accepts a valid override", () => {
    vi.stubEnv("BOOKING_DEPOSIT_PERCENT", "30");
    expect(paymentsConfig.bookingDepositPercent).toBe(30);
  });

  it.each(["0", "-10", "150", "abc"])(
    "falls back to 50 for out-of-range value %s",
    (value) => {
      vi.stubEnv("BOOKING_DEPOSIT_PERCENT", value);
      expect(paymentsConfig.bookingDepositPercent).toBe(50);
    },
  );

  it("prefers the public app url over the auth url", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://recro.example");
    vi.stubEnv("BETTER_AUTH_URL", "https://auth.example");
    expect(paymentsConfig.appUrl).toBe("https://recro.example");
  });
});

describe("absoluteUrl", () => {
  it("joins a path onto the app url", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://recro.example");
    expect(absoluteUrl("/api/payments/return")).toBe(
      "https://recro.example/api/payments/return",
    );
  });

  it("does not double the separator when the base has a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://recro.example/");
    expect(absoluteUrl("/api/payments/return")).toBe(
      "https://recro.example/api/payments/return",
    );
  });

  it("adds a leading slash when the path omits one", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://recro.example");
    expect(absoluteUrl("api/payments/return")).toBe(
      "https://recro.example/api/payments/return",
    );
  });
});
