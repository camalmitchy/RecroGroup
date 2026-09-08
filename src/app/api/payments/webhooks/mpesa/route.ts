import { NextResponse } from "next/server";

import { parseStkCallback } from "@/lib/payments/providers/mpesa";
import { clientIpFrom, isTrustedDarajaIp } from "@/lib/payments/security";
import { processEvent } from "@/lib/payments/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ACK = { ResultCode: 0, ResultDesc: "Accepted" };

export async function POST(request: Request) {
  const ip = clientIpFrom(request.headers);

  if (!isTrustedDarajaIp(ip)) {
    console.warn("Rejected M-Pesa callback from untrusted IP", { ip });
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: "Rejected" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(ACK);
  }

  try {
    const event = parseStkCallback(body);
    await processEvent(event);
  } catch (error) {
    console.error("Failed to process M-Pesa STK callback", error);
  }

  return NextResponse.json(ACK);
}
