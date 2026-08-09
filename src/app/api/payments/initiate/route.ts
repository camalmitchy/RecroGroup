import { NextResponse } from "next/server";
import { z } from "zod";

import { startCheckout } from "@/lib/payments/checkout";
import { PaymentError } from "@/lib/payments/types";
import { getPortalSession } from "@/features/portal/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z
  .object({
    method: z.enum(["MPESA", "CARD"]),
    phone: z.string().min(9).optional(),
    email: z.email().optional(),
    name: z.string().min(1).optional(),
    idempotencyKey: z.string().min(8).max(128).optional(),
    bookingId: z.string().min(1).optional(),
    griefApplicationId: z.string().min(1).optional(),
    donationId: z.string().min(1).optional(),
  })
  .refine(
    (value) =>
      [value.bookingId, value.griefApplicationId, value.donationId].filter(
        Boolean,
      ).length === 1,
    { message: "Provide exactly one payment target" },
  );

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const session = await getPortalSession();

  const target = input.bookingId
    ? ({ kind: "booking", bookingId: input.bookingId } as const)
    : input.griefApplicationId
      ? ({
          kind: "griefApplication",
          griefApplicationId: input.griefApplicationId,
        } as const)
      : ({ kind: "donation", donationId: input.donationId! } as const);

  try {
    const result = await startCheckout({
      target,
      method: input.method,
      phone: input.phone ?? null,
      email: input.email ?? null,
      name: input.name ?? null,
      userId: session?.userId ?? null,
      idempotencyKey: input.idempotencyKey ?? null,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof PaymentError) {
      const status =
        error.code === "not_found"
          ? 404
          : error.code === "already_paid"
            ? 409
            : error.code === "provider_unconfigured"
              ? 503
              : 400;
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status },
      );
    }

    console.error("Failed to start checkout", error);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 500 },
    );
  }
}
