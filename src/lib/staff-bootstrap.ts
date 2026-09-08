import { prisma } from "@/lib/prisma";
import {
  parseAppRole,
  type AppRole,
} from "@/features/portal/lib/roles";

/** Staff granted locally; production is a separate DB so these must be reapplied. */
const DEFAULT_ADMIN_EMAILS = ["minanicalm@gmail.com"];
const DEFAULT_RECEPTIONIST_EMAILS = ["carolinehawi91@gmail.com"];

export function parseEmailList(value: string | undefined) {
  return (value ?? "")
    .split(/[,;\s]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function emailsFromEnvOrDefault(
  envValue: string | undefined,
  fallback: string[],
) {
  const fromEnv = parseEmailList(envValue);
  if (fromEnv.length > 0) return fromEnv;
  return fallback.map((email) => email.toLowerCase());
}

export function bootstrapAdminEmails() {
  return emailsFromEnvOrDefault(
    process.env.BOOTSTRAP_ADMIN_EMAILS,
    DEFAULT_ADMIN_EMAILS,
  );
}

export function bootstrapReceptionistEmails() {
  return emailsFromEnvOrDefault(
    process.env.BOOTSTRAP_RECEPTIONIST_EMAILS,
    DEFAULT_RECEPTIONIST_EMAILS,
  );
}

export function bootstrapRoleForEmail(email: string): AppRole | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  if (bootstrapAdminEmails().includes(normalized)) return "admin";
  if (bootstrapReceptionistEmails().includes(normalized)) return "receptionist";
  return null;
}

export async function syncBootstrapStaffRole(user: {
  id: string;
  email: string;
  role?: string | null;
}): Promise<AppRole> {
  const current = parseAppRole(user.role);
  const desired = bootstrapRoleForEmail(user.email);

  if (!desired || current === desired) return current;
  if (current === "admin") return current;

  await prisma.user.update({
    where: { id: user.id },
    data: { role: desired },
  });

  return desired;
}
