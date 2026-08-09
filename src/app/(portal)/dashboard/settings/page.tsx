import {
  SettingsPanel,
  type ServiceRow,
  type StaffRow,
  type TherapistRow,
} from "@/features/portal/components/settings-panel";
import { formatDate } from "@/features/portal/lib/format";
import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import {
  listServices,
  listStaff,
  listTherapists,
} from "@/server/queries/catalog";

export default async function SettingsPage() {
  const session = await getRequiredSession("/dashboard/settings");

  const [services, therapists, staff] = await Promise.all([
    listServices(),
    listTherapists(),
    listStaff(),
  ]);

  const serviceRows: ServiceRow[] = services.map((service) => ({
    id: service.id,
    title: service.title,
    slug: service.slug,
    category: service.category,
    description: service.description,
    priceKes: service.priceKes,
    durationMin: service.durationMin,
    isPublished: service.isPublished,
    bookings: service._count.bookings,
  }));

  const therapistRows: TherapistRow[] = therapists.map((therapist) => ({
    id: therapist.id,
    fullName: therapist.fullName,
    title: therapist.title,
    email: therapist.email,
    phone: therapist.phone,
    bio: therapist.bio,
    specialties: therapist.specialties,
    isActive: therapist.isActive,
    bookings: therapist._count.bookings,
  }));

  const staffRows: StaffRow[] = staff.map((member) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    banned: member.banned,
    joinedLabel: formatDate(member.createdAt),
  }));

  return (
    <SettingsPanel
      services={serviceRows}
      therapists={therapistRows}
      staff={staffRows}
      currentUserId={session.userId}
    />
  );
}
