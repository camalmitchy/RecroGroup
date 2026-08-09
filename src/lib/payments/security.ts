import "server-only";

const SAFARICOM_RANGES = [
  "196.201.214.",
  "196.201.213.",
  "196.201.212.",
  "196.201.211.",
  "196.201.210.",
  "196.202.183.",
  "196.202.182.",
];

function extraAllowlist() {
  const raw = process.env.MPESA_ALLOWED_IPS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function clientIpFrom(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return headers.get("x-real-ip");
}

export function isTrustedDarajaIp(ip: string | null) {
  if (process.env.MPESA_ENFORCE_IP_ALLOWLIST !== "true") return true;
  if (!ip) return false;

  const allowlist = extraAllowlist();
  if (allowlist.includes(ip)) return true;

  return SAFARICOM_RANGES.some((prefix) => ip.startsWith(prefix));
}
