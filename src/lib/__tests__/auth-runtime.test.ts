import { describe, expect, it, vi } from "vitest";

import {
  authConfigErrorMessage,
  missingAuthEnvVars,
  publicAuthErrorMessage,
} from "../auth-runtime";

describe("missingAuthEnvVars", () => {
  it("reports DATABASE_URL and BETTER_AUTH_SECRET when unset", () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("POSTGRES_PRISMA_URL", "");
    vi.stubEnv("POSTGRES_URL", "");
    vi.stubEnv("POSTGRES_URL_NON_POOLING", "");
    vi.stubEnv("BETTER_AUTH_SECRET", "");
    vi.stubEnv("AUTH_SECRET", "");

    expect(missingAuthEnvVars()).toEqual(["DATABASE_URL", "BETTER_AUTH_SECRET"]);
    expect(authConfigErrorMessage()).toMatch(/DATABASE_URL and BETTER_AUTH_SECRET/);

    vi.unstubAllEnvs();
  });

  it("accepts POSTGRES_URL when DATABASE_URL is unset", () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("POSTGRES_URL", "postgresql://vercel");
    vi.stubEnv("BETTER_AUTH_SECRET", "x".repeat(32));

    expect(missingAuthEnvVars()).toEqual([]);

    vi.unstubAllEnvs();
  });
});

describe("publicAuthErrorMessage", () => {
  it("explains a missing production secret", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://example");
    vi.stubEnv("BETTER_AUTH_SECRET", "x".repeat(32));

    expect(
      publicAuthErrorMessage(new Error("BETTER_AUTH_SECRET is missing")),
    ).toMatch(/BETTER_AUTH_SECRET/);

    vi.unstubAllEnvs();
  });
});
