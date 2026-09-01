import { NextResponse } from "next/server";

import { clientIpFrom, isTrustedDarajaIp } from "@/lib/payments/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIpFrom(request.headers);

  if (!isTrustedDarajaIp(ip)) {
    return NextResponse.json(
      { ResultCode: "C2B00016", ResultDesc: "Rejected" },
      { status: 403 },
    );
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
