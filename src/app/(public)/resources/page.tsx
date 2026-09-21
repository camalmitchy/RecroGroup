import type { Metadata } from "next";

import { ResourcesPage } from "@/features/public/resources/components/resources-page";
import { listPublishedResources } from "@/server/queries/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources — Recro Group",
  description:
    "Articles on therapy, grief, relationships, parenting, and mental wellness.",
  openGraph: {
    title: "Resources — Recro Group",
    description: "Articles and guides from the Recro clinical team.",
    url: "/resources",
  },
};

export default async function Page() {
  const resources = await listPublishedResources();
  return <ResourcesPage resources={resources} />;
}
