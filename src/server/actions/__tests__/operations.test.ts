import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  griefApplication: { update: vi.fn() },
  inquiry: { update: vi.fn() },
  booking: { update: vi.fn(), findUnique: vi.fn(), count: vi.fn() },
  therapist: { findUnique: vi.fn() },
  payment: { findUnique: vi.fn(), update: vi.fn() },
  appointment: { update: vi.fn() },
  user: { update: vi.fn() },
};

const requireStaff = vi.fn();
const requireAdmin = vi.fn();

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/server/authz", async () => {
  const actual =
    await vi.importActual<typeof import("@/server/authz")>("@/server/authz");
  return { ...actual, requireStaff, requireAdmin };
});

const { AuthorizationError } = await import("@/server/authz");
const {
  assignTherapist,
  linkPaymentToBooking,
  setGriefApplicationStatus,
  setInquiryStatus,
} = await import("@/server/actions/operations");

const STAFF = { userId: "u1", email: "s@e.com", name: "Staff", role: "receptionist" };

beforeEach(() => {
  vi.clearAllMocks();
  requireStaff.mockResolvedValue(STAFF);
  requireAdmin.mockResolvedValue({ ...STAFF, role: "admin" });
});

describe("setGriefApplicationStatus", () => {
  it("updates a valid status", async () => {
    prismaMock.griefApplication.update.mockResolvedValueOnce({
      id: "g1",
      status: "ACCEPTED",
    });

    const result = await setGriefApplicationStatus("g1", "ACCEPTED");

    expect(result).toEqual({ ok: true, data: { id: "g1", status: "ACCEPTED" } });
  });

  it("rejects an unknown status without touching the database", async () => {
    const result = await setGriefApplicationStatus(
      "g1",
      "NOT_A_STATUS" as never,
    );

    expect(result.ok).toBe(false);
    expect(prismaMock.griefApplication.update).not.toHaveBeenCalled();
  });

  it("returns the authorization message when the caller is not staff", async () => {
    requireStaff.mockRejectedValueOnce(new AuthorizationError("No access"));

    const result = await setGriefApplicationStatus("g1", "ACCEPTED");

    expect(result).toEqual({ ok: false, error: "No access" });
  });

  it("does not leak internal errors to the caller", async () => {
    prismaMock.griefApplication.update.mockRejectedValueOnce(
      new Error("connect ECONNREFUSED 10.0.0.1:5432"),
    );

    const result = await setGriefApplicationStatus("g1", "ACCEPTED");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).not.toContain("ECONNREFUSED");
  });
});

describe("setInquiryStatus", () => {
  it("rejects an unknown status", async () => {
    const result = await setInquiryStatus("i1", "BOGUS" as never);

    expect(result.ok).toBe(false);
    expect(prismaMock.inquiry.update).not.toHaveBeenCalled();
  });
});

describe("assignTherapist", () => {
  it("assigns an active therapist", async () => {
    prismaMock.therapist.findUnique.mockResolvedValueOnce({
      id: "t1",
      isActive: true,
    });
    prismaMock.booking.update.mockResolvedValueOnce({ id: "b1", therapistId: "t1" });

    const result = await assignTherapist("b1", "t1");

    expect(result.ok).toBe(true);
  });

  it("refuses an inactive therapist", async () => {
    prismaMock.therapist.findUnique.mockResolvedValueOnce({
      id: "t1",
      isActive: false,
    });

    const result = await assignTherapist("b1", "t1");

    expect(result.ok).toBe(false);
    expect(prismaMock.booking.update).not.toHaveBeenCalled();
  });

  it("refuses a therapist that does not exist", async () => {
    prismaMock.therapist.findUnique.mockResolvedValueOnce(null);

    const result = await assignTherapist("b1", "missing");

    expect(result.ok).toBe(false);
    expect(prismaMock.booking.update).not.toHaveBeenCalled();
  });

  it("allows clearing the assignment without a lookup", async () => {
    prismaMock.booking.update.mockResolvedValueOnce({ id: "b1", therapistId: null });

    const result = await assignTherapist("b1", null);

    expect(result.ok).toBe(true);
    expect(prismaMock.therapist.findUnique).not.toHaveBeenCalled();
  });
});

describe("linkPaymentToBooking", () => {
  it("links an unsettled payment to a booking", async () => {
    prismaMock.payment.findUnique.mockResolvedValueOnce({
      id: "p1",
      status: "PENDING",
      bookingId: null,
    });
    prismaMock.booking.findUnique.mockResolvedValueOnce({ id: "b1" });
    prismaMock.payment.update.mockResolvedValueOnce({ id: "p1", bookingId: "b1" });

    const result = await linkPaymentToBooking("p1", "b1");

    expect(result.ok).toBe(true);
  });

  it("refuses to move a settled payment to a different booking", async () => {
    prismaMock.payment.findUnique.mockResolvedValueOnce({
      id: "p1",
      status: "PAID",
      bookingId: "b1",
    });

    const result = await linkPaymentToBooking("p1", "b2");

    expect(result.ok).toBe(false);
    expect(prismaMock.payment.update).not.toHaveBeenCalled();
  });

  it("allows relinking a settled payment to the same booking", async () => {
    prismaMock.payment.findUnique.mockResolvedValueOnce({
      id: "p1",
      status: "PAID",
      bookingId: "b1",
    });
    prismaMock.booking.findUnique.mockResolvedValueOnce({ id: "b1" });
    prismaMock.payment.update.mockResolvedValueOnce({ id: "p1", bookingId: "b1" });

    const result = await linkPaymentToBooking("p1", "b1");

    expect(result.ok).toBe(true);
  });

  it("reports a missing payment", async () => {
    prismaMock.payment.findUnique.mockResolvedValueOnce(null);

    const result = await linkPaymentToBooking("missing", "b1");

    expect(result.ok).toBe(false);
  });
});
