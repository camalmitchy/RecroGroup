import {
    AdminSettingsPage,
    type AdminServiceRow,
    type AdminStaffRow,
    type AdminTherapistRow,
} from "@/features/admin/components/admin-settings-page";
import { requireAdminArea } from "@/features/admin/lib/admin-guard";
import { formatDate } from "@/features/portal/lib/format";
import {
    listServices,
    listStaff,
    listTherapists,
} from "@/server/queries/catalog";

export default async function SettingsPage() {
    const session = await requireAdminArea();

    const [services, therapists, staff] = await Promise.all([
        listServices(),
        listTherapists(),
        listStaff(),
    ]);

    const serviceRows: AdminServiceRow[] = services.map((service) => ({
        id: service.id,
        title: service.title,
        slug: service.slug,
        description: service.description,
        category: service.category,
        priceKes: service.priceKes,
        durationMin: service.durationMin,
        isPublished: service.isPublished,
        bookingCount: service._count.bookings,
    }));

    const therapistRows: AdminTherapistRow[] = therapists.map((therapist) => ({
        id: therapist.id,
        fullName: therapist.fullName,
        title: therapist.title,
        bio: therapist.bio,
        specialties: therapist.specialties,
        email: therapist.email,
        phone: therapist.phone,
        isActive: therapist.isActive,
        bookingCount: therapist._count.bookings,
    }));

    const staffRows: AdminStaffRow[] = staff.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        banned: member.banned,
        joinedAtLabel: formatDate(member.createdAt),
    }));

    return (
        <AdminSettingsPage
            services={serviceRows}
            therapists={therapistRows}
            staff={staffRows}
            currentUserId={session.userId}
            isAdmin={session.role === "admin"}
        />
    );
}
