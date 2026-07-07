import type { Metadata } from "next";

import { ResourcesPage } from "@/features/public/resources/components/resources-page";

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

export default function Page() {
    return <ResourcesPage />;
}
