import "server-only";

import { prisma } from "@/lib/prisma";

export async function getGriefCampFlyerUrl(): Promise<string | null> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "grief_camp_flyer_url" },
  });

  return setting?.value || null;
}

export async function getSiteSetting(key: string): Promise<string | null> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key },
  });

  return setting?.value || null;
}
