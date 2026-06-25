import { CustomerDashboard } from "@/features/portal/components/customer-dashboard";
import { StaffDashboardHome } from "@/features/portal/components/staff-dashboard-home";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";

export default async function DashboardPage() {
  const session = await getRequiredSession("/dashboard");

  if (session.role === "CUSTOMER") {
    return <CustomerDashboard />;
  }

  return <StaffDashboardHome />;
}
