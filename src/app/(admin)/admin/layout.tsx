import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin · Recro Group",
    description: "Recro Group internal admin dashboard.",
    robots: "noindex,nofollow",
};

export default function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    // Note: Authentication and role checking should be done here
    // For now, we'll just render the children
    // TODO: Add authentication check and redirect if not admin/receptionist

    return <>{children}</>;
}
