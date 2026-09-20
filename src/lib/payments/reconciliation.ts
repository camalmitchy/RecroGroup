import "server-only";

import type { MatchCheck, MatchReport, MatchSeverity } from "./reconciliation-types";

export type { MatchCheck, MatchReport, MatchSeverity };

function normaliseRef(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function referencesRelated(supplied: string, expected: string) {
  const a = normaliseRef(supplied);
  const b = normaliseRef(expected);
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a);
}

export type ReconcileInput = {
  bankReference: string;
  proofUrl: string | null;
  bookingReference: string;
  paymentReference: string;
  duplicateOf: string | null;
};

export function buildMatchReport(input: ReconcileInput): MatchReport {
  const checks: MatchCheck[] = [];

  if (input.duplicateOf) {
    checks.push({
      label: "Duplicate reference",
      severity: "mismatch",
      detail: `Already submitted on payment ${input.duplicateOf}`,
    });
  } else {
    checks.push({
      label: "Duplicate reference",
      severity: "ok",
      detail: "Not seen on another payment",
    });
  }

  const related =
    referencesRelated(input.bankReference, input.bookingReference) ||
    referencesRelated(input.bankReference, input.paymentReference);

  checks.push({
    label: "Reference",
    severity: related ? "ok" : "warn",
    detail: related
      ? "Matches the booking reference"
      : "Does not resemble the booking reference — verify against the slip",
  });

  checks.push({
    label: "Proof of payment",
    severity: input.proofUrl ? "ok" : "warn",
    detail: input.proofUrl ? "Slip attached" : "No slip attached",
  });

  const severity: MatchSeverity = checks.some((c) => c.severity === "mismatch")
    ? "mismatch"
    : checks.some((c) => c.severity === "warn")
      ? "warn"
      : "ok";

  const summary =
    severity === "mismatch"
      ? "Do not verify until the flagged issue is resolved"
      : severity === "warn"
        ? "Check the slip against the expected amount before verifying"
        : "Nothing flagged — confirm the amount on the slip, then verify";

  return { checks, severity, summary };
}
