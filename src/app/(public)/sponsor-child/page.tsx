import { Metadata } from "next";
import { SponsorChildPage } from "@/features/public/sponsor-child/components/sponsor-child-page";

export const metadata: Metadata = {
    title: "Sponsor a Child | Recro Grief Camp",
    description:
        "Sponsor a grieving child's place at Recro Grief Camp — full or partial contributions via M-Pesa, card or SBM Bank.",
    openGraph: {
        title: "Sponsor a Child · Recro Grief Camp",
        description:
            "Your generosity gives a grieving child the chance to heal, grow and remember they are not alone.",
    },
};

export default function Page() {
    return <SponsorChildPage />;
}
