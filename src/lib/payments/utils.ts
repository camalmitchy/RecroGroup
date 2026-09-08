import { createHash, randomBytes } from "node:crypto";

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReference(prefix: string, length = 8) {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += REFERENCE_ALPHABET[bytes[i] % REFERENCE_ALPHABET.length];
  }
  return `${prefix}-${out}`;
}

export function dedupeKey(parts: Array<string | number | null | undefined>) {
  const seed = parts
    .filter((part) => part !== null && part !== undefined && part !== "")
    .join("|");
  return createHash("sha256").update(seed).digest("hex");
}

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  if (digits.startsWith("254")) return digits;

  throw new Error(`Invalid Kenyan phone number: ${input}`);
}

export function isValidKenyanPhone(input: string) {
  try {
    const normalized = normalizePhone(input);
    return /^254(7|1)\d{8}$/.test(normalized);
  } catch {
    return false;
  }
}

export function toDisplayPhone(input: string) {
  try {
    const normalized = normalizePhone(input);
    return `+${normalized}`;
  } catch {
    return input;
  }
}

export function assertPositiveAmount(amount: number, label = "Amount") {
  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount <= 0) {
    throw new Error(`${label} must be a positive whole number of shillings`);
  }
  return amount;
}

export function formatKes(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function calculateDeposit(total: number, percent: number) {
  return Math.max(1, Math.round((total * percent) / 100));
}

export function darajaTimestamp(now: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${now.getFullYear()}` +
    `${pad(now.getMonth() + 1)}` +
    `${pad(now.getDate())}` +
    `${pad(now.getHours())}` +
    `${pad(now.getMinutes())}` +
    `${pad(now.getSeconds())}`
  );
}

export function parseDarajaTimestamp(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;
  const raw = String(value);
  const match = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(raw);
  if (!match) return null;
  const [, y, mo, d, h, mi, s] = match;
  return new Date(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    Number(s),
  );
}
