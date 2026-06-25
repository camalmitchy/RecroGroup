import { PortalSectionPlaceholder } from "@/features/portal/components/portal-section-placeholder";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function ContentPage() {
  await getRequiredSession("/dashboard/content");

  return (
    <PortalSectionPlaceholder
      title="Content"
      description="Services, blog, media, FAQs, and testimonials."
    />
  );
}
