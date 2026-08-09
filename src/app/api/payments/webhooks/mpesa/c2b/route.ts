import { NextResponse } from "next/server";

import { parseC2bConfirmation } from "@/lib/payments/providers/mpesa";
import { clientIpFrom, isTrustedDarajaIp } from "@/lib/payments/security";
import { processEvent } from "@/lib/payments/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ACK = { ResultCode: 0, ResultDesc: "Accepted" };

export async function POST(request: Request) {
  const ip = clientIpFrom(request.headers);

  if (!isTrustedDarajaIp(ip)) {
    console.warn("Rejected M-Pesa C2B confirmation from untrusted IP", { ip });
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
    const event = parseC2bConfirmation(body);
    await processEvent(event);
  } catch (error) {
    console.error("Failed to process M-Pesa C2B confirmation", error);
  }

  return NextResponse.json(ACK);
}
