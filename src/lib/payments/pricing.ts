import "server-only";

import type { CampAttendeeType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { paymentsConfig } from "./config";
import { calculateDeposit } from "./utils";

export type ResolvedCampPrice = {
  campSessionId: string;
  campName: string;
  camperTierLabel: string;
  camperAmountKes: number;
  parentTierLabel: string | null;
  parentAmountKes: number;
  totalKes: number;
};

export async function getActiveCampSession() {
  return prisma.campSession.findFirst({
    where: { isActive: true },
    orderBy: { startsOn: "asc" },
    include: { priceTiers: { orderBy: { sortOrder: "asc" } } },
  });
}

async function resolveTier(
  campSessionId: string,
  attendeeType: CampAttendeeType,
  at: Date,
) {
  const tier = await prisma.campPriceTier.findFirst({
    where: {
      campSessionId,
      attendeeType,
      effectiveFrom: { lte: at },
      OR: [{ effectiveTo: null }, { effectiveTo: { gt: at } }],
    },
    orderBy: { effectiveFrom: "desc" },
  });

  if (tier) return tier;

  return prisma.campPriceTier.findFirst({
    where: { campSessionId, attendeeType },
    orderBy: { effectiveFrom: "desc" },
  });
}

export async function resolveCampPrice(options: {
  parentAttending: boolean;
  at?: Date;
  campSessionId?: string;
}): Promise<ResolvedCampPrice> {
  const at = options.at ?? new Date();

  const session = options.campSessionId
    ? await prisma.campSession.findUnique({ where: { id: options.campSessionId } })
    : await prisma.campSession.findFirst({
        where: { isActive: true },
        orderBy: { startsOn: "asc" },
      });

  if (!session) {
    throw new Error("No active camp session is open for applications");
  }

  const camperTier = await resolveTier(session.id, "CAMPER", at);
  if (!camperTier) {
    throw new Error(`No camper pricing configured for ${session.name}`);
  }

  const parentTier = options.parentAttending
    ? await resolveTier(session.id, "PARENT", at)
    : null;

  if (options.parentAttending && !parentTier) {
    throw new Error(`No parent pricing configured for ${session.name}`);
  }

  const camperAmountKes = camperTier.amountKes;
  const parentAmountKes = parentTier?.amountKes ?? 0;

  return {
    campSessionId: session.id,
    campName: session.name,
    camperTierLabel: camperTier.label,
    camperAmountKes,
    parentTierLabel: parentTier?.label ?? null,
    parentAmountKes,
    totalKes: camperAmountKes + parentAmountKes,
  };
}

export type ResolvedServicePrice = {
  serviceId: string | null;
  title: string;
  totalKes: number;
  depositKes: number;
  balanceKes: number;
};

export async function resolveServicePrice(
  slugOrId: string,
): Promise<ResolvedServicePrice> {
  const service = await prisma.service.findFirst({
    where: {
      isPublished: true,
      OR: [{ id: slugOrId }, { slug: slugOrId }],
    },
  });

  if (!service) {
    throw new Error(`Unknown service: ${slugOrId}`);
  }

  if (!service.priceKes || service.priceKes <= 0) {
    throw new Error(`Service ${service.slug} has no price configured`);
  }

  const totalKes = service.priceKes;
  const depositKes = calculateDeposit(
    totalKes,
    paymentsConfig.bookingDepositPercent,
  );

  return {
    serviceId: service.id,
    title: service.title,
    totalKes,
    depositKes,
    balanceKes: totalKes - depositKes,
  };
}

export function resolveBookingChargeAmount(booking: {
  amountKes: number | null;
  depositKes: number | null;
  amountPaidKes: number;
}) {
  const total = booking.amountKes ?? 0;
  const outstanding = Math.max(0, total - booking.amountPaidKes);

  if (outstanding === 0) {
    return { amountKes: 0, purpose: "BOOKING_FULL" as const, outstanding };
  }

  if (booking.amountPaidKes > 0) {
    return { amountKes: outstanding, purpose: "BOOKING_BALANCE" as const, outstanding };
  }

  const deposit = booking.depositKes ?? total;
  return {
    amountKes: Math.min(deposit, outstanding),
    purpose:
      deposit >= total ? ("BOOKING_FULL" as const) : ("BOOKING_DEPOSIT" as const),
    outstanding,
  };
}
