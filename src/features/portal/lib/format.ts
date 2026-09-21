const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Nairobi",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Nairobi",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateTimeFormatter.format(date);
}

export function formatIsoDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export function formatKes(amount: number | null | undefined): string {
  return amount === null || amount === undefined
    ? "—"
    : amount.toLocaleString("en-KE");
}

export function formatRelativeTime(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const deltaMs = Date.now() - date.getTime();
  const deltaSec = Math.round(deltaMs / 1000);
  if (deltaSec < 45) return "Just now";
  if (deltaSec < 3600) {
    const mins = Math.max(1, Math.round(deltaSec / 60));
    return `${mins} min ago`;
  }
  if (deltaSec < 86400) {
    const hours = Math.round(deltaSec / 3600);
    return `${hours}h ago`;
  }
  if (deltaSec < 604800) {
    const days = Math.round(deltaSec / 86400);
    return `${days}d ago`;
  }
  return formatDate(date);
}
