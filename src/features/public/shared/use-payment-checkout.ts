"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PaymentMethod = "MPESA" | "CARD";

export type PaymentStatus =
    | "PENDING"
    | "PROCESSING"
    | "PAID"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED";

export type CheckoutTarget =
    | { griefApplicationId: string }
    | { donationId: string };

type InitiateResponse = {
    paymentId: string;
    reference: string;
    status: PaymentStatus;
    amountKes: number;
    redirectUrl?: string | null;
    customerMessage?: string | null;
};

type StatusResponse = {
    reference: string;
    status: PaymentStatus;
    amountKes: number;
    settledAmountKes: number | null;
    method: PaymentMethod;
    mpesaReceipt: string | null;
    failureReason: string | null;
    paidAt: string | null;
};

export type CheckoutPhase =
    | "idle"
    | "initiating"
    | "awaiting"
    | "paid"
    | "failed"
    | "timeout";

export type StartCheckoutArgs = {
    method: PaymentMethod;
    target: CheckoutTarget;
    phone?: string;
    email?: string;
    name?: string;
};

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120_000;

function newIdempotencyKey() {
    return typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `idem-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function usePaymentCheckout() {
    const [phase, setPhase] = useState<CheckoutPhase>("idle");
    const [reference, setReference] = useState<string | null>(null);
    const [amountKes, setAmountKes] = useState<number | null>(null);
    const [customerMessage, setCustomerMessage] = useState<string | null>(null);
    const [failureReason, setFailureReason] = useState<string | null>(null);
    const [mpesaReceipt, setMpesaReceipt] = useState<string | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(POLL_TIMEOUT_MS / 1000);

    const idempotencyKeyRef = useRef<string | null>(null);
    idempotencyKeyRef.current ??= newIdempotencyKey();
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const deadlineRef = useRef(0);
    const inFlightRef = useRef(false);

    const stopPolling = useCallback(() => {
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => stopPolling, [stopPolling]);

    const reset = useCallback(() => {
        stopPolling();
        idempotencyKeyRef.current = newIdempotencyKey();
        inFlightRef.current = false;
        setPhase("idle");
        setReference(null);
        setAmountKes(null);
        setCustomerMessage(null);
        setFailureReason(null);
        setMpesaReceipt(null);
        setSecondsLeft(POLL_TIMEOUT_MS / 1000);
    }, [stopPolling]);

    const poll = useCallback(
        async (ref: string) => {
            const remaining = deadlineRef.current - Date.now();
            setSecondsLeft(Math.max(0, Math.ceil(remaining / 1000)));

            if (remaining <= 0) {
                stopPolling();
                setPhase("timeout");
                return;
            }

            let payload: StatusResponse;
            try {
                const response = await fetch(`/api/payments/status/${ref}`, {
                    cache: "no-store",
                });
                if (!response.ok) return;
                payload = (await response.json()) as StatusResponse;
            } catch {
                return;
            }

            if (payload.status === "PAID") {
                stopPolling();
                setMpesaReceipt(payload.mpesaReceipt);
                setPhase("paid");
                return;
            }

            if (payload.status === "FAILED" || payload.status === "CANCELLED") {
                stopPolling();
                setFailureReason(
                    payload.failureReason ??
                    (payload.status === "CANCELLED"
                        ? "The payment was cancelled."
                        : "The payment did not go through."),
                );
                setPhase("failed");
            }
        },
        [stopPolling],
    );

    const start = useCallback(
        async ({ method, target, phone, email, name }: StartCheckoutArgs) => {
            if (inFlightRef.current) return { ok: false as const, error: null };
            inFlightRef.current = true;

            stopPolling();
            setFailureReason(null);
            setPhase("initiating");

            try {
                const response = await fetch("/api/payments/initiate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        method,
                        ...target,
                        phone,
                        email,
                        name,
                        idempotencyKey: idempotencyKeyRef.current,
                    }),
                });

                const payload: unknown = await response.json();

                if (!response.ok) {
                    const error =
                        typeof payload === "object" &&
                            payload !== null &&
                            typeof (payload as { error?: unknown }).error === "string"
                            ? (payload as { error: string }).error
                            : "Could not start payment. Please try again.";
                    setPhase("idle");
                    return { ok: false as const, error };
                }

                const result = payload as InitiateResponse;
                setReference(result.reference);
                setAmountKes(result.amountKes);
                setCustomerMessage(result.customerMessage ?? null);

                if (method === "CARD") {
                    if (!result.redirectUrl) {
                        setPhase("idle");
                        return {
                            ok: false as const,
                            error: "Card checkout is unavailable right now.",
                        };
                    }
                    window.location.href = result.redirectUrl;
                    return { ok: true as const, reference: result.reference };
                }

                if (result.status === "PAID") {
                    setPhase("paid");
                    return { ok: true as const, reference: result.reference };
                }

                deadlineRef.current = Date.now() + POLL_TIMEOUT_MS;
                setSecondsLeft(POLL_TIMEOUT_MS / 1000);
                setPhase("awaiting");
                timerRef.current = setInterval(() => {
                    void poll(result.reference);
                }, POLL_INTERVAL_MS);

                return { ok: true as const, reference: result.reference };
            } catch {
                setPhase("idle");
                return {
                    ok: false as const,
                    error: "Network error. Please check your connection and try again.",
                };
            } finally {
                inFlightRef.current = false;
            }
        },
        [poll, stopPolling],
    );

    return {
        phase,
        reference,
        amountKes,
        customerMessage,
        failureReason,
        mpesaReceipt,
        secondsLeft,
        start,
        reset,
        stopPolling,
        busy: phase === "initiating" || phase === "awaiting",
    };
}
