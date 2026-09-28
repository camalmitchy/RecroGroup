import "server-only";

import { prisma } from "@/lib/prisma";
import { PROGRAM_SERVICE_SLUGS } from "@/server/validation/booking";

const programSlugs: string[] = [...PROGRAM_SERVICE_SLUGS];

export type CatalogService = {
  slug: string;
  title: string;
  description: string | null;
  priceKes: number | null;
  durationMin: number | null;
};

export function formatServiceDuration(minutes: number | null): string {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} min`;
  if (minutes % 1440 === 0) {
    const days = minutes / 1440;
    return `${days} day${days > 1 ? "s" : ""}`;
  }
  const hours = minutes / 60;
  const label = Number.isInteger(hours) ? `${hours}` : hours.toFixed(1);
  return `${label} hr${hours > 1 ? "s" : ""}`;
}

export function formatServicePrice(priceKes: number | null): string {
  if (!priceKes || priceKes <= 0) return "";
  return `KES ${priceKes.toLocaleString("en-KE")}`;
}

export async function listPublishedServices(): Promise<CatalogService[]> {
  return prisma.service.findMany({
    where: { isPublished: true },
    select: {
      slug: true,
      title: true,
      description: true,
      priceKes: true,
      durationMin: true,
    },
    orderBy: { title: "asc" },
  });
}

/** Published, priced sessions a customer can pay for on /booking. */
export async function listBookableServices(): Promise<CatalogService[]> {
  return prisma.service.findMany({
    where: {
      isPublished: true,
      priceKes: { gt: 0 },
      slug: { notIn: programSlugs },
    },
    select: {
      slug: true,
      title: true,
      description: true,
      priceKes: true,
      durationMin: true,
    },
    orderBy: { title: "asc" },
  });
}
