"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export function ConfirmationStep({
    clientName,
    date,
    time,
    commitmentFee,
}: {
    clientName: string;
    date: Date;
    time: string;
    commitmentFee: number;
}) {
    const weekdayLabel = date.toLocaleDateString("en-US", { weekday: "long" });

    return (
        <div className="text-center py-14 rounded-3xl border border-border bg-card max-w-2xl mx-auto px-6">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
                <Check size={32} />
            </span>
            <h2 className="mt-6 font-serif text-3xl font-semibold">
                Booking Confirmed!
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you, {clientName}. Your commitment fee of{" "}
                <strong className="text-foreground">
                    Ksh {commitmentFee.toLocaleString()}
                </strong>{" "}
                is recorded. Please pay the remaining balance when you attend your
                session.
            </p>
            <p className="mt-4 max-w-md mx-auto rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed text-foreground">
                Your permanent slot is every{" "}
                <strong>
                    {weekdayLabel} at {time}
                </strong>
                . It stays reserved for you until your sessions finish.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/" className="btn-primary">
                    Back to Home
                </Link>
                <Link href="/services" className="btn-secondary">
                    View All Services
                </Link>
            </div>
        </div>
    );
}

