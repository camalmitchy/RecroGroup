import "server-only";

function optional(key: string) {
  const value = process.env[key];
  if (!value) return undefined;
  const trimmed = value.trim().replace(/^['"]+|['"]+$/g, "").trim();
  return trimmed === "" ? undefined : trimmed;
}

function required(key: string) {
  const value = optional(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function numericCode(key: string, requiredValue = false) {
  const raw = requiredValue ? required(key) : optional(key);
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  return digits || undefined;
}

function isLoopbackUrl(value: string) {
  try {
    const host = new URL(value.includes("://") ? value : `https://${value}`)
      .hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

export function isPublicHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !isLoopbackUrl(value);
  } catch {
    return false;
  }
}

export const darajaConfig = {
  get env() {
    const value = optional("MPESA_ENV")?.toLowerCase();
    if (value === "sandbox" || value === "test") return "sandbox";
    if (value === "production" || value === "prod" || value === "live") {
      return "production";
    }
    return process.env.VERCEL_ENV === "production" ? "production" : "sandbox";
  },
  get baseUrl() {
    return this.env === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";
  },
  get consumerKey() {
    return required("MPESA_CONSUMER_KEY");
  },
  get consumerSecret() {
    return required("MPESA_CONSUMER_SECRET");
  },
  get shortcode() {
    const value = numericCode("MPESA_SHORTCODE", true);
    if (!value) {
      throw new Error("Missing required environment variable: MPESA_SHORTCODE");
    }
    return value;
  },
  get tillNumber() {
    return numericCode("MPESA_TILL_NUMBER") ?? numericCode("MPESA_SHORTCODE");
  },
  get passkey() {
    return required("MPESA_PASSKEY").replace(/\s+/g, "");
  },
  get transactionType() {
    return optional("MPESA_TRANSACTION_TYPE") === "CustomerPayBillOnline"
      ? "CustomerPayBillOnline"
      : "CustomerBuyGoodsOnline";
  },
  get stkPartyB() {
    const useTill = optional("MPESA_STK_USE_TILL")?.toLowerCase() === "true";
    if (
      useTill &&
      this.transactionType === "CustomerBuyGoodsOnline" &&
      this.tillNumber
    ) {
      return this.tillNumber;
    }
    return this.shortcode;
  },
  get callbackUrl() {
    const value = optional("MPESA_CALLBACK_URL");
    return value && isPublicHttpsUrl(value) ? value : undefined;
  },
  get confirmationUrl() {
    return optional("MPESA_CONFIRMATION_URL");
  },
  get validationUrl() {
    return optional("MPESA_VALIDATION_URL");
  },
  isConfigured() {
    return Boolean(
      optional("MPESA_CONSUMER_KEY") &&
        optional("MPESA_CONSUMER_SECRET") &&
        optional("MPESA_SHORTCODE") &&
        optional("MPESA_PASSKEY"),
    );
  },
};

export const paystackConfig = {
  baseUrl: "https://api.paystack.co",
  get secretKey() {
    return required("PAYSTACK_SECRET_KEY");
  },
  get publicKey() {
    return optional("PAYSTACK_PUBLIC_KEY");
  },
  get callbackUrl() {
    return optional("PAYSTACK_CALLBACK_URL");
  },
  isConfigured() {
    return Boolean(optional("PAYSTACK_SECRET_KEY"));
  },
};

export const paymentsConfig = {
  get appUrl() {
    const configured =
      optional("NEXT_PUBLIC_APP_URL") ?? optional("BETTER_AUTH_URL");
    if (configured && !isLoopbackUrl(configured)) return configured;

    const vercelHost = optional("VERCEL_URL")?.replace(/^https?:\/\//, "");
    if (vercelHost) return `https://${vercelHost}`;

    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      return "https://recro-group.vercel.app";
    }

    return configured ?? "http://localhost:3000";
  },
  get bookingDepositPercent() {
    const raw = Number(optional("BOOKING_DEPOSIT_PERCENT") ?? "50");
    return Number.isFinite(raw) && raw > 0 && raw <= 100 ? raw : 50;
  },
  get stkTimeoutSeconds() {
    const raw = Number(optional("MPESA_STK_TIMEOUT_SECONDS") ?? "120");
    return Number.isFinite(raw) && raw > 0 ? raw : 120;
  },
};

export function absoluteUrl(path: string) {
  const base = paymentsConfig.appUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function resolveStkCallbackUrl(override?: string | null) {
  for (const candidate of [
    override,
    darajaConfig.callbackUrl,
    absoluteUrl("/api/payments/webhooks/mpesa"),
  ]) {
    if (candidate && isPublicHttpsUrl(candidate)) return candidate;
  }
  return "https://recro-group.vercel.app/api/payments/webhooks/mpesa";
}
