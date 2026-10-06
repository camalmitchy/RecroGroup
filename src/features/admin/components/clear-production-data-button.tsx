"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  clearAllBookings,
  clearOldBookings,
  type BookingClearWindow,
} from "@/server/actions/operations";

const buttonClass =
  "flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50";

export function ClearProductionDataButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const run = (
    confirmMessage: string,
    action: () => ReturnType<typeof clearAllBookings>,
  ) => {
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(
          `Cleared ${result.data.bookings} bookings and ${result.data.payments} payments`,
        );
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const clearAged = (window: BookingClearWindow, label: string, kept: string) => {
    run(
      `Delete bookings and payments from before the last ${label}, including appointment records attached to those bookings? Records from the last ${kept} stay. Grief camp fees and donations stay. This cannot be undone.`,
      () => clearOldBookings(window),
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => clearAged("week", "1 week", "7 days")}
        className={buttonClass}
      >
        <Trash2 size={16} />
        Clear older than 1 week
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => clearAged("month", "1 month", "30 days")}
        className={buttonClass}
      >
        <Trash2 size={16} />
        Clear older than 1 month
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          run(
            "Delete every booking and every payment stored for this site? Sponsor records stay, but their payment rows are removed. This cannot be undone.",
            clearAllBookings,
          )
        }
        className={buttonClass}
      >
        <Trash2 size={16} />
        Clear all
      </button>
    </div>
  );
}
