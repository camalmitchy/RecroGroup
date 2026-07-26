import { CorporateTrainingInquiryForm } from "@/features/public/services/components/corporate/corporate-training-inquiry-form";

export const metadata = {
    title: "Corporate Training Inquiry | Recro Group",
    description:
        "Request corporate training or wellness programs for your organization. We'll contact you with customized solutions.",
};

export default function CorporateTrainingInquiryPage() {
    return <CorporateTrainingInquiryForm />;
}
