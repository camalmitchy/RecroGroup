import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set — cannot seed");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const SERVICES = [
  {
    slug: "individual",
    title: "Individual Therapy",
    priceKes: 5000,
    durationMin: 50,
    category: "Therapy",
  },
  {
    slug: "couples",
    title: "Couples Therapy",
    priceKes: 7500,
    durationMin: 50,
    category: "Therapy",
  },
  {
    slug: "family",
    title: "Family Therapy",
    priceKes: 8000,
    durationMin: 50,
    category: "Therapy",
  },
  {
    slug: "group",
    title: "Group Therapy",
    priceKes: 3500,
    durationMin: 120,
    category: "Therapy",
  },
  {
    slug: "children",
    title: "Grief Camp",
    priceKes: 15000,
    durationMin: 4320,
    category: "Programs",
  },
  {
    slug: "corporate",
    title: "Corporate Speaking",
    priceKes: 25000,
    durationMin: 120,
    category: "Corporate",
  },
];

const CAMP_SLUG = "grief-camp-2026";

async function seedServices() {
  for (const service of SERVICES) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        priceKes: service.priceKes,
        durationMin: service.durationMin,
        category: service.category,
      },
      create: { ...service, isPublished: true },
    });
  }
  console.info(`Seeded ${SERVICES.length} services`);
}

async function seedCamp() {
  const camp = await prisma.campSession.upsert({
    where: { slug: CAMP_SLUG },
    update: { isActive: true },
    create: {
      name: "Grief Camp 2026",
      slug: CAMP_SLUG,
      startsOn: new Date("2026-12-11"),
      endsOn: new Date("2026-12-13"),
      location: "Nairobi",
      isActive: true,
    },
  });

  const tiers = [
    {
      attendeeType: "CAMPER" as const,
      label: "Mega deal",
      amountKes: 30000,
      effectiveFrom: new Date("2026-01-01"),
      effectiveTo: new Date("2026-09-01"),
      sortOrder: 0,
    },
    {
      attendeeType: "CAMPER" as const,
      label: "Early price",
      amountKes: 32000,
      effectiveFrom: new Date("2026-09-01"),
      effectiveTo: new Date("2026-10-31"),
      sortOrder: 1,
    },
    {
      attendeeType: "CAMPER" as const,
      label: "Regular price",
      amountKes: 34000,
      effectiveFrom: new Date("2026-10-31"),
      effectiveTo: null,
      sortOrder: 2,
    },
    {
      attendeeType: "PARENT" as const,
      label: "Mega deal",
      amountKes: 2500,
      effectiveFrom: new Date("2026-01-01"),
      effectiveTo: new Date("2026-09-02"),
      sortOrder: 0,
    },
    {
      attendeeType: "PARENT" as const,
      label: "Early price",
      amountKes: 4500,
      effectiveFrom: new Date("2026-09-02"),
      effectiveTo: new Date("2026-10-31"),
      sortOrder: 1,
    },
    {
      attendeeType: "PARENT" as const,
      label: "Regular price",
      amountKes: 6500,
      effectiveFrom: new Date("2026-10-31"),
      effectiveTo: null,
      sortOrder: 2,
    },
  ];

  await prisma.campPriceTier.deleteMany({ where: { campSessionId: camp.id } });
  await prisma.campPriceTier.createMany({
    data: tiers.map((tier) => ({ ...tier, campSessionId: camp.id })),
  });

  console.info(`Seeded ${camp.name} with ${tiers.length} price tiers`);
}

async function main() {
  await seedServices();
  await seedCamp();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
