import { NextResponse } from "next/server";

import { readPaymentAccessToken } from "@/lib/payments/access-token";
import { refreshPaymentStatus } from "@/lib/payments/checkout";
import { absoluteUrl } from "@/lib/payments/config";
import { paymentPagePath } from "@/lib/payments/payment-access-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference =
    url.searchParams.get("reference") ?? url.searchParams.get("trxref");

  if (!reference) {
    return NextResponse.redirect(absoluteUrl("/booking?payment=missing"));
  }

  try {
    const payment = await refreshPaymentStatus(reference);
    const token = readPaymentAccessToken(payment.providerMeta);
    const page = paymentPagePath(payment.reference, token);
    const separator = page.includes("?") ? "&" : "?";
    return NextResponse.redirect(
      absoluteUrl(`${page}${separator}status=${payment.status.toLowerCase()}`),
    );
  } catch (error) {
    console.error("Failed to resolve payment return", error);
    return NextResponse.redirect(
      absoluteUrl(`/payments/${encodeURIComponent(reference)}?status=unknown`),
    );
  }
}
