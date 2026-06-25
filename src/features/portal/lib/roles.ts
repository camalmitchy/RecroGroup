export const APP_ROLES = ["admin", "customer", "receptionist"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Admin",
  receptionist: "Receptionist",
  customer: "Customer",
};

export const DEFAULT_ROLE: AppRole = "customer";

export function isStaff(role: AppRole) {
  return role === "admin" || role === "receptionist";
}

export function isAdmin(role: AppRole) {
  return role === "admin";
}

/** Normalize Better Auth role string (supports comma-separated multi-role). */
export function parseAppRole(role: string | null | undefined): AppRole {
  const primary = role?.split(",")[0]?.trim().toLowerCase();
  if (primary && APP_ROLES.includes(primary as AppRole)) {
    return primary as AppRole;
  }
  return DEFAULT_ROLE;
}
