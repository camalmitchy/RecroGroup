import { Metadata } from "next";

import { requireAdminArea } from "@/features/admin/lib/admin-guard";
import { AdminUserProvider } from "@/features/admin/lib/admin-user-context";

export const metadata: Metadata = {
    title: "Admin · Recro Group",
    description: "Recro Group internal admin dashboard.",
    robots: "noindex,nofollow",
};

export default async function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await requireAdminArea();

    return (
        <AdminUserProvider user={{ name: session.name, email: session.email }}>
            {children}
        </AdminUserProvider>
    );
}
