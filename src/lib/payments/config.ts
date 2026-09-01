import "server-only";

function optional(key: string) {
  const value = process.env[key];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

function required(key: string) {
  const value = optional(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const darajaConfig = {
  get env() {
    return optional("MPESA_ENV") === "production" ? "production" : "sandbox";
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
    return required("MPESA_SHORTCODE");
  },
  get tillNumber() {
    return optional("MPESA_TILL_NUMBER") ?? optional("MPESA_SHORTCODE");
  },
  get passkey() {
    return required("MPESA_PASSKEY");
  },
  get transactionType() {
    return optional("MPESA_TRANSACTION_TYPE") === "CustomerPayBillOnline"
      ? "CustomerPayBillOnline"
      : "CustomerBuyGoodsOnline";
  },
  get callbackUrl() {
    return optional("MPESA_CALLBACK_URL");
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
    return (
      optional("NEXT_PUBLIC_APP_URL") ??
      optional("BETTER_AUTH_URL") ??
      "http://localhost:3000"
    );
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
