"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  TIME_SLOTS,
  generateAvailableDates,
  toDateOnly,
} from "@/features/public/booking/lib/schedule";
import { listSlotAvailability, reschedulePaidBooking } from "@/server/actions/booking";

export function RescheduleSlotForm({
  reference,
  durationMin,
  reason,
}: {
  reference: string;
  durationMin: number;
  reason: string | null;
}) {
  const [dates, setDates] = useState<Date[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [taken, setTaken] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [savedTime, setSavedTime] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const next = generateAvailableDates();
    setDates(next);
    setDate(next[0] ?? null);
  }, []);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    listSlotAvailability(toDateOnly(date), durationMin)
      .then((slots) => {
        if (!cancelled) {
          setTaken(slots.filter((slot) => slot.taken).map((slot) => slot.time));
          setTime("");
        }
      })
      .catch(() => {
        if (!cancelled) setTaken([]);
      });
    return () => {
      cancelled = true;
    };
  }, [date, durationMin]);

  if (savedTime && date) {
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    return (
      <p className="mt-4 max-w-md mx-auto rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed text-foreground">
        Your new permanent slot is every <strong>{weekday} at {savedTime}</strong>.
        Those hours stay reserved until your sessions finish.
      </p>
    );
  }

  return (
    <div className="mt-6 max-w-lg mx-auto text-left">
      <p className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
        {reason ??
          "This day and time was taken by an earlier M-Pesa payment. Choose a different date and time."}{" "}
        Your payment is kept.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {dates.map((item) => {
          const selected = date?.toDateString() === item.toDateString();
          return (
            <button
              key={item.toISOString()}
              type="button"
              onClick={() => setDate(item)}
              className={`rounded-xl border-2 p-2 text-center text-sm ${
                selected ? "border-primary" : "border-border"
              }`}
            >
              {item.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
            </button>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {TIME_SLOTS.map((slot) => {
          const blocked = taken.includes(slot);
          return (
            <button
              key={slot}
              type="button"
              disabled={blocked}
              onClick={() => setTime(slot)}
              className={`rounded-xl border-2 px-2 py-2 text-sm disabled:cursor-not-allowed disabled:text-muted-foreground ${
                time === slot ? "border-primary" : "border-border"
              }`}
            >
              {blocked ? `${slot} booked` : slot}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={!date || !time || pending}
        onClick={() => {
          if (!date || !time) return;
          setPending(true);
          void reschedulePaidBooking({
            reference,
            date: toDateOnly(date),
            time,
          })
            .then((result) => {
              if (result.ok) {
                setSavedTime(result.data.time);
                toast.success("New day and time saved");
              } else {
                toast.error(result.error);
              }
            })
            .finally(() => setPending(false));
        }}
        className="btn-primary mt-4 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Use this day and time"}
      </button>
    </div>
  );
}
