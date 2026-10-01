import "server-only";

export const GOOGLE_SHEET_TABS = [
  "Grief camp",
  "Corporate speaking",
  "Team building",
  "Consortium",
] as const;

export type GoogleSheetTab = (typeof GOOGLE_SHEET_TABS)[number];

export type GoogleSheetRow = {
  tab: GoogleSheetTab;
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

function webhookUrl() {
  return process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() || "";
}

function webhookSecret() {
  return process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim() || "";
}

export function isGoogleSheetsConfigured() {
  return Boolean(webhookUrl());
}

export function sheetTabForInquiry(input: {
  type: string;
  subject?: string | null;
}): GoogleSheetTab | null {
  const subject = (input.subject ?? "").toLowerCase();

  if (subject.includes("consortium")) return "Consortium";
  if (subject.includes("team builder") || subject.includes("team-building")) {
    return "Team building";
  }
  if (subject.includes("corporate")) return "Corporate speaking";
  if (input.type === "CORPORATE") return "Corporate speaking";
  return null;
}

export async function appendGoogleSheetRow(row: GoogleSheetRow) {
  const url = webhookUrl();
  if (!url) return { skipped: true as const };

  const secret = webhookSecret();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Google Sheets webhook failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    );
  }

  return { skipped: false as const };
}

export async function recordGoogleSheetRow(row: GoogleSheetRow) {
  try {
    return await appendGoogleSheetRow(row);
  } catch (error) {
    console.error("[google-sheets] could not append row", {
      tab: row.tab,
      error: error instanceof Error ? error.message : error,
    });
    return { skipped: true as const };
  }
}
