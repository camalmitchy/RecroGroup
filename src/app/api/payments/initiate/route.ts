import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { startCheckout } from "@/lib/payments/checkout";
import { PaymentError } from "@/lib/payments/types";
import { getOptionalSession } from "@/server/authz";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const schema = z
  .object({
    method: z.enum(["MPESA"]),
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

  const target = input.bookingId
    ? ({ kind: "booking", bookingId: input.bookingId } as const)
    : input.griefApplicationId
      ? ({
          kind: "griefApplication",
          griefApplicationId: input.griefApplicationId,
        } as const)
      : ({ kind: "donation", donationId: input.donationId! } as const);

  try {
    const session = await getOptionalSession();
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

    if (
      error instanceof Error &&
      error.message.includes("Missing required environment variable")
    ) {
      return NextResponse.json(
        { error: error.message, code: "provider_unconfigured" },
        { status: 503 },
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error:
            error.code === "P2022"
              ? "The payments database is missing a required column. Run migrations on production."
              : "Could not save the payment. Please try again.",
          code: error.code,
        },
        { status: 500 },
      );
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        {
          error:
            "The payments database is out of date. Run migrations on production.",
          code: "schema_mismatch",
        },
        { status: 500 },
      );
    }

    const raw = error instanceof Error ? error.message : "";
    const leaksConnection = /postgres|postgresql|DATABASE_URL|password/i.test(
      raw,
    );

    return NextResponse.json(
      {
        error:
          raw && !leaksConnection
            ? raw
            : "Could not start payment. Please try again.",
        code: "checkout_failed",
      },
      { status: 500 },
    );
  }
}
