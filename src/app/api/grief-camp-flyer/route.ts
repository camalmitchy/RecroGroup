import { NextResponse } from "next/server";

import { readBlob } from "@/lib/uploads/blob-storage";
import { getGriefCampFlyerUrl } from "@/server/queries/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const stored = await getGriefCampFlyerUrl();
  if (!stored) {
    return NextResponse.json({ error: "No flyer is published" }, { status: 404 });
  }

  if (stored.startsWith("/")) {
    return NextResponse.redirect(new URL(stored, request.url));
  }

  const download = new URL(request.url).searchParams.get("download") === "1";

  try {
    const blob = await readBlob(stored);
    if (!blob || blob.statusCode !== 200 || !blob.stream) {
      return NextResponse.json({ error: "Flyer could not be read" }, { status: 404 });
    }

    const filename = blob.blob.pathname.split("/").pop() || "grief-camp-flyer";
    return new NextResponse(blob.stream, {
      headers: {
        "Content-Type": blob.blob.contentType || "application/octet-stream",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    console.error("[flyer] could not read blob", error);
    return NextResponse.json({ error: "Flyer could not be read" }, { status: 500 });
  }
}
