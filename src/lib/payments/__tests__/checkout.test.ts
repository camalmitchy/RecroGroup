import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  booking: { findUnique: vi.fn() },
  griefApplication: { findUnique: vi.fn() },
  donation: { findUnique: vi.fn() },
  payment: { findUnique: vi.fn() },
};

const createPendingPayment = vi.fn();
const markPaymentProcessing = vi.fn();
const failPayment = vi.fn();
const getProvider = vi.fn();

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/payments/service", () => ({
  createPendingPayment,
  markPaymentProcessing,
  failPayment,
  settlePayment: vi.fn(),
}));
vi.mock("@/lib/payments/index", async () => {
  const actual = await vi.importActual<typeof import("@/lib/payments/types")>(
    "@/lib/payments/types",
  );
  return {
    getProvider,
    providerForMethod: (m: string) =>
      m === "MPESA" ? "MPESA_DARAJA" : m === "CARD" ? "PAYSTACK" : "MANUAL",
    PaymentError: actual.PaymentError,
  };
});

const { PaymentError } = await import("@/lib/payments/types");
const { startCheckout } = await import("@/lib/payments/checkout");

const BOOKING = {
  id: "bk_1",
  amountKes: 5000,
  depositKes: 2500,
  amountPaidKes: 0,
  clientName: "Asha Wanjiru",
  clientEmail: "asha@example.com",
  clientPhone: "0712345678",
  service: { title: "Individual Therapy" },
};

const PAYMENT = {
  id: "pay_1",
  reference: "RP-ABCD2345",
  status: "PENDING",
  amountKes: 2500,
  currency: "KES",
  purpose: "BOOKING_DEPOSIT",
};

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.booking.findUnique.mockResolvedValue(BOOKING);
  createPendingPayment.mockResolvedValue(PAYMENT);
});

describe("startCheckout", () => {
  it("does not create a payment when the provider is unconfigured", async () => {
    getProvider.mockImplementation(() => {
      throw new PaymentError("provider_unconfigured", "MPESA_DARAJA is not configured");
    });

    await expect(
      startCheckout({ target: { kind: "booking", bookingId: "bk_1" }, method: "MPESA" }),
    ).rejects.toThrow("not configured");

    expect(createPendingPayment).not.toHaveBeenCalled();
  });

  it("marks the payment failed when the provider rejects the charge", async () => {
    getProvider.mockReturnValue({
      id: "MPESA_DARAJA",
      method: "MPESA",
      isConfigured: () => true,
      charge: vi.fn().mockRejectedValue(new Error("Daraja unreachable")),
      verify: vi.fn(),
    });

    await expect(
      startCheckout({ target: { kind: "booking", bookingId: "bk_1" }, method: "MPESA" }),
    ).rejects.toThrow("Daraja unreachable");

    expect(failPayment).toHaveBeenCalledWith("pay_1", "Daraja unreachable");
    expect(markPaymentProcessing).not.toHaveBeenCalled();
  });

  it("charges the deposit and marks the payment processing on success", async () => {
    getProvider.mockReturnValue({
      id: "MPESA_DARAJA",
      method: "MPESA",
      isConfigured: () => true,
      charge: vi.fn().mockResolvedValue({
        provider: "MPESA_DARAJA",
        method: "MPESA",
        status: "PROCESSING",
        providerRef: "ws_CO_1",
      }),
      verify: vi.fn(),
    });
    markPaymentProcessing.mockResolvedValue({ ...PAYMENT, status: "PROCESSING" });

    const result = await startCheckout({
      target: { kind: "booking", bookingId: "bk_1" },
      method: "MPESA",
    });

    expect(createPendingPayment).toHaveBeenCalledWith(
      expect.objectContaining({ amountKes: 2500, purpose: "BOOKING_DEPOSIT" }),
    );
    expect(result.reference).toBe("RP-ABCD2345");
    expect(failPayment).not.toHaveBeenCalled();
  });

  it("refuses to charge a fully paid booking", async () => {
    prismaMock.booking.findUnique.mockResolvedValue({
      ...BOOKING,
      amountPaidKes: 5000,
    });

    await expect(
      startCheckout({ target: { kind: "booking", bookingId: "bk_1" }, method: "MPESA" }),
    ).rejects.toThrow("fully paid");

    expect(createPendingPayment).not.toHaveBeenCalled();
  });
});
