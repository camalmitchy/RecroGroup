import { describe, expect, it } from "vitest";

import {
  assertPositiveAmount,
  calculateDeposit,
  darajaTimestamp,
  dedupeKey,
  formatKes,
  generateReference,
  isValidKenyanPhone,
  normalizePhone,
  parseDarajaTimestamp,
  toDisplayPhone,
} from "@/lib/payments/utils";

describe("normalizePhone", () => {
  it.each([
    ["0712345678", "254712345678"],
    ["0112345678", "254112345678"],
    ["712345678", "254712345678"],
    ["+254712345678", "254712345678"],
    ["254712345678", "254712345678"],
    ["+254 712 345 678", "254712345678"],
    ["0712-345-678", "254712345678"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(["", "abc", "12345", "0712345", "07123456789012"])(
    "throws on %s",
    (input) => {
      expect(() => normalizePhone(input)).toThrow(/Invalid Kenyan phone number/);
    },
  );

  it("is idempotent", () => {
    expect(normalizePhone(normalizePhone("0712345678"))).toBe("254712345678");
  });

  // The trailing `startsWith("254")` branch returns wrong-length input verbatim
  // instead of throwing. isValidKenyanPhone is the gate that catches these.
  it.each(["254", "25471234567", "2547123456789999"])(
    "passes through wrong-length 254-prefixed input %s, which isValidKenyanPhone then rejects",
    (input) => {
      expect(normalizePhone(input)).toBe(input);
      expect(isValidKenyanPhone(input)).toBe(false);
    },
  );
});

describe("isValidKenyanPhone", () => {
  it.each(["0712345678", "0112345678", "+254712345678", "254112345678", "712345678"])(
    "accepts %s",
    (input) => {
      expect(isValidKenyanPhone(input)).toBe(true);
    },
  );

  it.each([
    "0212345678",
    "254212345678",
    "0712345",
    "07123456780",
    "not a phone",
    "",
  ])("rejects %s", (input) => {
    expect(isValidKenyanPhone(input)).toBe(false);
  });

  it("does not throw on junk input", () => {
    expect(() => isValidKenyanPhone("!!!")).not.toThrow();
  });
});

describe("toDisplayPhone", () => {
  it("renders a normalized number in international form", () => {
    expect(toDisplayPhone("0712345678")).toBe("+254712345678");
  });

  it("returns the original input when it cannot be normalized", () => {
    expect(toDisplayPhone("not a phone")).toBe("not a phone");
  });
});

describe("calculateDeposit", () => {
  it("takes 50 percent of 5000", () => {
    expect(calculateDeposit(5000, 50)).toBe(2500);
  });

  it("rounds to whole shillings", () => {
    expect(calculateDeposit(4999, 50)).toBe(2500);
    expect(calculateDeposit(333, 33)).toBe(110);
  });

  it("never returns zero for tiny amounts", () => {
    expect(calculateDeposit(1, 50)).toBe(1);
    expect(calculateDeposit(1, 1)).toBe(1);
  });

  it("returns the full amount at 100 percent", () => {
    expect(calculateDeposit(7500, 100)).toBe(7500);
  });

  it("never exceeds the total for percentages up to 100", () => {
    for (const total of [1, 99, 500, 12_345]) {
      for (const percent of [1, 25, 50, 75, 100]) {
        expect(calculateDeposit(total, percent)).toBeLessThanOrEqual(
          Math.max(1, total),
        );
      }
    }
  });
});

describe("assertPositiveAmount", () => {
  it("returns the amount when valid", () => {
    expect(assertPositiveAmount(2500)).toBe(2500);
  });

  it.each([0, -1, -2500, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 100.5])(
    "rejects %s",
    (amount) => {
      expect(() => assertPositiveAmount(amount)).toThrow(
        /must be a positive whole number of shillings/,
      );
    },
  );

  it("uses the supplied label in the error message", () => {
    expect(() => assertPositiveAmount(0, "Refund amount")).toThrow(/^Refund amount/);
  });
});

describe("formatKes", () => {
  it("groups thousands", () => {
    expect(formatKes(1_234_567)).toBe("KES 1,234,567");
  });
});

describe("generateReference", () => {
  it("prefixes the reference and separates with a hyphen", () => {
    expect(generateReference("BKG")).toMatch(/^BKG-[A-Z2-9]{8}$/);
  });

  it("honours the requested body length", () => {
    expect(generateReference("DON", 12)).toMatch(/^DON-[A-Z2-9]{12}$/);
  });

  it("never emits characters that are ambiguous when read aloud", () => {
    const body = Array.from({ length: 500 }, () => generateReference("X", 16).slice(2)).join("");
    expect(body).not.toMatch(/[01OI]/);
  });

  it("is collision free across many draws", () => {
    const drawn = new Set(Array.from({ length: 5_000 }, () => generateReference("BKG")));
    expect(drawn.size).toBe(5_000);
  });
});

describe("dedupeKey", () => {
  it("is deterministic for identical input", () => {
    expect(dedupeKey(["PAYSTACK", "charge.success", 42])).toBe(
      dedupeKey(["PAYSTACK", "charge.success", 42]),
    );
  });

  it("differs for different input", () => {
    expect(dedupeKey(["PAYSTACK", "charge.success", 42])).not.toBe(
      dedupeKey(["PAYSTACK", "charge.success", 43]),
    );
  });

  it("ignores null, undefined and empty entries", () => {
    const base = dedupeKey(["MPESA_DARAJA", "stk_callback", "ws_CO_1"]);
    expect(dedupeKey(["MPESA_DARAJA", null, "stk_callback", undefined, "ws_CO_1", ""])).toBe(base);
  });

  it("returns a sha256 hex digest", () => {
    expect(dedupeKey(["a"])).toMatch(/^[0-9a-f]{64}$/);
  });

  it("distinguishes different groupings of the same characters", () => {
    expect(dedupeKey(["ab", "c"])).not.toBe(dedupeKey(["a", "bc"]));
  });
});

describe("darajaTimestamp", () => {
  it("formats as YYYYMMDDHHmmss with zero padding", () => {
    expect(darajaTimestamp(new Date(2026, 0, 5, 9, 7, 3))).toBe("20260105090703");
  });

  it("round-trips through parseDarajaTimestamp", () => {
    const original = new Date(2026, 7, 8, 14, 30, 45);
    const parsed = parseDarajaTimestamp(darajaTimestamp(original));
    expect(parsed?.getTime()).toBe(original.getTime());
  });
});

describe("parseDarajaTimestamp", () => {
  it("accepts a numeric timestamp as Daraja sends it", () => {
    expect(parseDarajaTimestamp(20260808143045)?.getTime()).toBe(
      new Date(2026, 7, 8, 14, 30, 45).getTime(),
    );
  });

  it.each([null, undefined, "", "not-a-date", "2026080814304", "202608081430455"])(
    "returns null for %s",
    (value) => {
      expect(parseDarajaTimestamp(value)).toBeNull();
    },
  );
});
