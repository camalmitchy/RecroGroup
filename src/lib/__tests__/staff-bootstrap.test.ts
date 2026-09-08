import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  user: { update: vi.fn() },
};

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

const {
  bootstrapRoleForEmail,
  parseEmailList,
  syncBootstrapStaffRole,
} = await import("../staff-bootstrap");

describe("parseEmailList", () => {
  it("splits commas, semicolons, and whitespace", () => {
    expect(parseEmailList("A@x.com, b@x.com; C@x.com")).toEqual([
      "a@x.com",
      "b@x.com",
      "c@x.com",
    ]);
  });
});

describe("bootstrapRoleForEmail", () => {
  it("defaults the locally granted admin and receptionist", () => {
    vi.unstubAllEnvs();
    expect(bootstrapRoleForEmail("minanicalm@gmail.com")).toBe("admin");
    expect(bootstrapRoleForEmail("carolinehawi91@gmail.com")).toBe(
      "receptionist",
    );
    expect(bootstrapRoleForEmail("random@example.com")).toBeNull();
  });

  it("uses env lists when they are set", () => {
    vi.stubEnv("BOOTSTRAP_ADMIN_EMAILS", "owner@recrogroup.org");
    vi.stubEnv("BOOTSTRAP_RECEPTIONIST_EMAILS", "desk@recrogroup.org");

    expect(bootstrapRoleForEmail("owner@recrogroup.org")).toBe("admin");
    expect(bootstrapRoleForEmail("minanicalm@gmail.com")).toBeNull();
    expect(bootstrapRoleForEmail("desk@recrogroup.org")).toBe("receptionist");

    vi.unstubAllEnvs();
  });
});

describe("syncBootstrapStaffRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("promotes a customer who is on the admin bootstrap list", async () => {
    prismaMock.user.update.mockResolvedValueOnce({ id: "u1" });

    const role = await syncBootstrapStaffRole({
      id: "u1",
      email: "minanicalm@gmail.com",
      role: "customer",
    });

    expect(role).toBe("admin");
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { role: "admin" },
    });
  });

  it("does not demote an existing admin", async () => {
    const role = await syncBootstrapStaffRole({
      id: "u1",
      email: "carolinehawi91@gmail.com",
      role: "admin",
    });

    expect(role).toBe("admin");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("leaves unlisted customers unchanged", async () => {
    const role = await syncBootstrapStaffRole({
      id: "u1",
      email: "client@example.com",
      role: "customer",
    });

    expect(role).toBe("customer");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });
});
