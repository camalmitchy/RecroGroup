import { NextResponse } from "next/server";

import { refreshPaymentStatus } from "@/lib/payments/checkout";
import { absoluteUrl } from "@/lib/payments/config";

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
    return NextResponse.redirect(
      absoluteUrl(
        `/payments/${encodeURIComponent(payment.reference)}?status=${payment.status.toLowerCase()}`,
      ),
    );
  } catch (error) {
    console.error("Failed to resolve payment return", error);
    return NextResponse.redirect(
      absoluteUrl(`/payments/${encodeURIComponent(reference)}?status=unknown`),
    );
  }
}
