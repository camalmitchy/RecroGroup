import type { Metadata } from "next";

import { MediaPage } from "@/features/public/media/components/media-page";
import { listPublishedMedia } from "@/server/queries/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media — Recro Group",
  description:
    "Watch our therapeutic discussions on grief, parenting, relationships, and mental health.",
  openGraph: {
    title: "Media — Recro Group",
    description: "Therapeutic video library by Recro Group.",
    url: "/media",
  },
};

export default async function Page() {
  const videos = await listPublishedMedia();
  return <MediaPage videos={videos} />;
}
