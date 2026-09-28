"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { clearAllBookings } from "@/server/actions/operations";

export function ClearProductionDataButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(
          "Delete every booking and every payment stored for this site? Sponsor records stay, but their payment rows are removed. This cannot be undone.",
        );
        if (!confirmed) return;

        startTransition(async () => {
          const result = await clearAllBookings();
          if (result.ok) {
            toast.success(
              `Cleared ${result.data.bookings} bookings and ${result.data.payments} payments`,
            );
            router.refresh();
          } else {
            toast.error(result.error);
          }
        });
      }}
      className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      <Trash2 size={16} />
      Clear bookings & payments
    </button>
  );
}
