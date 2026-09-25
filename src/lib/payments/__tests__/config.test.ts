import { afterEach, describe, expect, it, vi } from "vitest";

import {
  absoluteUrl,
  darajaConfig,
  paymentsConfig,
  paystackConfig,
  resolveStkCallbackUrl,
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

  it("defaults to production Daraja on the Vercel production environment", () => {
    vi.stubEnv("MPESA_ENV", "");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(darajaConfig.env).toBe("production");
    expect(darajaConfig.baseUrl).toBe("https://api.safaricom.co.ke");
  });

  it("strips quotes and non-digits from shortcode values", () => {
    vi.stubEnv("MPESA_SHORTCODE", "\"4109876\"");
    vi.stubEnv("MPESA_TILL_NUMBER", "Till 747736");
    expect(darajaConfig.shortcode).toBe("4109876");
    expect(darajaConfig.tillNumber).toBe("747736");
  });

  it("treats Production, prod and live as production", () => {
    vi.stubEnv("MPESA_ENV", "Production");
    expect(darajaConfig.env).toBe("production");
    vi.stubEnv("MPESA_ENV", "prod");
    expect(darajaConfig.env).toBe("production");
    vi.stubEnv("MPESA_ENV", "live");
    expect(darajaConfig.env).toBe("production");
  });

  it("defaults to Buy Goods for a till", () => {
    vi.stubEnv("MPESA_TRANSACTION_TYPE", "");
    expect(darajaConfig.transactionType).toBe("CustomerBuyGoodsOnline");
  });

  it("honours an explicit paybill transaction type", () => {
    vi.stubEnv("MPESA_TRANSACTION_TYPE", "CustomerPayBillOnline");
    expect(darajaConfig.transactionType).toBe("CustomerPayBillOnline");
  });

  it("uses the shortcode as the STK merchant unless the till is opted in", () => {
    vi.stubEnv("MPESA_SHORTCODE", "4109876");
    vi.stubEnv("MPESA_TILL_NUMBER", "747736");
    expect(darajaConfig.stkPartyB).toBe("4109876");
    vi.stubEnv("MPESA_STK_USE_TILL", "true");
    expect(darajaConfig.stkPartyB).toBe("747736");
  });

  it("falls back to the shortcode when no till is set", () => {
    vi.stubEnv("MPESA_SHORTCODE", "4109876");
    vi.stubEnv("MPESA_TILL_NUMBER", "");
    expect(darajaConfig.tillNumber).toBe("4109876");
  });

  it("leaves the callback url undefined when unset or not public HTTPS", () => {
    vi.stubEnv("MPESA_CALLBACK_URL", "");
    expect(darajaConfig.callbackUrl).toBeUndefined();
    vi.stubEnv("MPESA_CALLBACK_URL", "http://localhost:3000/api/payments/webhooks/mpesa");
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

  it("does not use localhost on Vercel", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
    vi.stubEnv("VERCEL_URL", "recro-group.vercel.app");
    expect(paymentsConfig.appUrl).toBe("https://recro-group.vercel.app");
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

describe("resolveStkCallbackUrl", () => {
  it("ignores a localhost override and uses the public app url", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://recro-group.vercel.app");
    vi.stubEnv("MPESA_CALLBACK_URL", "http://localhost:3000/api/payments/webhooks/mpesa");
    expect(resolveStkCallbackUrl("http://127.0.0.1/callback")).toBe(
      "https://recro-group.vercel.app/api/payments/webhooks/mpesa",
    );
  });
});
