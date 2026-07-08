import type { Metadata } from "next";

import { MerchandisePage } from "@/features/public/merchandise/components/merchandise-page";

export const metadata: Metadata = {
    title: "Merchandise | Coming Soon",
    description:
        "Our merchandise store is coming soon. Sign up to be notified when we launch our collection of wellness products, therapeutic tools, and meaningful items.",
    openGraph: {
        title: "Merchandise | Coming Soon - Recro Group",
        description:
            "Our merchandise store is coming soon. Sign up to be notified when we launch.",
    },
};

export default function MerchandisePage_() {
    return <MerchandisePage />;
}
