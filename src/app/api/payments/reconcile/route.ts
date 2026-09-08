import { NextResponse } from "next/server";

import { expireStalePayments } from "@/lib/payments/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authorized(request: Request) {
  const secret = process.env.PAYMENTS_CRON_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const expired = await expireStalePayments();
    return NextResponse.json({ expired });
  } catch (error) {
    console.error("Failed to reconcile stale payments", error);
    return NextResponse.json({ error: "Reconcile failed" }, { status: 500 });
  }
}
