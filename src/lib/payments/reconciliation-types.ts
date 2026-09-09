export type MatchSeverity = "ok" | "warn" | "mismatch";

export type MatchCheck = {
  label: string;
  severity: MatchSeverity;
  detail: string;
};

export type MatchReport = {
  checks: MatchCheck[];
  severity: MatchSeverity;
  summary: string;
};
