import { format } from "date-fns";

import { getActiveCampSession, resolveCampPrice } from "@/lib/payments/pricing";
import { GriefCampApplicationForm } from "@/features/public/grief-camp/components/application/grief-camp-application-form";
import type { CampPricing } from "@/features/public/grief-camp/types";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Apply for Grief Camp | Recro Group",
    description:
        "Complete the application form to register your child for Recro Grief Camp - a safe space for children and teens to process loss.",
};

export default async function GriefCampApplicationPage() {
    const session = await getActiveCampSession();

    if (!session) {
        return (
            <div className="mx-auto max-w-xl px-4 py-24 text-center">
                <h1 className="font-serif text-3xl text-foreground">
                    Applications are closed
                </h1>
                <p className="mt-4 text-muted-foreground">
                    There is no camp session open for applications right now. Please check
                    back soon or contact us at info@recrogroup.com.
                </p>
            </div>
        );
    }

    const [camperOnly, withParent] = await Promise.all([
        resolveCampPrice({ parentAttending: false, campSessionId: session.id }),
        resolveCampPrice({ parentAttending: true, campSessionId: session.id }).catch(
            () => null,
        ),
    ]);

    const pricing: CampPricing = {
        campSessionId: session.id,
        campName: session.name,
        location: session.location,
        dateRange: formatDateRange(session.startsOn, session.endsOn),
        tiers: session.priceTiers.map((tier) => ({
            attendeeType: tier.attendeeType,
            label: tier.label,
            amountKes: tier.amountKes,
            effectiveFrom: format(tier.effectiveFrom, "d MMM yyyy"),
            effectiveTo: tier.effectiveTo
                ? format(tier.effectiveTo, "d MMM yyyy")
                : null,
        })),
        current: {
            camperTierLabel: camperOnly.camperTierLabel,
            camperAmountKes: camperOnly.camperAmountKes,
            parentTierLabel: withParent?.parentTierLabel ?? null,
            parentAmountKes: withParent?.parentAmountKes ?? 0,
        },
    };

    return <GriefCampApplicationForm pricing={pricing} />;
}

function formatDateRange(startsOn: Date, endsOn: Date) {
    const sameMonth =
        startsOn.getUTCFullYear() === endsOn.getUTCFullYear() &&
        startsOn.getUTCMonth() === endsOn.getUTCMonth();

    return sameMonth
        ? `${format(startsOn, "d")}–${format(endsOn, "d MMMM yyyy")}`
        : `${format(startsOn, "d MMM yyyy")} – ${format(endsOn, "d MMM yyyy")}`;
}
