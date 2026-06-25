import type { AppRole } from "./roles";
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
  roles: AppRole[];
  group: string;
};

export const PORTAL_NAV: PortalNavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
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
    label: "Programs",
    icon: HeartHandshake,
    roles: ["admin", "receptionist"],
    group: "Programs",
  },
  {
    href: "/dashboard/content",
    label: "Content",
    icon: BookOpen,
    roles: ["admin"],
    group: "Content",
  },
  {
    href: "/dashboard/people",
    label: "People",
    icon: UserCog,
    roles: ["admin"],
    group: "People",
  },
  {
    href: "/dashboard/inquiries",
    label: "Inquiries",
    icon: Inbox,
    roles: ["admin", "receptionist"],
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
    return pathname === "/dashboard";
  }

  const item = PORTAL_NAV.find(
    (nav) =>
      nav.href === pathname ||
      (nav.href !== "/dashboard" && pathname.startsWith(nav.href)),
  );

  if (pathname === "/dashboard") {
    return role === "admin" || role === "receptionist";
  }

  if (!item) return false;
  return item.roles.includes(role);
}
