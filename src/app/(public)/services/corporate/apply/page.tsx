import { FacilitatorApplicationForm } from "@/features/public/services/components/facilitator/facilitator-application-form";

export const metadata = {
    title: "Facilitator Application | Recro Group",
    description:
        "Apply to join our team of therapists and group facilitators supporting children and families through grief at Recro Grief Camp.",
};

export default function FacilitatorApplicationPage() {
    return <FacilitatorApplicationForm />;
}
