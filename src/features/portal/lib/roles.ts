import type { UserRole } from "@prisma/client";

export type { UserRole };

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Admin",
  RECEPTIONIST: "Receptionist",
  CUSTOMER: "Customer",
};

export function isStaff(role: UserRole) {
  return role === "ADMIN" || role === "RECEPTIONIST";
}

export function isAdmin(role: UserRole) {
  return role === "ADMIN";
}
