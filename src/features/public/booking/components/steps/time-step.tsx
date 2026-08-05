"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin, Mail } from "lucide-react";

import { CLINICIANS } from "../booking-data";

export function TimeStep({
    clinician,
    setClinician,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    availableDates,
    timeSlots,
    onBack,
    onNext,
}: {
    clinician: string;
    setClinician: (c: string) => void;
    selectedDate: Date | null;
    setSelectedDate: (d: Date) => void;
    selectedTime: string;
    setSelectedTime: (t: string) => void;
    availableDates: Date[];
    timeSlots: string[];
    onBack: () => void;
    onNext: () => void;
}) {
    const weekdayLabel = selectedDate
        ? selectedDate.toLocaleDateString("en-US", { weekday: "long" })
        : null;

    return (
        <div className="space-y-6">
            {/* Clinician Selection */}
            <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                    Clinician
                </label>
                <div className="space-y-3">
                    {CLINICIANS.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setClinician(c.id)}
                            className={`w-full flex items-center gap-4 text-left rounded-2xl border-2 p-4 transition bg-background shadow-sm ${clinician === c.id
                                ? "border-primary"
                                : "border-border hover:border-primary/50"
                                }`}
                        >
                            <Image
                                src={c.photo}
                                alt={c.name}
                                width={56}
                                height={56}
                                className="rounded-full object-cover w-14 h-14"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{c.name}</h3>
                                <p className="text-sm text-muted-foreground">{c.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {c.specialties.join(", ")}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Date Selection */}
            <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                    Select Date (Next 14 Days)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {availableDates.map((date) => {
                        const isSelected =
                            selectedDate?.toDateString() === date.toDateString();
                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className={`rounded-xl border-2 p-3 text-center text-sm transition bg-background shadow-sm ${isSelected
                                    ? "border-primary"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <div className="font-semibold">{date.getDate()}</div>
                                <div className="text-xs mt-1">
                                    {date.toLocaleDateString("en-US", { month: "short" })}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                        Select Time
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map((time) => {
                            const isSelected = selectedTime === time;
                            return (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`rounded-xl border-2 px-3 py-2 text-sm font-medium transition bg-background shadow-sm ${isSelected
                                        ? "border-primary"
                                        : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                    {selectedTime && weekdayLabel && (
                        <p className="mt-4 rounded-2xl border border-border bg-primary-soft/60 px-4 py-3 text-sm leading-relaxed text-foreground">
                            This becomes your permanent slot: every{" "}
                            <strong>
                                {weekdayLabel} at {selectedTime}
                            </strong>{" "}
                            is reserved for you until your sessions finish. Our office
                            manager will reopen the slot once it is available again.
                        </p>
                    )}
                </div>
            )}

            {/* In-person only + diaspora note */}
            <div className="rounded-2xl border-2 border-border bg-background p-5 shadow-sm">
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-deep">
                        <MapPin size={18} />
                    </span>
                    <div>
                        <h3 className="font-semibold text-foreground">
                            In-person sessions only
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            Online calendar booking is for clinic visits in Nairobi.
                            Diaspora clients should email or contact us to arrange
                            support — online booking is not available for remote
                            clients.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                            <a
                                href="mailto:hello@recrogroup.org"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep"
                            >
                                <Mail size={14} /> hello@recrogroup.org
                            </a>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep"
                            >
                                Contact us <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!selectedDate || !selectedTime}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

