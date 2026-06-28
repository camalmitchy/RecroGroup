import { ContentPanel } from "@/features/portal/components/content-panel";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function ContentPage() {
  await getRequiredSession("/dashboard/content");

  return <ContentPanel />;
}
