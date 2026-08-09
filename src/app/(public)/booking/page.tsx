import { Suspense } from "react";

import { BookingPage } from "@/features/public/booking/components/booking-page";
import type { ServiceOption } from "@/features/public/booking/components/booking-page";
import { paymentsConfig } from "@/lib/payments/config";
import { prisma } from "@/lib/prisma";
import { calculateDeposit } from "@/lib/payments/utils";

export const metadata = {
  title: "Book a Session — Recro Group",
  description:
    "Schedule your therapy session with our licensed clinicians. Choose your service, select a convenient time, and complete your booking in minutes.",
};

export const dynamic = "force-dynamic";

const SERVICE_ICONS: Record<string, string> = {
  individual: "/assets/icons/individual-therapy.svg",
  couples: "/assets/icons/couples-therapy.svg",
  family: "/assets/icons/family-therapy.svg",
  group: "/assets/icons/group-therapy.svg",
  children: "/assets/icons/grief-camp.svg",
  corporate: "/assets/icons/corporate-speaking.svg",
};

const FALLBACK_ICON = "/assets/icons/individual-therapy.svg";

function formatDuration(minutes: number | null): string {
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

async function loadServices(): Promise<ServiceOption[]> {
  const services = await prisma.service.findMany({
    where: { isPublished: true, priceKes: { gt: 0 } },
    select: { slug: true, title: true, priceKes: true, durationMin: true },
    orderBy: { priceKes: "asc" },
  });

  return services.map((service) => {
    const price = service.priceKes ?? 0;
    return {
      key: service.slug,
      title: service.title,
      duration: formatDuration(service.durationMin),
      icon: SERVICE_ICONS[service.slug] ?? FALLBACK_ICON,
      price,
      depositKes: calculateDeposit(price, paymentsConfig.bookingDepositPercent),
    };
  });
}

export default async function Page() {
  const services = await loadServices();

  return (
    <Suspense fallback={null}>
      <BookingPage services={services} />
    </Suspense>
  );
}
