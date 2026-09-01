"use client";

import Link from "next/link";
import { Loader2, Smartphone, XCircle, Clock } from "lucide-react";

import type { CheckoutPhase } from "./use-payment-checkout";

export function PaymentStatusPanel({
    phase,
    reference,
    customerMessage,
    failureReason,
    secondsLeft,
    onRetry,
}: {
    phase: CheckoutPhase;
    reference: string | null;
    customerMessage: string | null;
    failureReason: string | null;
    secondsLeft: number;
    onRetry: () => void;
}) {
    if (phase === "awaiting") {
        return (
            <div className="rounded-2xl border border-primary-deep/20 bg-primary-soft p-6">
                <div className="flex items-start gap-3">
                    <Smartphone className="mt-0.5 size-5 shrink-0 text-primary-deep" />
                    <div>
                        <p className="font-medium text-foreground">
                            Check your phone for the M-Pesa prompt
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {customerMessage ??
                                "Enter your M-Pesa PIN to authorise the payment. Keep this page open."}
                        </p>
                        <p className="mt-3 flex items-center gap-2 text-sm text-primary-deep">
                            <Loader2 className="size-4 animate-spin" />
                            Waiting for confirmation — {formatCountdown(secondsLeft)}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === "failed") {
        return (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                <div className="flex items-start gap-3">
                    <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                    <div>
                        <p className="font-medium text-foreground">Payment did not go through</p>
                        <p className="mt-1 text-sm text-muted-foreground">{failureReason}</p>
                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-4 inline-flex items-center rounded-full bg-primary-deep px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-deep/90"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === "timeout") {
        return (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-50 p-6 dark:bg-amber-950/20">
                <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-5 shrink-0 text-amber-600" />
                    <div>
                        <p className="font-medium text-foreground">Still pending</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            We have not received confirmation yet. If you completed the payment it
                            may still come through.
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            {reference && (
                                <Link
                                    href={`/payments/${reference}`}
                                    className="inline-flex items-center rounded-full border-2 border-border px-6 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                                >
                                    Check payment status
                                </Link>
                            )}
                            <button
                                type="button"
                                onClick={onRetry}
                                className="inline-flex items-center rounded-full bg-primary-deep px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-deep/90"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

function formatCountdown(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}
