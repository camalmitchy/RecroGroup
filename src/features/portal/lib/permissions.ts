import type { UserRole } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarDays,
  CreditCard,
  HeartHandshake,
  Inbox,
  LayoutDashboard,
  Settings,
  UserCog,
} from "lucide-react";

export type PortalNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
  group: string;
};

/** Staff sidebar — admin + receptionist share `/dashboard` sub-routes */
export const PORTAL_NAV: PortalNavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    roles: ["ADMIN", "RECEPTIONIST"],
    group: "Overview",
  },
  {
    href: "/dashboard/bookings",
    label: "Bookings",
    icon: CalendarDays,
    roles: ["ADMIN", "RECEPTIONIST"],
    group: "Operations",
  },
  {
    href: "/dashboard/payments",
    label: "Payments",
    icon: CreditCard,
    roles: ["ADMIN", "RECEPTIONIST"],
    group: "Operations",
  },
  {
    href: "/dashboard/programs",
    label: "Programs",
    icon: HeartHandshake,
    roles: ["ADMIN", "RECEPTIONIST"],
    group: "Programs",
  },
  {
    href: "/dashboard/content",
    label: "Content",
    icon: BookOpen,
    roles: ["ADMIN"],
    group: "Content",
  },
  {
    href: "/dashboard/people",
    label: "People",
    icon: UserCog,
    roles: ["ADMIN"],
    group: "People",
  },
  {
    href: "/dashboard/inquiries",
    label: "Inquiries",
    icon: Inbox,
    roles: ["ADMIN", "RECEPTIONIST"],
    group: "Engagement",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    roles: ["ADMIN"],
    group: "System",
  },
];

export function getNavForRole(role: UserRole) {
  return PORTAL_NAV.filter((item) => item.roles.includes(role));
}

export function canAccessRoute(role: UserRole, pathname: string) {
  if (role === "CUSTOMER") {
    return pathname === "/dashboard";
  }

  const item = PORTAL_NAV.find(
    (nav) =>
      nav.href === pathname ||
      (nav.href !== "/dashboard" && pathname.startsWith(nav.href)),
  );

  if (pathname === "/dashboard") {
    return isStaffRole(role);
  }

  if (!item) return false;
  return item.roles.includes(role);
}

function isStaffRole(role: UserRole) {
  return role === "ADMIN" || role === "RECEPTIONIST";
}
