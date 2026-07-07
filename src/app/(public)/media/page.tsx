import type { Metadata } from "next";

import { MediaPage } from "@/features/public/media/components/media-page";

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

export default function Page() {
    return <MediaPage />;
}
