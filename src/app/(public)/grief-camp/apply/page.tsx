import { GriefCampApplicationForm } from "@/features/public/grief-camp/components/application/grief-camp-application-form";

export const metadata = {
    title: "Apply for Grief Camp | Recro Group",
    description:
        "Complete the application form to register your child for Recro Grief Camp - a safe space for children and teens to process loss.",
};

export default function GriefCampApplicationPage() {
    return <GriefCampApplicationForm />;
}
