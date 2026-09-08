import { Suspense } from "react";
import { redirect } from "next/navigation";

import { BookingPage } from "@/features/public/booking/components/booking-page";
import type {
  ClinicianOption,
  ServiceOption,
} from "@/features/public/booking/components/booking-page";
import { paymentsConfig } from "@/lib/payments/config";
import { calculateDeposit } from "@/lib/payments/utils";
import { prisma } from "@/lib/prisma";
import { getOptionalSession } from "@/server/authz";
import { BOOKABLE_SERVICE_SLUGS } from "@/server/validation/booking";

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
};

const FALLBACK_ICON = "/assets/icons/individual-therapy.svg";
const FALLBACK_PHOTO = "/assets/founder-portrait.jpg";

const PROGRAM_REDIRECTS: Record<string, string> = {
  children: "/grief-camp/apply",
  corporate: "/services/corporate/inquiry",
  consortium: "/services/consortium/apply",
};

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
  const slugs = [...BOOKABLE_SERVICE_SLUGS];
  const services = await prisma.service.findMany({
    where: {
      isPublished: true,
      priceKes: { gt: 0 },
      OR: [{ category: "Therapy" }, { slug: { in: slugs } }],
    },
    select: { slug: true, title: true, priceKes: true, durationMin: true },
    orderBy: { priceKes: "asc" },
  });

  return services
    .filter((service) =>
      slugs.includes(service.slug as (typeof BOOKABLE_SERVICE_SLUGS)[number]),
    )
    .map((service) => {
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

async function loadClinicians(): Promise<ClinicianOption[]> {
  const therapists = await prisma.therapist.findMany({
    where: { isActive: true },
    orderBy: { fullName: "asc" },
    select: {
      id: true,
      fullName: true,
      title: true,
      photoUrl: true,
      specialties: true,
    },
  });

  return therapists.map((therapist) => ({
    id: therapist.id,
    name: therapist.fullName,
    title: therapist.title ?? "Clinician",
    photo: therapist.photoUrl || FALLBACK_PHOTO,
    specialties: therapist.specialties,
  }));
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const programPath = service ? PROGRAM_REDIRECTS[service] : undefined;
  if (programPath) redirect(programPath);

  const [services, clinicians, session] = await Promise.all([
    loadServices(),
    loadClinicians(),
    getOptionalSession(),
  ]);

  const profile = session
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true, email: true, phone: true },
      })
    : null;

  return (
    <Suspense fallback={null}>
      <BookingPage
        services={services}
        clinicians={clinicians}
        defaultClient={{
          name: profile?.name ?? session?.name ?? "",
          email: profile?.email ?? session?.email ?? "",
          phone: profile?.phone ?? "",
        }}
      />
    </Suspense>
  );
}
