import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  service: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  therapist: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  booking: { count: vi.fn() },
  user: { update: vi.fn(), findFirst: vi.fn() },
};

const requireAdmin = vi.fn();

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/server/authz", async () => {
  const actual =
    await vi.importActual<typeof import("@/server/authz")>("@/server/authz");
  return { ...actual, requireAdmin };
});

const { AuthorizationError } = await import("@/server/authz");
const { deleteService, deleteTherapist, setUserRole, setUserRoleByEmail, upsertService } = await import(
  "@/server/actions/catalog"
);

const ADMIN = { userId: "admin_1", email: "a@e.com", name: "Admin", role: "admin" };

const validService = {
  title: "Individual Therapy",
  slug: "individual",
  priceKes: 5000,
  durationMin: 50,
  isPublished: true,
};

beforeEach(() => {
  vi.clearAllMocks();
  requireAdmin.mockResolvedValue(ADMIN);
});

describe("upsertService", () => {
  it("creates a service when no id is given", async () => {
    prismaMock.service.findUnique.mockResolvedValueOnce(null);
    prismaMock.service.create.mockResolvedValueOnce({ id: "s1" });

    const result = await upsertService(validService);

    expect(result.ok).toBe(true);
    expect(prismaMock.service.create).toHaveBeenCalled();
  });

  it("rejects a slug that is not url-safe", async () => {
    const result = await upsertService({ ...validService, slug: "Not A Slug" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors?.slug).toBeDefined();
    expect(prismaMock.service.create).not.toHaveBeenCalled();
  });

  it("rejects a fractional price", async () => {
    const result = await upsertService({ ...validService, priceKes: 5000.5 });

    expect(result.ok).toBe(false);
    expect(prismaMock.service.create).not.toHaveBeenCalled();
  });

  it("refuses a slug already used by another service", async () => {
    prismaMock.service.findUnique.mockResolvedValueOnce({ id: "other" });

    const result = await upsertService({ ...validService, id: "s1" });

    expect(result.ok).toBe(false);
    expect(prismaMock.service.update).not.toHaveBeenCalled();
  });

  it("allows a service to keep its own slug on edit", async () => {
    prismaMock.service.findUnique.mockResolvedValueOnce({ id: "s1" });
    prismaMock.service.update.mockResolvedValueOnce({ id: "s1" });

    const result = await upsertService({ ...validService, id: "s1" });

    expect(result.ok).toBe(true);
  });

  it("denies a non-admin", async () => {
    requireAdmin.mockRejectedValueOnce(new AuthorizationError("Admin required"));

    const result = await upsertService(validService);

    expect(result).toEqual({ ok: false, error: "Admin required" });
  });
});

describe("deleteService", () => {
  it("refuses to delete a service that has bookings", async () => {
    prismaMock.booking.count.mockResolvedValueOnce(3);

    const result = await deleteService("s1");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("3 booking");
    expect(prismaMock.service.delete).not.toHaveBeenCalled();
  });

  it("deletes a service with no bookings", async () => {
    prismaMock.booking.count.mockResolvedValueOnce(0);
    prismaMock.service.delete.mockResolvedValueOnce({ id: "s1" });

    const result = await deleteService("s1");

    expect(result.ok).toBe(true);
  });
});

describe("deleteTherapist", () => {
  it("refuses to delete a therapist that has bookings", async () => {
    prismaMock.booking.count.mockResolvedValueOnce(1);

    const result = await deleteTherapist("t1");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("1 booking");
    expect(prismaMock.therapist.delete).not.toHaveBeenCalled();
  });
});

describe("setUserRole", () => {
  it("changes another user's role", async () => {
    prismaMock.user.update.mockResolvedValueOnce({ id: "u2", role: "receptionist" });

    const result = await setUserRole("u2", "receptionist");

    expect(result.ok).toBe(true);
  });

  it("stops an admin from removing their own access", async () => {
    const result = await setUserRole(ADMIN.userId, "customer");

    expect(result.ok).toBe(false);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("lets an admin reaffirm their own admin role", async () => {
    prismaMock.user.update.mockResolvedValueOnce({ id: ADMIN.userId, role: "admin" });

    const result = await setUserRole(ADMIN.userId, "admin");

    expect(result.ok).toBe(true);
  });
});

describe("setUserRoleByEmail", () => {
  it("promotes an existing account", async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce({ id: "u2" });
    prismaMock.user.update.mockResolvedValueOnce({ id: "u2", role: "admin" });

    const result = await setUserRoleByEmail("camalmitchy2@gmail.com", "admin");

    expect(result.ok).toBe(true);
    expect(prismaMock.user.findFirst).toHaveBeenCalled();
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "u2" }, data: { role: "admin" } }),
    );
  });

  it("rejects an unknown email", async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null);

    const result = await setUserRoleByEmail("missing@example.com", "receptionist");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/no account found/i);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const result = await setUserRoleByEmail("not-an-email", "admin");

    expect(result.ok).toBe(false);
    expect(prismaMock.user.findFirst).not.toHaveBeenCalled();
  });
});
