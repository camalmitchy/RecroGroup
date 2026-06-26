import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "info" | "danger" | "muted";

const toneClasses: Record<StatusTone, string> = {
  success: "bg-primary/10 text-primary border-primary/20",
  warning: "bg-accent/20 text-accent-foreground border-accent/30",
  info: "bg-secondary/10 text-secondary border-secondary/20",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  muted: "bg-muted text-muted-foreground border-border",
};

type StatusBadgeProps = {
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
};

export function StatusBadge({
  tone = "muted",
  children,
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full text-[11px] font-semibold capitalize",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </Badge>
  );
}

export function bookingStatusTone(
  status: string,
): StatusTone {
  switch (status) {
    case "CONFIRMED":
      return "info";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "danger";
    default:
      return "warning";
  }
}

export function paymentStatusTone(status: string): StatusTone {
  switch (status) {
    case "PAID":
      return "success";
    case "FAILED":
    case "REFUNDED":
      return "danger";
    default:
      return "warning";
  }
}

export function griefStatusTone(status: string): StatusTone {
  switch (status) {
    case "ACCEPTED":
      return "success";
    case "REJECTED":
      return "danger";
    case "REVIEWING":
    case "WAITLISTED":
      return "info";
    default:
      return "warning";
  }
}

export function inquiryStatusTone(status: string): StatusTone {
  switch (status) {
    case "RESOLVED":
    case "CLOSED":
      return "success";
    case "IN_PROGRESS":
      return "info";
    default:
      return "warning";
  }
}
