import { redirect } from "next/navigation";

import {
    AdminCustomersPage,
    type AdminCustomerRow,
} from "@/features/admin/components/admin-customers-page";
import { requireAdminArea } from "@/features/admin/lib/admin-guard";
import { formatDate } from "@/features/portal/lib/format";
import { isAdmin } from "@/features/portal/lib/roles";
import { listCustomers } from "@/server/queries/catalog";

export default async function CustomersPage() {
    const session = await requireAdminArea();
    if (!isAdmin(session.role)) redirect("/admin");

    const customers = await listCustomers({ take: 200 });

    const rows: AdminCustomerRow[] = customers.items.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        accountType: customer.accountType,
        bookingCount: customer._count.bookings,
        paymentCount: customer._count.payments,
        joinedAtLabel: formatDate(customer.createdAt),
    }));

    return (
        <AdminCustomersPage
            customers={rows}
            total={customers.total}
            isAdmin={session.role === "admin"}
        />
    );
}
