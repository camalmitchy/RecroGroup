import { APIError } from "better-auth/api";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  user: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
};

const signInEmail = vi.fn();
const signUpEmail = vi.fn();

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth", () => ({
  auth: { api: { signInEmail, signUpEmail } },
}));
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

const { signInWithPassword, signUpWithPassword } = await import(
  "@/server/actions/auth"
);

const validSignIn = {
  email: "Ada@Example.com",
  password: "Testpass123",
  rememberMe: true,
};

const validSignUp = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  password: "Testpass123",
  confirmPassword: "Testpass123",
  phone: "",
  commsEmail: true,
  commsSms: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("signInWithPassword", () => {
  it("rejects unknown emails before calling Better Auth", async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null);

    const result = await signInWithPassword(validSignIn);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/No account found/);
      expect(result.fieldErrors?.email?.[0]).toMatch(/No account found/);
    }
    expect(signInEmail).not.toHaveBeenCalled();
  });

  it("tells Google-only accounts to use Google", async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce({
      id: "u1",
      email: "ada@example.com",
      accounts: [{ providerId: "google", password: null }],
    });

    const result = await signInWithPassword(validSignIn);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/uses Google/);
    expect(signInEmail).not.toHaveBeenCalled();
  });

  it("signs in with the normalized email and heals mixed-case rows", async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce({
      id: "u1",
      email: "Ada@Example.com",
      accounts: [{ providerId: "credential", password: "hash" }],
    });
    prismaMock.user.update.mockResolvedValueOnce({ id: "u1" });
    signInEmail.mockResolvedValueOnce({ user: { id: "u1" } });

    const result = await signInWithPassword(validSignIn);

    expect(result).toEqual({ ok: true, data: { signedIn: true } });
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { email: "ada@example.com" },
    });
    expect(signInEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          email: "ada@example.com",
          password: "Testpass123",
          rememberMe: true,
        },
      }),
    );
  });

  it("maps Better Auth unauthorized to a password error", async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce({
      id: "u1",
      email: "ada@example.com",
      accounts: [{ providerId: "credential", password: "hash" }],
    });
    signInEmail.mockRejectedValueOnce(
      APIError.from("UNAUTHORIZED", {
        code: "INVALID_EMAIL_OR_PASSWORD",
        message: "Invalid email or password",
      }),
    );

    const result = await signInWithPassword(validSignIn);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("Incorrect email or password.");
  });
});

describe("signUpWithPassword", () => {
  it("creates an account with a lowercase email", async () => {
    signUpEmail.mockResolvedValueOnce({ user: { id: "u1" } });

    const result = await signUpWithPassword({
      ...validSignUp,
      email: "Ada@Example.com",
    });

    expect(result).toEqual({ ok: true, data: { signedIn: true } });
    expect(signUpEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          email: "ada@example.com",
          name: "Ada Lovelace",
        }),
      }),
    );
  });

  it("maps an existing account to a field error", async () => {
    signUpEmail.mockRejectedValueOnce(
      APIError.from("UNPROCESSABLE_ENTITY", {
        code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
        message: "User already exists. Use another email.",
      }),
    );

    const result = await signUpWithPassword(validSignUp);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/already exists/);
      expect(result.fieldErrors?.email?.[0]).toMatch(/already exists/);
    }
  });
});
