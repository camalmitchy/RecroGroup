// Secret stored on the payment so the status page can show the amount and
// M-Pesa receipt. A bare reference returns status only. Staff skip this check.
import "server-only";

import { randomBytes, timingSafeEqual } from "node:crypto";

export function createPaymentAccessToken() {
  return randomBytes(32).toString("base64url");
}

export function readPaymentAccessToken(meta: unknown): string | null {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return null;
  const value = (meta as Record<string, unknown>).accessToken;
  return typeof value === "string" && value.length >= 16 ? value : null;
}

/** True only when the presented token matches the one stored on the payment. */
export function paymentAccessMatches(
  meta: unknown,
  presented: string | null | undefined,
) {
  const stored = readPaymentAccessToken(meta);
  if (!stored || !presented) return false;

  const left = Buffer.from(stored);
  const right = Buffer.from(presented);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
