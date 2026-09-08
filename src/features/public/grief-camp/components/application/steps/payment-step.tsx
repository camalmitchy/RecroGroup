"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    Check,
    CreditCard,
    Loader2,
    Smartphone,
} from "lucide-react";

import { PaymentStatusPanel } from "@/features/public/shared/payment-status-panel";
import type { PaymentMethod } from "@/features/public/shared/use-payment-checkout";
import { usePaymentCheckout } from "@/features/public/shared/use-payment-checkout";
import type { CampPricing, GriefCampApplicationData } from "../../../types";

interface PaymentStepProps {
    data: Partial<GriefCampApplicationData>;
    pricing: CampPricing;
    onPrevious: () => void;
    onSubmit: (args: {
        method: PaymentMethod;
        phone: string;
    }) => Promise<{ ok: boolean; error?: string }>;
    checkout: ReturnType<typeof usePaymentCheckout>;
}

export function PaymentStep({
    data,
    pricing,
    onPrevious,
    onSubmit,
    checkout,
}: PaymentStepProps) {
    const [method, setMethod] = useState<PaymentMethod>("MPESA");
    const [phone, setPhone] = useState(() => derivePhone(data));
    const [phoneError, setPhoneError] = useState("");

    const parentAttending = data.consent?.attendingParentSession ?? false;
    const camperAmount = pricing.current.camperAmountKes;
    const parentAmount = parentAttending ? pricing.current.parentAmountKes : 0;
    const total = camperAmount + parentAmount;

    const camperTiers = pricing.tiers.filter((t) => t.attendeeType === "CAMPER");
    const parentTiers = pricing.tiers.filter((t) => t.attendeeType === "PARENT");

    const { phase, reference, customerMessage, failureReason, secondsLeft, busy } =
        checkout;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (method === "MPESA") {
            const digits = phone.replace(/\D/g, "");
            if (digits.length < 9) {
                setPhoneError("Enter the M-Pesa number that will receive the prompt");
                return;
            }
        }

        setPhoneError("");
        await onSubmit({ method, phone });
    };

    const retry = () => {
        checkout.reset();
    };

    if (phase === "paid") {
        return (
            <div className="py-8 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-deep text-white">
                    <Check className="size-7" />
                </span>
                <h2 className="mt-5 font-serif text-3xl text-foreground">
                    Application received
                </h2>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                    Your payment of KES {total.toLocaleString()} has been confirmed and your
                    child&apos;s place at {pricing.campName} is reserved. A coordinator will
                    be in touch by email.
                </p>
                {reference && (
                    <p className="mt-4 font-mono text-sm text-muted-foreground">
                        Reference: {reference}
                    </p>
                )}
                <div className="mt-8">
                    <Link href="/grief-camp" className="btn-secondary">
                        Back to Grief Camp
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="mb-2 font-serif text-2xl text-foreground">
                    Section 7: Payment
                </h2>
                <p className="text-sm text-muted-foreground">
                    Complete your payment to submit your application
                </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-6">
                <h3 className="mb-4 font-serif text-lg text-foreground">
                    {pricing.campName} — Camp Particulars & Fees
                </h3>

                <div className="space-y-6">
                    <TierList
                        heading="Fee: For Campers"
                        tiers={camperTiers}
                        activeLabel={pricing.current.camperTierLabel}
                    />
                    {parentTiers.length > 0 && (
                        <TierList
                            heading="Fee: For Parents"
                            tiers={parentTiers}
                            activeLabel={pricing.current.parentTierLabel}
                        />
                    )}

                    <div className="border-t border-border pt-4">
                        <p className="mb-2 text-sm text-foreground">
                            <span className="font-medium">Camp dates:</span>{" "}
                            {pricing.dateRange}
                            {pricing.location ? ` · ${pricing.location}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Parents&apos; session will be Friday morning only
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-primary-deep/20 bg-primary-soft p-6">
                <h3 className="mb-3 font-medium text-foreground">Your total</h3>
                <dl className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <dt className="text-foreground">
                            Camper registration · {pricing.current.camperTierLabel}
                        </dt>
                        <dd className="font-semibold text-foreground">
                            KES {camperAmount.toLocaleString()}
                        </dd>
                    </div>
                    {parentAttending && (
                        <div className="flex items-center justify-between">
                            <dt className="text-foreground">
                                Parent session
                                {pricing.current.parentTierLabel
                                    ? ` · ${pricing.current.parentTierLabel}`
                                    : ""}
                            </dt>
                            <dd className="font-semibold text-foreground">
                                KES {parentAmount.toLocaleString()}
                            </dd>
                        </div>
                    )}
                    <div className="flex items-center justify-between border-t border-primary-deep/20 pt-2">
                        <dt className="font-medium text-foreground">Total due</dt>
                        <dd className="font-serif text-xl font-semibold text-primary-deep">
                            KES {total.toLocaleString()}
                        </dd>
                    </div>
                </dl>
                {!parentAttending && (
                    <p className="mt-3 text-xs text-muted-foreground">
                        Go back to the Consent step to add the parents&apos; session.
                    </p>
                )}
            </div>

            {phase === "idle" || phase === "initiating" ? (
                <>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <MethodCard
                            active={method === "MPESA"}
                            onClick={() => setMethod("MPESA")}
                            icon={<Smartphone size={18} />}
                            title="M-Pesa"
                            sub="A prompt is sent to your phone."
                        />
                        <MethodCard
                            active={method === "CARD"}
                            onClick={() => setMethod("CARD")}
                            icon={<CreditCard size={18} />}
                            title="Visa / Mastercard"
                            sub="Secure hosted checkout."
                        />
                    </div>

                    {method === "MPESA" && (
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                M-Pesa number *
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setPhoneError("");
                                }}
                                placeholder="07XX XXX XXX"
                                inputMode="tel"
                                className={`w-full rounded-lg border ${phoneError ? "border-destructive" : "border-border"
                                    } bg-background px-4 py-2.5 text-foreground focus:border-primary-deep focus:outline-none focus:ring-2 focus:ring-primary-deep/20`}
                            />
                            {phoneError && (
                                <p className="mt-1 text-sm text-destructive">{phoneError}</p>
                            )}
                            <p className="mt-2 text-xs text-muted-foreground">
                                You will receive an STK push for KES {total.toLocaleString()}.
                            </p>
                        </div>
                    )}

                    {method === "CARD" && (
                        <div className="rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
                            You will be redirected to a secure hosted checkout to enter your card
                            details. Card information never touches our servers.
                        </div>
                    )}
                </>
            ) : (
                <PaymentStatusPanel
                    phase={phase}
                    reference={reference}
                    customerMessage={customerMessage}
                    failureReason={failureReason}
                    secondsLeft={secondsLeft}
                    onRetry={retry}
                />
            )}

            <div className="flex items-center justify-between gap-4 pt-4">
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-transparent px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
                >
                    <ChevronLeft className="size-4" />
                    Previous
                </button>
                {(phase === "idle" || phase === "initiating") && (
                    <button
                        type="submit"
                        disabled={busy}
                        className="inline-flex items-center gap-2 rounded-full bg-primary-deep px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-deep/90 disabled:opacity-50"
                    >
                        {phase === "initiating" ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                {method === "CARD" ? "Redirecting…" : "Sending prompt…"}
                            </>
                        ) : (
                            <>
                                Pay KES {total.toLocaleString()}
                                <Check className="size-4" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </form>
    );
}

function TierList({
    heading,
    tiers,
    activeLabel,
}: {
    heading: string;
    tiers: CampPricing["tiers"];
    activeLabel: string | null;
}) {
    return (
        <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {heading}
            </p>
            <ul className="space-y-2 text-sm text-foreground">
                {tiers.map((tier) => {
                    const active = tier.label === activeLabel;
                    return (
                        <li
                            key={`${tier.attendeeType}-${tier.label}`}
                            className={`flex items-center justify-between rounded-md px-2 py-1 ${active ? "bg-primary-soft" : ""
                                }`}
                        >
                            <span className={active ? "font-medium" : ""}>
                                {tier.label}
                                <span className="ml-2 text-xs text-muted-foreground">
                                    {tier.effectiveTo
                                        ? `until ${tier.effectiveTo}`
                                        : `from ${tier.effectiveFrom}`}
                                </span>
                                {active && (
                                    <span className="ml-2 text-xs font-semibold text-primary-deep">
                                        applies now
                                    </span>
                                )}
                            </span>
                            <span className="font-semibold">
                                KES {tier.amountKes.toLocaleString()}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function MethodCard({
    active,
    onClick,
    icon,
    title,
    sub,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    sub: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-2xl border p-5 text-left transition ${active
                ? "border-primary-deep bg-background ring-1 ring-primary-deep"
                : "border-border bg-card hover:border-primary-deep"
                }`}
        >
            <span className="flex items-center gap-2.5 font-semibold text-foreground">
                {icon} {title}
            </span>
            <span className="mt-2 block text-sm text-muted-foreground">{sub}</span>
        </button>
    );
}

function derivePhone(data: Partial<GriefCampApplicationData>) {
    const match = /(\+?254\d{9}|0\d{9})/.exec(
        data.registration?.phoneAndEmail ?? "",
    );
    return match ? match[1] : "";
}
