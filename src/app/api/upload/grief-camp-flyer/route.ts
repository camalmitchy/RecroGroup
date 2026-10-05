import "server-only";

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { isAdmin } from "@/features/portal/lib/roles";
import { prisma } from "@/lib/prisma";
import {
  FLYER_SETTING_KEY,
  removeStoredFlyer,
  uploadGriefCampFlyer,
} from "@/lib/uploads/flyer";

function revalidateFlyerSurfaces() {
  revalidatePath("/grief-camp");
  revalidatePath("/admin/grief-camp");
  revalidatePath("/dashboard/programs");
}

async function currentFlyerUrl() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: FLYER_SETTING_KEY },
    select: { value: true },
  });
  const value = setting?.value?.trim();
  return value ? value : null;
}

export async function POST(request: Request) {
  try {
    const session = await getRequiredSession();
    if (!isAdmin(session.role)) {
      return NextResponse.json(
        { error: "Administrator access is required to upload a flyer" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const existing = await currentFlyerUrl();
    const uploaded = await uploadGriefCampFlyer(file, existing);
    if (!uploaded.ok) {
      return NextResponse.json({ error: uploaded.error }, { status: 400 });
    }

    await prisma.siteSetting.upsert({
      where: { key: FLYER_SETTING_KEY },
      update: { value: uploaded.url },
      create: { key: FLYER_SETTING_KEY, value: uploaded.url },
    });

    revalidateFlyerSurfaces();

    return NextResponse.json({
      success: true,
      url: uploaded.url,
    });
  } catch (error) {
    console.error("Error uploading flyer:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({ url: await currentFlyerUrl() });
  } catch (error) {
    console.error("Error fetching flyer URL:", error);
    return NextResponse.json(
      { error: "Failed to fetch flyer URL" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const session = await getRequiredSession();
    if (!isAdmin(session.role)) {
      return NextResponse.json(
        { error: "Administrator access is required to remove a flyer" },
        { status: 403 },
      );
    }

    const existing = await currentFlyerUrl();
    await removeStoredFlyer(existing);
    await prisma.siteSetting.deleteMany({ where: { key: FLYER_SETTING_KEY } });

    revalidateFlyerSurfaces();

    return NextResponse.json({
      success: true,
      message: "Flyer removed successfully",
    });
  } catch (error) {
    console.error("Error removing flyer:", error);
    return NextResponse.json(
      { error: "Failed to remove flyer" },
      { status: 500 },
    );
  }
}
