import type { AppRole } from "./roles";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  CreditCard,
  FileText,
  ClipboardList,
  HeartHandshake,
  Inbox,
  LayoutDashboard,
  Megaphone,
  Settings,
  Tent,
  Users,
} from "lucide-react";

export type PortalNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: AppRole[];
  group: string;
};

// Sidebar for /dashboard. A route is allowed when it matches one of these
// hrefs for the signed-in role. Child program pages stay allowed because
// /dashboard/programs matches first.
export const PORTAL_NAV: PortalNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "receptionist"],
    group: "Overview",
  },
  {
    href: "/dashboard/bookings",
    label: "Bookings",
    icon: CalendarDays,
    roles: ["admin", "receptionist"],
    group: "Operations",
  },
  {
    href: "/dashboard/payments",
    label: "Payments",
    icon: CreditCard,
    roles: ["admin", "receptionist"],
    group: "Operations",
  },
  {
    href: "/dashboard/programs",
    label: "Grief Camp",
    icon: HeartHandshake,
    roles: ["admin", "receptionist"],
    group: "Programs",
  },
  {
    href: "/dashboard/programs/therapist-applications",
    label: "Therapist applications",
    icon: ClipboardList,
    roles: ["admin", "receptionist"],
    group: "Programs",
  },
  {
    href: "/dashboard/programs/team-building",
    label: "Team building",
    icon: Tent,
    roles: ["admin", "receptionist"],
    group: "Programs",
  },
  {
    href: "/dashboard/programs/consortium",
    label: "Consortium",
    icon: Users,
    roles: ["admin", "receptionist"],
    group: "Programs",
  },
  {
    href: "/dashboard/programs/corporate",
    label: "Corporate speaking",
    icon: Megaphone,
    roles: ["admin", "receptionist"],
    group: "Programs",
  },
  {
    href: "/dashboard/inquiries",
    label: "Messages",
    icon: Inbox,
    roles: ["admin", "receptionist"],
    group: "Engagement",
  },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: Bell,
    roles: ["admin", "receptionist"],
    group: "Engagement",
  },
  {
    href: "/dashboard/content",
    label: "Content",
    icon: FileText,
    roles: ["admin"],
    group: "Engagement",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    roles: ["admin"],
    group: "System",
  },
];

export function getNavForRole(role: AppRole) {
  return PORTAL_NAV.filter((item) => item.roles.includes(role));
}

export function canAccessRoute(role: AppRole, pathname: string) {
  if (role === "customer") {
    return false;
  }

  if (pathname === "/dashboard" || pathname === "/dashboard/profile") {
    return role === "admin" || role === "receptionist";
  }

  const item = PORTAL_NAV.find(
    (nav) =>
      nav.href === pathname ||
      (nav.href !== "/dashboard" && pathname.startsWith(nav.href)),
  );

  if (!item) return false;
  return item.roles.includes(role);
}

export function canManageUsers(role: AppRole) {
  return role === "admin";
}
