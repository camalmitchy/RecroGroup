import { NextResponse } from "next/server";

import {
  parsePaystackEvent,
  verifyWebhookSignature,
} from "@/lib/payments/providers/paystack";
import { processEvent } from "@/lib/payments/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const event = parsePaystackEvent(body);
    await processEvent(event);
  } catch (error) {
    console.error("Failed to process Paystack webhook", error);
  }

  return NextResponse.json({ received: true });
}
