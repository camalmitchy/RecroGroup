import { describe, expect, it } from "vitest";

import {
  profileUpdateSchema,
  toEditablePhone,
  toStoredPhone,
} from "@/features/profile/lib/schema";

describe("toEditablePhone", () => {
  it("turns a stored Kenyan number into a 07 form", () => {
    expect(toEditablePhone("254712345678")).toBe("0712345678");
    expect(toEditablePhone("+254712345678")).toBe("0712345678");
  });

  it("returns an empty string when nothing is stored", () => {
    expect(toEditablePhone(null)).toBe("");
    expect(toEditablePhone("")).toBe("");
  });
});

describe("toStoredPhone", () => {
  it("normalizes a Kenyan number for the database", () => {
    expect(toStoredPhone("0712 345 678")).toBe("254712345678");
  });

  it("clears a blank value", () => {
    expect(toStoredPhone("  ")).toBeNull();
  });
});

describe("profileUpdateSchema", () => {
  it("accepts a name and optional Kenyan phone", () => {
    expect(
      profileUpdateSchema.parse({ name: "Asha Wanjiru", phone: "0712345678" }),
    ).toEqual({ name: "Asha Wanjiru", phone: "0712345678" });
    expect(profileUpdateSchema.parse({ name: "Asha Wanjiru", phone: "" })).toEqual({
      name: "Asha Wanjiru",
      phone: "",
    });
  });

  it("rejects a short name or invalid phone", () => {
    expect(profileUpdateSchema.safeParse({ name: "A", phone: "" }).success).toBe(
      false,
    );
    expect(
      profileUpdateSchema.safeParse({ name: "Asha", phone: "12345" }).success,
    ).toBe(false);
  });
});
